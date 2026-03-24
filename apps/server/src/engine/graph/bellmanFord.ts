import type { Snapshot, GraphNode, GraphEdge } from '@dsa-visualizer/shared';

export function runBellmanFord(graph: { nodes: GraphNode[], edges: GraphEdge[], isDirected?: boolean }, startNodeId: string): { snapshots: Snapshot[] } {
  const snapshots: Snapshot[] = [];
  let stepIndex = 0;

  function addSnapshot(codeLine: number, description: string, highlights: Snapshot['highlights']) {
    snapshots.push({ stepIndex: stepIndex++, codeLine, description, highlights });
  }

  const V = graph.nodes.length;
  const dist = new Map<string, number>();
  
  // Also keep track of all edges including reverse if undirected
  const allEdges = [...graph.edges];
  if (!graph.isDirected) {
    for (const e of graph.edges) {
      allEdges.push({ source: e.target, target: e.source, weight: e.weight });
    }
  }

  for (const n of graph.nodes) {
    dist.set(n.id, Infinity);
  }
  dist.set(startNodeId, 0);

  addSnapshot(2, `Initializing Bellman-Ford. Set distance of start node ${startNodeId} to 0, and all others to Infinity.`, { visited: [] });

  let updatedInPass = false;

  // Relax edges V-1 times
  for (let i = 1; i < V; i++) {
    updatedInPass = false;
    addSnapshot(6, `Starting relaxation pass ${i} of ${V - 1}.`, { visited: [] });

    for (const edge of allEdges) {
      const u = edge.source;
      const v = edge.target;
      const weight = edge.weight || 1;

      addSnapshot(8, `Examining edge ${u} -> ${v} (weight ${weight}).`, { comparing: [u, v] });

      const distU = dist.get(u)!;
      const distV = dist.get(v)!;

      if (distU !== Infinity && distU + weight < distV) {
        dist.set(v, distU + weight);
        updatedInPass = true;
        addSnapshot(12, `Relaxed edge ${u} -> ${v}. New distance for ${v} is ${dist.get(v)}.`, { swapping: [u, v] });
      }
    }

    if (!updatedInPass) {
      addSnapshot(14, `No updates occurred in pass ${i}. The graph has stabilized early.`, { visited: [] });
      break;
    }
  }

  // Check for negative weight cycles
  addSnapshot(16, `Checking for negative weight cycles.`, { visited: [] });
  let hasNegativeCycle = false;
  for (const edge of allEdges) {
    const u = edge.source;
    const v = edge.target;
    const weight = edge.weight || 1;
    const distU = dist.get(u)!;
    const distV = dist.get(v)!;

    if (distU !== Infinity && distU + weight < distV) {
      hasNegativeCycle = true;
      addSnapshot(19, `Negative cycle detected at edge ${u} -> ${v}!`, { currentNode: u, comparing: [v] });
      break;
    }
  }

  if (!hasNegativeCycle) {
    addSnapshot(23, `Bellman-Ford complete. Shortest paths computed from ${startNodeId}.`, { visited: [] });
  }

  return { snapshots };
}
