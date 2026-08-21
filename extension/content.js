/**
 * DSA Pattern Finder Content Script for LeetCode
 * Runs on https://leetcode.com/problems/*
 */

console.log("[DSA Pattern Finder] Active on LeetCode problem page.");

function getLeetCodeSlug() {
  const match = window.location.pathname.match(/\/problems\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

// Listen for messages from extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_SLUG") {
    sendResponse({ slug: getLeetCodeSlug(), url: window.location.href });
  }
});
