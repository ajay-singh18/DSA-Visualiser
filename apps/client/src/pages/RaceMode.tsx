import { useState, useEffect, useMemo } from 'react';

import type { AlgorithmType, GraphNode, GraphEdge } from '@dsa-visualizer/shared';
import ArrayVisualizer from '../components/canvas/ArrayVisualizer';
import GraphVisualizer from '../components/canvas/GraphVisualizer';
import PlaybackBar from '../components/controls/PlaybackBar';
import { usePlayback } from '../hooks/usePlayback';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';

type RaceCategory = 'sorting' | 'searching' | 'graph';

const CATEGORIES: { id: RaceCategory; label: string }[] = [
  { id: 'sorting', label: 'Sorting' },
  { id: 'searching', label: 'Searching' },
  { id: 'graph', label: 'Graphs' },
];

const ALGORITHMS_BY_CATEGORY: Record<RaceCategory, { key: AlgorithmType; label: string }[]> = {
  'sorting': [
    { key: 'bubble-sort', label: 'Bubble Sort' },
    { key: 'selection-sort', label: 'Selection Sort' },
    { key: 'insertion-sort', label: 'Insertion Sort' },
    { key: 'merge-sort', label: 'Merge Sort' },
    { key: 'quick-sort', label: 'Quick Sort' },
  ],
  'searching': [
    { key: 'linear-search', label: 'Linear Search' },
    { key: 'binary-search', label: 'Binary Search' },
  ],
  'graph': [
    { key: 'bfs', label: 'Breadth-First Search' },
    { key: 'dfs', label: 'Depth-First Search' },
  ]
};

const DEFAULT_ARRAY = '38, 27, 43, 3, 9, 82, 10';
const DEFAULT_SORTED_ARRAY = '3, 9, 10, 27, 38, 43, 82';
const DEFAULT_GRAPH_STR = 'A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2';

export default function RaceMode() {
  const [category, setCategory] = useState<RaceCategory>('sorting');
  
  const [algo1, setAlgo1] = useState<AlgorithmType>('bubble-sort');
  const [algo2, setAlgo2] = useState<AlgorithmType>('quick-sort');
  
  const [inputArray, setInputArray] = useState(DEFAULT_ARRAY);
  const [searchTarget, setSearchTarget] = useState('43');
  const [graphInput, setGraphInput] = useState(DEFAULT_GRAPH_STR);
  const [startNode, setStartNode] = useState('A');

  const [loading, setLoading] = useState(false);

  // Race results
  const [result1, setResult1] = useState<{ steps: number; timeMs: number } | null>(null);
  const [result2, setResult2] = useState<{ steps: number; timeMs: number } | null>(null);

  const playback1 = usePlayback();
  const playback2 = usePlayback();

  // Reset algos when category changes
  useEffect(() => {
    const list = ALGORITHMS_BY_CATEGORY[category];
    if (list.length >= 2) {
      setAlgo1(list[0].key);
      setAlgo2(list[1].key);
    } else {
      setAlgo1(list[0].key);
      setAlgo2(list[0].key);
    }
    setResult1(null);
    setResult2(null);
    playback1.loadSnapshots([]);
    playback2.loadSnapshots([]);
    
    // Binary search needs sorted array
    if (category === 'searching') {
      setInputArray(DEFAULT_SORTED_ARRAY);
    } else if (category === 'sorting') {
      setInputArray(DEFAULT_ARRAY);
    }
  }, [category]);

  const currentArray = useMemo(() => {
    let arr = inputArray.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
    // Auto sort for binary search (or searching races in general to be fair)
    if (category === 'searching') {
      arr = [...arr].sort((a, b) => a - b);
    }
    return arr;
  }, [inputArray, category]);

  const currentGraph = useMemo(() => {
    const edges: GraphEdge[] = [];
    const nodeSet = new Set<string>();

    const pairs = graphInput.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    for (const pair of pairs) {
      const [path, weightStr] = pair.split(':');
      const [u, v] = path.split('-');
      if (u && v) {
         nodeSet.add(u);
         nodeSet.add(v);
         edges.push({ source: u, target: v, weight: weightStr ? parseInt(weightStr, 10) : 1 });
      } else if (u) {
         nodeSet.add(u);
      }
    }

    const nodes: GraphNode[] = [];
    const radius = 120; // Slightly smaller for split screen
    const centerX = 200;
    const centerY = 200;
    const angleStep = (2 * Math.PI) / (nodeSet.size || 1);
    let angle = -Math.PI / 2;

    for (const id of Array.from(nodeSet).sort()) {
      nodes.push({ id, label: id, x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) });
      angle += angleStep;
    }
    return { nodes, edges };
  }, [graphInput]);


  async function handleRace() {
    setLoading(true);
    setResult1(null);
    setResult2(null);
    playback1.pause();
    playback2.pause();

    try {
      let payload1: any = { algorithmKey: algo1 };
      let payload2: any = { algorithmKey: algo2 };

      if (category === 'sorting') {
        payload1.data = currentArray;
        payload2.data = currentArray;
      } else if (category === 'searching') {
        payload1.data = currentArray;
        payload1.target = parseInt(searchTarget, 10);
        payload2.data = currentArray;
        payload2.target = parseInt(searchTarget, 10);
      } else if (category === 'graph') {
        const graphData = { nodes: currentGraph.nodes, edges: currentGraph.edges, isDirected: false };
        payload1.data = graphData;
        payload1.startNodeId = startNode;
        payload2.data = graphData;
        payload2.startNodeId = startNode;
      }

      const [res1, res2] = await Promise.all([
        apiClient.post('/algorithms/run', payload1),
        apiClient.post('/algorithms/run', payload2),
      ]);

      playback1.loadSnapshots(res1.data.snapshots);
      playback2.loadSnapshots(res2.data.snapshots);

      const steps1 = res1.data.totalSteps as number;
      const steps2 = res2.data.totalSteps as number;

      setResult1({ steps: steps1, timeMs: Math.round(Math.random() * 5 + 1) });
      setResult2({ steps: steps2, timeMs: Math.round(Math.random() * 5 + 1) });

      // Determine winner
      const winnerKey = steps1 < steps2 ? algo1 : steps1 > steps2 ? algo2 : 'tie';

      // Record race in backend
      apiClient.post('/auth/stats/race', {
        algo1,
        algo2,
        winner: winnerKey,
        steps1,
        steps2,
      }).catch(() => {});

      // Auto-play both
      setTimeout(() => { playback1.play(); playback2.play(); }, 300);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Race failed');
    } finally {
      setLoading(false);
    }
  }

  const isRaceFinished = 
    playback1.totalSteps > 0 && playback2.totalSteps > 0 &&
    playback1.currentIndex >= playback1.totalSteps - 1 &&
    playback2.currentIndex >= playback2.totalSteps - 1;

  const winner = (result1 && result2 && isRaceFinished)
    ? result1.steps < result2.steps
      ? ALGORITHMS_BY_CATEGORY[category].find(a => a.key === algo1)?.label
      : result1.steps > result2.steps
      ? ALGORITHMS_BY_CATEGORY[category].find(a => a.key === algo2)?.label
      : 'Tie!'
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <Navbar />

      <div className="race-toolbar">
        {/* Category Selector */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              style={{
                padding: '6px 12px',
                border: 'none',
                background: category === c.id ? 'var(--primary)' : 'transparent',
                color: category === c.id ? '#fff' : 'var(--on-surface-variant)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="race-toolbar-sep" />

        {/* Algo 1 */}
        <select className="select-field" style={{ width: 'auto' }} value={algo1} onChange={e => setAlgo1(e.target.value as AlgorithmType)}>
          {ALGORITHMS_BY_CATEGORY[category].map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>

        <span style={{ color: 'var(--on-surface-variant)', fontWeight: 600, fontSize: '1.25rem' }}>⚔️ VS</span>

        {/* Algo 2 */}
        <select className="select-field" style={{ width: 'auto' }} value={algo2} onChange={e => setAlgo2(e.target.value as AlgorithmType)}>
          {ALGORITHMS_BY_CATEGORY[category].map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>

        <div className="race-toolbar-sep" />

        {/* Dynamic Inputs Based on Category */}
        {(category === 'sorting' || category === 'searching') && (
          <input
            className="input-field"
            style={{ width: category === 'searching' ? '180px' : '250px' }}
            placeholder="Array: 38, 27..."
            value={inputArray}
            onChange={e => setInputArray(e.target.value)}
          />
        )}

        {category === 'searching' && (
          <input
            className="input-field"
            style={{ width: '100px' }}
            placeholder="Target"
            type="number"
            value={searchTarget}
            onChange={e => setSearchTarget(e.target.value)}
          />
        )}

        {category === 'graph' && (
          <>
            <input
              className="input-field"
              style={{ width: '250px' }}
              placeholder="Edges: A-B:4..."
              value={graphInput}
              onChange={e => setGraphInput(e.target.value)}
            />
            <input
              className="input-field"
              style={{ width: '100px' }}
              placeholder="Start"
              value={startNode}
              onChange={e => setStartNode(e.target.value.toUpperCase())}
            />
          </>
        )}

        <button className="btn-gradient" onClick={handleRace} disabled={loading} style={{ marginLeft: 'auto' }}>
          {loading ? 'Racing...' : '🏁 Start Race'}
        </button>
      </div>

      {winner && (
        <div style={{
          textAlign: 'center', padding: 'var(--space-3)',
          background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(96,165,250,0.2))',
          borderBottom: '1px solid rgba(52,211,153,0.3)', fontWeight: 600, fontSize: '1.125rem',
        }}>
          🏆 Winner: {winner} {result1 && result2 && `(${Math.min(result1.steps, result2.steps)} steps vs ${Math.max(result1.steps, result2.steps)} steps)`}
        </div>
      )}

      {/* Split race panels */}
      <div className="race-panels">
        {/* Left racer */}
        <div className="race-panel">
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{ALGORITHMS_BY_CATEGORY[category].find(a => a.key === algo1)?.label}</span>
            {result1 && isRaceFinished && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>{result1.steps} steps</span>}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            {category === 'graph' ? (
               <GraphVisualizer snapshot={playback1.currentSnapshot} nodes={currentGraph.nodes} edges={currentGraph.edges} />
            ) : (
               <ArrayVisualizer snapshot={playback1.currentSnapshot} originalArray={currentArray} />
            )}
          </div>
          <PlaybackBar
            currentIndex={playback1.currentIndex} totalSteps={playback1.totalSteps}
            isPlaying={playback1.isPlaying} speed={playback1.speed}
            description={playback1.currentSnapshot?.description || 'Waiting...'}
            isFinished={playback1.currentIndex >= playback1.totalSteps - 1 && playback1.totalSteps > 0}
            onPlay={playback1.play} onPause={playback1.pause}
            onStepForward={playback1.stepForward} onStepBackward={playback1.stepBackward}
            onSpeedChange={playback1.setSpeed}
            onReplay={() => { playback1.pause(); playback1.loadSnapshots(playback1.currentSnapshot ? [playback1.currentSnapshot] : []); }}
          />
        </div>

        {/* Right racer */}
        <div className="race-panel">
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{ALGORITHMS_BY_CATEGORY[category].find(a => a.key === algo2)?.label}</span>
            {result2 && isRaceFinished && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>{result2.steps} steps</span>}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
             {category === 'graph' ? (
               <GraphVisualizer snapshot={playback2.currentSnapshot} nodes={currentGraph.nodes} edges={currentGraph.edges} />
            ) : (
               <ArrayVisualizer snapshot={playback2.currentSnapshot} originalArray={currentArray} />
            )}
          </div>
          <PlaybackBar
            currentIndex={playback2.currentIndex} totalSteps={playback2.totalSteps}
            isPlaying={playback2.isPlaying} speed={playback2.speed}
            description={playback2.currentSnapshot?.description || 'Waiting...'}
            isFinished={playback2.currentIndex >= playback2.totalSteps - 1 && playback2.totalSteps > 0}
            onPlay={playback2.play} onPause={playback2.pause}
            onStepForward={playback2.stepForward} onStepBackward={playback2.stepBackward}
            onSpeedChange={playback2.setSpeed}
            onReplay={() => { playback2.pause(); playback2.loadSnapshots(playback2.currentSnapshot ? [playback2.currentSnapshot] : []); }}
          />
        </div>
      </div>
    </div>
  );
}
