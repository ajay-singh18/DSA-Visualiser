import type { Snapshot, TreeNodeData } from '@dsa-visualizer/shared';



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

function layoutTree(root: BSTNode | null, x: number = 400, y: number = 60, spread: number = 160): TreeNodeData[] {
  if (!root) return [];
  const nodes: TreeNodeData[] = [];
  function traverse(node: BSTNode | null, cx: number, cy: number, gap: number): void {
    if (!node) return;
    nodes.push({
      id: node.id,
      value: node.value,
      left: node.left?.id ?? null,
      right: node.right?.id ?? null,
      x: cx,
      y: cy,
    });
    traverse(node.left, cx - gap, cy + 80, gap / 1.8);
    traverse(node.right, cx + gap, cy + 80, gap / 1.8);
  }
  traverse(root, x, y, spread);
  return nodes;
}

function insertIntoBST(root: BSTNode | null, value: number, snapshots: Snapshot[], step: { count: number }): BSTNode {
  if (root === null) {
    const newNode = createNode(value);
    const tree = layoutTree(newNode);
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 3,
      description: `Created new node with value ${value}`,
      treeState: tree,
      highlights: { activeNodes: [newNode.id] },
    });
    return newNode;
  }

  snapshots.push({
    stepIndex: step.count++,
    codeLine: 5,
    description: `Comparing ${value} with node ${root.value}`,
    treeState: layoutTree(root),
    highlights: { activeNodes: [root.id] },
  });

  if (value < root.value) {
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 6,
      description: `${value} < ${root.value}, go left`,
      treeState: layoutTree(root),
      highlights: { activeNodes: [root.id], pathNodes: root.left ? [root.left.id] : [] },
    });
    root.left = insertIntoBST(root.left, value, snapshots, step);
  } else if (value > root.value) {
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 8,
      description: `${value} > ${root.value}, go right`,
      treeState: layoutTree(root),
      highlights: { activeNodes: [root.id], pathNodes: root.right ? [root.right.id] : [] },
    });
    root.right = insertIntoBST(root.right, value, snapshots, step);
  }

  return root;
}

export function runBSTInsert(values: number[]): {
  snapshots: Snapshot[];
} {
  nodeCounter = 0;
  const snapshots: Snapshot[] = [];
  const step = { count: 0 };

  snapshots.push({
    stepIndex: step.count++,
    codeLine: 1,
    description: `Inserting values [${values.join(', ')}] into BST`,
    treeState: [],
    highlights: {},
  });

  let root: BSTNode | null = null;
  for (const val of values) {
    root = insertIntoBST(root, val, snapshots, step);

    // After each insertion, show the full tree state
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 10,
      description: `Inserted ${val}. Tree updated.`,
      treeState: layoutTree(root),
      highlights: {},
    });
  }

  snapshots.push({
    stepIndex: step.count++,
    codeLine: 11,
    description: 'BST construction complete!',
    treeState: layoutTree(root),
    highlights: { pathNodes: layoutTree(root).map(n => n.id) },
  });

  return { snapshots };
}
