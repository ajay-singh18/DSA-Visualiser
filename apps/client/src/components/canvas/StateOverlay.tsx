import { motion, AnimatePresence } from 'framer-motion';
import type { Snapshot } from '@dsa-visualizer/shared';

interface StateOverlayProps {
  snapshot: Snapshot | null;
}

export default function StateOverlay({ snapshot }: StateOverlayProps) {
  if (!snapshot || (Object.keys(snapshot.variables || {}).length === 0 && (!snapshot.callStack || snapshot.callStack.length === 0))) {
    return null;
  }

  const vars = snapshot.variables || {};
  const stack = snapshot.callStack || [];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      width: '280px',
      padding: '1.5rem',
      overflowY: 'auto',
      borderLeft: '1px solid var(--border)',
      background: 'rgba(0, 0, 0, 0.2)',
      zIndex: 10,
    }}>
      {/* Variables Card */}
      {Object.keys(vars).length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Local Variables
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.entries(vars).map(([key, val]) => (
              <div key={key} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '0.35rem 0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--secondary)' }}>{key}</span>
                <span style={{ color: 'var(--on-surface-variant)' }}>=</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Call Stack Cascading Cards */}
      {stack.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: '0 0 0.75rem 0.5rem', color: 'var(--tertiary)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Call Stack
          </h4>
          <div style={{ position: 'relative', paddingBottom: `${(stack.length - 1) * 12}px` }}>
            <AnimatePresence>
              {stack.map((frame, idx) => {
                const isTop = idx === stack.length - 1;
                return (
                  <motion.div
                    key={`${frame}-${idx}`}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: isTop ? 1 : 0.6, y: idx * 12, scale: 1 - (stack.length - 1 - idx) * 0.05 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      position: idx === 0 ? 'relative' : 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      background: isTop ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(12px)',
                      border: isTop ? '1px solid var(--tertiary)' : '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.875rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: isTop ? '#fff' : 'var(--on-surface-variant)',
                      boxShadow: isTop ? '0 0 20px rgba(52, 211, 153, 0.2), 0 8px 24px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.3)',
                      zIndex: idx,
                      transformOrigin: 'top center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {frame}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
