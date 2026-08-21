import { describe, it, expect } from "vitest";
import { mlClassifier } from "../ml/mlClassifier.js";
import { analyzeHybrid } from "../hybridEngine.js";

describe("TfIdfClassifier (ML Layer)", () => {
  it("should classify binary search problem correctly", () => {
    const text = "Given a sorted array of distinct integers nums and a target value, search for target using binary search in log n time.";
    const result = mlClassifier.predict(text);

    expect(result.primaryPattern).toBe("Binary Search");
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.patternProbabilities).toHaveProperty("Binary Search");
  });

  it("should classify dynamic programming problem correctly", () => {
    const text = "Return the length of the longest common subsequence of two strings using dynamic programming memoization.";
    const result = mlClassifier.predict(text);

    expect(result.primaryPattern).toBe("Dynamic Programming");
  });

  it("should classify backtracking problem correctly", () => {
    const text = "Given an array of distinct integers, return all possible permutations using recursive backtracking.";
    const result = mlClassifier.predict(text);

    expect(result.primaryPattern).toBe("Backtracking");
  });
});

describe("analyzeHybrid (Hybrid Ensemble Engine)", () => {
  it("should perform hybrid classification combining heuristics and ML", () => {
    const text = "Given an array of integers nums and an integer k, find the maximum sum of any contiguous subarray of size k using sliding window.";
    const hybrid = analyzeHybrid(text, 0.5);

    expect(hybrid.primaryPattern).toBe("Sliding Window");
    expect(hybrid.confidence).toBeGreaterThan(0);
    expect(hybrid).toHaveProperty("heuristicsAnalysis");
    expect(hybrid).toHaveProperty("mlAnalysis");
    expect(hybrid.why.length).toBeGreaterThan(0);
    expect(hybrid.thinkingSteps.length).toBeGreaterThan(0);
  });
});
