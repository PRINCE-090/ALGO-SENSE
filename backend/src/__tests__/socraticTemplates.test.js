import { describe, it, expect } from "vitest";
import { SOCRATIC_TEMPLATES } from "../../extension/socraticTemplates.js";

describe("Socratic Reasoning Templates", () => {
  const requiredPatterns = [
    "Binary Search",
    "Two Pointers",
    "Sliding Window",
    "Dynamic Programming",
    "Graph",
    "Backtracking",
    "Greedy",
    "Prefix Sum",
    "Unknown"
  ];

  it("should contain Socratic templates for all supported pattern categories", () => {
    for (const pattern of requiredPatterns) {
      expect(SOCRATIC_TEMPLATES).toHaveProperty(pattern);
      expect(Array.isArray(SOCRATIC_TEMPLATES[pattern])).toBe(true);
      expect(SOCRATIC_TEMPLATES[pattern].length).toBeGreaterThanOrEqual(3);
    }
  });

  it("should contain valid non-empty string questions for each pattern", () => {
    for (const pattern in SOCRATIC_TEMPLATES) {
      SOCRATIC_TEMPLATES[pattern].forEach(question => {
        expect(typeof question).toBe("string");
        expect(question.length).toBeGreaterThan(10);
      });
    }
  });
});
