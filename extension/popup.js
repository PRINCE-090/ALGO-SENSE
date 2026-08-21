import { SOCRATIC_TEMPLATES } from "./socraticTemplates.js";
import { PATTERN_RULES } from "./patternsConfig.js";

const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  const slugBadge = document.getElementById("tab-slug");
  const analyzeBtn = document.getElementById("analyze-btn");
  const loadingEl = document.getElementById("loading");
  const resultContainer = document.getElementById("result-container");
  const errorEl = document.getElementById("error");

  let activeUrl = "";
  let extractedSlug = "";

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
      console.log("[DSA Pattern Finder] Local API unavailable, falling back to direct browser GraphQL evaluation...");
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
  } else {
    showLoading(false);
  }

  function renderResults(data) {
    const hybrid = data.analysis.hybrid || data.analysis.decision;
    const pattern = hybrid.primaryPattern || "Unknown";
    const confidencePct = Math.round((hybrid.confidence || 0) * 100);

    document.getElementById("pattern-name").textContent = pattern;
    document.getElementById("confidence").textContent = `${confidencePct}% Confidence`;

    // Render Socratic Questions
    const socraticList = document.getElementById("socratic-questions");
    socraticList.innerHTML = "";
    const questions = SOCRATIC_TEMPLATES[pattern] || SOCRATIC_TEMPLATES["Unknown"];
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

// Direct LeetCode GraphQL fetch from browser
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
