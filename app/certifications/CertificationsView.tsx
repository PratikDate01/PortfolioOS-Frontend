'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { Certification } from '@/types';
import { Award, ExternalLink, Calendar, Search, ShieldCheck } from 'lucide-react';


export default function CertificationsView({ username }: { username?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: serverCertifications } = useQuery<Certification[]>({
    queryKey: ['certifications', username],
    queryFn: async () => {
      const url = username ? `/certifications?username=${encodeURIComponent(username)}` : '/certifications';
      const res = await apiFetch<Certification[]>(url);
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    retry: false,
  });

  const certifications = serverCertifications || [];

  const categories = ['all', ...Array.from(new Set(certifications.map((c) => c.category)))];

  const filteredCerts = certifications.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-zinc-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-zinc-900 pb-8 mb-12">
            <div className="flex items-center space-x-2 text-teal-400 font-sans text-xs mb-2">
              <Award className="h-4 w-4" />
              <span>Verified Credentials</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-sans sm:text-4xl">Certifications & Badges</h1>
            <p className="mt-3 text-zinc-400">Verified achievements, technical competencies, and professional credentials.</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-10">
            <div className="relative flex-grow max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search credentials by title, issuer, skill..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 pl-10 pr-4 py-2 text-sm text-zinc-200 outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono border transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                      : 'bg-zinc-950/50 text-zinc-400 border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          {filteredCerts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl">
              <Award className="h-8 w-8 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-zinc-400 font-sans">No credentials found</h3>
              <p className="text-xs text-zinc-650 mt-1">Try adjusting your search query or category filter</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCerts.map((cert, index) => {
                const issueDateStr = new Date(cert.issueDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                });
                const expiryDateStr = cert.expiryDate
                  ? new Date(cert.expiryDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                    })
                  : 'No Expiry';

                return (
                  <article
                    key={cert._id || index}
                    className="flex flex-col overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800 transition-all duration-300 group"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-zinc-900 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute top-3 right-3 rounded bg-zinc-950/90 px-2 py-0.5 text-[10px] font-mono text-teal-400 border border-teal-500/20">
                        {cert.category.charAt(0).toUpperCase() + cert.category.slice(1)}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center space-x-1.5 text-xs text-zinc-400 mb-1.5 font-sans font-semibold">
                          <ShieldCheck className="h-4 w-4 text-teal-500" />
                          <span>{cert.issuer}</span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors leading-snug">
                          {cert.title}
                        </h3>

                        <div className="mt-3 flex items-center space-x-2 text-[10px] font-mono text-zinc-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {issueDateStr} – {expiryDateStr}
                          </span>
                        </div>

                        {/* Skill badges */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {cert.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {cert.credentialUrl && (
                        <div className="mt-6 pt-4 border-t border-zinc-900/60 flex justify-end">
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-400 hover:text-teal-300 font-mono"
                          >
                            <span>Verify Credential</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
