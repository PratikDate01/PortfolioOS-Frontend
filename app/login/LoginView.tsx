'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Terminal, Key, Mail, Sparkles, ArrowRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import { setAuthToken } from '@/lib/api-client';
import { API_BASE_URL } from '@/lib/config';

export default function LoginView() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const error = params.get('error');
      
      if (token) {
        setAuthToken(token);
        window.location.href = '/';
      } else if (error) {
        setErrorMsg('Social login failed. Please try again.');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      setErrorMsg((err as Error).message || 'Invalid credentials');
    }
  };

  const handleGuestLogin = async () => {
    setErrorMsg('');
    try {
      await login({ email: '', isGuest: true });
      router.push('/');
    } catch {
      setErrorMsg('Guest login failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-zinc-950 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-850 rounded-xl p-8 shadow-2xl relative">
          
          {/* Top header decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-teal-950/30 border border-teal-500/20 text-teal-400 mb-4">
              <Terminal className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-sans">Sign In to Portfolio OS</h1>
            <p className="text-sm text-zinc-400 mt-2">Sign in to manage your portfolio, post comments, and track your progress.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-950/15 p-4 text-sm text-red-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-sans text-zinc-400 mb-1.5 font-semibold">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2.5 text-sm text-zinc-205 outline-none focus:border-teal-500 transition-colors"
                  placeholder="admin@portfolio-os.local"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans text-zinc-400 mb-1.5 font-semibold">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Key className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-10 py-2.5 text-sm text-zinc-205 outline-none focus:border-teal-500 transition-colors"
                  placeholder="Enter your password..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold py-3 text-sm font-sans transition-all disabled:opacity-50"
            >
              <span>{isLoggingIn ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-zinc-900" />
            <span className="flex-shrink mx-4 text-xs font-mono text-zinc-650">OR</span>
            <div className="flex-grow border-t border-zinc-900" />
          </div>

          <div className="space-y-3">
            <a
              href={`${API_BASE_URL}/auth/google`}
              className="w-full flex items-center justify-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 py-3 text-sm font-sans text-zinc-300 transition-all"
            >
              <svg className="h-4 w-4 fill-current text-teal-400" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.357-2.829-6.357-6.315s2.847-6.315 6.357-6.315c1.6 0 3.06.593 4.19 1.568l3.1-3.1C19.129 2.05 15.938 1 12.24 1 5.866 1 .6 6.136.6 12.5S5.866 24 12.24 24c6.3 0 11.29-4.47 11.29-11.272 0-.6-.05-1.19-.15-1.743H12.24z"/>
              </svg>
              <span>Sign In with Google</span>
            </a>

            <a
              href={`${API_BASE_URL}/auth/github`}
              className="w-full flex items-center justify-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 py-3 text-sm font-sans text-zinc-300 transition-all"
            >
              <svg className="h-4 w-4 fill-current text-indigo-400" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Sign In with GitHub</span>
            </a>

            <button
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center space-x-2 rounded-lg border border-teal-500/20 bg-teal-950/15 py-3 text-sm font-sans text-teal-400 hover:bg-teal-950/35 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Enter Guest Mode</span>
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-zinc-500 font-sans">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-teal-400 hover:underline">
                  Create an Account
                </Link>
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
