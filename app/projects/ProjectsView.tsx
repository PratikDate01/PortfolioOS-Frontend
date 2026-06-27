'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { Project } from '@/types';
import { ExternalLink, Search, Terminal, Filter } from 'lucide-react';
import Link from 'next/link';


export default function ProjectsView({ username }: { username?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Query projects
  const { data: serverProjects } = useQuery({
    queryKey: ['projects', username],
    queryFn: async () => {
      const url = username ? `/projects?username=${encodeURIComponent(username)}` : '/projects';
      const res = await apiFetch<Project[]>(url);
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    retry: false
  });

  const projects = serverProjects || [];

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];

  // Filter projects based on query and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="border-b border-zinc-900 pb-8 mb-12">
            <h1 className="text-3xl font-bold text-white font-sans sm:text-4xl">Project Showcase</h1>
            <p className="mt-3 text-zinc-400">Explore my portfolio of software projects, applications, and tools.</p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-10">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-550">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title or technology..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Category Pill Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-sans text-zinc-500 flex items-center gap-1.5 mr-1 font-semibold">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter by:</span>
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

          {/* Grid Layout */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl">
              <Terminal className="h-8 w-8 text-zinc-650 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-zinc-400 font-sans">No projects found</h3>
              <p className="text-xs text-zinc-650 mt-1">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, idx) => (
                <article
                  key={project.slug || idx}
                  className="flex flex-col overflow-hidden rounded-xl border border-zinc-855 bg-zinc-950/20 hover:border-zinc-755 transition-all duration-300 group"
                >
                  <div className="aspect-video w-full overflow-hidden bg-zinc-900 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 rounded-md bg-zinc-950/80 px-2.5 py-1 text-xs font-mono text-teal-400 border border-teal-500/20">
                      {project.category}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2.5 text-xs text-zinc-400 line-clamp-3 leading-relaxed flex-grow">
                      {project.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.slug && (
                      <div className="mt-5 pt-4 border-t border-zinc-900 flex justify-end">
                        <Link
                          href={username ? `/p/${username}/projects/${project.slug}` : `/projects/${project.slug}`}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-400 hover:text-teal-300 font-sans"
                        >
                          <span>Read Case Study</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
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
