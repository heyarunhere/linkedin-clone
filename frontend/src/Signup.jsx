import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

export default function Signup({ onLogin }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password, confirm = form.confirm;

    if (!name) return setError('Please enter your name');
    if (!email) return setError('Please enter your email');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');

    try {
      setLoading(true);
      await api.post('/auth/signup', { name, email, password });
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      onLogin?.();
      nav('/');
    } catch (err) {
      const msg = err?.response?.data?.error ||
                  err?.response?.data?.message ||
                  (err.message?.includes('Network') ? 'Cannot reach server. Is backend running?' : 'Signup failed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">Create Account</div>
        <div className="auth-sub">Join our social network</div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Full Name</label>
            <input className="input" name="name" placeholder="Your name" onChange={onChange} required />
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" name="email" type="email" placeholder="you@example.com" onChange={onChange} required />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" name="password" type="password" placeholder="Create a password" onChange={onChange} required />
          </div>
          <div className="field">
            <label className="label">Confirm Password</label>
            <input className="input" name="confirm" type="password" placeholder="Re-enter password" onChange={onChange} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
        </form>
        <div className="linkline">Already have an account? <Link to="/login">Login here</Link></div>
      </div>
    </div>
  );
}
