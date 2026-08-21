export const PATTERN_RULES = [
  {
    id: "hash_table",
    name: "Hash Table / Hash Map",
    description: "Uses a key-value hash map or set for O(1) lookup of complements, frequencies, or pairs.",
    keywords: [
      "hash map",
      "hash table",
      "unordered_map",
      "dictionary",
      "complement",
      "frequency",
      "lookup",
      "indices of the two numbers",
      "two numbers such that they add up"
    ],
    requires: [
      {
        custom: (signals) => !signals.isSorted && (signals.twoPointerHints || signals.text.includes("indices") || signals.text.includes("hash")),
        weight: 6,
        reason: "Unsorted array with pair target sum / complement lookup requirement"
      },
      {
        custom: (signals) => signals.text.includes("hash map") || signals.text.includes("frequency") || signals.text.includes("lookup"),
        weight: 5,
        reason: "Hash map / frequency lookup terms detected"
      }
    ],
    penalties: [
      { condition: (signals) => signals.isSorted, weight: -2 }
    ],
    thinkingSteps: [
      "Initialize a Hash Map to store (element_value -> index)",
      "Iterate through the array and compute complement = target - current_value",
      "If complement exists in Hash Map, return [map.get(complement), current_index]",
      "Otherwise, store map.set(current_value, current_index)"
    ]
  },
  {
    id: "sliding_window",
    name: "Sliding Window",
    description: "Tracks a contiguous subarray or substring frame that expands or shrinks.",
    keywords: ["window", "fixed size", "sliding window", "at most", "at least"],
    requires: [
      { signal: "mentionsSubarray", weight: 3, reason: "Subarray or contiguous element phrase detected" },
      { signal: "mentionsK", weight: 3, reason: "Window size K constraint detected" },
      { signal: "slidingWindowHints", weight: 2, reason: "Window expansion/contraction phrasing detected" }
    ],
    penalties: [
      { condition: (signals) => !signals.mentionsSubarray, weight: -3 }
    ],
    thinkingSteps: [
      "Initialize window boundaries (left = 0, right = 0)",
      "Expand right pointer to grow window and accumulate state",
      "Shrink left pointer when window condition is violated"
    ]
  },
  {
    id: "two_pointers",
    name: "Two Pointers",
    description: "Uses two pointer indices moving towards or away from each other.",
    keywords: [
      "two pointer",
      "two pointers",
      "pair sum",
      "triplet sum",
      "pair",
      "pairs",
      "triplet",
      "triplets",
      "palindrome",
      "container with most water",
      "left pointer",
      "right pointer"
    ],
    requires: [
      { signal: "hasArray", weight: 2, reason: "Array sequence input detected" },
      { signal: "twoPointerHints", weight: 3, reason: "Pair, triplet, or pointer narrowing terms detected" },
      { signal: "isSorted", weight: 4, reason: "Sorted array enables pointer narrowing" }
    ],
    penalties: [
      { condition: (signals) => !signals.isSorted && !signals.text.includes("container") && !signals.text.includes("palindrome"), weight: -3 }
    ],
    thinkingSteps: [
      "Sort array if ordering enables pointer narrowing",
      "Initialize left pointer at start and right pointer at end",
      "Move pointers based on sum/condition comparison"
    ]
  },
  {
    id: "prefix_sum",
    name: "Prefix Sum",
    description: "Precomputes cumulative sums to query range sum queries in O(1) time.",
    keywords: ["prefix sum", "range sum", "cumulative sum", "sum query", "subarray sum equals k"],
    requires: [
      { signal: "prefixSumHints", weight: 5, reason: "Prefix sum / range sum query phrasing detected" },
      { signal: "mentionsSubarray", weight: 2, reason: "Subarray sum query pattern" },
      { signal: "hasArray", weight: 1, reason: "Array input sequence" }
    ],
    penalties: [],
    thinkingSteps: [
      "Build prefix sum array where prefix[i] = prefix[i-1] + nums[i]",
      "Calculate subarray sum from index i to j as prefix[j] - prefix[i-1]",
      "Use hash map with prefix sums for target sum subarray counts"
    ]
  },
  {
    id: "binary_search",
    name: "Binary Search",
    description: "Halves the search space at each step on sorted data or monotonic functions.",
    keywords: [
      "search",
      "find index",
      "binary search",
      "target",
      "sorted array",
      "log n",
      "logn",
      "lower bound",
      "upper bound",
      "peak",
      "first occurrence",
      "last occurrence",
      "threshold"
    ],
    requires: [
      {
        custom: (signals) => signals.isSorted && signals.searchWords?.length > 0,
        weight: 7,
        reason: "Sorted sequence with target search requirement"
      },
      {
        custom: (signals) => !signals.isSorted && signals.searchWords?.length >= 2,
        weight: 4,
        reason: "Multiple search & target keywords detected"
      },
      {
        custom: (signals) => !signals.isSorted && signals.searchWords?.length === 1,
        weight: 2,
        reason: "Search target term detected"
      }
    ],
    penalties: [
      {
        condition: (signals) => !signals.isSorted && (!signals.searchWords || signals.searchWords.length === 0),
        weight: -3
      }
    ],
    thinkingSteps: [
      "Identify search boundaries (low = start, high = end)",
      "Calculate mid pointer and test target condition",
      "Discard left or right half based on monotonicity"
    ]
  },
  {
    id: "dynamic_programming",
    name: "Dynamic Programming",
    description: "Breaks problem into overlapping subproblems with optimal substructure.",
    keywords: [
      "subsequence",
      "dp",
      "dynamic programming",
      "memoization",
      "coin change",
      "knapsack",
      "longest common",
      "ways to",
      "minimum path sum"
    ],
    requires: [
      { signal: "dpHints", weight: 5, reason: "Optimal substructure / subproblem memoization keywords detected" }
    ],
    penalties: [],
    thinkingSteps: [
      "Define DP state array/table representing subproblem solutions",
      "Formulate state transition equation / recurrence relation",
      "Compute values bottom-up or top-down with memoization"
    ]
  },
  {
    id: "graph",
    name: "Graph",
    description: "Models problems using vertices (nodes) and edges for traversals (BFS/DFS).",
    keywords: [
      "graph",
      "node",
      "nodes",
      "edge",
      "edges",
      "connected",
      "path",
      "tree",
      "cycle",
      "vertex",
      "bfs",
      "dfs",
      "topological"
    ],
    requires: [
      { signal: "graphHints", weight: 5, reason: "Graph node, edge, or traversal keywords detected" }
    ],
    penalties: [],
    thinkingSteps: [
      "Build graph adjacency list from input nodes/edges",
      "Choose BFS for unweighted shortest path or DFS for depth traversal",
      "Track visited elements to handle cycles"
    ]
  },
  {
    id: "backtracking",
    name: "Backtracking",
    description: "Explores all potential candidates and backtracks upon reaching invalid paths.",
    keywords: [
      "backtrack",
      "backtracking",
      "permutation",
      "permutations",
      "combination",
      "combinations",
      "subset",
      "subsets",
      "all possible",
      "generate all",
      "n-queens",
      "sudoku",
      "restore ip"
    ],
    requires: [
      { signal: "backtrackingHints", weight: 5, reason: "Combinatorial generation / constraint search terms detected" }
    ],
    penalties: [],
    thinkingSteps: [
      "Define recursive function signature and search state",
      "Identify base cases for valid output generation",
      "Iterate candidates, make choice, recurse, and undo choice (backtrack)"
    ]
  },
  {
    id: "greedy",
    name: "Greedy",
    description: "Makes the locally optimal choice at each step to reach a global optimum.",
    keywords: [
      "greedy",
      "interval",
      "intervals",
      "overlap",
      "overlapping",
      "schedule",
      "scheduling",
      "jump",
      "gas station",
      "reorganize",
      "non-overlapping",
      "activity selection"
    ],
    requires: [
      { signal: "greedyHints", weight: 5, reason: "Interval scheduling or locally optimal choice terms detected" }
    ],
    penalties: [],
    thinkingSteps: [
      "Sort input if needed (e.g. intervals by start/end time)",
      "Iterate through elements making locally optimal choice",
      "Maintain running optimal result state"
    ]
  }
];
