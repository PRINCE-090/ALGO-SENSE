import { PATTERN_RULES } from "./config/patternsConfig.js";

export function scorePatterns(signals) {
  const patterns = PATTERN_RULES.map(rule => ({
    pattern: rule.name,
    score: 0,
    matchedReasons: []
  }));

  const get = name => patterns.find(p => p.pattern === name);

  for (const rule of PATTERN_RULES) {
    const item = get(rule.name);

    // Evaluate declarative requires rules
    for (const req of rule.requires || []) {
      if (req.signal && signals[req.signal]) {
        item.score += req.weight;
        if (req.reason && !item.matchedReasons.includes(req.reason)) {
          item.matchedReasons.push(req.reason);
        }
      } else if (req.custom && req.custom(signals)) {
        item.score += req.weight;
        if (req.reason && !item.matchedReasons.includes(req.reason)) {
          item.matchedReasons.push(req.reason);
        }
      }
    }

    // Evaluate declarative penalties
    for (const pen of rule.penalties || []) {
      if (pen.condition && pen.condition(signals)) {
        item.score += pen.weight; // weight is negative
      }
    }
  }

  // Ensure non-negative scores
  patterns.forEach(p => {
    if (p.score < 0) p.score = 0;
  });

  // Sort patterns descending by score
  patterns.sort((a, b) => b.score - a.score);

  return patterns;
}