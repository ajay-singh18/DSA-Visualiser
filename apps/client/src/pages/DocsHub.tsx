import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ALGORITHM_DOCS } from '../data/docs';

export default function DocsHub() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categories = ['all', 'sorting', 'searching', 'graph', 'tree', 'dp'];

  const filteredDocs = ALGORITHM_DOCS.filter(doc => {
    const matchesFilter = filter === 'all' || doc.category === filter;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || 
                          doc.shortDesc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ padding: 'var(--space-8)', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 var(--space-4) 0', color: 'var(--on-surface)' }}>Algorithm Library</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto' }}>
            Explore 19+ algorithms, from fundamental sorting to advanced dynamic programming and graph traversals.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="Search algorithms..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--glass-border-highlight)',
              background: 'var(--surface-color)',
              color: 'var(--on-surface)',
              width: '100%',
              maxWidth: '400px',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: filter === c ? 'var(--primary)' : 'var(--surface-color)',
                color: filter === c ? '#fff' : 'var(--on-surface)',
                border: filter === c ? '1px solid transparent' : '1px solid var(--glass-border)',
                cursor: 'pointer',
                fontWeight: 500,
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {filteredDocs.map((doc, i) => (
            <motion.div
              key={doc.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/docs/${doc.key}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--on-surface)' }}>{doc.title}</h2>
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
                  <p style={{ margin: 0, color: 'var(--on-surface-variant)', fontSize: '0.9rem', lineHeight: 1.5, flex: 1 }}>
                    {doc.shortDesc}
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
                    <div>⏱️ {doc.timeComplexity}</div>
                    <div>💾 {doc.spaceComplexity}</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {filteredDocs.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--on-surface-variant)' }}>
            No algorithms found matching your criteria.
          </div>
        )}
      </main>
    </div>
  );
}
