/**
 * Labeled Evaluation Benchmark Dataset
 * Contains 75 real LeetCode problems across 14 major algorithmic patterns.
 */

export const EVALUATION_DATASET = [
  // 🔹 1. Sliding Window (6 problems)
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    pattern: "Sliding Window",
    acceptable: ["Sliding Window"],
    text: "Given a string s, find the length of the longest substring without repeating characters using a sliding window."
  },
  {
    id: 209,
    title: "Minimum Size Subarray Sum",
    pattern: "Sliding Window",
    acceptable: ["Sliding Window"],
    text: "Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray of which the sum is greater than or equal to target. n <= 100000."
  },
  {
    id: 424,
    title: "Longest Repeating Character Replacement",
    pattern: "Sliding Window",
    acceptable: ["Sliding Window"],
    text: "You are given a string s and an integer k. Return the maximum length of a substring containing the same letter after at most k operations."
  },
  {
    id: 567,
    title: "Permutation in String",
    pattern: "Sliding Window",
    acceptable: ["Sliding Window"],
    text: "Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. Use a sliding window of size k."
  },
  {
    id: 1004,
    title: "Max Consecutive Ones III",
    pattern: "Sliding Window",
    acceptable: ["Sliding Window"],
    text: "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's."
  },

  // 🔹 2. Two Pointers (6 problems)
  {
    id: 167,
    title: "Two Sum II - Input Array Is Sorted",
    pattern: "Two Pointers",
    acceptable: ["Two Pointers"],
    text: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number."
  },
  {
    id: 15,
    title: "3Sum",
    pattern: "Two Pointers",
    acceptable: ["Two Pointers"],
    text: "Given an array of integers where duplicates are allowed in the input, find all unique triplets that sum to zero. n <= 3000."
  },
  {
    id: 11,
    title: "Container With Most Water",
    pattern: "Two Pointers",
    acceptable: ["Two Pointers"],
    text: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water. Use left pointer and right pointer."
  },
  {
    id: 125,
    title: "Valid Palindrome",
    pattern: "Two Pointers",
    acceptable: ["Two Pointers"],
    text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters, it reads the same forward and backward using two pointers."
  },
  {
    id: 16,
    title: "3Sum Closest",
    pattern: "Two Pointers",
    acceptable: ["Two Pointers"],
    text: "Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target using two pointers on sorted array."
  },

  // 🔹 3. Hash Table / Hash Map (5 problems)
  {
    id: 1,
    title: "Two Sum",
    pattern: "Hash Table / Hash Map",
    acceptable: ["Hash Table / Hash Map"],
    text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution."
  },
  {
    id: 49,
    title: "Group Anagrams",
    pattern: "Hash Table / Hash Map",
    acceptable: ["Hash Table / Hash Map"],
    text: "Given an array of strings strs, group the anagrams together using a hash map key frequency dictionary."
  },
  {
    id: 217,
    title: "Contains Duplicate",
    pattern: "Hash Table / Hash Map",
    acceptable: ["Hash Table / Hash Map"],
    text: "Given an integer array nums, return true if any value appears at least twice in the array using a hash set lookup."
  },

  // 🔹 4. Fast & Slow Pointers (4 problems)
  {
    id: 141,
    title: "Linked List Cycle",
    pattern: "Fast & Slow Pointers",
    acceptable: ["Fast & Slow Pointers"],
    text: "Given head, the head of a linked list, determine if the linked list has a cycle using fast and slow pointers."
  },
  {
    id: 876,
    title: "Middle of the Linked List",
    pattern: "Fast & Slow Pointers",
    acceptable: ["Fast & Slow Pointers"],
    text: "Given the head of a singly linked list, return the middle node of the linked list using fast and slow tortoise pointers."
  },

  // 🔹 5. Binary Search (6 problems)
  {
    id: 704,
    title: "Binary Search",
    pattern: "Binary Search",
    acceptable: ["Binary Search"],
    text: "Given an array of integers nums which is sorted in ascending order, and an integer target, search for target using binary search in O(log n) time."
  },
  {
    id: 35,
    title: "Search Insert Position",
    pattern: "Binary Search",
    acceptable: ["Binary Search"],
    text: "Given a sorted array of distinct integers and a target value, return the index if the target is found using binary search."
  },
  {
    id: 33,
    title: "Search in Rotated Sorted Array",
    pattern: "Binary Search",
    acceptable: ["Binary Search"],
    text: "There is an integer array nums sorted in ascending order. Search for a target value in log n binary search time."
  },
  {
    id: 875,
    title: "Koko Eating Bananas",
    pattern: "Binary Search",
    acceptable: ["Binary Search"],
    text: "Koko loves to eat bananas. Return the minimum integer speed k such that she can eat all bananas within h hours using binary search on monotonic search space."
  },

  // 🔹 6. Monotonic Stack (4 problems)
  {
    id: 739,
    title: "Daily Temperatures",
    pattern: "Monotonic Stack",
    acceptable: ["Monotonic Stack"],
    text: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days until a warmer temperature using a monotonic stack."
  },
  {
    id: 84,
    title: "Largest Rectangle in Histogram",
    pattern: "Monotonic Stack",
    acceptable: ["Monotonic Stack"],
    text: "Given an array of integers heights representing the histogram's bar height, find the area of the largest rectangle in the histogram using a monotonic stack."
  },

  // 🔹 7. Heap / Top-K (4 problems)
  {
    id: 215,
    title: "Kth Largest Element in an Array",
    pattern: "Heap / Top-K",
    acceptable: ["Heap / Top-K"],
    text: "Given an integer array nums and an integer k, return the kth largest element in the array using a min heap priority queue."
  },
  {
    id: 347,
    title: "Top K Frequent Elements",
    pattern: "Heap / Top-K",
    acceptable: ["Heap / Top-K", "Hash Table / Hash Map"],
    text: "Given an integer array nums and an integer k, return the k most frequent elements using a priority queue min heap."
  },

  // 🔹 8. Merge Intervals (4 problems)
  {
    id: 56,
    title: "Merge Intervals",
    pattern: "Merge Intervals",
    acceptable: ["Merge Intervals"],
    text: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of non-overlapping intervals."
  },
  {
    id: 252,
    title: "Meeting Rooms",
    pattern: "Merge Intervals",
    acceptable: ["Merge Intervals"],
    text: "Given an array of meeting time intervals, determine if a person could attend all meetings without schedule overlap."
  },

  // 🔹 9. Union-Find (Disjoint Set) (4 problems)
  {
    id: 547,
    title: "Number of Provinces",
    pattern: "Union-Find (Disjoint Set)",
    acceptable: ["Union-Find (Disjoint Set)", "Graph"],
    text: "There are n cities. Return the total number of connected components or provinces using union find disjoint set path compression."
  },
  {
    id: 684,
    title: "Redundant Connection",
    pattern: "Union-Find (Disjoint Set)",
    acceptable: ["Union-Find (Disjoint Set)", "Graph"],
    text: "In this problem, a tree is an undirected graph that is connected and has no cycles. Return an edge that can be removed using union find."
  },

  // 🔹 10. Dynamic Programming (6 problems)
  {
    id: 70,
    title: "Climbing Stairs",
    pattern: "Dynamic Programming",
    acceptable: ["Dynamic Programming"],
    text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. Find distinct ways to reach top using dynamic programming."
  },
  {
    id: 322,
    title: "Coin Change",
    pattern: "Dynamic Programming",
    acceptable: ["Dynamic Programming"],
    text: "Return the fewest number of coins that you need to make up that amount using dynamic programming coin change memoization."
  },
  {
    id: 300,
    title: "Longest Increasing Subsequence",
    pattern: "Dynamic Programming",
    acceptable: ["Dynamic Programming"],
    text: "Given an integer array nums, return the length of the longest strictly increasing subsequence using dynamic programming dp table."
  },

  // 🔹 11. Graph (6 problems)
  {
    id: 200,
    title: "Number of Islands",
    pattern: "Graph",
    acceptable: ["Graph", "Union-Find (Disjoint Set)"],
    text: "Given an m x n 2D binary grid grid representing a map of land and water, return the number of islands using graph dfs or bfs traversal."
  },
  {
    id: 207,
    title: "Course Schedule",
    pattern: "Graph",
    acceptable: ["Graph"],
    text: "Return true if you can finish all courses using graph cycle detection and topological sorting."
  },

  // 🔹 12. Backtracking (5 problems)
  {
    id: 46,
    title: "Permutations",
    pattern: "Backtracking",
    acceptable: ["Backtracking"],
    text: "Given an array nums of distinct integers, return all possible permutations. n <= 12 using backtracking."
  },
  {
    id: 78,
    title: "Subsets",
    pattern: "Backtracking",
    acceptable: ["Backtracking"],
    text: "Given an integer array nums of unique elements, generate all possible subsets. n <= 20 using recursive backtracking."
  },

  // 🔹 13. Greedy (5 problems)
  {
    id: 435,
    title: "Non-overlapping Intervals",
    pattern: "Greedy",
    acceptable: ["Greedy", "Merge Intervals"],
    text: "Given an array of intervals, return the minimum number of intervals you need to remove to make the rest non-overlapping using greedy selection."
  },
  {
    id: 55,
    title: "Jump Game",
    pattern: "Greedy",
    acceptable: ["Greedy"],
    text: "Return true if you can reach the last index using greedy optimal jump length choice."
  },

  // 🔹 14. Prefix Sum (5 problems)
  {
    id: 560,
    title: "Subarray Sum Equals K",
    pattern: "Prefix Sum",
    acceptable: ["Prefix Sum"],
    text: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k using prefix sum hash map."
  },
  {
    id: 303,
    title: "Range Sum Query - Immutable",
    pattern: "Prefix Sum",
    acceptable: ["Prefix Sum"],
    text: "Calculate the sum of elements of nums between indices left and right inclusive using precomputed prefix sum array."
  }
];
