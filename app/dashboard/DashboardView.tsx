'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CloudinaryUploadZone from '@/components/features/CloudinaryUploadZone';
import { apiFetch } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import ProfileSection from './components/ProfileSection';
import ResumeSection from './components/ResumeSection';
import { Badge, UserProgressEvent, Project, Experience, Skill, Certification, Portfolio, Resume, CloudinaryAsset } from '@/types';
import {
  User as UserIcon, Bookmark as BookmarkIcon, Award, Shield, Github, Linkedin, Twitter, Globe, Trash2, ExternalLink, Zap, Clock, Sparkles, Save, CheckCircle, Loader2, Key, AlertCircle, Eye, EyeOff, Plus, Pencil, X, Briefcase, FileText, ChevronRight, Cpu, Database, Cloud, BookOpen, Layers, Code, Settings, Brain
} from 'lucide-react';

interface PopulatedBookmark {
  _id: string;
  targetType: 'project' | 'blogpost';
  targetId: string;
  details: {
    title: string;
    summary?: string;
    excerpt?: string;
    coverImageUrl?: string;
    slug: string;
  } | null;
}

interface UserProgressData {
  badges: Badge[];
  recentActivity: UserProgressEvent[];
}

type TabType = 'overview' | 'profile' | 'projects' | 'skills' | 'experience' | 'certifications' | 'resumes' | 'bookmarks' | 'achievements';

export default function DashboardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  
  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tab = searchParams?.get('tab');

  useEffect(() => {
    if (tab) {
      if (tab === 'settings') {
        setActiveTab('profile');
      } else if (tab === 'projects') {
        setActiveTab('projects');
      } else if (tab === 'resumes') {
        setActiveTab('resumes');
      } else if (tab === 'analytics') {
        setActiveTab('overview');
      } else if (tab === 'dashboard') {
        setActiveTab('overview');
      }
    }
  }, [tab]);

  // --- CRUD STATES ---
  // Projects
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectTechStack, setProjectTechStack] = useState('');
  const [projectTags, setProjectTags] = useState('');
  const [projectCoverUrl, setProjectCoverUrl] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectLive, setProjectLive] = useState('');
  const [projectStatus, setProjectStatus] = useState<'draft' | 'published' | 'archived'>('published');
  const [projectFeatured, setProjectFeatured] = useState(false);

  // Skills
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillProficiency, setSkillProficiency] = useState(80);
  const [skillCategory, setSkillCategory] = useState<'frontend' | 'backend' | 'database' | 'devops' | 'cloud' | 'ai' | 'other'>('frontend');

  // Experiences
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expOrg, setExpOrg] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expType, setExpType] = useState<'full-time' | 'part-time' | 'contract' | 'internship' | 'job' | 'education' | 'achievement'>('job');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expResp, setExpResp] = useState('');
  const [expTech, setExpTech] = useState('');

  // Certifications
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certIssueDate, setCertIssueDate] = useState('');
  const [certExpDate, setCertExpDate] = useState('');
  const [certCredId, setCertCredId] = useState('');
  const [certCredUrl, setCertCredUrl] = useState('');

  // Resumes
  const [isAddingResume, setIsAddingResume] = useState(false);
  const [resumeLabel, setResumeLabel] = useState('');
  const [resumeFileAsset, setResumeFileAsset] = useState<CloudinaryAsset | null>(null);
  const [resumeIsActive, setResumeIsActive] = useState(false);

  // AI Resume Parser state
  const [resumeRawText, setResumeRawText] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsedResumeResult, setParsedResumeResult] = useState<any>(null);
  const [resumeParseError, setResumeParseError] = useState('');

  // --- CORE PROFILE & THEME STATES ---
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileGithub, setProfileGithub] = useState('');
  const [profileLinkedin, setProfileLinkedin] = useState('');
  const [profileTwitter, setProfileTwitter] = useState('');
  const [profileWebsite, setProfileWebsite] = useState('');
  
  // Portfolio Theme Settings
  const [portfolioTheme, setPortfolioTheme] = useState<'portfolio-os'>('portfolio-os');
  const [portfolioHeadline, setPortfolioHeadline] = useState('');
  const [portfolioVisibility, setPortfolioVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [portfolioCustomDomain, setPortfolioCustomDomain] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);



  // Sync profile form states when user loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileBio(user.bio || '');
      setProfileGithub(user.socialLinks?.github || '');
      setProfileLinkedin(user.socialLinks?.linkedin || '');
      setProfileTwitter(user.socialLinks?.twitter || '');
      setProfileWebsite(user.socialLinks?.website || '');
    }
  }, [user]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  // --- QUERIES ---

  // Portfolio settings query
  const { data: portfolioSettings, refetch: refetchPortfolio } = useQuery<Portfolio>({
    queryKey: ['portfolio-settings', user?.username],
    queryFn: async () => {
      const res = await apiFetch<Portfolio>(`/portfolios/${user?.username}`);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    enabled: !!user?.username
  });

  // Sync portfolio states when settings fetch
  useEffect(() => {
    if (portfolioSettings) {
      setPortfolioTheme(portfolioSettings.theme || 'portfolio-os');
      setPortfolioHeadline(portfolioSettings.headline || '');
      setPortfolioVisibility(portfolioSettings.visibility || 'public');
      setPortfolioCustomDomain(portfolioSettings.customDomain || '');
    }
  }, [portfolioSettings]);

  // User projects query
  const { data: projects = [], refetch: refetchProjects } = useQuery<Project[]>({
    queryKey: ['my-projects'],
    queryFn: async () => {
      const res = await apiFetch<Project[]>('/projects');
      return res.data || [];
    },
    enabled: !!user
  });

  // User skills query
  const { data: skills = [], refetch: refetchSkills } = useQuery<Skill[]>({
    queryKey: ['my-skills'],
    queryFn: async () => {
      const res = await apiFetch<Skill[]>('/skills');
      return res.data || [];
    },
    enabled: !!user
  });

  // User experiences query
  const { data: experiences = [], refetch: refetchExperiences } = useQuery<Experience[]>({
    queryKey: ['my-experiences'],
    queryFn: async () => {
      const res = await apiFetch<Experience[]>('/experience');
      return res.data || [];
    },
    enabled: !!user
  });

  // User certifications query
  const { data: certifications = [], refetch: refetchCerts } = useQuery<Certification[]>({
    queryKey: ['my-certifications'],
    queryFn: async () => {
      const res = await apiFetch<Certification[]>('/certifications');
      return res.data || [];
    },
    enabled: !!user
  });

  // User resumes query
  const { data: resumes = [], refetch: refetchResumes } = useQuery<Resume[]>({
    queryKey: ['my-resumes'],
    queryFn: async () => {
      const res = await apiFetch<Resume[]>('/resume');
      return res.data || [];
    },
    enabled: !!user
  });

  // Bookmarks query
  const { data: bookmarks } = useQuery<PopulatedBookmark[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const res = await apiFetch<PopulatedBookmark[]>('/users/me/bookmarks');
      return res.data || [];
    },
    enabled: !!user
  });

  // Gamification progress query
  const { data: progress, isLoading: isProgressLoading } = useQuery<UserProgressData>({
    queryKey: ['progress'],
    queryFn: async () => {
      const res = await apiFetch<UserProgressData>('/users/me/progress');
      return res.data || { badges: [], recentActivity: [] };
    },
    enabled: !!user
  });

  // Badges catalog query
  const { data: badgesCatalog } = useQuery<Badge[]>({
    queryKey: ['badges'],
    queryFn: async () => {
      const res = await apiFetch<Badge[]>('/badges');
      return res.data || [];
    },
    enabled: !!user
  });

  // Visitor analytics query
  const { data: analyticsStats } = useQuery<{ totalVisitors: number; activeVisitors: number }>({
    queryKey: ['analytics-stats', user?.username],
    queryFn: async () => {
      const res = await apiFetch<{ totalVisitors: number; activeVisitors: number }>(`/analytics/count?username=${user?.username}`);
      return res.data || { totalVisitors: 0, activeVisitors: 0 };
    },
    enabled: !!user?.username
  });

  // --- MUTATIONS & HANDLERS ---

  // Theme update mutation
  const updateThemeMutation = useMutation({
    mutationFn: async (theme: string) => {
      const res = await apiFetch('/portfolios/me', {
        method: 'PATCH',
        body: JSON.stringify({ theme })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-settings'] });
    }
  });

  // Portfolio and Profile save
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { profile: any; portfolio: any }) => {
      const profileRes = await apiFetch('/users/me/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload.profile)
      });
      if (profileRes.error) throw new Error(profileRes.error);

      const portfolioRes = await apiFetch('/portfolios/me', {
        method: 'PATCH',
        body: JSON.stringify(payload.portfolio)
      });
      if (portfolioRes.error) throw new Error(portfolioRes.error);

      return { profile: profileRes.data, portfolio: portfolioRes.data };
    },
    onSuccess: () => {
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-settings'] });
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      profile: {
        name: profileName,
        bio: profileBio,
        socialLinks: {
          github: profileGithub,
          linkedin: profileLinkedin,
          twitter: profileTwitter,
          website: profileWebsite
        }
      },
      portfolio: {
        headline: portfolioHeadline,
        bio: profileBio,
        theme: portfolioTheme,
        visibility: portfolioVisibility,
        customDomain: portfolioCustomDomain,
        githubUsername: profileGithub
      }
    });
  };



  // Projects CRUD mutations
  const createProjectMutation = useMutation({
    mutationFn: async (proj: any) => {
      const res = await apiFetch('/projects', { method: 'POST', body: JSON.stringify(proj) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchProjects();
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      setIsAddingProject(false);
      resetProjectForm();
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, proj }: { id: string; proj: any }) => {
      const res = await apiFetch(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(proj) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchProjects();
      setEditingProject(null);
      resetProjectForm();
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/projects/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => refetchProjects()
  });

  // Skills CRUD mutations
  const createSkillMutation = useMutation({
    mutationFn: async (sk: any) => {
      const res = await apiFetch('/skills', { method: 'POST', body: JSON.stringify(sk) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchSkills();
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      setIsAddingSkill(false);
      resetSkillForm();
    }
  });

  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, sk }: { id: string; sk: any }) => {
      const res = await apiFetch(`/skills/${id}`, { method: 'PATCH', body: JSON.stringify(sk) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchSkills();
      setEditingSkill(null);
      resetSkillForm();
    }
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/skills/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => refetchSkills()
  });

  // Experiences CRUD mutations
  const createExpMutation = useMutation({
    mutationFn: async (exp: any) => {
      const res = await apiFetch('/experience', { method: 'POST', body: JSON.stringify(exp) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchExperiences();
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      setIsAddingExp(false);
      resetExpForm();
    }
  });

  const updateExpMutation = useMutation({
    mutationFn: async ({ id, exp }: { id: string; exp: any }) => {
      const res = await apiFetch(`/experience/${id}`, { method: 'PATCH', body: JSON.stringify(exp) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchExperiences();
      setEditingExp(null);
      resetExpForm();
    }
  });

  const deleteExpMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/experience/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => refetchExperiences()
  });

  // Certifications CRUD
  const createCertMutation = useMutation({
    mutationFn: async (cert: any) => {
      const res = await apiFetch('/certifications', { method: 'POST', body: JSON.stringify(cert) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchCerts();
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      setIsAddingCert(false);
      resetCertForm();
    }
  });

  const updateCertMutation = useMutation({
    mutationFn: async ({ id, cert }: { id: string; cert: any }) => {
      const res = await apiFetch(`/certifications/${id}`, { method: 'PATCH', body: JSON.stringify(cert) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchCerts();
      setEditingCert(null);
      resetCertForm();
    }
  });

  const deleteCertMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/certifications/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => refetchCerts()
  });

  // Resumes CRUD
  const createResumeMutation = useMutation({
    mutationFn: async (resData: any) => {
      const res = await apiFetch('/resume', { method: 'POST', body: JSON.stringify(resData) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchResumes();
      setIsAddingResume(false);
      setResumeLabel('');
      setResumeFileAsset(null);
      setResumeIsActive(false);
    }
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/resume/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => refetchResumes()
  });

  const toggleResumeActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiFetch(`/resume/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive }) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => refetchResumes()
  });

  // Bookmark Toggle
  const removeBookmarkMutation = useMutation({
    mutationFn: async ({ targetType, targetId }: { targetType: 'project' | 'blogpost'; targetId: string }) => {
      const res = await apiFetch('/users/me/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ targetType, targetId })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });

  // AI Resume Parsing handler
  const handleAIResumeParse = async () => {
    const text = resumeRawText.trim();
    if (!text) return;
    setIsParsingResume(true);
    setResumeParseError('');
    setParsedResumeResult(null);

    try {
      const res = await apiFetch<any>('/ai/parse-resume', {
        method: 'POST',
        body: JSON.stringify({ resumeText: text })
      });
      
      if (res.error) {
        setResumeParseError(res.error);
      } else if (res.data) {
        setParsedResumeResult(res.data);
      }
    } catch {
      setResumeParseError('Network error parsing resume. Please configure GEMINI_API_KEY.');
    } finally {
      setIsParsingResume(false);
    }
  };

  // Import parsed AI elements
  const handleImportParsedData = async () => {
    if (!parsedResumeResult) return;

    // 1. Import skills
    if (parsedResumeResult.skills && Array.isArray(parsedResumeResult.skills)) {
      for (const skillName of parsedResumeResult.skills) {
        await createSkillMutation.mutateAsync({
          name: skillName,
          proficiency: 80,
          category: 'other'
        });
      }
    }

    // 2. Import experiences
    if (parsedResumeResult.experience && Array.isArray(parsedResumeResult.experience)) {
      for (const exp of parsedResumeResult.experience) {
        await createExpMutation.mutateAsync({
          organization: exp.organization || 'Org Name',
          role: exp.role || 'Role',
          type: 'full-time',
          startDate: exp.startDate || new Date().toISOString().split('T')[0],
          endDate: exp.endDate || '',
          description: exp.description || ''
        });
      }
    }

    // Reset AI state
    setParsedResumeResult(null);
    setResumeRawText('');
    alert('Resume data successfully parsed and imported into your profile!');
  };

  // Form Resets
  const resetProjectForm = () => {
    setProjectTitle('');
    setProjectSummary('');
    setProjectDesc('');
    setProjectCategory('');
    setProjectTechStack('');
    setProjectTags('');
    setProjectCoverUrl('');
    setProjectGithub('');
    setProjectLive('');
    setProjectStatus('published');
    setProjectFeatured(false);
  };

  const resetSkillForm = () => {
    setSkillName('');
    setSkillProficiency(80);
    setSkillCategory('frontend');
  };

  const resetExpForm = () => {
    setExpOrg('');
    setExpRole('');
    setExpType('job');
    setExpStartDate('');
    setExpEndDate('');
    setExpDesc('');
    setExpResp('');
    setExpTech('');
  };

  const resetCertForm = () => {
    setCertName('');
    setCertOrg('');
    setCertIssueDate('');
    setCertExpDate('');
    setCertCredId('');
    setCertCredUrl('');
  };

  const loadEditingProject = (p: Project) => {
    setEditingProject(p);
    setProjectTitle(p.title);
    setProjectSummary(p.summary);
    setProjectDesc(p.description || '');
    setProjectCategory(p.category || '');
    setProjectTechStack(p.techStack.join(', '));
    setProjectTags(p.tags?.join(', ') || '');
    setProjectCoverUrl(p.coverImageUrl || '');
    setProjectGithub(p.links?.github || '');
    setProjectLive(p.links?.liveDemo || '');
    setProjectStatus(p.status || 'published');
    setProjectFeatured(p.featured || false);
  };

  const loadEditingSkill = (s: Skill) => {
    setEditingSkill(s);
    setSkillName(s.name);
    setSkillProficiency(s.proficiency);
    setSkillCategory(s.category || 'frontend');
  };

  const loadEditingExp = (e: Experience) => {
    setEditingExp(e);
    setExpOrg(e.organization);
    setExpRole(e.role);
    setExpType(e.type || 'job');
    setExpStartDate(e.startDate ? new Date(e.startDate).toISOString().split('T')[0] : '');
    setExpEndDate(e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : '');
    setExpDesc(e.description || '');
    setExpResp(e.responsibilities?.join('\n') || '');
    setExpTech(e.technologiesUsed?.join(', ') || '');
  };

  const loadEditingCert = (c: Certification) => {
    setEditingCert(c);
    setCertName(c.title);
    setCertOrg(c.issuer);
    setCertIssueDate(c.issueDate ? new Date(c.issueDate).toISOString().split('T')[0] : '');
    setCertExpDate(c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '');
    setCertCredId('');
    setCertCredUrl(c.credentialUrl || '');
  };

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-300">
        <Loader2 className="h-10 w-10 animate-spin text-teal-400 mb-4" />
        <p className="text-sm font-mono tracking-wide">Syncing secure SaaS session...</p>
      </div>
    );
  }

  // XP calculations removed

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500/20">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="mb-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full border-2 border-teal-500/30 overflow-hidden bg-zinc-800 flex items-center justify-center">
                {user?.profileImage?.secureUrl || (user?.avatarUrl && !user.avatarUrl.includes('images.unsplash.com')) ? (
                  <img src={user.profileImage?.secureUrl || user.avatarUrl} alt={user?.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-white font-mono font-bold text-lg select-none">
                    {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{user?.name}</h1>
                <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 mt-1">
                  <span>@{user?.username}</span>
                  <span className="text-zinc-700">|</span>
                  <span className="capitalize text-teal-400 font-semibold">{user?.role} Plan</span>
                </p>
              </div>
            </div>

            {/* Quick stats / Analytics bar */}
            <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-center">
              {/* Analytics Summary */}
              {analyticsStats && (
                <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 px-5 py-3 min-w-[165px] flex flex-col justify-center text-xs">
                  <span className="text-zinc-500 font-mono mb-1 block">VISITOR METRICS</span>
                  <p className="text-white text-base font-bold flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-teal-400" />
                    <span>{analyticsStats.totalVisitors} Total Unique</span>
                  </p>
                  <span className="text-teal-400 font-mono mt-1 text-[10px] block">● {analyticsStats.activeVisitors} active last 5m</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Dashboard Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="flex flex-row overflow-x-auto lg:flex-col lg:overflow-x-visible space-x-1.5 lg:space-x-0 lg:space-y-1.5 pb-3 lg:pb-0 scrollbar-none">
              {[
                { tab: 'overview', label: 'Console Overview', icon: <Layers className="h-4 w-4" /> },
                { tab: 'profile', label: 'Profile', icon: <UserIcon className="h-4 w-4" /> },
                { tab: 'projects', label: 'Projects Showcase', icon: <Code className="h-4 w-4" /> },
                { tab: 'skills', label: 'Technical Skills', icon: <Cpu className="h-4 w-4" /> },
                { tab: 'experience', label: 'Work History', icon: <Briefcase className="h-4 w-4" /> },
                { tab: 'certifications', label: 'Certifications', icon: <Award className="h-4 w-4" /> },
                { tab: 'resumes', label: 'AI Resume Center', icon: <FileText className="h-4 w-4" /> },
                { tab: 'bookmarks', label: 'Saved Bookmarked', icon: <BookmarkIcon className="h-4 w-4" /> },
                { tab: 'achievements', label: 'Achievements', icon: <Sparkles className="h-4 w-4" /> }
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab as TabType);
                    setEditingProject(null); setIsAddingProject(false);
                    setEditingSkill(null); setIsAddingSkill(false);
                    setEditingExp(null); setIsAddingExp(false);
                    setEditingCert(null); setIsAddingCert(false);
                    setIsAddingResume(false);
                  }}
                  className={`whitespace-nowrap shrink-0 flex items-center space-x-3 rounded-lg px-4 py-3 text-xs font-mono font-semibold transition-all border lg:w-full ${
                    activeTab === item.tab
                      ? 'bg-zinc-900 text-teal-400 border-teal-500/20 font-bold border-l-2 border-l-teal-500'
                      : 'text-zinc-400 bg-transparent border-transparent hover:bg-zinc-900/40 hover:text-zinc-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Work Content Panel */}
            <div className="lg:col-span-3 min-w-0">

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md">
                    <h2 className="text-lg font-bold text-white mb-2">Control Center Console</h2>
                    <p className="text-xs text-zinc-400 mb-6">Manage your multi-tenant configurations and explore your public workspace.</p>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="border border-zinc-850 bg-zinc-950/50 p-5 rounded-xl text-center">
                        <Globe className="h-8 w-8 text-teal-400 mx-auto mb-3" />
                        <h4 className="text-white text-sm font-bold">Public Domain Link</h4>
                        <p className="text-xs text-zinc-500 mt-1">Your portfolio is active live at this URL.</p>
                        <Link href={`/p/${user?.username}`} target="_blank" className="mt-4 inline-flex items-center gap-1.5 text-xs text-teal-400 font-bold hover:underline font-mono bg-teal-950/30 border border-teal-500/20 px-3 py-1.5 rounded-lg">
                          <span>View /p/{user?.username}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <div className="border border-zinc-850 bg-zinc-950/50 p-5 rounded-xl text-center flex flex-col items-center justify-between">
                        <div className="w-full">
                          <Settings className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                          <h4 className="text-white text-sm font-bold">Theme Setting</h4>
                          <p className="text-xs text-zinc-500 mt-1 mb-3">Select and configure your active portfolio theme.</p>
                        </div>
                        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-teal-400 font-mono text-center">
                          Portfolio OS (Active)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary lists */}
                  <div className="grid gap-6 sm:grid-cols-3 text-xs">
                    <div className="border border-zinc-900 bg-zinc-950/30 p-4 rounded-xl text-center">
                      <p className="text-2xl font-extrabold text-teal-400">{projects.length}</p>
                      <p className="text-zinc-500 font-mono mt-1 uppercase">Published Projects</p>
                    </div>
                    <div className="border border-zinc-900 bg-zinc-950/30 p-4 rounded-xl text-center">
                      <p className="text-2xl font-extrabold text-purple-400">{skills.length}</p>
                      <p className="text-zinc-500 font-mono mt-1 uppercase">Skills Recorded</p>
                    </div>
                    <div className="border border-zinc-900 bg-zinc-950/30 p-4 rounded-xl text-center">
                      <p className="text-2xl font-extrabold text-emerald-400">{experiences.length}</p>
                      <p className="text-zinc-500 font-mono mt-1 uppercase">Experience Milestones</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PROFILE & THEME SETTINGS TAB */}
              {activeTab === 'profile' && user && (
                <ProfileSection
                  user={user}
                  portfolioSettings={portfolioSettings}
                  refetchPortfolio={refetchPortfolio}
                />
              )}

              {/* PROJECTS MANAGEMENT TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Showcase Compilation</h2>
                    {!isAddingProject && !editingProject && (
                      <button onClick={() => { setIsAddingProject(true); resetProjectForm(); }} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 px-4 py-2 rounded-lg text-xs font-mono font-bold">
                        <Plus className="h-4 w-4" />
                        <span>Add Project</span>
                      </button>
                    )}
                  </div>

                  {/* Add/Edit Project Form */}
                  {(isAddingProject || editingProject) && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const techStack = projectTechStack.split(',').map(s => s.trim()).filter(Boolean);
                        const tags = projectTags.split(',').map(s => s.trim()).filter(Boolean);
                        const payload = {
                          title: projectTitle,
                          summary: projectSummary,
                          description: projectDesc,
                          category: projectCategory,
                          techStack,
                          tags,
                          coverImageUrl: projectCoverUrl,
                          links: { github: projectGithub, liveDemo: projectLive },
                          status: projectStatus,
                          featured: projectFeatured
                        };
                        if (editingProject) {
                          updateProjectMutation.mutate({ id: editingProject._id!, proj: payload });
                        } else {
                          createProjectMutation.mutate(payload);
                        }
                      }}
                      className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-4"
                    >
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                        <h3 className="text-sm font-bold font-mono text-white">{editingProject ? 'Edit Project compilation' : 'Create New Project'}</h3>
                        <button type="button" onClick={() => { setEditingProject(null); setIsAddingProject(false); }} className="text-zinc-500 hover:text-zinc-300">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-zinc-400 mb-1">Project Title *</label>
                          <input type="text" required value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Category / Group (e.g. Full Stack Web) *</label>
                          <input type="text" required value={projectCategory} onChange={e => setProjectCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Cover Image URL *</label>
                          <input type="text" required value={projectCoverUrl} onChange={e => setProjectCoverUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-zinc-400 mb-1">Summary *</label>
                          <input type="text" required value={projectSummary} onChange={e => setProjectSummary(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-zinc-400 mb-1">Detailed Case Study Description</label>
                          <textarea rows={4} value={projectDesc} onChange={e => setProjectDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500 resize-none" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Tech Stack (comma separated) *</label>
                          <input type="text" required value={projectTechStack} onChange={e => setProjectTechStack(e.target.value)} placeholder="React.js, Node.js, Express.js" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Tags (comma separated)</label>
                          <input type="text" value={projectTags} onChange={e => setProjectTags(e.target.value)} placeholder="SaaS, Multi-Tenant, REST" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">GitHub repository Link</label>
                          <input type="text" value={projectGithub} onChange={e => setProjectGithub(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Live URL Link</label>
                          <input type="text" value={projectLive} onChange={e => setProjectLive(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white outline-none focus:border-teal-500" />
                        </div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                            <input type="checkbox" checked={projectFeatured} onChange={e => setProjectFeatured(e.target.checked)} className="rounded border-zinc-800 bg-zinc-950 text-teal-500" />
                            <span>Mark as Featured</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">Status:</span>
                            <select value={projectStatus} onChange={e => setProjectStatus(e.target.value as any)} className="bg-zinc-950 border border-zinc-850 rounded p-1 text-xs text-zinc-300">
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-950 text-xs font-mono font-bold py-2.5 rounded-lg transition-all mt-4">
                        Save Project Compilation
                      </button>
                    </form>
                  )}

                  {/* Projects Listing */}
                  {!isAddingProject && !editingProject && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {projects.map((project) => (
                        <div key={project._id} className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-5 relative hover:border-zinc-800 transition-colors flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-teal-400 font-mono border border-teal-500/20 px-2 py-0.5 rounded bg-teal-950/15 uppercase font-bold">{project.category}</span>
                            <h4 className="text-white text-base font-bold mt-2">{project.title}</h4>
                            <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{project.summary}</p>
                          </div>
                          <div className="mt-6 flex justify-end gap-2 border-t border-zinc-900 pt-3">
                            <button onClick={() => loadEditingProject(project)} className="p-2 text-zinc-400 hover:text-white rounded border border-zinc-850 hover:bg-zinc-900 transition-all">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => { if(confirm('Delete project compilation?')) deleteProjectMutation.mutate(project._id!); }} className="p-2 text-red-500 hover:text-red-400 rounded border border-zinc-850 hover:bg-red-950/10 transition-all">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TECHNICAL SKILLS TAB */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Technical Skills Grid</h2>
                    {!isAddingSkill && !editingSkill && (
                      <button onClick={() => { setIsAddingSkill(true); resetSkillForm(); }} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 px-4 py-2 rounded-lg text-xs font-mono font-bold">
                        <Plus className="h-4 w-4" />
                        <span>Add Skill</span>
                      </button>
                    )}
                  </div>

                  {/* Skill form */}
                  {(isAddingSkill || editingSkill) && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const payload = { name: skillName, proficiency: skillProficiency, category: skillCategory };
                        if (editingSkill) {
                          updateSkillMutation.mutate({ id: editingSkill._id!, sk: payload });
                        } else {
                          createSkillMutation.mutate(payload);
                        }
                      }}
                      className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-5 space-y-4 max-w-md"
                    >
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <h4 className="text-xs font-bold font-mono text-white">Manage Technical Skill</h4>
                        <button type="button" onClick={() => { setEditingSkill(null); setIsAddingSkill(false); }} className="text-zinc-500">
                          <X className="h-4.5 w-4.5" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Skill Name *</label>
                        <input type="text" required value={skillName} onChange={e => setSkillName(e.target.value)} placeholder="e.g. JavaScript" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs outline-none focus:border-teal-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Skill Category *</label>
                        <select value={skillCategory} onChange={e => setSkillCategory(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs outline-none focus:border-teal-500 font-mono">
                          <option value="frontend">Frontend Development</option>
                          <option value="backend">Backend Systems</option>
                          <option value="database">Database & Caching</option>
                          <option value="cloud">Cloud & Infrastructure</option>
                          <option value="other">Other Toolings</option>
                        </select>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                          <span>Proficiency *</span>
                          <span className="text-teal-400 font-bold">{skillProficiency}%</span>
                        </div>
                        <input type="range" min="10" max="100" value={skillProficiency} onChange={e => setSkillProficiency(Number(e.target.value))} className="w-full accent-teal-500" />
                      </div>
                      <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-950 py-2 rounded text-xs font-mono font-bold">Save Skill Node</button>
                    </form>
                  )}

                  {/* Skills Grid listing */}
                  {!isAddingSkill && !editingSkill && (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {skills.map((skill) => (
                        <div key={skill._id} className="border border-zinc-900 bg-zinc-950/20 p-4 rounded-xl flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono text-teal-400 uppercase tracking-wide">{skill.category}</span>
                            <h4 className="text-white text-sm font-bold truncate">{skill.name}</h4>
                            <span className="text-xs text-zinc-500 font-mono">{skill.proficiency}%</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => loadEditingSkill(skill)} className="p-1.5 text-zinc-500 hover:text-white rounded border border-zinc-850">
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button onClick={() => { if(confirm('Delete skill?')) deleteSkillMutation.mutate(skill._id!); }} className="p-1.5 text-red-500 hover:text-red-400 rounded border border-zinc-850">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* WORK HISTORY / EXPERIENCES TAB */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Work Milestones</h2>
                    {!isAddingExp && !editingExp && (
                      <button onClick={() => { setIsAddingExp(true); resetExpForm(); }} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 px-4 py-2 rounded-lg text-xs font-mono font-bold">
                        <Plus className="h-4 w-4" />
                        <span>Add Experience</span>
                      </button>
                    )}
                  </div>

                  {/* Experience form */}
                  {(isAddingExp || editingExp) && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const responsibilities = expResp.split('\n').map(s => s.trim()).filter(Boolean);
                        const technologiesUsed = expTech.split(',').map(s => s.trim()).filter(Boolean);
                        const payload = {
                          organization: expOrg,
                          role: expRole,
                          type: expType,
                          startDate: expStartDate,
                          endDate: expEndDate || null,
                          description: expDesc,
                          responsibilities,
                          technologiesUsed
                        };
                        if (editingExp) {
                          updateExpMutation.mutate({ id: editingExp._id!, exp: payload });
                        } else {
                          createExpMutation.mutate(payload);
                        }
                      }}
                      className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 space-y-4"
                    >
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                        <h4 className="text-sm font-bold font-mono text-white">Manage Experience Record</h4>
                        <button type="button" onClick={() => { setEditingExp(null); setIsAddingExp(false); }} className="text-zinc-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Organization *</label>
                          <input type="text" required value={expOrg} onChange={e => setExpOrg(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Role *</label>
                          <input type="text" required value={expRole} onChange={e => setExpRole(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Experience Type *</label>
                          <select value={expType} onChange={e => setExpType(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500 font-mono">
                            <option value="job">Job</option>
                            <option value="internship">Internship</option>
                            <option value="education">Education</option>
                            <option value="achievement">Achievement</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Technologies Used (comma separated)</label>
                          <input type="text" value={expTech} onChange={e => setExpTech(e.target.value)} placeholder="React, Express, AWS" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Start Date *</label>
                          <input type="date" required value={expStartDate} onChange={e => setExpStartDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500 text-zinc-350" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">End Date (leave blank if present)</label>
                          <input type="date" value={expEndDate} onChange={e => setExpEndDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500 text-zinc-350" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-zinc-400 mb-1">Description *</label>
                          <textarea rows={3} required value={expDesc} onChange={e => setExpDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500 resize-none" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-zinc-400 mb-1">Responsibilities (newline separated bullets)</label>
                          <textarea rows={4} value={expResp} onChange={e => setExpResp(e.target.value)} placeholder="Led development of multi-tenant SaaS dashboard&#10;Integrated AI resume parsers via API" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500 resize-none" />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-950 py-2.5 rounded-lg text-xs font-mono font-bold transition-all">Save Experience compilation</button>
                    </form>
                  )}

                  {/* Experience timeline list */}
                  {!isAddingExp && !editingExp && (
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp._id} className="border border-zinc-900 bg-zinc-950/20 p-5 rounded-xl flex items-start justify-between gap-6">
                          <div>
                            <span className="text-[10px] text-teal-400 font-mono uppercase tracking-wide">{exp.type}</span>
                            <h4 className="text-white text-base font-bold mt-1">{exp.role} @ <span className="text-zinc-300 font-medium">{exp.organization}</span></h4>
                            <p className="text-xs text-zinc-400 mt-2 font-serif">{exp.description}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => loadEditingExp(exp)} className="p-2 text-zinc-400 hover:text-white rounded border border-zinc-850">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => { if(confirm('Delete experience?')) deleteExpMutation.mutate(exp._id!); }} className="p-2 text-red-500 hover:text-red-400 rounded border border-zinc-850 hover:bg-red-950/10">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CERTIFICATIONS TAB */}
              {activeTab === 'certifications' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Credentials</h2>
                    {!isAddingCert && !editingCert && (
                      <button onClick={() => { setIsAddingCert(true); resetCertForm(); }} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 px-4 py-2 rounded-lg text-xs font-mono font-bold">
                        <Plus className="h-4 w-4" />
                        <span>Add Certification</span>
                      </button>
                    )}
                  </div>

                  {/* Cert Form */}
                  {(isAddingCert || editingCert) && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const payload = {
                          title: certName,
                          issuer: certOrg,
                          issueDate: certIssueDate,
                          expiryDate: certExpDate || null,
                          credentialUrl: certCredUrl,
                          imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
                          skills: [],
                          category: 'cloud'
                        };
                        if (editingCert) {
                          updateCertMutation.mutate({ id: editingCert._id!, cert: payload });
                        } else {
                          createCertMutation.mutate(payload);
                        }
                      }}
                      className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 space-y-4"
                    >
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                        <h4 className="text-sm font-bold font-mono text-white">Manage Certification</h4>
                        <button type="button" onClick={() => { setEditingCert(null); setIsAddingCert(false); }} className="text-zinc-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Certification Name *</label>
                          <input type="text" required value={certName} onChange={e => setCertName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Issuing Organization *</label>
                          <input type="text" required value={certOrg} onChange={e => setCertOrg(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Issue Date *</label>
                          <input type="date" required value={certIssueDate} onChange={e => setCertIssueDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500 text-zinc-350" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Expiration Date</label>
                          <input type="date" value={certExpDate} onChange={e => setCertExpDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500 text-zinc-350" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Credential ID</label>
                          <input type="text" value={certCredId} onChange={e => setCertCredId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">Credential URL Link</label>
                          <input type="text" value={certCredUrl} onChange={e => setCertCredUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs outline-none focus:border-teal-500" />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-zinc-950 py-2.5 rounded-lg text-xs font-mono font-bold transition-all">Save Credential</button>
                    </form>
                  )}

                  {/* Cert Listing */}
                  {!isAddingCert && !editingCert && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {certifications.map(cert => (
                        <div key={cert._id} className="border border-zinc-900 bg-zinc-950/20 p-5 rounded-xl flex items-center justify-between gap-6">
                          <div>
                            <h4 className="text-white text-sm font-bold">{cert.title}</h4>
                            <p className="text-xs text-zinc-550 mt-1">{cert.issuer}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => loadEditingCert(cert)} className="p-2 text-zinc-400 hover:text-white rounded border border-zinc-850">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => { if(confirm('Delete certification?')) deleteCertMutation.mutate(cert._id!); }} className="p-2 text-red-500 hover:text-red-400 rounded border border-zinc-850 hover:bg-red-950/10">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* RESUMES & AI PARSING TAB */}
              {activeTab === 'resumes' && (
                <ResumeSection
                  resumes={resumes}
                  refetchResumes={refetchResumes}
                />
              )}

              {/* BOOKMARKS TAB */}
              {activeTab === 'bookmarks' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white mb-2">Saved Case Studies & Articles</h2>
                    <p className="text-xs text-zinc-450 mb-6">Explore the resources bookmarked for study.</p>

                    {!bookmarks || bookmarks.length === 0 ? (
                      <div className="text-center py-12 text-xs font-mono text-zinc-600 border border-dashed border-zinc-900 rounded-lg">
                        No bookmarks saved. Check out public portfolios and articles to save them here.
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {bookmarks.map((bm) => {
                          if (!bm.details) return null;

                          return (
                            <div
                              key={bm._id}
                              className="rounded-xl border border-zinc-855 bg-zinc-950/10 p-5 flex flex-col justify-between"
                            >
                              <div>
                                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wide">{bm.targetType}</span>
                                <h3 className="text-sm font-bold text-white mt-1">{bm.details.title}</h3>
                                <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">{bm.details.summary || bm.details.excerpt}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between">
                                <Link
                                  href={bm.targetType === 'project' ? `/projects/${bm.details.slug}` : `/blog/${bm.details.slug}`}
                                  className="inline-flex items-center space-x-1 text-xs text-teal-400 font-semibold hover:underline"
                                >
                                  <span>Review Node</span>
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                                <button
                                  onClick={() => removeBookmarkMutation.mutate({ targetType: bm.targetType, targetId: bm.targetId })}
                                  disabled={removeBookmarkMutation.isPending}
                                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-red-500/70 hover:text-red-400 hover:bg-red-950/10 transition-colors"
                                  title="Remove Bookmark"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ACHIEVEMENTS TAB */}
              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  
                  {/* Badges Catalog */}
                  <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white mb-2">Achievement Badges</h2>
                    <p className="text-xs text-zinc-400 mb-6">Complete milestones to unlock achievements.</p>

                    {isProgressLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 text-teal-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {badgesCatalog?.map((badge) => {
                          const isUnlocked = progress?.badges.some(b => b.key === badge.key);

                          return (
                            <div
                              key={badge.key}
                              className={`flex items-start space-x-4 p-4 rounded-xl border transition-all ${
                                isUnlocked
                                  ? 'border-teal-500/30 bg-teal-950/5 text-white shadow-md shadow-teal-950/10'
                                  : 'border-zinc-900 bg-zinc-950/40 opacity-50 grayscale'
                              }`}
                            >
                              <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl relative shrink-0">
                                <span>{badge.iconUrl}</span>
                                {isUnlocked && (
                                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-teal-500 border border-zinc-950 flex items-center justify-center">
                                    <Sparkles className="h-2 w-2 text-zinc-950" />
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="text-sm font-bold truncate">{badge.title}</h3>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed mt-1">{badge.description}</p>
                                <div className="mt-2 flex items-center space-x-1.5 text-[10px] font-mono text-zinc-500">
                                  <span>Task:</span>
                                  <span className="text-zinc-400">{badge.criteria}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
