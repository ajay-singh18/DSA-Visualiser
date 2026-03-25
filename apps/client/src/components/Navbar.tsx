import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const user = localStorage.getItem('dsa-user') ? JSON.parse(localStorage.getItem('dsa-user')!) : null;

  return (
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
      <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
        ⚡ DSA Visualizer
      </Link>
      
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
  );
}
