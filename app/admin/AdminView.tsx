'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import OverviewTab from './components/OverviewTab';
import { 
  Project, BlogPost, Certification, Testimonial, Message, 
  Experience, Skill, ProjectGalleryItem, CloudinaryAsset, 
  Resume, UploadRecord 
} from '@/types';
import { 
  Terminal, ShieldCheck, LayoutGrid, FileText, Award, Inbox, 
  Trash2, Edit, Plus, Check, X, Loader2, BarChart3, Eye, Users,
  RefreshCw, PlusCircle, Copy, ExternalLink, Film,
  FolderOpen, Search
} from 'lucide-react';
import CloudinaryUploadZone from '@/components/features/CloudinaryUploadZone';
import Link from 'next/link';

// Fallback Stats
const defaultStats = {
  projects: { total: 3 },
  blog: { total: 3, published: 2, draft: 1, totalViews: 439, totalLikes: 131 },
  certifications: { total: 3 },
  messages: { total: 1, unread: 1, read: 0, replied: 0, archived: 0 },
  testimonials: { total: 3, pending: 1, approved: 2, rejected: 0 }
};

interface PageViewPath {
  _id: string;
  count: number;
}

interface RecentEvent {
  createdAt?: string;
  type: string;
  path: string;
  userId?: {
    name?: string;
    email?: string;
  };
}

interface AnalyticsData {
  totalVisitors: number;
  activeVisitors: number;
  uniqueIPsThisSession: number;
  pageViewsByPath: PageViewPath[];
  recentEvents: RecentEvent[];
}

// Helper to format bytes to human-readable size
const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function AdminView() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'stats' | 'projects' | 'blog' | 'certs' | 'testimonials' | 'messages' | 'analytics' | 'experiences' | 'skills' | 'media' | 'resumes'>('stats');
  
  // XP Overlay state
  const [xpReward, setXpReward] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');

  // Form states & Modals
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'project' | 'blog' | 'cert' | 'testimonial' | 'experience' | 'skill' | 'resume' | null>(null);
  const [formTab, setFormTab] = useState<'general' | 'links' | 'gallery' | 'caseStudy' | 'metrics'>('general');
  
  // Project Form
  const [projectForm, setProjectForm] = useState({
    title: '', slug: '', summary: '', description: '', coverImageUrl: '', category: '',
    techStack: '', tags: '', status: 'draft' as 'draft' | 'published' | 'archived',
    featured: false, order: 0,
    githubLink: '', liveDemoLink: '', docsLink: '',
    gallery: [] as ProjectGalleryItem[],
    thumbnail: null as CloudinaryAsset | null,
    demoVideo: null as CloudinaryAsset | null,
    architectureDiagram: null as CloudinaryAsset | null,
    caseStudy: {
      problem: '', research: '', architecture: '', challenges: '', solutions: '', results: '', lessonsLearned: ''
    },
    metrics: [] as { label: string; value: string }[]
  });

  // Blog Form
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', excerpt: '', contentMarkdown: '', coverImageUrl: '',
    coverImage: null as CloudinaryAsset | null,
    categories: '', tags: '', status: 'draft' as 'draft' | 'published'
  });

  // Cert Form
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', issueDate: '', expiryDate: '',
    credentialUrl: '', imageUrl: '', 
    certificateImage: null as CloudinaryAsset | null,
    certificatePdf: null as CloudinaryAsset | null,
    skills: '', category: ''
  });

  // Resume Form
  const [resumeForm, setResumeForm] = useState({
    label: '',
    resumeFile: null as CloudinaryAsset | null,
    isActive: false
  });

  // Testimonial Form
  const [testimonialForm, setTestimonialForm] = useState({
    authorName: '', authorRole: '', authorCompany: '', authorAvatarUrl: '',
    rating: 5, body: '', videoUrl: '', relatedProjectId: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });

  // Experience Form
  const [experienceForm, setExperienceForm] = useState({
    organization: '', role: '', type: 'job' as 'job' | 'internship' | 'education' | 'achievement',
    startDate: '', endDate: '', description: '', responsibilities: '', technologiesUsed: '', order: 0
  });

  // Skill Form
  const [skillForm, setSkillForm] = useState({
    name: '', category: 'frontend' as 'frontend' | 'backend' | 'database' | 'devops' | 'cloud' | 'ai' | 'other',
    proficiency: 80, yearsExperience: 1, iconUrl: ''
  });

  // Media filters
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaType, setMediaType] = useState('');

  // Trigger XP Toast
  const triggerXp = (msg: string) => {
    setRewardMsg(msg);
    setXpReward(true);
    setTimeout(() => setXpReward(false), 3000);
  };

  // Queries (Polling stats, messages, and analytics queries every 10 seconds for real-time monitoring)
  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await apiFetch('/admin/stats');
      return res.data || defaultStats;
    },
    refetchInterval: 10000,
    retry: false
  });

  const { data: projectsData } = useQuery<Project[]>({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await apiFetch<Project[]>('/projects');
      return res.data || [];
    },
    retry: false
  });

  const { data: blogData } = useQuery<BlogPost[]>({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const res = await apiFetch<BlogPost[]>('/blog?status=all');
      return res.data || [];
    },
    retry: false
  });

  const { data: certsData } = useQuery<Certification[]>({
    queryKey: ['admin-certs'],
    queryFn: async () => {
      const res = await apiFetch<Certification[]>('/certifications');
      return res.data || [];
    },
    retry: false
  });

  const { data: testimonialsData } = useQuery<Testimonial[]>({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const res = await apiFetch<Testimonial[]>('/testimonials?status=all');
      return res.data || [];
    },
    retry: false
  });

  const { data: messagesData } = useQuery<Message[]>({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const res = await apiFetch<Message[]>('/messages');
      return res.data || [];
    },
    refetchInterval: 10000,
    retry: false
  });

  const { data: analyticsData } = useQuery<AnalyticsData>({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await apiFetch<AnalyticsData>('/admin/analytics');
      return res.data || { totalVisitors: 0, activeVisitors: 0, uniqueIPsThisSession: 0, pageViewsByPath: [], recentEvents: [] };
    },
    enabled: activeTab === 'analytics',
    refetchInterval: 10000,
    retry: false
  });

  const { data: experiencesData } = useQuery<Experience[]>({
    queryKey: ['admin-experiences'],
    queryFn: async () => {
      const res = await apiFetch<Experience[]>('/experience');
      return res.data || [];
    },
    retry: false
  });

  const { data: skillsData } = useQuery<Skill[]>({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const res = await apiFetch<Skill[]>('/skills');
      return res.data || [];
    },
    retry: false
  });

  const { data: mediaData } = useQuery<UploadRecord[]>({
    queryKey: ['admin-media', mediaType, mediaSearch],
    queryFn: async () => {
      let endpoint = '/upload';
      const params: string[] = [];
      if (mediaType) params.push(`resourceType=${mediaType}`);
      if (mediaSearch) params.push(`search=${encodeURIComponent(mediaSearch)}`);
      if (params.length) endpoint += `?${params.join('&')}`;
      
      const res = await apiFetch<UploadRecord[]>(endpoint);
      return res.data || [];
    },
    retry: false
  });

  const { data: resumesData } = useQuery<Resume[]>({
    queryKey: ['admin-resumes'],
    queryFn: async () => {
      const res = await apiFetch<Resume[]>('/resume');
      return res.data || [];
    },
    retry: false
  });

  // Mutations
  const projectMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const endpoint = editingId ? `/projects/${editingId}` : '/projects';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(data)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setModalType(null);
      setEditingId(null);
      triggerXp(editingId ? 'Level Up: +100 XP Earned! (Updated Project)' : 'Level Up: +150 XP Earned! (Added Project)');
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/projects/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      triggerXp('+50 XP Earned! (Deleted Project)');
    }
  });

  const blogMutation = useMutation({
    mutationFn: async (data: Partial<BlogPost>) => {
      const endpoint = editingId ? `/blog/${editingId}` : '/blog';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(data)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setModalType(null);
      setEditingId(null);
      triggerXp(editingId ? 'Level Up: +100 XP Earned! (Updated Post)' : 'Level Up: +150 XP Earned! (Added Post)');
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/blog/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      triggerXp('+50 XP Earned! (Deleted Post)');
    }
  });

  const certMutation = useMutation({
    mutationFn: async (data: Partial<Certification>) => {
      const endpoint = editingId ? `/certifications/${editingId}` : '/certifications';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(data)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setModalType(null);
      setEditingId(null);
      triggerXp(editingId ? 'Level Up: +100 XP Earned! (Updated Certification)' : 'Level Up: +150 XP Earned! (Added Certification)');
    }
  });

  const deleteCertMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/certifications/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      triggerXp('+50 XP Earned! (Deleted Certification)');
    }
  });

  const testimonialMutation = useMutation({
    mutationFn: async (data: Partial<Testimonial>) => {
      const endpoint = editingId ? `/testimonials/${editingId}` : '/testimonials';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(data)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setModalType(null);
      setEditingId(null);
      triggerXp(editingId ? 'Level Up: +100 XP Earned! (Updated Testimonial)' : 'Level Up: +150 XP Earned! (Added Testimonial)');
    }
  });

  const testimonialStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const res = await apiFetch(`/testimonials/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      triggerXp('+100 XP Earned! (Moderated Testimonial)');
    }
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/testimonials/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      triggerXp('+50 XP Earned! (Deleted Testimonial)');
    }
  });

  const messageStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiFetch(`/messages/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      triggerXp('+50 XP Earned! (Updated Message Status)');
    }
  });

  const experienceMutation = useMutation({
    mutationFn: async (data: Partial<Experience>) => {
      const endpoint = editingId ? `/experience/${editingId}` : '/experience';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(data)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      setModalType(null);
      setEditingId(null);
      triggerXp(editingId ? 'Level Up: +100 XP Earned! (Updated Experience)' : 'Level Up: +150 XP Earned! (Added Experience)');
    }
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/experience/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      triggerXp('+50 XP Earned! (Deleted Experience)');
    }
  });

  const skillMutation = useMutation({
    mutationFn: async (data: Partial<Skill>) => {
      const endpoint = editingId ? `/skills/${editingId}` : '/skills';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(data)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      setModalType(null);
      setEditingId(null);
      triggerXp(editingId ? 'Level Up: +100 XP Earned! (Updated Skill)' : 'Level Up: +150 XP Earned! (Added Skill)');
    }
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/skills/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      triggerXp('+50 XP Earned! (Deleted Skill)');
    }
  });

  const resumeMutation = useMutation({
    mutationFn: async (data: Partial<Resume>) => {
      const endpoint = editingId ? `/resume/${editingId}` : '/resume';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(data)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resumes'] });
      setModalType(null);
      setEditingId(null);
      triggerXp(editingId ? 'Level Up: +100 XP Earned! (Updated Resume)' : 'Level Up: +150 XP Earned! (Added Resume)');
    }
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/resume/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resumes'] });
      triggerXp('+50 XP Earned! (Deleted Resume)');
    }
  });

  const activateResumeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/resume/${id}/active`, { method: 'PATCH' });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resumes'] });
      triggerXp('+100 XP Earned! (Activated Resume)');
    }
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (publicId: string) => {
      // Find and delete the record using the backend route
      const res = await apiFetch(`/upload/${publicId}`, {
        method: 'DELETE'
      });
      if (res.error) throw new Error(res.error);
      return publicId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      triggerXp('+50 XP Earned! (Deleted Media Asset)');
    }
  });

  // Resume submission handler
  const handleResumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeForm.resumeFile) {
      alert('Please upload a resume PDF file first');
      return;
    }
    const payload = {
      label: resumeForm.label,
      resumeFile: resumeForm.resumeFile,
      isActive: resumeForm.isActive
    };
    resumeMutation.mutate(payload);
  };

  // Project submission handler
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: projectForm.title,
      slug: projectForm.slug || undefined,
      summary: projectForm.summary,
      description: projectForm.description,
      coverImageUrl: projectForm.coverImageUrl,
      category: projectForm.category,
      techStack: projectForm.techStack.split(',').map(s => s.trim()).filter(Boolean),
      tags: projectForm.tags.split(',').map(s => s.trim()).filter(Boolean),
      status: projectForm.status,
      featured: projectForm.featured,
      order: Number(projectForm.order),
      links: {
        github: projectForm.githubLink || undefined,
        liveDemo: projectForm.liveDemoLink || undefined,
        docs: projectForm.docsLink || undefined
      },
      gallery: projectForm.gallery,
      thumbnail: projectForm.thumbnail || undefined,
      demoVideo: projectForm.demoVideo || undefined,
      architectureDiagram: projectForm.architectureDiagram || undefined,
      caseStudy: {
        ...projectForm.caseStudy,
        metrics: projectForm.metrics
      }
    };
    projectMutation.mutate(payload);
  };

  // Blog submission handler
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...blogForm,
      categories: blogForm.categories.split(',').map(s => s.trim()).filter(Boolean),
      tags: blogForm.tags.split(',').map(s => s.trim()).filter(Boolean),
      slug: blogForm.slug || undefined,
      coverImage: blogForm.coverImage || undefined
    };
    blogMutation.mutate(payload);
  };

  // Cert submission handler
  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...certForm,
      skills: certForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      issueDate: new Date(certForm.issueDate).toISOString(),
      expiryDate: certForm.expiryDate ? new Date(certForm.expiryDate).toISOString() : undefined,
      certificateImage: certForm.certificateImage || undefined,
      certificatePdf: certForm.certificatePdf || undefined
    };
    certMutation.mutate(payload);
  };

  // Testimonial submission handler
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...testimonialForm,
      rating: Number(testimonialForm.rating),
      relatedProjectId: testimonialForm.relatedProjectId || undefined
    };
    testimonialMutation.mutate(payload);
  };

  // Experience submission handler
  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...experienceForm,
      responsibilities: experienceForm.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
      technologiesUsed: experienceForm.technologiesUsed.split(',').map(s => s.trim()).filter(Boolean),
      endDate: experienceForm.endDate || undefined,
      order: Number(experienceForm.order)
    };
    experienceMutation.mutate(payload);
  };

  // Skill submission handler
  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...skillForm,
      proficiency: Number(skillForm.proficiency),
      yearsExperience: Number(skillForm.yearsExperience),
      iconUrl: skillForm.iconUrl || undefined
    };
    skillMutation.mutate(payload);
  };

  // Loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans text-zinc-400">
        <Loader2 className="h-8 w-8 text-teal-400 animate-spin mb-4" />
        <span>Checking administrator access...</span>
      </div>
    );
  }

  // Auth Protection Guard
  if (!user || (user.role !== 'superadmin' && user.role !== 'admin')) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-zinc-950 flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-lg rounded-xl border border-red-500/30 bg-red-950/10 p-8 font-mono text-sm shadow-xl shadow-red-900/5">
            <div className="flex items-center space-x-2 text-red-500 mb-4 border-b border-red-500/20 pb-3">
              <Terminal className="h-5 w-5" />
              <span className="font-bold">Security Alert</span>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-6 font-sans">
              Access Denied. You do not have permission to view this page. Please sign in with an administrator account.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 px-4 py-2 text-xs font-semibold hover:bg-red-500/25 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-zinc-800 text-zinc-400 px-4 py-2 text-xs font-semibold hover:bg-zinc-900 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = statsData || defaultStats;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Floating XP Toast */}
      {xpReward && (
        <div className="fixed bottom-10 right-10 z-50 flex items-center space-x-2 rounded-xl border border-teal-500 bg-teal-950/80 px-4 py-3 text-teal-300 shadow-lg shadow-teal-500/20 font-mono text-sm animate-bounce">
          <Check className="h-4 w-4 text-teal-400" />
          <span>{rewardMsg}</span>
        </div>
      )}

      <main className="flex-1 bg-zinc-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="border-b border-zinc-900 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-teal-400 font-sans text-xs mb-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Console</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-white font-sans sm:text-3xl">Admin Dashboard</h1>
                <div className="flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>LIVE Monitoring Active</span>
                </div>
                <button
                  onClick={() => {
                    queryClient.invalidateQueries();
                    triggerXp('Synced Dashboard Data!');
                  }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white transition-colors"
                  title="Force Sync Now"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 bg-zinc-900/60 p-1 border border-zinc-850 rounded-lg font-mono text-xs">
              <button 
                onClick={() => setActiveTab('stats')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'stats' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'projects' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Projects
              </button>
              <button 
                onClick={() => setActiveTab('blog')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'blog' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Articles
              </button>
              <button 
                onClick={() => setActiveTab('certs')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'certs' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Certifications
              </button>
              <button 
                onClick={() => setActiveTab('experiences')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'experiences' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Experiences
              </button>
              <button 
                onClick={() => setActiveTab('skills')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'skills' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Skills
              </button>
              <button 
                onClick={() => setActiveTab('testimonials')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'testimonials' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Testimonials
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'messages' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Inbox
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'analytics' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Analytics
              </button>
              <button 
                onClick={() => setActiveTab('media')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'media' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Media
              </button>
              <button 
                onClick={() => setActiveTab('resumes')}
                className={`rounded-md px-3 py-1.5 transition-all ${activeTab === 'resumes' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Resumes
              </button>
            </div>
          </div>

          {/* TAB 1: SYSTEM STATS */}
          {activeTab === 'stats' && (
            <OverviewTab stats={stats} user={user!} />
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white font-sans">Projects List</h2>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setProjectForm({
                      title: '', slug: '', summary: '', description: '', coverImageUrl: '', category: '',
                      techStack: '', tags: '', status: 'draft', featured: false, order: 0,
                      githubLink: '', liveDemoLink: '', docsLink: '',
                      gallery: [],
                      thumbnail: null,
                      demoVideo: null,
                      architectureDiagram: null,
                      caseStudy: {
                        problem: '', research: '', architecture: '', challenges: '', solutions: '', results: '', lessonsLearned: ''
                      },
                      metrics: []
                    });
                    setFormTab('general');
                    setModalType('project');
                  }}
                  className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors font-sans flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Project</span>
                </button>
              </div>
 
              {/* Projects List Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/30 font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {projectsData?.map((proj) => (
                      <tr key={proj._id} className="hover:bg-zinc-900/20">
                        <td className="p-4 font-semibold text-white">{proj.title}</td>
                        <td className="p-4 font-mono text-zinc-400">{proj.category}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono border ${
                            proj.status === 'published' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            {proj.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">{proj.featured ? 'Yes' : 'No'}</td>
                        <td className="p-4 text-right flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(proj._id!);
                              setProjectForm({
                                title: proj.title || '',
                                slug: proj.slug || '',
                                summary: proj.summary || '',
                                description: proj.description || '',
                                coverImageUrl: proj.coverImageUrl || '',
                                category: proj.category || '',
                                techStack: proj.techStack ? proj.techStack.join(', ') : '',
                                tags: proj.tags ? proj.tags.join(', ') : '',
                                status: proj.status || 'draft',
                                featured: proj.featured || false,
                                order: proj.order || 0,
                                githubLink: proj.links?.github || '',
                                liveDemoLink: proj.links?.liveDemo || '',
                                docsLink: proj.links?.docs || '',
                                gallery: proj.gallery || [],
                                thumbnail: proj.thumbnail || null,
                                demoVideo: proj.demoVideo || null,
                                architectureDiagram: proj.architectureDiagram || null,
                                caseStudy: {
                                  problem: proj.caseStudy?.problem || '',
                                  research: proj.caseStudy?.research || '',
                                  architecture: proj.caseStudy?.architecture || '',
                                  challenges: proj.caseStudy?.challenges || '',
                                  solutions: proj.caseStudy?.solutions || '',
                                  results: proj.caseStudy?.results || '',
                                  lessonsLearned: proj.caseStudy?.lessonsLearned || ''
                                },
                                metrics: proj.caseStudy?.metrics || []
                              });
                              setFormTab('general');
                              setModalType('project');
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                                deleteProjectMutation.mutate(proj._id!);
                              }
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: JOURNAL POSTS */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white font-sans">Journal Articles</h2>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setBlogForm({
                      title: '', slug: '', excerpt: '', contentMarkdown: '', coverImageUrl: '',
                      coverImage: null,
                      categories: '', tags: '', status: 'draft'
                    });
                    setModalType('blog');
                  }}
                  className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors font-sans flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Post</span>
                </button>
              </div>
 
              {/* Articles table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/30 font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Title</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Read Time</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {blogData?.map((post) => (
                      <tr key={post._id} className="hover:bg-zinc-900/20">
                        <td className="p-4 font-semibold text-white">{post.title}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono border ${
                            post.status === 'published' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-zinc-400">{post.readingTimeMinutes} mins</td>
                        <td className="p-4 font-mono">{post.viewCount || 0}</td>
                        <td className="p-4 text-right flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(post._id!);
                              setBlogForm({
                                title: post.title || '',
                                slug: post.slug || '',
                                excerpt: post.excerpt || '',
                                contentMarkdown: post.contentMarkdown || '',
                                coverImageUrl: post.coverImageUrl || '',
                                coverImage: post.coverImage || null,
                                categories: post.categories ? post.categories.join(', ') : '',
                                tags: post.tags ? post.tags.join(', ') : '',
                                status: post.status || 'draft'
                              });
                              setModalType('blog');
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this blog post?')) {
                                deleteBlogMutation.mutate(post._id!);
                              }
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CERTIFICATIONS */}
          {activeTab === 'certs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white font-sans">Certifications List</h2>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setCertForm({
                      title: '', issuer: '', issueDate: '', expiryDate: '',
                      credentialUrl: '', imageUrl: '', 
                      certificateImage: null,
                      certificatePdf: null,
                      skills: '', category: ''
                    });
                    setModalType('cert');
                  }}
                  className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors font-sans flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>
 
              {/* Certs table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/30 font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Title</th>
                      <th className="p-4">Issuer</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Issue Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {certsData?.map((cert) => (
                      <tr key={cert._id} className="hover:bg-zinc-900/20">
                        <td className="p-4 font-semibold text-white">{cert.title}</td>
                        <td className="p-4 text-zinc-300">{cert.issuer}</td>
                        <td className="p-4 font-mono text-teal-400">{cert.category}</td>
                        <td className="p-4 font-mono text-zinc-500">
                          {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        </td>
                        <td className="p-4 text-right flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(cert._id!);
                              setCertForm({
                                title: cert.title,
                                issuer: cert.issuer,
                                issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
                                expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
                                credentialUrl: cert.credentialUrl || '',
                                imageUrl: cert.imageUrl,
                                certificateImage: cert.certificateImage || null,
                                certificatePdf: cert.certificatePdf || null,
                                skills: cert.skills.join(', '),
                                category: cert.category
                              });
                              setModalType('cert');
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this certification?')) {
                                deleteCertMutation.mutate(cert._id!);
                              }
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONIALS MODERATION */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white font-sans">Testimonials Moderation</h2>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setTestimonialForm({
                      authorName: '', authorRole: '', authorCompany: '', authorAvatarUrl: '',
                      rating: 5, body: '', videoUrl: '', relatedProjectId: '', status: 'pending'
                    });
                    setModalType('testimonial');
                  }}
                  className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors font-sans flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/30 font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Client</th>
                      <th className="p-4">Testimonial</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {testimonialsData?.map((test) => (
                      <tr key={test._id} className="hover:bg-zinc-900/20">
                        <td className="p-4">
                          <div className="font-semibold text-white">{test.authorName}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{test.authorRole} {test.authorCompany && `@ ${test.authorCompany}`}</div>
                        </td>
                        <td className="p-4 text-zinc-350 max-w-sm truncate">{test.body}</td>
                        <td className="p-4 font-mono text-teal-400">{test.rating} / 5 Stars</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-mono border ${
                            test.status === 'approved' 
                              ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' 
                              : test.status === 'rejected' 
                              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          }`}>
                            {test.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end space-x-1">
                          {test.status !== 'approved' && (
                            <button
                              onClick={() => testimonialStatusMutation.mutate({ id: test._id!, status: 'approved' })}
                              className="rounded p-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20"
                              title="Approve Testimonial"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {test.status !== 'rejected' && (
                            <button
                              onClick={() => testimonialStatusMutation.mutate({ id: test._id!, status: 'rejected' })}
                              className="rounded p-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                              title="Reject Testimonial"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingId(test._id!);
                              setTestimonialForm({
                                authorName: test.authorName || '',
                                authorRole: test.authorRole || '',
                                authorCompany: test.authorCompany || '',
                                authorAvatarUrl: test.authorAvatarUrl || '',
                                rating: test.rating || 5,
                                body: test.body || '',
                                videoUrl: test.videoUrl || '',
                                relatedProjectId: test.relatedProjectId || '',
                                status: test.status || 'pending'
                              });
                              setModalType('testimonial');
                            }}
                            className="rounded p-1 bg-zinc-900 text-zinc-400 hover:text-white"
                            title="Edit Testimonial"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this testimonial?')) {
                                deleteTestimonialMutation.mutate(test._id!);
                              }
                            }}
                            className="rounded p-1 bg-zinc-900 text-zinc-500 hover:text-white"
                            title="Delete Testimonial"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white font-sans">Messages Inbox</h2>
 
              <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/30 font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Sender</th>
                      <th className="p-4">Subject & Body</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {messagesData?.map((msg) => (
                      <tr key={msg._id} className="hover:bg-zinc-900/20">
                        <td className="p-4">
                          <div className="font-semibold text-white">{msg.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{msg.email}</div>
                        </td>
                        <td className="p-4 max-w-sm">
                          <div className="font-semibold text-zinc-200">{msg.subject || '[No Subject]'}</div>
                          <div className="text-zinc-400 mt-0.5 truncate">{msg.body}</div>
                        </td>
                        <td className="p-4 font-mono text-[10px] text-zinc-400">{msg.source.toUpperCase()}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-mono border ${
                            msg.status === 'unread' 
                              ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-bold' 
                              : msg.status === 'replied' 
                              ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' 
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            {msg.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end space-x-2">
                          {msg.status === 'unread' && (
                            <button
                              onClick={() => messageStatusMutation.mutate({ id: msg._id!, status: 'read' })}
                              className="rounded px-2 py-1 bg-zinc-900 text-zinc-300 hover:text-white font-sans text-[9px] border border-zinc-800"
                            >
                              Mark Read
                            </button>
                          )}
                          {msg.status !== 'replied' && (
                            <button
                              onClick={() => messageStatusMutation.mutate({ id: msg._id!, status: 'replied' })}
                              className="rounded px-2 py-1 bg-teal-950/20 text-teal-400 hover:text-teal-300 font-sans text-[9px] border border-teal-500/20"
                            >
                              Mark Replied
                            </button>
                          )}
                          {msg.status !== 'archived' && (
                            <button
                              onClick={() => messageStatusMutation.mutate({ id: msg._id!, status: 'archived' })}
                              className="rounded px-2 py-1 bg-zinc-900 text-zinc-500 hover:text-white font-sans text-[9px] border border-zinc-800"
                            >
                              Archive
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: EXPERIENCES */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white font-sans">Experiences Timeline</h2>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setExperienceForm({
                      organization: '', role: '', type: 'job',
                      startDate: '', endDate: '', description: '',
                      responsibilities: '', technologiesUsed: '', order: 0
                    });
                    setModalType('experience');
                  }}
                  className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors font-sans flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/30 font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Role & Organization</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Order</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {experiencesData?.map((exp) => (
                      <tr key={exp._id} className="hover:bg-zinc-900/20">
                        <td className="p-4">
                          <div className="font-semibold text-white">{exp.role}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{exp.organization}</div>
                        </td>
                        <td className="p-4">
                          <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-700 capitalize">
                            {exp.type}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-zinc-400">
                          {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                          {' — '}
                          {exp.endDate 
                            ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) 
                            : 'Present'}
                        </td>
                        <td className="p-4 font-mono text-zinc-400">{exp.order}</td>
                        <td className="p-4 text-right flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(exp._id!);
                              setExperienceForm({
                                organization: exp.organization || '',
                                role: exp.role || '',
                                type: exp.type || 'job',
                                startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                                endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
                                description: exp.description || '',
                                responsibilities: exp.responsibilities ? exp.responsibilities.join('\n') : '',
                                technologiesUsed: exp.technologiesUsed ? exp.technologiesUsed.join(', ') : '',
                                order: exp.order || 0
                              });
                              setModalType('experience');
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this experience?')) {
                                deleteExperienceMutation.mutate(exp._id!);
                              }
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white font-sans">Technical Skills</h2>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setSkillForm({
                      name: '', category: 'frontend',
                      proficiency: 80, yearsExperience: 1, iconUrl: ''
                    });
                    setModalType('skill');
                  }}
                  className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors font-sans flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/30 font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Skill Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Proficiency</th>
                      <th className="p-4">Years Exp</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {skillsData?.map((skill) => (
                      <tr key={skill._id} className="hover:bg-zinc-900/20">
                        <td className="p-4 font-semibold text-white">{skill.name}</td>
                        <td className="p-4 font-mono text-teal-400 capitalize">{skill.category}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{skill.proficiency}%</span>
                            <div className="h-1.5 w-24 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800/40">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-zinc-400">{skill.yearsExperience} yrs</td>
                        <td className="p-4 text-right flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(skill._id!);
                              setSkillForm({
                                name: skill.name || '',
                                category: skill.category || 'frontend',
                                proficiency: skill.proficiency || 80,
                                yearsExperience: skill.yearsExperience || 0,
                                iconUrl: skill.iconUrl || ''
                              });
                              setModalType('skill');
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this skill?')) {
                                deleteSkillMutation.mutate(skill._id!);
                              }
                            }}
                            className="rounded p-1 hover:bg-zinc-900 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>      {/* FORM MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white font-sans flex items-center space-x-2 border-b border-zinc-900 pb-4 mb-6">
              <Terminal className="h-4.5 w-4.5 text-teal-400" />
              <span>
                {editingId 
                  ? 'Edit ' + (modalType === 'cert' ? 'Certification' : modalType === 'blog' ? 'Blog Post' : modalType === 'testimonial' ? 'Testimonial' : modalType === 'experience' ? 'Experience' : modalType === 'skill' ? 'Skill' : 'Project') 
                  : 'Create New ' + (modalType === 'cert' ? 'Certification' : modalType === 'blog' ? 'Blog Post' : modalType === 'testimonial' ? 'Testimonial' : modalType === 'experience' ? 'Experience' : modalType === 'skill' ? 'Skill' : 'Project')}
              </span>
            </h2>

            {/* PROJECT FORM */}
            {modalType === 'project' && (
              <form onSubmit={handleProjectSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 font-sans text-xs">
                {/* Form Tabs */}
                <div className="flex border-b border-zinc-850 pb-2 mb-4 gap-2 text-[10px] font-mono">
                  {(['general', 'links', 'gallery', 'caseStudy', 'metrics'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFormTab(tab)}
                      className={`rounded px-2.5 py-1 capitalize transition-colors ${
                        formTab === tab ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-zinc-500 border border-transparent hover:text-zinc-300'
                      }`}
                    >
                      {tab === 'caseStudy' ? 'Case Study' : tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {formTab === 'general' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Project Title *</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Custom Slug (Optional — autogenerated if empty)</label>
                      <input
                        type="text"
                        value={projectForm.slug}
                        onChange={(e) => setProjectForm({...projectForm, slug: e.target.value})}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-250 outline-none focus:border-teal-500 font-mono"
                        placeholder="e.g. speakwrite"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Category *</label>
                        <input
                          type="text"
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                          className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                          placeholder="e.g. Blockchain & Cloud"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Display Order</label>
                        <input
                          type="number"
                          value={projectForm.order}
                          onChange={(e) => setProjectForm({...projectForm, order: Number(e.target.value)})}
                          className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Summary *</label>
                      <input
                        type="text"
                        value={projectForm.summary}
                        onChange={(e) => setProjectForm({...projectForm, summary: e.target.value})}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Description *</label>
                      <textarea
                        rows={4}
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-3 text-xs text-zinc-200 outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <CloudinaryUploadZone
                        endpoint="project-image"
                        acceptType="image"
                        label="Cover Image / Thumbnail Upload *"
                        value={projectForm.thumbnail}
                        onUploadSuccess={(asset) => setProjectForm({
                          ...projectForm,
                          thumbnail: asset,
                          coverImageUrl: asset.secureUrl
                        })}
                        onRemove={() => setProjectForm({
                          ...projectForm,
                          thumbnail: null,
                          coverImageUrl: ''
                        })}
                      />
                      {/* Hidden input to satisfy required cover image URL validation */}
                      <input
                        type="hidden"
                        value={projectForm.coverImageUrl}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <CloudinaryUploadZone
                          endpoint="project-video"
                          acceptType="video"
                          label="Demo Video Upload"
                          value={projectForm.demoVideo}
                          onUploadSuccess={(asset) => setProjectForm({
                            ...projectForm,
                            demoVideo: asset
                          })}
                          onRemove={() => setProjectForm({
                            ...projectForm,
                            demoVideo: null
                          })}
                          maxSizeMB={50}
                        />
                      </div>
                      <div>
                        <CloudinaryUploadZone
                          endpoint="project-image"
                          acceptType="image"
                          label="Architecture Diagram Upload"
                          value={projectForm.architectureDiagram}
                          onUploadSuccess={(asset) => setProjectForm({
                            ...projectForm,
                            architectureDiagram: asset
                          })}
                          onRemove={() => setProjectForm({
                            ...projectForm,
                            architectureDiagram: null
                          })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Technologies Used (comma-separated)</label>
                        <input
                          type="text"
                          value={projectForm.techStack}
                          onChange={(e) => setProjectForm({...projectForm, techStack: e.target.value})}
                          className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                          placeholder="Solidity, IPFS, Next.js"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={projectForm.tags}
                          onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
                          className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                          placeholder="Cryptography, Cloud"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 bg-zinc-900/40 p-3 border border-zinc-900 rounded-lg">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Status</label>
                        <select
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({...projectForm, status: e.target.value as 'draft' | 'published' | 'archived'})}
                          className="rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 font-mono"
                        >
                          <option value="draft">DRAFT</option>
                          <option value="published">PUBLISHED</option>
                          <option value="archived">ARCHIVED</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 font-sans">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                          className="rounded border-zinc-800 bg-zinc-950 text-teal-500 h-4 w-4"
                        />
                        <label htmlFor="featured" className="text-[10px] text-zinc-400 font-semibold font-sans">Feature this project on the homepage</label>
                      </div>
                    </div>
                  </div>
                )}

                {formTab === 'links' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">GitHub URL</label>
                      <input
                        type="url"
                        value={projectForm.githubLink}
                        onChange={(e) => setProjectForm({...projectForm, githubLink: e.target.value})}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Live Demo URL</label>
                      <input
                        type="url"
                        value={projectForm.liveDemoLink}
                        onChange={(e) => setProjectForm({...projectForm, liveDemoLink: e.target.value})}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Docs URL</label>
                      <input
                        type="url"
                        value={projectForm.docsLink}
                        onChange={(e) => setProjectForm({...projectForm, docsLink: e.target.value})}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                        placeholder="https://docs..."
                      />
                    </div>
                  </div>
                )}

                {formTab === 'gallery' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                      <span className="text-[10px] font-mono text-zinc-400 font-semibold">Gallery Items ({projectForm.gallery.length})</span>
                      <button
                        type="button"
                        onClick={() => setProjectForm({
                          ...projectForm,
                          gallery: [...projectForm.gallery, { url: '', type: 'image', caption: '' }]
                        })}
                        className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 text-[10px] font-semibold"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1">
                      {projectForm.gallery.map((item, idx) => (
                        <div key={idx} className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-3 relative space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              const nextGallery = [...projectForm.gallery];
                              nextGallery.splice(idx, 1);
                              setProjectForm({...projectForm, gallery: nextGallery});
                            }}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                              <CloudinaryUploadZone
                                endpoint={item.type === 'video' ? 'project-video' : 'project-image'}
                                acceptType={item.type === 'video' ? 'video' : 'image'}
                                label="Media Asset Upload"
                                value={item.publicId ? {
                                  publicId: item.publicId,
                                  secureUrl: item.url,
                                  resourceType: item.type === 'video' ? 'video' : 'image',
                                  format: item.format || '',
                                  bytes: item.bytes || 0,
                                  uploadedAt: item.uploadedAt || ''
                                } : item.url}
                                onUploadSuccess={(asset) => {
                                  const nextGallery = [...projectForm.gallery];
                                  nextGallery[idx].url = asset.secureUrl;
                                  nextGallery[idx].publicId = asset.publicId;
                                  nextGallery[idx].secureUrl = asset.secureUrl;
                                  nextGallery[idx].resourceType = asset.resourceType;
                                  nextGallery[idx].format = asset.format;
                                  nextGallery[idx].bytes = asset.bytes;
                                  nextGallery[idx].width = asset.width;
                                  nextGallery[idx].height = asset.height;
                                  nextGallery[idx].uploadedAt = asset.uploadedAt;
                                  setProjectForm({...projectForm, gallery: nextGallery});
                                }}
                                onRemove={() => {
                                  const nextGallery = [...projectForm.gallery];
                                  nextGallery[idx].url = '';
                                  nextGallery[idx].publicId = undefined;
                                  setProjectForm({...projectForm, gallery: nextGallery});
                                }}
                                maxSizeMB={item.type === 'video' ? 50 : 5}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-zinc-500 mb-0.5">Type</label>
                              <select
                                value={item.type}
                                onChange={(e) => {
                                  const nextGallery = [...projectForm.gallery];
                                  nextGallery[idx].type = e.target.value as 'image' | 'video';
                                  setProjectForm({...projectForm, gallery: nextGallery});
                                }}
                                className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] text-zinc-200"
                              >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] text-zinc-500 mb-0.5">Caption (Optional)</label>
                            <input
                              type="text"
                              value={item.caption || ''}
                              onChange={(e) => {
                                const nextGallery = [...projectForm.gallery];
                                nextGallery[idx].caption = e.target.value;
                                setProjectForm({...projectForm, gallery: nextGallery});
                              }}
                              className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] text-zinc-200 outline-none"
                              placeholder="Caption text..."
                            />
                          </div>
                        </div>
                      ))}
                      {projectForm.gallery.length === 0 && (
                        <div className="text-center py-6 text-zinc-600 font-mono text-[10px]">No gallery media added.</div>
                      )}
                    </div>
                  </div>
                )}

                {formTab === 'caseStudy' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">1. The Problem Space</label>
                      <textarea
                        rows={2}
                        value={projectForm.caseStudy.problem}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          caseStudy: { ...projectForm.caseStudy, problem: e.target.value }
                        })}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-200 outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">2. Applied Research & Prototypes</label>
                      <textarea
                        rows={2}
                        value={projectForm.caseStudy.research}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          caseStudy: { ...projectForm.caseStudy, research: e.target.value }
                        })}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-200 outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">3. System Architecture Design</label>
                      <textarea
                        rows={2}
                        value={projectForm.caseStudy.architecture}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          caseStudy: { ...projectForm.caseStudy, architecture: e.target.value }
                        })}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-200 outline-none focus:border-teal-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">4a. Key Challenges</label>
                        <textarea
                          rows={3}
                          value={projectForm.caseStudy.challenges}
                          onChange={(e) => setProjectForm({
                            ...projectForm,
                            caseStudy: { ...projectForm.caseStudy, challenges: e.target.value }
                          })}
                          className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-200 outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">4b. Core Solutions</label>
                        <textarea
                          rows={3}
                          value={projectForm.caseStudy.solutions}
                          onChange={(e) => setProjectForm({
                            ...projectForm,
                            caseStudy: { ...projectForm.caseStudy, solutions: e.target.value }
                          })}
                          className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-200 outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">5. Deployment Outcomes & Results</label>
                      <textarea
                        rows={2}
                        value={projectForm.caseStudy.results}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          caseStudy: { ...projectForm.caseStudy, results: e.target.value }
                        })}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-200 outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold font-sans">Lessons Learned</label>
                      <textarea
                        rows={2}
                        value={projectForm.caseStudy.lessonsLearned}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          caseStudy: { ...projectForm.caseStudy, lessonsLearned: e.target.value }
                        })}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-200 outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}

                {formTab === 'metrics' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                      <span className="text-[10px] font-mono text-zinc-400 font-semibold">Performance Metrics ({projectForm.metrics.length})</span>
                      <button
                        type="button"
                        onClick={() => setProjectForm({
                          ...projectForm,
                          metrics: [...projectForm.metrics, { label: '', value: '' }]
                        })}
                        className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 text-[10px] font-semibold"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Metric</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                      {projectForm.metrics.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-zinc-900/30 p-2.5 border border-zinc-905 rounded-lg relative">
                          <div className="flex-1">
                            <label className="block text-[9px] text-zinc-500 mb-0.5 font-mono">LABEL</label>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const nextMetrics = [...projectForm.metrics];
                                nextMetrics[idx].label = e.target.value.toUpperCase();
                                setProjectForm({...projectForm, metrics: nextMetrics});
                              }}
                              className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-200 outline-none"
                              placeholder="e.g. LATENCY"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[9px] text-zinc-500 mb-0.5 font-mono font-semibold">VALUE</label>
                            <input
                              type="text"
                              value={item.value}
                              onChange={(e) => {
                                const nextMetrics = [...projectForm.metrics];
                                nextMetrics[idx].value = e.target.value;
                                setProjectForm({...projectForm, metrics: nextMetrics});
                              }}
                              className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-200 outline-none"
                              placeholder="e.g. <50ms"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const nextMetrics = [...projectForm.metrics];
                              nextMetrics.splice(idx, 1);
                              setProjectForm({...projectForm, metrics: nextMetrics});
                            }}
                            className="text-red-400 hover:text-red-300 pt-3"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      {projectForm.metrics.length === 0 && (
                        <div className="text-center py-6 text-zinc-650 font-mono text-[10px]">No metrics added.</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900 font-sans mt-4">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="rounded-lg border border-zinc-850 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-teal-400"
                  >
                    {projectMutation.isPending ? 'Saving...' : 'Save Project'}
                  </button>
                </div>
              </form>
            )}

            {/* BLOG FORM */}
            {modalType === 'blog' && (
              <form onSubmit={handleBlogSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 font-sans">
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Post Title *</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Custom Slug (Optional)</label>
                  <input
                    type="text"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500 font-mono"
                    placeholder="e.g. custom-slug-path"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Excerpt *</label>
                  <input
                    type="text"
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Markdown Content *</label>
                  <textarea
                    rows={6}
                    value={blogForm.contentMarkdown}
                    onChange={(e) => setBlogForm({...blogForm, contentMarkdown: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-3 text-xs text-zinc-200 outline-none focus:border-teal-500 font-mono"
                    placeholder="## Heading... write in markdown"
                    required
                  />
                </div>
                <div>
                  <CloudinaryUploadZone
                    endpoint="blog-cover"
                    acceptType="image"
                    label="Cover Image Upload"
                    value={blogForm.coverImage}
                    onUploadSuccess={(asset) => setBlogForm({
                      ...blogForm,
                      coverImage: asset,
                      coverImageUrl: asset.secureUrl
                    })}
                    onRemove={() => setBlogForm({
                      ...blogForm,
                      coverImage: null,
                      coverImageUrl: ''
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Categories (comma-separated)</label>
                    <input
                      type="text"
                      value={blogForm.categories}
                      onChange={(e) => setBlogForm({...blogForm, categories: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                      placeholder="Development, AI"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={blogForm.tags}
                      onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                      placeholder="NPM, Ethers"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Status</label>
                  <select
                    value={blogForm.status}
                    onChange={(e) => setBlogForm({...blogForm, status: e.target.value as 'draft' | 'published'})}
                    className="rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 font-mono"
                  >
                    <option value="draft">DRAFT</option>
                    <option value="published">PUBLISHED</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900 font-sans">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="rounded-lg border border-zinc-850 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-teal-400"
                  >
                    {blogMutation.isPending ? 'Saving...' : 'Save Blog Post'}
                  </button>
                </div>
              </form>
            )}

            {/* CERT FORM */}
            {modalType === 'cert' && (
              <form onSubmit={handleCertSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 font-sans">
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Certification Title *</label>
                  <input
                    type="text"
                    value={certForm.title}
                    onChange={(e) => setCertForm({...certForm, title: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Issuer *</label>
                    <input
                      type="text"
                      value={certForm.issuer}
                      onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Category *</label>
                    <input
                      type="text"
                      value={certForm.category}
                      onChange={(e) => setCertForm({...certForm, category: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                      placeholder="e.g. cloud, devops"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Issue Date *</label>
                    <input
                      type="date"
                      value={certForm.issueDate}
                      onChange={(e) => setCertForm({...certForm, issueDate: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Expiry Date</label>
                    <input
                      type="date"
                      value={certForm.expiryDate}
                      onChange={(e) => setCertForm({...certForm, expiryDate: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Credential Verification URL</label>
                  <input
                    type="url"
                    value={certForm.credentialUrl}
                    onChange={(e) => setCertForm({...certForm, credentialUrl: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <CloudinaryUploadZone
                    endpoint="certificate"
                    acceptType="image"
                    label="Certificate Image Upload *"
                    value={certForm.certificateImage}
                    onUploadSuccess={(asset) => setCertForm({
                      ...certForm,
                      certificateImage: asset,
                      imageUrl: asset.secureUrl
                    })}
                    onRemove={() => setCertForm({
                      ...certForm,
                      certificateImage: null,
                      imageUrl: ''
                    })}
                  />
                  {/* Hidden input to satisfy required image validation */}
                  <input
                    type="hidden"
                    value={certForm.imageUrl}
                    required
                  />
                </div>
                <div>
                  <CloudinaryUploadZone
                    endpoint="certificate"
                    acceptType="pdf"
                    label="Certificate PDF File Upload (Optional)"
                    value={certForm.certificatePdf}
                    onUploadSuccess={(asset) => setCertForm({
                      ...certForm,
                      certificatePdf: asset
                    })}
                    onRemove={() => setCertForm({
                      ...certForm,
                      certificatePdf: null
                    })}
                    maxSizeMB={10}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Skills Learned (comma-separated)</label>
                  <input
                    type="text"
                    value={certForm.skills}
                    onChange={(e) => setCertForm({...certForm, skills: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    placeholder="Kubernetes, GCP, Docker"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900 font-sans">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="rounded-lg border border-zinc-850 px-4 py-2 text-xs font-semibold text-zinc-450 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-teal-400"
                  >
                    {certMutation.isPending ? 'Saving...' : 'Save Certification'}
                  </button>
                </div>
              </form>
            )}

            {/* TESTIMONIAL FORM */}
            {modalType === 'testimonial' && (
              <form onSubmit={handleTestimonialSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 font-sans text-xs">
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Author Name *</label>
                  <input
                    type="text"
                    value={testimonialForm.authorName}
                    onChange={(e) => setTestimonialForm({...testimonialForm, authorName: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Author Role *</label>
                    <input
                      type="text"
                      value={testimonialForm.authorRole}
                      onChange={(e) => setTestimonialForm({...testimonialForm, authorRole: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Author Company</label>
                    <input
                      type="text"
                      value={testimonialForm.authorCompany}
                      onChange={(e) => setTestimonialForm({...testimonialForm, authorCompany: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                      placeholder="e.g. Labmentix"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Author Avatar URL</label>
                  <input
                    type="url"
                    value={testimonialForm.authorAvatarUrl}
                    onChange={(e) => setTestimonialForm({...testimonialForm, authorAvatarUrl: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Rating (1-5) *</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm({...testimonialForm, rating: Number(e.target.value)})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Related Project</label>
                    <select
                      value={testimonialForm.relatedProjectId}
                      onChange={(e) => setTestimonialForm({...testimonialForm, relatedProjectId: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-250 font-mono outline-none"
                    >
                      <option value="">None</option>
                      {projectsData?.map((p) => (
                        <option key={p._id} value={p._id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Video URL (Optional)</label>
                  <input
                    type="url"
                    value={testimonialForm.videoUrl}
                    onChange={(e) => setTestimonialForm({...testimonialForm, videoUrl: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Testimonial Body *</label>
                  <textarea
                    rows={4}
                    value={testimonialForm.body}
                    onChange={(e) => setTestimonialForm({...testimonialForm, body: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-3 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Status</label>
                  <select
                    value={testimonialForm.status}
                    onChange={(e) => setTestimonialForm({...testimonialForm, status: e.target.value as 'pending' | 'approved' | 'rejected'})}
                    className="rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-250 font-mono"
                  >
                    <option value="pending">PENDING</option>
                    <option value="approved">APPROVED</option>
                    <option value="rejected">REJECTED</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900 font-sans">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="rounded-lg border border-zinc-850 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-teal-400"
                  >
                    {testimonialMutation.isPending ? 'Saving...' : 'Save Testimonial'}
                  </button>
                </div>
              </form>
            )}

            {/* EXPERIENCE FORM */}
            {modalType === 'experience' && (
              <form onSubmit={handleExperienceSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 font-sans text-xs">
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Role *</label>
                  <input
                    type="text"
                    value={experienceForm.role}
                    onChange={(e) => setExperienceForm({...experienceForm, role: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    placeholder="e.g. Web Development Intern"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Organization *</label>
                    <input
                      type="text"
                      value={experienceForm.organization}
                      onChange={(e) => setExperienceForm({...experienceForm, organization: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                      placeholder="e.g. Labmentix"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Type *</label>
                    <select
                      value={experienceForm.type}
                      onChange={(e) => setExperienceForm({...experienceForm, type: e.target.value as 'job' | 'internship' | 'education' | 'achievement'})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-250 font-mono"
                    >
                      <option value="job">JOB</option>
                      <option value="internship">INTERNSHIP</option>
                      <option value="education">EDUCATION</option>
                      <option value="achievement">ACHIEVEMENT</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Start Date *</label>
                    <input
                      type="date"
                      value={experienceForm.startDate}
                      onChange={(e) => setExperienceForm({...experienceForm, startDate: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-250"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">End Date (Leave blank if Present)</label>
                    <input
                      type="date"
                      value={experienceForm.endDate}
                      onChange={(e) => setExperienceForm({...experienceForm, endDate: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-250"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Description *</label>
                  <textarea
                    rows={3}
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-3 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Responsibilities (One per line)</label>
                  <textarea
                    rows={3}
                    value={experienceForm.responsibilities}
                    onChange={(e) => setExperienceForm({...experienceForm, responsibilities: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 p-3 text-xs text-zinc-200 outline-none focus:border-teal-500 font-sans"
                    placeholder="Designed REST APIs&#10;Integrated backend webhooks"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Technologies (comma-separated)</label>
                    <input
                      type="text"
                      value={experienceForm.technologiesUsed}
                      onChange={(e) => setExperienceForm({...experienceForm, technologiesUsed: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none"
                      placeholder="React.js, Node.js"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Order</label>
                    <input
                      type="number"
                      value={experienceForm.order}
                      onChange={(e) => setExperienceForm({...experienceForm, order: Number(e.target.value)})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900 font-sans">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="rounded-lg border border-zinc-850 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-955 hover:bg-teal-400"
                  >
                    {experienceMutation.isPending ? 'Saving...' : 'Save Experience'}
                  </button>
                </div>
              </form>
            )}

            {/* SKILL FORM */}
            {modalType === 'skill' && (
              <form onSubmit={handleSkillSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 font-sans text-xs">
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Skill Name *</label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    placeholder="e.g. JavaScript"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Category *</label>
                    <select
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({...skillForm, category: e.target.value as 'frontend' | 'backend' | 'database' | 'devops' | 'cloud' | 'ai' | 'other'})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-250 font-mono"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="devops">DevOps</option>
                      <option value="cloud">Cloud</option>
                      <option value="ai">Artificial Intelligence</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Proficiency (%) *</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={skillForm.proficiency}
                        onChange={(e) => setSkillForm({...skillForm, proficiency: Number(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="font-mono text-teal-400 font-bold shrink-0">{skillForm.proficiency}%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Years of Experience</label>
                    <input
                      type="number"
                      value={skillForm.yearsExperience}
                      onChange={(e) => setSkillForm({...skillForm, yearsExperience: Number(e.target.value)})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Icon Class Name / URL</label>
                    <input
                      type="text"
                      value={skillForm.iconUrl}
                      onChange={(e) => setSkillForm({...skillForm, iconUrl: e.target.value})}
                      className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none font-mono"
                      placeholder="e.g. devicon-javascript-plain"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900 font-sans">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="rounded-lg border border-zinc-850 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-955 hover:bg-teal-400"
                  >
                    {skillMutation.isPending ? 'Saving...' : 'Save Skill'}
                  </button>
                </div>
              </form>
            )}

            {/* RESUME FORM */}
            {modalType === 'resume' && (
              <form onSubmit={handleResumeSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 font-sans text-xs">
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1 font-semibold font-sans">Resume Label *</label>
                  <input
                    type="text"
                    value={resumeForm.label}
                    onChange={(e) => setResumeForm({...resumeForm, label: e.target.value})}
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500"
                    placeholder="e.g. Pratik Date - IT Engineer Resume"
                    required
                  />
                </div>
                <div>
                  <CloudinaryUploadZone
                    endpoint="resume"
                    acceptType="pdf"
                    label="Resume PDF Upload *"
                    value={resumeForm.resumeFile}
                    onUploadSuccess={(asset) => setResumeForm({
                      ...resumeForm,
                      resumeFile: asset
                    })}
                    onRemove={() => setResumeForm({
                      ...resumeForm,
                      resumeFile: null
                    })}
                    maxSizeMB={10}
                  />
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={resumeForm.isActive}
                    onChange={(e) => setResumeForm({...resumeForm, isActive: e.target.checked})}
                    className="rounded border-zinc-800 bg-zinc-950 text-teal-500 h-4 w-4"
                  />
                  <label htmlFor="isActive" className="text-[10px] text-zinc-400 font-semibold font-sans">Set this resume as the active default version</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900 font-sans mt-4">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="rounded-lg border border-zinc-850 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-955 hover:bg-teal-400"
                  >
                    {resumeMutation.isPending ? 'Saving...' : 'Save Resume'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

          {/* TAB 7: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Highlights cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6">
                  <div className="flex items-center justify-between text-zinc-500 mb-3 text-xs font-semibold">
                    <span>Total Page Visitors</span>
                    <Eye className="h-4 w-4 text-violet-400" />
                  </div>
                  <div className="text-3xl font-bold text-white font-mono">{analyticsData?.totalVisitors !== undefined ? analyticsData.totalVisitors : '—'}</div>
                  <p className="text-xs text-zinc-650 mt-1 font-sans">Lifetime page hits</p>
                </div>

                <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6">
                  <div className="flex items-center justify-between text-zinc-500 mb-3 text-xs font-semibold">
                    <span>Active Session Hits</span>
                    <Users className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-white font-mono">{analyticsData?.activeVisitors !== undefined ? analyticsData.activeVisitors : '—'}</div>
                  <p className="text-xs text-zinc-650 mt-1 font-sans">Unique IPs this session</p>
                </div>

                <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6">
                  <div className="flex items-center justify-between text-zinc-500 mb-3 text-xs font-semibold">
                    <span>Engagement Actions</span>
                    <BarChart3 className="h-4 w-4 text-teal-400" />
                  </div>
                  <div className="text-3xl font-bold text-white font-mono">
                    {analyticsData?.recentEvents?.length || 0}
                  </div>
                  <p className="text-xs text-zinc-650 mt-1 font-sans">Logged events this session</p>
                </div>
              </div>

              {/* Main Visual Charts Grid */}
              <div className="grid gap-8 lg:grid-cols-3">
                
                {/* SVG Area Chart - Traffic Volume */}
                <div className="lg:col-span-2 rounded-xl border border-zinc-900 bg-zinc-950/40 p-6">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-2">Visitor Traffic Over Time</h3>
                  <p className="text-xs text-zinc-500 mb-6">Visual area distribution of user hit sequences</p>
                  
                  <div className="relative w-full h-[220px] bg-zinc-950/60 border border-zinc-900 rounded-xl overflow-hidden p-4">
                    <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#2dd4bf" />
                          <stop offset="50%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.03)" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.03)" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.03)" />
                      
                      {/* Line & Fill Path */}
                      <path
                        d="M 0 180 Q 80 130 160 160 T 320 90 T 480 60 L 500 60 L 500 200 L 0 200 Z"
                        fill="url(#areaGrad)"
                      />
                      <path
                        d="M 0 180 Q 80 130 160 160 T 320 90 T 480 60 L 500 60"
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      {/* Glow Dots */}
                      <circle cx="160" cy="160" r="5" fill="#2dd4bf" stroke="#09090b" strokeWidth="2.5" />
                      <circle cx="320" cy="90" r="5" fill="#6366f1" stroke="#09090b" strokeWidth="2.5" />
                      <circle cx="480" cy="60" r="5" fill="#a78bfa" stroke="#09090b" strokeWidth="2.5" />
                    </svg>
                  </div>
                </div>

                {/* Top Visited Pages Bar Chart */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-2">Most Visited Paths</h3>
                  <p className="text-xs text-zinc-500 mb-6">Top traffic hits by pathname</p>

                  {(!analyticsData?.pageViewsByPath || analyticsData.pageViewsByPath.length === 0) ? (
                    <div className="text-center py-12 text-xs font-mono text-zinc-600">
                      No paths tracked yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analyticsData.pageViewsByPath.slice(0, 5).map((page: PageViewPath, idx: number) => {
                        const maxCount = Math.max(...analyticsData.pageViewsByPath.map((p: PageViewPath) => p.count), 1);
                        const percentage = (page.count / maxCount) * 100;
                        return (
                          <div key={idx} className="space-y-1 font-mono">
                            <div className="flex justify-between text-xs">
                              <span className="truncate text-zinc-400 max-w-[160px]">{page._id}</span>
                              <span className="text-teal-400 font-bold">{page.count} hits</span>
                            </div>
                            <div className="h-2 w-full rounded bg-zinc-900 border border-zinc-800/80 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-teal-500 to-indigo-400 rounded transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Event Logging Ledger console */}
              <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 font-mono">
                <h3 className="text-sm font-semibold text-zinc-300 mb-1 font-sans">Live Event Logging Feed</h3>
                <p className="text-xs text-zinc-500 mb-4 font-sans font-mono">Real-time interactions recorded in the database</p>

                {(!analyticsData?.recentEvents || analyticsData.recentEvents.length === 0) ? (
                  <div className="text-center py-10 text-xs text-zinc-650 border border-dashed border-zinc-850 rounded-lg">
                    No discrete events tracked in the database yet.
                  </div>
                ) : (
                  <div className="rounded-xl border border-zinc-850 bg-zinc-950/80 p-4 max-h-[280px] overflow-y-auto text-[11px] leading-relaxed custom-scrollbar">
                    <div className="space-y-2.5">
                      {analyticsData.recentEvents.map((event: RecentEvent, idx: number) => {
                        const time = event.createdAt 
                          ? new Date(event.createdAt).toLocaleTimeString() 
                          : '';
                        const actor = event.userId?.name || 'Guest User';
                        return (
                          <div key={idx} className="flex justify-between gap-4 text-zinc-400 hover:text-zinc-200 transition-colors">
                            <span className="truncate flex-1">
                              <span className="text-teal-500">[{time}]</span>{' '}
                              <span className="text-indigo-400 font-bold capitalize">{event.type.replace('_', ' ')}</span>{' '}
                              <span className="text-zinc-650">→</span>{' '}
                              <span className="text-zinc-300 text-[10px]">{event.path}</span>
                            </span>
                            <span className="text-[10px] text-zinc-650 shrink-0 font-sans font-semibold">
                              {actor}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 10: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-sans">Media Library</h2>
                  <p className="text-xs text-zinc-500 mt-1">Manage and copy URLs for all uploaded media assets</p>
                </div>
                
                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative font-sans">
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      className="rounded-lg border border-zinc-850 bg-zinc-900 px-3.5 py-1.5 pl-8 text-xs text-zinc-200 outline-none focus:border-teal-500 w-60 font-sans"
                    />
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" />
                  </div>
                  
                  <div className="flex rounded-lg border border-zinc-850 bg-zinc-900 p-0.5 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => setMediaType('')}
                      className={`rounded px-2.5 py-1 transition-colors ${!mediaType ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      ALL
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`rounded px-2.5 py-1 transition-colors ${mediaType === 'image' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      IMAGES
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`rounded px-2.5 py-1 transition-colors ${mediaType === 'video' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      VIDEOS
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('raw')}
                      className={`rounded px-2.5 py-1 transition-colors ${mediaType === 'raw' ? 'bg-zinc-800 text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      RAW/PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Grid */}
              {!mediaData || mediaData.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20">
                  <FolderOpen className="h-10 w-10 text-zinc-700 mx-auto mb-3 animate-pulse" />
                  <p className="text-xs font-sans text-zinc-500">No media assets matching search criteria found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {mediaData.map((asset) => (
                    <div 
                      key={asset._id} 
                      className="group relative rounded-xl border border-zinc-900 bg-zinc-950/40 overflow-hidden hover:border-teal-500/30 transition-all duration-350 shadow-md flex flex-col"
                    >
                      {/* Image / Video / PDF Preview */}
                      <div className="relative aspect-video w-full bg-zinc-900 flex items-center justify-center overflow-hidden border-b border-zinc-900">
                        {asset.resourceType === 'image' ? (
                          <img
                            src={asset.secureUrl}
                            alt={asset.originalName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : asset.resourceType === 'video' ? (
                          <div className="flex flex-col items-center space-y-1.5">
                            <Film className="h-7 w-7 text-indigo-400 group-hover:animate-pulse" />
                            <span className="text-[10px] font-mono text-zinc-500">Video Asset</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1.5">
                            <FileText className="h-7 w-7 text-teal-400 group-hover:animate-bounce" />
                            <span className="text-[10px] font-mono text-zinc-500">PDF Document</span>
                          </div>
                        )}
                        
                        {/* Format & Size Overlay Badges */}
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span className="rounded bg-zinc-950/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-teal-400 border border-zinc-850">
                            {asset.format?.toUpperCase() || asset.resourceType?.toUpperCase()}
                          </span>
                          <span className="rounded bg-zinc-950/80 px-1.5 py-0.5 font-mono text-[9px] text-zinc-300 border border-zinc-850">
                            {formatBytes(asset.bytes)}
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 font-sans">
                        <div className="space-y-1">
                          <h4 
                            className="text-xs font-semibold text-white truncate" 
                            title={asset.originalName}
                          >
                            {asset.originalName}
                          </h4>
                          <p className="text-[9px] text-zinc-650 font-mono truncate">{asset.publicId}</p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900/60 pt-2">
                          <span className="font-mono">
                            {asset.uploadedAt ? new Date(asset.uploadedAt).toLocaleDateString() : '—'}
                          </span>
                          
                          <div className="flex space-x-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(asset.secureUrl);
                                triggerXp('Copied URL to Clipboard!');
                              }}
                              className="rounded p-1.5 bg-zinc-900 hover:bg-teal-500/10 border border-zinc-850 hover:border-teal-500/20 text-zinc-400 hover:text-teal-400 transition-colors"
                              title="Copy Secure URL"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <a
                              href={asset.secureUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded p-1.5 bg-zinc-900 hover:bg-indigo-500/10 border border-zinc-850 hover:border-indigo-500/20 text-zinc-400 hover:text-indigo-400 transition-colors"
                              title="Open External Link"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this media asset? This will remove it from Cloudinary.')) {
                                  deleteMediaMutation.mutate(asset.publicId);
                                }
                              }}
                              className="rounded p-1.5 bg-zinc-900 hover:bg-red-500/10 border border-zinc-850 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                              title="Delete Asset"
                              disabled={deleteMediaMutation.isPending}
                            >
                              {deleteMediaMutation.isPending && deleteMediaMutation.variables === asset.publicId ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-red-400" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 11: RESUME MANAGER */}
          {activeTab === 'resumes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white font-sans">Resumes</h2>
                  <p className="text-xs text-zinc-500 mt-1">Manage, upload, and toggle active resume versions</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setResumeForm({
                      label: '',
                      resumeFile: null,
                      isActive: false
                    });
                    setModalType('resume');
                  }}
                  className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors font-sans flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Resume</span>
                </button>
              </div>

              {/* Resumes Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/30 font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Label</th>
                      <th className="p-4">File Name & Size</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Uploaded At</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {!resumesData || resumesData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-650 font-mono">
                          No resumes uploaded yet. Click &quot;Add Resume&quot; to upload a PDF version.
                        </td>
                      </tr>
                    ) : (
                      resumesData.map((resItem) => (
                        <tr key={resItem._id} className="hover:bg-zinc-900/20">
                          <td className="p-4 font-semibold text-white">
                            {resItem.label}
                          </td>
                          <td className="p-4 font-mono text-zinc-400">
                            <span className="text-[10px] font-sans truncate block max-w-xs text-zinc-450 mb-0.5" title={resItem.resumeFile?.publicId ? resItem.resumeFile.publicId.split('/').pop() : 'PDF File'}>
                              {resItem.resumeFile?.publicId ? resItem.resumeFile.publicId.split('/').pop() : 'PDF File'}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-950/35 border border-teal-500/10 px-1 py-0.2 rounded">
                              {resItem.resumeFile?.format || 'PDF'}
                            </span>
                            {resItem.resumeFile?.bytes && (
                              <span className="text-[9px] text-zinc-500 ml-1.5">
                                {formatBytes(resItem.resumeFile.bytes)}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {resItem.isActive ? (
                              <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span>ACTIVE</span>
                              </span>
                            ) : (
                              <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-500 border border-zinc-700">
                                INACTIVE
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-mono text-zinc-500">
                            {resItem.createdAt ? new Date(resItem.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="p-4 text-right flex justify-end space-x-2">
                            {!resItem.isActive && (
                              <button
                                type="button"
                                onClick={() => activateResumeMutation.mutate(resItem._id!)}
                                className="rounded px-2.5 py-1 bg-zinc-900 hover:bg-emerald-500/10 border border-zinc-850 hover:border-emerald-500/20 text-zinc-400 hover:text-emerald-400 transition-colors text-[10px] font-mono"
                                title="Set as Active Resume"
                                disabled={activateResumeMutation.isPending}
                              >
                                Activate
                              </button>
                            )}
                            <a
                              href={resItem.resumeFile?.secureUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                              title="View Document"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this resume?')) {
                                  deleteResumeMutation.mutate(resItem._id!);
                                }
                              }}
                              className="rounded p-1 hover:bg-zinc-900 text-red-500 hover:text-red-400"
                              title="Delete Resume"
                              disabled={deleteResumeMutation.isPending}
                            >
                              {deleteResumeMutation.isPending && deleteResumeMutation.variables === resItem._id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      <Footer />
    </div>
  );
}
