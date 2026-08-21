import { describe, it, expect } from "vitest";
import { extractSignals } from "../extractSignals.js";

describe("extractSignals", () => {
  it("should extract array and subarray signals", () => {
    const text = "Given an array of integers nums, find the contiguous subarray with maximum sum.";
    const signals = extractSignals(text);

    expect(signals.hasArray).toBe(true);
    expect(signals.mentionsSubarray).toBe(true);
    expect(signals.optimizationWords).toContain("maximum");
  });

  it("should extract binary search keywords", () => {
    const text = "Search for a target value in a sorted array in O(log n) time.";
    const signals = extractSignals(text);

    expect(signals.isSorted).toBe(true);
    expect(signals.searchWords).toContain("search");
    expect(signals.searchWords).toContain("log n");
  });

  it("should extract backtracking hints", () => {
    const text = "Generate all possible permutations and combinations of a given set.";
    const signals = extractSignals(text);

    expect(signals.backtrackingHints).toBe(true);
  });

  it("should extract greedy hints", () => {
    const text = "Find the maximum number of non-overlapping intervals.";
    const signals = extractSignals(text);

    expect(signals.greedyHints).toBe(true);
  });

  it("should extract graph hints", () => {
    const text = "Find the shortest path between two nodes in a directed graph with edges.";
    const signals = extractSignals(text);

    expect(signals.graphHints).toBe(true);
  });
});
