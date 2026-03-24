import type { Snapshot, GraphNode, GraphEdge } from '@dsa-visualizer/shared';

export function runFloydWarshall(graph: { nodes: GraphNode[], edges: GraphEdge[], isDirected?: boolean }): { snapshots: Snapshot[] } {
  const snapshots: Snapshot[] = [];
  let stepIndex = 0;

  function addSnapshot(codeLine: number, description: string, highlights: Snapshot['highlights']) {
    snapshots.push({ stepIndex: stepIndex++, codeLine, description, highlights });
  }

  const V = graph.nodes.length;
  const nodes = graph.nodes.map(n => n.id);
  const dist = new Map<string, Map<string, number>>();

  for (const u of nodes) {
    dist.set(u, new Map<string, number>());
    for (const v of nodes) {
      dist.get(u)!.set(v, u === v ? 0 : Infinity);
    }
  }

  for (const e of graph.edges) {
    dist.get(e.source)!.set(e.target, e.weight || 1);
    if (!graph.isDirected) {
      dist.get(e.target)!.set(e.source, e.weight || 1);
    }
  }

  addSnapshot(2, `Initialized Floyd-Warshall distance matrix with edge weights.`, { visited: [] });

  for (let k = 0; k < V; k++) {
    const nodeK = nodes[k];
    addSnapshot(3, `Setting intermediate node to ${nodeK} (k = ${k}).`, { currentNode: nodeK });

    for (let i = 0; i < V; i++) {
      const nodeI = nodes[i];
      for (let j = 0; j < V; j++) {
        const nodeJ = nodes[j];

        const distIJ = dist.get(nodeI)!.get(nodeJ)!;
        const distIK = dist.get(nodeI)!.get(nodeK)!;
        const distKJ = dist.get(nodeK)!.get(nodeJ)!;

        // Visualizing only when there is a meaningful path through K to consider
        if (distIK !== Infinity && distKJ !== Infinity) {
          if (distIK + distKJ < distIJ) {
            dist.get(nodeI)!.set(nodeJ, distIK + distKJ);
            addSnapshot(6, `Found shorter path from ${nodeI} to ${nodeJ} via ${nodeK}. New distance: ${distIK + distKJ}.`, {
              currentNode: nodeK,
              swapping: [nodeI, nodeJ]
            });
          }
        }
      }
    }
  }

  addSnapshot(11, `Floyd-Warshall complete. All-pairs shortest paths computed.`, { visited: [] });

  return { snapshots };
}
