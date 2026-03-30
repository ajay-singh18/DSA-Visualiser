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

// Helper function for initial tree construction without snapshots
function insertIntoBSTLocal(root: BSTNode | null, value: number): BSTNode {
  if (!root) return createNode(value);
  if (value < root.value) {
    root.left = insertIntoBSTLocal(root.left, value);
  } else if (value > root.value) {
    root.right = insertIntoBSTLocal(root.right, value);
  }
  return root;
}

// Helper function to find the minimum node in a BST
function findMin(node: BSTNode): BSTNode {
  let current = node;
  while (current.left !== null) {
    current = current.left;
  }
  return current;
}

function deleteNode(root: BSTNode | null, value: number, snapshots: Snapshot[], step: { count: number }, getGlobalRoot: () => BSTNode | null, callStack: string[]): BSTNode | null {
  const stackPush = `delete(${value})`;
  const nextStack = root ? [...callStack, stackPush] : callStack;

  if (root === null) {
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 2, // if (node === null) return node;
      description: `Value ${value} not found in the tree`,
      treeState: layoutTree(getGlobalRoot()),
      highlights: {},
      callStack: nextStack,
      variables: { deleting: value },
    });
    return null;
  }

  snapshots.push({
    stepIndex: step.count++,
    codeLine: 3, // if (key < node.key)
    description: `Comparing ${value} with node ${root.value}`,
    treeState: layoutTree(getGlobalRoot()),
    highlights: { activeNodes: [root.id] },
    callStack: nextStack,
    variables: { deleting: value, rootVal: root.value },
  });

  if (value < root.value) {
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 4, // node.left = deleteNode(node.left, key);
      description: `${value} < ${root.value}, go left`,
      treeState: layoutTree(getGlobalRoot()),
      highlights: { activeNodes: [root.id], pathNodes: root.left ? [root.left.id] : [] },
      callStack: nextStack,
      variables: { deleting: value, rootVal: root.value },
    });
    root.left = deleteNode(root.left, value, snapshots, step, getGlobalRoot, nextStack);
  } else if (value > root.value) {
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 6, // node.right = deleteNode(node.right, key);
      description: `${value} > ${root.value}, go right`,
      treeState: layoutTree(getGlobalRoot()),
      highlights: { activeNodes: [root.id], pathNodes: root.right ? [root.right.id] : [] },
      callStack: nextStack,
      variables: { deleting: value, rootVal: root.value },
    });
    root.right = deleteNode(root.right, value, snapshots, step, getGlobalRoot, nextStack);
  } else {
    // Node found
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 8, // else (node found)
      description: `Found node ${root.value} to delete`,
      treeState: layoutTree(getGlobalRoot()),
      highlights: { activeNodes: [root.id] },
      callStack: nextStack,
      variables: { deleting: value, found: 'true' },
    });

    // Case 1 & 2: No child or one child
    if (root.left === null) {
      snapshots.push({
        stepIndex: step.count++,
        codeLine: 10,
        description: root.right ? `Node has only right child. Replacing with ${root.right.value}` : `Node is a leaf. Deleting it.`,
        treeState: layoutTree(getGlobalRoot()),
        highlights: { activeNodes: [root.id], pathNodes: root.right ? [root.right.id] : [] },
        callStack: nextStack,
        variables: { deleting: value },
      });
      return root.right;
    } else if (root.right === null) {
      snapshots.push({
        stepIndex: step.count++,
        codeLine: 10,
        description: `Node has only left child. Replacing with ${root.left.value}`,
        treeState: layoutTree(getGlobalRoot()),
        highlights: { activeNodes: [root.id], pathNodes: [root.left.id] },
        callStack: nextStack,
        variables: { deleting: value },
      });
      return root.left;
    }

    // Case 3: Two children
    const minNode = findMin(root.right);
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 12, // get min of right subtree
      description: `Node has two children. Finding inorder successor: ${minNode.value}`,
      treeState: layoutTree(getGlobalRoot()),
      highlights: { activeNodes: [root.id, minNode.id] },
      callStack: nextStack,
      variables: { deleting: value, minFound: minNode.value },
    });

    root.value = minNode.value;
    
    // Explicit snapshot to show the copied value
    snapshots.push({
      stepIndex: step.count++,
      codeLine: 13,
      description: `Copied inorder successor value (${minNode.value}) to current node`,
      treeState: layoutTree(getGlobalRoot()),
      highlights: { activeNodes: [root.id, minNode.id] },
      callStack: nextStack,
      variables: { deleting: value, minFound: minNode.value },
    });

    // Use an isolated context for deleting the successor so we don't duplicate recursive variables
    root.right = deleteNode(root.right, minNode.value, snapshots, step, getGlobalRoot, nextStack);
  }

  return root;
}

export function runBSTDelete(values: number[], target: number): {
  snapshots: Snapshot[];
} {
  nodeCounter = 0;
  const snapshots: Snapshot[] = [];
  const step = { count: 0 };

  let root: BSTNode | null = null;
  const getGlobalRoot = () => root;
  
  // Construct tree locally without generating snapshots.
  for (const val of values) {
    root = insertIntoBSTLocal(root, val);
  }
  
  snapshots.push({
    stepIndex: step.count++,
    codeLine: 1, // function deleteNode(root, key)
    description: `Deleting ${target} from BST`,
    treeState: layoutTree(root),
    highlights: {},
    callStack: [],
    variables: { target },
  });

  root = deleteNode(root, target, snapshots, step, getGlobalRoot, []);

  snapshots.push({
    stepIndex: step.count++,
    codeLine: 16, // return root;
    description: `BST Delete operations complete!`,
    treeState: layoutTree(root),
    highlights: { pathNodes: layoutTree(root).map(n => n.id) },
    callStack: [],
    variables: {},
  });

  return { snapshots };
}
