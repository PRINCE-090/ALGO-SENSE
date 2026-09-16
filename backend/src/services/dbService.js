import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.join(__dirname, "../data/analytics_store.json");

let pool = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
    });
    console.log("[Database] Initialized PostgreSQL connection pool.");
    initPostgresSchema();
  } catch (err) {
    console.warn("[Database] Failed to connect to PostgreSQL, falling back to local store:", err.message);
    pool = null;
  }
}

async function initPostgresSchema() {
  if (!pool) return;
  const query = `
    CREATE TABLE IF NOT EXISTS attempts (
      id SERIAL PRIMARY KEY,
      problem_slug VARCHAR(255) NOT NULL,
      problem_title VARCHAR(255),
      pattern VARCHAR(100) NOT NULL,
      confidence REAL DEFAULT 0,
      is_correct BOOLEAN DEFAULT true,
      time_complexity VARCHAR(50),
      space_complexity VARCHAR(50),
      language VARCHAR(50) DEFAULT 'cpp',
      github_synced BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("[Database] PostgreSQL attempts table ready.");
  } catch (err) {
    console.error("[Database] Error creating PostgreSQL table:", err.message);
  }
}

// Local JSON Store Helper (for local development and Vitest without cloud DB)
function readLocalStore() {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      // Seed with initial realistic attempts so dashboard renders immediately with live data
      const seedData = [
        { id: 1, problem_slug: "two-sum", problem_title: "Two Sum", pattern: "Hash Table / Hash Map", confidence: 0.95, is_correct: true, time_complexity: "O(N)", space_complexity: "O(N)", language: "cpp", github_synced: true, created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
        { id: 2, problem_slug: "3sum", problem_title: "3Sum", pattern: "Two Pointers", confidence: 0.90, is_correct: true, time_complexity: "O(N²)", space_complexity: "O(1)", language: "cpp", github_synced: true, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
        { id: 3, problem_slug: "binary-search", problem_title: "Binary Search", pattern: "Binary Search", confidence: 0.98, is_correct: true, time_complexity: "O(log N)", space_complexity: "O(1)", language: "python", github_synced: true, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
        { id: 4, problem_slug: "longest-substring", problem_title: "Longest Substring Without Repeating", pattern: "Sliding Window", confidence: 0.88, is_correct: true, time_complexity: "O(N)", space_complexity: "O(min(N, M))", language: "javascript", github_synced: true, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
        { id: 5, problem_slug: "climbing-stairs", problem_title: "Climbing Stairs", pattern: "Dynamic Programming", confidence: 0.92, is_correct: true, time_complexity: "O(N)", space_complexity: "O(1)", language: "cpp", github_synced: false, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
        { id: 6, problem_slug: "daily-temperatures", problem_title: "Daily Temperatures", pattern: "Monotonic Stack", confidence: 0.94, is_correct: true, time_complexity: "O(N)", space_complexity: "O(N)", language: "cpp", github_synced: true, created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
        { id: 7, problem_slug: "kth-largest-element", problem_title: "Kth Largest Element", pattern: "Heap / Top-K", confidence: 0.91, is_correct: true, time_complexity: "O(N log K)", space_complexity: "O(K)", language: "cpp", github_synced: true, created_at: new Date().toISOString() }
      ];
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(seedData, null, 2), "utf-8");
      return seedData;
    }
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeLocalStore(data) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("[Local DB] Write error:", e.message);
  }
}

/**
 * Record a problem attempt
 */
export async function recordAttempt({
  problem_slug,
  problem_title = "",
  pattern,
  confidence = 0,
  is_correct = true,
  time_complexity = "O(N)",
  space_complexity = "O(1)",
  language = "cpp",
  github_synced = false
}) {
  if (pool) {
    const query = `
      INSERT INTO attempts (problem_slug, problem_title, pattern, confidence, is_correct, time_complexity, space_complexity, language, github_synced)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const res = await pool.query(query, [
      problem_slug,
      problem_title || problem_slug,
      pattern,
      confidence,
      is_correct,
      time_complexity,
      space_complexity,
      language,
      github_synced
    ]);
    return res.rows[0];
  }

  // Local fallback
  const items = readLocalStore();
  const newItem = {
    id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
    problem_slug,
    problem_title: problem_title || problem_slug,
    pattern,
    confidence,
    is_correct,
    time_complexity,
    space_complexity,
    language,
    github_synced,
    created_at: new Date().toISOString()
  };
  items.push(newItem);
  writeLocalStore(items);
  return newItem;
}

/**
 * Fetch recent attempts
 */
export async function getRecentAttempts(limit = 20) {
  if (pool) {
    const res = await pool.query("SELECT * FROM attempts ORDER BY created_at DESC LIMIT $1", [limit]);
    return res.rows;
  }
  const items = readLocalStore();
  return items.slice().reverse().slice(0, limit);
}

/**
 * Compute aggregated analytics and pattern mastery trends
 */
export async function getAnalyticsStats() {
  let attempts = [];
  if (pool) {
    const res = await pool.query("SELECT * FROM attempts ORDER BY created_at ASC");
    attempts = res.rows;
  } else {
    attempts = readLocalStore();
  }

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.is_correct).length;
  const overallAccuracy = totalAttempts > 0 ? Number(((correctAttempts / totalAttempts) * 100).toFixed(1)) : 0;
  const githubSyncedCount = attempts.filter(a => a.github_synced).length;

  // Pattern mastery stats
  const patternMap = {};
  attempts.forEach(a => {
    if (!patternMap[a.pattern]) {
      patternMap[a.pattern] = { pattern: a.pattern, attempts: 0, correct: 0 };
    }
    patternMap[a.pattern].attempts++;
    if (a.is_correct) patternMap[a.pattern].correct++;
  });

  const patternMastery = Object.values(patternMap).map(p => ({
    pattern: p.pattern,
    attempts: p.attempts,
    mastery: Number(((p.correct / p.attempts) * 100).toFixed(1))
  })).sort((a, b) => b.attempts - a.attempts);

  // Timeline Activity & Accuracy Trend (by date)
  const timelineMap = {};
  attempts.forEach(a => {
    const dateKey = a.created_at ? new Date(a.created_at).toISOString().split("T")[0] : "Recent";
    if (!timelineMap[dateKey]) {
      timelineMap[dateKey] = { date: dateKey, total: 0, correct: 0 };
    }
    timelineMap[dateKey].total++;
    if (a.is_correct) timelineMap[dateKey].correct++;
  });

  const timeline = Object.values(timelineMap).map(t => ({
    date: t.date,
    attempts: t.total,
    accuracy: Number(((t.correct / t.total) * 100).toFixed(1))
  }));

  // Top Mastered Pattern
  const topPattern = patternMastery.length > 0 ? patternMastery[0].pattern : "None";

  return {
    overview: {
      totalAttempts,
      correctAttempts,
      overallAccuracy,
      githubSyncedCount,
      topPattern
    },
    patternMastery,
    timeline
  };
}
