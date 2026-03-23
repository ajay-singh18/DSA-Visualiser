import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiClient from '../api/client';
import type { QuestionCategory, AssessmentQuestion } from '@dsa-visualizer/shared';

const CATEGORIES: { id: QuestionCategory; title: string; icon: string; desc: string }[] = [
  { id: 'sorting', title: 'Sorting', icon: '🔄', desc: 'Bubble, Merge, Quick Sort...' },
  { id: 'searching', title: 'Searching', icon: '🔍', desc: 'Binary and Linear Search' },
  { id: 'graph', title: 'Graphs', icon: '🕸️', desc: 'BFS, DFS, Dijkstra' },
  { id: 'tree', title: 'Trees', icon: '🌲', desc: 'BST Insert, Delete, Traversals' },
  { id: 'dp', title: 'Dynamic Prog', icon: '🧠', desc: 'Fibonacci, Knapsack, LCS' },
];

export default function AssessmentSetup() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('sorting');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setLoading(true);
    setError('');
    
    try {
      // NOTE: User must be logged in. 
      // If unauthorized, interceptor handles 401 redirection to login.
      const res = await apiClient.post('/assessments/start', {
        category: selectedCategory,
        questionCount,
        timeLimitMinutes: timeLimit
      });

      // Pass the quiz data to the quiz interface via router state
      navigate('/assessment/quiz', { 
        state: { 
          sessionId: res.data.sessionId,
          questions: res.data.questions as AssessmentQuestion[],
          timeLimitMinutes: res.data.timeLimitMinutes,
          startedAt: res.data.startedAt
        } 
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to start quiz. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-default)' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(90deg, #f472b6, #60a5fa)', WebkitBackgroundClip: 'text', color: 'transparent', marginBottom: 'var(--space-2)' }}>
              DSA Skill Assessment
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem' }}>
              Test your knowledge with timed quizzes, state predictions, and debugging challenges.
            </p>
          </div>

          {error && (
             <div style={{ padding: 'var(--space-4)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#fca5a5', textAlign: 'center' }}>
               {error}
             </div>
          )}

          <div style={{ background: 'var(--surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Category Selection */}
            <div>
              <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.25rem' }}>1. Select Topic</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
                      padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                      background: selectedCategory === cat.id ? 'rgba(96, 165, 250, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: \`1px solid \${selectedCategory === cat.id ? '#60a5fa' : 'rgba(255,255,255,0.1)'}\`,
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                    <span style={{ fontWeight: 600, color: selectedCategory === cat.id ? '#60a5fa' : 'white' }}>{cat.title}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Config Selection */}
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                  Number of Questions
                </label>
                <select className="select-field" value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))}>
                  <option value={3}>3 Questions (Quick)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={10}>10 Questions (Deep)</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                  Time Limit
                </label>
                <select className="select-field" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))}>
                  <option value={5}>5 Minutes</option>
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>

          </div>

          <button 
            className="btn-gradient" 
            onClick={handleStart} 
            disabled={loading}
            style={{ padding: '1rem', fontSize: '1.25rem', fontWeight: 600, marginTop: 'var(--space-2)' }}
          >
            {loading ? 'Initializing Assessment...' : '🚀 Start Assessment Now'}
          </button>
          
          <div style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
            Ensure you have a stable connection. The timer will start immediately.
          </div>

        </div>
      </main>
    </div>
  );
}
