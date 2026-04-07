import { motion } from 'framer-motion';
import type { Snapshot } from '@dsa-visualizer/shared';

interface VariableWatchProps {
  snapshot: Snapshot | null;
}

export default function VariableWatch({ snapshot }: VariableWatchProps) {
  const vars = snapshot?.variables || {};
  const stack = snapshot?.callStack || [];
  const hasData = Object.keys(vars).length > 0 || stack.length > 0;

  if (!hasData) {
    return (
      <div style={{
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--on-surface-variant)',
        fontSize: '0.85rem',
        fontStyle: 'italic',
        background: 'var(--glass-bg)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--glass-border)',
      }}>
        No variables active
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Variable List */}
      {Object.keys(vars).length > 0 && (
        <div style={{ 
          background: 'var(--glass-bg)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--glass-border)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem' 
          }}>
            {Object.entries(vars).map(([key, val]) => (
              <motion.div 
                key={key}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.03)'
                }}
              >
                <span style={{ color: 'var(--secondary)', fontWeight: 500 }}>{key}</span>
                <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{String(val)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Call Stack (Mini Version) */}
      {stack.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ 
            fontSize: '0.75rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            color: 'var(--tertiary)',
            paddingLeft: '0.25rem'
          }}>
            Call Stack ({stack.length})
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column-reverse', 
            gap: '2px' 
          }}>
            {stack.map((frame, idx) => (
              <div key={`${frame}-${idx}`} style={{
                background: idx === stack.length - 1 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.02)',
                borderLeft: idx === stack.length - 1 ? '2px solid var(--tertiary)' : '2px solid transparent',
                padding: '0.5rem 0.75rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: idx === stack.length - 1 ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {frame}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
