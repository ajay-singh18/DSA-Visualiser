import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { AlgorithmType, GraphNode, GraphEdge } from '@dsa-visualizer/shared';
import ArrayVisualizer from '../components/canvas/ArrayVisualizer';
import GraphVisualizer from '../components/canvas/GraphVisualizer';
import TreeVisualizer from '../components/canvas/TreeVisualizer';
import DPTableVisualizer from '../components/canvas/DPTableVisualizer';
import CodePanel from '../components/editor/CodePanel';
import PlaybackBar from '../components/controls/PlaybackBar';
import { usePlayback } from '../hooks/usePlayback';
import Navbar from '../components/Navbar';
import apiClient from '../api/client';

const DEFAULT_ARRAY = '38, 27, 43, 3, 9, 82, 10';
const DEFAULT_TREE_VALUES = '50, 30, 70, 20, 40, 60, 80';

// A beautifully laid out default graph for initial testing
const DEFAULT_NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 200, y: 100 },
  { id: 'B', label: 'B', x: 100, y: 250 },
  { id: 'C', label: 'C', x: 300, y: 250 },
  { id: 'D', label: 'D', x: 150, y: 400 },
  { id: 'E', label: 'E', x: 400, y: 400 },
];
const DEFAULT_EDGES: GraphEdge[] = [
  { source: 'A', target: 'B', weight: 4 },
  { source: 'A', target: 'C', weight: 2 },
  { source: 'B', target: 'C', weight: 1 },
  { source: 'B', target: 'D', weight: 5 },
  { source: 'C', target: 'D', weight: 8 },
  { source: 'C', target: 'E', weight: 10 },
  { source: 'D', target: 'E', weight: 2 },
];

const ALGORITHMS: { key: string; label: string; type: 'sorting' | 'searching' | 'graph' | 'tree' | 'dp' }[] = [
  { key: 'bubble-sort', label: 'Bubble Sort', type: 'sorting' },
  { key: 'selection-sort', label: 'Selection Sort', type: 'sorting' },
  { key: 'insertion-sort', label: 'Insertion Sort', type: 'sorting' },
  { key: 'merge-sort', label: 'Merge Sort', type: 'sorting' },
  { key: 'quick-sort', label: 'Quick Sort', type: 'sorting' },
  { key: 'linear-search', label: 'Linear Search', type: 'searching' },
  { key: 'binary-search', label: 'Binary Search', type: 'searching' },
  { key: 'bfs', label: 'Breadth-First Search (BFS)', type: 'graph' },
  { key: 'dfs', label: 'Depth-First Search (DFS)', type: 'graph' },
  { key: 'dijkstra', label: "Dijkstra's Algorithm", type: 'graph' },
  { key: 'bst-insert', label: 'BST Insert', type: 'tree' },
  { key: 'bst-delete', label: 'BST Delete', type: 'tree' },
  { key: 'inorder', label: 'Inorder Traversal', type: 'tree' },
  { key: 'preorder', label: 'Preorder Traversal', type: 'tree' },
  { key: 'postorder', label: 'Postorder Traversal', type: 'tree' },
  { key: 'fibonacci-recursive', label: 'Fibonacci (Recursive)', type: 'dp' },
  { key: 'fibonacci-dp', label: 'Fibonacci (DP)', type: 'dp' },
  { key: 'knapsack-dp', label: '0/1 Knapsack (DP)', type: 'dp' },
  { key: 'lcs-dp', label: 'LCS (DP)', type: 'dp' },
];

export default function Visualizer() {
  const [searchParams] = useSearchParams();
  const algoParam = searchParams.get('algo') as AlgorithmType;

  const [algorithm, setAlgorithm] = useState<AlgorithmType>(algoParam || 'bubble-sort');
  
  useEffect(() => {
    if (algoParam && algoParam !== algorithm) {
      setAlgorithm(algoParam);
    }
  }, [algoParam]);
  
  // Data States
  const [inputArray, setInputArray] = useState<string>(DEFAULT_ARRAY);
  const [treeValues, setTreeValues] = useState<string>(DEFAULT_TREE_VALUES);
  const [searchTarget, setSearchTarget] = useState<string>('43');
  const [deleteTarget, setDeleteTarget] = useState<string>('30');
  const [startNode, setStartNode] = useState<string>('A');
  const [dpParam, setDpParam] = useState<string>('8');
  const [lcsStrings, setLcsStrings] = useState<string>('ABCBDAB:BDCABA');
  const [knapsackInput, setKnapsackInput] = useState<string>('7, 1, 3, 4, 5, 1, 4, 5, 7');
  
  // Editor & Player States
  const [languages, setLanguages] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const playback = usePlayback();
  const selectedAlgoMeta = ALGORITHMS.find(a => a.key === algorithm);
  
  // Derived state for the actual array to pass to ArrayVisualizer
  const currentArray = inputArray.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n));
  const currentTreeValues = treeValues.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n));

  function generateRandomArray() {
    const len = Math.floor(Math.random() * 8) + 5; // 5-12 elements
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 95) + 5);
    setInputArray(arr.join(', '));
  }

  async function handleRun() {
    setLoading(true);
    try {
      let payload: any = { algorithmKey: algorithm };

      if (selectedAlgoMeta?.type === 'sorting') {
        payload.data = currentArray;
      } else if (selectedAlgoMeta?.type === 'searching') {
        payload.data = currentArray;
        payload.target = parseInt(searchTarget, 10);
      } else if (selectedAlgoMeta?.type === 'graph') {
        payload.data = { nodes: DEFAULT_NODES, edges: DEFAULT_EDGES, isDirected: false };
        payload.startNodeId = startNode;
      } else if (selectedAlgoMeta?.type === 'tree') {
        payload.data = currentTreeValues;
        if (algorithm === 'bst-delete') {
          payload.target = parseInt(deleteTarget, 10);
        }
      } else if (selectedAlgoMeta?.type === 'dp') {
        if (algorithm === 'fibonacci-recursive' || algorithm === 'fibonacci-dp') {
          payload.data = [parseInt(dpParam, 10)];
        } else if (algorithm === 'knapsack-dp') {
          payload.data = knapsackInput.split(',').map((n: string) => parseInt(n.trim(), 10)).filter((n: number) => !isNaN(n));
        } else if (algorithm === 'lcs-dp') {
          payload.data = [0]; // dummy
          payload.startNodeId = lcsStrings;
        }
      }

      const res = await apiClient.post('/algorithms/run', payload);
      
      setLanguages(res.data.languages);
      playback.loadSnapshots(res.data.snapshots);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to run algorithm. Ensure formatting is correct.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      {/* Split screen */}
      <div className="split-screen">
        {/* Left: Canvas */}
        <div className="split-left">
          <div className="canvas-header" style={{ flexWrap: 'wrap' }}>
            <select
              className="select-field"
              style={{ width: 'auto' }}
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value as AlgorithmType);
                playback.pause();
              }}
            >
              <optgroup label="Sorting">
                {ALGORITHMS.filter(a => a.type === 'sorting').map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
              </optgroup>
              <optgroup label="Searching">
                {ALGORITHMS.filter(a => a.type === 'searching').map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
              </optgroup>
              <optgroup label="Graphs">
                {ALGORITHMS.filter(a => a.type === 'graph').map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
              </optgroup>
              <optgroup label="Trees">
                {ALGORITHMS.filter(a => a.type === 'tree').map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
              </optgroup>
              <optgroup label="Dynamic Programming">
                {ALGORITHMS.filter(a => a.type === 'dp').map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
              </optgroup>
            </select>

            {/* Array input for sorting/searching */}
            {(selectedAlgoMeta?.type === 'sorting' || selectedAlgoMeta?.type === 'searching') && (
              <>
                <input
                  className="input-field"
                  style={{ width: '250px' }}
                  placeholder="Array: 38, 27..."
                  value={inputArray}
                  onChange={(e) => setInputArray(e.target.value)}
                />
                <button className="btn-ghost" onClick={generateRandomArray} title="Generate random array" style={{ padding: '0.5rem 0.75rem' }}>
                  🎲
                </button>
              </>
            )}

            {/* Search target */}
            {selectedAlgoMeta?.type === 'searching' && (
              <input
                className="input-field"
                style={{ width: '100px' }}
                placeholder="Target"
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
              />
            )}

            {/* Graph start node */}
            {selectedAlgoMeta?.type === 'graph' && (
              <input
                className="input-field"
                style={{ width: '120px' }}
                placeholder="Start Node (A)"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
              />
            )}

            {/* Tree input values */}
            {selectedAlgoMeta?.type === 'tree' && (
              <input
                className="input-field"
                style={{ width: '280px' }}
                placeholder="Values: 50, 30, 70, 20..."
                value={treeValues}
                onChange={(e) => setTreeValues(e.target.value)}
              />
            )}

            {/* BST Delete target */}
            {algorithm === 'bst-delete' && (
              <input
                className="input-field"
                style={{ width: '100px' }}
                placeholder="Delete key"
                type="number"
                value={deleteTarget}
                onChange={(e) => setDeleteTarget(e.target.value)}
              />
            )}

            {/* Fibonacci N */}
            {(algorithm === 'fibonacci-recursive' || algorithm === 'fibonacci-dp') && (
              <input
                className="input-field"
                style={{ width: '120px' }}
                placeholder="N (e.g. 8)"
                type="number"
                value={dpParam}
                onChange={(e) => setDpParam(e.target.value)}
              />
            )}

            {/* Knapsack input */}
            {algorithm === 'knapsack-dp' && (
              <input
                className="input-field"
                style={{ width: '320px' }}
                placeholder="cap, w1,w2.., v1,v2.."
                value={knapsackInput}
                onChange={(e) => setKnapsackInput(e.target.value)}
              />
            )}

            {/* LCS strings */}
            {algorithm === 'lcs-dp' && (
              <input
                className="input-field"
                style={{ width: '250px' }}
                placeholder="STRING1:STRING2"
                value={lcsStrings}
                onChange={(e) => setLcsStrings(e.target.value)}
              />
            )}

            <button className="btn-gradient" onClick={handleRun} disabled={loading}>
              {loading ? 'Running...' : '▶ Run'}
            </button>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            {selectedAlgoMeta?.type === 'graph' ? (
              <GraphVisualizer
                snapshot={playback.currentSnapshot}
                nodes={DEFAULT_NODES}
                edges={DEFAULT_EDGES}
                isDirected={false}
              />
            ) : selectedAlgoMeta?.type === 'tree' ? (
              <TreeVisualizer
                snapshot={playback.currentSnapshot}
                treeNodes={[]}
              />
            ) : selectedAlgoMeta?.type === 'dp' ? (
              <DPTableVisualizer
                snapshot={playback.currentSnapshot}
              />
            ) : (
              <ArrayVisualizer
                snapshot={playback.currentSnapshot}
                originalArray={currentArray}
              />
            )}
          </div>

          <PlaybackBar
            currentIndex={playback.currentIndex}
            totalSteps={playback.totalSteps}
            isPlaying={playback.isPlaying}
            speed={playback.speed}
            description={playback.currentSnapshot?.description || 'Select an algorithm and click Run to begin.'}
            onPlay={playback.play}
            onPause={playback.pause}
            onStepForward={playback.stepForward}
            onStepBackward={playback.stepBackward}
            onSpeedChange={playback.setSpeed}
          />
        </div>

        {/* Right: Code editor */}
        <div className="split-right">
          <CodePanel
            languages={languages}
            currentLine={playback.currentSnapshot?.codeLine}
          />
        </div>
      </div>
    </div>
  );
}
