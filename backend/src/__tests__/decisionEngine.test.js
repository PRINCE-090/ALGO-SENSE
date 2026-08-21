import { describe, it, expect } from "vitest";
import { extractSignals } from "../extractSignals.js";
import { scorePatterns } from "../patternScorer.js";
import { buildDecision } from "../decisionEngine.js";

describe("buildDecision", () => {
  it("should build structured decision for valid problem text", () => {
    const text = "Given an array of integers nums, find the contiguous subarray with maximum sum using sliding window.";
    const signals = extractSignals(text);
    const ranked = scorePatterns(signals);
    const decision = buildDecision(signals, ranked);

    expect(decision.primaryPattern).toBe("Sliding Window");
    expect(decision.confidence).toBeGreaterThan(0);
    expect(decision.patternProbabilities).toHaveProperty("Sliding Window");
    expect(decision.why.length).toBeGreaterThan(0);
    expect(decision.thinkingSteps.length).toBeGreaterThan(0);
  });

  it("should return Unknown pattern if score is 0 / low signals", () => {
    const text = "Hello world random text with no DSA keywords";
    const signals = extractSignals(text);
    const ranked = scorePatterns(signals);
    const decision = buildDecision(signals, ranked);

    expect(decision.primaryPattern).toBe("Unknown");
    expect(decision.confidence).toBe(0);
    expect(decision.why).toContain("Not enough signals detected to make a high-confidence recommendation");
  });
});
