/**
 * Template-Based Socratic Reasoning Questions per Algorithmic Pattern (14 Patterns)
 */

export const SOCRATIC_TEMPLATES = {
  "Hash Table / Hash Map": [
    "Can you store previously visited elements in a Hash Map to check for the required complement target - num in O(1) time?",
    "What key-value pair will your Hash Map store (e.g. element_value -> index or element_value -> frequency)?",
    "Why does sorting first degrade performance to O(N log N) compared to an O(N) single-pass Hash Map lookup?",
    "How will you handle space complexity O(N) when trading space for time optimization?"
  ],
  "Binary Search": [
    "Is the search space monotonically sorted or partitioned into two deterministic conditions?",
    "What are your lower (`low`) and upper (`high`) search boundaries?",
    "How do you avoid infinite loops when updating `low = mid` vs `low = mid + 1`?",
    "If searching on answer space, what helper function tests if a candidate `mid` is feasible?"
  ],
  "Two Pointers": [
    "Does sorting the input enable candidate filtering from opposite ends?",
    "When comparing `nums[left] + nums[right]` against `target`, which pointer should increment or decrement?",
    "How will you handle duplicate values to ensure unique pairs/triplets?",
    "Would a fast and slow pointer approach work if searching for cycles?"
  ],
  "Fast & Slow Pointers": [
    "Why does advancing slow by 1 step and fast by 2 steps guarantee they will meet if a cycle exists?",
    "When fast reaches null, why is slow located at the exact middle node of the linked list?",
    "How do you find the exact node where a linked list cycle begins after detecting the collision point?"
  ],
  "Sliding Window": [
    "Is the window size fixed ($k$) or dynamic based on a variable target constraint?",
    "What condition triggers expanding the `right` pointer vs shrinking the `left` pointer?",
    "What data structure (e.g. hash map, frequency array, monotonic queue) tracks window state in $O(1)$?",
    "How do you maintain the global maximum/minimum length while adjusting window boundaries?"
  ],
  "Monotonic Stack": [
    "Is a monotonic increasing or monotonic decreasing stack required to resolve the next greater/smaller element?",
    "Why does storing element indices instead of values in the stack allow computing subarray distances in $O(1)$?",
    "How does popping elements upon invariant violation process unresolved elements in total $O(N)$ time?"
  ],
  "Heap / Top-K": [
    "Why is a Min-Heap of size K optimal for tracking the Top K Largest elements?",
    "What is the total time complexity $O(N \log K)$ compared to full sorting $O(N \log N)$?",
    "When maintaining a dynamic stream median, how do you balance a Max-Heap (left half) and Min-Heap (right half)?"
  ],
  "Merge Intervals": [
    "Why must intervals be sorted by start time before processing overlaps?",
    "Under what exact condition `curr.start <= prev.end` do two intervals overlap?",
    "How do you merge overlapping intervals into a single `[prev.start, max(prev.end, curr.end)]` range?"
  ],
  "Union-Find (Disjoint Set)": [
    "How do Find-Parent with path compression and Union by rank optimize component connections to near $O(1)$ amortized time?",
    "How does Union-Find detect redundant graph edges that form cycles?",
    "What is the advantage of Union-Find over BFS/DFS for dynamic graph connectivity queries?"
  ],
  "Dynamic Programming": [
    "What does `dp[i]` or `dp[i][j]` represent in plain English?",
    "Can the solution for state $i$ be derived from optimal solutions to smaller subproblems ($i-1$, $i-k$)?",
    "What are your base cases (e.g. $i = 0$ or empty sequence)?",
    "Can memory overhead be optimized from $O(N)$ to $O(1)$ by storing only recent state variables?"
  ],
  "Graph": [
    "Is the graph directed or undirected? Does it contain weighted edges or cycles?",
    "Would Breadth-First Search (BFS) guarantee the shortest path here?",
    "How will you track visited nodes/cells to prevent infinite recursion or cycles?",
    "Is topological sorting required to resolve node dependencies?"
  ],
  "Backtracking": [
    "What is your base case condition for a valid solution candidate?",
    "At step $i$, what choices are available, and how do you undo a choice (backtrack)?",
    "How can you prune invalid branches early before recursing deeper?",
    "Are you generating permutations (order matters) or combinations (order does not matter)?"
  ],
  "Greedy": [
    "Can you prove that making a locally optimal choice at each step yields a globally optimal solution?",
    "What sorting order (e.g. interval end times) unlocks the greedy choice property?",
    "Are there edge cases where a greedy choice fails and dynamic programming is required?",
    "Can you track the running optimal result in $O(1)$ extra space during traversal?"
  ],
  "Prefix Sum": [
    "How does precomputing cumulative sums $P[i] = P[i-1] + A[i]$ enable range sum queries in $O(1)$ time?",
    "Can a Hash Map storing `prefix_sum -> frequency` find target subarray sums in $O(N)$ time?",
    "How do 1-based indexing or dummy zero elements simplify boundary checks?",
    "Does the problem require 2D prefix sums for submatrix queries?"
  ],
  "Unknown": [
    "What are the input size constraints ($N \le 10^5$, $N \le 10^3$, $N \le 20$)?",
    "Can you walk through a manual example to identify subproblem structures?",
    "What is the brute-force time complexity, and where is duplicate computation occurring?"
  ]
};
