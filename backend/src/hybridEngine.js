import { extractSignals } from "./extractSignals.js";
import { scorePatterns } from "./patternScorer.js";
import { buildDecision } from "./decisionEngine.js";
import { mlClassifier } from "./ml/mlClassifier.js";

/**
 * Hybrid Classifier Engine
 * Combines Heuristic Rule Scoring + TF-IDF ML Cosine Similarity
 * 
 * @param {string} problemText 
 * @param {number} heuristicWeight Weight for rule engine (default: 0.5)
 */
export function analyzeHybrid(problemText, heuristicWeight = 0.5) {
  // 1. Run Rule-Based Heuristic Engine
  const signals = extractSignals(problemText);
  const heuristicRanked = scorePatterns(signals);
  const heuristicDecision = buildDecision(signals, heuristicRanked);

  // 2. Run TF-IDF Cosine Similarity ML Classifier
  const mlDecision = mlClassifier.predict(problemText);

  // 3. Fuse Probabilities (Ensemble Weighted Average)
  const mlWeight = 1 - heuristicWeight;
  const combinedProbabilities = {};

  const allPatterns = [
    "Sliding Window",
    "Two Pointers",
    "Prefix Sum",
    "Binary Search",
    "Dynamic Programming",
    "Graph",
    "Backtracking",
    "Greedy"
  ];

  let topPattern = "Unknown";
  let maxCombinedProb = -1;

  for (const pattern of allPatterns) {
    const heurProb = heuristicDecision.patternProbabilities[pattern] || 0;
    const mlProb = mlDecision.patternProbabilities[pattern] || 0;

    const hybridProb = Number((heuristicWeight * heurProb + mlWeight * mlProb).toFixed(2));
    combinedProbabilities[pattern] = hybridProb;

    if (hybridProb > maxCombinedProb) {
      maxCombinedProb = hybridProb;
      topPattern = pattern;
    }
  }

  // Fallback to Unknown if confidence is extremely low
  if (maxCombinedProb < 0.1) {
    topPattern = "Unknown";
    maxCombinedProb = 0;
  }

  return {
    primaryPattern: topPattern,
    confidence: maxCombinedProb,
    patternProbabilities: combinedProbabilities,
    why: heuristicDecision.why,
    thinkingSteps: heuristicDecision.thinkingSteps,
    heuristicsAnalysis: {
      primaryPattern: heuristicDecision.primaryPattern,
      confidence: heuristicDecision.confidence,
      probabilities: heuristicDecision.patternProbabilities
    },
    mlAnalysis: {
      primaryPattern: mlDecision.primaryPattern,
      confidence: mlDecision.confidence,
      probabilities: mlDecision.patternProbabilities
    }
  };
}
