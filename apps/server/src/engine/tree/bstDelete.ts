import type { Snapshot, TreeNodeData } from '@dsa-visualizer/shared';



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

function insertNode(root: BSTNode | null, value: number): BSTNode {
  if (!root) return createNode(value);
  if (value < root.value) root.left = insertNode(root.left, value);
  else if (value > root.value) root.right = insertNode(root.right, value);
  return root;
}

function deleteNode(root: BSTNode | null, key: number, snapshots: Snapshot[], step: { count: number }): BSTNode | null {
  if (!root) {
    snapshots.push({ stepIndex: step.count++, codeLine: 2, description: `Node ${key} not found`, treeState: [], highlights: {} });
    return null;
  }

  snapshots.push({
    stepIndex: step.count++, codeLine: 3,
    description: `Comparing ${key} with node ${root.value}`,
    treeState: layoutTree(root), highlights: { activeNodes: [root.id] },
  });

  if (key < root.value) {
    snapshots.push({ stepIndex: step.count++, codeLine: 4, description: `${key} < ${root.value}, go left`, treeState: layoutTree(root), highlights: { activeNodes: [root.id] } });
    root.left = deleteNode(root.left, key, snapshots, step);
  } else if (key > root.value) {
    snapshots.push({ stepIndex: step.count++, codeLine: 6, description: `${key} > ${root.value}, go right`, treeState: layoutTree(root), highlights: { activeNodes: [root.id] } });
    root.right = deleteNode(root.right, key, snapshots, step);
  } else {
    // Found node to delete
    snapshots.push({ stepIndex: step.count++, codeLine: 8, description: `Found node ${key} — deleting`, treeState: layoutTree(root), highlights: { activeNodes: [root.id] } });

    if (!root.left) {
      snapshots.push({ stepIndex: step.count++, codeLine: 9, description: `No left child, replace with right subtree`, treeState: layoutTree(root), highlights: { activeNodes: [root.id] } });
      return root.right;
    }
    if (!root.right) {
      snapshots.push({ stepIndex: step.count++, codeLine: 10, description: `No right child, replace with left subtree`, treeState: layoutTree(root), highlights: { activeNodes: [root.id] } });
      return root.left;
    }

    // Find inorder successor
    let successor = root.right;
    while (successor.left) successor = successor.left;
    snapshots.push({ stepIndex: step.count++, codeLine: 12, description: `Inorder successor is ${successor.value}`, treeState: layoutTree(root), highlights: { activeNodes: [root.id, successor.id] } });
    root.value = successor.value;
    root.id = successor.id; // Keep successor's id for visual continuity... actually keep original
    root.right = deleteNode(root.right, successor.value, snapshots, step);
  }
  return root;
}

export function runBSTDelete(values: number[], deleteKey: number): {
  snapshots: Snapshot[];
} {
  nodeCounter = 0;
  const snapshots: Snapshot[] = [];
  const step = { count: 0 };

  // Build initial tree
  let root: BSTNode | null = null;
  for (const v of values) root = insertNode(root, v);

  snapshots.push({
    stepIndex: step.count++, codeLine: 1,
    description: `BST built from [${values.join(', ')}]. Deleting ${deleteKey}...`,
    treeState: layoutTree(root), highlights: {},
  });

  root = deleteNode(root, deleteKey, snapshots, step);

  snapshots.push({
    stepIndex: step.count++, codeLine: 16,
    description: `Deletion complete!`,
    treeState: root ? layoutTree(root) : [], highlights: {},
  });

  return { snapshots };
}
