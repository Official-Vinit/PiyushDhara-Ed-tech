// admin-client/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API_URL}/api/login`, { username, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Invalid username or password');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="admin-card w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <h1 className="text-2xl font-extrabold">Admin Login</h1>
          <p className="mt-1 text-sm text-blue-100">Access course, subject, and unit management.</p>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="admin-btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;