import { motion } from 'framer-motion';
import type { Snapshot } from '@dsa-visualizer/shared';

interface Props {
  snapshot: Snapshot | null;
  originalArray: number[];
}

export default function ArrayVisualizer({ snapshot, originalArray }: Props) {
  const arr = snapshot?.arrayState ?? originalArray;
  const highlights = snapshot?.highlights ?? {};
  const maxVal = Math.max(...arr, 1);

  function getBarClass(index: number): string {
    if (highlights.sorted?.includes(index)) return 'bar bar--sorted';
    if (highlights.swapping?.includes(index)) return 'bar bar--swapping';
    if (highlights.comparing?.includes(index)) return 'bar bar--comparing';
    return 'bar bar--default';
  }

  return (
    <div className="canvas-area" style={{ justifyContent: 'flex-start', overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', margin: '0 auto', gap: 'var(--space-2)', minWidth: 'max-content', padding: '0 2rem' }}>
        {arr.map((value, index) => (
          <motion.div
            key={index}
            className={getBarClass(index)}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="bar-fill"
              animate={{ height: `${(value / maxVal) * 280}px` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
            <span className="bar-label">{value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
