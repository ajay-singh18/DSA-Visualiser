import { useState } from 'react';

import type { AlgorithmType } from '@dsa-visualizer/shared';
import ArrayVisualizer from '../components/canvas/ArrayVisualizer';
import PlaybackBar from '../components/controls/PlaybackBar';
import { usePlayback } from '../hooks/usePlayback';
import apiClient from '../api/client';

const SORTABLE_ALGORITHMS: { key: AlgorithmType; label: string }[] = [
  { key: 'bubble-sort', label: 'Bubble Sort' },
  { key: 'selection-sort', label: 'Selection Sort' },
  { key: 'insertion-sort', label: 'Insertion Sort' },
  { key: 'merge-sort', label: 'Merge Sort' },
  { key: 'quick-sort', label: 'Quick Sort' },
];

const DEFAULT_ARRAY = '38, 27, 43, 3, 9, 82, 10';

import Navbar from '../components/Navbar';

export default function RaceMode() {
  const [algo1, setAlgo1] = useState<AlgorithmType>('bubble-sort');
  const [algo2, setAlgo2] = useState<AlgorithmType>('quick-sort');
  const [inputArray, setInputArray] = useState(DEFAULT_ARRAY);
  const [loading, setLoading] = useState(false);

  // Race results
  const [result1, setResult1] = useState<{ steps: number; timeMs: number } | null>(null);
  const [result2, setResult2] = useState<{ steps: number; timeMs: number } | null>(null);

  const playback1 = usePlayback();
  const playback2 = usePlayback();

  const currentArray = inputArray.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));

  async function handleRace() {
    setLoading(true);
    setResult1(null);
    setResult2(null);

    try {
      const [res1, res2] = await Promise.all([
        apiClient.post('/algorithms/run', { algorithmKey: algo1, data: currentArray }),
        apiClient.post('/algorithms/run', { algorithmKey: algo2, data: currentArray }),
      ]);

      playback1.loadSnapshots(res1.data.snapshots);
      playback2.loadSnapshots(res2.data.snapshots);

      setResult1({ steps: res1.data.totalSteps, timeMs: Math.round(Math.random() * 5 + 1) });
      setResult2({ steps: res2.data.totalSteps, timeMs: Math.round(Math.random() * 5 + 1) });

      // Auto-play both
      setTimeout(() => { playback1.play(); playback2.play(); }, 300);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Race failed');
    } finally {
      setLoading(false);
    }
  }

  const winner = result1 && result2
    ? result1.steps < result2.steps
      ? SORTABLE_ALGORITHMS.find(a => a.key === algo1)?.label
      : result1.steps > result2.steps
      ? SORTABLE_ALGORITHMS.find(a => a.key === algo2)?.label
      : 'Tie!'
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      {/* Controls */}
      <div style={{ padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <select className="select-field" style={{ width: 'auto' }} value={algo1} onChange={e => setAlgo1(e.target.value as AlgorithmType)}>
          {SORTABLE_ALGORITHMS.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>

        <span style={{ color: 'var(--on-surface-variant)', fontWeight: 600, fontSize: '1.25rem' }}>⚔️ VS</span>

        <select className="select-field" style={{ width: 'auto' }} value={algo2} onChange={e => setAlgo2(e.target.value as AlgorithmType)}>
          {SORTABLE_ALGORITHMS.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>

        <input
          className="input-field"
          style={{ width: '250px' }}
          placeholder="Array: 38, 27..."
          value={inputArray}
          onChange={e => setInputArray(e.target.value)}
        />

        <button className="btn-gradient" onClick={handleRace} disabled={loading}>
          {loading ? 'Racing...' : '🏁 Start Race'}
        </button>
      </div>

      {/* Winner banner */}
      {winner && (
        <div style={{
          textAlign: 'center', padding: 'var(--space-3)',
          background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(96,165,250,0.2))',
          border: '1px solid rgba(52,211,153,0.3)', margin: '0 var(--space-8)',
          borderRadius: 'var(--radius-lg)', fontWeight: 600, fontSize: '1.125rem',
        }}>
          🏆 Winner: {winner} {result1 && result2 && `(${Math.min(result1.steps, result2.steps)} steps vs ${Math.max(result1.steps, result2.steps)} steps)`}
        </div>
      )}

      {/* Split race panels */}
      <div style={{ display: 'flex', flex: 1, gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-8)', overflow: 'hidden' }}>
        {/* Left racer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{SORTABLE_ALGORITHMS.find(a => a.key === algo1)?.label}</span>
            {result1 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>{result1.steps} steps</span>}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <ArrayVisualizer snapshot={playback1.currentSnapshot} originalArray={currentArray} />
          </div>
          <PlaybackBar
            currentIndex={playback1.currentIndex} totalSteps={playback1.totalSteps}
            isPlaying={playback1.isPlaying} speed={playback1.speed}
            description={playback1.currentSnapshot?.description || 'Waiting...'}
            onPlay={playback1.play} onPause={playback1.pause}
            onStepForward={playback1.stepForward} onStepBackward={playback1.stepBackward}
            onSpeedChange={playback1.setSpeed}
          />
        </div>

        {/* Right racer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{SORTABLE_ALGORITHMS.find(a => a.key === algo2)?.label}</span>
            {result2 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>{result2.steps} steps</span>}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <ArrayVisualizer snapshot={playback2.currentSnapshot} originalArray={currentArray} />
          </div>
          <PlaybackBar
            currentIndex={playback2.currentIndex} totalSteps={playback2.totalSteps}
            isPlaying={playback2.isPlaying} speed={playback2.speed}
            description={playback2.currentSnapshot?.description || 'Waiting...'}
            onPlay={playback2.play} onPause={playback2.pause}
            onStepForward={playback2.stepForward} onStepBackward={playback2.stepBackward}
            onSpeedChange={playback2.setSpeed}
          />
        </div>
      </div>
    </div>
  );
}
