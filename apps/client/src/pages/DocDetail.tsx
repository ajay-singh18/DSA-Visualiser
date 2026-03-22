import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '../components/Navbar';
import { ALGORITHM_DOCS } from '../data/docs';

export default function DocDetail() {
  const { algoKey } = useParams();
  const navigate = useNavigate();
  
  const doc = ALGORITHM_DOCS.find(d => d.key === algoKey);

  if (!doc) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Algorithm not found</h2>
          <Link to="/docs" className="btn-ghost">← Back to Library</Link>
        </div>
      </div>
    );
  }

  // Common styling for markdown elements
  const markdownComponents = {
    h1: ({node, ...props}: any) => <h1 style={{ color: 'var(--on-surface)', marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }} {...props} />,
    h2: ({node, ...props}: any) => <h2 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
    h3: ({node, ...props}: any) => <h3 style={{ color: 'var(--on-surface)', marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
    p: ({node, ...props}: any) => <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, marginBottom: '1rem' }} {...props} />,
    ul: ({node, ...props}: any) => <ul style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
    li: ({node, ...props}: any) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
    code: ({node, inline, ...props}: any) => 
      inline 
        ? <code style={{ background: 'var(--surface-color)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--primary)' }} {...props} />
        : <code style={{ display: 'block', padding: '1.5rem', background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', overflowX: 'auto', fontFamily: 'monospace', lineHeight: 1.5, marginBottom: '1.5rem' }} {...props} />,
    pre: ({node, ...props}: any) => <pre style={{ margin: 0, padding: 0, background: 'transparent' }} {...props} />,
    blockquote: ({node, ...props}: any) => <blockquote style={{ borderLeft: '4px solid var(--primary)', margin: '1.5rem 0', padding: '1rem 1.5rem', background: 'var(--surface-color)', borderRadius: '0 8px 8px 0', color: 'var(--on-surface)' }} {...props} />,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Sidebar Nav */}
        <aside style={{ width: '250px', padding: 'var(--space-6) 0', borderRight: '1px solid var(--glass-border)', display: 'none', '@media (minWidth: 768px)': { display: 'block' } } as any}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', position: 'sticky', top: '80px' }}>
            <Link to="/docs" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>← Back to Library</Link>
            <h4 style={{ color: 'var(--on-surface)', margin: '0 0 var(--space-2) 0', textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.7 }}>On this page</h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>Overview</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)' }}>Pseudocode</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)' }}>Complexity</div>
          </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: 'var(--space-8)', maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
            <div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  background: 'rgba(124, 58, 237, 0.2)', 
                  color: 'var(--primary)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}>
                  {doc.category}
                </span>
              </div>
              <h1 style={{ fontSize: '3rem', margin: 0, color: 'var(--on-surface)' }}>{doc.title}</h1>
            </div>
            
            <button 
              className="btn-gradient" 
              onClick={() => navigate(`/visualizer?algo=${doc.key}`)}
              style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
            >
              <span>▶</span> Visualize Now
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-6)', 
            padding: 'var(--space-4)', 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-8)'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Time Complexity</div>
              <div style={{ fontSize: '1.25rem', color: 'var(--on-surface)', fontWeight: 600, fontFamily: 'monospace' }}>{doc.timeComplexity}</div>
            </div>
            <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Space Complexity</div>
              <div style={{ fontSize: '1.25rem', color: 'var(--on-surface)', fontWeight: 600, fontFamily: 'monospace' }}>{doc.spaceComplexity}</div>
            </div>
          </div>

          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {doc.content}
            </ReactMarkdown>
          </div>
          
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center' }}>
            <button 
              className="btn-gradient" 
              onClick={() => navigate(`/visualizer?algo=${doc.key}`)}
              style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
            >
              Launch Virtualizer for {doc.title}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
