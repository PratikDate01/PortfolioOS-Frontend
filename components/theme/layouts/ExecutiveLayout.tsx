'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Cpu, Database, Cloud, Brain, CheckCircle2, Award, FileText, Code, 
  Mail, Github, Linkedin, Twitter, Globe, MapPin, BookOpen, Briefcase, Sparkles, Calendar, User as UserIcon
} from 'lucide-react';
import { ThemeLayoutProps } from './types';
import GitHubStats from '@/components/sections/GitHubStats';

export default function ExecutiveLayout({
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

  const themeAccent = portfolio.accentColor || '#2563eb'; // Default Blue for Executive
  const ownerName = (portfolio.ownerId as any)?.name || username;
  const headline = portfolio.headline || 'Software Engineer & Designer';
  const bio = portfolio.bio || (portfolio.ownerId as any)?.bio || 'Building future-focused applications.';
  const githubUser = portfolio.githubUsername || (portfolio.ownerId as any)?.githubUsername || '';
  const coverImageUrl = portfolio.coverImage?.secureUrl || (portfolio.ownerId as any)?.coverImage?.secureUrl || '';
  const userLocation = (portfolio.ownerId as any)?.location || 'Remote / Worldwide';
  const availabilityStatus = (portfolio.ownerId as any)?.availabilityStatus || 'Available for Opportunities';

  const educationExperiences = experiences.filter(exp => exp.type === 'education');
  const jobExperiences = experiences.filter(exp => exp.type === 'job' || exp.type === 'internship');

  const animationEnabled = portfolio.animationLevel !== 'none';
  const animationDuration = portfolio.animationLevel === 'low' ? 0.3 : 0.6;

  const fadeInVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: animationDuration, ease: 'easeOut' } }
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
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInVariants}
        className={className}
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-500/10">
      
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/80 border-b border-slate-200 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span 
                className="font-sans text-xs font-bold uppercase tracking-wider rounded border px-3 py-1 bg-slate-100 text-slate-800"
                style={{ borderColor: `${themeAccent}30`, color: themeAccent }}
              >
                {username}
              </span>
              <span className="hidden md:inline text-xs font-mono text-slate-400">/ Executive Profile</span>
            </div>
            
            <div className="flex items-center gap-4">
              {visitorCount !== null && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-250/30">
                  <Eye className="h-3.5 w-3.5" style={{ color: themeAccent }} />
                  <span>{visitorCount.toLocaleString()} views</span>
                </div>
              )}

              <button
                onClick={handleCopyLink}
                className="rounded-lg px-3 py-1.5 text-xs border transition-all flex items-center gap-1.5 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm"
              >
                {copiedSuccess ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Globe className="h-3.5 w-3.5" />}
                <span>{copiedSuccess ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-16">
        
        {/* Profile Card Header */}
        <AnimatedSection className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
          <div className="h-40 md:h-52 w-full relative bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 border-b border-slate-200">
            {coverImageUrl && (
              <img src={coverImageUrl} alt="Cover Banner" className="w-full h-full object-cover opacity-70" />
            )}
          </div>
          
          <div className="px-8 pb-8 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              {portfolio.showProfilePhoto !== false && (
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-4 border-white bg-slate-100 shadow-md">
                  {renderAvatar("w-full h-full object-cover", "text-3xl text-slate-700 bg-slate-200")}
                </div>
              )}
              <div className="md:pb-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{ownerName}</h1>
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold border"
                    style={{ color: themeAccent, borderColor: `${themeAccent}25`, backgroundColor: `${themeAccent}08` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: themeAccent }} />
                    {availabilityStatus}
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium">{headline}</p>
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400 mt-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{userLocation}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:pb-2">
              {activeResume && (
                <button
                  onClick={() => handleQuickAction('resume')}
                  className="inline-flex items-center gap-2 rounded-lg font-bold px-4 py-2.5 text-xs transition-all shadow-sm text-white"
                  style={{ backgroundColor: themeAccent }}
                >
                  <FileText className="h-4 w-4" />
                  <span>Download Resume</span>
                </button>
              )}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 text-xs transition-all shadow-sm"
              >
                <Mail className="h-4 w-4 text-slate-450" />
                <span>Contact Details</span>
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* About Executive Summary */}
        <AnimatedSection className="bg-white border border-slate-200/85 rounded-xl p-8 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-6">
            <UserIcon className="h-4 w-4 text-slate-500" style={{ color: themeAccent }} />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Executive Overview</h2>
          </div>
          <p className="text-sm text-slate-650 leading-relaxed max-w-4xl font-sans">
            {bio}
          </p>
        </AnimatedSection>

        {/* Performance Metrics Dashboard */}
        <AnimatedSection className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-200/60 pb-2">
            <Cpu className="h-4 w-4" style={{ color: themeAccent }} />
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Executive Metrics Index</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Portfolio Index</span>
              <div className="flex items-baseline gap-1.5 my-3">
                <span className="text-3xl font-extrabold text-slate-900">{scores.portfolioScore}</span>
                <span className="text-xs text-slate-450">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-1">
                <div className="h-full" style={{ width: `${scores.portfolioScore}%`, backgroundColor: themeAccent }} />
              </div>
              <p className="text-[9px] text-slate-400">Profile completeness index.</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Years Experience</span>
              <div className="my-3">
                <span className="text-3xl font-extrabold text-slate-900">{displayYearsOfExp}</span>
                <span className="text-xs text-slate-450 ml-1">Years</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2">Verified professional history timeline.</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">ATS Alignment</span>
              <div className="flex items-baseline gap-1.5 my-3">
                <span className="text-3xl font-extrabold text-slate-900">{scores.atsScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-indigo-500" style={{ width: `${scores.atsScore}%` }} />
              </div>
              <p className="text-[9px] text-slate-400">CV parse match rating.</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Recruiter Readiness</span>
              <div className="my-3">
                <span 
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{ color: themeAccent, borderColor: `${themeAccent}25`, backgroundColor: `${themeAccent}08` }}
                >
                  {scores.readinessScore}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2">Evaluation metric status.</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Featured Projects Showcase */}
        {projects.length > 0 && (
          <AnimatedSection className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200/60 pb-2">
              <Code className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Project Portfolio Case Studies</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilterCategory(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs border transition-all ${
                    activeFilterCategory === cat
                      ? 'bg-slate-900 border-slate-900 text-white font-bold'
                      : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-350'
                  }`}
                  style={{
                    backgroundColor: activeFilterCategory === cat ? themeAccent : undefined,
                    borderColor: activeFilterCategory === cat ? themeAccent : undefined
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <article key={project._id} className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-xl overflow-hidden shadow-sm flex flex-col group">
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                    <img src={project.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} alt={project.title} className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300" />
                    <div className="absolute top-3 right-3 rounded bg-white/95 shadow px-2 py-0.5 text-[9px] font-semibold text-slate-850">
                      {project.category}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-650 transition-colors">{project.title}</h3>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed flex-1">{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="rounded bg-slate-100 border border-slate-200/50 px-2 py-0.5 text-[10px] text-slate-600">{tech}</span>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                      <button 
                        onClick={() => setSelectedProject(project)} 
                        className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-55 py-2 text-xs font-semibold text-slate-700 transition-all shadow-sm"
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

        {/* Technical Skills */}
        {skills.length > 0 && (
          <AnimatedSection className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200/60 pb-2">
              <Cpu className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Expertise Index</span>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                    {getCategoryIcon(category)}
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider capitalize">{category}</h3>
                  </div>
                  <div className="space-y-4">
                    {items.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>{skill.name}</span>
                          <span className="font-semibold text-slate-800">{skill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, backgroundColor: themeAccent }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Experience Timeline */}
        {jobExperiences.length > 0 && (
          <AnimatedSection className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200/60 pb-2">
              <Briefcase className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Professional Timeline</span>
            </div>
            <div className="relative border-l border-slate-200 ml-4 space-y-12">
              {jobExperiences.map((exp, idx) => (
                <div key={idx} className="relative pl-8 group">
                  <div 
                    className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-between rounded-full border bg-white transition-transform"
                    style={{ borderColor: themeAccent }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full mx-auto" style={{ backgroundColor: themeAccent }} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {exp.role} @ <span style={{ color: themeAccent }}>{exp.organization}</span>
                    </h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-slate-350" />
                      {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} — {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                    </span>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">{exp.type}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{exp.description}</p>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-500 space-y-1 pl-2 mb-3">
                      {exp.responsibilities.map((r, ri) => (
                        <li key={ri} className="leading-relaxed">{r}</li>
                      ))}
                    </ul>
                  )}
                  {exp.technologiesUsed && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologiesUsed.map(t => (
                        <span key={t} className="rounded bg-slate-100 border border-slate-200/50 px-2 py-0.5 text-[10px] text-slate-600">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Education and Credentials */}
        {(educationExperiences.length > 0 || certifications.length > 0) && (
          <AnimatedSection className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200/60 pb-2">
              <BookOpen className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Education & Credentials</span>
            </div>
            <div className={`grid gap-6 ${educationExperiences.length > 0 && certifications.length > 0 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {educationExperiences.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">// Education</h3>
                  {educationExperiences.map((edu, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{edu.role}</h4>
                          <p className="text-[10px] font-medium" style={{ color: themeAccent }}>{edu.organization}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0 font-mono">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{edu.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {certifications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">// Professional Certifications</h3>
                  <div className="space-y-3">
                    {certifications.slice(0, 3).map((cert) => (
                      <div key={cert._id} className="bg-white border border-slate-200 p-4 flex justify-between items-center gap-3 rounded-xl shadow-sm">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{cert.title}</h4>
                          <p className="text-[10px] text-slate-400">{cert.issuer}</p>
                        </div>
                        {cert.credentialUrl && (
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex-shrink-0 text-[10px] border px-2 py-1 rounded bg-slate-50 font-medium"
                            style={{ color: themeAccent, borderColor: `${themeAccent}25` }}
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

        {/* Recommendations */}
        {testimonials.length > 0 && (
          <AnimatedSection className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200/60 pb-2">
              <Sparkles className="h-4 w-4" style={{ color: themeAccent }} />
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Recommendations</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between">
                  <p className="text-xs text-slate-650 italic leading-relaxed">&ldquo;{testimonial.body}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ color: themeAccent, backgroundColor: `${themeAccent}10` }}
                    >
                      {testimonial.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-900">{testimonial.authorName}</h4>
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
          <div className="flex items-center space-x-2 border-b border-slate-200/60 pb-2">
            <Mail className="h-4 w-4" style={{ color: themeAccent }} />
            <span className="text-xs font-semibold text-slate-850 uppercase tracking-wider">Contact Request Workspace</span>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-5 items-start">
            <div className="lg:col-span-2 space-y-6">
              {(socialLinks.github || socialLinks.linkedin || socialLinks.twitter || socialLinks.website) && (
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 pb-2">// Communication Links</p>
                  {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-slate-550 hover:text-slate-900 transition-colors"><Github className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.github}</span></a>}
                  {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-slate-550 hover:text-slate-900 transition-colors"><Linkedin className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.linkedin}</span></a>}
                  {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-slate-550 hover:text-slate-900 transition-colors"><Twitter className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.twitter}</span></a>}
                  {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-slate-550 hover:text-slate-900 transition-colors"><Globe className="h-4.5 w-4.5" style={{ color: themeAccent }} /><span className="truncate">{socialLinks.website}</span></a>}
                </div>
              )}
            </div>

            <div className="lg:col-span-3 bg-white border border-slate-200 p-6 rounded-xl shadow-sm w-full">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Your Name</label>
                    <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Hiring Partner" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Your Email</label>
                    <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="partner@firm.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Subject</label>
                  <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} placeholder="Opportunity Details" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Message</label>
                  <textarea required rows={4} value={contactBody} onChange={(e) => setContactBody(e.target.value)} placeholder="Type requirements details..." className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 transition-colors resize-none" />
                </div>
                <button 
                  type="submit" 
                  className="w-full text-white font-bold py-3 rounded-lg text-xs transition-all shadow"
                  style={{ backgroundColor: themeAccent }}
                >
                  Submit Inquiry
                </button>
                {contactSuccess && <p className="text-[10px] text-emerald-600 text-center mt-2">✓ Inquiry submitted successfully.</p>}
              </form>
            </div>
          </div>
        </AnimatedSection>

      </main>
    </div>
  );
}
