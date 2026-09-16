import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GitHub OAuth Device Flow & Contents API", () => {
  let mockDeviceCode = "";
  let mockUserCode = "";
  let mockAccessToken = "";

  it("should generate device code and user verification uri", async () => {
    const res = await request(app).post("/api/github/device-code");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("device_code");
    expect(res.body).toHaveProperty("user_code");
    expect(res.body).toHaveProperty("verification_uri");

    mockDeviceCode = res.body.device_code;
    mockUserCode = res.body.user_code;
  });

  it("should poll for access token using device code", async () => {
    const res = await request(app)
      .post("/api/github/poll-token")
      .send({ device_code: mockDeviceCode });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token");
    mockAccessToken = res.body.access_token;
  });

  it("should fetch github profile for valid token", async () => {
    const res = await request(app)
      .get("/api/github/user")
      .set("Authorization", `Bearer ${mockAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("login");
  });

  it("should sync solution code and notes via Contents API", async () => {
    const res = await request(app)
      .post("/api/github/sync")
      .set("Authorization", `Bearer ${mockAccessToken}`)
      .send({
        owner: "test-user",
        repo: "dsa-solutions",
        slug: "two-sum",
        title: "Two Sum",
        language: "cpp",
        pattern: "Hash Table / Hash Map",
        code: "vector<int> twoSum(...) { ... }",
        review: {
          timeComplexity: "O(N)",
          spaceComplexity: "O(N)",
          verdict: "Optimal",
          rating: 9,
          edgeCases: ["Negative values handled"],
          styleReview: ["Clean naming"],
          improvements: ["Call reserve on map"]
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("codeCommit");
    expect(res.body).toHaveProperty("notesCommit");
  });
});

describe("Analytics Database API", () => {
  it("should record a problem attempt", async () => {
    const res = await request(app)
      .post("/api/analytics/track")
      .send({
        problem_slug: "search-in-rotated-sorted-array",
        problem_title: "Search in Rotated Sorted Array",
        pattern: "Binary Search",
        confidence: 0.96,
        is_correct: true,
        time_complexity: "O(log N)",
        space_complexity: "O(1)",
        language: "cpp",
        github_synced: true
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.problem_slug).toBe("search-in-rotated-sorted-array");
  });

  it("should fetch aggregated statistics and pattern mastery", async () => {
    const res = await request(app).get("/api/analytics/stats");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("overview");
    expect(res.body.overview.totalAttempts).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("patternMastery");
    expect(res.body.patternMastery.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("timeline");
  });

  it("should fetch recent attempts history", async () => {
    const res = await request(app).get("/api/analytics/history?limit=10");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
