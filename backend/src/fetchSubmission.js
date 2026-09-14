import fetch from "node-fetch";

/**
 * Fetch Accepted Solution from LeetCode Submission API
 * Prioritizes official LeetCode GraphQL submission endpoint over brittle DOM scraping.
 */
export async function fetchAcceptedSubmission({ slug, sessionCookie = "" }) {
  if (!slug || typeof slug !== "string") {
    throw new Error("Problem slug is required to fetch submission");
  }

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": `https://leetcode.com/problems/${slug}/`
  };

  if (sessionCookie) {
    headers["Cookie"] = sessionCookie;
  }

  // 1. Query latest submissions for question slug
  const listQuery = `
    query questionSubmissionList($questionSlug: String!, $offset: Int!, $limit: Int!) {
      questionSubmissionList(
        questionSlug: $questionSlug
        offset: $offset
        limit: $limit
      ) {
        submissions {
          id
          statusDisplay
          lang
          runtime
          timestamp
          memory
        }
      }
    }
  `;

  let listRes;
  try {
    listRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: listQuery,
        variables: { questionSlug: slug, offset: 0, limit: 10 }
      })
    });
  } catch (err) {
    throw new Error(`Failed to reach LeetCode submission API: ${err.message}`);
  }

  if (!listRes.ok) {
    throw new Error(`LeetCode API returned HTTP ${listRes.status}`);
  }

  const listData = await listRes.json();
  const submissions = listData?.data?.questionSubmissionList?.submissions || [];

  const acceptedSub = submissions.find(s => s.statusDisplay === "Accepted") || submissions[0];

  if (!acceptedSub) {
    throw new Error(`No accepted submission found for '${slug}'. Ensure you have submitted code on LeetCode.`);
  }

  // 2. Fetch full submission code details
  const detailQuery = `
    query submissionDetails($submissionId: Int!) {
      submissionDetails(submissionId: $submissionId) {
        code
        timestamp
        statusDisplay
        lang {
          name
          verboseName
        }
        runtime
        memory
      }
    }
  `;

  const detailRes = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: detailQuery,
      variables: { submissionId: Number(acceptedSub.id) }
    })
  });

  const detailData = await detailRes.json();
  const details = detailData?.data?.submissionDetails;

  if (!details || !details.code) {
    throw new Error("Unable to retrieve submission source code. Authentication may be required.");
  }

  return {
    submissionId: acceptedSub.id,
    code: details.code,
    language: details.lang?.name || acceptedSub.lang,
    status: details.statusDisplay,
    runtime: details.runtime,
    memory: details.memory
  };
}
