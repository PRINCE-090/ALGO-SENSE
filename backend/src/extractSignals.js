import { PATTERN_RULES } from "./config/patternsConfig.js";

export function extractSignals(problemText) {
  const text = problemText.toLowerCase();

  const signals = {
    text,

    hasArray:
      text.includes("array") ||
      text.includes("nums") ||
      text.includes("grid") ||
      text.includes("matrix") ||
      text.includes("numbers"),

    mentionsSubarray:
      text.includes("subarray") ||
      text.includes("substring") ||
      text.includes("contiguous"),

    mentionsK:
      text.includes(" k") ||
      text.includes("size k") ||
      text.includes("k elements") ||
      text.includes("k length"),

    isSorted:
      text.includes("sorted") ||
      text.includes("non-decreasing") ||
      text.includes("increasing order") ||
      text.includes("monotonically"),

    optimizationWords: [
      "maximum",
      "minimum",
      "largest",
      "smallest",
      "optimal",
      "maximize",
      "minimize"
    ].filter(w => text.includes(w)),

    // Strict Binary Search keywords (excludes generic 'target')
    searchWords: [
      "search",
      "binary search",
      "search target",
      "log n",
      "logn",
      "lower bound",
      "upper bound",
      "peak",
      "first occurrence",
      "last occurrence",
      "search index",
      "threshold",
      "bisect"
    ].filter(w => text.includes(w)),

    prefixSumHints: text.includes("prefix sum") || text.includes("range sum") || text.includes("cumulative sum"),
    twoPointerHints: hasPatternKeywords("two_pointers", text) || text.includes("two numbers") || text.includes("pair"),
    slidingWindowHints: hasPatternKeywords("sliding_window", text),
    dpHints: hasPatternKeywords("dynamic_programming", text),
    graphHints: hasPatternKeywords("graph", text),
    backtrackingHints: hasPatternKeywords("backtracking", text),
    greedyHints: hasPatternKeywords("greedy", text)
  };

  return signals;
}

function hasPatternKeywords(patternId, text) {
  const pattern = PATTERN_RULES.find(p => p.id === patternId);
  if (!pattern) return false;
  return pattern.keywords.some(kw => text.includes(kw));
}