'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Terminal, Menu, X, LogOut, Trophy, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, login } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Showcase', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: 'Certifications', path: '/certifications' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Resume', path: '/resume' },
  ];

  const handleGuestLogin = async () => {
    try {
      await login({ email: '', isGuest: true });
    } catch (err) {
      console.error('Guest login failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 font-mono text-sm tracking-tight text-teal-400 hover:text-teal-300 transition-colors">
          <Terminal className="h-5 w-5 stroke-[2]" />
          <span className="font-bold text-zinc-100 font-sans text-base">Portfolio_OS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-teal-400 ${
                  isActive ? 'text-teal-400 font-semibold' : 'text-zinc-400'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {user && (user.role === 'superadmin' || user.role === 'admin') && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-teal-400 ${
                pathname === '/admin' ? 'text-teal-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* User Stats / Login Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 rounded-full border border-teal-500/30 bg-teal-950/20 px-3 py-1 text-xs text-teal-400">
                <Trophy className="h-3.5 w-3.5 fill-teal-500/10" />
                <span>Level {user.level}</span>
                <span className="text-zinc-600">|</span>
                <span>{user.xp} XP</span>
              </div>
              <Link href="/dashboard" className="text-sm text-zinc-300 font-mono hover:text-teal-400 transition-colors">
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-all"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGuestLogin}
                className="flex items-center space-x-1 rounded-lg border border-teal-500/20 bg-teal-950/10 px-3 py-1.5 text-xs font-semibold text-teal-400 hover:bg-teal-950/30 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Enter Guest Mode</span>
              </button>
              <Link
                href="/login"
                className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          {user && (
            <div className="flex items-center space-x-1 rounded-full border border-teal-500/30 bg-teal-950/20 px-2 py-0.5 text-[10px] text-teal-400">
              <span>Lvl {user.level}</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm ${pathname === link.path ? 'text-teal-400 font-semibold' : 'text-zinc-400'}`}
              >
                {link.label}
              </Link>
            ))}
            {user && (user.role === 'superadmin' || user.role === 'admin') && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm ${pathname === '/admin' ? 'text-teal-400 font-semibold' : 'text-zinc-400'}`}
              >
                Admin
              </Link>
            )}
          </nav>
          <hr className="border-zinc-800" />
          <div>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-teal-400 font-medium">
                    {user.name} (Dashboard)
                  </Link>
                  <span className="text-teal-400 font-mono">Lvl {user.level} ({user.xp} XP)</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 rounded-lg border border-zinc-800 py-2 text-sm text-zinc-400 hover:bg-zinc-900"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    handleGuestLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 rounded-lg border border-teal-500/20 bg-teal-950/20 py-2 text-sm text-teal-400"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Enter Guest Mode</span>
                </button>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center rounded-lg bg-zinc-100 py-2 text-sm font-semibold text-zinc-950"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
