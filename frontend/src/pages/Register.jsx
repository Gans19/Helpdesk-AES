import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await register(form);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to register';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="muted">Register for HelpDesk Lite.</p>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <label htmlFor="name">Full name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={handleChange}>
          <option value="user">User (default)</option>
          <option value="support">Support</option>
        </select>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <p className="muted">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;

