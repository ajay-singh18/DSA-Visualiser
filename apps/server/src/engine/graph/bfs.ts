import type { Snapshot, GraphNode, GraphEdge } from '@dsa-visualizer/shared';





export function runBFS(
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
  const queue: string[] = [startNodeId];
  visited.add(startNodeId);

  snapshots.push({
    stepIndex: step++,
    codeLine: 1, // function bfs
    description: `Starting BFS from node "${startNodeId}"`,
    highlights: { currentNode: startNodeId, queue: [...queue], visited: [...visited] },
    variables: { queue: queue.join(', '), visited: Array.from(visited).join(', ') },
  });

  while (queue.length > 0) {
    const node = queue.shift()!;

    snapshots.push({
      stepIndex: step++,
      codeLine: 5, // shift
      description: `Dequeued node "${node}" — processing`,
      highlights: { currentNode: node, queue: [...queue], visited: Array.from(visited) },
      variables: { currentNode: node, queue: queue.join(', '), visited: Array.from(visited).join(', ') },
    });

    for (const neighbor of adj.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        snapshots.push({
          stepIndex: step++,
          codeLine: 9, // queue push
          description: `Discovered neighbor "${neighbor}" → added to queue`,
          highlights: { currentNode: node, queue: [...queue], visited: Array.from(visited) },
          variables: { currentNode: node, neighbor, queue: queue.join(', '), visited: Array.from(visited).join(', ') },
        });
      }
    }
  }

  snapshots.push({
    stepIndex: step++,
    codeLine: 12, // end of func
    description: 'BFS complete! All reachable nodes visited.',
    highlights: { visited: Array.from(visited) },
    variables: { status: 'Complete', nodesVisited: visited.size },
  });

  return { snapshots };
}
