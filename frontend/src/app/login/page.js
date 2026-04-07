'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login(email, password);
      login(response.data, response.data.token);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Hero Blob */}
      <div className="hero-gradient top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 bg-primary"></div>
      <div className="hero-gradient bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 bg-accent"></div>

      <div className="w-full max-w-md p-8 glass-card z-10 mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome Back to <span className="gradient-text">FinTrack AI</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Log in to continue organizing your finances.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-sm text-[var(--color-primary)] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="w-full gradient-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-[var(--color-primary)] hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
