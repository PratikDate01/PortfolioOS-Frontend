'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Cpu, Database, Cloud, Brain, CheckCircle2, Award, FileText, Code, 
  Mail, Github, Linkedin, Twitter, Globe, MapPin, BookOpen, Briefcase, Sparkles, Calendar, User as UserIcon
} from 'lucide-react';
import { ThemeLayoutProps } from './types';
import Globe3DCanvas from '@/components/sections/Globe3DCanvas';
import TechGalaxy from '@/components/sections/TechGalaxy';

export default function CreativeLayout({
  username,
  portfolio,
  projects,
  experiences,
  skills,
  certifications,
  resumes,
  blogPosts,
  testimonials,
  visitorCount,
  selectedProject,
  setSelectedProject,
  activeFilterCategory,
  setActiveFilterCategory,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactSubject,
  setContactSubject,
  contactBody,
  setContactBody,
  contactSuccess,
  copiedSuccess,
  handleContactSubmit,
  handleCopyLink,
  handleQuickAction,
  renderAvatar,
  socialLinks,
  displayYearsOfExp,
  scores,
  filteredProjects,
  projectCategories,
  skillsByCategory,
  getCategoryIcon,
  activeResume
}: ThemeLayoutProps) {

  const themeAccent = portfolio.accentColor || '#c084fc'; // Default Purple for Creative
  const ownerName = (portfolio.ownerId as any)?.name || username;
  const headline = portfolio.headline || 'Software Engineer & Designer';
  const bio = portfolio.bio || (portfolio.ownerId as any)?.bio || 'Building future-focused applications.';
  const coverImageUrl = portfolio.coverImage?.secureUrl || (portfolio.ownerId as any)?.coverImage?.secureUrl || '';
  const userLocation = (portfolio.ownerId as any)?.location || 'Remote / Worldwide';
  const availabilityStatus = (portfolio.ownerId as any)?.availabilityStatus || 'Available for Opportunities';
  const githubUser = portfolio.githubUsername || (portfolio.ownerId as any)?.githubUsername || '';

  const educationExperiences = experiences.filter(exp => exp.type === 'education');
  const jobExperiences = experiences.filter(exp => exp.type === 'job' || exp.type === 'internship');

  const animationEnabled = portfolio.animationLevel !== 'none';
  const staggerDelay = portfolio.animationLevel === 'low' ? 0.08 : 0.15;

  const fadeInVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const AnimatedSection = ({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) => {
    if (!animationEnabled) {
      return <section id={id} className={className}>{children}</section>;
    }
    return (
      <motion.section
        id={id}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeInVariants}
        className={className}
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0c051e] via-[#050212] to-[#1a001a] text-purple-200 font-sans antialiased selection:bg-purple-500/30 overflow-x-hidden relative">
      
      {/* Background blobs */}
      <div className="absolute top-0 inset-x-0 h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse duration-[8000ms]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[130px] animate-pulse duration-[6000ms]" />
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-[#050212]/60 border-b border-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span 
                className="font-bold text-sm tracking-wider rounded-xl px-3.5 py-1.5 border bg-white/5 text-purple-250 backdrop-blur-md"
                style={{ borderColor: `${themeAccent}25`, color: themeAccent }}
              >
                {username.toUpperCase()}
              </span>
              <span className="hidden md:inline text-xs font-semibold opacity-60">/ creative.space</span>
            </div>
            
            <div className="flex items-center gap-4">
              {visitorCount !== null && (
                <div 
                  className="flex items-center space-x-1.5 rounded-full border px-3.5 py-1 text-xs bg-white/5"
                  style={{ borderColor: `${themeAccent}15` }}
                >
                  <Eye className="h-3.5 w-3.5" style={{ color: themeAccent }} />
                  <span>{visitorCount.toLocaleString()} visualizers</span>
                </div>
              )}

              <button
                onClick={handleCopyLink}
                className="rounded-xl px-3.5 py-2 text-xs border transition-all flex items-center gap-1.5 border-white/10 bg-white/5 hover:bg-white/10 text-purple-100 hover:text-white"
              >
                {copiedSuccess ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-450" /> : <Globe className="h-3.5 w-3.5" />}
                <span>{copiedSuccess ? 'Copied' : 'Share Space'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          
          {/* Creative Hero Display Banner */}
          <AnimatedSection className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-md">
            <div className="h-52 md:h-72 w-full relative bg-gradient-to-r from-[#1b033a] via-[#050212] to-[#3a0333] border-b border-white/5">
              {coverImageUrl && (
                <img src={coverImageUrl} alt="Header Art" className="w-full h-full object-cover opacity-50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c051e] via-transparent to-transparent" />
            </div>
            
            <div className="px-8 pb-8 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left z-10">
                {portfolio.showProfilePhoto !== false && (
                  <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden border-4 border-[#0c051e] bg-purple-950 shadow-2xl">
                    {renderAvatar("w-full h-full object-cover", "text-3xl text-purple-200 bg-white/10")}
                  </div>
                )}
                <div className="md:pb-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                    <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-300">
                      {ownerName}
                    </h1>
                    <span 
                      className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{ color: themeAccent, borderColor: `${themeAccent}30`, backgroundColor: `${themeAccent}15` }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: themeAccent }} />
                      {availabilityStatus}
                    </span>
                  </div>
                  <p className="text-purple-300/80 text-sm font-semibold">{headline}</p>
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-purple-400/60 mt-2">
                    <MapPin className="h-3.5 w-3.5" style={{ color: themeAccent }} />
                    <span>{userLocation}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 md:pb-2 z-10">
                {activeResume && (
                  <button
                    onClick={() => handleQuickAction('resume')}
                    className="inline-flex items-center gap-2 rounded-2xl font-bold px-5 py-3 text-xs transition-all duration-300 hover:scale-103 shadow-lg shadow-purple-500/10 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${themeAccent}, #ec4899)`,
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download CV Resume</span>
                  </button>
                )}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-purple-100 font-semibold px-5 py-3 text-xs transition-all duration-300"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Message</span>
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Interactive About Panel */}
          <AnimatedSection className="border border-white/10 bg-white/[0.02] rounded-3xl p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-6">
              <UserIcon className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">Design Philosophy & Bio</span>
            </div>
            <div className="grid gap-8 md:grid-cols-3 items-center">
              <div className="md:col-span-2 max-w-4xl">
                <p className="text-sm text-purple-200/90 leading-relaxed font-sans">
                  {bio}
                </p>
                <div className="mt-6 flex gap-3">
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-purple-300 hover:bg-white/10 hover:text-white transition-all">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-purple-300 hover:bg-white/10 hover:text-white transition-all">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-purple-300 hover:bg-white/10 hover:text-white transition-all">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
              <div className="md:col-span-1 hidden md:block h-64 border border-white/5 bg-[#050212]/50 relative overflow-hidden rounded-2xl">
                <Globe3DCanvas color={themeAccent} glowColor={`${themeAccent}12`} />
              </div>
            </div>
          </AnimatedSection>

          {/* Snapshot Grid */}
          <AnimatedSection className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Briefcase className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-semibold text-purple-150 uppercase tracking-wider">Candidate Snapshot</span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between md:col-span-2 shadow-xl backdrop-blur-md">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                    <span className="block text-3xl font-black text-white">{displayYearsOfExp}</span>
                    <span className="text-[9px] text-purple-300/60 uppercase tracking-wider font-semibold">Years Exp</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                    <span className="block text-3xl font-black" style={{ color: themeAccent }}>{projects.length}</span>
                    <span className="text-[9px] text-purple-300/60 uppercase tracking-wider font-semibold">Projects</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                    <span className="block text-3xl font-black text-white">{skills.length}</span>
                    <span className="text-[9px] text-purple-300/60 uppercase tracking-wider font-semibold">Skills</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                    <span className="block text-3xl font-black text-white">{certifications.length}</span>
                    <span className="text-[9px] text-purple-300/60 uppercase tracking-wider font-semibold">Certs</span>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-6 pt-4 border-t border-white/5 text-xs text-purple-300/70">
                  <p>GitHub Status: <span className="text-purple-100 font-bold">{githubUser ? 'Verified Sync' : 'Not Linked'}</span></p>
                  <p>Availability: <span className="font-bold" style={{ color: themeAccent }}>{availabilityStatus}</span></p>
                </div>
              </div>

              {skills.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between shadow-xl backdrop-blur-md">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-purple-300/65 font-bold block mb-3">// Primary Stacks</span>
                    <div className="flex flex-wrap gap-2">
                      {skills
                        .slice()
                        .sort((a, b) => b.proficiency - a.proficiency)
                        .slice(0, 4)
                        .map((s) => (
                          <span 
                            key={s.name} 
                            className="px-2.5 py-1 rounded-lg border text-xs"
                            style={{ color: themeAccent, borderColor: `${themeAccent}25`, backgroundColor: `${themeAccent}10` }}
                          >
                            {s.name}
                          </span>
                        ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-purple-400/50 mt-4 leading-relaxed">Top skill attributes dynamically sorted.</p>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Interactive Intelligence Dashboard */}
          <AnimatedSection className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Cpu className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">Candidate Intelligence Metrics</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-wider text-purple-300/60 font-bold">Completeness Index</span>
                  <CheckCircle2 className="h-4 w-4" style={{ color: themeAccent }} />
                </div>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-3xl font-black text-white">{scores.portfolioScore}</span>
                  <span className="text-xs text-purple-400/50">/ 100</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: `${scores.portfolioScore}%` }} />
                </div>
                <p className="text-[9px] text-purple-400/40">Visual builder score completeness.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-wider text-purple-300/60 font-bold">Readiness Index</span>
                  <Sparkles className="h-4 w-4" style={{ color: themeAccent }} />
                </div>
                <div className="mb-4">
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border"
                    style={{ color: themeAccent, borderColor: `${themeAccent}30`, backgroundColor: `${themeAccent}12` }}
                  >
                    {scores.readinessScore}
                  </span>
                </div>
                <p className="text-[9px] text-purple-400/40">Formatting score check.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-wider text-purple-300/60 font-bold">ATS Parse Match</span>
                  <FileText className="h-4 w-4" style={{ color: themeAccent }} />
                </div>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-3xl font-black text-white">{scores.atsScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-indigo-400" style={{ width: `${scores.atsScore}%` }} />
                </div>
                <p className="text-[9px] text-purple-400/40">Resume ATS check score.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-wider text-purple-300/60 font-bold">GitHub Sync State</span>
                  <Github className="h-4 w-4" style={{ color: themeAccent }} />
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white/5 text-purple-100 border border-white/10">
                    {scores.githubHealth}
                  </span>
                </div>
                <p className="text-[9px] text-purple-400/40">Repository sync checker active.</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Featured Projects Gallery */}
          {projects.length > 0 && (
            <AnimatedSection id="projects" className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                <Code className="h-4 w-4" style={{ color: themeAccent }} />
                <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">Interactive Projects Gallery</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {projectCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilterCategory(cat)}
                    className={`rounded-xl px-4 py-2 text-xs border transition-all ${
                      activeFilterCategory === cat
                        ? 'bg-purple-950 text-white font-bold'
                        : 'bg-white/5 text-purple-300 border-white/5 hover:text-white hover:border-white/10'
                    }`}
                    style={{
                      borderColor: activeFilterCategory === cat ? themeAccent : undefined,
                      color: activeFilterCategory === cat ? themeAccent : undefined
                    }}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <article key={project._id} className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col group shadow-xl">
                    <div className="aspect-video w-full overflow-hidden bg-black/40 relative">
                      <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} alt={project.title} className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 rounded-lg bg-black/80 px-2.5 py-0.5 text-[9px] font-bold text-purple-300 border border-white/10">
                        {project.category}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">{project.title}</h3>
                      <p className="mt-2 text-xs text-purple-300/70 line-clamp-3 leading-relaxed flex-1">{project.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span key={tech} className="rounded-lg bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] text-purple-300">{tech}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => setSelectedProject(project)} 
                          className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2 text-xs font-bold text-purple-100 transition-all shadow-md"
                        >
                          <span>Review Case Study</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Technical Skills breakdown */}
          {skills.length > 0 && (
            <AnimatedSection className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                <Cpu className="h-4 w-4" style={{ color: themeAccent }} />
                <span className="text-xs font-semibold text-purple-150 uppercase tracking-wider">Expertise Spheres</span>
              </div>
              <div className="grid gap-12 lg:grid-cols-5 items-start">
                <div className="lg:col-span-2">
                  <div className="p-4 border border-white/10 bg-[#050212]/30 rounded-2xl backdrop-blur-md shadow-2xl">
                    <p className="text-[10px] uppercase text-purple-400/40 font-bold mb-3">// Interactive Tech Spheres</p>
                    <TechGalaxy />
                  </div>
                </div>
                <div className={`lg:col-span-3 grid gap-6 ${Object.keys(skillsByCategory).length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
                  {Object.entries(skillsByCategory).map(([category, items]) => (
                    <div key={category} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-xl backdrop-blur-md">
                      <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4">
                        {getCategoryIcon(category)}
                        <h3 className="text-xs font-bold text-white capitalize">{category}</h3>
                      </div>
                      <div className="space-y-4">
                        {items.map((skill) => (
                          <div key={skill.name}>
                            <div className="flex items-center justify-between text-[11px] text-purple-300 mb-1">
                              <span>{skill.name}</span>
                              <span style={{ color: themeAccent }}>{skill.proficiency}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-black/60 border border-white/5 overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${skill.proficiency}%`,
                                  background: `linear-gradient(to right, ${themeAccent}, #ec4899)`
                                }} 
                              />
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

          {/* Work History */}
          {jobExperiences.length > 0 && (
            <AnimatedSection className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                <Briefcase className="h-4 w-4" style={{ color: themeAccent }} />
                <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">Vibrant Work Timeline</span>
              </div>
              <div className="relative border-l border-white/10 ml-4 space-y-12">
                {jobExperiences.map((exp, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div 
                      className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-between rounded-full border bg-[#050212] group-hover:scale-125 transition-transform"
                      style={{ borderColor: themeAccent }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full mx-auto" style={{ backgroundColor: themeAccent }} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {exp.role} @ <span style={{ color: themeAccent }}>{exp.organization}</span>
                      </h3>
                      <span className="text-xs text-purple-400/50 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} — {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: themeAccent }}>{exp.type}</p>
                    <p className="text-xs text-purple-300 leading-relaxed mb-3">{exp.description}</p>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-purple-400/60 space-y-1 pl-2 mb-3">
                        {exp.responsibilities.map((r, ri) => (
                          <li key={ri} className="leading-relaxed">{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Education and credentials */}
          {(educationExperiences.length > 0 || certifications.length > 0) && (
            <AnimatedSection className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                <BookOpen className="h-4 w-4" style={{ color: themeAccent }} />
                <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">Education & Credentials</span>
              </div>
              <div className={`grid gap-6 ${educationExperiences.length > 0 && certifications.length > 0 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {educationExperiences.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">// Education</h3>
                    {educationExperiences.map((edu, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 relative overflow-hidden">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div>
                            <h4 className="text-xs font-bold text-white">{edu.role}</h4>
                            <p className="text-[10px] mt-0.5" style={{ color: themeAccent }}>{edu.organization}</p>
                          </div>
                          <span className="text-[10px] text-purple-400/50 flex items-center gap-1 shrink-0">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-305 leading-relaxed">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {certifications.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">// Certifications</h3>
                    <div className="space-y-4">
                      {certifications.slice(0, 3).map((cert) => (
                        <div key={cert._id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex justify-between items-center gap-3 hover:border-purple-500/20 transition-all duration-300">
                          <div>
                            <h4 className="text-xs font-bold text-white leading-snug">{cert.title}</h4>
                            <p className="text-[10px] text-purple-450">{cert.issuer}</p>
                          </div>
                          {cert.credentialUrl && (
                            <a 
                              href={cert.credentialUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex-shrink-0 text-[10px] border px-2.5 py-1.5 rounded-xl text-white font-bold"
                              style={{ border: `1px solid ${themeAccent}30`, backgroundColor: `${themeAccent}12` }}
                            >
                              Verify
                            </a>
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
              <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                <Sparkles className="h-4 w-4" style={{ color: themeAccent }} />
                <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">Recommendations</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <div key={testimonial._id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between shadow-xl backdrop-blur-md">
                    <p className="text-xs text-purple-200 italic leading-relaxed">&ldquo;{testimonial.body}&rdquo;</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div 
                        className="h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold"
                        style={{ color: themeAccent, borderColor: `${themeAccent}25`, backgroundColor: `${themeAccent}12` }}
                      >
                        {testimonial.authorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-white">{testimonial.authorName}</h4>
                        <p className="text-[9px]" style={{ color: themeAccent }}>{testimonial.authorRole} {testimonial.authorCompany ? `@ ${testimonial.authorCompany}` : ''}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Contact form section */}
          <AnimatedSection id="contact" className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Mail className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">Reach My Inbox</span>
            </div>
            
            <div className="grid gap-12 lg:grid-cols-5 items-start">
              <div className="lg:col-span-2 space-y-6">
                {(socialLinks.github || socialLinks.linkedin || socialLinks.twitter || socialLinks.website) && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4 shadow-xl">
                    <p className="text-[10px] uppercase tracking-wider text-purple-400/50 font-bold border-b border-white/5 pb-2">// Coordinates</p>
                    {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-purple-300 hover:text-white transition-colors"><Github className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.github}</span></a>}
                    {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-purple-300 hover:text-white transition-colors"><Linkedin className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.linkedin}</span></a>}
                    {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-purple-300 hover:text-white transition-colors"><Twitter className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.twitter}</span></a>}
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 w-full shadow-2xl backdrop-blur-md">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-purple-450 mb-1">Your Name</label>
                      <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Creator Associate" className="w-full bg-black/60 border border-white/15 text-purple-100 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-purple-450 mb-1">Your Email</label>
                      <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="manager@creative.tech" className="w-full bg-black/60 border border-white/15 text-purple-100 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-purple-450 mb-1">Subject</label>
                    <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} placeholder="Visualizing Opportunities" className="w-full bg-black/60 border border-white/15 text-purple-100 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-purple-450 mb-1">Message</label>
                    <textarea required rows={4} value={contactBody} onChange={(e) => setContactBody(e.target.value)} placeholder="Let us collaborate..." className="w-full bg-black/60 border border-white/15 text-purple-100 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500 transition-colors resize-none" />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-lg hover:scale-102"
                    style={{ background: `linear-gradient(135deg, ${themeAccent}, #ec4899)` }}
                  >
                    Submit Request
                  </button>
                  {contactSuccess && <p className="text-[10px] text-emerald-400 text-center mt-2">✓ Collaborative link submitted.</p>}
                </form>
              </div>
            </div>
          </AnimatedSection>
        </motion.div>
      </main>
    </div>
  );
}
