'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Terminal, Menu, X, LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Portfolio', path: `/p/${user.username}` },
        { label: 'Projects', path: '/dashboard?tab=projects' },
        { label: 'Resume', path: '/dashboard?tab=resumes' },
        { label: 'Analytics', path: '/dashboard?tab=analytics' },
        { label: 'Settings', path: '/dashboard?tab=settings' },
      ]
    : [
        { label: 'Explore', path: '/projects' },
      ];

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
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-400 hover:text-teal-400 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 px-3.5 py-1.5 text-xs font-semibold shadow-md shadow-teal-500/10 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
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
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center rounded-lg border border-zinc-800 py-2 text-sm text-zinc-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center rounded-lg bg-teal-500 py-2 text-sm font-semibold text-zinc-950"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
