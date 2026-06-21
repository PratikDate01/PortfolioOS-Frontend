'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { 
  Github, Star, GitFork, ExternalLink, Code2, MapPin, 
  Building, Link2, Calendar, GitCommit, GitPullRequest, 
  PlusCircle, Award, AlertCircle, Layers, Cpu, Database,
  Sparkles, Clock, Compass, Info
} from 'lucide-react';

interface GitHubStats {
  profile: {
    username: string;
    name: string;
    avatarUrl: string;
    profileUrl: string;
    publicRepos: number;
    followers: number;
    following: number;
    bio: string | null;
    company: string | null;
    location: string | null;
    blog: string | null;
    createdAt: string;
    publicGists: number;
    totalStars: number;
    totalForks: number;
    contributionStatus: string;
    lastActivity: string;
  };
  topRepos: {
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
    language: string | null;
    topics: string[];
    updatedAt: string;
  }[];
  languages: { name: string; percentage: number }[];
  recentActivity: {
    id: string;
    type: string;
    repoName: string;
    repoUrl: string;
    message: string;
    createdAt: string;
  }[];
  scores?: {
    developerProfile: number;
    activity: number;
    contribution: number;
    techStack: string[];
    repositoryQualityScore: number;
    openSourceScore: number;
    githubHealthScore: number;
    githubHealthLevel: string;
    developerType: string;
    primaryFocus: string;
    activityLevel: string;
    recruiterSummary: string;
  };
  lastUpdated: string;
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Jupyter: '#DA5B0B',
  Notebook: '#DA5B0B',
};

const getActivityConfig = (type: string) => {
  switch (type) {
    case 'PushEvent':
      return {
        icon: GitCommit,
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/20',
      };
    case 'PullRequestEvent':
      return {
        icon: GitPullRequest,
        bgColor: 'bg-purple-500/10',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500/20',
      };
    case 'IssuesEvent':
      return {
        icon: AlertCircle,
        bgColor: 'bg-amber-500/10',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/20',
      };
    case 'WatchEvent':
      return {
        icon: Star,
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/20',
      };
    case 'CreateEvent':
      return {
        icon: PlusCircle,
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/20',
      };
    case 'ForkEvent':
      return {
        icon: GitFork,
        bgColor: 'bg-pink-500/10',
        textColor: 'text-pink-400',
        borderColor: 'border-pink-500/20',
      };
    case 'ReleaseEvent':
      return {
        icon: Award,
        bgColor: 'bg-rose-500/10',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/20',
      };
    default:
      return {
        icon: GitFork,
        bgColor: 'bg-zinc-500/10',
        textColor: 'text-zinc-400',
        borderColor: 'border-zinc-500/20',
      };
  }
};

const getRelativeTime = (dateString: string) => {
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
};

const formatMemberSince = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  } catch {
    return 'Unknown';
  }
};

export default function GitHubStats({ username }: { username?: string }) {
  const { data: stats, isLoading, isError } = useQuery<GitHubStats>({
    queryKey: ['github-stats', username],
    queryFn: async () => {
      const url = `/github/stats` + (username ? `?username=${encodeURIComponent(username)}` : '');
      const res = await apiFetch<GitHubStats>(url);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-6 w-48 rounded bg-zinc-800" />
                <div className="h-4 w-72 rounded bg-zinc-800" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="h-96 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 lg:col-span-8" />
              <div className="h-96 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 lg:col-span-4" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Handle Empty State & Error
  const hasNoGitHub = isError || !stats || !stats.profile || !stats.profile.username || stats.profile.username === 'N/A';

  if (hasNoGitHub) {
    return (
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-12 backdrop-blur-md text-center max-w-lg mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto mb-4">
              <Github className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-2">GitHub profile not connected.</h3>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
              This developer profile is not connected to GitHub. Live stats, activity timeline, and technical ratings are unavailable.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Extract variables with defaults
  const profile = stats.profile;
  const topRepos = stats.topRepos || [];
  const languages = stats.languages || [];
  const recentActivity = stats.recentActivity || [];
  const scores = stats.scores || {
    developerProfile: 0,
    activity: 0,
    contribution: 0,
    techStack: [],
    repositoryQualityScore: 0,
    openSourceScore: 0,
    githubHealthScore: 0,
    githubHealthLevel: 'Developing',
    developerType: 'Developer',
    primaryFocus: 'Web Development',
    activityLevel: 'Low',
    recruiterSummary: 'GitHub activity analysis is currently loading.'
  };

  // Health circular gauge calculation
  const healthScore = scores.githubHealthScore || 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Github className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">GitHub Intelligence Center</h2>
            </div>
            <p className="text-zinc-400 text-sm">
              Live developer activity, repository quality, contribution metrics, and technology insights.
            </p>
          </div>
          <span className="text-xs text-zinc-600 font-mono">
            Synced {stats.lastUpdated ? getRelativeTime(stats.lastUpdated) : 'recently'}
          </span>
        </motion.div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* LEFT: Developer Card & Recruiter Insights (8 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            {/* Developer Card (Section 2 & 7) */}
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-6 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between h-full">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
              
              <div>
                {/* Profile Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {profile.avatarUrl ? (
                      <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer" className="relative group/avatar block flex-shrink-0">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-zinc-700/50 transition-all duration-300 group-hover/avatar:border-teal-500/50 group-hover/avatar:scale-105"
                        />
                      </a>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl border border-zinc-850 bg-zinc-900 flex items-center justify-center text-zinc-650 flex-shrink-0">
                        <Github className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                        {profile.name}
                        <span className="text-xs font-mono font-medium text-zinc-500">@{profile.username}</span>
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-400 font-mono">
                          <Cpu className="h-3 w-3" />
                          {scores.developerType}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 font-mono">
                          <Compass className="h-3 w-3" />
                          {scores.primaryFocus}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 font-mono">
                          <Sparkles className="h-3 w-3 animate-pulse" />
                          Activity: {scores.activityLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:self-start inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white"
                  >
                    <span>View GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {profile.bio && (
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6 italic border-l-2 border-zinc-800 pl-4 py-1">
                    &ldquo;{profile.bio}&rdquo;
                  </p>
                )}

                {/* Recruiter Insights Summary Panel (Section 7) */}
                <div className="rounded-xl border border-teal-500/20 bg-teal-950/5 p-4 relative overflow-hidden mb-6">
                  <div className="absolute top-0 right-0 p-3 opacity-15">
                    <Sparkles className="h-10 w-10 text-teal-400" />
                  </div>
                  <h4 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    Recruiter Intelligence Insights
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {scores.recruiterSummary}
                  </p>
                </div>
              </div>

              {/* Profile Location & Company Metadata footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-900 text-xs text-zinc-500">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-zinc-650" />
                    <span className="truncate">{profile.location}</span>
                  </div>
                )}
                {profile.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-zinc-650" />
                    <span className="truncate">{profile.company}</span>
                  </div>
                )}
                {profile.blog && (
                  <div className="flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-zinc-650" />
                    <a
                      href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-teal-400 hover:underline"
                    >
                      {profile.blog.replace(/(^\w+:|^)\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: GitHub Health Score & Contribution Health (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col"
          >
            {/* Health Score Gauge (Section 8 & 4) */}
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-6 backdrop-blur-md flex flex-col items-center justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
              
              <div className="text-center w-full">
                <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  GitHub Health Rating
                </h4>

                {/* SVG Radial Gauge */}
                <div className="relative flex items-center justify-center h-28 w-28 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="stroke-zinc-900"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="stroke-teal-500"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-zinc-100">{healthScore}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">/ 100</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                    scores.githubHealthLevel === 'Excellent' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                    scores.githubHealthLevel === 'Good' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-zinc-500/10 text-zinc-400 border-zinc-800'
                  }`}>
                    {scores.githubHealthLevel}
                  </span>
                </div>
              </div>

              {/* Contribution Health Breakdown Metrics (Section 4) */}
              <div className="w-full space-y-3 pt-4 border-t border-zinc-900">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 mb-1">
                    <span>Contribution Score</span>
                    <span className="text-zinc-200">{scores.contribution}/100</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: `${scores.contribution}%` }} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 mb-1">
                    <span>Activity Consistency</span>
                    <span className="text-zinc-200">{scores.activity}/100</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${scores.activity}%` }} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 mb-1">
                    <span>Repository Quality</span>
                    <span className="text-zinc-200">{scores.repositoryQualityScore}/100</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${scores.repositoryQualityScore}%` }} />
                  </div>
                </div>

                {/* Metric 4 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 mb-1">
                    <span>Open Source Score</span>
                    <span className="text-zinc-200">{scores.openSourceScore}/100</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${scores.openSourceScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* SECTION 1: GitHub Overview Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
        >
          {/* Stat 1 */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center hover:border-zinc-800 transition-colors">
            <span className="block text-2xl font-bold text-white font-mono">{profile.publicRepos}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Repositories</span>
          </div>

          {/* Stat 2 */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center hover:border-zinc-800 transition-colors">
            <span className="block text-2xl font-bold text-teal-400 font-mono">{profile.totalStars}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Stars Received</span>
          </div>

          {/* Stat 3 */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center hover:border-zinc-800 transition-colors">
            <span className="block text-2xl font-bold text-[#ce9178] font-mono">{profile.totalForks}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Forks</span>
          </div>

          {/* Stat 4 */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center hover:border-zinc-800 transition-colors">
            <span className="block text-2xl font-bold text-white font-mono">{profile.followers}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Followers</span>
          </div>

          {/* Stat 5 */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center hover:border-zinc-800 transition-colors">
            <span className="block text-2xl font-bold text-zinc-400 font-mono">{profile.following}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Following</span>
          </div>

          {/* Stat 6 */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center hover:border-zinc-800 transition-colors">
            <span className="block text-2xl font-bold text-zinc-400 font-mono">{profile.publicGists}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Gists Owned</span>
          </div>

          {/* Stat 7 */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center hover:border-zinc-800 transition-colors">
            <div className="flex items-center justify-center gap-1.5 mb-1 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-zinc-100 font-mono">{profile.contributionStatus}</span>
            </div>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Contribution Status</span>
          </div>

          {/* Stat 8 */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4 text-center hover:border-zinc-800 transition-colors">
            <span className="block text-xs font-bold text-zinc-300 font-mono mt-2 truncate" title={getRelativeTime(profile.lastActivity)}>
              {getRelativeTime(profile.lastActivity)}
            </span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Last Activity</span>
          </div>
        </motion.div>

        {/* SECTION 3: Technology Stack Analysis */}
        {languages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-zinc-800/60 bg-zinc-950/20 p-6 backdrop-blur-md mb-8"
          >
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4">
              GitHub Technology Stack Analysis
            </h3>

            {/* Progress bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-900/60 mb-5 border border-zinc-850">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: languageColors[lang.name] || '#8b8b8b',
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {languages.map((lang) => (
                <span key={lang.name} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-zinc-900"
                    style={{
                      backgroundColor: languageColors[lang.name] || '#8b8b8b',
                    }}
                  />
                  {lang.name}
                  <span className="text-zinc-650 font-mono">{lang.percentage}%</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION 5: Pinned Repositories */}
        {topRepos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-6">
              Featured Repositories & Quality Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRepos.slice(0, 6).map((repo, idx) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex"
                >
                  <div
                    className="group flex flex-col justify-between w-full rounded-2xl border border-zinc-800/60 bg-zinc-950/30 p-5 transition-all duration-300 hover:border-teal-500/30 hover:bg-zinc-900/20 hover:shadow-xl relative overflow-hidden"
                  >
                    <div>
                      {/* Top bar */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Code2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                          <h4 className="text-sm font-bold text-zinc-100 truncate group-hover:text-teal-400 transition-colors">
                            {repo.name}
                          </h4>
                        </div>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 hover:text-teal-400 flex-shrink-0 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                        {repo.description || 'No description available'}
                      </p>
                    </div>

                    <div>
                      {/* Topics */}
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="px-1.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-850 text-[9px] font-mono text-zinc-400"
                            >
                              #{topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Details */}
                      <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900/80 pt-3">
                        <div className="flex items-center gap-3">
                          {repo.language && (
                            <span className="flex items-center gap-1.5 font-medium">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: languageColors[repo.language] || '#8b8b8b',
                                }}
                              />
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1 hover:text-yellow-400 transition-colors" title={`${repo.stars} Stars`}>
                            <Star className="h-3 w-3 fill-current text-zinc-650" />
                            {repo.stars}
                          </span>
                          <span className="flex items-center gap-1 hover:text-teal-400 transition-colors" title={`${repo.forks} Forks`}>
                            <GitFork className="h-3 w-3 text-zinc-650" />
                            {repo.forks}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-650 font-mono">
                          Updated {getRelativeTime(repo.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: Recent Activity timeline */}
        <div className="grid grid-cols-1 gap-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-6 backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                Live Development Timeline
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
                </span>
                Active Feed
              </div>
            </div>

            {recentActivity.length > 0 ? (
              <div className="relative border-l border-zinc-850 ml-3 pl-6 space-y-6">
                {recentActivity.slice(0, 8).map((activity, idx) => {
                  const cfg = getActivityConfig(activity.type);
                  const Icon = cfg.icon;
                  
                  return (
                    <div key={activity.id || idx} className="relative group">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[37px] top-1 flex items-center justify-center w-6 h-6 rounded-full border border-zinc-900 ${cfg.bgColor} ${cfg.textColor} ${cfg.borderColor} ring-4 ring-zinc-950 transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="h-3 w-3" />
                      </span>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-550 font-mono">
                          {getRelativeTime(activity.createdAt)}
                        </span>
                        <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                          {activity.message.split('`').map((part, index) => 
                            index % 2 === 1 ? (
                              <code key={index} className="px-1.5 py-0.5 rounded bg-zinc-900 text-teal-400 font-mono text-xs border border-zinc-850">
                                {part}
                              </code>
                            ) : (
                              part
                            )
                          )}
                        </p>
                        {activity.repoName && (
                          <a
                            href={activity.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-teal-500 hover:text-teal-400 hover:underline flex items-center gap-1 mt-0.5 w-fit"
                          >
                            {activity.repoName}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-650 border border-dashed border-zinc-850 rounded-xl bg-zinc-900/5">
                <Layers className="h-8 w-8 text-zinc-800 mb-3" />
                <p className="text-sm text-zinc-500 font-medium font-mono">No recent activity detected</p>
                <p className="text-xs text-zinc-600 mt-1 max-w-[280px]">
                  No public events found on GitHub. Recent commits, PRs, and issues will display automatically once activity is logged.
                </p>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
