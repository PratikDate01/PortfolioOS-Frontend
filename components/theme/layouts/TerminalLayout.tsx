'use client';

import React from 'react';
import { 
  Eye, Cpu, Database, Cloud, Brain, CheckCircle2, Award, FileText, Code, 
  Mail, Github, Linkedin, Twitter, Globe, MapPin, BookOpen, Briefcase, Sparkles, Calendar, Terminal
} from 'lucide-react';
import { ThemeLayoutProps } from './types';
import GitHubStats from '@/components/sections/GitHubStats';

export default function TerminalLayout({
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

  const ownerName = (portfolio.ownerId as any)?.name || username;
  const headline = portfolio.headline || 'Software Engineer & Designer';
  const bio = portfolio.bio || (portfolio.ownerId as any)?.bio || 'Building future-focused applications.';
  const githubUser = portfolio.githubUsername || (portfolio.ownerId as any)?.githubUsername || '';
  const userLocation = (portfolio.ownerId as any)?.location || 'Remote / Worldwide';
  const availabilityStatus = (portfolio.ownerId as any)?.availabilityStatus || 'Available for Opportunities';

  const educationExperiences = experiences.filter(exp => exp.type === 'education');
  const jobExperiences = experiences.filter(exp => exp.type === 'job' || exp.type === 'internship');

  const renderProgressBar = (percentage: number) => {
    const totalBars = 20;
    const filledBars = Math.round((percentage / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    return `[${'='.repeat(filledBars)}${' '.repeat(emptyBars)}] ${percentage}%`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-green-400 font-mono selection:bg-green-500/30 p-4 md:p-8 space-y-12">
      
      {/* simulated CLI Header */}
      <div className="border border-green-500/20 rounded-md p-3 text-xs bg-zinc-950/30">
        <p className="opacity-60">// PORTFOLIO OS TERMINAL INTERACTION SERVICE</p>
        <p className="opacity-60">Last login: {new Date().toUTCString()} on ttys002</p>
        <p className="text-white mt-1">Type help or navigate sections below. Secure connection verified.</p>
        {visitorCount !== null && (
          <p className="text-yellow-500 mt-1">● Views logged: {visitorCount.toLocaleString()} visualizers</p>
        )}
      </div>

      {/* Hero: whoami */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-white">
          <Terminal className="h-4 w-4 text-green-500" />
          <span>guest@{username}:~$ whoami</span>
        </div>
        
        <div className="border-l-2 border-green-500/30 pl-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {portfolio.showProfilePhoto !== false && (
              <div className="relative w-24 h-24 rounded border border-green-500/30 bg-black overflow-hidden flex-shrink-0">
                {renderAvatar("w-full h-full object-cover grayscale brightness-90 contrast-125", "text-xl text-green-500")}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-white uppercase">{ownerName}</h1>
              <p className="text-xs text-green-300 font-semibold">{headline}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs mt-2 opacity-80">
                <span>Location: {userLocation}</span>
                <span>Status: {availabilityStatus}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-green-300/80 leading-relaxed max-w-4xl">
            {bio}
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-xs">
            {activeResume && (
              <button 
                onClick={() => handleQuickAction('resume')}
                className="bg-green-500 text-black px-4 py-1.5 font-bold hover:bg-green-400 transition-colors"
              >
                ./download_cv.sh
              </button>
            )}
            <button 
              onClick={handleCopyLink}
              className="border border-green-500/30 hover:bg-green-950/20 text-green-400 px-4 py-1.5 transition-all"
            >
              ./share_profile.sh
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot: ./snapshot.sh */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-white">
          <Terminal className="h-4 w-4 text-green-500" />
          <span>guest@{username}:~$ ./snapshot.sh</span>
        </div>
        
        <div className="border border-green-500/20 bg-zinc-950/20 rounded p-4 max-w-3xl text-xs space-y-2">
          <p className="text-white border-b border-green-500/20 pb-1">CANDIDATE STATS MATRIX</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div>
              <p className="opacity-50">EXP_YEARS</p>
              <p className="text-base font-bold text-white">{displayYearsOfExp}</p>
            </div>
            <div>
              <p className="opacity-50">PROJECTS_COUNT</p>
              <p className="text-base font-bold text-white">{projects.length}</p>
            </div>
            <div>
              <p className="opacity-50">SKILLS_VERIFIED</p>
              <p className="text-base font-bold text-white">{skills.length}</p>
            </div>
            <div>
              <p className="opacity-50">CERTIFICATIONS</p>
              <p className="text-base font-bold text-white">{certifications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Dashboard */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-white">
          <Terminal className="h-4 w-4 text-green-500" />
          <span>guest@{username}:~$ ./recruiter-intel.sh</span>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="border border-green-500/20 p-4 rounded bg-zinc-950/20">
            <p className="opacity-50">COMPLETENESS</p>
            <p className="text-xl font-bold text-white my-1">{scores.portfolioScore} / 100</p>
            <p className="text-[10px] opacity-75">{renderProgressBar(scores.portfolioScore)}</p>
          </div>

          <div className="border border-green-500/20 p-4 rounded bg-zinc-950/20">
            <p className="opacity-50">READINESS</p>
            <p className="text-xl font-bold text-white my-1">{scores.readinessScore}</p>
            <p className="text-[10px] opacity-75">Verified formatting status.</p>
          </div>

          <div className="border border-green-500/20 p-4 rounded bg-zinc-950/20">
            <p className="opacity-50">ATS_MATCH</p>
            <p className="text-xl font-bold text-white my-1">{scores.atsScore}%</p>
            <p className="text-[10px] opacity-75">{renderProgressBar(scores.atsScore)}</p>
          </div>

          <div className="border border-green-500/20 p-4 rounded bg-zinc-950/20">
            <p className="opacity-50">GITHUB_SYNC</p>
            <p className="text-xl font-bold text-white my-1">{scores.githubHealth}</p>
            <p className="text-[10px] opacity-75">Database sync status active.</p>
          </div>
        </div>
      </div>

      {/* GitHub Integration */}
      {githubUser && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Terminal className="h-4 w-4 text-green-500" />
            <span>guest@{username}:~$ ./github-metrics.sh</span>
          </div>
          <div className="border border-green-500/20 p-4 rounded bg-zinc-950/20 text-xs">
            <GitHubStats username={githubUser} />
          </div>
        </div>
      )}

      {/* Projects Showcase */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Terminal className="h-4 w-4 text-green-500" />
            <span>guest@{username}:~$ ls projects/</span>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilterCategory(cat)}
                className={`px-3.5 py-1 border transition-all ${
                  activeFilterCategory === cat
                    ? 'bg-green-500 text-black border-green-500 font-bold'
                    : 'bg-black text-green-500 border-green-500/30 hover:border-green-500'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-xs">
            {filteredProjects.map((project) => (
              <div key={project._id} className="border border-green-500/20 bg-zinc-950/30 rounded p-5 flex flex-col justify-between group hover:border-green-500/50 transition-colors">
                <div>
                  <span className="opacity-50 font-semibold">[{project.category.toUpperCase()}]</span>
                  <h4 className="text-white text-sm font-bold mt-2">{project.title}</h4>
                  <p className="text-green-300/80 mt-2 line-clamp-3 leading-relaxed">{project.summary}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-green-500/10">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map(t => (
                      <span key={t} className="opacity-50">#{t}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => setSelectedProject(project)} 
                    className="w-full bg-green-950/40 hover:bg-green-950/70 border border-green-500/30 py-2 text-xs font-bold text-green-400 transition-colors"
                  >
                    cat case_study.txt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills config: cat skills.conf */}
      {skills.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Terminal className="h-4 w-4 text-green-500" />
            <span>guest@{username}:~$ cat skills.conf</span>
          </div>
          
          <div className="border border-green-500/20 p-6 rounded bg-zinc-950/20 grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-xs">
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <p className="text-white border-b border-green-500/20 pb-1 font-bold uppercase">{category}</p>
                <div className="space-y-2">
                  {items.map(skill => (
                    <div key={skill.name}>
                      <p>{skill.name}</p>
                      <p className="text-green-500/80 font-mono mt-0.5">{renderProgressBar(skill.proficiency)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work History Timeline */}
      {jobExperiences.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Terminal className="h-4 w-4 text-green-500" />
            <span>guest@{username}:~$ ./experience.sh --all</span>
          </div>
          
          <div className="relative border-l border-green-500/20 ml-4 space-y-8 text-xs">
            {jobExperiences.map((exp, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-green-500 border border-black" />
                <p className="text-white font-bold">{exp.role} @ <span className="text-green-300">{exp.organization}</span></p>
                <p className="opacity-50">{new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}</p>
                <p className="text-green-300/80 mt-1 leading-relaxed">{exp.description}</p>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 pl-2 mt-2 opacity-75">
                    {exp.responsibilities.map((r, ri) => <li key={ri}>{r}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credentials */}
      {(educationExperiences.length > 0 || certifications.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Terminal className="h-4 w-4 text-green-500" />
            <span>guest@{username}:~$ ls credentials/</span>
          </div>
          
          <div className="border border-green-500/20 p-5 rounded bg-zinc-950/20 text-xs grid gap-6 md:grid-cols-2">
            {educationExperiences.length > 0 && (
              <div className="space-y-3">
                <p className="text-white border-b border-green-500/20 pb-1">// Education</p>
                {educationExperiences.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-white">{edu.role} - <span className="text-green-300">{edu.organization}</span></p>
                    <p className="opacity-50">{new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}</p>
                    <p className="opacity-75">{edu.description}</p>
                  </div>
                ))}
              </div>
            )}

            {certifications.length > 0 && (
              <div className="space-y-3">
                <p className="text-white border-b border-green-500/20 pb-1">// Certs</p>
                {certifications.slice(0, 3).map(cert => (
                  <div key={cert._id} className="flex justify-between items-center border-b border-green-500/10 pb-2">
                    <div>
                      <p className="font-bold text-white">{cert.title}</p>
                      <p className="opacity-50">{cert.issuer}</p>
                    </div>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:underline border border-green-500/20 px-2 py-0.5 rounded">verify</a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-white">
            <Terminal className="h-4 w-4 text-green-500" />
            <span>guest@{username}:~$ cat testimonials.log</span>
          </div>
          
          <div className="space-y-4 text-xs">
            {testimonials.map((test) => (
              <div key={test._id} className="border border-green-500/20 p-4 rounded bg-zinc-950/10">
                <p className="italic text-green-300/90">&ldquo;{test.body}&rdquo;</p>
                <p className="text-right mt-2 text-white font-bold">- {test.authorName} ({test.authorRole} {test.authorCompany ? `@ ${test.authorCompany}` : ''})</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Form */}
      <div id="contact" className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-white">
          <Terminal className="h-4 w-4 text-green-500" />
          <span>guest@{username}:~$ mail -s &quot;Inquiry&quot; administrator</span>
        </div>
        
        <div className="border border-green-500/20 p-6 rounded bg-zinc-950/20 text-xs max-w-2xl">
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block opacity-55 mb-1">FROM_NAME</label>
                <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Hiring Specialist" className="w-full bg-black border border-green-500/30 text-green-400 p-2.5 rounded outline-none focus:border-green-400 font-mono" />
              </div>
              <div>
                <label className="block opacity-55 mb-1">FROM_EMAIL</label>
                <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="lead@company.com" className="w-full bg-black border border-green-500/30 text-green-400 p-2.5 rounded outline-none focus:border-green-400 font-mono" />
              </div>
            </div>
            <div>
              <label className="block opacity-55 mb-1">SUBJECT</label>
              <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} placeholder="Opportunity Details" className="w-full bg-black border border-green-500/30 text-green-400 p-2.5 rounded outline-none focus:border-green-400 font-mono" />
            </div>
            <div>
              <label className="block opacity-55 mb-1">MESSAGE_BODY</label>
              <textarea required rows={4} value={contactBody} onChange={(e) => setContactBody(e.target.value)} placeholder="Type message lines..." className="w-full bg-black border border-green-500/30 text-green-400 p-2.5 rounded outline-none focus:border-green-400 font-mono resize-none" />
            </div>
            <button 
              type="submit" 
              className="bg-green-500 text-black px-6 py-2.5 font-bold hover:bg-green-400 transition-colors uppercase w-full"
            >
              send_mail
            </button>
            {contactSuccess && <p className="text-center text-emerald-450 mt-2">✓ Message queued successfully.</p>}
          </form>
        </div>
      </div>

    </div>
  );
}
