import { PATTERN_RULES } from "./config/patternsConfig.js";

export function buildDecision(signals, rankedPatterns) {
  const primary = rankedPatterns[0];
  const total = rankedPatterns.reduce((sum, p) => sum + p.score, 0); 
  const probabilities = {};

  for (const p of rankedPatterns) {
    probabilities[p.pattern] = total === 0 ? 0 : Number((p.score / total).toFixed(2));
  }

  const confidence = total === 0 ? 0 : Number((primary.score / total).toFixed(2));

  // Find matching pattern rule definition from config
  const matchedRule = PATTERN_RULES.find(r => r.name === primary.pattern);

  if (primary.score < 1 || !matchedRule) {
    return {
      primaryPattern: "Unknown",
      confidence: 0,
      patternProbabilities: probabilities,
      why: ["Not enough signals detected to make a high-confidence recommendation"],
      thinkingSteps: [
        "Read problem statement carefully",
        "Try brute force approach to identify problem bounds",
        "Look for array, graph, DP, search, or backtracking signals"
      ]
    };
  }

  return {
    primaryPattern: primary.pattern,
    confidence,
    patternProbabilities: probabilities,

    why: (() => {
      const reasons = [];

      // Collect matched reasons from pattern scorer
      if (primary.matchedReasons && primary.matchedReasons.length > 0) {
        reasons.push(...primary.matchedReasons);
      }

      if (signals.optimizationWords && signals.optimizationWords.length > 0) {
        reasons.push(`Optimization goal detected (${signals.optimizationWords.join(", ")})`);
      }

      if (reasons.length === 0) {
        reasons.push(`${primary.pattern} detected based on keyword and structural scoring rules`);
      }

      return reasons;
    })(),

    thinkingSteps: matchedRule.thinkingSteps || [
      "Understand problem constraints",
      "Try brute force approach",
      "Optimize using suitable pattern"
    ]
  };
}