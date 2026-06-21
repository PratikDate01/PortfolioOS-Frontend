import React from 'react';
import { Github, Linkedin, Twitter, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-500 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        
        {/* Branding & Logo */}
        <div className="flex items-center space-x-2 font-mono text-sm">
          <Terminal className="h-4 w-4 text-teal-500" />
          <span>© {new Date().getFullYear()} Portfolio_OS. All rights reserved.</span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-100 transition-colors"
          >
            <Github className="h-4.5 w-4.5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-100 transition-colors"
          >
            <Linkedin className="h-4.5 w-4.5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-100 transition-colors"
          >
            <Twitter className="h-4.5 w-4.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
