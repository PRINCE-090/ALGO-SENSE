/**
 * Labeled Evaluation Benchmark Dataset
 * Contains 64 real LeetCode problems across 8 major algorithmic patterns.
 */

export const EVALUATION_DATASET = [
  // 🔹 1. Sliding Window (8 problems)
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    pattern: "Sliding Window",
    text: "Given a string s, find the length of the longest substring without repeating characters using a sliding window."
  },
  {
    id: 209,
    title: "Minimum Size Subarray Sum",
    pattern: "Sliding Window",
    text: "Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray of which the sum is greater than or equal to target."
  },
  {
    id: 424,
    title: "Longest Repeating Character Replacement",
    pattern: "Sliding Window",
    text: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. Return the maximum length of a substring containing the same letter after at most k operations."
  },
  {
    id: 567,
    title: "Permutation in String",
    pattern: "Sliding Window",
    text: "Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. Use a sliding window of size k."
  },
  {
    id: 1004,
    title: "Max Consecutive Ones III",
    pattern: "Sliding Window",
    text: "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's."
  },
  {
    id: 76,
    title: "Minimum Window Substring",
    pattern: "Sliding Window",
    text: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included in the window."
  },
  {
    id: 904,
    title: "Fruit Into Baskets",
    pattern: "Sliding Window",
    text: "You are visiting a farm that has a single row of fruit trees. Return the maximum number of fruits you can pick using a sliding window with at most 2 distinct types."
  },
  {
    id: 1456,
    title: "Maximum Number of Vowels in a Substring of Given Length",
    pattern: "Sliding Window",
    text: "Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k."
  },

  // 🔹 2. Two Pointers (8 problems)
  {
    id: 1,
    title: "Two Sum II - Input Array Is Sorted",
    pattern: "Two Pointers",
    text: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number using two pointers."
  },
  {
    id: 15,
    title: "3Sum",
    pattern: "Two Pointers",
    text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0 using two pointers."
  },
  {
    id: 11,
    title: "Container With Most Water",
    pattern: "Two Pointers",
    text: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water. Use left pointer and right pointer."
  },
  {
    id: 125,
    title: "Valid Palindrome",
    pattern: "Two Pointers",
    text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward using two pointers."
  },
  {
    id: 16,
    title: "3Sum Closest",
    pattern: "Two Pointers",
    text: "Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target using two pointers on sorted array."
  },
  {
    id: 18,
    title: "4Sum",
    pattern: "Two Pointers",
    text: "Given an array nums of n integers, return an array of all the unique quadruplets that sum up to target using two pointers."
  },
  {
    id: 977,
    title: "Squares of a Sorted Array",
    pattern: "Two Pointers",
    text: "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order using left and right pointers."
  },
  {
    id: 42,
    title: "Trapping Rain Water",
    pattern: "Two Pointers",
    text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining using two pointers."
  },

  // 🔹 3. Binary Search (8 problems)
  {
    id: 704,
    title: "Binary Search",
    pattern: "Binary Search",
    text: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index in O(log n) time."
  },
  {
    id: 35,
    title: "Search Insert Position",
    pattern: "Binary Search",
    text: "Given a sorted array of distinct integers and a target value, return the index if the target is found using binary search."
  },
  {
    id: 33,
    title: "Search in Rotated Sorted Array",
    pattern: "Binary Search",
    text: "There is an integer array nums sorted in ascending order. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums using log n binary search."
  },
  {
    id: 34,
    title: "Find First and Last Position of Element in Sorted Array",
    pattern: "Binary Search",
    text: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value using binary search lower bound and upper bound."
  },
  {
    id: 162,
    title: "Find Peak Element",
    pattern: "Binary Search",
    text: "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element using binary search in log n time."
  },
  {
    id: 875,
    title: "Koko Eating Bananas",
    pattern: "Binary Search",
    text: "Koko loves to eat bananas. Return the minimum integer speed k such that she can eat all the bananas within h hours using binary search on threshold range."
  },
  {
    id: 69,
    title: "Sqrt(x)",
    pattern: "Binary Search",
    text: "Given a non-negative integer x, return the square root of x rounded down to the nearest integer using binary search on search space."
  },
  {
    id: 153,
    title: "Find Minimum in Rotated Sorted Array",
    pattern: "Binary Search",
    text: "Given the sorted rotated array nums of unique elements, return the minimum element of this array using binary search in log n time."
  },

  // 🔹 4. Dynamic Programming (8 problems)
  {
    id: 70,
    title: "Climbing Stairs",
    pattern: "Dynamic Programming",
    text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways to reach the top using dynamic programming?"
  },
  {
    id: 322,
    title: "Coin Change",
    pattern: "Dynamic Programming",
    text: "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount using dynamic programming coin change."
  },
  {
    id: 300,
    title: "Longest Increasing Subsequence",
    pattern: "Dynamic Programming",
    text: "Given an integer array nums, return the length of the longest strictly increasing subsequence using dynamic programming dp table."
  },
  {
    id: 1143,
    title: "Longest Common Subsequence",
    pattern: "Dynamic Programming",
    text: "Given two strings text1 and text2, return the length of their longest common subsequence using dynamic programming memoization."
  },
  {
    id: 198,
    title: "House Robber",
    pattern: "Dynamic Programming",
    text: "You are a professional robber planning to rob houses along a street. Return the maximum amount of money you can rob tonight without alerting the police using dynamic programming state transition."
  },
  {
    id: 416,
    title: "Partition Equal Subset Sum",
    pattern: "Dynamic Programming",
    text: "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal using 0/1 knapsack dynamic programming."
  },
  {
    id: 53,
    title: "Maximum Subarray (Kadane's / DP)",
    pattern: "Dynamic Programming",
    text: "Given an integer array nums, find the subarray with the largest sum, and return its sum using dynamic programming dp relation."
  },
  {
    id: 64,
    title: "Minimum Path Sum",
    pattern: "Dynamic Programming",
    text: "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path using minimum path sum dynamic programming."
  },

  // 🔹 5. Graph (8 problems)
  {
    id: 200,
    title: "Number of Islands",
    pattern: "Graph",
    text: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands using graph dfs or bfs graph node traversal."
  },
  {
    id: 207,
    title: "Course Schedule",
    pattern: "Graph",
    text: "There are a total of numCourses courses you have to take. Some courses may have prerequisites. Return true if you can finish all courses using graph cycle detection and topological sorting."
  },
  {
    id: 133,
    title: "Clone Graph",
    pattern: "Graph",
    text: "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph using graph node edges and dfs traversal."
  },
  {
    id: 797,
    title: "All Paths From Source to Target",
    pattern: "Graph",
    text: "Given a directed acyclic graph (DAG) of n nodes labeled from 0 to n - 1, find all possible paths from node 0 to node n - 1 using graph traversal."
  },
  {
    id: 994,
    title: "Rotting Oranges",
    pattern: "Graph",
    text: "You are given an m x n grid where each cell can have one of three values. Return the minimum number of minutes that must elapse until no cell has a fresh orange using graph bfs traversal."
  },
  {
    id: 547,
    title: "Number of Provinces",
    pattern: "Graph",
    text: "There are n cities. Some of them are connected, while some are not. Return the total number of connected components using graph vertices and edges traversal."
  },
  {
    id: 210,
    title: "Course Schedule II",
    pattern: "Graph",
    text: "Return the ordering of courses you should take to finish all courses using graph topological sort on directed graph edges."
  },
  {
    id: 785,
    title: "Is Graph Bipartite?",
    pattern: "Graph",
    text: "There is an undirected graph with n nodes, where each node is numbered from 0 to n - 1. Return true if and only if it is bipartite using graph node coloring."
  },

  // 🔹 6. Backtracking (8 problems)
  {
    id: 46,
    title: "Permutations",
    pattern: "Backtracking",
    text: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order using backtracking."
  },
  {
    id: 78,
    title: "Subsets",
    pattern: "Backtracking",
    text: "Given an integer array nums of unique elements, return all possible subsets (the power set) using recursive backtracking."
  },
  {
    id: 39,
    title: "Combination Sum",
    pattern: "Backtracking",
    text: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target using backtracking."
  },
  {
    id: 51,
    title: "N-Queens",
    pattern: "Backtracking",
    text: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions using n-queens backtracking."
  },
  {
    id: 37,
    title: "Sudoku Solver",
    pattern: "Backtracking",
    text: "Write a program to solve a Sudoku puzzle by filling the empty cells using backtracking recursive search."
  },
  {
    id: 79,
    title: "Word Search",
    pattern: "Backtracking",
    text: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells using backtracking dfs search."
  },
  {
    id: 93,
    title: "Restore IP Addresses",
    pattern: "Backtracking",
    text: "Given a string s containing only digits, return all possible valid IP addresses that can be formed by inserting dots into s using restore ip backtracking."
  },
  {
    id: 17,
    title: "Letter Combinations of a Phone Number",
    pattern: "Backtracking",
    text: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent using recursive combinations backtracking."
  },

  // 🔹 7. Greedy (8 problems)
  {
    id: 435,
    title: "Non-overlapping Intervals",
    pattern: "Greedy",
    text: "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping using greedy interval selection."
  },
  {
    id: 55,
    title: "Jump Game",
    pattern: "Greedy",
    text: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index using greedy optimal jump choice."
  },
  {
    id: 134,
    title: "Gas Station",
    pattern: "Greedy",
    text: "There are n gas stations along a circular route. Return the starting gas station index if you can travel around the circuit once in the clockwise direction, otherwise return -1 using gas station greedy choice."
  },
  {
    id: 452,
    title: "Minimum Number of Arrows to Burst Balloons",
    pattern: "Greedy",
    text: "There are some spherical balloons taped onto a flat wall. Return the minimum number of arrows that must be shot to burst all balloons using greedy interval overlapping sorting."
  },
  {
    id: 763,
    title: "Partition Labels",
    pattern: "Greedy",
    text: "You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part using greedy partition scheduling."
  },
  {
    id: 621,
    title: "Task Scheduler",
    pattern: "Greedy",
    text: "Given a characters array tasks, representing the tasks a CPU needs to do, return the minimum number of units of times that the CPU will take to finish all the given tasks using greedy task scheduling."
  },
  {
    id: 1029,
    title: "Two City Scheduling",
    pattern: "Greedy",
    text: "A company is planning to interview 2n people. Given the cost array, send each person to a city such that total cost is minimized using greedy sorting by cost difference."
  },
  {
    id: 45,
    title: "Jump Game II",
    pattern: "Greedy",
    text: "You are given a 0-indexed array of integers nums of length n. Return the minimum number of jumps to reach nums[n - 1] using greedy maximum reach tracking."
  },

  // 🔹 8. Prefix Sum (8 problems)
  {
    id: 560,
    title: "Subarray Sum Equals K",
    pattern: "Prefix Sum",
    text: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k using prefix sum hash map."
  },
  {
    id: 303,
    title: "Range Sum Query - Immutable",
    pattern: "Prefix Sum",
    text: "Given an integer array nums, handle multiple queries of the following type: Calculate the sum of the elements of nums between indices left and right inclusive using prefix sum array."
  },
  {
    id: 525,
    title: "Contiguous Array",
    pattern: "Prefix Sum",
    text: "Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1 using prefix sum."
  },
  {
    id: 974,
    title: "Subarray Sums Divisible by K",
    pattern: "Prefix Sum",
    text: "Given an integer array nums and an integer k, return the number of non-empty subarrays that have a sum divisible by k using prefix sum modulo map."
  },
  {
    id: 238,
    title: "Product of Array Except Self",
    pattern: "Prefix Sum",
    text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i] using prefix product and suffix product sum queries."
  },
  {
    id: 724,
    title: "Find Pivot Index",
    pattern: "Prefix Sum",
    text: "Given an array of integers nums, calculate the pivot index of this array where the sum of all numbers to the left equals the sum of numbers to the right using prefix sum."
  },
  {
    id: 304,
    title: "Range Sum Query 2D - Immutable",
    pattern: "Prefix Sum",
    text: "Given a 2D matrix matrix, handle multiple queries of the following type: Calculate the sum of the elements of matrix inside the rectangle defined by its upper left corner and lower right corner using 2D prefix sum query."
  },
  {
    id: 1248,
    title: "Count Number of Nice Subarrays",
    pattern: "Prefix Sum",
    text: "Given an array of integers nums and an integer k. A continuous subarray is called nice if there are k odd numbers on it. Return the number of nice subarrays using prefix sum count tracking."
  }
];
