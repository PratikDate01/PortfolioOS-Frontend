'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { Project } from '@/types';
import { ArrowLeft, Github, Globe, Eye, Server, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CaseStudyView({ params, username }: { params: { slug: string }; username?: string }) {
  const { slug } = params;

  // Query project from API
  const { data: serverProject } = useQuery({
    queryKey: ['project', slug, username],
    queryFn: async () => {
      const url = username ? `/projects/${slug}?username=${encodeURIComponent(username)}` : `/projects/${slug}`;
      const res = await apiFetch<Project>(url);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    retry: false
  });

  const project = serverProject;

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <Server className="h-12 w-12 text-zinc-700 mb-4 animate-pulse" />
          <h1 className="text-xl font-bold text-zinc-400 font-sans">Case Study Not Found</h1>
          <Link href={username ? `/p/${username}/projects` : "/projects"} className="text-teal-400 mt-4 hover:underline text-sm font-sans flex items-center space-x-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Showcase</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const study = project.caseStudy || {
    problem: 'Detailed case study data is currently compiling or not provided.',
    research: 'N/A',
    architecture: 'N/A',
    challenges: 'N/A',
    solutions: 'N/A',
    results: 'N/A',
    metrics: [],
    lessonsLearned: 'N/A'
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link
            href={username ? `/p/${username}/projects` : "/projects"}
            className="inline-flex items-center space-x-2 text-xs font-sans text-zinc-550 hover:text-teal-400 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Showcase</span>
          </Link>

          {/* Banner */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 relative mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 text-xs font-mono">
                {project.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-4">{project.title}</h1>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xs font-sans text-zinc-400 mb-2 font-semibold">System Summary</h2>
                <p className="text-zinc-300 leading-relaxed">{project.description}</p>
              </div>

              <div>
                <h2 className="text-xs font-sans text-zinc-400 mb-3 font-semibold">Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-200 border border-zinc-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 font-semibold">
                <span className="flex items-center space-x-1.5">
                  <Eye className="h-4 w-4 text-teal-500" />
                  <span>Page Views</span>
                </span>
                <span className="text-zinc-300 font-bold">{project.viewCount}</span>
              </div>

              {(project.links?.github || project.links?.liveDemo) && (
                <div className="space-y-3 pt-4 border-t border-zinc-900">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 rounded-lg border border-zinc-800 py-2.5 text-sm font-sans text-zinc-300 hover:bg-zinc-900 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>View Repository</span>
                    </a>
                  )}
                  {project.links.liveDemo && (
                    <a
                      href={project.links.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 py-2.5 text-sm font-sans font-bold transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Architectural Metrics */}
          {study.metrics && study.metrics.length > 0 && (
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 mb-12">
              <h2 className="text-xs font-mono text-zinc-500 mb-4 flex items-center space-x-1.5 font-semibold">
                <Sparkles className="h-4 w-4 text-teal-400" />
                <span>Architectural Metrics</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {study.metrics.map((metric, idx) => (
                  <div key={idx} className="rounded-lg bg-zinc-900/40 border border-zinc-850 p-4 text-center">
                    <div className="text-[10px] font-sans text-zinc-450 uppercase tracking-wider font-semibold">{metric.label.replace(/_/g, ' ')}</div>
                    <div className="text-lg font-mono font-bold text-teal-400 mt-1.5">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case Study Details */}
          <div className="border-t border-zinc-900 pt-10 space-y-10">
            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">1. The Problem Space</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{study.problem}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">2. Applied Research & Prototypes</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{study.research}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">3. System Architecture Design</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{study.architecture}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">4. Key Challenges & Core Solutions</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-lg bg-zinc-950 border border-red-500/10 p-5">
                  <div className="text-xs font-sans text-red-400 font-bold mb-2">Challenge:</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{study.challenges}</p>
                </div>
                <div className="rounded-lg bg-zinc-950 border border-teal-500/10 p-5">
                  <div className="text-xs font-sans text-teal-400 font-bold mb-2">Solution:</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{study.solutions}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">5. Deployment Outcomes & Results</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{study.results}</p>
            </div>

            <div className="rounded-lg border border-zinc-900 bg-zinc-950/40 p-6">
              <h3 className="text-xs font-sans text-zinc-300 mb-2.5 font-semibold">Lessons Learned</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{study.lessonsLearned}</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
