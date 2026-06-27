'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { BlogPost } from '@/types';
import { BookOpen, Search, Calendar, Clock, ArrowRight, Terminal, Tag } from 'lucide-react';
import Link from 'next/link';


export default function BlogView({ username }: { username?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: serverPosts } = useQuery({
    queryKey: ['blog-posts', username],
    queryFn: async () => {
      const url = username ? `/blog?username=${encodeURIComponent(username)}` : '/blog';
      const res = await apiFetch<BlogPost[]>(url);
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    retry: false,
  });

  const posts = serverPosts || [];

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(posts.flatMap((p) => p.categories || [])))];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || post.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-zinc-900 pb-8 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-teal-400 font-sans text-xs mb-2">
                <Terminal className="h-4 w-4" />
                <span>Articles &amp; Insights</span>
              </div>
              <h1 className="text-3xl font-bold text-white font-sans sm:text-4xl">Engineering Journal</h1>
              <p className="mt-3 text-zinc-400">Technical insights, architectural breakdowns, and software discoveries.</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-10">
            <div className="relative flex-grow max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-550 font-sans">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, tag, content..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-sans text-zinc-500 flex items-center gap-1.5 mr-1 font-semibold">
                <Tag className="h-3.5 w-3.5" />
                <span>Categories:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono border transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                      : 'bg-zinc-950/50 text-zinc-400 border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* List Layout */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl">
              <BookOpen className="h-8 w-8 text-zinc-650 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-zinc-400 font-sans">No articles found matching your search</h3>
              <p className="text-xs text-zinc-650 mt-1">Try resetting the filters or adjusting your search query</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.slug || index}
                  className="flex flex-col md:flex-row overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 transition-all duration-300 group"
                >
                  {post.coverImageUrl && (
                    <div className="md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden bg-zinc-900 min-h-[160px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-4 text-[11px] font-mono text-zinc-550 mb-3">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Draft'}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readingTimeMinutes} min read</span>
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="mt-2.5 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="rounded bg-zinc-900 px-2 py-0.5 text-[9px] font-mono text-zinc-400 border border-zinc-800/80"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={username ? `/p/${username}/blog/${post.slug}` : `/blog/${post.slug}`}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-400 hover:text-teal-300 font-mono"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
