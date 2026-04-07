'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // We log them in automatically after signup

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.register(name, email, password);
      login(response.data, response.data.token);
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Hero Blob */}
      <div className="hero-gradient top-0 right-1/4 translate-x-1/2 -translate-y-1/2 bg-accent"></div>
      <div className="hero-gradient bottom-0 left-1/4 -translate-x-1/2 translate-y-1/2 bg-primary"></div>

      <div className="w-full max-w-md p-8 glass-card z-10 mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Join <span className="gradient-text">FinTrack AI</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Create an account to track your finances effortlessly.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          {error && <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create a strong password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="w-full gradient-btn" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
