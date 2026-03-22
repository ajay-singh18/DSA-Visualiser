// ── Algorithm types ──────────────────────────────────────────

export type AlgorithmType =
  | 'bubble-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'linear-search'
  | 'binary-search'
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'bst-insert'
  | 'bst-delete'
  | 'inorder'
  | 'preorder'
  | 'postorder'
  | 'fibonacci-recursive'
  | 'fibonacci-dp'
  | 'knapsack-dp'
  | 'lcs-dp';

export type AlgorithmCategory = 'sorting' | 'searching' | 'graph' | 'tree' | 'dp';

export interface AlgorithmMeta {
  key: AlgorithmType;
  name: string;
  category: AlgorithmCategory;
  description: string;
}

// ── Tree types ──────────────────────────────────────────────

export interface TreeNodeData {
  id: string;
  value: number;
  left?: string | null;   // id of left child
  right?: string | null;  // id of right child
  x: number;
  y: number;
}

// ── Snapshot types ───────────────────────────────────────────

export interface SnapshotHighlights {
  comparing?: (number | string)[];
  swapping?: (number | string)[];
  sorted?: (number | string)[];
  visited?: string[];
  queue?: string[];
  stack?: string[];
  currentNode?: string;
  activeNodes?: string[];    // for tree nodes being processed
  pathNodes?: string[];      // for traversal path visualization
  activeCell?: [number, number];  // for DP table highlight [row, col]
}

export interface Snapshot {
  stepIndex: number;
  codeLine: number;
  description: string;
  arrayState?: number[];
  treeState?: TreeNodeData[];
  dpTable?: (number | string)[][];  // for DP table visualization
  callStack?: string[];             // for recursion tree visualization
  highlights?: SnapshotHighlights;
}

export interface AlgorithmResult {
  algorithmKey: AlgorithmType;
  languages: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
  snapshots: Snapshot[];
  totalSteps: number;
}

// ── Graph types ─────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  value?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

// ── User types ──────────────────────────────────────────────

export interface UserDTO {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
}

// ── Layout types ────────────────────────────────────────────

export type DataType = 'array' | 'graph' | 'tree';

export interface CustomLayoutDTO {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dataType: DataType;
  arrayData?: number[];
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  isDirected?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Bookmark types ──────────────────────────────────────────

export interface BookmarkDTO {
  id: string;
  userId: string;
  layoutId: string;
  algorithmKey: AlgorithmType;
  snapshotIndex: number;
  playbackSpeed: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── API request types ───────────────────────────────────────

export interface RunAlgorithmRequest {
  algorithmKey: AlgorithmType;
  data: number[] | { nodes: GraphNode[]; edges: GraphEdge[]; isDirected?: boolean };
  target?: number;
  startNodeId?: string;
}
