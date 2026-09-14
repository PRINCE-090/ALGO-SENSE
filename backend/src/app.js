import express from "express";
import { extractSignals } from "./extractSignals.js";
import { scorePatterns } from "./patternScorer.js";
import { buildDecision } from "./decisionEngine.js";
import { fetchProblemFromUrl } from "./fetchProblem.js";
import { analyzeHybrid } from "./hybridEngine.js";
import { reviewSolution } from "./services/aiReviewService.js";
import { fetchAcceptedSubmission } from "./fetchSubmission.js";
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

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
