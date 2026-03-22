import { CODE_LIBRARY } from './codeLibrary.js';
import type {
  AlgorithmType,
  AlgorithmResult,
  GraphNode,
  GraphEdge,
  RunAlgorithmRequest,
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
const GRAPH_ALGORITHMS = new Set<AlgorithmType>(['bfs', 'dfs', 'dijkstra']);
const TREE_ALGORITHMS = new Set<AlgorithmType>(['bst-insert', 'bst-delete', 'inorder', 'preorder', 'postorder']);
const DP_ALGORITHMS = new Set<AlgorithmType>(['fibonacci-recursive', 'fibonacci-dp', 'knapsack-dp', 'lcs-dp']);

export function runAlgorithm(request: RunAlgorithmRequest): AlgorithmResult {
  const { algorithmKey, data, target, startNodeId } = request;

  let result: { snapshots: any[] };

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
    
    return {
      algorithmKey, languages: CODE_LIBRARY[algorithmKey], snapshots: result.snapshots, totalSteps: result.snapshots.length,
    };
  }

  // ── Searching algorithms ──
  if (SEARCHING_ALGORITHMS.has(algorithmKey)) {
    if (!Array.isArray(data)) throw new Error('Searching algorithms require an array of numbers');
    if (target === undefined) throw new Error('Searching algorithms require a target value');

    switch (algorithmKey) {
      case 'linear-search': result = runLinearSearch(data, target); break;
      case 'binary-search': result = runBinarySearch(data, target); break;
      default: throw new Error(`Unknown searching algorithm: ${algorithmKey}`);
    }

    return {
      algorithmKey, languages: CODE_LIBRARY[algorithmKey], snapshots: result.snapshots, totalSteps: result.snapshots.length,
    };
  }

  // ── Graph algorithms ──
  if (GRAPH_ALGORITHMS.has(algorithmKey)) {
    if (Array.isArray(data)) throw new Error('Graph algorithms require nodes and edges');

    const graphData = data as any;
    if (!startNodeId) throw new Error('Graph algorithms require a startNodeId');

    switch (algorithmKey) {
      case 'bfs': result = runBFS(graphData.nodes, graphData.edges, startNodeId, graphData.isDirected); break;
      case 'dfs': result = runDFS(graphData.nodes, graphData.edges, startNodeId, graphData.isDirected); break;
      case 'dijkstra': result = runDijkstra(graphData, startNodeId); break;
      default: throw new Error(`Unknown graph algorithm: ${algorithmKey}`);
    }

    return {
      algorithmKey, languages: CODE_LIBRARY[algorithmKey], snapshots: result.snapshots, totalSteps: result.snapshots.length,
    };
  }

  // ── Tree algorithms ──
  if (TREE_ALGORITHMS.has(algorithmKey)) {
    if (!Array.isArray(data)) throw new Error('Tree algorithms require an array of numbers');

    switch (algorithmKey) {
      case 'bst-insert': result = runBSTInsert(data); break;
      case 'bst-delete': result = runBSTDelete(data, target ?? data[data.length - 1]); break;
      case 'inorder': result = runInorder(data); break;
      case 'preorder': result = runPreorder(data); break;
      case 'postorder': result = runPostorder(data); break;
      default: throw new Error(`Unknown tree algorithm: ${algorithmKey}`);
    }

    return {
      algorithmKey, languages: CODE_LIBRARY[algorithmKey], snapshots: result.snapshots, totalSteps: result.snapshots.length,
    };
  }

  // ── DP algorithms ──
  if (DP_ALGORITHMS.has(algorithmKey)) {
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
        // data expected as [capacity, ...weights], target expected as comma-sep values string
        if (!Array.isArray(data) || data.length < 3) throw new Error('Knapsack requires: [capacity, w1, w2...] and target as value equivalent');
        const capacity = data[0];
        const half = Math.floor((data.length - 1) / 2);
        const weights = data.slice(1, 1 + half);
        const values = data.slice(1 + half);
        result = runKnapsack(capacity, weights, values);
        break;
      }
      case 'lcs-dp': {
        // Pass two strings via startNodeId field (str1:str2)
        const parts = (startNodeId || 'ABCBDAB:BDCABA').split(':');
        result = runLCS(parts[0], parts[1] || '');
        break;
      }
      default: throw new Error(`Unknown DP algorithm: ${algorithmKey}`);
    }

    return {
      algorithmKey, languages: CODE_LIBRARY[algorithmKey], snapshots: result.snapshots, totalSteps: result.snapshots.length,
    };
  }

  throw new Error(`Unsupported algorithm: ${algorithmKey}`);
}
