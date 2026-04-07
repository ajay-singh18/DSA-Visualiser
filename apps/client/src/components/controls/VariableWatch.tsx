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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Variable Grid */}
      {Object.keys(vars).length > 0 && (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          background: 'var(--glass-bg)', 
          padding: '0.75rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--glass-border)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {Object.entries(vars).map(([key, val]) => (
            <motion.div 
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.05)',
                overflow: 'hidden'
              }}
            >
              <span style={{ color: 'var(--secondary)', fontWeight: 600, opacity: 0.9, marginRight: '4px' }}>{key}</span>
              <span style={{ color: 'var(--on-surface)', fontWeight: 700, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{String(val)}</span>
            </motion.div>
          ))}
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
