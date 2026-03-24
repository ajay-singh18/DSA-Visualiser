import type { Snapshot, GraphNode, GraphEdge } from '@dsa-visualizer/shared';

class PriorityQueue<T> {
  private values: { val: T, priority: number }[] = [];
  enqueue(val: T, priority: number) { this.values.push({ val, priority }); this.sort(); }
  dequeue() { return this.values.shift(); }
  isEmpty() { return this.values.length === 0; }
  private sort() { this.values.sort((a, b) => a.priority - b.priority); }
}

// Very simple heuristic: just return 1 for every node to simulate A* mechanics,
// or 0 if it's the target. Real A* requires spatial coordinates (x,y) which our generic GraphNode doesn't mandate.
function heuristic(nodeId: string, targetId: string): number {
  return nodeId === targetId ? 0 : 1; 
}

export function runAStar(graph: { nodes: GraphNode[], edges: GraphEdge[], isDirected?: boolean }, startNodeId: string, targetNodeId: string): { snapshots: Snapshot[] } {
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

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const pq = new PriorityQueue<string>();
  const visited = new Set<string>();

  graph.nodes.forEach((n: GraphNode) => {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  });
  
  gScore.set(startNodeId, 0);
  fScore.set(startNodeId, heuristic(startNodeId, targetNodeId));
  pq.enqueue(startNodeId, fScore.get(startNodeId)!);

  addSnapshot(2, `Initializing A*. Start node is ${startNodeId}, Target is ${targetNodeId}.`, { visited: [] });

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;
    const u = current.val;

    addSnapshot(11, `Processing node ${u} (f-score: ${fScore.get(u)}).`, { currentNode: u, visited: Array.from(visited) });

    if (u === targetNodeId) {
      visited.add(u);
      addSnapshot(14, `Target node ${targetNodeId} reached! A* pathfinding complete.`, { currentNode: u, visited: Array.from(visited) });
      return { snapshots };
    }

    visited.add(u);

    const neighbors = adjList.get(u) || [];
    for (const neighbor of neighbors) {
      const v = neighbor.target;
      const weight = neighbor.weight;

      if (visited.has(v)) continue;

      const tentativeGScore = gScore.get(u)! + weight;
      addSnapshot(17, `Evaluating neighbor ${v} (weight ${weight}). Tentative g-score: ${tentativeGScore}.`, { currentNode: u, comparing: [v], visited: Array.from(visited) });

      if (tentativeGScore < gScore.get(v)!) {
        gScore.set(v, tentativeGScore);
        const f = tentativeGScore + heuristic(v, targetNodeId);
        fScore.set(v, f);
        pq.enqueue(v, f);
        addSnapshot(20, `Found better path to ${v}. g-score: ${tentativeGScore}, f-score: ${f}.`, { currentNode: u, swapping: [v], visited: Array.from(visited) });
      }
    }
  }

  addSnapshot(26, `A* complete. Target node ${targetNodeId} is unreachable from ${startNodeId}.`, { visited: Array.from(visited) });

  return { snapshots };
}
