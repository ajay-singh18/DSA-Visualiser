import type { Snapshot, CustomLayoutDTO, GraphNode, GraphEdge } from '@dsa-visualizer/shared';

// Priority Queue for Dijkstra
class PriorityQueue<T> {
  private values: { val: T, priority: number }[] = [];
  enqueue(val: T, priority: number) { this.values.push({ val, priority }); this.sort(); }
  dequeue() { return this.values.shift(); }
  isEmpty() { return this.values.length === 0; }
  private sort() { this.values.sort((a, b) => a.priority - b.priority); }
}

export function runDijkstra(graph: { nodes: GraphNode[], edges: GraphEdge[], isDirected?: boolean }, startNodeId: string): { snapshots: Snapshot[] } {
  const snapshots: Snapshot[] = [];
  let stepIndex = 0;

  function addSnapshot(codeLine: number, description: string, highlights: Snapshot['highlights']) {
    snapshots.push({ stepIndex: stepIndex++, codeLine, description, highlights });
  }

  // Build adjacency list
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

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const pq = new PriorityQueue<string>();
  const visited = new Set<string>();

  graph.nodes.forEach((n: GraphNode) => {
    distances.set(n.id, Infinity);
    previous.set(n.id, null);
  });
  
  distances.set(startNodeId, 0);
  pq.enqueue(startNodeId, 0);

  addSnapshot(1, `Initializing Dijkstra's. Start node is ${startNodeId} with distance 0, all others Infinity.`, { visited: [] });

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;
    const u = current.val;

    if (visited.has(u)) continue;

    addSnapshot(7, `Processing node ${u} with current shortest distance ${distances.get(u)}.`, { currentNode: u, visited: Array.from(visited) });
    visited.add(u);

    const neighbors = adjList.get(u) || [];
    for (const neighbor of neighbors) {
      const v = neighbor.target;
      const weight = neighbor.weight;

      if (visited.has(v)) continue;

      const alt = distances.get(u)! + weight;
      addSnapshot(10, `Evaluating edge ${u} -> ${v} (weight ${weight}). Potential distance: ${alt}.`, { currentNode: u, comparing: [v], visited: Array.from(visited) });

      if (alt < distances.get(v)!) {
        distances.set(v, alt);
        previous.set(v, u);
        pq.enqueue(v, alt);
        addSnapshot(12, `Found shorter path to ${v}: updated distance to ${alt}.`, { currentNode: u, swapping: [v], visited: Array.from(visited) });
      }
    }
  }

  addSnapshot(16, `Dijkstra's complete. Shortest paths computed from ${startNodeId}.`, { visited: Array.from(visited) });

  

  return { snapshots };
}
