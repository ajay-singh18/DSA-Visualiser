import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import apiClient from '../api/client';

/* ═══════════════════════════════════════════════════
   Mock Data (Stats / Heatmap / Activity)
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   Constants & Generators
   ═══════════════════════════════════════════════════ */

const BADGES_LIST = [
  { icon: '🔄', name: 'Sorting Master', desc: 'Complete all sorting algorithms' },
  { icon: '⚡', name: 'Speed Demon', desc: 'Solve 10 under 30 seconds' },
  { icon: '🔥', name: '7 Day Streak', desc: 'Practice 7 days in a row' },
  { icon: '💯', name: 'Perfect Score', desc: '100% on any assessment' },
  { icon: '🌲', name: 'Tree Hugger', desc: 'Complete all tree algorithms' },
  { icon: '🕸️', name: 'Graph Guru', desc: 'Complete all graph algorithms' },
  { icon: '🧠', name: 'DP Master', desc: 'Complete all DP problems' },
  { icon: '🏆', name: 'Champion', desc: 'Win 50 race mode battles' },
];

const DEFAULT_CATEGORIES = [
  { name: 'Sorting', completed: 0, total: 10, color: '#f472b6' },
  { name: 'Graphs', completed: 0, total: 8, color: '#a78bfa' },
  { name: 'Trees', completed: 0, total: 6, color: '#34d399' },
  { name: 'Searching', completed: 0, total: 4, color: '#60a5fa' },
  { name: 'Dynamic Programming', completed: 0, total: 7, color: '#fbbf24' },
  { name: 'Backtracking', completed: 0, total: 5, color: '#fb923c' },
];

function generateDynamicHeatmapData(activities: any[]): number[] {
  const days = new Array(364).fill(0);
  if (!activities || !activities.length) return days;
  
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  activities.forEach(act => {
    if (!act.date) return;
    const actDate = new Date(act.date);
    const diffTime = Math.abs(today.getTime() - actDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays < 364) {
      const index = 363 - diffDays;
      days[index] = Math.min((days[index] || 0) + 1, 4);
    }
  });
  return days;
}

const HEATMAP_COLORS = [
  'rgba(255,255,255,0.06)',   // 0 - empty
  'rgba(0,212,255,0.2)',      // 1 - light
  'rgba(0,212,255,0.4)',      // 2 - medium
  'rgba(0,212,255,0.65)',     // 3 - high
  'rgba(0,212,255,0.9)',      // 4 - max
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ═══════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════ */
export default function Profile() {
  const navigate = useNavigate();
  const [animatedBars, setAnimatedBars] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    github: '',
    linkedin: '',
    leetcode: ''
  });
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedBars(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get('/auth/me');
        setProfile(data.user);
        setEditForm({
          username: data.user.username || '',
          bio: data.user.bio || '',
          github: data.user.github || '',
          linkedin: data.user.linkedin || '',
          leetcode: data.user.leetcode || ''
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset form to current profile
      setEditForm({
        username: profile.username || '',
        bio: profile.bio || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        leetcode: profile.leetcode || ''
      });
      setSaveError('');
    }
    setIsEditing(!isEditing);
  };

  function handleSaveProfile() {
    setIsSaving(true);
    setSaveError('');
    apiClient.put('/auth/profile', editForm)
      .then((res) => {
        setProfile(res.data.user);
        setIsEditing(false);
        // update local storage safely
        const currentStorage = JSON.parse(localStorage.getItem('dsa-user') || '{}');
        localStorage.setItem('dsa-user', JSON.stringify({ ...currentStorage, ...res.data.user }));
      })
      .catch((err) => {
        setSaveError(err.response?.data?.error || 'Failed to update profile');
      })
      .finally(() => setIsSaving(false));
  }

  function handleLogout() {
    localStorage.removeItem('dsa-token');
    localStorage.removeItem('dsa-user');
    navigate('/login');
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  /* --- Dynamic Data Construction --- */
  const joinDate = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Unknown';

  const heatmapData = generateDynamicHeatmapData(profile?.activity || []);
  const totalContributions = profile?.activity?.length || 0;

  const dynamicStats = [
    { icon: '⚡', value: profile?.profileStats?.algorithmsVisualized || 0, label: 'Algorithms Visualized', color: '#00d4ff' },
    { icon: '✅', value: profile?.profileStats?.testsPassed || 0, label: 'Tests Passed', color: '#34d399' },
    { icon: '🔥', value: profile?.profileStats?.currentStreak || 0, label: 'Current Streak', color: '#fbbf24' },
    { icon: '🎯', value: profile?.profileStats?.accuracy || 0, label: 'Accuracy %', color: '#a78bfa' },
  ];

  const dynamicBadges = BADGES_LIST.map(b => ({
    ...b,
    unlocked: profile?.badges?.includes(b.name) || false
  }));

  const dynamicCategories = profile?.categoryProgress?.length 
    ? profile.categoryProgress 
    : DEFAULT_CATEGORIES;

  const activityFeed = profile?.activity?.length 
    ? [...profile.activity].reverse().slice(0, 10).map((act: any) => ({
        ...act,
        time: new Date(act.date).toLocaleDateString()
      }))
    : [{ icon: '👋', text: 'Welcome to DSA Visualizer', time: 'Just now' }];

  const raceHistory = profile?.raceHistory || [];
  const wins = raceHistory.filter((r: any) => r.result === 'win').length;
  const losses = raceHistory.filter((r: any) => r.result === 'loss').length;
  
  const algoCounts: Record<string, number> = {};
  raceHistory.forEach((r: any) => {
    algoCounts[r.algo1] = (algoCounts[r.algo1] || 0) + 1;
  });
  const favouriteAlgo = Object.keys(algoCounts).length > 0 
    ? Object.keys(algoCounts).reduce((a, b) => algoCounts[a] > algoCounts[b] ? a : b) 
    : 'None';


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="profile-page">

        {/* ═══ 1. Header Section ═══ */}
        <section className="profile-header glass-card">
          <div className="profile-header-top">
            <div className="profile-avatar-area">
              <div className="profile-avatar">
                {profile?.username ? profile.username[0].toUpperCase() : 'U'}
                <span className="profile-online-dot" />
              </div>
              <div className="profile-info" style={{ minWidth: '280px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      style={{ padding: '6px 12px', fontSize: '1rem', width: '100%' }}
                    />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Bio / Tagline"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      style={{ padding: '6px 12px', fontSize: '0.875rem', width: '100%' }}
                    />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="GitHub URL"
                      value={editForm.github}
                      onChange={(e) => setEditForm({...editForm, github: e.target.value})}
                      style={{ padding: '6px 12px', fontSize: '0.875rem', width: '100%' }}
                    />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="LinkedIn URL"
                      value={editForm.linkedin}
                      onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                      style={{ padding: '6px 12px', fontSize: '0.875rem', width: '100%' }}
                    />
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="LeetCode URL"
                      value={editForm.leetcode}
                      onChange={(e) => setEditForm({...editForm, leetcode: e.target.value})}
                      style={{ padding: '6px 12px', fontSize: '0.875rem', width: '100%' }}
                    />
                    {saveError && <span style={{ color: '#f87171', fontSize: '0.8125rem', marginTop: '4px' }}>{saveError}</span>}
                  </div>
                ) : (
                  <>
                    <h1 className="profile-display-name">{profile?.username}</h1>
                    {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
                    
                    <div className="profile-socials">
                      {profile?.github && (
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="profile-social-btn" title="GitHub">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                      )}
                      {profile?.linkedin && (
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-social-btn" title="LinkedIn">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                      )}
                      {profile?.leetcode && (
                        <a href={profile.leetcode} target="_blank" rel="noopener noreferrer" className="profile-social-btn" title="LeetCode">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="profile-header-actions">
              {isEditing ? (
                 <>
                   <button className="profile-btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                     {isSaving ? 'Saving...' : '💾 Save Profile'}
                   </button>
                   <button className="profile-btn-outline" onClick={handleEditToggle}>❌ Cancel</button>
                 </>
              ) : (
                <>
                  <button className="profile-btn-primary" onClick={handleEditToggle}>✏️ Edit Profile</button>
                  <button className="profile-btn-outline" onClick={handleLogout}>🚪 Logout</button>
                </>
              )}
              <span className="profile-joined">📅 Joined {joinDate}</span>
            </div>
          </div>
        </section>

        {/* ═══ 2. Quick Stats ═══ */}
        <section className="profile-stats-grid">
          {dynamicStats.map((stat) => (
            <div className="profile-stat-card glass-card" key={stat.label}>
              <span className="profile-stat-icon">{stat.icon}</span>
              <span className="profile-stat-value" style={{ color: stat.color }}>
                {stat.value}{stat.label === 'Accuracy %' ? '%' : ''}
              </span>
              <span className="profile-stat-label">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* ═══ 3. Activity Heatmap ═══ */}
        <section className="profile-section glass-card">
          <div className="profile-section-header">
            <h3>📊 Activity Heatmap</h3>
            <span className="profile-contrib-count">{totalContributions} contributions in the last year</span>
          </div>
          <div className="profile-heatmap-wrapper">
            <div className="profile-heatmap-months">
              {MONTHS.map((m) => <span key={m}>{m}</span>)}
            </div>
            <div className="profile-heatmap-grid">
              {heatmapData.map((level, i) => (
                <div
                  key={i}
                  className="profile-heatmap-cell"
                  style={{ background: HEATMAP_COLORS[level] }}
                  title={`${level} contributions`}
                />
              ))}
            </div>
            <div className="profile-heatmap-legend">
              <span>Less</span>
              {HEATMAP_COLORS.map((c, i) => (
                <div key={i} className="profile-heatmap-cell" style={{ background: c }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </section>

        {/* ═══ 4. Badges & Achievements ═══ */}
        <section className="profile-section glass-card">
          <h3>🏅 Badges & Achievements</h3>
          <div className="profile-badges-grid">
            {dynamicBadges.map((badge) => (
              <div
                key={badge.name}
                className={`profile-badge-card ${badge.unlocked ? '' : 'profile-badge-locked'}`}
              >
                <span className="profile-badge-icon">{badge.unlocked ? badge.icon : '🔒'}</span>
                <span className="profile-badge-name">{badge.name}</span>
                <span className="profile-badge-desc">{badge.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 5. Category Progress ═══ */}
        <section className="profile-section glass-card">
          <h3>📈 Category Progress</h3>
          <div className="profile-progress-list">
            {dynamicCategories.map((cat: any) => {
              const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
              return (
                <div key={cat.name} className="profile-progress-item">
                  <div className="profile-progress-header">
                    <span className="profile-progress-name">{cat.name}</span>
                    <span className="profile-progress-count">
                      {cat.completed}/{cat.total} <span style={{ color: cat.color, fontWeight: 600 }}>({pct}%)</span>
                    </span>
                  </div>
                  <div className="profile-progress-track">
                    <div
                      className="profile-progress-fill"
                      style={{
                        width: animatedBars ? `${pct}%` : '0%',
                        background: `linear-gradient(90deg, ${cat.color}66, ${cat.color})`,
                        boxShadow: `0 0 12px ${cat.color}44`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ 6. Two-Column Bottom ═══ */}
        <section className="profile-two-col">
          {/* Left: Recent Activity */}
          <div className="profile-section glass-card">
            <h3>🕐 Recent Activity</h3>
            <div className="profile-activity-feed">
              {activityFeed.map((item: any, i: number) => (
                <div key={i} className="profile-activity-item">
                  <span className="profile-activity-icon">{item.icon}</span>
                  <div className="profile-activity-content">
                    <span className="profile-activity-text">{item.text}</span>
                    <span className="profile-activity-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Race Mode History */}
          <div className="profile-section glass-card">
            <h3>🏁 Race Mode History</h3>
            <div className="profile-race-summary">
              <div className="profile-race-stat">
                <span className="profile-race-stat-value" style={{ color: '#34d399' }}>
                  {wins}W
                </span>
                <span className="profile-race-stat-label">Wins</span>
              </div>
              <div className="profile-race-stat">
                <span className="profile-race-stat-value" style={{ color: '#f87171' }}>
                  {losses}L
                </span>
                <span className="profile-race-stat-label">Losses</span>
              </div>
              <div className="profile-race-stat">
                <span className="profile-race-stat-value" style={{ color: '#00d4ff', fontSize: favouriteAlgo.length > 10 ? '1rem' : '1.5rem' }}>{favouriteAlgo}</span>
                <span className="profile-race-stat-label">Favourite</span>
              </div>
            </div>
            
            {raceHistory.length > 0 ? (
              <div className="profile-race-list">
                {raceHistory.map((race: any, i: number) => (
                  <div key={i} className="profile-race-item">
                    <div className="profile-race-matchup">
                      <span>{race.algo1}</span>
                      <span className="profile-race-vs">vs</span>
                      <span>{race.algo2}</span>
                    </div>
                    <div className="profile-race-meta">
                      <span
                        className={`profile-race-badge ${race.result === 'win' ? 'profile-race-win' : 'profile-race-loss'}`}
                      >
                        {race.result === 'win' ? '🏆 Win' : '❌ Loss'}
                      </span>
                      <span className="profile-race-time">{new Date(race.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                    No race history yet.
                </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
