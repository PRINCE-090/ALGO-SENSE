import fetch from "node-fetch";

export async function fetchProblemFromUrl(url) {
  if (!url || typeof url !== "string" || !url.trim()) {
    const err = new Error("URL must be a valid non-empty string");
    err.statusCode = 400;
    throw err;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url.trim());
  } catch (e) {
    const err = new Error("Invalid URL format. Please enter a valid URL (e.g. https://leetcode.com/problems/two-sum/)");
    err.statusCode = 400;
    throw err;
  }

  if (!parsedUrl.hostname.includes("leetcode.com")) {
    const err = new Error("Only LeetCode problem URLs are supported (e.g. https://leetcode.com/problems/two-sum/)");
    err.statusCode = 400;
    throw err;
  }

  const match = parsedUrl.pathname.match(/\/problems\/([a-zA-Z0-9-]+)/);
  if (!match || !match[1]) {
    const err = new Error(
      "Invalid LeetCode problem URL format. Expected: https://leetcode.com/problems/<problem-slug>/"
    );
    err.statusCode = 400;
    throw err;
  }

  const slug = match[1];

  let response;
  try {
    response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              content
              title
            }
          }
        `,
        variables: { titleSlug: slug }
      })
    });
  } catch (fetchErr) {
    const err = new Error(`Failed to connect to LeetCode API: ${fetchErr.message}`);
    err.statusCode = 502;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`LeetCode API returned HTTP ${response.status}`);
    err.statusCode = response.status;
    throw err;
  }

  const data = await response.json();

  if (!data.data || !data.data.question || !data.data.question.content) {
    const err = new Error(`Problem '${slug}' not found on LeetCode`);
    err.statusCode = 404;
    throw err;
  }

  const html = data.data.question.content;
  const text = html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

  return text;
}