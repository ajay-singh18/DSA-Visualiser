import type { Snapshot, GraphNode, GraphEdge } from '@dsa-visualizer/shared';

export function runPrims(graph: { nodes: GraphNode[], edges: GraphEdge[], isDirected?: boolean }, startNodeId: string): { snapshots: Snapshot[] } {
  const snapshots: Snapshot[] = [];
  let stepIndex = 0;

  function addSnapshot(codeLine: number, description: string, highlights: Snapshot['highlights']) {
    snapshots.push({ stepIndex: stepIndex++, codeLine, description, highlights });
  }

  const adjList = new Map<string, { target: string, weight: number }[]>();
  graph.nodes.forEach((n: GraphNode) => adjList.set(n.id, []));
  
  graph.edges.forEach((e: GraphEdge) => {
    const listSrc = adjList.get(e.source);
    if (listSrc) listSrc.push({ target: e.target, weight: e.weight || 1 });
    if (!graph.isDirected) {
      const listTgt = adjList.get(e.target);
      if (listTgt) listTgt.push({ target: e.source, weight: e.weight || 1 });
    }
  });

  const key = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const inMST = new Set<string>();

  graph.nodes.forEach((n: GraphNode) => {
    key.set(n.id, Infinity);
    parent.set(n.id, null);
  });
  
  key.set(startNodeId, 0);

  addSnapshot(2, `Initializing Prim's Algorithm. Start node is ${startNodeId} with key 0.`, { visited: [] });

  while (inMST.size < graph.nodes.length) {
    // Find node not in MST with minimum key
    let u: string | null = null;
    let minKey = Infinity;

    for (const [nodeId, k] of key.entries()) {
      if (!inMST.has(nodeId) && k < minKey) {
        minKey = k;
        u = nodeId;
      }
    }

    if (u === null) break; // Disconnected graph

    addSnapshot(11, `Extracting minimum key node ${u} (key = ${minKey}). Added to MST.`, { currentNode: u, visited: Array.from(inMST) });
    inMST.add(u);

    const neighbors = adjList.get(u) || [];
    for (const neighbor of neighbors) {
      const v = neighbor.target;
      const weight = neighbor.weight;

      if (!inMST.has(v) && weight < key.get(v)!) {
        addSnapshot(17, `Considering edge ${u} -> ${v} (weight ${weight}).`, { currentNode: u, comparing: [v], visited: Array.from(inMST) });
        key.set(v, weight);
        parent.set(v, u);
        addSnapshot(18, `Updating key of ${v} to ${weight}.`, { currentNode: u, swapping: [v], visited: Array.from(inMST) });
      }
    }
  }

  addSnapshot(24, `Prim's Algorithm complete. Minimum Spanning Tree formed.`, { visited: Array.from(inMST) });

  return { snapshots };
}
