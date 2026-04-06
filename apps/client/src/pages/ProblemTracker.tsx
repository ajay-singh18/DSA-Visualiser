import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../api/client';
import { DSA_TOPICS, DIFFICULTY_CONFIG, getTotalProblems, type Difficulty } from '../data/dsaProblems';

// ── Local Storage Keys ──
const LS_COMPLETED = 'dsa-tracker-completed';
const LS_STARRED = 'dsa-tracker-starred';
const LS_NOTES = 'dsa-tracker-notes';

// ── Persist helpers ──
function loadSet(key: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch { return new Set(); }
}
function saveSet(key: string, s: Set<string>) { localStorage.setItem(key, JSON.stringify([...s])); }
function loadMap(key: string): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function saveMap(key: string, m: Record<string, string>) { localStorage.setItem(key, JSON.stringify(m)); }

// ── Difficulty filter type ──
type DifficultyFilter = 'All' | Difficulty;

export default function ProblemTracker() {
  // State
  const [completed, setCompleted] = useState<Set<string>>(() => loadSet(LS_COMPLETED));
  const [starred, setStarred] = useState<Set<string>>(() => loadSet(LS_STARRED));
  const [notes, setNotes] = useState<Record<string, string>>(() => loadMap(LS_NOTES));
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [noteModalId, setNoteModalId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  // Persist on change
  useEffect(() => { saveSet(LS_COMPLETED, completed); }, [completed]);
  useEffect(() => { saveSet(LS_STARRED, starred); }, [starred]);
  useEffect(() => { saveMap(LS_NOTES, notes); }, [notes]);

  // Focus note input when modal opens
  useEffect(() => {
    if (noteModalId && noteInputRef.current) {
      setTimeout(() => noteInputRef.current?.focus(), 50);
    }
  }, [noteModalId]);

  // ── Handlers ──
  const toggleCompleted = async (id: string, name: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      const isCompleting = !next.has(id);
      
      if (isCompleting) {
        next.add(id);
        // Fire & forget: increment heatmap via backend assuming user is logged in
        apiClient.post('/auth/stats/problem-completed', { problemName: name }).catch(() => {});
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const toggleStarred = (id: string) => {
    setStarred(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      next.has(topicId) ? next.delete(topicId) : next.add(topicId);
      return next;
    });
  };

  const openNoteModal = (id: string) => {
    setNoteText(notes[id] || '');
    setNoteModalId(id);
  };

  const saveNote = () => {
    if (noteModalId) {
      setNotes(prev => {
        const next = { ...prev };
        if (noteText.trim()) next[noteModalId] = noteText.trim();
        else delete next[noteModalId];
        return next;
      });
      setNoteModalId(null);
    }
  };

  const expandAll = () => setExpandedTopics(new Set(DSA_TOPICS.map(t => t.id)));
  const collapseAll = () => setExpandedTopics(new Set());

  // ── Computed Stats ──
  const totalProblems = getTotalProblems();
  const totalCompleted = completed.size;
  const totalStarred = starred.size;
  const overallPercent = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  // ── Filter topics & problems ──
  const filteredTopics = DSA_TOPICS.map(topic => {
    const filtered = topic.problems.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
      if (showStarredOnly && !starred.has(p.id)) return false;
      return true;
    });
    return { ...topic, problems: filtered };
  }).filter(t => t.problems.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div className="tracker-page">
        {/* ══════ Header ══════ */}
        <div className="tracker-header">
          <div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              DSA Problem Tracker
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', margin: 'var(--space-2) 0 0', fontSize: '1rem' }}>
              Master DSA patterns — track, star, and take notes on {totalProblems} curated problems
            </p>
          </div>
        </div>

        {/* ══════ Global Stats ══════ */}
        <div className="tracker-stats-row">
          <div className="tracker-stat-card">
            <div className="tracker-stat-ring" style={{ '--ring-pct': `${overallPercent}%`, '--ring-color': '#a78bfa' } as React.CSSProperties}>
              <span className="tracker-stat-ring-value">{overallPercent}%</span>
            </div>
            <div className="tracker-stat-info">
              <span className="tracker-stat-value">{totalCompleted}/{totalProblems}</span>
              <span className="tracker-stat-label">Completed</span>
            </div>
          </div>

          <div className="tracker-stat-card">
            <div className="tracker-stat-icon-circle" style={{ background: 'rgba(251, 191, 36, 0.12)' }}>⭐</div>
            <div className="tracker-stat-info">
              <span className="tracker-stat-value">{totalStarred}</span>
              <span className="tracker-stat-label">Starred for Revision</span>
            </div>
          </div>

          <div className="tracker-stat-card">
            <div className="tracker-stat-icon-circle" style={{ background: 'rgba(96, 165, 250, 0.12)' }}>📝</div>
            <div className="tracker-stat-info">
              <span className="tracker-stat-value">{Object.keys(notes).length}</span>
              <span className="tracker-stat-label">Notes Added</span>
            </div>
          </div>

          {/* <div className="tracker-stat-card">
            <div className="tracker-stat-icon-circle" style={{ background: 'rgba(52, 211, 153, 0.12)' }}>📂</div>
            <div className="tracker-stat-info">
              <span className="tracker-stat-value">{DSA_TOPICS.length}</span>
              <span className="tracker-stat-label">Topics</span>
            </div>
          </div> */}
        </div>

        {/* ══════ Filters ══════ */}
        <div className="tracker-filters">
          <div className="tracker-search-wrap">
            <span className="tracker-search-icon">🔎</span>
            <input
              type="text"
              className="tracker-search-input"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="tracker-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="tracker-filter-pills">
            {(['All', 'Easy', 'Medium', 'Hard'] as DifficultyFilter[]).map(d => (
              <button
                key={d}
                className={`tracker-pill ${difficultyFilter === d ? 'active' : ''}`}
                onClick={() => setDifficultyFilter(d)}
                style={d !== 'All' && difficultyFilter === d ? {
                  background: DIFFICULTY_CONFIG[d as Difficulty].bg,
                  borderColor: DIFFICULTY_CONFIG[d as Difficulty].color,
                  color: DIFFICULTY_CONFIG[d as Difficulty].color,
                } : {}}
              >
                {d}
              </button>
            ))}

            <button
              className={`tracker-pill ${showStarredOnly ? 'active' : ''}`}
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              style={showStarredOnly ? { background: 'rgba(251,191,36,0.12)', borderColor: '#fbbf24', color: '#fbbf24' } : {}}
            >
              ⭐ Starred
            </button>
          </div>

          <div className="tracker-expand-btns">
            <button className="btn-ghost" onClick={expandAll} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Expand All</button>
            <button className="btn-ghost" onClick={collapseAll} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Collapse All</button>
          </div>
        </div>

        {/* ══════ Topics List ══════ */}
        <div className="tracker-topics-list">
          {filteredTopics.length === 0 && (
            <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>🔍</p>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>No problems found matching your filters.</p>
            </div>
          )}

          {filteredTopics.map(topic => {
            const isExpanded = expandedTopics.has(topic.id);
            const topicOriginal = DSA_TOPICS.find(t => t.id === topic.id)!;
            const topicCompleted = topicOriginal.problems.filter(p => completed.has(p.id)).length;
            const topicTotal = topicOriginal.problems.length;
            const topicPct = topicTotal > 0 ? Math.round((topicCompleted / topicTotal) * 100) : 0;

            return (
              <div key={topic.id} className="tracker-topic-card glass-card" style={{ overflow: 'hidden' }}>
                {/* ── Topic Header ── */}
                <button
                  className="tracker-topic-header"
                  onClick={() => toggleTopic(topic.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="tracker-topic-left">
                    <span className="tracker-topic-icon" style={{ background: `${topic.color}18` }}>{topic.icon}</span>
                    <div className="tracker-topic-info">
                      <h3 className="tracker-topic-title">{topic.title}</h3>
                      <p className="tracker-topic-desc">{topic.description}</p>
                    </div>
                  </div>

                  <div className="tracker-topic-right">
                    <div className="tracker-topic-progress-wrap">
                      <div className="tracker-topic-progress-bar">
                        <div
                          className="tracker-topic-progress-fill"
                          style={{ width: `${topicPct}%`, background: topic.color }}
                        />
                      </div>
                      <span className="tracker-topic-progress-text" style={{ color: topic.color }}>
                        {topicCompleted}/{topicTotal}
                      </span>
                    </div>
                    <span className={`tracker-chevron ${isExpanded ? 'open' : ''}`}>▾</span>
                  </div>
                </button>

                {/* ── Problems List ── */}
                <div className={`tracker-problems-wrapper ${isExpanded ? 'expanded' : ''}`}>
                  <div className="tracker-problems-inner">
                    {topic.problems.map((problem, idx) => {
                      const isCompleted = completed.has(problem.id);
                      const isStarred = starred.has(problem.id);
                      const hasNote = !!notes[problem.id];
                      const diffConf = DIFFICULTY_CONFIG[problem.difficulty];

                      return (
                        <div
                          key={problem.id}
                          className={`tracker-problem-row ${isCompleted ? 'completed' : ''}`}
                          style={{ animationDelay: `${idx * 30}ms` }}
                        >
                          {/* Checkbox */}
                          <button
                            className={`tracker-checkbox ${isCompleted ? 'checked' : ''}`}
                            onClick={() => toggleCompleted(problem.id, problem.name)}
                            title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                            style={isCompleted ? { background: topic.color, borderColor: topic.color } : {}}
                          >
                            {isCompleted && <span className="tracker-check-icon">✓</span>}
                          </button>

                          {/* Problem Name & Number */}
                          <div className="tracker-problem-name-area">
                            <span className="tracker-lc-number">{idx + 1}.</span>
                            <span className={`tracker-problem-name ${isCompleted ? 'done' : ''}`}>
                              {problem.name}
                            </span>
                          </div>

                          {/* Difficulty Badge */}
                          <span
                            className="tracker-difficulty-badge"
                            style={{ color: diffConf.color, background: diffConf.bg }}
                          >
                            {problem.difficulty}
                          </span>

                          {/* Actions */}
                          <div className="tracker-problem-actions">
                            {/* Star */}
                            <button
                              className={`tracker-action-btn ${isStarred ? 'starred' : ''}`}
                              onClick={() => toggleStarred(problem.id)}
                              title={isStarred ? 'Unstar' : 'Star for revision'}
                            >
                              {isStarred ? '⭐' : '☆'}
                            </button>

                            {/* Note */}
                            <button
                              className={`tracker-action-btn ${hasNote ? 'has-note' : ''}`}
                              onClick={() => openNoteModal(problem.id)}
                              title={hasNote ? 'Edit note' : 'Add note'}
                            >
                              {hasNote ? '📝' : '✏️'}
                            </button>

                            {/* LeetCode Link */}
                            <a
                              href={problem.leetcodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="tracker-action-btn tracker-lc-link"
                              title="Open on LeetCode"
                            >
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════ Note Modal ══════ */}
      {noteModalId && (
        <>
          <div className="tracker-modal-overlay" onClick={() => setNoteModalId(null)} />
          <div className="tracker-modal">
            <div className="tracker-modal-header">
              <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.125rem' }}>
                📝 {(() => {
                  for (const t of DSA_TOPICS) {
                    const p = t.problems.find(p => p.id === noteModalId);
                    if (p) return p.name;
                  }
                  return 'Problem';
                })()}
              </h3>
              <button className="tracker-modal-close" onClick={() => setNoteModalId(null)}>✕</button>
            </div>
            <textarea
              ref={noteInputRef}
              className="tracker-note-textarea"
              placeholder="Write your notes here... (approach, key insight, time complexity, etc.)"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={6}
            />
            <div className="tracker-modal-footer">
              <button className="btn-ghost" onClick={() => setNoteModalId(null)}>Cancel</button>
              <button
                className="btn-gradient"
                onClick={saveNote}
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', color: '#fff' }}
              >
                Save Note
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
