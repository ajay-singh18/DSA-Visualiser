import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import type { AssessmentQuestion } from '@dsa-visualizer/shared';

const CodeSnippet = ({ code }: { code: string; language?: string }) => (
  <div style={{ background: '#0d1117', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto', marginBottom: '1.5rem' }}>
    <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#c9d1d9', lineHeight: 1.5 }}>
      <code>{code}</code>
    </pre>
  </div>
);

const DIFFICULTY_LABEL: Record<string, { bg: string; color: string }> = {
  easy:   { bg: 'rgba(52,211,153,0.1)',  color: '#34d399' },
  medium: { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24' },
  hard:   { bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
};

/** Badge showing the per-question suggested time (informational only — no sub-timer). */
const TimeBadge = ({ seconds }: { seconds?: number }) => {
  if (!seconds) return null;
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem',
      background: 'rgba(96,165,250,0.1)', color: '#60a5fa',
      border: '1px solid rgba(96,165,250,0.25)', fontFamily: 'var(--font-mono)',
    }}>
      ⏱ {seconds}s
    </span>
  );
};

export default function AssessmentQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    sessionId: string;
    questions: AssessmentQuestion[];
    timeLimitMinutes: number;
    startedAt: string;
  } | undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!state) {
      navigate('/assessment');
      return;
    }

    const endTime = new Date(state.startedAt).getTime() + (state.timeLimitMinutes * 60 * 1000);

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((endTime - new Date().getTime()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleSubmit(true);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!state || isSubmitting) return;
    if (!isAutoSubmit) {
      const isConfirmed = window.confirm('Are you sure you want to submit your assessment?');
      if (!isConfirmed) return;
    }

    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      const res = await apiClient.post('/assessments/submit', {
        sessionId: state.sessionId,
        answers: formattedAnswers,
      });
      navigate(`/assessment/results/${state.sessionId}`, { state: { result: res.data } });
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!state) return null;

  const question = state.questions[currentIndex];
  const isLastQuestion = currentIndex === state.questions.length - 1;
  const isTimeCritical = timeLeft < 60;
  const diffStyle = DIFFICULTY_LABEL[question.difficulty] ?? DIFFICULTY_LABEL.medium;

  /** Radio option list — shared by MCQ, find-bug, and logic question types */
  const RadioOptions = ({ options }: { options: string[] }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {options.map((opt, i) => {
        const isSelected = answers[question.id] === opt;
        return (
          <label
            key={i}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '1rem',
              padding: '1rem 1.5rem',
              background: isSelected ? 'rgba(96,165,250,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isSelected ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={opt}
              checked={isSelected}
              onChange={e => handleAnswerChange(question.id, e.target.value)}
              style={{ accentColor: '#60a5fa', width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}
            />
            <span style={{ fontSize: '1.0625rem', lineHeight: 1.5 }}>{opt}</span>
          </label>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-default)' }}>
      {/* Quiz Header */}
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, color: 'var(--on-surface-variant)' }}>
          DSA Assessment • {state.questions.length} Questions
        </div>

        <div style={{
          padding: '0.5rem 1rem', borderRadius: '8px',
          fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1.25rem',
          color: isTimeCritical ? '#f87171' : '#34d399',
          background: isTimeCritical ? 'rgba(248, 113, 113, 0.1)' : 'rgba(52, 211, 153, 0.1)',
          border: `1px solid ${isTimeCritical ? 'rgba(248, 113, 113, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
          animation: isTimeCritical ? 'pulse 1s infinite' : 'none',
        }}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Progress Bar */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
            {state.questions.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                title={`Q${idx + 1}: ${q.title}`}
                style={{
                  flex: 1, height: '6px', borderRadius: '3px', cursor: 'pointer',
                  background: idx === currentIndex ? '#60a5fa' : answers[q.id] ? 'rgba(96, 165, 250, 0.4)' : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>

          {/* Question Card */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Question {currentIndex + 1} of {state.questions.length}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {/* Question type badge */}
                  <span style={{
                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem',
                    background: 'rgba(255,255,255,0.06)', color: 'var(--on-surface-variant)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    {question.type === 'logic' ? '💡 Logic' : question.type === 'find-bug' ? '🐛 Find Bug' : question.type === 'predict-state' ? '🔮 Predict' : '❓ MCQ'}
                  </span>

                  {/* Difficulty badge */}
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', background: diffStyle.bg, color: diffStyle.color }}>
                    {question.difficulty}
                  </span>

                  {/* Per-question suggested time — auto-derived from difficulty, not user configurable */}
                  <TimeBadge seconds={(question as any).timeLimitSeconds} />
                </div>
              </div>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{question.title}</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem', lineHeight: 1.6 }}>{question.description}</p>
            </div>

            <div style={{ padding: '2rem', flex: 1, background: 'rgba(0,0,0,0.2)' }}>

              {question.codeSnippet && (
                <CodeSnippet code={question.codeSnippet} language={question.codeLanguage} />
              )}

              {/* MCQ — radio options, no code */}
              {question.type === 'mcq' && question.options && (
                <RadioOptions options={question.options} />
              )}

              {/* Find Bug — radio options (with code already shown above) */}
              {question.type === 'find-bug' && question.options && (
                <RadioOptions options={question.options} />
              )}

              {/* Logic — code snippet shown above + output prediction via MCQ */}
              {question.type === 'logic' && question.options && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '1rem', fontStyle: 'italic' }}>
                    Select the correct output of the code above:
                  </p>
                  <RadioOptions options={question.options} />
                </div>
              )}

              {/* Predict State — free-text input */}
              {question.type === 'predict-state' && (
                <div>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 1, 3, 5, 8"
                    value={answers[question.id] || ''}
                    onChange={e => handleAnswerChange(question.id, e.target.value)}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', fontFamily: 'var(--font-mono)' }}
                  />
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                    Type your prediction precisely as requested (e.g. comma-separated values).
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Footer Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button
              className="btn"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            {isLastQuestion ? (
              <button
                className="btn-gradient"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Grading...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                className="btn"
                onClick={() => setCurrentIndex(prev => Math.min(state.questions.length - 1, prev + 1))}
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
              >
                Next →
              </button>
            )}
          </div>

        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
