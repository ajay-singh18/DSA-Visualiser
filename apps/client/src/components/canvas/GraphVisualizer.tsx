import { motion } from 'framer-motion';
import type { Snapshot, GraphNode, GraphEdge } from '@dsa-visualizer/shared';

interface Props {
  snapshot: Snapshot | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected?: boolean;
}

export default function GraphVisualizer({ snapshot, nodes, edges, isDirected }: Props) {
  // Extract highlight states from the current snapshot
  const visited = new Set(snapshot?.highlights?.visited || []);
  const queue = new Set(snapshot?.highlights?.queue || []);
  const stack = new Set(snapshot?.highlights?.stack || []);
  const currentNode = snapshot?.highlights?.currentNode;
  const comparing = new Set(snapshot?.highlights?.comparing || []); // Edge targets evaluated

  const getNodeColor = (id: string) => {
    if (id === currentNode) return 'rgba(244, 114, 182, 0.9)'; // Current: Pink glow
    if (comparing.has(id)) return 'rgba(96, 165, 250, 0.9)'; // Evaluating: Blue glow
    if (visited.has(id)) return 'rgba(52, 211, 153, 0.8)'; // Visited: Green glow
    if (queue.has(id) || stack.has(id)) return 'rgba(251, 191, 36, 0.8)'; // In queue/stack: Yellow glow
    return 'rgba(255, 255, 255, 0.15)'; // Default frosted glass
  };

  const getNodeBorder = (id: string) => {
    if (id === currentNode) return 'rgba(244, 114, 182, 1)';
    if (comparing.has(id)) return 'rgba(96, 165, 250, 1)';
    if (visited.has(id)) return 'rgba(52, 211, 153, 1)';
    return 'rgba(255, 255, 255, 0.4)';
  };

  const getEdgeStyle = (source: string, target: string) => {
    const isEvaluating = currentNode === source && comparing.has(target);
    const stroke = isEvaluating ? 'rgba(96, 165, 250, 0.8)' : 'var(--glass-border-highlight)';
    const strokeWidth = isEvaluating ? 3 : 1.5;
    return { stroke, strokeWidth };
  };

  const padding = 80;
  const minX = nodes.length > 0 ? Math.min(...nodes.map(n => n.x)) : 0;
  const maxX = nodes.length > 0 ? Math.max(...nodes.map(n => n.x)) : 0;
  const minY = nodes.length > 0 ? Math.min(...nodes.map(n => n.y)) : 0;
  const maxY = nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) : 0;
  const contentWidth = nodes.length > 0 ? maxX - minX + padding * 2 : 200;
  const contentHeight = nodes.length > 0 ? maxY - minY + padding * 2 : 200;

  const getX = (x: number) => x - minX + padding;
  const getY = (y: number) => y - minY + padding;

  return (
    <div className="canvas-area" style={{ justifyContent: 'center', alignItems: 'center', overflow: 'auto', padding: 0 }}>
      <div style={{ position: 'relative', minWidth: contentWidth, minHeight: contentHeight, margin: 'auto' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--glass-border-highlight)" />
          </marker>
        </defs>
        {edges.map((edge, i) => {
          const srcNode = nodes.find(n => n.id === edge.source);
          const tgtNode = nodes.find(n => n.id === edge.target);
          if (!srcNode || !tgtNode) return null;

          const edgeStyle = getEdgeStyle(edge.source, edge.target);
          return (
            <g key={`edge-${i}`}>
              <motion.line
                x1={getX(srcNode.x)}
                y1={getY(srcNode.y)}
                x2={getX(tgtNode.x)}
                y2={getY(tgtNode.y)}
                stroke={edgeStyle.stroke}
                strokeWidth={edgeStyle.strokeWidth}
                markerEnd={isDirected ? 'url(#arrowhead)' : undefined}
                animate={{ stroke: edgeStyle.stroke, strokeWidth: edgeStyle.strokeWidth }}
                transition={{ duration: 0.3 }}
              />
              {edge.weight !== undefined && (
                <text
                  x={(getX(srcNode.x) + getX(tgtNode.x)) / 2}
                  y={(getY(srcNode.y) + getY(tgtNode.y)) / 2 - 10}
                  fill="var(--on-surface-variant)"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map(node => (
        <motion.div
          key={node.id}
          animate={{
            backgroundColor: getNodeColor(node.id),
            borderColor: getNodeBorder(node.id),
            scale: node.id === currentNode ? 1.1 : 1,
            boxShadow: node.id === currentNode ? '0 0 20px rgba(244, 114, 182, 0.6)' : 
                       visited.has(node.id) ? '0 0 15px rgba(52, 211, 153, 0.4)' : 
                       '0 4px 12px rgba(0,0,0,0.2)'
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: getY(node.y),
            left: getX(node.x),
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid',
            color: 'var(--on-surface)',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            backdropFilter: 'blur(8px)',
            zIndex: node.id === currentNode ? 10 : 1
          }}
        >
          {node.label || node.id}
        </motion.div>
      ))}
      </div>
    </div>
  );
}
