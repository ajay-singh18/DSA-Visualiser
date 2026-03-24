import type { Snapshot, GraphNode, GraphEdge } from '@dsa-visualizer/shared';

class UnionFind {
  parent: Map<string, string>;
  
  constructor(nodes: string[]) {
    this.parent = new Map();
    for (const n of nodes) {
      this.parent.set(n, n);
    }
  }
  
  find(i: string): string {
    if (this.parent.get(i) === i) return i;
    const root = this.find(this.parent.get(i)!);
    this.parent.set(i, root); // Path compression
    return root;
  }
  
  union(x: string, y: string): void {
    const xroot = this.find(x);
    const yroot = this.find(y);
    if (xroot !== yroot) {
      this.parent.set(xroot, yroot);
    }
  }
}

export function runKruskals(graph: { nodes: GraphNode[], edges: GraphEdge[], isDirected?: boolean }): { snapshots: Snapshot[] } {
  const snapshots: Snapshot[] = [];
  let stepIndex = 0;

  function addSnapshot(codeLine: number, description: string, highlights: Snapshot['highlights']) {
    snapshots.push({ stepIndex: stepIndex++, codeLine, description, highlights });
  }

  addSnapshot(13, `Initializing Kruskal's Algorithm. Preparing to sort edges by weight.`, { visited: [] });

  // Sort edges
  const sortedEdges = [...graph.edges].sort((a, b) => (a.weight || 1) - (b.weight || 1));
  const nodeIds = graph.nodes.map(n => n.id);
  const uf = new UnionFind(nodeIds);
  const mstEdges: GraphEdge[] = [];
  const visitedNodes = new Set<string>();

  addSnapshot(14, `Edges sorted by weight.`, { visited: [] });

  for (const edge of sortedEdges) {
    const u = edge.source;
    const v = edge.target;
    
    addSnapshot(16, `Considering edge ${u} - ${v} (weight ${edge.weight || 1}).`, { 
      comparing: [u, v], 
      visited: Array.from(visitedNodes) 
    });

    const x = uf.find(u);
    const y = uf.find(v);

    if (x !== y) {
      addSnapshot(19, `Edge ${u} - ${v} does not form a cycle. Adding to MST.`, { 
        swapping: [u, v], 
        visited: Array.from(visitedNodes) 
      });
      uf.union(x, y);
      mstEdges.push(edge);
      visitedNodes.add(u);
      visitedNodes.add(v);
    } else {
      addSnapshot(21, `Edge ${u} - ${v} forms a cycle in the Union-Find structures. Discarding.`, { 
        currentNode: u, 
        visited: Array.from(visitedNodes) 
      });
    }

    if (mstEdges.length === graph.nodes.length - 1) {
      break; // Reached V-1 edges
    }
  }

  addSnapshot(23, `Kruskal's Algorithm complete. Minimum Spanning Tree formed.`, { visited: Array.from(visitedNodes) });

  return { snapshots };
}
