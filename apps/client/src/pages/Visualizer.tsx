import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { AlgorithmType, GraphNode, GraphEdge, PerformanceMetrics } from '@dsa-visualizer/shared';
import ArrayVisualizer from '../components/canvas/ArrayVisualizer';
import GraphVisualizer from '../components/canvas/GraphVisualizer';
import TreeVisualizer from '../components/canvas/TreeVisualizer';
import DPTableVisualizer from '../components/canvas/DPTableVisualizer';
import CodePanel from '../components/editor/CodePanel';
import PlaybackBar from '../components/controls/PlaybackBar';
import VariableWatch from '../components/controls/VariableWatch';
import { usePlayback } from '../hooks/usePlayback';
import Navbar from '../components/Navbar';
import apiClient from '../api/client';

const DEFAULT_ARRAY = '38, 27, 43, 3, 9, 82, 10';
const DEFAULT_TREE_VALUES = '50, 30, 70, 20, null, 60, 80';

// Default Graph layout string
const DEFAULT_GRAPH_STR = 'A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2';

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
  { key: 'prims', label: "Prim's (MST)", type: 'graph' },
  { key: 'kruskals', label: "Kruskal's (MST)", type: 'graph' },
  { key: 'bellman-ford', label: 'Bellman-Ford', type: 'graph' },
  { key: 'floyd-warshall', label: 'Floyd-Warshall', type: 'graph' },
  { key: 'a-star', label: 'A* Search', type: 'graph' },
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
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [graphInput, setGraphInput] = useState<string>(DEFAULT_GRAPH_STR);
  const [searchTarget, setSearchTarget] = useState<string>('43');
  const [deleteTarget, setDeleteTarget] = useState<string>('30');
  const [insertTarget, setInsertTarget] = useState<string>('');
  const [startNode, setStartNode] = useState<string>('A');
  const [aStarTarget, setAStarTarget] = useState<string>('E');
  const [dpParam, setDpParam] = useState<string>('8');
  const [lcsStrings, setLcsStrings] = useState<string>('ABCBDAB:BDCABA');
  const [knapsackInput, setKnapsackInput] = useState<string>('7, 1, 3, 4, 5, 1, 4, 5, 7');
  
  // Editor & Player States
  const [languages, setLanguages] = useState<any>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  // AI Tutor state
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const playback = usePlayback();
  const selectedAlgoMeta = ALGORITHMS.find(a => a.key === algorithm);

  // Fetch code snippets when algorithm changes (so code shows before clicking Run)
  useEffect(() => {
    apiClient.get(`/algorithms/code/${algorithm}`)
      .then(res => setLanguages(res.data.languages))
      .catch(() => setLanguages(null));
  }, [algorithm]);
  
  // Derived state for the actual array to pass to ArrayVisualizer
  const currentArray = inputArray.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n));
  const currentTreeValues = useMemo(() => {
    return treeValues.split(',').map(s => {
      const t = s.trim().toLowerCase();
      if (t === 'null') return null;
      const parsed = parseInt(t, 10);
      return isNaN(parsed) ? undefined : parsed;
    }).filter(v => v !== undefined) as (number | null)[];
  }, [treeValues]);

  function generateRandomArray() {
    const len = Math.floor(Math.random() * 8) + 5; // 5-12 elements
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 95) + 5);
    setInputArray(arr.join(', '));
  }

  function generateRandomTree() {
    const isBST = algorithm === 'bst-insert' || algorithm === 'bst-delete';
    if (isBST) {
      // BST modes: pure number arrays, no nulls
      const len = Math.floor(Math.random() * 6) + 5;
      const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 95) + 5);
      setTreeValues(arr.join(', '));
      return;
    }
    // Traversals: build a structurally valid level-order array with random nulls
    const targetNodes = Math.floor(Math.random() * 5) + 4; // 4-8 actual nodes
    const result: (number | string)[] = [];
    let placed = 0;
    let pendingSlots = 1; // start with the root slot

    while (placed < targetNodes && pendingSlots > 0) {
      const isNull = result.length > 0 && Math.random() < 0.2;
      if (isNull) {
        result.push('null');
        // null consumes a slot but doesn't open child slots
      } else {
        result.push(Math.floor(Math.random() * 95) + 5);
        placed++;
        pendingSlots += 2; // this node opens 2 child slots
      }
      pendingSlots--; // consumed one slot
    }
    // Trim trailing nulls
    while (result.length > 0 && result[result.length - 1] === 'null') {
      result.pop();
    }
    setTreeValues(result.join(', '));
  }

  function generateRandomGraph() {
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const numNodes = Math.floor(Math.random() * 3) + 4; // 4 to 6 nodes
    const activeNodes = nodes.slice(0, numNodes);
    const edgesFragment: string[] = [];
    for (let i = 0; i < numNodes; i++) {
      const u = activeNodes[i];
      // pick 1-2 random targets
      const targets = activeNodes.filter(n => n !== u).sort(() => 0.5 - Math.random()).slice(0, 2);
      for (const v of targets) {
        if (!edgesFragment.find(e => (e.includes(u) && e.includes(v)))) { // avoid duplicate edges crudely
          edgesFragment.push(`${u}-${v}:${Math.floor(Math.random() * 10) + 1}`);
        }
      }
    }
    setGraphInput(edgesFragment.join(', '));
  }

  // Generate a live preview of the tree before running animations for traversals/deletions
  const previewTreeNodes = useMemo(() => {
    if (selectedAlgoMeta?.type !== 'tree' || algorithm === 'bst-insert') return [];
    interface PreviewNode { id: string; value: number; left: PreviewNode | null; right: PreviewNode | null }
    let idCounter = 0;
    let root: PreviewNode | null = null;
    
    // bst-delete requires a real BST. Traversals can use any generic tree.
    if (algorithm === 'bst-delete') {
      const insert = (root: PreviewNode | null, val: number): PreviewNode => {
        if (!root) return { id: `n${idCounter++}`, value: val, left: null, right: null };
        if (val < root.value) root.left = insert(root.left, val);
        else if (val > root.value) root.right = insert(root.right, val);
        return root;
      };
      for (const val of currentTreeValues) {
        if (val !== null) root = insert(root, val);
      }
    } else {
       // Regular generic tree (Level Order)
       if (currentTreeValues.length === 0 || currentTreeValues[0] === null) return [];
       root = { id: `n${idCounter++}`, value: currentTreeValues[0]!, left: null, right: null };
       const queue = [root];
       let i = 1;
       while (queue.length > 0 && i < currentTreeValues.length) {
         const curr = queue.shift()!;
         if (i < currentTreeValues.length && currentTreeValues[i] !== null) {
           curr.left = { id: `n${idCounter++}`, value: currentTreeValues[i]!, left: null, right: null };
           queue.push(curr.left);
         }
         i++;
         if (i < currentTreeValues.length && currentTreeValues[i] !== null) {
           curr.right = { id: `n${idCounter++}`, value: currentTreeValues[i]!, left: null, right: null };
           queue.push(curr.right);
         }
         i++;
       }
    }

    const nodes: any[] = [];
    const layout = (node: PreviewNode | null, cx: number, cy: number, gap: number) => {
      if (!node) return;
      nodes.push({ id: node.id, value: node.value, left: node.left?.id || null, right: node.right?.id || null, x: cx, y: cy });
      layout(node.left, cx - gap, cy + 80, gap / 1.8);
      layout(node.right, cx + gap, cy + 80, gap / 1.8);
    };
    layout(root, 400, 60, 160);
    return nodes;
  }, [selectedAlgoMeta?.type, algorithm, currentTreeValues]);

  // Dynamically parse the graph string into circular nodes and edges
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
    const radius = 150;
    const centerX = 250;
    const centerY = 250;
    const angleStep = (2 * Math.PI) / (nodeSet.size || 1);
    let angle = -Math.PI / 2; // start top

    for (const id of Array.from(nodeSet).sort()) {
      nodes.push({ id, label: id, x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) });
      angle += angleStep;
    }
    return { nodes, edges };
  }, [graphInput]);

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
        payload.data = { nodes: currentGraph.nodes, edges: currentGraph.edges, isDirected: false };
        payload.startNodeId = startNode;
        if (algorithm === 'a-star') {
          payload.targetNodeId = aStarTarget;
        }
      } else if (selectedAlgoMeta?.type === 'tree') {
        payload.data = currentTreeValues;
        if (algorithm === 'bst-delete') {
          payload.target = parseInt(deleteTarget, 10);
        } else if (algorithm === 'bst-insert' && insertTarget.trim() !== '') {
          const parsed = parseInt(insertTarget, 10);
          if (!isNaN(parsed)) {
            payload.target = parsed;
          }
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
      
      apiClient.post('/auth/stats/algorithm', { algorithmKey: algorithm }).catch(() => {});
      
      setLanguages(res.data.languages);
      setMetrics(res.data.metrics || null);
      playback.loadSnapshots(res.data.snapshots, true); // true sets autoPlay to seamlessly animate
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
          <div className="canvas-header" style={{ flexWrap: 'nowrap', overflowX: 'auto', gap: '16px' }}>
            <select
              className="select-field"
              style={{ width: 'auto', padding: '0.5rem' }}
              value={algorithm}
              onChange={(e) => {
                const newAlgo = e.target.value as AlgorithmType;
                setAlgorithm(newAlgo);
                setSearchParams({ algo: newAlgo });
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
                  style={{ width: '250px', padding: '0.5rem' }}
                  placeholder="Array: 38, 27..."
                  value={inputArray}
                  onChange={(e) => setInputArray(e.target.value)}
                />
                <button className="btn-ghost" onClick={generateRandomArray} title="Generate random array" style={{ padding: '0.5rem' }}>
                  🎲
                </button>
              </>
            )}

            {/* Search target */}
            {selectedAlgoMeta?.type === 'searching' && (
              <input
                className="input-field"
                style={{ width: '100px', padding: '0.5rem' }}
                placeholder="Target"
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
              />
            )}

            {/* Graph connections input */}
            {selectedAlgoMeta?.type === 'graph' && (
              <>
                <input
                  className="input-field"
                  style={{ width: '220px', padding: '0.5rem' }}
                  placeholder="Edges: A-B:4, B-C:2..."
                  value={graphInput}
                  onChange={(e) => setGraphInput(e.target.value)}
                />
                <button className="btn-ghost" onClick={generateRandomGraph} title="Generate random graph" style={{ padding: '0.5rem' }}>
                  🎲
                </button>
              </>
            )}

            {/* Graph start node */}
            {selectedAlgoMeta?.type === 'graph' && (
              <input
                className="input-field"
                style={{ width: '90px', padding: '0.5rem' }}
                placeholder="Start (A)"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
              />
            )}

            {/* A* Target Node */}
            {algorithm === 'a-star' && (
              <input
                className="input-field"
                style={{ width: '90px', padding: '0.5rem' }}
                placeholder="Target (E)"
                value={aStarTarget}
                onChange={(e) => setAStarTarget(e.target.value)}
              />
            )}

            {/* Tree input values */}
            {selectedAlgoMeta?.type === 'tree' && (
              <>
                <input
                  className="input-field"
                  style={{ width: '300px', padding: '0.5rem' }}
                  placeholder="e.g. 50, 30..."
                  value={treeValues}
                  onChange={(e) => setTreeValues(e.target.value)}
                />
                <button className="btn-ghost" onClick={generateRandomTree} title="Generate random tree values" style={{ padding: '0.5rem' }}>
                  🎲
                </button>
              </>
            )}


            {/* BST Delete target */}
            {algorithm === 'bst-delete' && (
              <input
                className="input-field"
                style={{ width: '110px', padding: '0.5rem' }}
                placeholder="Delete key"
                type="number"
                value={deleteTarget}
                onChange={(e) => setDeleteTarget(e.target.value)}
              />
            )}

            {/* BST Insert target (optional) */}
            {algorithm === 'bst-insert' && (
              <input
                className="input-field"
                style={{ width: '140px', padding: '0.5rem' }}
                placeholder="Insert key (optional)"
                type="number"
                value={insertTarget}
                onChange={(e) => setInsertTarget(e.target.value)}
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

            <button className="btn-gradient" style={{ padding: '0.4rem 1rem', whiteSpace: 'nowrap', fontSize: '0.85rem' }} onClick={handleRun} disabled={loading}>
              {loading ? 'Running...' : '▶ Run'}
            </button>

            <button
              className="btn-gradient"
              disabled={loadingAI || !playback.currentSnapshot}
              onClick={async () => {
                if (!playback.currentSnapshot) return;
                setLoadingAI(true);
                setAiExplanation(null);
                setShowAiPanel(true);
                try {
                  const res = await apiClient.post('/ai/explain', {
                    algorithmName: selectedAlgoMeta?.label || algorithm,
                    codeLine: playback.currentSnapshot.codeLine,
                    snapshotDescription: playback.currentSnapshot.description,
                    variables: playback.currentSnapshot.variables || {},
                  });
                  setAiExplanation(res.data.explanation);
                } catch {
                  setAiExplanation('AI Tutor is currently unavailable.');
                } finally {
                  setLoadingAI(false);
                }
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(96,165,250,0.25))',
                border: '1px solid rgba(167,139,250,0.4)',
                padding: '0.4rem 1rem',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem'
              }}
            >
              {loadingAI ? '⏳ Thinking...' : '✨ Ask AI'}
            </button>
          </div>

          {/* Interactive visual canvas bounds */}
          <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

            {/* AI Explanation Floating Panel */}
            {showAiPanel && (
              <div style={{
                position: 'absolute',
                top: 'var(--space-4)',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 50,
                maxWidth: '520px',
                width: '90%',
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(167,139,250,0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 1.25rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✨</span>
                <p style={{ margin: 0, flex: 1, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--on-surface)' }}>
                  {loadingAI ? 'Thinking…' : (aiExplanation || 'Click Ask AI while paused on a step.')}
                </p>
                <button
                  onClick={() => { setShowAiPanel(false); setAiExplanation(null); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--on-surface-variant)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
              {selectedAlgoMeta?.type === 'graph' ? (
                <GraphVisualizer
                  snapshot={playback.currentSnapshot}
                  nodes={currentGraph.nodes}
                  edges={currentGraph.edges}
                  isDirected={false}
                />
              ) : selectedAlgoMeta?.type === 'tree' ? (
                <TreeVisualizer
                  snapshot={playback.currentSnapshot}
                  treeNodes={previewTreeNodes}
                />
              ) : selectedAlgoMeta?.type === 'dp' ? (
                <DPTableVisualizer snapshot={playback.currentSnapshot} />
              ) : (
                <ArrayVisualizer
                  snapshot={playback.currentSnapshot}
                  originalArray={currentArray}
                />
              )}
            </div>
          </div>

          <PlaybackBar
            currentIndex={playback.currentIndex}
            totalSteps={playback.totalSteps}
            isPlaying={playback.isPlaying}
            isFinished={playback.isFinished}
            speed={playback.speed}
            description={playback.currentSnapshot?.description || 'Select an algorithm and click Run to begin.'}
            onPlay={playback.play}
            onPause={playback.pause}
            onReplay={playback.replay}
            onStepForward={playback.stepForward}
            onStepBackward={playback.stepBackward}
            onSpeedChange={playback.setSpeed}
          />
        </div>

        {/* Right: Code editor and Metrics */}
        <div className="split-right" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <div style={{ flexShrink: 0, borderBottom: '1px solid var(--glass-border)' }}>
            <CodePanel
              languages={languages}
              currentLine={playback.currentSnapshot?.codeLine}
            />
          </div>

          <div style={{
            flex: 1,
            padding: '0.5rem 1rem',
            background: 'rgba(0,0,0,0.1)',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            overflowY: 'auto',
            minHeight: 0
          }}>
            <h4 style={{ 
              margin: 0, 
              color: 'var(--secondary)', 
              fontFamily: 'var(--font-display)', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              opacity: 0.7
            }}>
              Variable Watch
            </h4>
            <VariableWatch snapshot={playback.currentSnapshot} />
          </div>
          
          <div style={{
            padding: '0.6rem 1rem',
            background: 'rgba(0,0,0,0.2)',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            flexShrink: 0
          }}>
            <h4 style={{ margin: 0, color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>Performance Metrics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{ background: 'var(--glass-bg)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Taken</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: metrics ? 'var(--on-surface)' : 'var(--on-surface-variant)', marginTop: '0.1rem' }}>{metrics ? `${metrics.timeTakenMs}ms` : '-- ms'}</div>
              </div>
              <div style={{ background: 'var(--glass-bg)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operations</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: metrics ? 'var(--on-surface)' : 'var(--on-surface-variant)', marginTop: '0.1rem' }}>{metrics ? `${metrics.comparisons}C, ${metrics.swaps}S` : '--'}</div>
              </div>
              <div style={{ background: 'var(--glass-bg)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Complexity</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '0.1rem' }}>{metrics ? metrics.timeComplexity : '--'}</div>
              </div>
              <div style={{ background: 'var(--glass-bg)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Space Complexity</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--tertiary)', marginTop: '0.1rem' }}>{metrics ? metrics.spaceComplexity : '--'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
