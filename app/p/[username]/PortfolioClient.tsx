'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { API_BASE_URL } from '@/lib/config';
import Footer from '@/components/layout/Footer';
import TechGalaxy from '@/components/sections/TechGalaxy';
import Tilt3DCard from '@/components/sections/Tilt3DCard';
import Globe3DCanvas from '@/components/sections/Globe3DCanvas';
import { motion } from 'framer-motion';
import GitHubStats from '@/components/sections/GitHubStats';
import AIChatWidget from '@/components/features/AIChatWidget';
import { Project, Experience, Skill, Certification, Portfolio, BlogPost, Resume, Testimonial } from '@/types';
import {
  Terminal, Cpu, Database, Cloud, Brain, CheckCircle2, Eye, Award, FileText, Code, ChevronRight, Link2, Mail, Github, Linkedin, Twitter, Globe, ShieldAlert, Loader2, Calendar, User as UserIcon, Briefcase, Sparkles, MapPin, ExternalLink, BookOpen
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

  // Sort projects: Featured projects first, then by order
  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.order || 0) - (b.order || 0);
    });
  }, [projects]);

  // Project categories and filtering
  const projectCategories = React.useMemo(() => {
    return ['all', ...Array.from(new Set(sortedProjects.map(p => p.category).filter(Boolean)))];
  }, [sortedProjects]);

  const filteredProjects = activeFilterCategory === 'all'
    ? sortedProjects
    : sortedProjects.filter(p => p.category?.toLowerCase() === activeFilterCategory.toLowerCase());

  const handleQuickAction = (actionType: 'interview' | 'resume' | 'opportunity') => {
    if (actionType === 'interview') {
      setContactSubject('Interview Request — ' + ownerName);
      setContactBody(`Hi ${ownerName},\n\nWe came across your portfolio and are highly impressed with your background. We would love to schedule a brief introductory call / interview to discuss potential opportunities at [Company Name].\n\nPlease let us know your availability.\n\nBest regards,\n[Your Name]`);
    } else if (actionType === 'resume') {
      if (activeResume) {
        const downloadUrl = `${API_BASE_URL}/resume/${activeResume._id}/download`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = activeResume.fileName || 'resume.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setContactSubject('Resume Inquiry — ' + ownerName);
      setContactBody(`Hi ${ownerName},\n\nI have requested and downloaded your resume. I would love to connect and discuss how your skills align with our upcoming engineering needs.\n\nBest regards,\n[Your Name]`);
    } else if (actionType === 'opportunity') {
      setContactSubject('Job Opportunity — [Role Name]');
      setContactBody(`Hi ${ownerName},\n\nWe are currently hiring for a [Role Name] at [Company Name] and think your profile would be a fantastic fit.\n\nHere are some brief details about the role:\n- Team: \n- Stack: \n- Location: \n\nLet us know if you are open to discussing this.\n\nBest regards,\n[Your Name]`);
    }
    
    // Scroll to form
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const nameInput = document.getElementById('contact-name');
        if (nameInput) {
          nameInput.focus();
        }
      }, 500);
    }
  };

  // Animation config
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const AnimatedSection = ({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) => (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={fadeInVariants}
      className={className}
    >
      {children}
    </motion.section>
  );

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 relative overflow-x-hidden bg-[#0b0c10] text-zinc-200 font-sans selection:bg-teal-500/25">
      
            {/* Dynamic Theme Banner / Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[700px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header and Brand */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors bg-[#0b0c10]/80 border-zinc-900 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold rounded-lg px-2.5 py-1 bg-teal-950/40 text-teal-400 border border-teal-500/20">
                {username.toUpperCase()}
              </span>
              <span className="hidden md:inline text-xs font-mono opacity-60">/ portfolio-os</span>
            </div>
            
            <div className="flex items-center gap-4">
              {visitorCount !== null && (
                <div className="flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-mono border-zinc-800/60 bg-zinc-900/40 text-teal-400 border-teal-500/10">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{visitorCount.toLocaleString()} views</span>
                </div>
              )}

              <button
                onClick={handleCopyLink}
                className="rounded-lg p-2 text-xs font-mono border transition-all flex items-center gap-1.5 border-zinc-800 bg-zinc-900/40 hover:bg-zinc-850 text-zinc-300 hover:text-teal-400 hover:border-teal-500/20"
              >
                {copiedSuccess ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Link2 className="h-3.5 w-3.5" />}
                <span>{copiedSuccess ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-24 text-zinc-200">
            {/* System Status Banner */}
            <motion.div variants={fadeInVariants} className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-4 text-xs space-y-2 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px] font-mono">Profile Verified</span>
                </div>
                <span className="text-[10px] text-zinc-550 font-mono">WORKSPACE SECURED</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 text-zinc-400 font-mono">
                <p>Status: <span className="text-teal-400 font-bold">Active</span></p>
                <p>Platform: <span className="text-teal-400">Portfolio OS</span></p>
                <p>Session ID: <span className="text-teal-500">{sessionId ? sessionId.substring(0, 8).toUpperCase() : 'GUEST-ACCESS'}</span></p>
              </div>
            </motion.div>

            {/* Widescreen Banner Cover & Profile Header */}
            <motion.div variants={fadeInVariants} className="relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900/25 shadow-xl">
              <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-zinc-900/80 via-black to-zinc-950 border-b border-zinc-800">
                {coverImageUrl ? (
                  <img src={coverImageUrl} alt="Profile Cover" className="w-full h-full object-cover opacity-40" />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent" />
              </div>
              
              <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left z-10">
                  {portfolio.showProfilePhoto !== false && (
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-[#0b0c10] bg-zinc-900 shadow-2xl flex-shrink-0">
                      {renderAvatar("w-full h-full object-cover border border-zinc-800", "text-2xl")}
                    </div>
                  )}
                  <div className="md:pb-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                      <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">{ownerName}</h1>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[9px] font-semibold text-teal-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                        <span>{availabilityStatus}</span>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm font-semibold">{headline}</p>
                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-zinc-500 mt-2">
                      <MapPin className="h-3.5 w-3.5 text-teal-400" />
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
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-950/60 text-teal-400 border border-teal-500/30 hover:bg-teal-900 hover:text-teal-300 font-bold px-4 py-2.5 text-xs transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Download Resume</span>
                    </a>
                  )}
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-black/60 hover:bg-zinc-900 text-zinc-200 hover:text-teal-400 font-semibold px-4 py-2.5 text-xs transition-all duration-300"
                  >
                    <Mail className="h-4 w-4 text-zinc-405" />
                    <span>Get in Touch</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Profile Bio Section */}
            <motion.section variants={fadeInVariants} className="relative pt-4">
              <div className="border border-zinc-800/80 bg-zinc-900/25 rounded-xl p-6">
                <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-3 mb-4">
                  <UserIcon className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">About Me</span>
                </div>
                <div className="grid gap-8 md:grid-cols-3 items-center">
                  <div className="md:col-span-2 max-w-4xl">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {bio}
                    </p>
                    <div className="mt-6 flex gap-3">
                      {socialLinks.github && (
                        <a href={socialLinks.github} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-800/20 p-2 text-zinc-300 hover:bg-zinc-850 hover:text-teal-400 hover:border-teal-500/20 transition-all">
                          <Github className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-800/20 p-2 text-zinc-300 hover:bg-zinc-850 hover:text-teal-400 hover:border-teal-500/20 transition-all">
                          <Linkedin className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-800/20 p-2 text-zinc-300 hover:bg-zinc-850 hover:text-teal-400 hover:border-teal-500/20 transition-all">
                          <Twitter className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.website && (
                        <a href={socialLinks.website} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-800/20 p-2 text-zinc-300 hover:bg-zinc-850 hover:text-teal-400 hover:border-teal-500/20 transition-all">
                          <Globe className="h-4.5 w-4.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-1 hidden md:block h-64 border border-zinc-800/80 rounded-xl bg-zinc-900/20 relative overflow-hidden">
                    <Globe3DCanvas color="#14b8a6" glowColor="rgba(20, 184, 166, 0.04)" />
                  </div>
                </div>
              </div>
            </motion.section>
            <motion.section variants={fadeInVariants} className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                <Briefcase className="h-4 w-4 text-teal-400" />
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Candidate Snapshot</span>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <Tilt3DCard glowColor="teal" className={`${skills.length > 0 ? 'md:col-span-2' : 'col-span-3'} rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-5 flex flex-col justify-between`}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-zinc-800/25 rounded-lg border border-zinc-800/30 text-center">
                      <span className="block text-2xl font-extrabold text-white">{displayYearsOfExp}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Years Exp</span>
                    </div>
                    <div className="p-3 bg-zinc-800/25 rounded-lg border border-zinc-800/30 text-center">
                      <span className="block text-2xl font-extrabold text-teal-400">{projects.length}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Projects</span>
                    </div>
                    <div className="p-3 bg-zinc-800/25 rounded-lg border border-zinc-800/30 text-center">
                      <span className="block text-2xl font-extrabold text-white">{skills.length}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Skills</span>
                    </div>
                    <div className="p-3 bg-zinc-800/25 rounded-lg border border-zinc-800/30 text-center">
                      <span className="block text-2xl font-extrabold text-white">{certifications.length}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Certs</span>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/40 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-semibold">GitHub Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        githubUser ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-zinc-900 text-zinc-550 border border-zinc-800'
                      }`}>
                        {githubUser ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-semibold">Availability:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-450 truncate max-w-full">
                        {availabilityStatus}
                      </span>
                    </div>
                  </div>
                </Tilt3DCard>

                {skills.length > 0 && (
                  <Tilt3DCard glowColor="emerald" className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-3">// Top Stack</span>
                      <div className="flex flex-wrap gap-2">
                        {skills
                          .slice()
                          .sort((a, b) => b.proficiency - a.proficiency)
                          .slice(0, 4)
                          .map((s) => (
                            <span key={s.name} className="px-2 py-0.5 rounded bg-teal-950/30 border border-teal-900/30 text-xs text-teal-400">
                              {s.name}
                            </span>
                          ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed mt-4">Top technologies sorted by verified proficiency level.</p>
                  </Tilt3DCard>
                )}
              </div>
            </motion.section>

            {/* Recruiter Intelligence Dashboard */}
            <motion.section variants={fadeInVariants} className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                <Cpu className="h-4 w-4 text-teal-400" />
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Recruiter Intelligence Dashboard</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Tilt3DCard glowColor="teal" className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Portfolio Score</span>
                    <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-extrabold text-white">{scores.portfolioScore}</span>
                    <span className="text-xs text-zinc-500">/ 100</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400" style={{ width: `${scores.portfolioScore}%` }} />
                  </div>
                  <p className="text-[9px] text-zinc-500">Profile completeness index score.</p>
                </Tilt3DCard>

                <Tilt3DCard glowColor="emerald" className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Recruiter Readiness</span>
                    <Sparkles className="h-4 w-4 text-teal-400" />
                  </div>
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-950/30 text-teal-400 border border-teal-500/20">
                      {scores.readinessScore}
                    </span>
                  </div>
                  <p className="text-[9px] text-zinc-500">Formatting and navigation evaluation.</p>
                </Tilt3DCard>

                <Tilt3DCard glowColor="pink" className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">ATS Match Capability</span>
                    <FileText className="h-4 w-4 text-pink-400" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-extrabold text-white">{scores.atsScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-yellow-400" style={{ width: `${scores.atsScore}%` }} />
                  </div>
                  <p className="text-[9px] text-zinc-500">Resume parsed match index capability.</p>
                </Tilt3DCard>

                <Tilt3DCard glowColor="zinc" className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">GitHub Sync Health</span>
                    <Github className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-800/30 text-teal-400 border border-zinc-700">
                      {scores.githubHealth}
                    </span>
                  </div>
                  <p className="text-[9px] text-zinc-500">Live code distribution API health status.</p>
                </Tilt3DCard>
              </div>
            </motion.section>

            {githubUser && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                  <Github className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">GitHub Integration Metrics</span>
                </div>
                <GitHubStats username={githubUser} />
              </AnimatedSection>
            )}

            {/* Featured Projects Showcase */}
            {projects.length > 0 && (
              <AnimatedSection id="projects" className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                  <Code className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Featured Projects Showcase</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {projectCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilterCategory(cat)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs border transition-all ${
                        activeFilterCategory === cat
                          ? 'bg-teal-950 text-teal-400 border-teal-500/50 font-bold'
                          : 'bg-zinc-900/50 text-zinc-400 border-zinc-805/40 hover:text-teal-400 hover:border-zinc-800'
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12 border border-zinc-800 rounded-xl bg-zinc-900/20">
                    <p className="text-sm text-zinc-500">No matching projects found.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                      <Tilt3DCard key={project._id} glowColor="teal" className="rounded-xl overflow-hidden h-full flex">
                        <article className="flex-1 flex flex-col overflow-hidden border border-zinc-800 bg-zinc-900/25 hover:border-teal-500/30 transition-all duration-300 group relative">
                          <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
                            <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} alt={project.title} className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 rounded-md bg-black/85 px-2 py-0.5 text-[9px] text-teal-400 border border-teal-500/20">
                              {project.category}
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">{project.title}</h3>
                            <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed flex-1">{project.summary}</p>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {project.techStack.slice(0, 4).map((tech) => (
                                <span key={tech} className="rounded bg-teal-950/20 px-2 py-0.5 text-[10px] text-teal-400 border border-teal-900/30">{tech}</span>
                              ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                              <button onClick={() => setSelectedProject(project)} className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg border border-zinc-800 bg-zinc-800/20 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800/40 transition-all">
                                <span>Review Case Study</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      </Tilt3DCard>
                    ))}
                  </div>
                )}
              </AnimatedSection>
            )}

            {/* Technical Skills breakdown */}
            {skills.length > 0 && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                  <Cpu className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Technical Skills Breakdown</span>
                </div>
                <div className="grid gap-12 lg:grid-cols-5 items-start">
                  <div className="lg:col-span-2">
                    <div className="p-4 border border-zinc-800 bg-zinc-900/25 rounded-xl">
                      <p className="text-[10px] uppercase text-zinc-550 font-bold mb-3">// 3D Galaxy Visualization</p>
                      <TechGalaxy />
                    </div>
                  </div>
                  <div className={`lg:col-span-3 grid gap-6 ${Object.keys(skillsByCategory).length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
                    {Object.entries(skillsByCategory).map(([category, items]) => (
                      <div key={category} className="rounded-xl border border-zinc-800 bg-zinc-900/25 p-5">
                        <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-3 mb-4">
                          {getCategoryIcon(category)}
                          <h3 className="text-xs font-bold text-teal-400 capitalize">{category}</h3>
                        </div>
                        <div className="space-y-4">
                          {items.map((skill) => (
                            <div key={skill.name}>
                              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                                <span>{skill.name}</span>
                                <span className="text-teal-400">{skill.proficiency}%</span>
                              </div>
                              <div className="h-1 w-full rounded-full bg-zinc-950 border border-zinc-850 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-400" style={{ width: `${skill.proficiency}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Experience Timeline */}
            {experiences.filter(exp => exp.type === 'job' || exp.type === 'internship').length > 0 && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                  <Briefcase className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Work History Timeline</span>
                </div>
                <div className="relative border-l border-zinc-800/60 ml-4 space-y-12">
                  {experiences
                    .filter(exp => exp.type === 'job' || exp.type === 'internship')
                    .map((exp, idx) => (
                      <div key={idx} className="relative pl-8 group">
                        <div className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-between rounded-full border border-teal-500 bg-[#0b0c10] group-hover:scale-125 transition-transform duration-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 mx-auto" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                            {exp.role} @ <span className="text-teal-400">{exp.organization}</span>
                          </h3>
                          <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} — {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                          </span>
                        </div>
                        <p className="text-[10px] text-teal-500 uppercase tracking-widest font-semibold">{exp.type}</p>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-3">{exp.description}</p>
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-zinc-500 space-y-1 pl-2 mb-3">
                            {exp.responsibilities.map((r, ri) => (
                              <li key={ri} className="leading-relaxed">{r}</li>
                            ))}
                          </ul>
                        )}
                        {exp.technologiesUsed && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.technologiesUsed.map(t => (
                              <span key={t} className="rounded bg-teal-950/20 px-2 py-0.5 text-[9px] text-teal-400/80 border border-teal-900/30">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </AnimatedSection>
            )}

            {/* Education and credentials */}
            {(educationExperiences.length > 0 || certifications.length > 0) && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                  <BookOpen className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Education & Credentials</span>
                </div>
                <div className={`grid gap-6 ${educationExperiences.length > 0 && certifications.length > 0 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {educationExperiences.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">// Education Credentials</h3>
                      {educationExperiences.map((edu, idx) => (
                        <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-900/25 p-5 relative overflow-hidden">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div>
                              <h4 className="text-xs font-bold text-white">{edu.role}</h4>
                              <p className="text-[10px] text-teal-400 mt-0.5">{edu.organization}</p>
                            </div>
                            <span className="text-[10px] text-zinc-500 flex items-center gap-1 shrink-0">
                              <Calendar className="h-3.5 w-3.5 text-zinc-650" />
                              {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {certifications.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">// Certifications</h3>
                      <div className="space-y-4">
                        {certifications.slice(0, 3).map((cert) => (
                          <div key={cert._id} className="rounded-xl border border-zinc-800 bg-zinc-900/25 p-4 flex justify-between items-center gap-3 hover:border-teal-500/20 transition-all duration-300">
                            <div>
                              <h4 className="text-xs font-bold text-white leading-snug">{cert.title}</h4>
                              <p className="text-[10px] text-zinc-500">{cert.issuer}</p>
                            </div>
                            {cert.credentialUrl && (
                              <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="flex-shrink-0 text-[10px] bg-teal-950/40 text-teal-400 border border-teal-500/20 px-2 py-1 rounded">Verify</a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                  <Sparkles className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Recommendations & Endorsements</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="rounded-xl border border-zinc-800 bg-zinc-900/25 p-6 flex flex-col justify-between">
                      <p className="text-xs text-zinc-300 italic leading-relaxed">&ldquo;{testimonial.body}&rdquo;</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-teal-950/30 border border-teal-900 flex items-center justify-center text-xs font-bold text-teal-400">
                          {testimonial.authorName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-white">{testimonial.authorName}</h4>
                          <p className="text-[9px] text-teal-400/80">{testimonial.authorRole} {testimonial.authorCompany ? `@ ${testimonial.authorCompany}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Resume Center */}
            {activeResume && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                  <FileText className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Professional Resume</span>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/25 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2.5">
                      <div className="h-10 w-10 rounded-lg bg-teal-950/40 text-teal-400 flex items-center justify-center border border-teal-500/20">
                        <FileText className="h-5.5 w-5.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{activeResume.label || 'Standard Professional Resume'}</h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5">PDF • Updated: {activeResume.updatedAt ? new Date(activeResume.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Recently'}</p>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                      <a
                        href={`${API_BASE_URL}/resume/${activeResume._id}/download`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-955 hover:bg-teal-900 border border-teal-500/30 text-teal-400 font-bold px-4 py-2.5 text-xs transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Download Active Resume</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-sm aspect-[4/3] rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between hover:border-teal-500/20 transition-colors">
                    <div className="border-b border-zinc-800 pb-3 flex items-center justify-between text-[9px] text-zinc-550 uppercase tracking-wider font-bold">
                      <span>Document Preview</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                      <FileText className="h-10 w-10 text-zinc-800 mb-2 animate-bounce" />
                      <p className="text-xs text-teal-400 font-bold">{activeResume.resumeFile?.format?.toUpperCase() || 'PDF'} Document File</p>
                      <p className="text-[9px] text-zinc-500 mt-1">{(activeResume.resumeFile?.bytes ? (activeResume.resumeFile.bytes / 1024).toFixed(1) : '150')} KB • Public Link Verified</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Contact Coordinates & Form */}
            <AnimatedSection id="contact" className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-800/60 pb-2">
                <Mail className="h-4 w-4 text-teal-400" />
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Get In Touch</span>
              </div>
              <div className="grid gap-12 lg:grid-cols-5 items-start">
                {((socialLinks.github || socialLinks.linkedin || socialLinks.twitter || socialLinks.website) || activeResume) ? (
                  <>
                    <div className="lg:col-span-2 space-y-6">
                      {(socialLinks.github || socialLinks.linkedin || socialLinks.twitter || socialLinks.website) && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/25 p-5 space-y-4">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold border-b border-zinc-800 pb-2">// Contact Coordinates</p>
                          {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-400 hover:text-teal-400 transition-colors"><Github className="h-4.5 w-4.5 text-teal-500" /><span className="truncate">{socialLinks.github}</span></a>}
                          {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-400 hover:text-teal-400 transition-colors"><Linkedin className="h-4.5 w-4.5 text-teal-500" /><span className="truncate">{socialLinks.linkedin}</span></a>}
                          {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-400 hover:text-teal-400 transition-colors"><Twitter className="h-4.5 w-4.5 text-teal-500" /><span className="truncate">{socialLinks.twitter}</span></a>}
                          {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-400 hover:text-teal-400 transition-colors"><Globe className="h-4.5 w-4.5 text-teal-500" /><span className="truncate">{socialLinks.website}</span></a>}
                        </div>
                      )}

                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/25 p-5 space-y-4">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold border-b border-zinc-800 pb-2">// Recruiter Actions</p>
                        <div className="grid gap-2">
                          <button type="button" onClick={() => handleQuickAction('interview')} className="w-full flex items-center justify-between gap-2 rounded-lg bg-teal-950/30 hover:bg-teal-900/40 border border-teal-500/25 px-3 py-2 text-left text-xs font-semibold text-teal-400 transition-all">
                            <span>Schedule Interview</span> <Calendar className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleQuickAction('resume')} className="w-full flex items-center justify-between gap-2 rounded-lg bg-teal-950/30 hover:bg-teal-900/40 border border-teal-500/25 px-3 py-2 text-left text-xs font-semibold text-teal-400 transition-all">
                            <span>Request Resume</span> <FileText className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 rounded-xl border border-zinc-800 bg-zinc-900/25 p-6 w-full">
                      <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Your Name</label>
                            <input id="contact-name" type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Hiring Manager" className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Your Email</label>
                            <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Subject</label>
                          <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} placeholder="Inquiry or Job Opportunity" className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Message</label>
                          <textarea required rows={4} value={contactBody} onChange={(e) => setContactBody(e.target.value)} placeholder="Scope description or role requirements..." className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors resize-none" />
                        </div>
                        <button type="submit" disabled={contactMutation.isPending} className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-955 font-bold py-3 rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                          {contactMutation.isPending ? 'Sending...' : 'Submit Message Request'}
                        </button>
                        {contactSuccess && <p className="text-[10px] text-emerald-450 text-center mt-2">✓ Message submitted successfully.</p>}
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="col-span-5 rounded-xl border border-zinc-800 bg-zinc-900/25 p-6 max-w-2xl mx-auto w-full">
                    <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Your Name</label>
                          <input id="contact-name" type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Hiring Manager" className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Your Email</label>
                          <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Subject</label>
                        <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} placeholder="Inquiry or Job Opportunity" className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Message</label>
                        <textarea required rows={4} value={contactBody} onChange={(e) => setContactBody(e.target.value)} placeholder="Scope description or role requirements..." className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors resize-none" />
                      </div>
                      <button type="submit" disabled={contactMutation.isPending} className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-955 font-bold py-3 rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                        {contactMutation.isPending ? 'Sending...' : 'Submit Message Request'}
                      </button>
                      {contactSuccess && <p className="text-[10px] text-emerald-450 text-center mt-2">✓ Message submitted successfully.</p>}
                    </form>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </motion.div>
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
