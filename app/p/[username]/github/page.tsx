'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GitHubStats from '@/components/sections/GitHubStats';
import { apiFetch } from '@/lib/api-client';
import { Portfolio } from '@/types';
import { Terminal, Github, Loader2 } from 'lucide-react';

export default function GitHubPage({ params }: { params: { username: string } }) {
  const { username } = params;

  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ['portfolio', username],
    queryFn: async () => {
      const res = await apiFetch<Portfolio>(`/portfolios/${username}`);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    enabled: !!username,
  });

  const githubUser = portfolio?.githubUsername || (portfolio?.ownerId as any)?.githubUsername || '';

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
              <Loader2 className="h-10 w-10 animate-spin text-teal-400 mb-4" />
              <p className="text-sm font-mono tracking-wide">Resolving GitHub integration details...</p>
            </div>
          ) : githubUser ? (
            <GitHubStats username={githubUser} />
          ) : (
            <section className="py-16 px-4">
              <div className="mx-auto max-w-6xl">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-12 backdrop-blur-md text-center max-w-lg mx-auto relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto mb-4">
                    <Github className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-200 mb-2">GitHub profile not connected.</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                    The developer profile for <span className="font-mono text-teal-400">@{username}</span> is not connected to GitHub. Live stats, activity timeline, and technical ratings are unavailable.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
