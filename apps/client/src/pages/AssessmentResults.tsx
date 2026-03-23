import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { AssessmentResult, AssessmentResultItem } from '@dsa-visualizer/shared';

const CodeSnippet = ({ code, language }: { code: string, language?: string }) => (
  <div style={{ background: '#0d1117', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto', marginTop: '1rem' }}>
    <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#c9d1d9', lineHeight: 1.5 }}>
      <code>{code}</code>
    </pre>
  </div>
);

const ResultCard = ({ item, index }: { item: AssessmentResultItem; index: number }) => {
  const isCorrect = item.isCorrect;
  
  return (
    <div style={{ 
      background: 'var(--surface)', 
      borderRadius: 'var(--radius-xl)', 
      border: \`1px solid \${isCorrect ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)'}\`,
      overflow: 'hidden',
      marginBottom: '1.5rem'
    }}>
      <div style={{ 
        padding: '1rem 1.5rem', 
        background: isCorrect ? 'rgba(52, 211, 153, 0.05)' : 'rgba(248, 113, 113, 0.05)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontWeight: 600, color: isCorrect ? '#34d399' : '#f87171' }}>
          {isCorrect ? '✅ Correct' : '❌ Incorrect'} • Question {index + 1}
        </span>
        <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', textTransform: 'capitalize' }}>
          {item.question.category} / {item.question.difficulty}
        </span>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.question.title}</h3>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>{item.question.description}</p>
        
        {item.question.codeSnippet && (
          <CodeSnippet code={item.question.codeSnippet} language={item.question.codeLanguage} />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ 
            padding: '1rem', borderRadius: '8px', 
            background: isCorrect ? 'rgba(52, 211, 153, 0.05)' : 'rgba(248, 113, 113, 0.05)',
            border: \`1px dashed \${isCorrect ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)'}\`
          }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Your Answer</div>
            <div style={{ fontWeight: 500, fontFamily: item.question.type === 'predict-state' ? 'var(--font-mono)' : 'inherit' }}>
              {item.userAnswer || <em>(Blank)</em>}
            </div>
          </div>
          
          {!isCorrect && (
            <div style={{ 
              padding: '1rem', borderRadius: '8px', 
              background: 'rgba(52, 211, 153, 0.1)',
              border: '1px dashed rgba(52, 211, 153, 0.4)'
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#34d399', marginBottom: '0.5rem' }}>Correct Answer</div>
              <div style={{ fontWeight: 500, color: '#34d399', fontFamily: item.question.type === 'predict-state' ? 'var(--font-mono)' : 'inherit' }}>
                {item.correctAnswer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: AssessmentResult } | undefined;

  if (!state || !state.result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-default)' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Results Found</h2>
            <button className="btn-gradient" onClick={() => navigate('/assessment')}>Take an Assessment</button>
          </div>
        </main>
      </div>
    );
  }

  const { result } = state;
  const isPassing = result.percentage >= 70;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-default)' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-4)', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Header Score Dashboard */}
          <div style={{ 
            background: 'var(--surface)', padding: 'var(--space-8)', 
            borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)',
            display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', alignItems: 'center', justifyContent: 'center'
          }}>
            
            {/* Circular Gauge */}
            <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="none" 
                  stroke={isPassing ? '#34d399' : '#fbbf24'} 
                  strokeWidth="12" 
                  strokeDasharray="439.8" 
                  strokeDashoffset={439.8 - (439.8 * result.percentage) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: isPassing ? '#34d399' : '#fbbf24' }}>
                  {result.percentage}%
                </div>
              </div>
            </div>

            {/* Stats list */}
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>
                {isPassing ? 'Great Job!' : 'Keep Practicing!'}
              </h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{result.score} / {result.total}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Time Taken</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Detailed Breakdown</span>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.results.map((item, idx) => (
                <ResultCard key={item.questionId} item={item} index={idx} />
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn" onClick={() => navigate('/assessment')} style={{ padding: '0.75rem 2rem' }}>
              Take Another Quiz
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
