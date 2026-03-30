import { motion } from 'framer-motion';
import type { Snapshot } from '@dsa-visualizer/shared';

interface DPTableVisualizerProps {
  snapshot: Snapshot | null;
}

export default function DPTableVisualizer({ snapshot }: DPTableVisualizerProps) {
  const table = snapshot?.dpTable;
  const highlights = snapshot?.highlights;
  const callStack = snapshot?.callStack;

  if (!table && !callStack) {
    return (
      <div className="canvas-area" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
          Configure parameters and click Run to begin
        </p>
      </div>
    );
  }

  // If we have a call stack (recursion mode), show it
  if (callStack && callStack.length > 0 && !table) {
    return (
      <div className="canvas-area" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '2rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>
          Call Stack
        </div>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '4px', maxHeight: '400px', overflowY: 'auto' }}>
          {callStack.map((frame, i) => (
            <motion.div
              key={`${i}-${frame}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '0.5rem 1rem',
                background: i === callStack.length - 1
                  ? 'rgba(244, 114, 182, 0.3)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${i === callStack.length - 1 ? '#f472b6' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: 'var(--on-surface)',
                backdropFilter: 'blur(8px)',
                boxShadow: i === callStack.length - 1 ? '0 0 12px rgba(244, 114, 182, 0.3)' : 'none',
              }}
            >
              {frame}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // DP Table mode
  if (!table) return null;

  const activeRow = highlights?.activeCell?.[0] ?? -1;
  const activeCol = highlights?.activeCell?.[1] ?? -1;

  return (
    <div className="canvas-area" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '1.5rem', overflow: 'auto' }}>
      <div style={{ overflowX: 'auto', maxWidth: '100%', margin: '0 auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '2px' }}>
          <tbody>
            {table.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const isActive = ri === activeRow && ci === activeCol;
                  const isHeader = ri === 0 || ci === 0;

                  return (
                    <motion.td
                      key={`${ri}-${ci}`}
                      initial={isActive ? { scale: 0.8 } : {}}
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      style={{
                        padding: '0.4rem 0.6rem',
                        minWidth: '36px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: isHeader ? 600 : 400,
                        color: isActive ? 'var(--on-surface)' : isHeader ? 'var(--on-surface-variant)' : 'var(--on-surface)',
                        background: isActive
                          ? 'rgba(244, 114, 182, 0.5)'
                          : isHeader
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: isActive
                          ? '2px solid #f472b6'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        boxShadow: isActive ? '0 0 12px rgba(244, 114, 182, 0.3)' : 'none',
                      }}
                    >
                      {cell}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
