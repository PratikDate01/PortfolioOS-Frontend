'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { API_BASE_URL } from '@/lib/config';
import { Download, Mail, Globe, MapPin, Award, Loader2 } from 'lucide-react';
import { Project, Experience, Skill, Certification, Portfolio, Resume } from '@/types';

export default function ResumeView({ username }: { username?: string }) {
  // 1. Fetch Portfolio details by Username
  const { data: portfolio, isLoading: isPortfolioLoading } = useQuery<Portfolio>({
    queryKey: ['portfolio', username],
    queryFn: async () => {
      if (!username) throw new Error('Username required');
      const res = await apiFetch<Portfolio>(`/portfolios/${username}`);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    enabled: !!username,
  });

  // 2. Fetch User Experiences
  const { data: experiences = [], isLoading: isExperiencesLoading } = useQuery<Experience[]>({
    queryKey: ['experiences', username],
    queryFn: async () => {
      if (!username) return [];
      const res = await apiFetch<Experience[]>(`/experience?username=${username}`);
      return res.data || [];
    },
    enabled: !!username,
  });

  // 3. Fetch User Skills
  const { data: skills = [], isLoading: isSkillsLoading } = useQuery<Skill[]>({
    queryKey: ['skills', username],
    queryFn: async () => {
      if (!username) return [];
      const res = await apiFetch<Skill[]>(`/skills?username=${username}`);
      return res.data || [];
    },
    enabled: !!username,
  });

  // 4. Fetch User Certifications
  const { data: certifications = [], isLoading: isCertsLoading } = useQuery<Certification[]>({
    queryKey: ['certifications', username],
    queryFn: async () => {
      if (!username) return [];
      const res = await apiFetch<Certification[]>(`/certifications?username=${username}`);
      return res.data || [];
    },
    enabled: !!username,
  });

  // 5. Fetch Resumes (for PDF file link)
  const { data: resumes = [], isLoading: isResumesLoading } = useQuery<Resume[]>({
    queryKey: ['resumes', username],
    queryFn: async () => {
      if (!username) return [];
      const res = await apiFetch<Resume[]>(`/resume?username=${username}`);
      return res.data || [];
    },
    enabled: !!username,
  });

  const activeResume = resumes.find((r) => r.isActive) || resumes[0];

  const handlePrintOrDownload = () => {
    if (activeResume?._id) {
      window.open(`${API_BASE_URL}/resume/${activeResume._id}/download`, '_blank');
    } else {
      window.print();
    }
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return 'Present';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const isLoading =
    isPortfolioLoading ||
    isExperiencesLoading ||
    isSkillsLoading ||
    isCertsLoading ||
    isResumesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-300">
        <Loader2 className="h-10 w-10 animate-spin text-teal-400 mb-4" />
        <p className="text-sm font-mono tracking-wide">Compiling resume sheet...</p>
      </div>
    );
  }

  // Resolve dynamic values
  const ownerName = (portfolio?.ownerId as any)?.name || username || 'Developer';
  const headline = portfolio?.headline || 'Software Engineer & Designer';
  const bio = portfolio?.bio || (portfolio?.ownerId as any)?.bio || 'Building future-focused applications.';
  const email = (portfolio?.ownerId as any)?.email || '';
  const location = (portfolio?.ownerId as any)?.location || 'Remote / Worldwide';
  const socialLinks = portfolio?.socialLinks || {};

  const jobs = experiences
    .filter((exp) => exp.type === 'job' || exp.type === 'internship')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const education = experiences
    .filter((exp) => exp.type === 'education')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-900 print:hidden">
            <div>
              <h1 className="text-2xl font-bold text-white font-sans">Resume</h1>
              <p className="text-xs text-zinc-500 mt-1">Professional resume and credentials</p>
            </div>
            <button
              onClick={handlePrintOrDownload}
              className="flex items-center space-x-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 px-4 py-2 text-xs font-mono font-bold transition-all"
            >
              <Download className="h-4 w-4" />
              <span>{activeResume?._id ? 'Download PDF' : 'Download / Print'}</span>
            </button>
          </div>

          {/* Printable Resume Sheet */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-8 md:p-12 shadow-2xl font-sans text-zinc-300 print:border-none print:shadow-none print:p-0">
            
            {/* Header */}
            <div className="border-b border-zinc-900 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">{ownerName}</h2>
                <div className="text-teal-400 font-mono text-sm mt-1.5">{headline}</div>
                <p className="text-zinc-500 text-xs mt-3 flex items-center space-x-2">
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                </p>
              </div>

              <div className="font-mono text-xs text-zinc-500 space-y-1.5 md:text-right">
                {email && (
                  <div className="flex items-center md:justify-end space-x-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-600" />
                    <span>{email}</span>
                  </div>
                )}
                {socialLinks.github && (
                  <div className="flex items-center md:justify-end space-x-2">
                    <Globe className="h-3.5 w-3.5 text-zinc-600" />
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                      {socialLinks.github.replace('https://', '')}
                    </a>
                  </div>
                )}
                {socialLinks.linkedin && (
                  <div className="flex items-center md:justify-end space-x-2">
                    <Globe className="h-3.5 w-3.5 text-zinc-600" />
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                      {socialLinks.linkedin.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {bio && (
              <div className="mb-8">
                <h3 className="text-sm font-sans text-zinc-500 mb-3 uppercase tracking-wider font-semibold">Summary</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {bio}
                </p>
              </div>
            )}

            {/* Experience */}
            {jobs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-sans text-zinc-500 mb-5 uppercase tracking-wider font-semibold">Work & Internship Experience</h3>
                
                <div className="space-y-6">
                  {jobs.map((job, idx) => (
                    <div key={job._id || idx}>
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h4 className="text-sm font-bold text-white">{job.role} @ {job.organization}</h4>
                        <span className="text-xs font-mono text-zinc-500">
                          {formatDate(job.startDate)} — {job.endDate ? formatDate(job.endDate) : 'Present'}
                        </span>
                      </div>
                      {job.technologiesUsed && job.technologiesUsed.length > 0 && (
                        <p className="text-xs text-teal-500/80 font-mono mt-0.5">
                          {job.technologiesUsed.join(' • ')}
                        </p>
                      )}
                      {job.description && (
                        <p className="text-xs text-zinc-400 leading-relaxed mt-2 pl-1">
                          {job.description}
                        </p>
                      )}
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside mt-2.5 space-y-1.5 text-xs text-zinc-400 leading-relaxed pl-1">
                          {job.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx}>{resp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Education Grid */}
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              {/* Technical Skills */}
              {skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-sans text-zinc-500 mb-4 uppercase tracking-wider font-semibold">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill._id || skill.name} className="rounded bg-zinc-900 px-2.5 py-1 text-xs font-mono text-zinc-300 border border-zinc-850">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h3 className="text-sm font-sans text-zinc-500 mb-4 uppercase tracking-wider font-semibold">Education</h3>
                  <div className="space-y-4">
                    {education.map((edu, idx) => (
                      <div key={edu._id || idx}>
                        <h4 className="text-sm font-bold text-white">{edu.organization}</h4>
                        <div className="text-xs text-zinc-500 font-mono mt-0.5">
                          {edu.role}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">
                          {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h3 className="text-sm font-sans text-zinc-500 mb-4 uppercase tracking-wider font-semibold">Credentials & Certifications</h3>
                <div className="grid gap-3 sm:grid-cols-2 text-xs text-zinc-400">
                  {certifications.map((cert, idx) => (
                    <div key={cert._id || idx} className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-teal-500 shrink-0" />
                      <span>{cert.title} — {cert.issuer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
