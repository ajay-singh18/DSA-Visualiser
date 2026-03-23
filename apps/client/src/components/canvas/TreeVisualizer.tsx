import { motion } from 'framer-motion';
import type { Snapshot, TreeNodeData } from '@dsa-visualizer/shared';

interface TreeVisualizerProps {
  snapshot: Snapshot | null;
  treeNodes: TreeNodeData[];
}

export default function TreeVisualizer({ snapshot, treeNodes }: TreeVisualizerProps) {
  const nodes = snapshot?.treeState ?? treeNodes;
  const highlights = snapshot?.highlights ?? {};

  if (!nodes || nodes.length === 0) {
    return (
      <div className="canvas-area" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
          Enter values and click Run to build a tree
        </p>
      </div>
    );
  }

  const minX = Math.min(...nodes.map(n => n.x));
  const maxX = Math.max(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y));
  const maxY = Math.max(...nodes.map(n => n.y));

  const padding = 60;
  // Add fallback widths to prevent NaN sizes if tree only has 1 node
  const contentWidth = (maxX === minX ? 0 : maxX - minX) + padding * 2;
  const contentHeight = (maxY === minY ? 0 : maxY - minY) + padding * 2;

  // Shift nodes so that minX and minY evaluate functionally to (padding, padding)
  const shiftedNodes = nodes.map(n => ({
    ...n,
    x: n.x - minX + padding,
    y: n.y - minY + padding
  }));

  // Build a lookup for edge drawing
  const nodeMap = new Map(shiftedNodes.map(n => [n.id, n]));

  // Derive edges from parent → child relationships
  const edges: { from: TreeNodeData; to: TreeNodeData }[] = [];
  for (const node of shiftedNodes) {
    if (node.left) {
      const child = nodeMap.get(node.left);
      if (child) edges.push({ from: node, to: child });
    }
    if (node.right) {
      const child = nodeMap.get(node.right);
      if (child) edges.push({ from: node, to: child });
    }
  }

  function getNodeColor(nodeId: string): string {
    if (highlights.activeNodes?.includes(nodeId)) return 'rgba(244, 114, 182, 0.8)'; // pink - active
    if (highlights.pathNodes?.includes(nodeId)) return 'rgba(52, 211, 153, 0.7)';    // green - visited
    return 'rgba(255, 255, 255, 0.15)'; // default glass
  }

  function getNodeBorder(nodeId: string): string {
    if (highlights.activeNodes?.includes(nodeId)) return '2px solid #f472b6';
    if (highlights.pathNodes?.includes(nodeId)) return '2px solid #34d399';
    return '1px solid rgba(255, 255, 255, 0.3)';
  }

  function getNodeGlow(nodeId: string): string {
    if (highlights.activeNodes?.includes(nodeId)) return '0 0 20px rgba(244, 114, 182, 0.5)';
    if (highlights.pathNodes?.includes(nodeId)) return '0 0 15px rgba(52, 211, 153, 0.4)';
    return '0 4px 12px rgba(0, 0, 0, 0.2)';
  }

  function getEdgeColor(fromId: string, toId: string): string {
    const bothVisited = highlights.pathNodes?.includes(fromId) && highlights.pathNodes?.includes(toId);
    if (bothVisited) return '#34d399';
    return 'rgba(255, 255, 255, 0.25)';
  }

  return (
    <div className="canvas-area" style={{ alignItems: 'flex-start', padding: '1rem', position: 'relative', overflow: 'auto' }}>
      <div style={{ width: contentWidth, height: contentHeight, position: 'relative', margin: 'auto' }}>
        {/* SVG Edges */}
        <svg
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
        {edges.map((edge, i) => (
          <motion.line
            key={`edge-${i}`}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            stroke={getEdgeColor(edge.from.id, edge.to.id)}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </svg>

      {/* Nodes */}
      {shiftedNodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            position: 'absolute',
            left: node.x - 24,
            top: node.y - 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: getNodeColor(node.id),
            border: getNodeBorder(node.id),
            boxShadow: getNodeGlow(node.id),
            backdropFilter: 'blur(8px)',
            color: 'white',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 10,
          }}
        >
          {node.value}
        </motion.div>
      ))}
      </div>
    </div>
  );
}
