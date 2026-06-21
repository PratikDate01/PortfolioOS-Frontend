'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Terminal, Key, Mail, User as UserIcon, ArrowRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RegisterView() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await register({ name, email, password });
      router.push('/');
    } catch (err) {
      setErrorMsg((err as Error).message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-zinc-950 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-850 rounded-xl p-8 shadow-2xl relative">
          
          {/* Top header decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-teal-950/30 border border-teal-500/20 text-teal-400 mb-4">
              <Terminal className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-sans">Create an Account</h1>
            <p className="text-sm text-zinc-400 mt-2">Create an account to track your progress, earn XP, and add recommendations.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-950/15 p-4 text-sm text-red-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-sans text-zinc-400 mb-1.5 font-semibold">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                  placeholder="e.g. Linus Torvalds"
                />
              </div>
            </div>

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
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                  placeholder="linus@linuxfoundation.org"
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
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-10 py-2.5 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                  placeholder="Choose a password..."
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
              disabled={isRegistering}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold py-3 text-sm font-sans transition-all disabled:opacity-50"
            >
              <span>{isRegistering ? 'Registering...' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center pt-6 mt-4 border-t border-zinc-900">
            <span className="text-xs text-zinc-500 font-sans">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-400 hover:underline">
                Sign In
              </Link>
            </span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
