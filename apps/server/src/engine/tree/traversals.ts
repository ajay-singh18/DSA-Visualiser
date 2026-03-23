import type { Snapshot, TreeNodeData } from '@dsa-visualizer/shared';

// ── Traversal source code ──







// ── BST helpers ──

interface BSTNode {
  id: string;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

let nodeCounter = 0;
function createNode(value: number): BSTNode {
  return { id: `n${nodeCounter++}`, value, left: null, right: null };
}

function insertNode(root: BSTNode | null, value: number): BSTNode {
  if (!root) return createNode(value);
  if (value < root.value) root.left = insertNode(root.left, value);
  else if (value > root.value) root.right = insertNode(root.right, value);
  return root;
}

function layoutTree(root: BSTNode | null, x = 400, y = 60, spread = 160): TreeNodeData[] {
  if (!root) return [];
  const nodes: TreeNodeData[] = [];
  function traverse(node: BSTNode | null, cx: number, cy: number, gap: number): void {
    if (!node) return;
    nodes.push({ id: node.id, value: node.value, left: node.left?.id ?? null, right: node.right?.id ?? null, x: cx, y: cy });
    traverse(node.left, cx - gap, cy + 80, gap / 1.8);
    traverse(node.right, cx + gap, cy + 80, gap / 1.8);
  }
  traverse(root, x, y, spread);
  return nodes;
}

// ── Traversal engines ──

function inorderTraversal(node: BSTNode | null, root: BSTNode, visited: string[], snapshots: Snapshot[], step: { count: number }, callStack: string[]): void {
  if (!node) return;

  const stackPush = `inorder(${node.value})`;
  const nextStack = [...callStack, stackPush];

  snapshots.push({
    stepIndex: step.count++, codeLine: 3, // inorder(root.left);
    description: `Go left from ${node.value}`,
    treeState: layoutTree(root), highlights: { activeNodes: [node.id], pathNodes: [...visited] },
    callStack: nextStack, variables: { node: node.value },
  });

  inorderTraversal(node.left, root, visited, snapshots, step, nextStack);

  visited.push(node.id);
  snapshots.push({
    stepIndex: step.count++, codeLine: 4, // console.log(root.val);
    description: `Visit node ${node.value}`,
    treeState: layoutTree(root), highlights: { activeNodes: [node.id], pathNodes: [...visited] },
    callStack: nextStack, variables: { visiting: node.value },
  });

  inorderTraversal(node.right, root, visited, snapshots, step, nextStack);
}

function preorderTraversal(node: BSTNode | null, root: BSTNode, visited: string[], snapshots: Snapshot[], step: { count: number }, callStack: string[]): void {
  if (!node) return;

  const stackPush = `preorder(${node.value})`;
  const nextStack = [...callStack, stackPush];

  visited.push(node.id);
  snapshots.push({
    stepIndex: step.count++, codeLine: 3, // console.log(root.val);
    description: `Visit node ${node.value}`,
    treeState: layoutTree(root), highlights: { activeNodes: [node.id], pathNodes: [...visited] },
    callStack: nextStack, variables: { visiting: node.value },
  });

  preorderTraversal(node.left, root, visited, snapshots, step, nextStack);
  preorderTraversal(node.right, root, visited, snapshots, step, nextStack);
}

function postorderTraversal(node: BSTNode | null, root: BSTNode, visited: string[], snapshots: Snapshot[], step: { count: number }, callStack: string[]): void {
  if (!node) return;

  const stackPush = `postorder(${node.value})`;
  const nextStack = [...callStack, stackPush];

  snapshots.push({
    stepIndex: step.count++, codeLine: 3,
    description: `Go left from ${node.value}`,
    treeState: layoutTree(root), highlights: { activeNodes: [node.id], pathNodes: [...visited] },
    callStack: nextStack, variables: { node: node.value },
  });

  postorderTraversal(node.left, root, visited, snapshots, step, nextStack);
  postorderTraversal(node.right, root, visited, snapshots, step, nextStack);

  visited.push(node.id);
  snapshots.push({
    stepIndex: step.count++, codeLine: 5, // console.log(root.val);
    description: `Visit node ${node.value}`,
    treeState: layoutTree(root), highlights: { activeNodes: [node.id], pathNodes: [...visited] },
    callStack: nextStack, variables: { visiting: node.value },
  });
}

// ── Exported runners ──

export function runInorder(values: number[]): { snapshots: Snapshot[]; } {
  nodeCounter = 0;
  let root: BSTNode | null = null;
  for (const v of values) root = insertNode(root, v);

  const snapshots: Snapshot[] = [];
  const step = { count: 0 };

  snapshots.push({ stepIndex: step.count++, codeLine: 1, description: `Inorder traversal of BST [${values.join(', ')}]`, treeState: layoutTree(root!), highlights: {}, callStack: [] });
  inorderTraversal(root, root!, [], snapshots, step, []);
  snapshots.push({ stepIndex: step.count++, codeLine: 7, description: 'Inorder traversal complete!', treeState: layoutTree(root!), highlights: { pathNodes: layoutTree(root!).map(n => n.id) }, callStack: [], variables: {} });

  return { snapshots };
}

export function runPreorder(values: number[]): { snapshots: Snapshot[]; } {
  nodeCounter = 0;
  let root: BSTNode | null = null;
  for (const v of values) root = insertNode(root, v);

  const snapshots: Snapshot[] = [];
  const step = { count: 0 };

  snapshots.push({ stepIndex: step.count++, codeLine: 1, description: `Preorder traversal of BST [${values.join(', ')}]`, treeState: layoutTree(root!), highlights: {}, callStack: [] });
  preorderTraversal(root, root!, [], snapshots, step, []);
  snapshots.push({ stepIndex: step.count++, codeLine: 7, description: 'Preorder traversal complete!', treeState: layoutTree(root!), highlights: { pathNodes: layoutTree(root!).map(n => n.id) }, callStack: [], variables: {} });

  return { snapshots };
}

export function runPostorder(values: number[]): { snapshots: Snapshot[]; } {
  nodeCounter = 0;
  let root: BSTNode | null = null;
  for (const v of values) root = insertNode(root, v);

  const snapshots: Snapshot[] = [];
  const step = { count: 0 };

  snapshots.push({ stepIndex: step.count++, codeLine: 1, description: `Postorder traversal of BST [${values.join(', ')}]`, treeState: layoutTree(root!), highlights: {}, callStack: [] });
  postorderTraversal(root, root!, [], snapshots, step, []);
  snapshots.push({ stepIndex: step.count++, codeLine: 7, description: 'Postorder traversal complete!', treeState: layoutTree(root!), highlights: { pathNodes: layoutTree(root!).map(n => n.id) }, callStack: [], variables: {} });

  return { snapshots };
}
