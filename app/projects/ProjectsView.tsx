'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { Project } from '@/types';
import { ExternalLink, Search, Terminal, Filter } from 'lucide-react';
import Link from 'next/link';

// Static fallback data
const fallbackProjects: Project[] = [
  {
    ownerId: 'fallback',
    title: 'SpeakWrite',
    slug: 'speakwrite',
    summary: 'A full-stack web application designed for text-to-speech conversion with custom options.',
    description: 'SpeakWrite is a clean, simple utility to convert text into speech. Built with modern web technologies, it features an interactive interface with options to customize speed, pitch, and voice, making digital content more accessible.',
    coverImageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80',
    techStack: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    category: 'Frontend Web',
    tags: ['Accessibility', 'Web Speech API', 'Audio'],
    links: { github: 'https://github.com/PratikDate01/SpeakWrite', liveDemo: 'https://speakwrite.netlify.app/' },
    gallery: [],
    status: 'published',
    featured: true,
    viewCount: 154,
    order: 1
  },
  {
    ownerId: 'fallback',
    title: 'Mind Map Generator',
    slug: 'mind-map-generator',
    summary: 'An interactive visual tool that allows users to dynamically generate, edit, and visualize mind maps.',
    description: 'Mind Map Generator provides a visual canvas for mapping out thoughts, brainstorming ideas, and structuring information. Users can create nodes, establish relationships, and design interactive diagrams dynamically.',
    coverImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    techStack: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    category: 'Frontend Web',
    tags: ['Visualization', 'SVG', 'Interactive Canvas'],
    links: { github: 'https://github.com/PratikDate01/Mind-Map-Generator', liveDemo: 'https://pratikdate.netlify.app/' },
    gallery: [],
    status: 'published',
    featured: true,
    viewCount: 210,
    order: 2
  },
  {
    ownerId: 'fallback',
    title: 'AI Code Reviewer System',
    slug: 'ai-code-reviewer',
    summary: 'An AI-powered system designed to analyze and review code quality with intelligent suggestions.',
    description: 'AI Code Reviewer automates pull request code diagnostics. By analyzing syntax structures, it detects performance regressions, typical bugs, and security weaknesses, suggesting exact code corrections for developers.',
    coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    techStack: ['Node.js', 'Express.js', 'React.js', 'Gemini API'],
    category: 'Artificial Intelligence',
    tags: ['LLM', 'Static Analysis', 'GitHub Integration'],
    links: { github: 'https://github.com/PratikDate01/ai-code-reviewer' },
    gallery: [],
    status: 'published',
    featured: true,
    viewCount: 310,
    order: 3
  },
  {
    ownerId: 'fallback',
    title: 'Online Freelance Marketplace Platform',
    slug: 'freelance-marketplace',
    summary: 'A full-stack web platform connecting freelancers and clients with secure authentication.',
    description: 'A marketplace that enables freelancers to list their services and clients to hire them. Features user profiles, search filters, secure authentication sessions, and real-time database transactions.',
    coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    category: 'Full Stack Web',
    tags: ['E-Commerce', 'User Profiles', 'JWT'],
    links: { github: 'https://github.com/PratikDate01/freelancermarketplace' },
    gallery: [],
    status: 'published',
    featured: false,
    viewCount: 128,
    order: 4
  },
  {
    ownerId: 'fallback',
    title: 'Drive Clone System',
    slug: 'drive-clone',
    summary: 'A cloud-based file storage system with secure authentication and file management.',
    description: 'Drive Clone provides users with a private cloud environment to upload, organize, and download files. It features secure credential storage, upload progress bars, and nested folders.',
    coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloud Storage'],
    category: 'Cloud Storage',
    tags: ['Cloud', 'Multer', 'File Uploads'],
    links: { github: 'https://github.com/PratikDate01/cloud-drive' },
    gallery: [],
    status: 'published',
    featured: false,
    viewCount: 165,
    order: 5
  },
  {
    ownerId: 'fallback',
    title: 'Lost and Found Portal',
    slug: 'lost-found-portal',
    summary: 'A community bulletin board portal to report lost and found items with location tags.',
    description: 'Lost & Found Portal helps communities recover lost items by letting users publish reports with images, categories, and locations. Other users can view reports and securely contact owners.',
    coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    category: 'Full Stack Web',
    tags: ['Community', 'Location Services', 'Geospatial Query'],
    links: { github: 'https://github.com/PratikDate01/lost-found-portal' },
    gallery: [],
    status: 'published',
    featured: false,
    viewCount: 92,
    order: 6
  }
];

export default function ProjectsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Query projects
  const { data: serverProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiFetch<Project[]>('/projects');
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    retry: false
  });

  const projects = serverProjects && serverProjects.length > 0 ? serverProjects : fallbackProjects;

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
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
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
              <Terminal className="h-8 w-8 text-zinc-600 mx-auto mb-4" />
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
                          href={`/projects/${project.slug}`}
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
