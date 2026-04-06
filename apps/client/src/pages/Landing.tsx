import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AnimatedDemo from '../components/AnimatedDemo';

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Floating Background Node ── */
const FloatingNode = ({ delay, x, y, size, color }: any) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: [0, -20, 0], opacity: [0, 0.5, 0.5, 0] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      borderRadius: '50%', background: color, filter: 'blur(30px)', zIndex: 0,
    }}
  />
);

/* ── Main Landing ── */
export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 180, damping: 18 } },
  };

  const nodes = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 6,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 100 + 40,
    color: ['rgba(124,58,237,0.25)', 'rgba(37,99,235,0.25)', 'rgba(219,39,119,0.25)'][i % 3],
  }));

  const stats = [
    { value: 19, suffix: '+', label: 'Algorithms' },
    { value: 4, suffix: '', label: 'Languages' },
    { value: 6, suffix: '+', label: 'Data Structures' },
    { value: 100, suffix: '%', label: 'Open Source' },
  ];

  const howItWorks = [
    { step: '01', title: 'Choose an Algorithm', desc: 'Pick from sorting, searching, trees, graphs, or DP algorithms.', icon: '🎯' },
    { step: '02', title: 'Watch it Execute', desc: 'See each operation animate in real-time with synchronized code highlighting.', icon: '▶️' },
    { step: '03', title: 'Master the Concept', desc: 'Track complexity, compare alternatives, and test your knowledge.', icon: '🏆' },
  ];

  const features = [
    { icon: '🌲', title: 'Trees & Graphs', desc: 'BFS, DFS, Dijkstra, BST Insert/Delete with real-time node animations and edge highlighting.', color: 'var(--primary)' },
    { icon: '🧠', title: 'Dynamic Programming', desc: 'Visualize 2D DP tables filling cell-by-cell alongside the recursive call stack.', color: 'var(--tertiary)' },
    { icon: '⚔️', title: 'Algorithm Races', desc: 'Pit two sorting algorithms head-to-head on identical datasets to compare performance.', color: 'var(--secondary)' },
    { icon: '💻', title: 'Multi-Language Code', desc: 'View algorithm implementations in C++, Java, Python, and JavaScript side by side.', color: '#10b981' },
    { icon: '📊', title: 'Timed Assessments', desc: 'Test your DSA knowledge with timed quizzes and track your progress over time.', color: '#f59e0b' },
    { icon: '📝', title: 'Problem Tracker', desc: 'Track your progress across 120+ curated LeetCode problems with personal notes and topic filters.', color: '#8b5cf6' },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-grid" />
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {nodes.map(n => <FloatingNode key={n.id} {...n} />)}
      </div>

      <Navbar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 10 }}>

        {/* ════════ HERO: Text on Top ════════ */}
        <motion.section
          variants={containerVariants} initial="hidden" animate="visible"
          style={{ maxWidth: '1200px', width: '100%', padding: 'clamp(3rem,8vh,6rem) var(--space-4) var(--space-6)', textAlign: 'center' }}
        >
          <motion.div variants={itemVariants} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(90deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))',
            border: '1px solid rgba(236,72,153,0.3)', color: 'var(--tertiary)',
            fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            <span style={{ filter: 'drop-shadow(0 0 8px var(--tertiary))' }}>✦</span> Introducing Algoviz 2.0
          </motion.div>

          <motion.h1 variants={itemVariants} style={{
            fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.08,
            letterSpacing: '-0.03em', margin: 'var(--space-6) auto var(--space-4)', maxWidth: '900px',
          }}>
            Master Algorithms{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Through Interactive Discovery</span>
          </motion.h1>

          <motion.p variants={itemVariants} style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--on-surface-variant)',
            maxWidth: '650px', lineHeight: 1.6, margin: '0 auto var(--space-6)',
          }}>
            Step-by-step visualizations, synchronized code execution, DP tables, and algorithm races — all in one beautifully crafted platform.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/visualizer" style={{ textDecoration: 'none' }}>
              <button className="btn-gradient" style={{
                padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 700, color: '#fff',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                border: 'none', boxShadow: '0 8px 32px rgba(96,165,250,0.4)',
              }}>
                Start Visualizing →
              </button>
            </Link>
            <Link to="/race" style={{ textDecoration: 'none' }}>
              <button className="landing-btn-ghost">🏁 Race Mode</button>
            </Link>
            <Link to="/assessment" style={{ textDecoration: 'none' }}>
              <button className="landing-btn-ghost">📝 Take Assessment</button>
            </Link>
            <Link to="/problems" style={{ textDecoration: 'none' }}>
              <button className="landing-btn-ghost">💻 Solve Problems</button>
            </Link>
          </motion.div>
        </motion.section>

        {/* ════════ LIVE DEMO: Visualizer Left + Code Right ════════ */}
        <motion.section
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          style={{ maxWidth: '1200px', width: '100%', padding: '0 var(--space-4) var(--space-8)' }}
        >
          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
            {/* Glow behind the demo */}
            <div style={{
              position: 'absolute', inset: '-30px', zIndex: -1,
              background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.12) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div className="landing-demo-window">
              <div className="landing-demo-titlebar">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }}/>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}/>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }}/>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>~/algoviz — bubble-sort.ts</span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span className="landing-demo-badge">LIVE</span>
                </div>
              </div>
              <AnimatedDemo />
            </div>
          </motion.div>
        </motion.section>

        {/* ════════ STATS BAR ════════ */}
        <motion.section
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          className="landing-stats-bar"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={itemVariants} className="landing-stat-item">
              <span className="landing-stat-value"><AnimatedCounter target={s.value} suffix={s.suffix} /></span>
              <span className="landing-stat-label">{s.label}</span>
            </motion.div>
          ))}
        </motion.section>

        {/* ════════ HOW IT WORKS ════════ */}
        <motion.section
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          style={{ maxWidth: '1200px', width: '100%', padding: 'var(--space-8) var(--space-4)' }}
        >
          <motion.h2 variants={itemVariants} className="landing-section-title">How It Works</motion.h2>
          <div className="landing-steps-grid">
            {howItWorks.map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="landing-step-card">
                <div className="landing-step-number">{item.step}</div>
                <div className="landing-step-icon">{item.icon}</div>
                <h3 className="landing-step-title">{item.title}</h3>
                <p className="landing-step-desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ════════ FEATURES GRID ════════ */}
        <motion.section
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          style={{ maxWidth: '1200px', width: '100%', padding: 'var(--space-8) var(--space-4)' }}
        >
          <motion.h2 variants={itemVariants} className="landing-section-title">Packed with Features</motion.h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)', width: '100%',
          }}>
            {features.map((f, i) => (
              <motion.div key={i} variants={itemVariants} className="landing-feature-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = f.color;
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 16px 40px -12px ${f.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle at top right, ${f.color}20, transparent 70%)`, pointerEvents: 'none' }} />
                <div className="landing-feature-icon">{f.icon}</div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ════════ TECH STACK ════════ */}
        <motion.section
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          style={{ maxWidth: '1200px', width: '100%', padding: 'var(--space-8) var(--space-4)' }}
        >
          <motion.h2 variants={itemVariants} className="landing-section-title">Built With Modern Tech</motion.h2>
          <div className="landing-tech-grid">
            {['React', 'TypeScript', 'Node.js', 'MongoDB', 'Framer Motion', 'Express'].map((tech, i) => (
              <motion.div key={i} variants={itemVariants} className="landing-tech-chip">{tech}</motion.div>
            ))}
          </div>
        </motion.section>

        {/* ════════ CTA FOOTER ════════ */}
        <motion.section
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          className="landing-cta-section"
        >
          <motion.h2 variants={itemVariants} style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 var(--space-4)',
            background: 'linear-gradient(135deg, var(--on-surface), var(--primary))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Ready to Visualize?
          </motion.h2>
          <motion.p variants={itemVariants} style={{ color: 'var(--on-surface-variant)', fontSize: '1.15rem', margin: '0 0 var(--space-6)', maxWidth: '500px' }}>
            Start exploring algorithms today. It's free, open-source, and beautifully designed.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link to="/visualizer" style={{ textDecoration: 'none' }}>
              <button className="btn-gradient" style={{
                padding: '1rem 3rem', fontSize: '1.15rem', fontWeight: 700, color: '#fff',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                border: 'none', boxShadow: '0 8px 32px rgba(96,165,250,0.4)',
              }}>
                Get Started — It's Free →
              </button>
            </Link>
          </motion.div>
        </motion.section>

      </main>
    </div>
  );
}
