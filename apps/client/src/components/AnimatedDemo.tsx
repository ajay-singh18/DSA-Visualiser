import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BUBBLE_SORT_CODE = [
  "function bubbleSort(arr) {",
  "  const n = arr.length;",
  "  for (let i = 0; i < n - 1; i++) {",
  "    for (let j = 0; j < n - i - 1; j++) {",
  "      if (arr[j] > arr[j + 1]) { // Compare",
  "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap",
  "      }",
  "    }",
  "  }",
  "  return arr;",
  "}"
];

// Initial array config
const INITIAL_ARRAY = [
  { id: 'a', val: 30, height: '30%' },
  { id: 'b', val: 80, height: '80%' },
  { id: 'c', val: 50, height: '50%' },
  { id: 'd', val: 40, height: '40%' },
  { id: 'e', val: 90, height: '90%' },
];

export default function AnimatedDemo() {
  const [arr, setArr] = useState(INITIAL_ARRAY);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [comparingIdx, setComparingIdx] = useState<number[]>([-1, -1]);
  const [swappingIdx, setSwappingIdx] = useState<number[]>([-1, -1]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const runAnimation = async () => {
      while (isMounted) {
        // Reset
        setArr([...INITIAL_ARRAY]);
        setActiveLine(null);
        setComparingIdx([-1, -1]);
        setSwappingIdx([-1, -1]);
        
        await new Promise(r => { timeoutId = setTimeout(r, 1000); });
        if (!isMounted) return;

        // Step 1: Compare arr[1] (80) and arr[2] (50)
        setActiveLine(4); // "if (arr[j] > arr[j+1])"
        setComparingIdx([1, 2]);
        await new Promise(r => { timeoutId = setTimeout(r, 1500); });
        if (!isMounted) return;

        // Step 2: Swap them
        setActiveLine(5); // "[arr[j], ...] = ..."
        setComparingIdx([-1, -1]);
        setSwappingIdx([1, 2]);
        
        // Actually swap in state to trigger layout animation
        setArr(prev => {
          const newArr = [...prev];
          const temp = newArr[1];
          newArr[1] = newArr[2];
          newArr[2] = temp;
          return newArr;
        });

        await new Promise(r => { timeoutId = setTimeout(r, 1500); });
        if (!isMounted) return;

        // Step 3: Finish inner loop iteration
        setActiveLine(7);
        setSwappingIdx([-1, -1]);
        await new Promise(r => { timeoutId = setTimeout(r, 1000); });
      }
    };

    runAnimation();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: '1000px',
      margin: '4rem auto',
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-xl)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr'
      }
    } as any}>
      
      {/* Visualizer Panel (Left) */}
      <div style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid var(--glass-border)',
        '@media (min-width: 768px)': {
          borderBottom: 'none',
          borderRight: '1px solid var(--glass-border)'
        }
      } as any}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--on-surface)', fontSize: '1.25rem' }}>Visualizer</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'rgba(124, 58, 237, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>Live Demo</span>
        </div>
        
        <div style={{
          flex: 1,
          minHeight: '250px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '8px',
          padding: '1rem',
          position: 'relative'
        }}>
          {arr.map((item, i) => {
            const isComparing = comparingIdx.includes(i);
            const isSwapping = swappingIdx.includes(i);
            
            let barColor = 'var(--primary)';
            if (isComparing) barColor = 'var(--secondary)'; // Pinkish when comparing
            if (isSwapping) barColor = 'var(--accent)';     // Teal when swapping

            return (
              <motion.div
                key={item.id}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  width: '40px',
                  height: item.height,
                  background: barColor,
                  borderRadius: '6px 6px 0 0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingBottom: '8px',
                  boxShadow: isComparing || isSwapping ? '0 0 15px ' + barColor : 'none'
                }}
              >
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.val}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Code Editor Panel (Right) */}
      <div style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
         <div style={{ padding: '1rem', borderBottom: '1px solid #333', background: '#252526', display: 'flex', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
         </div>
         <div style={{ padding: '1.5rem', flex: 1, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem', lineHeight: '1.6', color: '#d4d4d4', overflowX: 'auto' }}>
            {BUBBLE_SORT_CODE.map((line, i) => (
              <div 
                key={i} 
                style={{ 
                  backgroundColor: activeLine === i ? 'rgba(124, 58, 237, 0.3)' : 'transparent',
                  padding: '2px 8px',
                  borderLeft: activeLine === i ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'background-color 0.2s',
                  display: 'flex'
                }}
              >
                <span style={{ width: '25px', color: '#858585', textAlign: 'right', marginRight: '1rem', userSelect: 'none' }}>{i + 1}</span>
                <span style={{ whiteSpace: 'pre' }}>{line}</span>
              </div>
            ))}
         </div>
      </div>

    </div>
  );
}
