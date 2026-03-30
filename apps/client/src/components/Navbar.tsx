import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const user = localStorage.getItem('dsa-user') ? JSON.parse(localStorage.getItem('dsa-user')!) : null;

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav 
        className="navbar" 
        style={{ 
          zIndex: 100, 
          position: 'sticky', 
          top: 0, 
          background: 'var(--surface-color)', 
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 var(--space-6)',
          justifyContent: 'space-between',
          height: '60px',
          minHeight: '60px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--on-surface)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'none'
            }}
          >
            ☰
          </button>
          
          <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            Algoviz
          </Link>
        </div>
        
        <ul className="navbar-links" style={{ display: 'flex', listStyle: 'none', margin: '0 auto', padding: 0, gap: 'var(--space-6)', alignItems: 'center' }}>
          <li><Link to="/visualizer" className={location.pathname === '/visualizer' ? 'active' : ''}>Visualizer</Link></li>
          <li><Link to="/race" className={location.pathname === '/race' ? 'active' : ''}>Race Mode</Link></li>
          <li><Link to="/docs" className={location.pathname.startsWith('/docs') ? 'active' : ''}>Docs</Link></li>
          <li><Link to="/assessment" className={location.pathname === '/assessment' ? 'active' : ''}>Quiz</Link></li>
          <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <ThemeToggle />
          {user ? (
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <div className="navbar-avatar" title={user.username}>{user.username?.[0]?.toUpperCase() || 'U'}</div>
            </Link>
          ) : (
            <Link to="/login" className="btn-ghost">Sign In</Link>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`mobile-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '250px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid var(--glass-border)',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-6)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--on-surface)' }}>Menu</span>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--on-surface)',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <li><Link to="/" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--on-surface)', fontSize: '1.1rem' }}>Home</Link></li>
          <li><Link to="/visualizer" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--on-surface)', fontSize: '1.1rem' }}>Visualizer</Link></li>
          <li><Link to="/race" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--on-surface)', fontSize: '1.1rem' }}>Race Mode</Link></li>
          <li><Link to="/docs" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--on-surface)', fontSize: '1.1rem' }}>Docs</Link></li>
          <li><Link to="/assessment" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--on-surface)', fontSize: '1.1rem' }}>Quiz</Link></li>
          <li><Link to="/dashboard" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--on-surface)', fontSize: '1.1rem' }}>Dashboard</Link></li>
        </ul>
      </div>
    </>
  );
}
