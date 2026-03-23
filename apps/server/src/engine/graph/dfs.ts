import type { Snapshot, GraphNode, GraphEdge } from '@dsa-visualizer/shared';





export function runDFS(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: string,
  isDirected: boolean = false
): { snapshots: Snapshot[]; } {
  const snapshots: Snapshot[] = [];
  let step = 0;

  // Build adjacency list
  const adj = new Map<string, string[]>();
  for (const node of nodes) adj.set(node.id, []);
  for (const edge of edges) {
    adj.get(edge.source)?.push(edge.target);
    if (!isDirected) adj.get(edge.target)?.push(edge.source);
  }

  const visited = new Set<string>();
  const stack: string[] = [startNodeId];

  snapshots.push({
    stepIndex: step++,
    codeLine: 1, // function dfs
    description: `Starting DFS from node "${startNodeId}"`,
    highlights: { currentNode: startNodeId, stack: [...stack], visited: [...visited] },
    callStack: stack.map(id => `dfs(${id})`),
    variables: { startNodeId },
  });

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (visited.has(node)) {
      snapshots.push({
        stepIndex: step++,
        codeLine: 2, // abstract visited set check
        description: `Node "${node}" already visited — skipping`,
        highlights: { currentNode: node, stack: [...stack], visited: [...visited] },
        callStack: stack.map(id => `dfs(${id})`),
        variables: { node },
      });
      continue;
    }

    visited.add(node);

    snapshots.push({
      stepIndex: step++,
      codeLine: 2, // visited add
      description: `Visiting node "${node}"`,
      highlights: { currentNode: node, stack: [...stack], visited: [...visited] },
      callStack: stack.map(id => `dfs(${id})`),
      variables: { node },
    });

    const neighbors = adj.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        snapshots.push({
          stepIndex: step++,
          codeLine: 5, // dfs call / push equivalent
          description: `Pushed neighbor "${neighbor}" onto stack`,
          highlights: { currentNode: node, stack: [...stack], visited: [...visited] },
          callStack: stack.map(id => `dfs(${id})`),
          variables: { node, neighbor },
        });
      }
    }
  }

  snapshots.push({
    stepIndex: step++,
    codeLine: 8, // end of func
    description: 'DFS complete! All reachable nodes visited.',
    highlights: { visited: [...visited] },
    callStack: [],
    variables: {},
  });

  return { snapshots };
}
