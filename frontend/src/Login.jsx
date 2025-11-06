import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

export default function Login({ onLogin }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      onLogin?.();
      nav('/');
    } catch (err) {
      const msg = err?.response?.data?.error ||
                  err?.response?.data?.message ||
                  (err.message?.includes('Network') ? 'Cannot reach server. Is backend running?' : 'Invalid email or password');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">Welcome Back</div>
        <div className="auth-sub">Sign in to continue to LinkedIn Clone</div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Email Address</label>
            <input className="input" name="email" type="email" placeholder="Enter your email" onChange={onChange} required />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" name="password" type="password" placeholder="Enter your password" onChange={onChange} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="linkline">Don't have an account? <Link to="/signup">Sign up</Link></div>
      </div>
    </div>
  );
}
