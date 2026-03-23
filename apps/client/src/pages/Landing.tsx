import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AnimatedDemo from '../components/AnimatedDemo';

const FloatingNode = ({ delay, x, y, size, color }: any) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0.6, 0] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      filter: 'blur(4px)',
      zIndex: 0,
    }}
  />
);

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  // Generate some random floating nodes for the background
  const nodes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 5,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 40 + 20,
    // Mix of primary/secondary/tertiary colors
    color: ['rgba(124, 58, 237, 0.4)', 'rgba(37, 99, 235, 0.4)', 'rgba(219, 39, 119, 0.4)'][Math.floor(Math.random() * 3)],
  }));

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Animated Background Nodes */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {nodes.map(node => <FloatingNode key={node.id} {...node} />)}
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: 'var(--space-8)' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: '900px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-6)',
          }}
        >
          <motion.div variants={itemVariants} style={{
            display: 'inline-block',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(12px)',
            color: 'var(--primary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Now with 19+ Algorithms
          </motion.div>

          <motion.h1 variants={itemVariants} style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--on-surface) 0%, rgba(255,255,255,0.4) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>
            Algorithms,
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Beautifully Visualized.</span>
          </motion.h1>

          <motion.p variants={itemVariants} style={{
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            color: 'var(--on-surface-variant)',
            maxWidth: '600px',
            lineHeight: 1.6,
            margin: '0 0 var(--space-4) 0',
          }}>
            Master Data Structures and Algorithms with interactive, step-by-step visualizations, dynamic programming tables, and syntax-highlighted code execution.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/visualizer" style={{ textDecoration: 'none' }}>
              <button className="btn-gradient" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)' }}>
                Start Visualizing →
              </button>
            </Link>
            <Link to="/race" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border-highlight)',
                color: 'var(--on-surface)',
                padding: '0.875rem 2rem',
                fontSize: '1.125rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
              >
                🏁 Race Mode
              </button>
            </Link>
          </motion.div>

          {/* Interactive Demo Component */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <AnimatedDemo />
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={containerVariants} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-6)',
            width: '100%',
            marginTop: 'var(--space-8)',
          }}>
            {[
              { icon: '🌳', title: 'Trees & Graphs', desc: 'Watch BFS, DFS, Dijkstra, and BST operations unfold in real-time node animations.' },
              { icon: '🧠', title: 'Dynamic Programming', desc: 'Visualize the DP table filling up cell-by-cell alongside the recursive call stack.' },
              { icon: '⚔️', title: 'Algorithm Races', desc: 'Pit two sorting algorithms against each other on the same dataset to compare efficiency.' },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(12px)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'left',
                boxShadow: 'var(--glass-shadow)',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>{feature.icon}</div>
                <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.25rem', color: 'var(--on-surface)' }}>{feature.title}</h3>
                <p style={{ margin: 0, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
