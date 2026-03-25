import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

import Navbar from '../components/Navbar';

// ── Types ────────────────────────────────────
interface CategoryStat {
  category: string;
  quizzesTaken: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

interface RecentSession {
  id: string;
  category: string;
  score: number;
  total: number;
  percentage: number;
  submittedAt: string;
}

interface AssessmentStats {
  totalQuizzes: number;
  averageScore: number;
  bestCategory: string | null;
  categoryBreakdown: CategoryStat[];
  recentSessions: RecentSession[];
}

const CATEGORY_COLORS: Record<string, string> = {
  sorting: '#f472b6',
  searching: '#60a5fa',
  graph: '#a78bfa',
  tree: '#34d399',
  dp: '#fbbf24',
  logic: '#fb923c',
};

const CATEGORY_ICONS: Record<string, string> = {
  sorting: '🔄',
  searching: '🔍',
  graph: '🕸️',
  tree: '🌲',
  dp: '🧠',
  logic: '💡',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<AssessmentStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const rawUser = localStorage.getItem('dsa-user');
    if (!rawUser) { navigate('/login'); return; }
    setUser(JSON.parse(rawUser));
    fetchStats();
  }, [navigate]);

  async function fetchStats() {
    try {
      const res = await apiClient.get('/assessments/stats');
      setStats(res.data);
    } catch { /* empty */ } finally { setStatsLoading(false); }
  }

  if (statsLoading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

  const maxAccuracy = stats?.categoryBreakdown?.length
    ? Math.max(...stats.categoryBreakdown.map(c => c.accuracy), 1)
    : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-page">
        <h1>Welcome back, {user?.username} 👋</h1>

        {/* ═══ Assessment Activity Section ═══ */}
        <h3 className="section-title" style={{ marginTop: 'var(--space-6)' }}>📊 Assessment Activity</h3>

        {statsLoading ? (
          <p style={{ color: 'var(--on-surface-variant)' }}>Loading assessment stats...</p>
        ) : !stats || stats.totalQuizzes === 0 ? (
          <div className="glass-card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem' }}>
              No quizzes taken yet. <span style={{ cursor: 'pointer', color: '#60a5fa', textDecoration: 'underline' }} onClick={() => navigate('/assessment')}>Take your first quiz!</span>
            </p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="stat-card" style={{ borderLeft: '4px solid #60a5fa' }}>
                <h3 style={{ fontSize: '2.25rem', color: '#60a5fa', margin: 0 }}>{stats.totalQuizzes}</h3>
                <p style={{ margin: '0.25rem 0 0', opacity: 0.7 }}>Quizzes Taken</p>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #34d399' }}>
                <h3 style={{ fontSize: '2.25rem', color: '#34d399', margin: 0 }}>{stats.averageScore}%</h3>
                <p style={{ margin: '0.25rem 0 0', opacity: 0.7 }}>Average Score</p>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #fbbf24' }}>
                <h3 style={{ fontSize: '2.25rem', color: '#fbbf24', margin: 0 }}>
                  {stats.bestCategory ? `${CATEGORY_ICONS[stats.bestCategory] || '🏆'} ${stats.bestCategory}` : '—'}
                </h3>
                <p style={{ margin: '0.25rem 0 0', opacity: 0.7 }}>Best Category</p>
              </div>
            </div>

            {/* Category Breakdown Bar Chart */}
            <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <h4 style={{ margin: '0 0 var(--space-4)', fontWeight: 600 }}>Category Performance</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.categoryBreakdown.map(cat => (
                  <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '100px', fontSize: '0.875rem', color: 'var(--on-surface-variant)', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      {CATEGORY_ICONS[cat.category] || '📁'} {cat.category}
                    </span>
                    <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.max(2, (cat.accuracy / maxAccuracy) * 100)}%`,
                        background: `linear-gradient(90deg, ${CATEGORY_COLORS[cat.category] || '#60a5fa'}88, ${CATEGORY_COLORS[cat.category] || '#60a5fa'})`,
                        borderRadius: '6px',
                        transition: 'width 0.8s ease-out',
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '0.5rem',
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          {cat.accuracy}%
                        </span>
                      </div>
                    </div>
                    <span style={{ width: '80px', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textAlign: 'right' }}>
                      {cat.correctAnswers}/{cat.totalQuestions}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assessment History */}
            <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)', overflowX: 'auto' }}>
              <h4 style={{ margin: '0 0 var(--space-4)', fontWeight: 600 }}>Recent Assessments</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--on-surface-variant)', opacity: 0.7 }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem' }}>Category</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}>Score</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}>Accuracy</th>
                    <th style={{ textAlign: 'right', padding: '0.75rem 0.5rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSessions.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', textTransform: 'capitalize' }}>
                        {CATEGORY_ICONS[s.category] || '📁'} {s.category}
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)' }}>
                        {s.score}/{s.total}
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                          background: s.percentage >= 70 ? 'rgba(52,211,153,0.15)' : s.percentage >= 40 ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)',
                          color: s.percentage >= 70 ? '#34d399' : s.percentage >= 40 ? '#fbbf24' : '#f87171',
                        }}>
                          {s.percentage}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', padding: '0.75rem 0.5rem', color: 'var(--on-surface-variant)' }}>
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
