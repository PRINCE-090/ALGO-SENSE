import express from "express";
import { extractSignals } from "./extractSignals.js";
import { scorePatterns } from "./patternScorer.js";
import { buildDecision } from "./decisionEngine.js";
import { fetchProblemFromUrl } from "./fetchProblem.js";
import { analyzeHybrid } from "./hybridEngine.js";
import { reviewSolution } from "./services/aiReviewService.js";
import { fetchAcceptedSubmission } from "./fetchSubmission.js";
import { requestDeviceCode, pollDeviceToken, getGitHubUser, commitFileToGitHub } from "./services/githubService.js";
import { recordAttempt, getRecentAttempts, getAnalyticsStats } from "./services/dbService.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      callback(new Error("CORS policy violation: Origin not allowed"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.set("json spaces", 2);

app.get("/", (req, res) => {
  res.json({
    project: "DSA Pattern Finder API",
    description:
      "Analyze a DSA problem statement and detect the most likely algorithmic pattern using a hybrid Heuristic + TF-IDF ML Engine.",
    endpoints: {
      health: "GET /health",
      analyze: "POST /analyze"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "DSA Pattern Finder API"
  });
});

app.post("/analyze", async (req, res) => {
  let { problem, url } = req.body;

  try {
    if (url) {
      problem = await fetchProblemFromUrl(url);
    }

    if (!problem || typeof problem !== "string" || problem.trim().length === 0) {
      return res.status(400).json({
        error: "Problem text or URL required"
      });
    }

    const cleanedProblem = problem.trim();

    const signals = extractSignals(cleanedProblem);
    const rankedPatterns = scorePatterns(signals);
    const decision = buildDecision(signals, rankedPatterns);
    const hybrid = analyzeHybrid(cleanedProblem, 0.5);

    res.json({
      input: cleanedProblem.slice(0, 300),
      analysis: {
        signals,
        rankedPatterns,
        decision,
        hybrid
      }
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
});

app.post("/review", async (req, res) => {
  let { code, language = "cpp", problemTitle = "", problemDescription = "", pattern = "", slug, sessionCookie } = req.body;

  try {
    let submissionInfo = null;

    // If code is not explicitly sent, attempt to fetch user's accepted submission via LeetCode GraphQL
    if (!code && slug) {
      submissionInfo = await fetchAcceptedSubmission({ slug, sessionCookie });
      code = submissionInfo.code;
      language = submissionInfo.language || language;
    }

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        error: "Solution code or LeetCode problem slug required"
      });
    }

    const review = await reviewSolution({
      code,
      language,
      problemTitle,
      problemDescription,
      pattern
    });

    res.json({
      submission: submissionInfo,
      review
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
});

// --- GitHub OAuth & Contents API Routes ---
app.post("/api/github/device-code", async (req, res) => {
  try {
    const data = await requestDeviceCode();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/github/poll-token", async (req, res) => {
  const { device_code } = req.body;
  if (!device_code) {
    return res.status(400).json({ error: "device_code is required" });
  }
  try {
    const data = await pollDeviceToken(device_code);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/github/user", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Bearer token required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = await getGitHubUser(token);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/github/sync", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.body.token;

  if (!token) {
    return res.status(401).json({ error: "GitHub access token required. Authenticate with device flow first." });
  }

  const { owner = "me", repo = "leetcode-solutions", slug, title, language = "cpp", code, review, pattern } = req.body;

  if (!slug || !code) {
    return res.status(400).json({ error: "Problem slug and solution code are required for sync." });
  }

  try {
    const extMap = { cpp: "cpp", python: "py", python3: "py", java: "java", javascript: "js", typescript: "ts" };
    const fileExt = extMap[language.toLowerCase()] || "txt";

    // 1. Commit solution source file
    const codePath = `solutions/${slug}/solution.${fileExt}`;
    const codeCommit = await commitFileToGitHub({
      accessToken: token,
      owner,
      repo,
      path: codePath,
      content: code,
      message: `Sync Solution: ${title || slug} [${pattern || 'DSA'}]`
    });

    // 2. Commit markdown notes file
    let notesCommit = null;
    if (review) {
      const notesPath = `solutions/${slug}/README.md`;
      const notesContent = `# ${title || slug}

**Pattern:** ${pattern || 'Auto-Detected'}  
**Language:** ${language}

## Complexity Analysis
- **Time Complexity:** \`${review.timeComplexity || 'O(N)'}\` — ${review.timeComplexityExplanation || ''}
- **Space Complexity:** \`${review.spaceComplexity || 'O(1)'}\` — ${review.spaceComplexityExplanation || ''}
- **Verdict:** ${review.verdict || 'Optimal'} (${review.rating || 9}/10)

## Edge Cases Evaluated
${(review.edgeCases || []).map(ec => `- ${ec}`).join("\n")}

## Code Style & Idioms
${(review.styleReview || []).map(sr => `- ${sr}`).join("\n")}

## Optimization Recommendations
${(review.improvements || []).map(imp => `- ${imp}`).join("\n")}
`;

      notesCommit = await commitFileToGitHub({
        accessToken: token,
        owner,
        repo,
        path: notesPath,
        content: notesContent,
        message: `Add Notes & Complexity Analysis: ${title || slug}`
      });
    }

    // 3. Track attempt in database
    await recordAttempt({
      problem_slug: slug,
      problem_title: title || slug,
      pattern: pattern || "Unknown",
      confidence: review?.rating ? review.rating / 10 : 0.9,
      is_correct: true,
      time_complexity: review?.timeComplexity || "O(N)",
      space_complexity: review?.spaceComplexity || "O(1)",
      language,
      github_synced: true
    });

    res.json({
      success: true,
      codeCommit,
      notesCommit
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Analytics Database Routes ---
app.post("/api/analytics/track", async (req, res) => {
  try {
    const attempt = await recordAttempt(req.body);
    res.status(201).json(attempt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/analytics/stats", async (req, res) => {
  try {
    const stats = await getAnalyticsStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/analytics/history", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = await getRecentAttempts(limit);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
