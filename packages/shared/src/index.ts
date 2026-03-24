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
  | 'prims'
  | 'kruskals'
  | 'bellman-ford'
  | 'floyd-warshall'
  | 'a-star'
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
  variables?: Record<string, string | number>;
  highlights?: SnapshotHighlights;
}

export interface PerformanceMetrics {
  timeTakenMs: number;
  comparisons: number;
  swaps: number; // or general operations for graphs/trees
  timeComplexity: string;
  spaceComplexity: string;
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
  metrics?: PerformanceMetrics;
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
  target?: number;
  data?: any; // e.g. number[] | (number | null)[] | string | { nodes: GraphNode[], edges: GraphEdge[], isDirected: boolean }
  startNodeId?: string;
  targetNodeId?: string;
}

// ── Assessment types ────────────────────────────────────────

export type QuestionCategory = 'sorting' | 'searching' | 'graph' | 'tree' | 'dp' | 'logic';

export type QuestionType = 'mcq' | 'predict-state' | 'find-bug' | 'logic';

export interface AssessmentQuestion {
  id: string;
  category: QuestionCategory;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  options?: string[];           // MCQ choices
  codeSnippet?: string;         // For predict-state, find-bug & logic
  codeLanguage?: 'typescript' | 'cpp' | 'javascript' | 'java';
  timeLimitSeconds?: number;    // Auto-derived from difficulty (easy=30, medium=60, hard=90)
  // NOTE: `correctAnswer` is NEVER sent to the client
}

export interface AssessmentConfig {
  category: QuestionCategory;
  questionCount: number;        // e.g. 10
  timeLimitMinutes: number;     // e.g. 15
}

export interface AssessmentSubmission {
  sessionId: string;
  answers: { questionId: string; answer: string }[];
}

export interface AssessmentResultItem {
  questionId: string;
  question: AssessmentQuestion;
  userAnswer: string;
  correctAnswer: string;        // Revealed ONLY after submission
  isCorrect: boolean;
}

export interface AssessmentResult {
  sessionId: string;
  score: number;
  total: number;
  percentage: number;
  timeTakenSeconds: number;
  results: AssessmentResultItem[];
}
