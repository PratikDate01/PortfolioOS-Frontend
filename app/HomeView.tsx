'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GitHubStats from '@/components/sections/GitHubStats';
import TechGalaxy from '@/components/sections/TechGalaxy';
import { apiFetch } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { Project, Experience, Skill } from '@/types';
import { BACKEND_URL } from '@/lib/config';
import {
  Terminal,
  Cpu,
  Database,
  Cloud,
  Brain,
  Send,
  Sparkles,
  ExternalLink,
  Calendar,
  Briefcase,
  CheckCircle2,
  Eye
} from 'lucide-react';

// Static fallbacks
// Static fallbacks
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

const fallbackExperiences: Experience[] = [
  {
    ownerId: 'fallback',
    organization: 'Labmentix',
    role: 'Web Development Intern',
    type: 'internship',
    startDate: '2025-07-01',
    endDate: '2025-10-01',
    description: 'Developed responsive web applications using React.js and Node.js backend services. Implemented REST APIs and optimized database queries, collaborating on system integrations.',
    responsibilities: [
      'Developed responsive web applications using React.js and Node.js backend services.',
      'Implemented REST APIs and optimized database queries improving performance.',
      'Collaborated on frontend-backend integration and version control using Git.'
    ],
    technologiesUsed: ['React.js', 'Node.js', 'Express.js', 'JavaScript', 'MongoDB', 'Git'],
    order: 1
  },
  {
    ownerId: 'fallback',
    organization: 'AICTE Edunet Foundation',
    role: 'AI & Machine Learning Intern',
    type: 'internship',
    startDate: '2026-01-01',
    endDate: '2026-02-01',
    description: 'Worked on machine learning models and NLP techniques on real-world datasets for predictive analysis and intelligent solution generation.',
    responsibilities: [
      'Worked on machine learning models and real-world datasets for predictive analysis.',
      'Applied NLP techniques for text processing and intelligent solutions.'
    ],
    technologiesUsed: ['Python', 'Machine Learning', 'NLP', 'Data Science'],
    order: 2
  }
];

const fallbackSkills: Skill[] = [
  { ownerId: 'fallback', name: 'Java', category: 'backend', proficiency: 85, yearsExperience: 2, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'JavaScript', category: 'frontend', proficiency: 90, yearsExperience: 3, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'Python', category: 'backend', proficiency: 80, yearsExperience: 2, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'HTML & CSS', category: 'frontend', proficiency: 95, yearsExperience: 4, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'React.js', category: 'frontend', proficiency: 88, yearsExperience: 2, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'Node.js & Express.js', category: 'backend', proficiency: 85, yearsExperience: 2, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'MySQL', category: 'database', proficiency: 85, yearsExperience: 2, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'MongoDB', category: 'database', proficiency: 80, yearsExperience: 2, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'Git & GitHub', category: 'other', proficiency: 90, yearsExperience: 3, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'AWS (Basics)', category: 'other', proficiency: 75, yearsExperience: 1, relatedProjectIds: [] },
  { ownerId: 'fallback', name: 'Postman', category: 'other', proficiency: 85, yearsExperience: 2, relatedProjectIds: [] }
];

export default function HomeView() {
  const { user } = useAuth();
  
  // Contact Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  // Record visit on mount
  useEffect(() => {
    apiFetch<{ totalVisitors: number }>('/analytics/visit', { method: 'POST' })
      .then((res) => {
        if (res.data) setVisitorCount(res.data.totalVisitors);
      })
      .catch(() => {});
  }, []);

  // Check backend server connection
  const { isError: serverOffline } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/health`);
      if (!res.ok) throw new Error();
      return res.json();
    },
    retry: false,
    refetchInterval: 30000 // poll every 30 seconds
  });

  // Fetch projects from server
  const { data: serverProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiFetch<Project[]>('/projects');
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    enabled: !serverOffline
  });

  // Fetch experiences from server
  const { data: serverExperiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await apiFetch<Experience[]>('/experience');
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    enabled: !serverOffline
  });

  // Fetch skills from server
  const { data: serverSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await apiFetch<Skill[]>('/skills');
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    enabled: !serverOffline
  });

  // Contact Form Submission Mutation
  const contactMutation = useMutation({
    mutationFn: async (messageData: { name: string; email: string; subject: string; body: string }) => {
      const res = await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          ...messageData,
          source: 'contact_form'
        })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      setFormSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setBody('');
      
      // Award visual XP for contact submission if user is guest/member
      if (user) {
        setXpEarned(true);
      }
      setTimeout(() => {
        setFormSuccess(false);
        setXpEarned(false);
      }, 6000);
    }
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({ name, email, subject, body });
  };

  const projects = serverProjects && serverProjects.length > 0 ? serverProjects : fallbackProjects;
  const experiences = serverExperiences && serverExperiences.length > 0 ? serverExperiences : fallbackExperiences;
  const skills = serverSkills && serverSkills.length > 0 ? serverSkills : fallbackSkills;

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <Cpu className="h-4 w-4 text-teal-400" />;
      case 'backend': return <Terminal className="h-4 w-4 text-purple-400" />;
      case 'database': return <Database className="h-4 w-4 text-rose-400" />;
      case 'cloud':
      case 'devops': return <Cloud className="h-4 w-4 text-sky-400" />;
      case 'ai': return <Brain className="h-4 w-4 text-amber-400" />;
      default: return <Sparkles className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950">
        
        {/* Connection Status Badge */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex justify-end gap-2">
            {visitorCount !== null && (
              <div className="flex items-center space-x-1.5 rounded-full border border-violet-500/20 bg-violet-950/10 px-3 py-1 text-xs font-mono backdrop-blur-md text-violet-400">
                <Eye className="h-3 w-3" />
                <span>{visitorCount.toLocaleString()} visitors</span>
              </div>
            )}
            <div className={`flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-mono backdrop-blur-md ${
              serverOffline
                ? 'border-red-500/20 bg-red-950/10 text-red-400'
                : 'border-emerald-500/20 bg-emerald-950/10 text-emerald-400'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${serverOffline ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{serverOffline ? 'Database: Offline (Local Fallback)' : 'Database: Connected'}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Neon backdrop glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 rounded-full border border-teal-500/30 bg-teal-950/10 px-3 py-1 text-xs font-semibold text-teal-400 mb-6">
                <Terminal className="h-3.5 w-3.5" />
                <span className="font-mono">Hello, I&apos;m Pratik</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl font-sans">
                Full-Stack Systems & <br />
                <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                  AI/ML Engineer
                </span>
              </h1>
              <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
                Building web applications, machine learning models, and interactive user experiences. Specialized in React.js, Node.js, Python, and SQL databases.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-sm hover:bg-teal-400 transition-all font-sans"
                >
                  Explore Showcase
                </a>
                <Link
                  href="/resume"
                  className="rounded-lg border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-900 transition-all font-sans"
                >
                  View Resume
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Showcase */}
        <section id="projects" className="py-24 border-t border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">Featured Projects</h2>
                <p className="mt-3 text-zinc-400">Highlighted case studies and technical solutions.</p>
              </div>
              <Link
                href="/projects"
                className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-teal-400 hover:text-teal-300 text-sm font-semibold transition-colors font-sans"
              >
                <span>View All Projects</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {projects.map((project, idx) => (
                <article
                  key={project.slug || idx}
                  className="flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/30 hover:border-zinc-700/80 transition-all hover:-translate-y-1 duration-300 group"
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
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm text-zinc-400 line-clamp-3 leading-relaxed flex-1">
                      {project.summary}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="rounded bg-zinc-900 px-2.5 py-0.5 text-xs font-mono text-zinc-300 border border-zinc-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.slug && (
                      <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-end">
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
          </div>
        </section>

        {/* Interactive Skills Grid */}
        <section className="py-24 border-t border-zinc-900 bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">Technical Skills</h2>
              <p className="mt-3 text-zinc-400">A breakdown of my technical capabilities and proficiency levels.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-5 items-start">
              {/* 3D Orbit Galaxy */}
              <div className="lg:col-span-2">
                <TechGalaxy />
              </div>

              {/* Skills Proficiency Grid */}
              <div className="lg:col-span-3 grid gap-6 sm:grid-cols-2">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div
                    key={category}
                    className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2.5 border-b border-zinc-900 pb-4 mb-6">
                      {getCategoryIcon(category)}
                      <h3 className="font-mono text-sm font-bold text-zinc-200 capitalize tracking-wide">
                        {category}
                      </h3>
                    </div>
                    <div className="space-y-5">
                      {items.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
                            <span>{skill.name}</span>
                            <span className="text-teal-400 font-bold">{skill.proficiency}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden border border-zinc-800/40">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="py-24 border-t border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">Work Experience</h2>
              <p className="mt-3 text-zinc-400">A timeline of my professional roles, achievements, and internships.</p>
            </div>

            <div className="relative border-l border-zinc-800 ml-4 md:ml-6 space-y-12">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-8 md:pl-10 group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-between rounded-full border border-teal-500 bg-zinc-950 group-hover:scale-125 transition-transform duration-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 mx-auto" />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                      {exp.role} @ <span className="text-zinc-300 font-medium">{exp.organization}</span>
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-zinc-500 font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        {' — '}
                        {exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
                          : 'Present'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-mono text-zinc-500 mb-4 capitalize">
                    <Briefcase className="h-3 w-3" />
                    <span>{exp.type}</span>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">{exp.description}</p>
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-400 pl-2">
                      {exp.responsibilities.map((resp, rid) => (
                        <li key={rid} className="leading-relaxed">{resp}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exp.technologiesUsed.map((tech) => (
                        <span key={tech} className="rounded bg-zinc-900/60 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GitHub Activity Section */}
        <section className="border-t border-zinc-900">
          <GitHubStats username={process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'PratikDate01'} />
        </section>

        {/* Contact Form Section */}
        <section className="py-24 border-t border-zinc-900 bg-zinc-950/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">Get in Touch</h2>
                <p className="mt-3 text-zinc-400 max-w-md leading-relaxed">
                  Have an opportunity, project, or question? Send a message using the form below.
                </p>

                <div className="mt-8 space-y-4 font-sans text-sm text-zinc-500">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-teal-500" />
                    <span>Phone: +91 7666394641</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4 text-teal-500" />
                    <span>Email: pratikdate.sknsits.it@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-teal-500 font-mono text-xs">📍</span>
                    <span>Location: Pune, Maharashtra, India</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-8 shadow-xl relative">
                
                {/* Gamified XP Earned notification overlay */}
                {formSuccess && (
                  <div className="absolute inset-0 rounded-xl bg-zinc-950/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <CheckCircle2 className="h-12 w-12 text-teal-400 mb-4" />
                    <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                    <p className="text-sm text-zinc-400 mt-2 max-w-xs">
                      Your message has been successfully received and recorded.
                    </p>
                    {xpEarned && (
                      <div className="mt-4 flex items-center space-x-1.5 rounded-full bg-teal-950/30 border border-teal-500/30 px-4 py-1.5 text-xs text-teal-400 font-bold font-sans animate-bounce">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Level Up: +100 XP Earned!</span>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-5 font-sans">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-semibold">Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-semibold">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                      placeholder="e.g. jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-semibold">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                      placeholder="e.g. Project Consultation"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-semibold">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full flex items-center justify-center space-x-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold py-3 text-sm transition-all disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{contactMutation.isPending ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
