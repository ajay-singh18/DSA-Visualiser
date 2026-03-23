import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Question } from '../models/Question.js';
import type { QuestionCategory, QuestionType } from '@dsa-visualizer/shared';

// Helper types for the seed data
type SeedQuestion = {
  category: QuestionCategory;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  options?: string[];
  codeSnippet?: string;
  codeLanguage?: 'typescript' | 'cpp';
  correctAnswer: string;
};

const questions: SeedQuestion[] = [
  // --- SORTING ---
  {
    category: 'sorting',
    type: 'mcq',
    difficulty: 'easy',
    title: 'Bubble Sort Time Complexity',
    description: 'What is the worst-case time complexity of Bubble Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    correctAnswer: 'O(n^2)'
  },
  {
    category: 'sorting',
    type: 'mcq',
    difficulty: 'medium',
    title: 'Quick Sort Pivot',
    description: 'If the pivot is always chosen as the largest or smallest element in an array, what is the time complexity of Quick Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    correctAnswer: 'O(n^2)'
  },
  {
    category: 'sorting',
    type: 'predict-state',
    difficulty: 'easy',
    title: 'Selection Sort Pass',
    description: 'Given the array [5, 3, 8, 2, 1, 4], what will the array look like after the FIRST complete pass of Selection Sort (finding the minimum and swapping it to the front)? Provide your answer as a comma-separated list without brackets.',
    correctAnswer: '1, 3, 8, 2, 5, 4'
  },
  {
    category: 'sorting',
    type: 'predict-state',
    difficulty: 'medium',
    title: 'Insertion Sort Iteration',
    description: 'Given the array [4, 7, 2, 8, 1], what is the state of the array after the number 2 is inserted into its correct sorted position?',
    correctAnswer: '2, 4, 7, 8, 1'
  },
  {
    category: 'sorting',
    type: 'find-bug',
    difficulty: 'medium',
    title: 'Merge Sort Recursion Bug',
    description: 'Identify the line causing an infinite recursion bug in this Merge Sort implementation.',
    codeLanguage: 'typescript',
    codeSnippet: `1: function mergeSort(arr: number[]): number[] {
2:   if (arr.length <= 1) return arr;
3:   const mid = Math.floor(arr.length / 2);
4:   // BUG IS HERE:
5:   const left = mergeSort(arr.slice(0, mid + 1)); 
6:   const right = mergeSort(arr.slice(mid + 1));
7:   return merge(left, right);
8: }`,
    options: ['Line 2', 'Line 3', 'Line 5', 'Line 7'],
    correctAnswer: 'Line 5'
  },
  
  // --- SEARCHING ---
  {
    category: 'searching',
    type: 'mcq',
    difficulty: 'easy',
    title: 'Binary Search Requirement',
    description: 'What is the fundamental prerequisite for an array before you can perform a Binary Search?',
    options: ['It must contain only positive integers', 'It must be sorted', 'It must have an odd length', 'It must not contain duplicates'],
    correctAnswer: 'It must be sorted'
  },
  {
    category: 'searching',
    type: 'predict-state',
    difficulty: 'medium',
    title: 'Binary Search Pointers',
    description: 'You are applying Binary Search on [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] looking for the target "23". What are the indices of (low, mid, high) on the VERY FIRST check?',
    correctAnswer: '0, 4, 9'
  },
  {
    category: 'searching',
    type: 'find-bug',
    difficulty: 'hard',
    title: 'Binary Search Overflow',
    description: 'Which line contains the classic integer overflow bug when calculating the midpoint in languages with bounded integers?',
    codeLanguage: 'cpp',
    codeSnippet: `1: int binarySearch(int arr[], int l, int r, int x) {
2:     while (l <= r) {
3:         int m = (l + r) / 2;
4:         if (arr[m] == x) return m;
5:         if (arr[m] < x) l = m + 1;
6:         else r = m - 1;
7:     }
8:     return -1;
9: }`,
    options: ['Line 2', 'Line 3', 'Line 5', 'Line 6'],
    correctAnswer: 'Line 3'
  },

  // --- GRAPH ---
  {
    category: 'graph',
    type: 'mcq',
    difficulty: 'easy',
    title: 'BFS Queue',
    description: 'Which data structure is fundamentally used to process nodes in Breadth-First Search (BFS)?',
    options: ['Stack', 'Queue', 'Priority Queue', 'Hash Map'],
    correctAnswer: 'Queue'
  },
  {
    category: 'graph',
    type: 'predict-state',
    difficulty: 'medium',
    title: 'DFS Traversal Path',
    description: 'Given a directed graph A->B, A->C, B->D, C->D. If we start a standard Depth-First Search (DFS) from A, and always visit alphabetical neighbors first, what is the exact visit order?',
    correctAnswer: 'A, B, D, C'
  },
  {
    category: 'graph',
    type: 'find-bug',
    difficulty: 'medium',
    title: 'Graph Cycle Infinite Loop',
    description: 'Why will this DFS implementation crash on a graph with cycles?',
    codeLanguage: 'typescript',
    codeSnippet: `1: function dfs(graph: Record<string, string[]>, start: string) {
2:   const stack = [start];
3:   while (stack.length > 0) {
4:     const node = stack.pop()!;
5:     console.log(node);
6:     for (const neighbor of graph[node] || []) {
7:       stack.push(neighbor);
8:     }
9:   }
10: }`,
    options: ['It uses a Stack instead of a Queue', 'It pops from the end instead of the front', 'It does not track a visited Set', 'It pushes neighbors in the wrong order'],
    correctAnswer: 'It does not track a visited Set'
  },

  // --- TREE ---
  {
    category: 'tree',
    type: 'mcq',
    difficulty: 'medium',
    title: 'Traversal Order',
    description: 'Which tree traversal visits the Left subtree, then the Right subtree, and finally the Root node?',
    options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
    correctAnswer: 'Postorder'
  },
  {
    category: 'tree',
    type: 'predict-state',
    difficulty: 'hard',
    title: 'BST Deletion Target',
    description: 'In a standard Binary Search Tree, if you delete a node that has TWO children, what node is typically used to replace it?',
    options: ['The largest node in the Left subtree OR the smallest node in the Right subtree', 'The immediate parent node', 'The Left child directly', 'The node with the deepest height'],
    correctAnswer: 'The largest node in the Left subtree OR the smallest node in the Right subtree'
  },
  {
    category: 'tree',
    type: 'find-bug',
    difficulty: 'easy',
    title: 'BST Insert Bug',
    description: 'Find the bug in this BST insert operation.',
    codeLanguage: 'typescript',
    codeSnippet: `1: function insert(root: TreeNode | null, val: number): TreeNode {
2:   if (!root) return new TreeNode(val);
3:   if (val < root.val) {
4:     root.left = insert(root.left, val);
5:   } else {
6:     insert(root.right, val); // BUG HERE
7:   }
8:   return root;
9: }`,
    options: ['Line 2', 'Line 4', 'Line 6', 'Line 8'],
    correctAnswer: 'Line 6'
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    category: 'dp',
    type: 'mcq',
    difficulty: 'easy',
    title: 'Core Concept',
    description: 'What are the two main requirements for a problem to be solvable by Dynamic Programming?',
    options: ['Greedy Choice and Sorting', 'Optimal Substructure and Overlapping Subproblems', 'Recursion and Graph Cycles', 'Divide and Conquer'],
    correctAnswer: 'Optimal Substructure and Overlapping Subproblems'
  },
  {
    category: 'dp',
    type: 'predict-state',
    difficulty: 'medium',
    title: 'Fibonacci Array',
    description: 'If solving Fibonacci using bottom-up DP starting with [0, 1], what are the exact values of the dp array for indices 0 through 5?',
    correctAnswer: '0, 1, 1, 2, 3, 5'
  },
  {
    category: 'dp',
    type: 'find-bug',
    difficulty: 'hard',
    title: 'Coin Change Logic',
    description: 'Identify the flaw in this top-down DP approach for the Coin Change problem (minimizing coins).',
    codeLanguage: 'typescript',
    codeSnippet: `1: function minCoins(coins: number[], amount: number, memo = {}) {
2:   if (amount === 0) return 0;
3:   if (amount < 0) return Infinity;
4:   if (memo[amount]) return memo[amount];
5:   
6:   let min = Infinity;
7:   for (const coin of coins) {
8:     min = Math.min(min, 1 + minCoins(coins, amount - coin, memo));
9:   }
10:  memo[amount] = min;
11:  return min;
12: }`,
    options: ['Line 3 should return 0', 'Line 4 should check memo[amount] !== undefined', 'Line 8 should be min = 1 + ...', 'There is no bug'],
    correctAnswer: 'Line 4 should check memo[amount] !== undefined'
  }
];

async function seed() {
  console.log('🌱 Connecting to database...');
  await mongoose.connect(env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  console.log('🗑️  Clearing existing questions...');
  await Question.deleteMany({});
  
  console.log(\`📦 Seeding \${questions.length} questions...\`);
  try {
    const result = await Question.insertMany(questions);
    console.log(\`✅ Successfully inserted \${result.length} questions.\`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    console.log('🔌 Disconnecting...');
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
