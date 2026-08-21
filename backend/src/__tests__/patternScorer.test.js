import { describe, it, expect } from "vitest";
import { extractSignals } from "../extractSignals.js";
import { scorePatterns } from "../patternScorer.js";

describe("scorePatterns", () => {
  it("should rank Sliding Window highest for subarray with size k problem", () => {
    const text = "Given an array of integers nums and an integer k, find the maximum sum of any contiguous subarray of size k using sliding window.";
    const signals = extractSignals(text);
    const ranked = scorePatterns(signals);

    expect(ranked[0].pattern).toBe("Sliding Window");
    expect(ranked[0].score).toBeGreaterThan(0);
  });

  it("should rank Two Pointers highest for sorted array pair sum problem", () => {
    const text = "Given a sorted array numbers, find two numbers that sum up to target using two pointers.";
    const signals = extractSignals(text);
    const ranked = scorePatterns(signals);

    expect(ranked[0].pattern).toBe("Two Pointers");
  });

  it("should rank Binary Search highest for sorted array log n search", () => {
    const text = "Given a sorted array of distinct integers nums and a target value, search for target using binary search in log n time.";
    const signals = extractSignals(text);
    const ranked = scorePatterns(signals);

    expect(ranked[0].pattern).toBe("Binary Search");
  });

  it("should rank Dynamic Programming highest for memoization subsequence problem", () => {
    const text = "Given two strings, return the length of their longest common subsequence using dynamic programming memoization.";
    const signals = extractSignals(text);
    const ranked = scorePatterns(signals);

    expect(ranked[0].pattern).toBe("Dynamic Programming");
  });

  it("should rank Graph highest for node edges traversal", () => {
    const text = "Given a directed graph with n nodes and edges, find if a path exists from source to destination using bfs traversal.";
    const signals = extractSignals(text);
    const ranked = scorePatterns(signals);

    expect(ranked[0].pattern).toBe("Graph");
  });
});
