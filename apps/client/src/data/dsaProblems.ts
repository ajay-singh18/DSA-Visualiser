// ── DSA Problems Data ──────────────────────────────────────────────
// Organized by topic/pattern, sorted Easy → Medium → Hard

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  name: string;
  difficulty: Difficulty;
  leetcodeUrl: string;
  /** Optional LeetCode problem number */
  lcNumber?: number;
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  problems: Problem[];
}

export const DSA_TOPICS: Topic[] = [
  // ━━━━━━━━━━ Arrays & Hashing ━━━━━━━━━━
  {
    id: 'arrays-hashing',
    title: 'Arrays & Hashing',
    icon: '📦',
    color: '#60a5fa',
    description: 'Fundamental array operations, hash maps, and frequency counting',
    problems: [
      { id: 'ah-1', name: 'Two Sum', difficulty: 'Easy', lcNumber: 1, leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
      { id: 'ah-2', name: 'Contains Duplicate', difficulty: 'Easy', lcNumber: 217, leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/' },
      { id: 'ah-3', name: 'Valid Anagram', difficulty: 'Easy', lcNumber: 242, leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 'ah-4', name: 'Group Anagrams', difficulty: 'Medium', lcNumber: 49, leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/' },
      { id: 'ah-5', name: 'Top K Frequent Elements', difficulty: 'Medium', lcNumber: 347, leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'ah-6', name: 'Product of Array Except Self', difficulty: 'Medium', lcNumber: 238, leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'ah-7', name: 'Encode and Decode Strings', difficulty: 'Medium', lcNumber: 271, leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-strings/' },
      { id: 'ah-8', name: 'Longest Consecutive Sequence', difficulty: 'Medium', lcNumber: 128, leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
    ],
  },

  // ━━━━━━━━━━ Two Pointers ━━━━━━━━━━
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    icon: '👆',
    color: '#a78bfa',
    description: 'Pointer-based traversal patterns for sorted arrays and strings',
    problems: [
      { id: 'tp-1', name: 'Valid Palindrome', difficulty: 'Easy', lcNumber: 125, leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'tp-2', name: 'Two Sum II - Sorted Array', difficulty: 'Medium', lcNumber: 167, leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: 'tp-3', name: '3Sum', difficulty: 'Medium', lcNumber: 15, leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
      { id: 'tp-4', name: 'Container With Most Water', difficulty: 'Medium', lcNumber: 11, leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 'tp-5', name: 'Trapping Rain Water', difficulty: 'Hard', lcNumber: 42, leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/' },
    ],
  },

  // ━━━━━━━━━━ Sliding Window ━━━━━━━━━━
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    icon: '🪟',
    color: '#f472b6',
    description: 'Variable and fixed-size window patterns for subarray/substring problems',
    problems: [
      { id: 'sw-1', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', lcNumber: 121, leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'sw-2', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', lcNumber: 3, leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'sw-3', name: 'Longest Repeating Character Replacement', difficulty: 'Medium', lcNumber: 424, leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: 'sw-4', name: 'Permutation in String', difficulty: 'Medium', lcNumber: 567, leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/' },
      { id: 'sw-5', name: 'Minimum Window Substring', difficulty: 'Hard', lcNumber: 76, leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: 'sw-6', name: 'Sliding Window Maximum', difficulty: 'Hard', lcNumber: 239, leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/' },
    ],
  },

  // ━━━━━━━━━━ Stack ━━━━━━━━━━
  {
    id: 'stack',
    title: 'Stack',
    icon: '📚',
    color: '#34d399',
    description: 'LIFO-based patterns: matching brackets, monotonic stack, and postfix evaluation',
    problems: [
      { id: 'st-1', name: 'Valid Parentheses', difficulty: 'Easy', lcNumber: 20, leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 'st-2', name: 'Min Stack', difficulty: 'Medium', lcNumber: 155, leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
      { id: 'st-3', name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', lcNumber: 150, leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
      { id: 'st-4', name: 'Generate Parentheses', difficulty: 'Medium', lcNumber: 22, leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/' },
      { id: 'st-5', name: 'Daily Temperatures', difficulty: 'Medium', lcNumber: 739, leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/' },
      { id: 'st-6', name: 'Car Fleet', difficulty: 'Medium', lcNumber: 853, leetcodeUrl: 'https://leetcode.com/problems/car-fleet/' },
      { id: 'st-7', name: 'Largest Rectangle in Histogram', difficulty: 'Hard', lcNumber: 84, leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
    ],
  },

  // ━━━━━━━━━━ Binary Search ━━━━━━━━━━
  {
    id: 'binary-search',
    title: 'Binary Search',
    icon: '🔍',
    color: '#fbbf24',
    description: 'Divide-and-conquer search on sorted data, boundary finding, and rotated arrays',
    problems: [
      { id: 'bs-1', name: 'Binary Search', difficulty: 'Easy', lcNumber: 704, leetcodeUrl: 'https://leetcode.com/problems/binary-search/' },
      { id: 'bs-2', name: 'Search a 2D Matrix', difficulty: 'Medium', lcNumber: 74, leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 'bs-3', name: 'Koko Eating Bananas', difficulty: 'Medium', lcNumber: 875, leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { id: 'bs-4', name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', lcNumber: 153, leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'bs-5', name: 'Search in Rotated Sorted Array', difficulty: 'Medium', lcNumber: 33, leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'bs-6', name: 'Time Based Key-Value Store', difficulty: 'Medium', lcNumber: 981, leetcodeUrl: 'https://leetcode.com/problems/time-based-key-value-store/' },
      { id: 'bs-7', name: 'Median of Two Sorted Arrays', difficulty: 'Hard', lcNumber: 4, leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
    ],
  },

  // ━━━━━━━━━━ Linked List ━━━━━━━━━━
  {
    id: 'linked-list',
    title: 'Linked List',
    icon: '🔗',
    color: '#fb923c',
    description: 'Pointer manipulation, reversal, cycle detection, and merge operations',
    problems: [
      { id: 'll-1', name: 'Reverse Linked List', difficulty: 'Easy', lcNumber: 206, leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'll-2', name: 'Merge Two Sorted Lists', difficulty: 'Easy', lcNumber: 21, leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: 'll-3', name: 'Linked List Cycle', difficulty: 'Easy', lcNumber: 141, leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'll-4', name: 'Reorder List', difficulty: 'Medium', lcNumber: 143, leetcodeUrl: 'https://leetcode.com/problems/reorder-list/' },
      { id: 'll-5', name: 'Remove Nth Node From End of List', difficulty: 'Medium', lcNumber: 19, leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 'll-6', name: 'Copy List with Random Pointer', difficulty: 'Medium', lcNumber: 138, leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: 'll-7', name: 'Add Two Numbers', difficulty: 'Medium', lcNumber: 2, leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/' },
      { id: 'll-8', name: 'LRU Cache', difficulty: 'Medium', lcNumber: 146, leetcodeUrl: 'https://leetcode.com/problems/lru-cache/' },
      { id: 'll-9', name: 'Merge K Sorted Lists', difficulty: 'Hard', lcNumber: 23, leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'll-10', name: 'Reverse Nodes in K-Group', difficulty: 'Hard', lcNumber: 25, leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
    ],
  },

  // ━━━━━━━━━━ Trees ━━━━━━━━━━
  {
    id: 'trees',
    title: 'Trees',
    icon: '🌲',
    color: '#34d399',
    description: 'Binary tree traversals, BST operations, and tree construction',
    problems: [
      { id: 'tr-1', name: 'Invert Binary Tree', difficulty: 'Easy', lcNumber: 226, leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: 'tr-2', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', lcNumber: 104, leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'tr-3', name: 'Diameter of Binary Tree', difficulty: 'Easy', lcNumber: 543, leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { id: 'tr-4', name: 'Same Tree', difficulty: 'Easy', lcNumber: 100, leetcodeUrl: 'https://leetcode.com/problems/same-tree/' },
      { id: 'tr-5', name: 'Subtree of Another Tree', difficulty: 'Easy', lcNumber: 572, leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/' },
      { id: 'tr-6', name: 'Lowest Common Ancestor of BST', difficulty: 'Medium', lcNumber: 235, leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 'tr-7', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', lcNumber: 102, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 'tr-8', name: 'Binary Tree Right Side View', difficulty: 'Medium', lcNumber: 199, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
      { id: 'tr-9', name: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', lcNumber: 1448, leetcodeUrl: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/' },
      { id: 'tr-10', name: 'Validate Binary Search Tree', difficulty: 'Medium', lcNumber: 98, leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 'tr-11', name: 'Kth Smallest Element in BST', difficulty: 'Medium', lcNumber: 230, leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 'tr-12', name: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', lcNumber: 105, leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
      { id: 'tr-13', name: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', lcNumber: 124, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: 'tr-14', name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', lcNumber: 297, leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
    ],
  },

  // ━━━━━━━━━━ Tries ━━━━━━━━━━
  {
    id: 'tries',
    title: 'Tries',
    icon: '🔤',
    color: '#c084fc',
    description: 'Prefix tree operations for efficient string search and autocomplete',
    problems: [
      { id: 'ti-1', name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', lcNumber: 208, leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { id: 'ti-2', name: 'Design Add and Search Words', difficulty: 'Medium', lcNumber: 211, leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
      { id: 'ti-3', name: 'Word Search II', difficulty: 'Hard', lcNumber: 212, leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/' },
    ],
  },

  // ━━━━━━━━━━ Heap / Priority Queue ━━━━━━━━━━
  {
    id: 'heap',
    title: 'Heap / Priority Queue',
    icon: '⛰️',
    color: '#f97316',
    description: 'Min/max heap patterns, K-th element problems, and merge operations',
    problems: [
      { id: 'hp-1', name: 'Kth Largest Element in a Stream', difficulty: 'Easy', lcNumber: 703, leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
      { id: 'hp-2', name: 'Last Stone Weight', difficulty: 'Easy', lcNumber: 1046, leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight/' },
      { id: 'hp-3', name: 'K Closest Points to Origin', difficulty: 'Medium', lcNumber: 973, leetcodeUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
      { id: 'hp-4', name: 'Kth Largest Element in an Array', difficulty: 'Medium', lcNumber: 215, leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 'hp-5', name: 'Task Scheduler', difficulty: 'Medium', lcNumber: 621, leetcodeUrl: 'https://leetcode.com/problems/task-scheduler/' },
      { id: 'hp-6', name: 'Design Twitter', difficulty: 'Medium', lcNumber: 355, leetcodeUrl: 'https://leetcode.com/problems/design-twitter/' },
      { id: 'hp-7', name: 'Find Median from Data Stream', difficulty: 'Hard', lcNumber: 295, leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/' },
    ],
  },

  // ━━━━━━━━━━ Backtracking ━━━━━━━━━━
  {
    id: 'backtracking',
    title: 'Backtracking',
    icon: '🔙',
    color: '#e879f9',
    description: 'Recursive exploration with constraint pruning — permutations, combinations, and board problems',
    problems: [
      { id: 'bt-1', name: 'Subsets', difficulty: 'Medium', lcNumber: 78, leetcodeUrl: 'https://leetcode.com/problems/subsets/' },
      { id: 'bt-2', name: 'Combination Sum', difficulty: 'Medium', lcNumber: 39, leetcodeUrl: 'https://leetcode.com/problems/combination-sum/' },
      { id: 'bt-3', name: 'Permutations', difficulty: 'Medium', lcNumber: 46, leetcodeUrl: 'https://leetcode.com/problems/permutations/' },
      { id: 'bt-4', name: 'Subsets II', difficulty: 'Medium', lcNumber: 90, leetcodeUrl: 'https://leetcode.com/problems/subsets-ii/' },
      { id: 'bt-5', name: 'Combination Sum II', difficulty: 'Medium', lcNumber: 40, leetcodeUrl: 'https://leetcode.com/problems/combination-sum-ii/' },
      { id: 'bt-6', name: 'Word Search', difficulty: 'Medium', lcNumber: 79, leetcodeUrl: 'https://leetcode.com/problems/word-search/' },
      { id: 'bt-7', name: 'Palindrome Partitioning', difficulty: 'Medium', lcNumber: 131, leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/' },
      { id: 'bt-8', name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', lcNumber: 17, leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
      { id: 'bt-9', name: 'N-Queens', difficulty: 'Hard', lcNumber: 51, leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },
    ],
  },

  // ━━━━━━━━━━ Graphs ━━━━━━━━━━
  {
    id: 'graphs',
    title: 'Graphs',
    icon: '🕸️',
    color: '#38bdf8',
    description: 'BFS, DFS, topological sort, union-find, and shortest path algorithms',
    problems: [
      { id: 'gr-1', name: 'Number of Islands', difficulty: 'Medium', lcNumber: 200, leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'gr-2', name: 'Clone Graph', difficulty: 'Medium', lcNumber: 133, leetcodeUrl: 'https://leetcode.com/problems/clone-graph/' },
      { id: 'gr-3', name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', lcNumber: 417, leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      { id: 'gr-4', name: 'Course Schedule', difficulty: 'Medium', lcNumber: 207, leetcodeUrl: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'gr-5', name: 'Course Schedule II', difficulty: 'Medium', lcNumber: 210, leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/' },
      { id: 'gr-6', name: 'Number of Connected Components', difficulty: 'Medium', lcNumber: 323, leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
      { id: 'gr-7', name: 'Redundant Connection', difficulty: 'Medium', lcNumber: 684, leetcodeUrl: 'https://leetcode.com/problems/redundant-connection/' },
      { id: 'gr-8', name: 'Rotting Oranges', difficulty: 'Medium', lcNumber: 994, leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 'gr-9', name: 'Walls and Gates', difficulty: 'Medium', lcNumber: 286, leetcodeUrl: 'https://leetcode.com/problems/walls-and-gates/' },
      { id: 'gr-10', name: 'Word Ladder', difficulty: 'Hard', lcNumber: 127, leetcodeUrl: 'https://leetcode.com/problems/word-ladder/' },
    ],
  },

  // ━━━━━━━━━━ Dynamic Programming ━━━━━━━━━━
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: '🧠',
    color: '#facc15',
    description: 'Optimal substructure and overlapping subproblems — 1D/2D DP, knapsack, and LCS',
    problems: [
      { id: 'dp-1', name: 'Climbing Stairs', difficulty: 'Easy', lcNumber: 70, leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: 'dp-2', name: 'Min Cost Climbing Stairs', difficulty: 'Easy', lcNumber: 746, leetcodeUrl: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
      { id: 'dp-3', name: 'House Robber', difficulty: 'Medium', lcNumber: 198, leetcodeUrl: 'https://leetcode.com/problems/house-robber/' },
      { id: 'dp-4', name: 'House Robber II', difficulty: 'Medium', lcNumber: 213, leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/' },
      { id: 'dp-5', name: 'Longest Palindromic Substring', difficulty: 'Medium', lcNumber: 5, leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: 'dp-6', name: 'Palindromic Substrings', difficulty: 'Medium', lcNumber: 647, leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/' },
      { id: 'dp-7', name: 'Decode Ways', difficulty: 'Medium', lcNumber: 91, leetcodeUrl: 'https://leetcode.com/problems/decode-ways/' },
      { id: 'dp-8', name: 'Coin Change', difficulty: 'Medium', lcNumber: 322, leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
      { id: 'dp-9', name: 'Maximum Product Subarray', difficulty: 'Medium', lcNumber: 152, leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { id: 'dp-10', name: 'Word Break', difficulty: 'Medium', lcNumber: 139, leetcodeUrl: 'https://leetcode.com/problems/word-break/' },
      { id: 'dp-11', name: 'Longest Increasing Subsequence', difficulty: 'Medium', lcNumber: 300, leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 'dp-12', name: 'Unique Paths', difficulty: 'Medium', lcNumber: 62, leetcodeUrl: 'https://leetcode.com/problems/unique-paths/' },
      { id: 'dp-13', name: 'Longest Common Subsequence', difficulty: 'Medium', lcNumber: 1143, leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 'dp-14', name: 'Target Sum', difficulty: 'Medium', lcNumber: 494, leetcodeUrl: 'https://leetcode.com/problems/target-sum/' },
      { id: 'dp-15', name: 'Edit Distance', difficulty: 'Medium', lcNumber: 72, leetcodeUrl: 'https://leetcode.com/problems/edit-distance/' },
      { id: 'dp-16', name: 'Regular Expression Matching', difficulty: 'Hard', lcNumber: 10, leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/' },
    ],
  },

  // ━━━━━━━━━━ Greedy ━━━━━━━━━━
  {
    id: 'greedy',
    title: 'Greedy',
    icon: '💰',
    color: '#4ade80',
    description: 'Locally optimal choices that lead to globally optimal solutions',
    problems: [
      { id: 'gd-1', name: 'Maximum Subarray', difficulty: 'Medium', lcNumber: 53, leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 'gd-2', name: 'Jump Game', difficulty: 'Medium', lcNumber: 55, leetcodeUrl: 'https://leetcode.com/problems/jump-game/' },
      { id: 'gd-3', name: 'Jump Game II', difficulty: 'Medium', lcNumber: 45, leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/' },
      { id: 'gd-4', name: 'Gas Station', difficulty: 'Medium', lcNumber: 134, leetcodeUrl: 'https://leetcode.com/problems/gas-station/' },
      { id: 'gd-5', name: 'Hand of Straights', difficulty: 'Medium', lcNumber: 846, leetcodeUrl: 'https://leetcode.com/problems/hand-of-straights/' },
      { id: 'gd-6', name: 'Merge Triplets to Form Target', difficulty: 'Medium', lcNumber: 1899, leetcodeUrl: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/' },
      { id: 'gd-7', name: 'Partition Labels', difficulty: 'Medium', lcNumber: 763, leetcodeUrl: 'https://leetcode.com/problems/partition-labels/' },
      { id: 'gd-8', name: 'Valid Parenthesis String', difficulty: 'Medium', lcNumber: 678, leetcodeUrl: 'https://leetcode.com/problems/valid-parenthesis-string/' },
    ],
  },

  // ━━━━━━━━━━ Intervals ━━━━━━━━━━
  {
    id: 'intervals',
    title: 'Intervals',
    icon: '📐',
    color: '#fb7185',
    description: 'Merging, inserting, and scheduling interval-based problems',
    problems: [
      { id: 'iv-1', name: 'Meeting Rooms', difficulty: 'Easy', lcNumber: 252, leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms/' },
      { id: 'iv-2', name: 'Insert Interval', difficulty: 'Medium', lcNumber: 57, leetcodeUrl: 'https://leetcode.com/problems/insert-interval/' },
      { id: 'iv-3', name: 'Merge Intervals', difficulty: 'Medium', lcNumber: 56, leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 'iv-4', name: 'Non-overlapping Intervals', difficulty: 'Medium', lcNumber: 435, leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { id: 'iv-5', name: 'Meeting Rooms II', difficulty: 'Medium', lcNumber: 253, leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      { id: 'iv-6', name: 'Minimum Interval to Include Each Query', difficulty: 'Hard', lcNumber: 1851, leetcodeUrl: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/' },
    ],
  },

  // ━━━━━━━━━━ Bit Manipulation ━━━━━━━━━━
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    icon: '🔢',
    color: '#94a3b8',
    description: 'Bitwise operations, XOR tricks, and binary number patterns',
    problems: [
      { id: 'bm-1', name: 'Single Number', difficulty: 'Easy', lcNumber: 136, leetcodeUrl: 'https://leetcode.com/problems/single-number/' },
      { id: 'bm-2', name: 'Number of 1 Bits', difficulty: 'Easy', lcNumber: 191, leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/' },
      { id: 'bm-3', name: 'Counting Bits', difficulty: 'Easy', lcNumber: 338, leetcodeUrl: 'https://leetcode.com/problems/counting-bits/' },
      { id: 'bm-4', name: 'Reverse Bits', difficulty: 'Easy', lcNumber: 190, leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/' },
      { id: 'bm-5', name: 'Missing Number', difficulty: 'Easy', lcNumber: 268, leetcodeUrl: 'https://leetcode.com/problems/missing-number/' },
      { id: 'bm-6', name: 'Sum of Two Integers', difficulty: 'Medium', lcNumber: 371, leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/' },
      { id: 'bm-7', name: 'Reverse Integer', difficulty: 'Medium', lcNumber: 7, leetcodeUrl: 'https://leetcode.com/problems/reverse-integer/' },
    ],
  },
];

// ── Helpers ──
export const DIFFICULTY_CONFIG: Record<Difficulty, { color: string; bg: string }> = {
  Easy: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
  Medium: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
  Hard: { color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' },
};

export function getTotalProblems(): number {
  return DSA_TOPICS.reduce((acc, t) => acc + t.problems.length, 0);
}
