import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/client';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleGoogleSuccess(credentialResponse: any) {
    try {
      setLoading(true);
      const { data } = await apiClient.post('/auth/google', {
        credential: credentialResponse.credential
      });
      localStorage.setItem('dsa-token', data.token);
      localStorage.setItem('dsa-user', JSON.stringify(data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const { data } = await apiClient.post('/auth/register', { username, email, password });
        localStorage.setItem('dsa-token', data.token);
        localStorage.setItem('dsa-user', JSON.stringify(data.user));
        navigate('/');
    } catch (err: any) {
        setError(err.response?.data?.error || 'Registration failed');
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="logo-text">DSA Visualizer</span>
        <h2>Create Your Account</h2>

        {error && (
          <div style={{ color: 'var(--error)', fontSize: '0.8125rem', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div className="form-group">
            <input
              className="input-field"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button className="btn-gradient" type="submit" disabled={loading} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
          <GoogleLogin
            text="signup_with"
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google initialization failed')}
            theme="filled_black"
            shape="rectangular"
          />
        </div>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
          Already have an account?{' '}
          <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
