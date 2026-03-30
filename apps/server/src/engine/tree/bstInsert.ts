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

function insertIntoBSTLocal(root: BSTNode | null, value: number): BSTNode {
  if (!root) return createNode(value);
  if (value < root.value) root.left = insertIntoBSTLocal(root.left, value);
  else if (value > root.value) root.right = insertIntoBSTLocal(root.right, value);
  return root;
}

function insertIntoBST(root: BSTNode | null, value: number, snapshots: Snapshot[], step: { count: number }, getGlobalRoot: () => BSTNode | null, callStack: string[]): BSTNode {
  const stackPush = `insert(${value})`;
  const nextStack = root ? [...callStack, stackPush] : callStack;
  if (root === null) {
    const newNode = createNode(value);
    const tree = layoutTree(getGlobalRoot() || newNode);
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 2, // if (node === null) return new Node(key);
      description: `Created new node with value ${value}`,
      treeState: tree,
      highlights: { activeNodes: [newNode.id] },
      callStack: nextStack,
      variables: { inserting: value },
    });
    return newNode;
  }

  snapshots.push({
    stepIndex: step.count++,
    codeLine: 3, // if (key < node.key)
    description: `Comparing ${value} with node ${root.value}`,
    treeState: layoutTree(getGlobalRoot()),
    highlights: { activeNodes: [root.id] },
    callStack: nextStack,
    variables: { inserting: value, rootVal: root.value },
  });

  if (value < root.value) {
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 4, // node.left = insert(node.left, key);
      description: `${value} < ${root.value}, go left`,
      treeState: layoutTree(getGlobalRoot()),
      highlights: { activeNodes: [root.id], pathNodes: root.left ? [root.left.id] : [] },
      callStack: nextStack,
      variables: { inserting: value, rootVal: root.value },
    });
    root.left = insertIntoBST(root.left, value, snapshots, step, getGlobalRoot, nextStack);
  } else if (value > root.value) {
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 6, // node.right = insert(node.right, key);
      description: `${value} > ${root.value}, go right`,
      treeState: layoutTree(getGlobalRoot()),
      highlights: { activeNodes: [root.id], pathNodes: root.right ? [root.right.id] : [] },
      callStack: nextStack,
      variables: { inserting: value, rootVal: root.value },
    });
    root.right = insertIntoBST(root.right, value, snapshots, step, getGlobalRoot, nextStack);
  }

  return root;
}

export function runBSTInsert(values: number[], target?: number): {
  snapshots: Snapshot[];
} {
  nodeCounter = 0;
  const snapshots: Snapshot[] = [];
  const step = { count: 0 };

  let root: BSTNode | null = null;
  const getGlobalRoot = () => root;
  
  if (target !== undefined && target !== null) {
    // Build existing tree silently
    for (const val of values) {
      root = insertIntoBSTLocal(root, val);
    }
    
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 1, // function insert(node, key)
      description: `Starting insertion of ${target} into pre-existing BST`,
      treeState: layoutTree(root),
      highlights: {},
      callStack: [],
      variables: {},
    });

    root = insertIntoBST(root, target, snapshots, step, getGlobalRoot, []);

    snapshots.push({
      stepIndex: step.count++,
      codeLine: 9, // return node;
      description: `Inserted ${target} successfully!`,
      treeState: layoutTree(root),
      highlights: { pathNodes: layoutTree(root).map(n => n.id) },
      callStack: [],
      variables: {},
    });
  } else {
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 1, // function insert(node, key)
      description: `Inserting values [${values.join(', ')}] into BST`,
      treeState: [],
      highlights: {},
      callStack: [],
      variables: {},
    });

    for (const val of values) {
      root = insertIntoBST(root, val, snapshots, step, getGlobalRoot, []);

      // After each insertion, show the full tree state
      snapshots.push({
        stepIndex: step.count++,
        codeLine: 9, // return node;
        description: `Inserted ${val}. Tree updated.`,
        treeState: layoutTree(root),
        highlights: {},
        callStack: [],
        variables: { lastInserted: val },
      });
    }

    snapshots.push({
      stepIndex: step.count++,
      codeLine: 9, // return node;
      description: 'BST construction complete!',
      treeState: layoutTree(root),
      highlights: { pathNodes: layoutTree(root).map(n => n.id) },
      callStack: [],
      variables: {},
    });
  }

  return { snapshots };
}
