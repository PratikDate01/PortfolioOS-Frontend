'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { API_BASE_URL } from '@/lib/config';
import Footer from '@/components/layout/Footer';
import TechGalaxy from '@/components/sections/TechGalaxy';
import GitHubStats from '@/components/sections/GitHubStats';
import AIChatWidget from '@/components/features/AIChatWidget';
import { Project, Experience, Skill, Certification, Portfolio, BlogPost, Resume, Testimonial } from '@/types';
import {
  Terminal, Cpu, Database, Cloud, Brain, CheckCircle2, Eye, Award, FileText, Code, ChevronRight, Link2, Mail, Github, Linkedin, Twitter, Globe, ShieldAlert, Loader2, Calendar, User as UserIcon, Briefcase, Sparkles, MapPin, ExternalLink
} from 'lucide-react';

interface PortfolioClientProps {
  username: string;
  initialPortfolio: Portfolio | null;
  initialProjects: Project[];
  initialExperiences: Experience[];
  initialSkills: Skill[];
  initialCertifications: Certification[];
  initialResumes: Resume[];
  initialBlogPosts: BlogPost[];
  initialTestimonials?: Testimonial[];
}

export default function PortfolioClient({
  username,
  initialPortfolio,
  initialProjects,
  initialExperiences,
  initialSkills,
  initialCertifications,
  initialResumes,
  initialBlogPosts,
  initialTestimonials = [],
}: PortfolioClientProps) {
  const router = useRouter();

  // Session-based Visitor Count & Sessions
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // States for Dynamic Interactions
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFileTab, setActiveFileTab] = useState<string>('Profile.md'); // IDE theme tab
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all'); // Project filter

  // Contact Form Fields
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactBody, setContactBody] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // 1. Fetch Portfolio details by Username
  const { data: portfolio, isLoading: isPortfolioLoading, error: portfolioError } = useQuery<Portfolio>({
    queryKey: ['portfolio', username],
    queryFn: async () => {
      const res = await apiFetch<Portfolio>(`/portfolios/${username}`);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    initialData: initialPortfolio || undefined,
    enabled: !!username,
    retry: false
  });

  // 2. Fetch User Projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects', username],
    queryFn: async () => {
      const res = await apiFetch<Project[]>(`/projects?username=${username}`);
      return res.data || [];
    },
    initialData: initialProjects,
    enabled: !!username
  });

  // 3. Fetch User Experiences
  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ['experiences', username],
    queryFn: async () => {
      const res = await apiFetch<Experience[]>(`/experience?username=${username}`);
      return res.data || [];
    },
    initialData: initialExperiences,
    enabled: !!username
  });

  // 4. Fetch User Skills
  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ['skills', username],
    queryFn: async () => {
      const res = await apiFetch<Skill[]>(`/skills?username=${username}`);
      return res.data || [];
    },
    initialData: initialSkills,
    enabled: !!username
  });

  // 5. Fetch User Certifications
  const { data: certifications = [] } = useQuery<Certification[]>({
    queryKey: ['certifications', username],
    queryFn: async () => {
      const res = await apiFetch<Certification[]>(`/certifications?username=${username}`);
      return res.data || [];
    },
    initialData: initialCertifications,
    enabled: !!username
  });

  // 6. Fetch Resumes
  const { data: resumes = [] } = useQuery<Resume[]>({
    queryKey: ['resumes', username],
    queryFn: async () => {
      const res = await apiFetch<Resume[]>(`/resume?username=${username}`);
      return res.data || [];
    },
    initialData: initialResumes,
    enabled: !!username
  });
  const activeResume = resumes.find(r => r.isActive) || resumes[0];

  // 8. Fetch Blog Posts
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['blogPosts', username],
    queryFn: async () => {
      const res = await apiFetch<BlogPost[]>(`/blog?username=${username}`);
      return res.data || [];
    },
    initialData: initialBlogPosts,
    enabled: !!username
  });

  // 9. Fetch Testimonials
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials', username],
    queryFn: async () => {
      const res = await apiFetch<Testimonial[]>(`/testimonials?username=${username}`);
      return res.data || [];
    },
    initialData: initialTestimonials,
    enabled: !!username
  });

  // 6. Record Visit on mount & retrieve visitor stats
  useEffect(() => {
    if (username) {
      const storedSession = sessionStorage.getItem(`visit_${username}`);
      apiFetch<{ totalVisitors: number; sessionId: string }>('/analytics/visit', {
        method: 'POST',
        body: JSON.stringify({ username, sessionId: storedSession || undefined })
      }).then(res => {
        if (res.data) {
          sessionStorage.setItem(`visit_${username}`, res.data.sessionId);
          setSessionId(res.data.sessionId);
          setVisitorCount(res.data.totalVisitors);
        }
      }).catch(() => {});
    }
  }, [username]);

  // Contact Form Submission Mutation
  const contactMutation = useMutation({
    mutationFn: async (messageData: { name: string; email: string; subject: string; body: string }) => {
      const res = await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          ...messageData,
          portfolioOwnerId: (portfolio?.ownerId as any)?._id || portfolio?.ownerId,
          username,
          source: 'contact_form'
        })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactBody('');
      setTimeout(() => setContactSuccess(false), 4000);
    }
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({
      name: contactName,
      email: contactEmail,
      subject: contactSubject || 'Contact Form Submission',
      body: contactBody
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    }
  };

  // Helper: Group skills by category
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  // Helper: Get icon based on category name
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Cpu className="h-4 w-4 text-teal-400" />;
      case 'backend':
        return <Database className="h-4 w-4 text-indigo-400" />;
      case 'database':
        return <Database className="h-4 w-4 text-emerald-400" />;
      case 'cloud':
      case 'devops':
        return <Cloud className="h-4 w-4 text-sky-400" />;
      case 'ai':
      case 'ml':
      case 'data':
        return <Brain className="h-4 w-4 text-purple-400" />;
      default:
        return <Terminal className="h-4 w-4 text-zinc-400" />;
    }
  };

  if (isPortfolioLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-300">
        <Loader2 className="h-10 w-10 animate-spin text-teal-400 mb-4" />
        <p className="text-sm font-mono tracking-wide">Loading portfolio OS context...</p>
      </div>
    );
  }

  if (portfolioError || !portfolio) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-300 px-6 text-center">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 max-w-md shadow-2xl backdrop-blur-md">
          <ShieldAlert className="h-14 w-14 text-red-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-xl font-bold text-white mb-2">Portfolio Not Found</h1>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            The portfolio for username <span className="font-mono text-teal-400">@{username}</span> doesn&apos;t exist or is currently unavailable.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-sm hover:bg-teal-400 transition-all"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Go to Portal Homepage</span>
          </button>
        </div>
      </div>
    );
  }

  // Resolve dynamic values from portfolio/owner models
  const theme = portfolio.theme || 'portfolio-os';
  const ownerName = (portfolio.ownerId as any)?.name || username;
  const headline = portfolio.headline || 'Software Engineer & Designer';
  const bio = portfolio.bio || (portfolio.ownerId as any)?.bio || 'Building future-focused applications.';
  const githubUser = portfolio.githubUsername || (portfolio.ownerId as any)?.githubUsername || '';
  const avatarUrl = portfolio.profileImage?.secureUrl || (portfolio.ownerId as any)?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  const coverImageUrl = portfolio.coverImage?.secureUrl || (portfolio.ownerId as any)?.coverImage?.secureUrl || '';
  const userLocation = (portfolio.ownerId as any)?.location || 'Remote / Worldwide';
  const availabilityStatus = (portfolio.ownerId as any)?.availabilityStatus || 'Available for Opportunities';

  const renderAvatar = (className: string, initialsSizeClass: string = "text-xl") => {
    const secureUrl = portfolio.profileImage?.secureUrl || (portfolio.ownerId as any)?.profileImage?.secureUrl || (portfolio.ownerId as any)?.avatarUrl;
    const isUnsplash = secureUrl && secureUrl.includes('images.unsplash.com');

    if (secureUrl && !isUnsplash) {
      return (
        <img
          src={secureUrl}
          alt={ownerName}
          className={`${className} object-cover`}
        />
      );
    }

    // Initials fallback
    const initials = ownerName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

    return (
      <div className={`${className} flex items-center justify-center bg-zinc-800 text-zinc-355 font-mono font-bold select-none ${initialsSizeClass}`}>
        {initials}
      </div>
    );
  };

  const socialLinks = portfolio.socialLinks || (portfolio.ownerId as any)?.socialLinks || {};

  const educationExperiences = experiences.filter(exp => exp.type === 'education');
  const achievementExperiences = experiences.filter(exp => exp.type === 'achievement');

  // Years of Experience calculation
  const yearsOfExp = experiences
    .filter(exp => exp.type === 'job' || exp.type === 'internship')
    .reduce((acc, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const diffYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return acc + diffYears;
    }, 0);
  const displayYearsOfExp = yearsOfExp > 0 ? Math.max(1, Math.round(yearsOfExp)) : 0;

  // Recruiter metrics scores calculation
  const calculateScores = () => {
    let score = 0;
    
    // 1. Profile completeness (Avatar + Bio) - 20 pts
    const hasAvatar = !!portfolio?.profileImage?.secureUrl || !!(portfolio?.ownerId as any)?.avatarUrl;
    const hasBio = !!portfolio?.bio || !!(portfolio?.ownerId as any)?.bio;
    let profileScore = 0;
    if (hasAvatar) profileScore += 10;
    if (hasBio) profileScore += 10;
    score += profileScore;

    // 2. Resume - 20 pts
    const hasResume = resumes && resumes.length > 0;
    const resumeScore = hasResume ? 20 : 0;
    score += resumeScore;

    // 3. Skills (min 5) - 20 pts
    const skillCount = skills ? skills.length : 0;
    const skillsScore = Math.min(20, Math.round((skillCount / 5) * 20));
    score += skillsScore;

    // 4. Projects (min 3) - 20 pts
    const projectCount = projects ? projects.length : 0;
    const projectsScore = Math.min(20, Math.round((projectCount / 3) * 20));
    score += projectsScore;

    // 5. Certifications (min 1) - 10 pts
    const certsScore = (certifications && certifications.length > 0) ? 10 : 0;
    score += certsScore;

    // 6. GitHub Integration - 10 pts
    const hasGithub = !!githubUser;
    const githubScore = hasGithub ? 10 : 0;
    score += githubScore;

    const portfolioScore = Math.min(100, score);
    
    let readinessScore = 'Needs Improvement';
    if (portfolioScore >= 85) readinessScore = 'Excellent';
    else if (portfolioScore >= 70) readinessScore = 'Good';
    else if (portfolioScore >= 50) readinessScore = 'Average';

    const atsScore = hasResume ? Math.min(100, Math.round(60 + (portfolioScore * 0.4))) : 40;

    let githubHealth = 'Not Connected';
    if (hasGithub) {
      githubHealth = 'Excellent';
    }

    return {
      portfolioScore,
      readinessScore,
      atsScore,
      githubHealth
    };
  };

  const scores = calculateScores();

  // Project categories and filtering
  const projectCategories = ['all', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
  const filteredProjects = activeFilterCategory === 'all'
    ? projects
    : projects.filter(p => p.category?.toLowerCase() === activeFilterCategory.toLowerCase());

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      theme === 'minimal' ? 'bg-[#fafafa] text-zinc-900 selection:bg-zinc-200' :
      theme === 'developer' ? 'bg-[#18181c] text-[#d4d4d8]' :
      theme === 'creative' ? 'bg-[#0f0a20] text-purple-100' :
      theme === 'corporate' ? 'bg-slate-900 text-slate-100' :
      'bg-zinc-950 text-zinc-100' // portfolio-os
    }`}>
      
      {/* Dynamic Theme Banner / Background Elements */}
      {theme === 'creative' && (
        <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-900/20 blur-[150px]" />
          <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-900/20 blur-[120px]" />
        </div>
      )}

      {theme === 'portfolio-os' && (
        <div className="absolute top-0 inset-x-0 h-[500px] overflow-hidden pointer-events-none z-0 opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[130px]" />
        </div>
      )}

      {/* Header and Brand */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        theme === 'minimal' ? 'bg-white/80 border-zinc-200/80 text-zinc-900' :
        theme === 'developer' ? 'bg-[#18181c]/80 border-zinc-800/80 text-zinc-300' :
        theme === 'creative' ? 'bg-[#0f0a20]/80 border-purple-950/40 text-purple-200' :
        theme === 'corporate' ? 'bg-slate-900/85 border-slate-800 text-slate-100' :
        'bg-zinc-950/80 border-zinc-900 text-zinc-300' // portfolio-os
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-sm font-bold rounded-lg px-2.5 py-1 ${
                theme === 'minimal' ? 'bg-zinc-900 text-white' :
                theme === 'developer' ? 'bg-[#2a2a30] text-emerald-400 border border-[#3e3e44]' :
                theme === 'creative' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' :
                theme === 'corporate' ? 'bg-indigo-600 text-white' :
                'bg-teal-950 text-teal-400 border border-teal-500/30'
              }`}>
                {username.toUpperCase()}
              </span>
              <span className="hidden md:inline text-xs font-mono opacity-60">/ portfolio-os</span>
            </div>
            
            <div className="flex items-center gap-4">
              {visitorCount !== null && (
                <div className={`flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-mono ${
                  theme === 'minimal' ? 'border-zinc-200 bg-zinc-50 text-zinc-650' :
                  theme === 'developer' ? 'border-[#3e3e44] bg-[#222228] text-zinc-400' :
                  theme === 'creative' ? 'border-purple-500/20 bg-purple-950/20 text-purple-300' :
                  theme === 'corporate' ? 'border-indigo-500/20 bg-indigo-950/20 text-indigo-300' :
                  'border-teal-500/20 bg-teal-950/10 text-teal-400'
                }`}>
                  <Eye className="h-3.5 w-3.5" />
                  <span>{visitorCount.toLocaleString()} views</span>
                </div>
              )}

              <button
                onClick={handleCopyLink}
                className={`rounded-lg p-2 text-xs font-mono border transition-all flex items-center gap-1.5 ${
                  theme === 'minimal' ? 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700' :
                  theme === 'developer' ? 'border-[#3e3e44] bg-[#222228] hover:bg-[#2e2e36] text-zinc-300' :
                  theme === 'creative' ? 'border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/20 text-purple-200' :
                  theme === 'corporate' ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200' :
                  'border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 text-zinc-300'
                }`}
              >
                {copiedSuccess ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Link2 className="h-3.5 w-3.5" />}
                <span>{copiedSuccess ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow z-10">
        {theme === 'portfolio-os' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-24">
            
            {/* Widescreen Banner Cover & Profile Header */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950/40">
              <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-teal-950 via-zinc-900 to-indigo-950">
                {coverImageUrl ? (
                  <img src={coverImageUrl} alt="Profile Cover" className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
              </div>
              <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left z-10">
                  {portfolio.showProfilePhoto !== false && (
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-zinc-950 bg-zinc-900 shadow-2xl flex-shrink-0">
                      {renderAvatar("w-full h-full", "text-2xl")}
                    </div>
                  )}
                  <div className="md:pb-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                      <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl font-sans">{ownerName}</h1>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[9px] font-semibold text-teal-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{availabilityStatus}</span>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm font-semibold">{headline}</p>
                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-zinc-500 mt-2 font-mono">
                      <MapPin className="h-3.5 w-3.5 text-teal-500" />
                      <span>{userLocation}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:pb-2 z-10">
                  {activeResume && (
                    <a
                      href={`${API_BASE_URL}/resume/${activeResume._id}/download`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold px-4 py-2.5 text-xs transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Download Resume</span>
                    </a>
                  )}
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-850 bg-zinc-900/60 hover:bg-zinc-800 text-white font-semibold px-4 py-2.5 text-xs transition-all duration-300"
                  >
                    <Mail className="h-4 w-4 text-teal-400" />
                    <span>Get in Touch</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Bio Section */}
            <section className="relative pt-4">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="inline-flex items-center space-x-2 rounded-full border border-teal-500/30 bg-teal-950/10 px-3 py-1 text-xs font-semibold text-teal-400">
                    <Terminal className="h-3.5 w-3.5" />
                    <span className="font-mono">Profile Summary</span>
                  </div>
                  

                </div>
                <p className="text-base text-zinc-400 leading-relaxed font-sans">
                  {bio}
                </p>

                <div className="mt-6 flex gap-3">
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-850 bg-zinc-950/30 p-2 text-zinc-450 hover:text-white transition-all">
                      <Github className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-850 bg-zinc-950/30 p-2 text-zinc-450 hover:text-white transition-all">
                      <Linkedin className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-850 bg-zinc-950/30 p-2 text-zinc-450 hover:text-white transition-all">
                      <Twitter className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {socialLinks.website && (
                    <a href={socialLinks.website} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-850 bg-zinc-950/30 p-2 text-zinc-450 hover:text-white transition-all">
                      <Globe className="h-4.5 w-4.5" />
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Recruiter Intelligence Dashboard */}
            <section className="border-t border-zinc-900 pt-16">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight text-white font-sans sm:text-2xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-teal-400" />
                  <span>Recruiter Intelligence Dashboard</span>
                </h2>
                <p className="text-zinc-500 text-xs mt-1">Real-time candidate indexing, portfolio health, and profile verification metrics.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Score Card 1: Portfolio Completeness */}
                <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Portfolio Score</span>
                    <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-extrabold text-white">{scores.portfolioScore}</span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400" style={{ width: `${scores.portfolioScore}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">Based on profile content depth and media completeness.</p>
                </div>

                {/* Score Card 2: Recruiter Readiness */}
                <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Recruiter Readiness</span>
                    <Sparkles className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      scores.readinessScore === 'Excellent' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      scores.readinessScore === 'Good' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-zinc-500/10 text-zinc-400 border border-zinc-800'
                    }`}>
                      {scores.readinessScore}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">Profile formatting, contact access points, and case studies depth status.</p>
                </div>

                {/* Score Card 3: ATS Score */}
                <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">ATS Match Capability</span>
                    <FileText className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-extrabold text-white">{scores.atsScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: `${scores.atsScore}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">Applicant tracking compatibility based on structural resume keywords.</p>
                </div>

                {/* Score Card 4: GitHub Health */}
                <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">GitHub Sync Health</span>
                    <Github className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      scores.githubHealth === 'Excellent' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-zinc-500/10 text-zinc-400 border border-zinc-800'
                    }`}>
                      {scores.githubHealth}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">Live repository contributions, documentation, and language distribution.</p>
                </div>
              </div>
            </section>

            {/* Quick Analytics Stats Section */}
            <section className="border-t border-zinc-900 pt-16">
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tight text-white font-sans sm:text-2xl">
                  Quick Analytics Stats
                </h2>
                <p className="text-zinc-500 text-xs mt-1">Numerical overview of credentials, contributions, and engagement.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="block text-2xl font-bold text-white font-mono">{projects.length}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Projects</span>
                </div>
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="block text-2xl font-bold text-teal-400 font-mono">{skills.length}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Skills</span>
                </div>
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="block text-2xl font-bold text-white font-mono">{certifications.length}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Certificates</span>
                </div>
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="block text-2xl font-bold text-white font-mono">
                    {experiences.filter(e => e.type === 'job' || e.type === 'internship').length}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Roles Held</span>
                </div>
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="block text-2xl font-bold text-white font-mono">
                    {githubUser ? 'Connected' : 'N/A'}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">GitHub Repos</span>
                </div>
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="block text-2xl font-bold text-teal-400 font-mono">
                    {visitorCount !== null ? visitorCount.toLocaleString() : '100+'}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Views</span>
                </div>
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center">
                  <span className="block text-2xl font-bold text-white font-mono">{displayYearsOfExp}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Years Exp</span>
                </div>
              </div>
            </section>

            {/* Top Skills Spotlight Widget */}
            <section className="border-t border-zinc-900 pt-16">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-teal-500/20 bg-teal-500/5 text-[9px] font-mono font-bold text-teal-400 uppercase">
                  Top Skills Spotlight
                </span>
                <h2 className="text-xl font-bold tracking-tight text-white font-sans sm:text-2xl mt-2">
                  Primary Capabilities
                </h2>
                <p className="text-zinc-500 text-xs mt-1">Core technical skills verified by hands-on project implementations.</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {skills.slice().sort((a, b) => b.proficiency - a.proficiency).slice(0, 6).map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3 rounded-xl border border-zinc-850 bg-zinc-950/40 px-4 py-3 min-w-[150px] flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 flex-shrink-0">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-zinc-100 font-mono">{skill.name}</span>
                      <span className="text-[10px] text-teal-400 font-mono font-semibold">{skill.proficiency}% Proficiency</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Projects Showcase */}
            <section id="projects" className="border-t border-zinc-900 pt-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Projects Showcase</h2>
                  <p className="mt-2 text-zinc-400 text-sm">Highlighted projects and technical architectures.</p>
                </div>
              </div>

              {/* Filtering tabs */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {projectCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilterCategory(cat)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-mono border transition-all ${
                      activeFilterCategory === cat
                        ? 'bg-teal-500 text-zinc-950 border-teal-500 font-bold'
                        : 'bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 border border-zinc-800/80 rounded-xl bg-zinc-950/20">
                  <p className="text-sm text-zinc-500 font-mono">No projects published under this filter.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <article key={project._id} className="flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/30 hover:border-zinc-700/80 transition-all hover:-translate-y-1 duration-300 group relative">
                      <div className="aspect-video w-full overflow-hidden bg-zinc-900 relative">
                        <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} alt={project.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 rounded-md bg-zinc-950/80 px-2 py-0.5 text-[10px] font-mono text-teal-400 border border-teal-500/20">
                          {project.category}
                        </div>
                        <div className="absolute top-3 left-3 rounded-md bg-zinc-950/80 px-2 py-0.5 text-[9px] font-mono text-emerald-400 border border-emerald-500/20">
                          {project.status ? project.status.toUpperCase() : 'ACTIVE'}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">{project.title}</h3>
                        <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed flex-1">{project.summary}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-800">{tech}</span>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => setSelectedProject(project)} className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg border border-zinc-800 bg-zinc-950/50 py-2 text-xs font-semibold text-teal-400 hover:bg-zinc-900 transition-all">
                            <span>Case study</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                          {project.links?.github && (
                            <a href={project.links.github} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-2.5 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center">
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {project.links?.liveDemo && (
                            <a href={project.links.liveDemo} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-2.5 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Technical Skills Grouped Grid & Interactive Orbit */}
            <section className="border-t border-zinc-900 pt-16 bg-zinc-950/10">
              <div className="grid gap-12 lg:grid-cols-5 items-start">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans mb-3">Technical Skills</h2>
                  <p className="text-zinc-400 text-sm mb-6">Capabilities structured by competency tiers.</p>
                  <TechGalaxy />
                </div>
                <div className="lg:col-span-3 grid gap-6 sm:grid-cols-2">
                  {Object.entries(skillsByCategory).map(([category, items]) => (
                    <div key={category} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
                      <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3 mb-4">
                        {getCategoryIcon(category)}
                        <h3 className="font-mono text-xs font-bold text-zinc-300 capitalize">{category}</h3>
                      </div>
                      <div className="space-y-4">
                        {items.map((skill) => (
                          <div key={skill.name}>
                            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                              <span>{skill.name}</span>
                              <span className="text-teal-400">{skill.proficiency}%</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-zinc-900 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400" style={{ width: `${skill.proficiency}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Experience Timeline */}
            <section className="border-t border-zinc-900 pt-16">
              <h2 className="text-2xl font-bold tracking-tight text-white font-sans mb-12">Professional Timeline</h2>
              <div className="relative border-l border-zinc-800 ml-4 space-y-12">
                {experiences
                  .filter(exp => exp.type === 'job' || exp.type === 'internship')
                  .map((exp, idx) => (
                    <div key={idx} className="relative pl-8 group">
                      <div className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-between rounded-full border border-teal-500 bg-zinc-950 group-hover:scale-125 transition-transform duration-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 mx-auto" />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
                          {exp.role} @ <span className="text-zinc-300 font-medium">{exp.organization}</span>
                        </h3>
                        <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} — {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2 capitalize font-mono text-teal-500">{exp.type}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-3">{exp.description}</p>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside text-xs text-zinc-405 space-y-1 font-sans pl-2 mb-3">
                          {exp.responsibilities.map((r, ri) => (
                            <li key={ri} className="leading-relaxed">{r}</li>
                          ))}
                        </ul>
                      )}
                      {exp.technologiesUsed && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologiesUsed.map(t => (
                            <span key={t} className="rounded bg-zinc-900 px-2 py-0.5 text-[9px] font-mono text-zinc-400 border border-zinc-800">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </section>

            {/* Education Section */}
            {educationExperiences.length > 0 && (
              <section className="border-t border-zinc-900 pt-16">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Education</h2>
                  <p className="mt-2 text-zinc-400 text-sm">Academic credentials and qualifications.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {educationExperiences.map((edu, idx) => (
                    <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <h3 className="text-base font-bold text-white">{edu.role}</h3>
                          <p className="text-xs text-teal-400 font-mono mt-0.5">{edu.organization}</p>
                        </div>
                        <span className="text-xs text-zinc-550 font-mono flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-zinc-650" />
                          {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-2">{edu.description}</p>
                      {edu.responsibilities && edu.responsibilities.length > 0 && (
                        <p className="text-[11px] text-zinc-500 font-mono mt-2">{edu.responsibilities.join(' • ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements Section */}
            {achievementExperiences.length > 0 && (
              <section className="border-t border-zinc-900 pt-16">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Achievements & Recognitions</h2>
                  <p className="mt-2 text-zinc-400 text-sm">Honors, hackathons, and professional milestones.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {achievementExperiences.map((ach, idx) => (
                    <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                      <div className="flex items-center gap-2.5 mb-3">
                        <Award className="h-5 w-5 text-amber-400 flex-shrink-0" />
                        <h3 className="text-sm font-bold text-zinc-100">{ach.role}</h3>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{ach.description}</p>
                      <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>{ach.organization}</span>
                        <span>{new Date(ach.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Testimonials Section */}
            {testimonials.length > 0 && (
              <section className="border-t border-zinc-900 pt-16">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Recommendations & Endorsements</h2>
                  <p className="mt-2 text-zinc-400 text-sm">Feedback from collaborators, clients, and team members.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 flex flex-col justify-between">
                      <p className="text-sm text-zinc-300 italic leading-relaxed font-serif">&ldquo;{testimonial.body}&rdquo;</p>
                      <div className="mt-6 flex items-center gap-3">
                        {testimonial.authorAvatarUrl ? (
                          <img src={testimonial.authorAvatarUrl} alt={testimonial.authorName} className="h-10 w-10 rounded-full object-cover border border-zinc-700" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-350">
                            {testimonial.authorName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-white">{testimonial.authorName}</h4>
                          <p className="text-[10px] text-zinc-550 font-mono">{testimonial.authorRole} {testimonial.authorCompany ? `@ ${testimonial.authorCompany}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications Section */}
            {certifications && certifications.length > 0 && (
              <section className="border-t border-zinc-900 pt-16">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Certifications &amp; Awards</h2>
                  <p className="mt-2 text-zinc-400 text-sm">Professional credentials, courses, and honors.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {certifications.map((cert) => (
                    <div key={cert._id} className="rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-5 hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="h-5 w-5 text-teal-400 flex-shrink-0" />
                          <h3 className="text-sm font-bold text-zinc-100">{cert.title}</h3>
                        </div>
                        <p className="text-xs text-zinc-500 font-mono mb-2">{cert.issuer}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                        </span>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-500 hover:text-teal-400"
                          >
                            <span>Verify</span>
                            <ChevronRight className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* GitHub Info Section */}
            {githubUser && (
              <section className="border-t border-zinc-900 pt-16">
                <GitHubStats username={githubUser} />
              </section>
            )}

            {/* Resume CV Section */}
            {activeResume && (
              <section className="border-t border-zinc-900 pt-16">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Curriculum Vitae</h2>
                  <p className="mt-2 text-zinc-400 text-sm">Verified professional resume credentials.</p>
                </div>
                <div className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2.5">
                      <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                        <FileText className="h-5.5 w-5.5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{activeResume.label || 'Standard Professional Resume'}</h3>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">
                          Format: PDF/Document • Updated: {activeResume.updatedAt ? new Date(activeResume.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                      Review the verified professional experience, skills taxonomy, and certifications compiled for recruiter assessment.
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                      <a
                        href={`${API_BASE_URL}/resume/${activeResume._id}/download`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold px-4 py-2.5 text-xs transition-all duration-300 shadow-md shadow-teal-500/5"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Download Active Resume</span>
                      </a>
                    </div>
                  </div>

                  <div className="w-full max-w-sm aspect-[4/3] rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors">
                    <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-bold">Document Preview</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                      <FileText className="h-10 w-10 text-zinc-750 mb-2 animate-bounce" />
                      <p className="text-xs text-zinc-350 font-mono font-bold">{activeResume.resumeFile?.format?.toUpperCase() || 'PDF'} Document File</p>
                      <p className="text-[10px] text-zinc-550 font-mono mt-1">{(activeResume.resumeFile?.bytes ? (activeResume.resumeFile.bytes / 1024).toFixed(1) : '150')} KB • Public Link Verified</p>
                    </div>
                    <a
                      href={`${API_BASE_URL}/resume/${activeResume._id}/download`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-355 hover:text-white font-mono text-[10px] uppercase font-bold tracking-widest text-center border border-zinc-800 rounded-lg transition-all"
                    >
                      Open Full Document
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* Contact Coordinates & Form */}
            <section id="contact" className="border-t border-zinc-900 pt-16">
              <div className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Get In Touch</h2>
                <p className="mt-2 text-zinc-400 text-sm">Coordinate project discovery calls, interview pipelines, or send messages.</p>
              </div>

              <div className="grid gap-12 lg:grid-cols-5 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-5 space-y-4">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-550 font-bold border-b border-zinc-900 pb-2">// Contact Coordinates</p>
                    
                    {socialLinks.github && (
                      <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-450 hover:text-white transition-colors">
                        <Github className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                        <span className="truncate">{socialLinks.github}</span>
                      </a>
                    )}
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-450 hover:text-white transition-colors">
                        <Linkedin className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                        <span className="truncate">{socialLinks.linkedin}</span>
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-450 hover:text-white transition-colors">
                        <Twitter className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                        <span className="truncate">{socialLinks.twitter}</span>
                      </a>
                    )}
                    {socialLinks.website && (
                      <a href={socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-450 hover:text-white transition-colors">
                        <Globe className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                        <span className="truncate">{socialLinks.website}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-550 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Hiring Manager"
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-550 mb-1">Your Email</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-550 mb-1">Subject</label>
                      <input
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="Inquiry or Job Opportunity"
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-550 mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={contactBody}
                        onChange={(e) => setContactBody(e.target.value)}
                        placeholder="Scope description or role requirements..."
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-zinc-800 text-zinc-950 font-bold py-3 rounded-lg text-xs transition-all shadow-md shadow-teal-500/5 flex items-center justify-center gap-2"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Sending Request...</span>
                        </>
                      ) : (
                        <span>Submit Message Request</span>
                      )}
                    </button>
                    {contactSuccess && (
                      <p className="text-[11px] text-emerald-400 font-mono text-center mt-2">✓ Message submitted successfully. Check your console/inbox.</p>
                    )}
                  </form>
                </div>
              </div>
            </section>

          </div>
        )}

        {theme === 'developer' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-mono">
            <div className="rounded-xl border border-[#2d2d30] bg-[#1e1e24] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[750px]">
              
              {/* IDE Left File Navigator Sidebar */}
              <div className="w-full md:w-60 border-r border-[#2d2d30] bg-[#1a1a1f] flex-shrink-0 flex flex-col">
                <div className="p-3 border-b border-[#2d2d30] flex items-center justify-between text-xs text-zinc-500 uppercase tracking-wider font-bold">
                  <span>Project Explorer</span>
                  <Code className="h-4 w-4" />
                </div>
                <div className="p-2 space-y-1 overflow-y-auto flex-grow text-sm">
                  {[
                    { name: 'Profile.md', icon: <UserIcon className="h-4 w-4 text-sky-400" /> },
                    { name: 'Projects.json', icon: <Code className="h-4 w-4 text-amber-400" /> },
                    { name: 'Experience.csv', icon: <Briefcase className="h-4 w-4 text-emerald-400" /> },
                    { name: 'Skills.ts', icon: <Cpu className="h-4 w-4 text-purple-400" /> },
                    { name: 'Certifications.yaml', icon: <Award className="h-4 w-4 text-teal-400" /> },
                    { name: 'Contact.js', icon: <Mail className="h-4 w-4 text-rose-400" /> }
                  ].map(tab => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveFileTab(tab.name)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeFileTab === tab.name
                          ? 'bg-[#2a2a30] text-[#569cd6] font-bold border-l-2 border-emerald-400'
                          : 'text-zinc-400 hover:bg-[#25252a] hover:text-zinc-200'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* IDE Editor Area */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e24]">
                
                {/* File Tabs Header */}
                <div className="flex items-center bg-[#1a1a1f] border-b border-[#2d2d30] overflow-x-auto">
                  <div className="flex px-2 py-1 gap-1">
                    <span className="rounded-full bg-red-500/80 h-3 w-3 inline-block" />
                    <span className="rounded-full bg-yellow-500/80 h-3 w-3 inline-block" />
                    <span className="rounded-full bg-green-500/80 h-3 w-3 inline-block" />
                  </div>
                  <div className="flex-grow" />
                  <div className="bg-[#1e1e24] px-4 py-2 border-r border-[#2d2d30] border-t-2 border-emerald-400 text-xs font-bold text-zinc-300 flex items-center gap-2">
                    <span>{activeFileTab}</span>
                  </div>
                  <div className="px-4 text-zinc-500 text-xs">UTF-8</div>
                </div>

                {/* Editor Content Box */}
                <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-zinc-300 relative">
                  
                  {activeFileTab === 'Profile.md' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 border-b border-[#2d2d30] pb-6">
                        {portfolio.showProfilePhoto !== false && renderAvatar("h-16 w-16 rounded-full border border-zinc-700 bg-zinc-800", "text-lg")}
                        <div>
                          <p className="text-zinc-500 text-xs">// Portfolio OS Metadata</p>
                          <h1 className="text-2xl font-bold text-white"># {ownerName}</h1>
                          <p className="text-teal-400 text-sm">{headline}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-[#ce9178] font-bold">## Biography</h3>
                        <p className="text-zinc-350 bg-[#151518] p-4 rounded-lg border border-[#2d2d30] font-sans leading-relaxed">
                          {bio}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-[#ce9178] font-bold">## Core Coordinates</h3>
                        <div className="grid gap-2 text-xs bg-[#151518] p-4 rounded-lg border border-[#2d2d30]">
                          <p><span className="text-[#9cdcfe]">developer_slug:</span> <span className="text-[#ce9178]">&quot;{username}&quot;</span></p>
                          <p><span className="text-[#9cdcfe]">host_theme:</span> <span className="text-[#ce9178]">&quot;{theme}&quot;</span></p>
                          {(portfolio.ownerId as any)?.email && (
                            <p><span className="text-[#9cdcfe]">email_channel:</span> <span className="text-[#ce9178]">&quot;{(portfolio.ownerId as any).email}&quot;</span></p>
                          )}
                          <p><span className="text-[#9cdcfe]">github_username:</span> <span className="text-[#ce9178]">&quot;{githubUser || 'N/A'}&quot;</span></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFileTab === 'Projects.json' && (
                    <div className="space-y-6">
                      <p className="text-zinc-500 text-xs">// {projects.length} compilations loaded</p>
                      {projects.length === 0 ? (
                        <p className="text-[#ce9178] italic">[Empty Array]</p>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          {projects.map((project) => (
                            <div key={project._id} className="border border-[#2d2d30] bg-[#16161a] rounded-lg p-4 hover:border-emerald-500/40 transition-colors">
                              <p className="text-[#4ec9b0] font-bold text-xs">{project.category}</p>
                              <h4 className="text-white font-bold text-sm mt-1">{project.title}</h4>
                              <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed font-sans">{project.summary}</p>
                              <div className="mt-3 flex flex-wrap gap-1">
                                {project.techStack.map(t => (
                                  <span key={t} className="rounded bg-[#25252b] px-1.5 py-0.5 text-[10px] text-zinc-400 border border-[#303036]">{t}</span>
                                ))}
                              </div>
                              <button onClick={() => setSelectedProject(project)} className="mt-4 flex items-center justify-center gap-1.5 w-full bg-[#202025] hover:bg-[#282830] text-emerald-400 text-xs py-1.5 rounded border border-[#2d2d30] transition-colors">
                                <span>inspect()</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeFileTab === 'Experience.csv' && (
                    <div className="space-y-6">
                      <div className="border border-[#2d2d30] rounded-lg overflow-hidden bg-[#16161a]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#1f1f24] text-zinc-400 border-b border-[#2d2d30] text-xs">
                              <th className="p-3">Role & Org</th>
                              <th className="p-3">Timeline</th>
                              <th className="p-3">Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2d2d30] text-xs">
                            {experiences.map((exp, i) => (
                              <tr key={i} className="hover:bg-[#202025]">
                                <td className="p-3">
                                  <p className="font-bold text-white">{exp.role}</p>
                                  <p className="text-zinc-550 text-[10px]">{exp.organization}</p>
                                </td>
                                <td className="p-3 text-zinc-400">
                                  {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                                </td>
                                <td className="p-3 text-emerald-400 capitalize">{exp.type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="space-y-4">
                        <p className="text-zinc-500 text-xs">// Responsibilities Breakdown</p>
                        {experiences.map((exp, idx) => (
                          <div key={idx} className="bg-[#16161a] p-4 rounded-lg border border-[#2d2d30]">
                            <h4 className="text-sm font-bold text-white">{exp.role} @ {exp.organization}</h4>
                            <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed">{exp.description}</p>
                            {exp.responsibilities && (
                              <ul className="mt-2 list-disc list-inside text-xs text-zinc-400 space-y-1 font-sans pl-2">
                                {exp.responsibilities.map((r, ri) => <li key={ri}>{r}</li>)}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFileTab === 'Skills.ts' && (
                    <div className="space-y-6">
                      <p className="text-zinc-550 text-xs">// TypeScript typings representing skillset</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        {Object.entries(skillsByCategory).map(([category, items]) => (
                          <div key={category} className="border border-[#2d2d30] bg-[#16161a] p-4 rounded-lg">
                            <h4 className="text-[#ce9178] font-bold text-xs uppercase mb-3">// {category}</h4>
                            <div className="space-y-3">
                              {items.map(skill => (
                                <div key={skill.name} className="flex flex-col gap-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-[#9cdcfe]">{skill.name}</span>
                                    <span className="text-emerald-400">{skill.proficiency}%</span>
                                  </div>
                                  <div className="h-1 w-full bg-[#1e1e24] rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${skill.proficiency}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFileTab === 'Certifications.yaml' && (
                    <div className="space-y-6 text-xs">
                      <p className="text-zinc-550 text-xs"># Verified Professional Credentials</p>
                      {certifications.length === 0 ? (
                        <p className="text-[#ce9178] italic">certifications: []</p>
                      ) : (
                        <div className="space-y-4">
                          {certifications.map((cert) => (
                            <div key={cert._id} className="border border-[#2d2d30] bg-[#16161a] p-4 rounded-lg">
                              <p className="text-emerald-400 font-bold font-mono">- certification: &quot;{cert.title}&quot;</p>
                              <p className="text-zinc-400 pl-4 mt-1">issuer: &quot;{cert.issuer}&quot;</p>
                              {cert.credentialUrl && (
                                <p className="pl-4 text-sky-400 underline mt-1">
                                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer">credential_link</a>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeFileTab === 'Contact.js' && (
                    <div className="space-y-6">
                      <p className="text-zinc-550 text-xs">// Submit form request package</p>
                      <div className="border border-[#2d2d30] bg-[#16161a] p-6 rounded-lg max-w-xl mx-auto">
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Name</label>
                            <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)} className="w-full bg-[#1e1e24] border border-[#2d2d30] rounded p-2 text-xs text-white outline-none focus:border-emerald-500" />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Email</label>
                            <input type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full bg-[#1e1e24] border border-[#2d2d30] rounded p-2 text-xs text-white outline-none focus:border-emerald-500" />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Message</label>
                            <textarea required rows={4} value={contactBody} onChange={e => setContactBody(e.target.value)} className="w-full bg-[#1e1e24] border border-[#2d2d30] rounded p-2 text-xs text-white outline-none focus:border-emerald-500 resize-none" />
                          </div>
                          <button type="submit" disabled={contactMutation.isPending} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded transition-all">
                            {contactMutation.isPending ? 'Sending...' : 'Submit Message'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {theme === 'minimal' && (
          <div className="mx-auto max-w-4xl px-6 py-20 space-y-24 text-zinc-900 font-sans selection:bg-zinc-200">
            <header className="space-y-6">
              <h1 className="text-5xl font-light tracking-tight text-zinc-900 leading-tight">
                {ownerName}
              </h1>
              <p className="text-xl text-zinc-550 font-serif italic border-l-2 border-zinc-300 pl-4">
                {headline}
              </p>
              <div className="pt-4 flex gap-6 text-sm text-zinc-500">
                {socialLinks.github && <a href={socialLinks.github} className="hover:text-black hover:underline transition-colors">GitHub</a>}
                {socialLinks.linkedin && <a href={socialLinks.linkedin} className="hover:text-black hover:underline transition-colors">LinkedIn</a>}
                {socialLinks.twitter && <a href={socialLinks.twitter} className="hover:text-black hover:underline transition-colors">Twitter</a>}
                {socialLinks.website && <a href={socialLinks.website} className="hover:text-black hover:underline transition-colors">Website</a>}
              </div>
            </header>

            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">About</h2>
              <p className="text-zinc-650 font-serif leading-relaxed text-lg">
                {bio}
              </p>
            </section>

            <section className="space-y-8">
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Featured Projects</h2>
              <div className="divide-y divide-zinc-200">
                {projects.map((project) => (
                  <article key={project._id} className="py-6 flex flex-col md:flex-row justify-between gap-4 first:pt-0">
                    <div className="max-w-xl">
                      <h3 className="text-lg font-semibold text-zinc-900">{project.title}</h3>
                      <p className="text-sm text-zinc-550 mt-1 capitalize font-mono text-xs">{project.category}</p>
                      <p className="text-sm text-zinc-650 mt-2 leading-relaxed font-serif">{project.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.techStack.map(t => (
                          <span key={t} className="text-xs font-mono text-zinc-550 bg-zinc-100 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-start">
                      <button onClick={() => setSelectedProject(project)} className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1">
                        <span>Read Detail</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Experience</h2>
              <div className="space-y-10">
                {experiences.map((exp, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                      <h3 className="text-base font-semibold text-zinc-900">
                        {exp.role} @ {exp.organization}
                      </h3>
                      <span className="text-xs text-zinc-400 font-mono">
                        {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-650 font-serif leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill.name} className="border border-zinc-200 rounded px-3 py-1 text-xs text-zinc-700 bg-white shadow-sm font-mono">
                    {skill.name} ({skill.proficiency}%)
                  </span>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Certifications</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {certifications.map(cert => (
                  <div key={cert._id} className="border border-zinc-200 bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="text-sm font-semibold text-zinc-900">{cert.title}</h4>
                    <p className="text-xs text-zinc-505 mt-0.5">{cert.issuer}</p>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-black hover:underline mt-2 inline-block">
                        View credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Get In Touch</h2>
              <div className="max-w-md">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Your Name" className="w-full bg-white border border-zinc-250 rounded p-3 text-sm text-zinc-800 outline-none focus:border-zinc-850" />
                  <input type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Your Email" className="w-full bg-white border border-zinc-250 rounded p-3 text-sm text-zinc-800 outline-none focus:border-zinc-850" />
                  <textarea required rows={4} value={contactBody} onChange={e => setContactBody(e.target.value)} placeholder="Your Message" className="w-full bg-white border border-zinc-250 rounded p-3 text-sm text-zinc-800 outline-none focus:border-zinc-850 resize-none" />
                  <button type="submit" disabled={contactMutation.isPending} className="bg-zinc-900 hover:bg-zinc-850 text-white font-semibold px-6 py-2.5 rounded text-sm transition-all">
                    {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        {theme === 'corporate' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-24 text-slate-100 font-sans">
            <section className="rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="grid gap-8 md:grid-cols-3 items-center">
                {portfolio.showProfilePhoto !== false && (
                  <div className="md:col-span-1 flex justify-center">
                    {renderAvatar("h-44 w-44 rounded-full border-4 border-indigo-500/30 shadow-xl bg-slate-800", "text-4xl")}
                  </div>
                )}
                <div className={`${portfolio.showProfilePhoto !== false ? 'md:col-span-2' : 'md:col-span-3'} text-center md:text-left space-y-4`}>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{ownerName}</h1>
                  <p className="text-indigo-400 font-semibold text-base sm:text-lg">{headline}</p>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{bio}</p>
                  
                  <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
                    {socialLinks.github && (
                      <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors text-slate-200">
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors text-white">
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="projects" className="space-y-10">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-extrabold text-white">Case Studies & Portfolios</h2>
                <p className="text-slate-400 text-sm mt-1">Enterprise projects engineered for production deployment.</p>
              </div>

              {projects.length === 0 ? (
                <p className="text-slate-500 text-sm">No projects loaded.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <div key={project._id} className="border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden shadow-lg flex flex-col hover:border-indigo-500/40 transition-colors">
                      <div className="aspect-video bg-slate-800 overflow-hidden relative">
                        <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'} alt={project.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">{project.category}</span>
                        <h4 className="text-white text-lg font-bold mt-1.5">{project.title}</h4>
                        <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed flex-1">{project.summary}</p>
                        <button onClick={() => setSelectedProject(project)} className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 font-semibold py-2 rounded-lg text-xs transition-colors border border-slate-700">
                          Review Case Study
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-10">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-extrabold text-white">Professional History</h2>
                <p className="text-slate-400 text-sm mt-1">Selected career milestones and leadership roles.</p>
              </div>

              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div key={i} className="border border-slate-800 bg-slate-900/40 p-6 rounded-xl relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                      <h4 className="text-lg font-bold text-white">
                        {exp.role} @ <span className="text-indigo-400">{exp.organization}</span>
                      </h4>
                      <span className="text-xs text-slate-500 font-semibold bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
                    {exp.technologiesUsed && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {exp.technologiesUsed.map(t => (
                          <span key={t} className="rounded bg-slate-950 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-850">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Technical Core</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {skills.map(s => (
                    <div key={s.name} className="border border-slate-800 bg-slate-900/40 p-4 rounded-xl">
                      <span className="text-slate-400 text-xs font-bold">{s.name}</span>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-505">
                        <span>Proficiency</span>
                        <span>{s.proficiency}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${s.proficiency}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Certifications & Awards</h3>
                <div className="space-y-4">
                  {certifications.map(c => (
                    <div key={c._id} className="border border-slate-800 bg-slate-900/40 p-4 rounded-xl flex justify-between items-center gap-3">
                      <div>
                        <h4 className="text-white text-sm font-bold">{c.title}</h4>
                        <p className="text-slate-505 text-xs">{c.issuer}</p>
                      </div>
                      {c.credentialUrl && (
                        <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="flex-shrink-0 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                          Verify
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="border-t border-slate-800 pt-16 max-w-xl mx-auto space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Initiate Consultation</h3>
                <p className="text-slate-400 text-xs mt-1">Submit your details to coordinate project discovery calls.</p>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 outline-none focus:border-indigo-500" />
                <input type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Business Email" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 outline-none focus:border-indigo-500" />
                <textarea required rows={4} value={contactBody} onChange={e => setContactBody(e.target.value)} placeholder="Project Scope or Message" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 outline-none focus:border-indigo-500 resize-none" />
                <button type="submit" disabled={contactMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-sm transition-all">
                  Submit Request
                </button>
              </form>
            </section>
          </div>
        )}

        {theme === 'creative' && (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-24 text-purple-100 font-sans">
            <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row items-center gap-8">
              <div className="absolute top-[-10%] left-[-10%] w-[150px] h-[150px] bg-pink-500/30 rounded-full blur-[50px] pointer-events-none" />
              {portfolio.showProfilePhoto !== false && renderAvatar("h-32 w-32 rounded-3xl border-2 border-pink-400 shadow-xl hover:rotate-3 transition-transform", "text-3xl")}
              <div className="space-y-4 flex-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-lg animate-pulse">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Creative Workspace</span>
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{ownerName}</h1>
                <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-extrabold text-base sm:text-lg">{headline}</p>
                <p className="text-purple-200 text-sm leading-relaxed max-w-xl">{bio}</p>
              </div>
            </section>

            <section id="projects" className="space-y-10">
              <h2 className="text-3xl font-extrabold text-white text-center">Selected Artworks & Code</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {projects.map((project) => (
                  <div key={project._id} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.01] hover:border-pink-500/40 transition-all flex flex-col shadow-xl">
                    <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'} alt={project.title} className="aspect-video object-cover" />
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-pink-400 text-xs font-bold">{project.category}</span>
                        <h4 className="text-white text-xl font-bold mt-1">{project.title}</h4>
                        <p className="text-purple-200 text-xs mt-2 leading-relaxed">{project.summary}</p>
                      </div>
                      <button onClick={() => setSelectedProject(project)} className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-450 hover:to-purple-550 transition-all shadow-md">
                        Explore Case Study
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-10">
              <h2 className="text-3xl font-extrabold text-white text-center">Journey & History</h2>
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div key={i} className="backdrop-blur-lg bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h4 className="text-lg font-bold text-white">
                        {exp.role} @ <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">{exp.organization}</span>
                      </h4>
                      <span className="text-xs text-purple-300 font-mono">
                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                      </span>
                    </div>
                    <p className="text-sm text-purple-200 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-extrabold text-white text-center">Skill Spheres</h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {skills.map(s => (
                  <div key={s.name} className="backdrop-blur-md bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                    <span className="text-white text-sm font-bold">{s.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/20">{s.proficiency}% Proficiency</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl max-w-xl mx-auto space-y-6">
              <h3 className="text-2xl font-extrabold text-white text-center">Spark a Conversation</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-pink-500" />
                <input type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-pink-500" />
                <textarea required rows={4} value={contactBody} onChange={e => setContactBody(e.target.value)} placeholder="Tell me something exciting..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-pink-500 resize-none" />
                <button type="submit" disabled={contactMutation.isPending} className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 transition-all shadow-lg">
                  Submit Request
                </button>
              </form>
            </section>
          </div>
        )}
      </main>

      {/* Case Study Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative text-zinc-100 font-sans">
            
            <div className="relative aspect-video w-full bg-zinc-950">
              <img src={selectedProject.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} alt={selectedProject.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-zinc-400 hover:text-white transition-colors border border-zinc-800">
                <span className="font-mono text-xs px-1">✕</span>
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <span className="text-teal-400 text-xs font-mono border border-teal-500/20 bg-teal-950/20 rounded-md px-2 py-0.5">{selectedProject.category}</span>
                <h2 className="text-2xl font-extrabold text-white mt-2">{selectedProject.title}</h2>
                <p className="text-sm text-zinc-405 mt-2 font-mono flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{selectedProject.viewCount || 0} times analyzed</span>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">// Summary</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">{selectedProject.summary}</p>
              </div>

              {selectedProject.description && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">// Detailed Description</h4>
                  <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">{selectedProject.description}</div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">// Tech Stack Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map(tech => (
                    <span key={tech} className="rounded bg-zinc-800 px-3 py-1 text-xs font-mono text-zinc-300 border border-zinc-700">{tech}</span>
                  ))}
                </div>
              </div>

              {selectedProject.links && (Object.values(selectedProject.links).some(Boolean)) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">// Deployment Coordinates</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.links.github && (
                      <a href={selectedProject.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-teal-400 hover:underline">
                        <Github className="h-4 w-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {selectedProject.links.liveDemo && (
                      <a href={selectedProject.links.liveDemo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-teal-400 hover:underline">
                        <Globe className="h-4 w-4" />
                        <span>Production URL</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chat Assistant Widget */}
      <AIChatWidget username={username} displayName={ownerName} />

      <Footer />
    </div>
  );
}

// Minimal ArrowLeftIcon component inline to avoid missing imports
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}
