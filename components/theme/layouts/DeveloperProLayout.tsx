'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Cpu, Database, Cloud, Brain, CheckCircle2, Award, FileText, Code, ChevronRight, Link,
  Mail, Github, Linkedin, Twitter, Globe, MapPin, ExternalLink, BookOpen, Briefcase, Sparkles, Calendar, User as UserIcon
} from 'lucide-react';
import { ThemeLayoutProps } from './types';
import TechGalaxy from '@/components/sections/TechGalaxy';
import Tilt3DCard from '@/components/sections/Tilt3DCard';
import Globe3DCanvas from '@/components/sections/Globe3DCanvas';
import GitHubStats from '@/components/sections/GitHubStats';

export default function DeveloperProLayout({
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
  sessionId,
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

  const themeAccent = portfolio.accentColor || '#14b8a6';
  const ownerName = (portfolio.ownerId as any)?.name || username;
  const headline = portfolio.headline || 'Software Engineer & Designer';
  const bio = portfolio.bio || (portfolio.ownerId as any)?.bio || 'Building future-focused applications.';
  const githubUser = portfolio.githubUsername || (portfolio.ownerId as any)?.githubUsername || '';
  const coverImageUrl = portfolio.coverImage?.secureUrl || (portfolio.ownerId as any)?.coverImage?.secureUrl || '';
  const userLocation = (portfolio.ownerId as any)?.location || 'Remote / Worldwide';
  const availabilityStatus = (portfolio.ownerId as any)?.availabilityStatus || 'Available for Opportunities';

  const educationExperiences = experiences.filter(exp => exp.type === 'education');
  const jobExperiences = experiences.filter(exp => exp.type === 'job' || exp.type === 'internship');
  const achievementExperiences = experiences.filter(exp => exp.type === 'achievement');

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 relative overflow-x-hidden bg-[#0a0b0d] text-zinc-300 font-sans selection:bg-teal-500/25">
      
      {/* Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[700px] overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.06]"
          style={{ backgroundColor: themeAccent }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header and Brand */}
      <nav className="sticky top-0 z-45 backdrop-blur-md border-b bg-[#0a0b0d]/80 border-zinc-900 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span 
                className="font-mono text-sm font-bold rounded-lg px-2.5 py-1 border"
                style={{ 
                  color: themeAccent, 
                  borderColor: `${themeAccent}30`,
                  backgroundColor: `${themeAccent}08`
                }}
              >
                {username.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {visitorCount !== null && portfolio.showPortfolioViews !== false && (
                <div 
                  className="flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-mono"
                  style={{ 
                    color: themeAccent, 
                    borderColor: `${themeAccent}15`,
                    backgroundColor: `${themeAccent}05`
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{visitorCount.toLocaleString()} views</span>
                </div>
              )}

              <button
                onClick={handleCopyLink}
                className="rounded-lg p-2 text-xs font-mono border transition-all flex items-center gap-1.5 border-zinc-800 bg-zinc-900/40 hover:bg-zinc-850 text-zinc-300 hover:text-teal-400 hover:border-teal-500/20"
              >
                {copiedSuccess ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-450" /> : <Link className="h-3.5 w-3.5" />}
                <span>{copiedSuccess ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-24">

            {/* Widescreen Banner Cover & Profile Header */}
            <motion.div variants={fadeInVariants} className="relative rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950/20 shadow-xl">
              <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-zinc-900/40 via-black to-zinc-950/60 border-b border-zinc-900">
                {coverImageUrl ? (
                  <img src={coverImageUrl} alt="Profile Cover" className="w-full h-full object-cover opacity-40" />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-transparent" />
              </div>
              
              <div className={`px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-6 ${portfolio.showProfilePhoto !== false ? '-mt-16 md:-mt-20' : 'mt-6'}`}>
                <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left z-10">
                  {portfolio.showProfilePhoto !== false && (
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-[#0a0b0d] bg-zinc-900 shadow-2xl flex-shrink-0">
                      {renderAvatar("w-full h-full object-cover border border-zinc-800", "text-2xl")}
                    </div>
                  )}
                  <div className="md:pb-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                      <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">{ownerName}</h1>
                      <div 
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-semibold"
                        style={{ 
                          color: themeAccent, 
                          borderColor: `${themeAccent}30`,
                          backgroundColor: `${themeAccent}10`
                        }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeAccent }} />
                        <span>{availabilityStatus}</span>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm font-semibold">{headline}</p>
                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-zinc-500 mt-2">
                      <MapPin className="h-3.5 w-3.5" style={{ color: themeAccent }} />
                      <span>{userLocation}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:pb-2 z-10">
                  {activeResume && (
                    <button
                      onClick={() => handleQuickAction('resume')}
                      className="inline-flex items-center gap-2 rounded-xl font-bold px-4 py-2.5 text-xs transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundColor: `${themeAccent}15`,
                        color: themeAccent,
                        border: `1px solid ${themeAccent}35`
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Download Resume</span>
                    </button>
                  )}
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-850 bg-black/60 hover:bg-zinc-900 text-zinc-200 hover:text-teal-400 font-semibold px-4 py-2.5 text-xs transition-all duration-300"
                  >
                    <Mail className="h-4 w-4 text-zinc-500" />
                    <span>Get in Touch</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Profile Bio Section (About) */}
            <motion.section variants={fadeInVariants} className="relative pt-4">
              <div className="border border-zinc-900/60 bg-zinc-900/10 rounded-xl p-6">
                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-3 mb-4">
                  <UserIcon className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">About Me</span>
                </div>
                <div className="grid gap-8 md:grid-cols-3 items-center">
                  <div className="md:col-span-2 max-w-4xl">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {bio}
                    </p>
                    <div className="mt-6 flex gap-3">
                      {socialLinks.github && (
                        <a href={socialLinks.github} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                          <Github className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                          <Linkedin className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                          <Twitter className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.website && (
                        <a href={socialLinks.website} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                          <Globe className="h-4.5 w-4.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-1 hidden md:block h-64 border border-zinc-900 bg-zinc-950/20 relative overflow-hidden rounded-xl">
                    <Globe3DCanvas color={themeAccent} glowColor={`${themeAccent}08`} />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Candidate Snapshot */}
            <motion.section variants={fadeInVariants} className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-850 pb-2">
                <Briefcase className="h-4 w-4" style={{ color: themeAccent }} />
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Candidate Snapshot</span>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <Tilt3DCard glowColor="teal" className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 flex flex-col justify-between md:col-span-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-zinc-900/20 rounded-lg border border-zinc-850 text-center">
                      <span className="block text-2xl font-extrabold text-white">{displayYearsOfExp}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Years Exp</span>
                    </div>
                    <div className="p-3 bg-zinc-900/20 rounded-lg border border-zinc-850 text-center">
                      <span className="block text-2xl font-extrabold" style={{ color: themeAccent }}>{projects.length}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Projects</span>
                    </div>
                    <div className="p-3 bg-zinc-900/20 rounded-lg border border-zinc-850 text-center">
                      <span className="block text-2xl font-extrabold text-white">{skills.length}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Skills</span>
                    </div>
                    <div className="p-3 bg-zinc-900/20 rounded-lg border border-zinc-850 text-center">
                      <span className="block text-2xl font-extrabold text-white">{certifications.length}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Certs</span>
                    </div>
                  </div>
                </Tilt3DCard>

                {skills.length > 0 && (
                  <Tilt3DCard glowColor="teal" className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-3">// Top Stack</span>
                      <div className="flex flex-wrap gap-2">
                        {skills
                          .slice()
                          .sort((a, b) => b.proficiency - a.proficiency)
                          .slice(0, 4)
                          .map((s) => (
                            <span 
                              key={s.name} 
                              className="px-2 py-0.5 rounded border text-xs"
                              style={{ color: themeAccent, borderColor: `${themeAccent}20`, backgroundColor: `${themeAccent}05` }}
                            >
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

            {/* Technical Skills breakdown (Skills) */}
            {skills.length > 0 && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-855 pb-2">
                  <Cpu className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Technical Skills Breakdown</span>
                </div>
                <div className="grid gap-12 lg:grid-cols-5 items-start">
                  <div className="lg:col-span-2">
                    <div className="p-4 border border-zinc-900 bg-zinc-950/20 rounded-xl">
                      <p className="text-[10px] uppercase text-zinc-650 font-bold mb-3">// 3D Galaxy Visualization</p>
                      <TechGalaxy />
                    </div>
                  </div>
                  <div className={`lg:col-span-3 grid gap-6 ${Object.keys(skillsByCategory).length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
                    {Object.entries(skillsByCategory).map(([category, items]) => (
                      <div key={category} className="rounded-xl border border-zinc-905 bg-zinc-950/15 p-5">
                        <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3 mb-4">
                          {getCategoryIcon(category)}
                          <h3 className="text-xs font-bold capitalize text-white">{category}</h3>
                        </div>
                        <div className="space-y-4">
                          {items.map((skill) => (
                            <div key={skill.name}>
                              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                                <span>{skill.name}</span>
                                <span style={{ color: themeAccent }}>{skill.proficiency}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-zinc-955 border border-zinc-900 overflow-hidden">
                                <div 
                                  className="h-full rounded-full" 
                                  style={{ 
                                    width: `${skill.proficiency}%`,
                                    background: `linear-gradient(to right, ${themeAccent}, #10b981)`
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

            {/* Featured Projects Showcase (Projects) */}
            {projects.length > 0 && (
              <AnimatedSection id="projects" className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-2">
                  <Code className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Featured Projects Showcase</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {projectCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilterCategory(cat)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs border transition-all ${
                        activeFilterCategory === cat
                          ? 'bg-[#0f1115] text-white border-zinc-700 font-bold'
                          : 'bg-zinc-900/30 text-zinc-400 border-zinc-900 hover:text-white hover:border-zinc-800'
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

                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12 border border-zinc-900 rounded-xl bg-zinc-955/20">
                    <p className="text-sm text-zinc-550">No matching projects found.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                      <Tilt3DCard key={project._id} glowColor="teal" className="rounded-xl overflow-hidden h-full flex">
                        <article className="flex-1 flex flex-col overflow-hidden border border-zinc-900 bg-zinc-955/20 hover:border-zinc-800 transition-all duration-300 group relative">
                          <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
                            <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} alt={project.title} className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                            <div 
                              className="absolute top-3 right-3 rounded-md px-2 py-0.5 text-[9px] border font-mono"
                              style={{ color: themeAccent, borderColor: `${themeAccent}20`, backgroundColor: 'rgba(0,0,0,0.8)' }}
                            >
                              {project.category}
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">{project.title}</h3>
                            <p className="mt-2 text-xs text-zinc-450 line-clamp-3 leading-relaxed flex-1">{project.summary}</p>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {project.techStack.slice(0, 4).map((tech) => (
                                <span 
                                  key={tech} 
                                  className="rounded px-2 py-0.5 text-[10px] border"
                                  style={{ color: themeAccent, borderColor: `${themeAccent}10`, backgroundColor: `${themeAccent}03` }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                              <button 
                                onClick={() => setSelectedProject(project)} 
                                className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg border border-zinc-850 bg-zinc-900/10 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-900/40 transition-all"
                              >
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

            {/* Experience Timeline (Experience) */}
            {jobExperiences.length > 0 && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-2">
                  <Briefcase className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Work History Timeline</span>
                </div>
                <div className="relative border-l border-zinc-900 ml-4 space-y-12">
                  {jobExperiences.map((exp, idx) => (
                    <div key={idx} className="relative pl-8 group">
                      <div 
                        className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-between rounded-full border bg-[#0a0b0d] group-hover:scale-125 transition-transform duration-300"
                        style={{ borderColor: themeAccent }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full mx-auto" style={{ backgroundColor: themeAccent }} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                          {exp.role} @ <span style={{ color: themeAccent }}>{exp.organization}</span>
                        </h3>
                        <span className="text-xs text-zinc-550 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} — {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                        </span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: themeAccent }}>{exp.type}</p>
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
                            <span 
                              key={t} 
                              className="rounded px-2 py-0.5 text-[9px] border"
                              style={{ color: themeAccent, borderColor: `${themeAccent}10`, backgroundColor: `${themeAccent}03` }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* GitHub Stats (GitHub Intelligence) */}
            {githubUser && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-2">
                  <Github className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">GitHub Integration Metrics</span>
                </div>
                <GitHubStats username={githubUser} />
              </AnimatedSection>
            )}

            {/* Education and credentials (Certifications) */}
            {(educationExperiences.length > 0 || certifications.length > 0) && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-2">
                  <BookOpen className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Education & Credentials</span>
                </div>
                <div className={`grid gap-6 ${educationExperiences.length > 0 && certifications.length > 0 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {educationExperiences.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">// Education Credentials</h3>
                      {educationExperiences.map((edu, idx) => (
                        <div key={idx} className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-5 relative overflow-hidden">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div>
                              <h4 className="text-xs font-bold text-white">{edu.role}</h4>
                              <p className="text-[10px] mt-0.5" style={{ color: themeAccent }}>{edu.organization}</p>
                            </div>
                            <span className="text-[10px] text-zinc-550 flex items-center gap-1 shrink-0">
                              <Calendar className="h-3.5 w-3.5" />
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
                          <div key={cert._id} className="rounded-xl border border-zinc-905 bg-zinc-950/15 p-4 flex justify-between items-center gap-3 hover:border-zinc-800 transition-all duration-300">
                            <div>
                              <h4 className="text-xs font-bold text-white leading-snug">{cert.title}</h4>
                              <p className="text-[10px] text-zinc-500">{cert.issuer}</p>
                            </div>
                            {cert.credentialUrl && (
                              <a 
                                href={cert.credentialUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex-shrink-0 text-[10px] border px-2 py-1 rounded"
                                style={{ color: themeAccent, borderColor: `${themeAccent}20`, backgroundColor: `${themeAccent}08` }}
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

            {/* Achievements Section */}
            {achievementExperiences.length > 0 && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-2">
                  <Award className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Achievements</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {achievementExperiences.map((ach, idx) => (
                    <div key={idx} className="rounded-xl border border-zinc-905 bg-zinc-950/15 p-5 relative overflow-hidden">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h4 className="text-xs font-bold text-white">{ach.role}</h4>
                          <p className="text-[10px] mt-0.5" style={{ color: themeAccent }}>{ach.organization}</p>
                        </div>
                        <span className="text-[10px] text-zinc-550 flex items-center gap-1 shrink-0 font-mono">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(ach.startDate).getFullYear()}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Resume Center (Resume) */}
            {activeResume && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-2">
                  <FileText className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Professional Resume</span>
                </div>
                <div className="rounded-2xl border border-zinc-900 bg-zinc-955/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                  <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2.5">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center border"
                        style={{ color: themeAccent, borderColor: `${themeAccent}20`, backgroundColor: `${themeAccent}08` }}
                      >
                        <FileText className="h-5.5 w-5.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{activeResume.label || 'Standard Professional Resume'}</h3>
                        <p className="text-[10px] text-zinc-550 mt-0.5">PDF • Updated: {activeResume.updatedAt ? new Date(activeResume.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Recently'}</p>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                      <button
                        onClick={() => handleQuickAction('resume')}
                        className="inline-flex items-center gap-2 rounded-xl font-bold px-4 py-2.5 text-xs transition-all duration-300 hover:shadow-lg"
                        style={{
                          backgroundColor: `${themeAccent}15`,
                          color: themeAccent,
                          border: `1px solid ${themeAccent}35`
                        }}
                      >
                        <FileText className="h-4 w-4" />
                        <span>Download Active Resume</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-sm aspect-[4/3] rounded-xl border border-zinc-900 bg-zinc-950/60 p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors">
                    <div className="border-b border-zinc-900 pb-3 flex items-center justify-between text-[9px] text-zinc-655 uppercase tracking-wider font-bold">
                      <span>Document Preview</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                      <FileText className="h-10 w-10 text-zinc-800 mb-2 animate-bounce" />
                      <p className="text-xs font-bold" style={{ color: themeAccent }}>{activeResume.resumeFile?.format?.toUpperCase() || 'PDF'} Document File</p>
                      <p className="text-[9px] text-zinc-550 mt-1">{(activeResume.resumeFile?.bytes ? (activeResume.resumeFile.bytes / 1024).toFixed(1) : '150')} KB • Public Link Verified</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <AnimatedSection className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-2">
                  <Sparkles className="h-4 w-4" style={{ color: themeAccent }} />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Recommendations & Endorsements</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="rounded-xl border border-zinc-900 bg-zinc-955/20 p-6 flex flex-col justify-between">
                      <p className="text-xs text-zinc-350 italic leading-relaxed">&ldquo;{testimonial.body}&rdquo;</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div 
                          className="h-8 w-8 rounded border flex items-center justify-center text-xs font-bold"
                          style={{ color: themeAccent, borderColor: `${themeAccent}25`, backgroundColor: `${themeAccent}08` }}
                        >
                          {testimonial.authorName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-white">{testimonial.authorName}</h4>
                          <p className="text-[9px] opacity-80" style={{ color: themeAccent }}>{testimonial.authorRole} {testimonial.authorCompany ? `@ ${testimonial.authorCompany}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Contact Coordinates & Form */}
            <AnimatedSection id="contact" className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-855 pb-2">
                <Mail className="h-4 w-4" style={{ color: themeAccent }} />
                <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Get In Touch</span>
              </div>
              <div className="grid gap-12 lg:grid-cols-5 items-start">
                {((socialLinks.github || socialLinks.linkedin || socialLinks.twitter || socialLinks.website) || activeResume) ? (
                  <>
                    <div className="lg:col-span-2 space-y-6">
                      {(socialLinks.github || socialLinks.linkedin || socialLinks.twitter || socialLinks.website) && (
                        <div className="rounded-xl border border-zinc-900 bg-zinc-950/10 p-5 space-y-4">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-550 font-bold border-b border-zinc-900 pb-2">// Contact Coordinates</p>
                          {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-450 hover:text-white transition-colors"><Github className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.github}</span></a>}
                          {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-450 hover:text-white transition-colors"><Linkedin className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.linkedin}</span></a>}
                          {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-450 hover:text-white transition-colors"><Twitter className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.twitter}</span></a>}
                          {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-zinc-450 hover:text-white transition-colors"><Globe className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.website}</span></a>}
                        </div>
                      )}

                      <div className="rounded-xl border border-zinc-900 bg-zinc-950/10 p-5 space-y-4">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-550 font-bold border-b border-zinc-900 pb-2">// Recruiter Actions</p>
                        <div className="grid gap-2">
                          <button type="button" onClick={() => handleQuickAction('interview')} className="w-full flex items-center justify-between gap-2 rounded-lg bg-zinc-900/30 hover:bg-zinc-850/40 border border-zinc-800 px-3 py-2 text-left text-xs font-semibold transition-all" style={{ color: themeAccent }}>
                            <span>Schedule Interview</span> <Calendar className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleQuickAction('resume')} className="w-full flex items-center justify-between gap-2 rounded-lg bg-zinc-900/30 hover:bg-zinc-850/40 border border-zinc-800 px-3 py-2 text-left text-xs font-semibold transition-all" style={{ color: themeAccent }}>
                            <span>Request Resume</span> <FileText className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 rounded-xl border border-zinc-900 bg-zinc-950/10 p-6 w-full">
                      <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-zinc-550 mb-1">Your Name</label>
                            <input id="contact-name" type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Hiring Manager" className="w-full bg-zinc-950 border border-zinc-855 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-zinc-550 mb-1">Your Email</label>
                            <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-zinc-950 border border-zinc-855 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-550 mb-1">Subject</label>
                          <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} placeholder="Inquiry or Job Opportunity" className="w-full bg-zinc-950 border border-zinc-855 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-550 mb-1">Message</label>
                          <textarea required rows={4} value={contactBody} onChange={(e) => setContactBody(e.target.value)} placeholder="Scope description or role requirements..." className="w-full bg-zinc-955 border border-zinc-855 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors resize-none" />
                        </div>
                        <button 
                          type="submit" 
                          disabled={contactMutation.isPending} 
                          className="w-full text-zinc-955 font-bold py-3 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
                          style={{ backgroundColor: themeAccent }}
                        >
                          {contactMutation.isPending ? 'Sending...' : 'Submit Message Request'}
                        </button>
                        {contactSuccess && <p className="text-[10px] text-emerald-450 text-center mt-2">✓ Message submitted successfully.</p>}
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="col-span-5 rounded-xl border border-zinc-900 bg-zinc-950/10 p-6 max-w-2xl mx-auto w-full">
                    <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-550 mb-1">Your Name</label>
                          <input id="contact-name" type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Hiring Manager" className="w-full bg-zinc-950 border border-zinc-855 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-550 mb-1">Your Email</label>
                          <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-zinc-950 border border-zinc-855 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-zinc-550 mb-1">Subject</label>
                        <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} placeholder="Inquiry or Job Opportunity" className="w-full bg-zinc-950 border border-zinc-855 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-zinc-550 mb-1">Message</label>
                        <textarea required rows={4} value={contactBody} onChange={(e) => setContactBody(e.target.value)} placeholder="Scope description or role requirements..." className="w-full bg-zinc-955 border border-zinc-855 rounded-lg p-2.5 text-xs text-white outline-none focus:border-teal-500 transition-colors resize-none" />
                      </div>
                      <button 
                        type="submit" 
                        disabled={contactMutation.isPending} 
                        className="w-full text-zinc-955 font-bold py-3 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
                        style={{ backgroundColor: themeAccent }}
                      >
                        {contactMutation.isPending ? 'Sending...' : 'Submit Message Request'}
                      </button>
                      {contactSuccess && <p className="text-[10px] text-emerald-450 text-center mt-2">✓ Message submitted successfully.</p>}
                    </form>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Themed Footer */}
            <footer className="mt-12 border-t border-zinc-900 bg-zinc-950/20 py-8 text-center text-xs text-zinc-505 font-mono">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} {ownerName}. All rights reserved.</p>
                <div className="flex gap-4">
                  {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-teal-400">GitHub</a>}
                  {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-teal-400">LinkedIn</a>}
                  {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-teal-400">Twitter</a>}
                </div>
              </div>
            </footer>

        </motion.div>
      </main>
    </div>
  );
}

// Simple placeholder Mutation object so compiler is happy if not inside react-query context
const contactMutation = { isPending: false };
