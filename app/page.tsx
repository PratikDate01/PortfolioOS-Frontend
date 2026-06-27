'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import {
  Sparkles, Terminal, Cpu, Database, Brain, ArrowRight, Shield, BarChart3, Globe, Award, CheckCircle2, ChevronRight, Laptop, Code, FileText, HeartHandshake, Eye
} from 'lucide-react';

export default function MarketingLandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500/20 overflow-hidden relative">
      <Navbar />

      {/* Decorative Glow Elements */}
      <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[5%] w-[40vw] h-[40vw] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[70%] left-[20%] w-[35vw] h-[35vw] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <main className="flex-grow z-10">
        
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            
            {/* SaaS Banner */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-teal-500/30 bg-teal-950/10 px-4 py-1.5 text-xs font-semibold text-teal-400 mx-auto animate-fade-in font-mono">
              <Sparkles className="h-4 w-4 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Announcing Portfolio OS 2.0 SaaS Transformation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl font-sans max-w-4xl mx-auto leading-[1.1] sm:leading-[1.1]">
              The Ultimate Developer Portfolio <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                As A Service
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Transform your projects, experiences, and accomplishments into highly isolated, multi-tenant interactive web spaces. Complete with AI assistant chat widgets, dynamic themes, and integrated analytics.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 px-6 py-3.5 text-sm font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all flex items-center gap-2 group font-sans"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 px-6 py-3.5 text-sm font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all flex items-center gap-2 group font-sans"
                  >
                    <span>Create Your Portfolio Free</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-md hover:bg-zinc-900 px-6 py-3.5 text-sm font-bold text-zinc-300 transition-all font-sans"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Live Demos Check */}
            <div id="examples" className="pt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs font-mono text-zinc-500">
              <span>Try Live User Pages:</span>
              <Link href="/p/pratik-date" className="text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1">
                <span>@pratik-date</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
              <span className="text-zinc-800">|</span>
              <Link href="/p/jane-doe" className="text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1">
                <span>@jane-doe</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

          </div>
        </section>

        {/* Core SaaS Capabilities Grid */}
        <section id="features" className="py-24 border-b border-zinc-900 bg-zinc-950/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Engineered for Modern Professionals</h2>
              <p className="text-zinc-400 text-base">All the tools required to showcase your engineering profile with dynamic SaaS features.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Laptop className="h-6 w-6 text-teal-400" />,
                  title: 'Obsidian Teal Portfolio OS',
                  desc: 'Designed with obsidian teal retro-terminal design aesthetics to wow visitors and recruiters instantly.'
                },
                {
                  icon: <Brain className="h-6 w-6 text-purple-400" />,
                  title: 'Personalized AI Agent Widget',
                  desc: 'Embed an interactive AI chatbot on your public portfolio page. Trained dynamically on your exact resume and project history to pitch to recruiters.'
                },
                {
                  icon: <FileText className="h-6 w-6 text-indigo-400" />,
                  title: 'AI Resume Parser & Optimizer',
                  desc: 'Upload a PDF resume to parse it instantly into structured databases. Generate optimized bios, project descriptions, and skill matrix suggestions.'
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-sky-400" />,
                  title: 'Granular Visitor Analytics',
                  desc: 'Monitor page views, referral sources, device types, and project case study interactions. Cleanly isolated to prevent cross-tenant data leakage.'
                },
                {
                  icon: <Award className="h-6 w-6 text-emerald-400" />,
                  title: 'Professional Achievements & Badges',
                  desc: 'Unlock professional accomplishments and display them as verified badges.'
                },
                {
                  icon: <Globe className="h-6 w-6 text-amber-400" />,
                  title: 'Custom Domain Mapping',
                  desc: 'Map your public profile to your own domain (e.g. yourname.com) with automatic SSL provisioning and low-latency edge resolution.'
                }
              ].map((feat, idx) => (
                <div key={idx} className="rounded-2xl border border-zinc-850 bg-zinc-950 p-6 shadow-xl relative hover:border-zinc-750 transition-colors group">
                  <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plan Grid */}
        <section id="templates" className="py-24 border-b border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Transparent, Scale-Friendly Pricing</h2>
              <p className="text-zinc-400 text-base">Select the subscription tier that matches your career showcase ambitions.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 items-stretch max-w-5xl mx-auto">
              
              {/* Free Plan */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950 p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">Free Developer</h3>
                  <p className="text-zinc-550 text-xs mt-1">For students and entry-level showcasing.</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">$0</span>
                    <span className="text-zinc-500 text-xs font-semibold">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-4 text-sm text-zinc-400">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                      <span>Up to 3 Projects published</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                      <span>Default OS Theme layout</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                      <span>10 AI optimization queries / mo</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                      <span>Basic visitor log count</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="mt-8 w-full text-center rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-bold py-3 text-xs transition-all"
                >
                  Register Free
                </Link>
              </div>

              {/* Pro Plan (Best Value) */}
              <div className="rounded-2xl border-2 border-teal-500 bg-zinc-950 p-8 flex flex-col justify-between shadow-2xl relative">
                <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-teal-500 px-3 py-1 text-[10px] font-bold text-zinc-950 font-mono uppercase tracking-wider">
                  Recommended
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">Professional OS</h3>
                  <p className="text-zinc-550 text-xs mt-1">For active job hunters and consultants.</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">$9</span>
                    <span className="text-zinc-500 text-xs font-semibold">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-4 text-sm text-zinc-400">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 flex-shrink-0" />
                      <span className="text-white font-medium">Unlimited Projects & Skills</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 flex-shrink-0" />
                      <span>Premium Portfolio OS Theme Layout</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 flex-shrink-0" />
                      <span>100 AI queries & Resume parsing</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 flex-shrink-0" />
                      <span>Full visitor location analytics</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 flex-shrink-0" />
                      <span>Custom domain support (ssl)</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="mt-8 w-full text-center rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold py-3 text-xs transition-all shadow-md shadow-teal-500/10"
                >
                  Get Pro Access
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-950 p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">Enterprise / Custom</h3>
                  <p className="text-zinc-550 text-xs mt-1">For agency portfolios and VIP setups.</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">$29</span>
                    <span className="text-zinc-500 text-xs font-semibold">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-4 text-sm text-zinc-400">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                      <span>Everything in Pro Plan</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                      <span>Custom-coded HTML/CSS layout templates</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                      <span>Unlimited AI assistant tokens</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 flex-shrink-0" />
                      <span>24/7 Priority support hotline</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="mt-8 w-full text-center rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-bold py-3 text-xs transition-all"
                >
                  Contact Sales
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 max-w-5xl mx-auto px-4">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px]" />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans max-w-xl mx-auto leading-tight">
              Ready to Upgrade Your Professional Brand?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
              Document your software engineering stack in a unified, AI-driven environment. Setup takes less than 2 minutes.
            </p>
            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 px-6 py-3 text-sm font-bold shadow-lg transition-all"
              >
                <span>Launch Your Space Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
