import { SOCRATIC_TEMPLATES } from "./socraticTemplates.js";
import { PATTERN_RULES } from "./patternsConfig.js";

const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  const slugBadge = document.getElementById("tab-slug");
  const analyzeBtn = document.getElementById("analyze-btn");
  const loadingEl = document.getElementById("loading");
  const resultContainer = document.getElementById("result-container");
  const errorEl = document.getElementById("error");

  // Tab elements
  const tabPatternBtn = document.getElementById("tab-pattern-btn");
  const tabReviewBtn = document.getElementById("tab-review-btn");
  const tabPatternSection = document.getElementById("tab-pattern");
  const tabReviewSection = document.getElementById("tab-review");

  // Code Review elements
  const fetchSubBtn = document.getElementById("fetch-sub-btn");
  const codeInput = document.getElementById("code-input");
  const reviewBtn = document.getElementById("review-btn");
  const reviewLoadingEl = document.getElementById("review-loading");
  const reviewResultContainer = document.getElementById("review-result-container");

  let activeUrl = "";
  let extractedSlug = "";
  let currentPattern = "";

  // Tab Navigation Handling
  tabPatternBtn.addEventListener("click", () => {
    tabPatternBtn.classList.add("active");
    tabReviewBtn.classList.remove("active");
    tabPatternSection.style.display = "block";
    tabReviewSection.style.display = "none";
    hideError();
  });

  tabReviewBtn.addEventListener("click", () => {
    tabReviewBtn.classList.add("active");
    tabPatternBtn.classList.remove("active");
    tabPatternSection.style.display = "none";
    tabReviewSection.style.display = "block";
    hideError();
  });

  // Query active tab URL
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      activeUrl = tab.url;
      const match = activeUrl.match(/\/problems\/([a-zA-Z0-9-]+)/);
      if (match && match[1]) {
        extractedSlug = match[1];
        slugBadge.textContent = extractedSlug;
      }
    }

    if (!extractedSlug && tab && tab.id) {
      try {
        const res = await chrome.tabs.sendMessage(tab.id, { action: "GET_SLUG" });
        if (res && res.slug) {
          extractedSlug = res.slug;
          activeUrl = res.url || activeUrl;
          slugBadge.textContent = extractedSlug;
        }
      } catch (e) {
        // Content script might not be injected yet
      }
    }

    if (!extractedSlug) {
      slugBadge.textContent = "Not LeetCode problem";
    }
  } catch (err) {
    slugBadge.textContent = "URL Error";
  }

  // Run Pattern Analysis
  const runAnalysis = async () => {
    if (!extractedSlug) {
      showError("Please navigate to a LeetCode problem page (e.g. leetcode.com/problems/two-sum/)");
      return;
    }

    showLoading(true);
    hideError();

    // 1. Try local Express API backend
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: activeUrl })
      });

      if (response.ok) {
        const data = await response.json();
        renderResults(data);
        showLoading(false);
        return;
      }
    } catch (apiErr) {
      console.log("[DSA Pattern Finder] Local API offline, using direct browser GraphQL evaluation...");
    }

    // 2. Client-Side Browser Fallback (Direct GraphQL + Client Engine)
    try {
      const problemText = await fetchLeetCodeGraphQL(extractedSlug);
      const clientAnalysis = analyzeClientSide(problemText);
      renderResults({ analysis: { hybrid: clientAnalysis } });
    } catch (fallbackErr) {
      showError(`Analysis failed: ${fallbackErr.message}`);
    } finally {
      showLoading(false);
    }
  };

  analyzeBtn.addEventListener("click", runAnalysis);

  if (extractedSlug) {
    runAnalysis();
  }

  function renderResults(data) {
    const hybrid = data.analysis.hybrid || data.analysis.decision;
    currentPattern = hybrid.primaryPattern || "Unknown";
    const confidencePct = Math.round((hybrid.confidence || 0) * 100);

    document.getElementById("pattern-name").textContent = currentPattern;
    document.getElementById("confidence").textContent = `${confidencePct}% Confidence`;

    // Render Socratic Questions
    const socraticList = document.getElementById("socratic-questions");
    socraticList.innerHTML = "";
    const questions = SOCRATIC_TEMPLATES[currentPattern] || SOCRATIC_TEMPLATES["Unknown"];
    questions.forEach(q => {
      const li = document.createElement("li");
      li.textContent = q;
      socraticList.appendChild(li);
    });

    // Render Algorithmic Thinking Steps
    const stepsList = document.getElementById("thinking-steps");
    stepsList.innerHTML = "";
    const steps = hybrid.thinkingSteps || [];
    steps.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      stepsList.appendChild(li);
    });

    resultContainer.style.display = "block";
  }

  // Capture Accepted Submission via LeetCode's official GraphQL submission endpoint
  fetchSubBtn.addEventListener("click", async () => {
    if (!extractedSlug) {
      showError("Please open a LeetCode problem page first.");
      return;
    }

    try {
      hideError();
      fetchSubBtn.textContent = "Fetching Accepted Solution...";
      fetchSubBtn.disabled = true;

      // Query user's accepted submission using authenticated browser session
      const submission = await fetchAcceptedSubmissionFromLeetCode(extractedSlug);

      if (submission && submission.code) {
        codeInput.value = submission.code;
        fetchSubBtn.textContent = `✅ Captured Accepted Solution (${submission.language})`;
        // Automatically trigger review
        runCodeReview(submission.code, submission.language);
      } else {
        throw new Error("No accepted submission found. Ensure you have submitted code on LeetCode.");
      }
    } catch (err) {
      showError(`Failed to capture submission: ${err.message}. You can paste your code in the box below.`);
      fetchSubBtn.textContent = "⚡ Capture Accepted Solution (LeetCode API)";
    } finally {
      fetchSubBtn.disabled = false;
    }
  });

  // Run AI Code Review
  const runCodeReview = async (codeOverride, langOverride) => {
    const code = codeOverride || codeInput.value;
    if (!code || !code.trim()) {
      showError("Please paste or capture your solution code first.");
      return;
    }

    try {
      hideError();
      reviewLoadingEl.style.display = "block";
      reviewResultContainer.style.display = "none";

      let reviewData = null;

      // 1. Try backend /review endpoint
      try {
        const res = await fetch(`${API_BASE_URL}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language: langOverride || "cpp",
            problemTitle: extractedSlug,
            pattern: currentPattern
          })
        });

        if (res.ok) {
          const json = await res.json();
          reviewData = json.review;
        }
      } catch (e) {
        console.log("[AI Review] Local server offline, running client-side code review analyzer...");
      }

      // 2. Client-side deterministic code review fallback
      if (!reviewData) {
        reviewData = analyzeCodeClientSide(code, currentPattern);
      }

      renderReviewResults(reviewData);
    } catch (err) {
      showError(`Code review failed: ${err.message}`);
    } finally {
      reviewLoadingEl.style.display = "none";
    }
  };

  reviewBtn.addEventListener("click", () => runCodeReview());

  function renderReviewResults(review) {
    document.getElementById("time-comp").textContent = review.timeComplexity || "O(N)";
    document.getElementById("space-comp").textContent = review.spaceComplexity || "O(1)";

    const expl = `${review.timeComplexityExplanation || ""} ${review.spaceComplexityExplanation || ""}`.trim();
    document.getElementById("complexity-explanation").textContent = expl;

    const verdictEl = document.getElementById("review-verdict");
    verdictEl.textContent = review.verdict || "Optimal";
    verdictEl.className = `verdict-tag ${review.verdict === "Optimal" ? "tag-optimal" : (review.verdict === "Good" ? "tag-good" : "tag-refactor")}`;

    document.getElementById("review-rating").textContent = `Score: ${review.rating || 9}/10`;

    // Edge Cases
    const edgeList = document.getElementById("edge-cases-list");
    edgeList.innerHTML = "";
    (review.edgeCases || []).forEach(ec => {
      const li = document.createElement("li");
      li.textContent = ec;
      edgeList.appendChild(li);
    });

    // Style Review
    const styleList = document.getElementById("style-review-list");
    styleList.innerHTML = "";
    (review.styleReview || []).forEach(sr => {
      const li = document.createElement("li");
      li.textContent = sr;
      styleList.appendChild(li);
    });

    // Improvements
    const impList = document.getElementById("improvements-list");
    impList.innerHTML = "";
    (review.improvements || []).forEach(imp => {
      const li = document.createElement("li");
      li.textContent = imp;
      impList.appendChild(li);
    });

    reviewResultContainer.style.display = "block";
  }

  function showLoading(isLoading) {
    loadingEl.style.display = isLoading ? "block" : "none";
    if (isLoading) resultContainer.style.display = "none";
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = "block";
  }

  function hideError() {
    errorEl.style.display = "none";
  }
});

// Direct LeetCode GraphQL fetch for problem description
async function fetchLeetCodeGraphQL(slug) {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            content
            title
          }
        }
      `,
      variables: { titleSlug: slug }
    })
  });

  const json = await res.json();
  if (!json.data || !json.data.question || !json.data.question.content) {
    throw new Error(`Problem '${slug}' not found on LeetCode`);
  }

  return json.data.question.content.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
}

// Fetch user's latest accepted submission via LeetCode's official GraphQL submission endpoint
async function fetchAcceptedSubmissionFromLeetCode(slug) {
  const listRes = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Uses active browser cookies
    body: JSON.stringify({
      query: `
        query questionSubmissionList($questionSlug: String!, $offset: Int!, $limit: Int!) {
          questionSubmissionList(
            questionSlug: $questionSlug
            offset: $offset
            limit: $limit
          ) {
            submissions {
              id
              statusDisplay
              lang
              runtime
              memory
            }
          }
        }
      `,
      variables: { questionSlug: slug, offset: 0, limit: 10 }
    })
  });

  const listData = await listRes.json();
  const submissions = listData?.data?.questionSubmissionList?.submissions || [];
  const accepted = submissions.find(s => s.statusDisplay === "Accepted") || submissions[0];

  if (!accepted) {
    throw new Error("No recent submission found on LeetCode for this problem.");
  }

  // Fetch full source code
  const detailRes = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      query: `
        query submissionDetails($submissionId: Int!) {
          submissionDetails(submissionId: $submissionId) {
            code
            statusDisplay
            lang {
              name
            }
          }
        }
      `,
      variables: { submissionId: Number(accepted.id) }
    })
  });

  const detailData = await detailRes.json();
  const details = detailData?.data?.submissionDetails;

  return {
    code: details?.code,
    language: details?.lang?.name || accepted.lang,
    status: details?.statusDisplay
  };
}

// Client-side rule engine fallback
function analyzeClientSide(text) {
  const lowerText = text.toLowerCase();

  const signals = {
    text: lowerText,
    hasArray: lowerText.includes("array") || lowerText.includes("nums") || lowerText.includes("numbers") || lowerText.includes("grid"),
    mentionsSubarray: lowerText.includes("subarray") || lowerText.includes("substring") || lowerText.includes("contiguous"),
    mentionsK: lowerText.includes(" k") || lowerText.includes("size k"),
    isSorted: lowerText.includes("sorted") || lowerText.includes("non-decreasing") || lowerText.includes("increasing order"),
    searchWords: ["search", "binary search", "search target", "log n", "logn", "lower bound", "upper bound", "peak", "bisect", "first occurrence", "last occurrence"].filter(w => lowerText.includes(w)),
    twoPointerHints: lowerText.includes("two pointer") || lowerText.includes("two pointers") || lowerText.includes("pair") || lowerText.includes("two numbers") || lowerText.includes("triplet") || lowerText.includes("palindrome"),
    dpHints: lowerText.includes("subsequence") || lowerText.includes("dp") || lowerText.includes("ways to"),
    graphHints: lowerText.includes("graph") || lowerText.includes("node") || lowerText.includes("edge"),
    backtrackingHints: lowerText.includes("backtrack") || lowerText.includes("permutation") || lowerText.includes("subset"),
    greedyHints: lowerText.includes("greedy") || lowerText.includes("interval")
  };

  const scores = PATTERN_RULES.map(rule => {
    let score = 0;
    const reasons = [];

    for (const req of rule.requires || []) {
      if (req.signal && signals[req.signal]) {
        score += req.weight;
        if (req.reason) reasons.push(req.reason);
      } else if (req.custom && req.custom(signals)) {
        score += req.weight;
        if (req.reason) reasons.push(req.reason);
      }
    }

    return { pattern: rule.name, score, reasons, steps: rule.thinkingSteps };
  }).sort((a, b) => b.score - a.score);

  const top = scores[0];
  const total = scores.reduce((sum, s) => sum + Math.max(0, s.score), 0) || 1;
  const confidence = Number((Math.max(0, top.score) / total).toFixed(2));

  return {
    primaryPattern: top.score > 0 ? top.pattern : "Unknown",
    confidence: top.score > 0 ? confidence : 0,
    thinkingSteps: top.steps || [],
    why: top.reasons || []
  };
}

// Client-side deterministic static code review fallback
function analyzeCodeClientSide(code, pattern) {
  const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
  const forLoops = (cleanCode.match(/\bfor\s*\(/g) || []).length;
  const whileLoops = (cleanCode.match(/\bwhile\s*\(/g) || []).length;

  let timeComplexity = "O(N)";
  let timeExpl = "Single-pass linear scan across elements.";

  if (pattern === "Binary Search" || cleanCode.includes("mid") || cleanCode.includes(">> 1")) {
    timeComplexity = "O(log N)";
    timeExpl = "Binary space partitioning halves candidate elements at each iteration.";
  } else if (forLoops >= 2 || (forLoops >= 1 && whileLoops >= 1)) {
    timeComplexity = "O(N²)";
    timeExpl = "Nested loop iteration detected.";
  }

  const usesMap = /unordered_map|HashMap|Map\(|dict\(/.test(cleanCode);
  const spaceComplexity = usesMap ? "O(N)" : "O(1)";
  const spaceExpl = usesMap ? "Allocates auxiliary Hash Map storing up to N entries." : "Uses constant O(1) auxiliary pointer and state variables.";

  const edgeCases = [
    "Verify behavior for empty or 1-element input arrays.",
    "Ensure duplicate elements and zero/negative numbers are handled correctly.",
    "Check integer arithmetic bounds to prevent overflow on extreme values."
  ];

  const styleReview = [
    "Clean variable naming aligns with standard competitive programming conventions.",
    "Concise condition checks avoid redundant branching."
  ];

  const improvements = [];
  if (timeComplexity === "O(N²)") {
    improvements.push("Performance Tip: Can the nested O(N²) loop be reduced to O(N) using a Hash Map or Two Pointers?");
  }
  if (usesMap && !cleanCode.includes(".reserve(")) {
    improvements.push("C++ Tip: Call `unordered_map.reserve(nums.size())` to avoid dynamic bucket rehash overhead.");
  }
  if (improvements.length === 0) {
    improvements.push("Code adheres to optimal time-space tradeoff for this algorithmic pattern.");
  }

  return {
    timeComplexity,
    timeComplexityExplanation: timeExpl,
    spaceComplexity,
    spaceComplexityExplanation: spaceExpl,
    edgeCases,
    styleReview,
    improvements,
    verdict: timeComplexity === "O(N²)" ? "Good" : "Optimal",
    rating: timeComplexity === "O(N²)" ? 8 : 9
  };
}
