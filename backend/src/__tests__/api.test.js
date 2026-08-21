import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("API Endpoints", () => {
  it("GET / should return root API metadata", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("project", "DSA Pattern Finder API");
    expect(res.body.endpoints).toHaveProperty("analyze");
  });

  it("GET /health should return 200 status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", service: "DSA Pattern Finder API" });
  });

  it("POST /analyze should analyze raw problem text successfully", async () => {
    const res = await request(app)
      .post("/analyze")
      .send({
        problem: "Given a sorted array of integers nums and a target, search for target using binary search in log n time."
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("input");
    expect(res.body).toHaveProperty("analysis");
    expect(res.body.analysis.decision.primaryPattern).toBe("Binary Search");
  });

  it("POST /analyze should return 400 error when problem and url are missing", async () => {
    const res = await request(app).post("/analyze").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Problem text or URL required");
  });

  it("POST /analyze should return 400 for malformed URL", async () => {
    const res = await request(app)
      .post("/analyze")
      .send({ url: "https://invalid-website.com/test" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Only LeetCode problem URLs are supported");
  });
});
