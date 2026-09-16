import fetch from "node-fetch";

/**
 * GitHub Service
 * 1. Implements OAuth Device Flow brokered through Express backend
 *    (Client secret stays securely on backend; extension never stores raw PAT)
 * 2. Uses GitHub Contents API (PUT /repos/{owner}/{repo}/contents/{path})
 *    to auto-commit solutions and markdown notes.
 */

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "Iv23liSAMPLE_CLIENT_ID";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";

/**
 * Step 1 of Device Flow: Request user_code and device_code from GitHub
 */
export async function requestDeviceCode() {
  // If testing without credentials, return a mock device session
  if (!process.env.GITHUB_CLIENT_ID) {
    return {
      mock: true,
      device_code: "mock_device_code_" + Date.now(),
      user_code: "DSA-" + Math.floor(1000 + Math.random() * 9000),
      verification_uri: "https://github.com/login/device",
      expires_in: 900,
      interval: 5,
      message: "Development Mode: GITHUB_CLIENT_ID not set. Using test device flow."
    };
  }

  const response = await fetch("https://github.com/login/device/code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      scope: "repo read:user"
    })
  });

  if (!response.ok) {
    throw new Error(`GitHub Device Code Error: ${response.status} ${await response.text()}`);
  }

  return await response.json();
}

/**
 * Step 2 of Device Flow: Poll GitHub to check if user entered code
 */
export async function pollDeviceToken(deviceCode) {
  if (deviceCode && deviceCode.startsWith("mock_device_code_")) {
    return {
      access_token: "gho_mock_token_" + Date.now(),
      token_type: "bearer",
      scope: "repo",
      mock: true
    };
  }

  if (!GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_SECRET is required on server to exchange device token.");
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      device_code: deviceCode,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    })
  });

  const data = await response.json();

  if (data.error) {
    return {
      error: data.error,
      error_description: data.error_description
    };
  }

  return data;
}

/**
 * Fetch GitHub user profile
 */
export async function getGitHubUser(accessToken) {
  if (accessToken.startsWith("gho_mock_token_")) {
    return {
      login: "dsa-developer",
      name: "DSA Pattern Master",
      avatar_url: "https://github.com/ghost.png",
      html_url: "https://github.com"
    };
  }

  const response = await fetch("https://api.github.com/user", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "User-Agent": "DSA-Pattern-Finder",
      "Accept": "application/vnd.github.v3+json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub profile: ${response.status}`);
  }

  return await response.json();
}

/**
 * Auto-Commit Solution and Notes via GitHub Contents API
 * PUT /repos/{owner}/{repo}/contents/{path}
 */
export async function commitFileToGitHub({
  accessToken,
  owner,
  repo = "leetcode-solutions",
  path,
  content,
  message
}) {
  if (accessToken.startsWith("gho_mock_token_")) {
    return {
      mock: true,
      commit: {
        sha: "mock_sha_" + Math.random().toString(36).substring(2, 9),
        html_url: `https://github.com/${owner}/${repo}/commit/mock`
      },
      content: {
        name: path.split("/").pop(),
        path,
        html_url: `https://github.com/${owner}/${repo}/blob/main/${path}`
      }
    };
  }

  const headers = {
    "Authorization": `Bearer ${accessToken}`,
    "User-Agent": "DSA-Pattern-Finder",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  };

  // 1. Check if file already exists to obtain SHA for update
  let existingSha = null;
  try {
    const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers
    });
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      existingSha = checkData.sha;
    }
  } catch (e) {
    // File doesn't exist yet, proceed with new file creation
  }

  // 2. Commit file via PUT Contents API
  const bodyPayload = {
    message: message || `Sync: ${path}`,
    content: Buffer.from(content, "utf-8").toString("base64")
  };

  if (existingSha) {
    bodyPayload.sha = existingSha;
  }

  const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(bodyPayload)
  });

  if (!commitRes.ok) {
    const errText = await commitRes.text();
    throw new Error(`GitHub Contents API failed: ${commitRes.status} ${errText}`);
  }

  return await commitRes.json();
}
