'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  FolderKanban,
  BookOpen,
  Award,
  MessageSquare,
  FileText,
  Shield,
  ArrowRight,
  Command,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    {
      id: 'home',
      label: 'Home',
      description: 'Go to the homepage',
      icon: <Home className="h-4 w-4" />,
      action: () => router.push('/'),
      keywords: ['home', 'main', 'landing', 'start'],
    },
    {
      id: 'projects',
      label: 'Projects',
      description: 'Browse all projects',
      icon: <FolderKanban className="h-4 w-4" />,
      action: () => router.push('/projects'),
      keywords: ['projects', 'work', 'portfolio', 'showcase'],
    },
    {
      id: 'blog',
      label: 'Blog',
      description: 'Read blog articles',
      icon: <BookOpen className="h-4 w-4" />,
      action: () => router.push('/blog'),
      keywords: ['blog', 'articles', 'posts', 'writing'],
    },
    {
      id: 'certifications',
      label: 'Certifications',
      description: 'View certifications and credentials',
      icon: <Award className="h-4 w-4" />,
      action: () => router.push('/certifications'),
      keywords: ['certifications', 'certificates', 'credentials', 'badges'],
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      description: 'Read testimonials and reviews',
      icon: <MessageSquare className="h-4 w-4" />,
      action: () => router.push('/testimonials'),
      keywords: ['testimonials', 'reviews', 'feedback'],
    },
    {
      id: 'resume',
      label: 'Resume',
      description: 'View and download resume',
      icon: <FileText className="h-4 w-4" />,
      action: () => router.push('/resume'),
      keywords: ['resume', 'cv', 'download', 'experience'],
    },
    {
      id: 'login',
      label: 'Sign In',
      description: 'Login to your account',
      icon: <Shield className="h-4 w-4" />,
      action: () => router.push('/login'),
      keywords: ['login', 'signin', 'sign in', 'account'],
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      description: 'Open the admin dashboard',
      icon: <Shield className="h-4 w-4" />,
      action: () => router.push('/admin'),
      keywords: ['admin', 'dashboard', 'manage', 'panel'],
    },
  ];

  const filteredCommands = query.trim()
    ? commands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description.toLowerCase().includes(q) ||
          cmd.keywords.some((kw) => kw.includes(q))
        );
      })
    : commands;

  const handleSelect = useCallback(
    (index: number) => {
      const cmd = filteredCommands[index];
      if (cmd) {
        cmd.action();
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    },
    [filteredCommands]
  );

  // Keyboard shortcut to open/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery('');
        setSelectedIndex(0);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Arrow key navigation
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed left-1/2 top-[20%] z-[101] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900/95 shadow-2xl shadow-black/50"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
              <Search className="h-5 w-5 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-zinc-500">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-teal-500/10 text-teal-400'
                        : 'text-zinc-300 hover:bg-zinc-800/50'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        index === selectedIndex ? 'text-teal-400' : 'text-zinc-500'
                      }`}
                    >
                      {cmd.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cmd.label}</p>
                      <p className="text-xs text-zinc-500 truncate">{cmd.description}</p>
                    </div>
                    {index === selectedIndex && (
                      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-teal-400" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2 text-[10px] text-zinc-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5">Esc</kbd>
                  Close
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="h-3 w-3" />
                <span>Command Palette</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
