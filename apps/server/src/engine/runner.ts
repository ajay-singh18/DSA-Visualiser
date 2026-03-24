import { CODE_LIBRARY } from './codeLibrary.js';
import type {
  AlgorithmType,
  AlgorithmResult,
  GraphNode,
  GraphEdge,
  RunAlgorithmRequest,
  Snapshot,
  PerformanceMetrics,
} from '@dsa-visualizer/shared';

// Sorting
import { runBubbleSort } from './sorting/bubbleSort.js';
import { runMergeSort } from './sorting/mergeSort.js';
import { runQuickSort } from './sorting/quickSort.js';
import { runSelectionSort } from './sorting/selectionSort.js';
import { runInsertionSort } from './sorting/insertionSort.js';

// Searching
import { runLinearSearch } from './searching/linearSearch.js';
import { runBinarySearch } from './searching/binarySearch.js';

// Graph
import { runBFS } from './graph/bfs.js';
import { runDFS } from './graph/dfs.js';
import { runDijkstra } from './graph/dijkstra.js';
import { runPrims } from './graph/prims.js';
import { runKruskals } from './graph/kruskals.js';
import { runBellmanFord } from './graph/bellmanFord.js';
import { runFloydWarshall } from './graph/floydWarshall.js';
import { runAStar } from './graph/aStar.js';

// Tree
import { runBSTInsert } from './tree/bstInsert.js';
import { runBSTDelete } from './tree/bstDelete.js';
import { runInorder, runPreorder, runPostorder } from './tree/traversals.js';

// DP
import { runFibonacciRecursive, runFibonacciDP } from './dp/fibonacci.js';
import { runKnapsack } from './dp/knapsack.js';
import { runLCS } from './dp/lcs.js';

const SORTING_ALGORITHMS = new Set<AlgorithmType>(['bubble-sort', 'merge-sort', 'quick-sort', 'selection-sort', 'insertion-sort']);
const SEARCHING_ALGORITHMS = new Set<AlgorithmType>(['linear-search', 'binary-search']);
const GRAPH_ALGORITHMS = new Set<AlgorithmType>(['bfs', 'dfs', 'dijkstra', 'prims', 'kruskals', 'bellman-ford', 'floyd-warshall', 'a-star']);
const TREE_ALGORITHMS = new Set<AlgorithmType>(['bst-insert', 'bst-delete', 'inorder', 'preorder', 'postorder']);
const DP_ALGORITHMS = new Set<AlgorithmType>(['fibonacci-recursive', 'fibonacci-dp', 'knapsack-dp', 'lcs-dp']);

const COMPLEXITY_MAP: Record<AlgorithmType, { time: string, space: string }> = {
  'bubble-sort': { time: 'O(N^2)', space: 'O(1)' },
  'selection-sort': { time: 'O(N^2)', space: 'O(1)' },
  'insertion-sort': { time: 'O(N^2)', space: 'O(1)' },
  'merge-sort': { time: 'O(N log N)', space: 'O(N)' },
  'quick-sort': { time: 'O(N log N)', space: 'O(log N)' },
  'linear-search': { time: 'O(N)', space: 'O(1)' },
  'binary-search': { time: 'O(log N)', space: 'O(1)' },
  'bfs': { time: 'O(V + E)', space: 'O(V)' },
  'dfs': { time: 'O(V + E)', space: 'O(V)' },
  'dijkstra': { time: 'O((V + E) log V)', space: 'O(V)' },
  'prims': { time: 'O((V + E) log V)', space: 'O(V)' },
  'kruskals': { time: 'O(E log E)', space: 'O(V)' },
  'bellman-ford': { time: 'O(V * E)', space: 'O(V)' },
  'floyd-warshall': { time: 'O(V^3)', space: 'O(V^2)' },
  'a-star': { time: 'O(E)', space: 'O(V)' },
  'bst-insert': { time: 'O(log N)', space: 'O(1)' },
  'bst-delete': { time: 'O(log N)', space: 'O(1)' },
  'inorder': { time: 'O(N)', space: 'O(N)' },
  'preorder': { time: 'O(N)', space: 'O(N)' },
  'postorder': { time: 'O(N)', space: 'O(N)' },
  'fibonacci-recursive': { time: 'O(2^N)', space: 'O(N)' },
  'fibonacci-dp': { time: 'O(N)', space: 'O(N)' },
  'knapsack-dp': { time: 'O(N * W)', space: 'O(N * W)' },
  'lcs-dp': { time: 'O(M * N)', space: 'O(M * N)' }
};

function collectMetrics(snapshots: Snapshot[], timeTakenMs: number, algorithmKey: AlgorithmType): PerformanceMetrics {
  let comparisons = 0;
  let swaps = 0;

  for (const snap of snapshots) {
    if (snap.highlights?.comparing) comparisons++;
    if (snap.highlights?.activeNodes) comparisons++; // Graph/Tree nodes processed
    
    if (snap.highlights?.swapping) swaps++;
    if (snap.highlights?.activeCell) swaps++; // DP array updates
    if (snap.callStack && snap.callStack.length > 0) swaps++; // Recursive stack operations
  }

  const { time, space } = COMPLEXITY_MAP[algorithmKey] || { time: 'O(?)', space: 'O(?)' };

  return {
    timeTakenMs: Math.round(timeTakenMs * 100) / 100, // 2 decimal precision
    comparisons,
    swaps,
    timeComplexity: time,
    spaceComplexity: space
  };
}

export function runAlgorithm(request: RunAlgorithmRequest): AlgorithmResult {
  const { algorithmKey, data, target, startNodeId } = request;

  let result: { snapshots: any[] };

  const startTime = performance.now();

  // ── Sorting algorithms ──
  if (SORTING_ALGORITHMS.has(algorithmKey)) {
    if (!Array.isArray(data)) throw new Error('Sorting algorithms require an array of numbers');
    
    switch (algorithmKey) {
      case 'bubble-sort': result = runBubbleSort(data); break;
      case 'merge-sort': result = runMergeSort(data); break;
      case 'quick-sort': result = runQuickSort(data); break;
      case 'selection-sort': result = runSelectionSort(data); break;
      case 'insertion-sort': result = runInsertionSort(data); break;
      default: throw new Error(`Unknown sorting algorithm: ${algorithmKey}`);
    }
  }

  // ── Searching algorithms ──
  else if (SEARCHING_ALGORITHMS.has(algorithmKey)) {
    if (!Array.isArray(data)) throw new Error('Searching algorithms require an array of numbers');
    if (target === undefined) throw new Error('Searching algorithms require a target value');

    switch (algorithmKey) {
      case 'linear-search': result = runLinearSearch(data, target); break;
      case 'binary-search': result = runBinarySearch(data, target); break;
      default: throw new Error(`Unknown searching algorithm: ${algorithmKey}`);
    }
  }

  // ── Graph algorithms ──
  else if (GRAPH_ALGORITHMS.has(algorithmKey)) {
    if (Array.isArray(data)) throw new Error('Graph algorithms require nodes and edges');

    const graphData = data as any;
    if (!startNodeId) throw new Error('Graph algorithms require a startNodeId');

    switch (algorithmKey) {
      case 'bfs': result = runBFS(graphData.nodes, graphData.edges, startNodeId, graphData.isDirected); break;
      case 'dfs': result = runDFS(graphData.nodes, graphData.edges, startNodeId, graphData.isDirected); break;
      case 'dijkstra': result = runDijkstra(graphData, startNodeId); break;
      case 'prims': result = runPrims(graphData, startNodeId); break;
      case 'kruskals': result = runKruskals(graphData); break;
      case 'bellman-ford': result = runBellmanFord(graphData, startNodeId); break;
      case 'floyd-warshall': result = runFloydWarshall(graphData); break;
      case 'a-star': {
        const targetNodeId = request.targetNodeId || graphData.nodes[graphData.nodes.length - 1]?.id;
        if (!targetNodeId) throw new Error('A* requires a targetNodeId');
        result = runAStar(graphData, startNodeId, targetNodeId); 
        break;
      }
      default: throw new Error(`Unknown graph algorithm: ${algorithmKey}`);
    }
  }

  // ── Tree algorithms ──
  else if (TREE_ALGORITHMS.has(algorithmKey)) {
    if (!Array.isArray(data)) throw new Error('Tree algorithms require an array of numbers or nulls');

    switch (algorithmKey) {
      case 'bst-insert': result = runBSTInsert(data.filter((n: any) => n !== null)); break;
      case 'bst-delete': {
        const validData = data.filter((n: any) => n !== null);
        result = runBSTDelete(validData, target ?? validData[validData.length - 1]); 
        break;
      }
      case 'inorder': result = runInorder(data); break;
      case 'preorder': result = runPreorder(data); break;
      case 'postorder': result = runPostorder(data); break;
      default: throw new Error(`Unknown tree algorithm: ${algorithmKey}`);
    }
  }

  // ── DP algorithms ──
  else if (DP_ALGORITHMS.has(algorithmKey)) {
    switch (algorithmKey) {
      case 'fibonacci-recursive': {
        const n = Array.isArray(data) ? data[0] : (target ?? 8);
        result = runFibonacciRecursive(n);
        break;
      }
      case 'fibonacci-dp': {
        const n = Array.isArray(data) ? data[0] : (target ?? 10);
        result = runFibonacciDP(n);
        break;
      }
      case 'knapsack-dp': {
        if (!Array.isArray(data) || data.length < 3) throw new Error('Knapsack requires: [capacity, w1, w2...] and target as value equivalent');
        const capacity = data[0];
        const half = Math.floor((data.length - 1) / 2);
        const weights = data.slice(1, 1 + half);
        const values = data.slice(1 + half);
        result = runKnapsack(capacity, weights, values);
        break;
      }
      case 'lcs-dp': {
        const parts = (startNodeId || 'ABCBDAB:BDCABA').split(':');
        result = runLCS(parts[0], parts[1] || '');
        break;
      }
      default: throw new Error(`Unknown DP algorithm: ${algorithmKey}`);
    }
  } else {
    throw new Error(`Unsupported algorithm: ${algorithmKey}`);
  }

  const timeTakenMs = performance.now() - startTime;

  return {
    algorithmKey, 
    languages: CODE_LIBRARY[algorithmKey], 
    snapshots: result.snapshots, 
    totalSteps: result.snapshots.length,
    metrics: collectMetrics(result.snapshots, timeTakenMs, algorithmKey)
  };
}
