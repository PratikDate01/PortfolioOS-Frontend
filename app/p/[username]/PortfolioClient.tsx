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
import { ThemeProvider, useTheme } from '@/components/theme/ThemeProvider';
import DeveloperProLayout from '@/components/theme/layouts/DeveloperProLayout';
import ExecutiveLayout from '@/components/theme/layouts/ExecutiveLayout';
import CreativeLayout from '@/components/theme/layouts/CreativeLayout';
import TerminalLayout from '@/components/theme/layouts/TerminalLayout';
import { motion } from 'framer-motion';
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
    <ThemeProvider portfolio={portfolio}>
      <PortfolioClientContent
        username={username}
        portfolio={portfolio}
        projects={projects}
        experiences={experiences}
        skills={skills}
        certifications={certifications}
        resumes={resumes}
        blogPosts={blogPosts}
        testimonials={testimonials}
        visitorCount={visitorCount}
        sessionId={sessionId}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        activeFilterCategory={activeFilterCategory}
        setActiveFilterCategory={setActiveFilterCategory}
        contactName={contactName}
        setContactName={setContactName}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        contactSubject={contactSubject}
        setContactSubject={setContactSubject}
        contactBody={contactBody}
        setContactBody={setContactBody}
        contactSuccess={contactSuccess}
        copiedSuccess={copiedSuccess}
        handleContactSubmit={handleContactSubmit}
        handleCopyLink={handleCopyLink}
        handleQuickAction={handleQuickAction}
        renderAvatar={renderAvatar}
        socialLinks={socialLinks}
        displayYearsOfExp={displayYearsOfExp}
        scores={scores}
        filteredProjects={filteredProjects}
        projectCategories={projectCategories}
        skillsByCategory={skillsByCategory}
        getCategoryIcon={getCategoryIcon}
        activeResume={activeResume}
      />
    </ThemeProvider>
  );
}

function PortfolioClientContent(props: any) {
  const { theme } = useTheme();

  if (theme === 'executive') {
    return <ExecutiveLayout {...props} />;
  }
  if (theme === 'creative') {
    return <CreativeLayout {...props} />;
  }
  if (theme === 'terminal') {
    return <TerminalLayout {...props} />;
  }
  return <DeveloperProLayout {...props} />;
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
