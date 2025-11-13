import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      await login(form);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to login';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your tickets.</p>

        {error && <div className="form-error">{error}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="muted">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

