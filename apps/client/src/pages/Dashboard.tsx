import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import type { CustomLayoutDTO, GraphNode, GraphEdge } from '@dsa-visualizer/shared';

import Navbar from '../components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [layouts, setLayouts] = useState<CustomLayoutDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'array' | 'graph'>('array');
  const [arrayInput, setArrayInput] = useState('10, 20, 30, 40, 50');
  
  // Basic Graph Generator state (Nodes + edges)
  const [graphNodes, setGraphNodes] = useState('A, B, C, D');
  const [graphEdges, setGraphEdges] = useState('A-B, B-C, C-D, D-A');

  useEffect(() => {
    const rawUser = localStorage.getItem('dsa-user');
    if (!rawUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(rawUser));
    fetchLayouts();
  }, [navigate]);

  async function fetchLayouts() {
    try {
      const res = await apiClient.get('/layouts');
      setLayouts(res.data);
    } catch (err) {
      console.error('Failed to fetch layouts', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateLayout(e: React.FormEvent) {
    e.preventDefault();
    try {
      let payload: any = { title: newTitle, dataType: newType };
      
      if (newType === 'array') {
        payload.arrayData = arrayInput.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
      } else {
        // Minimal parser for graph
        const nodes: GraphNode[] = graphNodes.split(',').map((id, i) => ({
          id: id.trim(), label: id.trim(), x: 100 + (i * 80), y: 200 + ((i % 2) * 80)
        }));
        const edges: GraphEdge[] = graphEdges.split(',').map(pair => {
          const [u, v] = pair.split('-');
          return { source: u?.trim(), target: v?.trim(), weight: 1 };
        }).filter(e => e.source && e.target);
        payload.nodes = nodes;
        payload.edges = edges;
        payload.isDirected = false;
      }

      await apiClient.post('/layouts', payload);
      setIsCreating(false);
      setNewTitle('');
      fetchLayouts();
    } catch (err) {
      alert('Failed to create layout. Check console.');
      console.error(err);
    }
  }

  async function handleDeleteLayout(id: string) {
    if (!confirm('Are you sure you want to delete this layout?')) return;
    try {
      await apiClient.delete(`/layouts/${id}`);
      fetchLayouts();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-page">
        <h1>Welcome back, {user?.username} 👋</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{layouts.length}</h3>
            <p>Saved Layouts</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}>Your Saved Layouts</h3>
          <button className="btn-gradient" onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? 'Cancel' : '+ Create Layout'}
          </button>
        </div>

        {isCreating && (
          <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            <form onSubmit={handleCreateLayout} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label className="label">Layout Title</label>
                <input required className="input-field" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="E.g., Worst Case Quick Sort" />
              </div>
              
              <div>
                <label className="label">Data Type</label>
                <select className="select-field" value={newType} onChange={e => setNewType(e.target.value as any)}>
                  <option value="array">Array</option>
                  <option value="graph">Graph</option>
                </select>
              </div>

              {newType === 'array' ? (
                <div>
                  <label className="label">Array Elements (comma separated)</label>
                  <input required className="input-field" value={arrayInput} onChange={e => setArrayInput(e.target.value)} placeholder="10, 20, 30" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="label">Node IDs (comma separated)</label>
                    <input required className="input-field" value={graphNodes} onChange={e => setGraphNodes(e.target.value)} placeholder="A, B, C, D" />
                  </div>
                  <div>
                    <label className="label">Edges (u-v, comma separated)</label>
                    <input required className="input-field" value={graphEdges} onChange={e => setGraphEdges(e.target.value)} placeholder="A-B, B-C, C-D" />
                  </div>
                </>
              )}

              <button type="submit" className="btn-gradient" style={{ alignSelf: 'flex-start' }}>Save Layout</button>
            </form>
          </div>
        )}

        {layouts.length === 0 && !isCreating ? (
          <p style={{ color: 'var(--on-surface-variant)' }}>No layouts saved yet. Create one above!</p>
        ) : (
          <div className="layouts-grid" style={{ marginBottom: 'var(--space-8)' }}>
            {layouts.map((item) => (
              <div key={item.id} className="layout-card glass-card">
                <h4>{item.title}</h4>
                <span className={`badge`}>{item.dataType}</span>
                <p className="label" style={{ marginTop: 'var(--space-3)' }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                  <button onClick={() => handleDeleteLayout(item.id)} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
