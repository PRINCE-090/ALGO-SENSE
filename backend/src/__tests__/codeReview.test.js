import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { generateHeuristicReview, reviewSolution } from "../services/aiReviewService.js";

describe("AI Code Review Service", () => {
  it("should analyze Time & Space complexity for Two Sum Hash Map solution", () => {
    const code = `
      vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
          int complement = target - nums[i];
          if (numMap.count(complement)) {
            return {numMap[complement], i};
          }
          numMap[nums[i]] = i;
        }
        return {};
      }
    `;

    const review = generateHeuristicReview({
      code,
      language: "cpp",
      problemTitle: "Two Sum",
      pattern: "Hash Table / Hash Map"
    });

    expect(review.timeComplexity).toBe("O(N)");
    expect(review.spaceComplexity).toBe("O(N)");
    expect(review.edgeCases.length).toBeGreaterThan(0);
    expect(review.styleReview.length).toBeGreaterThan(0);
    expect(review.improvements.length).toBeGreaterThan(0);
    expect(review.rating).toBeGreaterThanOrEqual(8);
  });

  it("should detect nested O(N^2) complexity and suggest optimization", () => {
    const code = `
      vector<int> twoSumBruteForce(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
          for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) return {i, j};
          }
        }
        return {};
      }
    `;

    const review = generateHeuristicReview({
      code,
      language: "cpp",
      problemTitle: "Two Sum",
      pattern: "Hash Table / Hash Map"
    });

    expect(review.timeComplexity).toBe("O(N²)");
    expect(review.improvements.some(imp => imp.includes("optimization") || imp.includes("Hash Map"))).toBe(true);
  });

  it("should review solution via reviewSolution export", async () => {
    const code = `
      def binarySearch(nums, target):
        low, high = 0, len(nums) - 1
        while low <= high:
          mid = (low + high) // 2
          if nums[mid] == target:
            return mid
          elif nums[mid] < target:
            low = mid + 1
          else:
            high = mid - 1
        return -1
    `;

    const review = await reviewSolution({
      code,
      language: "python",
      problemTitle: "Binary Search",
      pattern: "Binary Search"
    });

    expect(review.timeComplexity).toBe("O(log N)");
    expect(review.spaceComplexity).toBe("O(1)");
    expect(review.verdict).toBeDefined();
  });
});

describe("POST /review API Endpoint", () => {
  it("should return structured code review for valid code payload", async () => {
    const res = await request(app)
      .post("/review")
      .send({
        code: "int findMax(vector<int>& nums) { int m = nums[0]; for(int x : nums) m = max(m, x); return m; }",
        language: "cpp",
        problemTitle: "Find Maximum"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("review");
    expect(res.body.review).toHaveProperty("timeComplexity");
    expect(res.body.review).toHaveProperty("spaceComplexity");
    expect(res.body.review).toHaveProperty("edgeCases");
    expect(res.body.review).toHaveProperty("styleReview");
  });

  it("should return 400 when neither code nor slug is provided", async () => {
    const res = await request(app).post("/review").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
