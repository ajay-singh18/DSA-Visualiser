import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Snapshot } from '@dsa-visualizer/shared';

interface Props {
  snapshot: Snapshot | null;
  originalArray: number[];
}

export default function ArrayVisualizer({ snapshot, originalArray }: Props) {
  const [items, setItems] = useState<{id: string, val: number}[]>([]);

  useEffect(() => {
    if (!snapshot?.arrayState) {
      setItems(originalArray.map((val, i) => ({ id: `orig-${i}`, val })));
      return;
    }
    
    setItems(prevItems => {
      const newItems: {id: string, val: number}[] = [];
      const usedIds = new Set<string>();
      
      for (const val of snapshot.arrayState!) {
        const match = prevItems.find(item => item.val === val && !usedIds.has(item.id));
        if (match) {
          usedIds.add(match.id);
          newItems.push(match);
        } else {
          newItems.push({ id: `new-${Math.random().toString(36).substring(2, 9)}`, val });
        }
      }
      return newItems;
    });
  }, [snapshot, originalArray]);

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
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={getBarClass(index)}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="bar-fill"
              animate={{ height: `${(item.val / maxVal) * 280}px` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
            <span className="bar-label">{item.val}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
