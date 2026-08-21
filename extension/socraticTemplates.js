/**
 * Template-Based Socratic Reasoning Questions per Algorithmic Pattern
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
  "Sliding Window": [
    "Is the window size fixed ($k$) or dynamic based on a variable target constraint?",
    "What condition triggers expanding the `right` pointer vs shrinking the `left` pointer?",
    "What data structure (e.g. hash map, frequency array, monotonic queue) tracks window state in $O(1)$?",
    "How do you maintain the global maximum/minimum length while adjusting window boundaries?"
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
