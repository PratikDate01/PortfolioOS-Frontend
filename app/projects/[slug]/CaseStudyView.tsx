'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { Project } from '@/types';
import { ArrowLeft, Github, Globe, Eye, Server, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Dynamic fallback generator
const getFallbackProjects = (username: string = 'developer'): Project[] => [
  {
    ownerId: 'fallback',
    title: 'SpeakWrite',
    slug: 'speakwrite',
    summary: 'A full-stack web application designed for text-to-speech conversion with custom options.',
    description: 'SpeakWrite is a clean, simple utility to convert text into speech. Built with modern web technologies, it features an interactive interface with options to customize speed, pitch, and voice, making digital content more accessible.',
    coverImageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80',
    techStack: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    category: 'Frontend Web',
    tags: ['Accessibility', 'Web Speech API', 'Audio'],
    links: { github: `https://github.com/${username}/SpeakWrite`, liveDemo: 'https://speakwrite.netlify.app/' },
    gallery: [],
    caseStudy: {
      problem: 'Digital content remains inaccessible to visually impaired users or users who prefer auditory learning.',
      research: 'Evaluated browser compatibility of Web Speech APIs and optimized client-side text parsing.',
      architecture: 'React User Interface -> Parameter state selection -> Speech Synthesis API triggering.',
      challenges: 'Speech engines and voice lists vary across browsers and operating systems.',
      solutions: 'Created fallback default voice hooks and dynamically populated available browser speech lists.',
      results: 'Delivered an intuitive text-to-speech utility with responsive custom selectors.',
      metrics: [
        { label: 'SUPPORTED_VOICES', value: '12+' },
        { label: 'CLIENT_SIDE_LATENCY', value: '<50ms' },
        { label: 'ACCESSIBILITY_COMPLIANCE', value: 'WCAG 2.1' }
      ],
      lessonsLearned: 'Simple browser APIs are highly capable if standard compatibility wrappers are implemented correctly.'
    },
    status: 'published',
    featured: true,
    viewCount: 154,
    order: 1
  },
  {
    ownerId: 'fallback',
    title: 'Mind Map Generator',
    slug: 'mind-map-generator',
    summary: 'An interactive visual tool that allows users to dynamically generate, edit, and visualize mind maps.',
    description: 'Mind Map Generator provides a visual canvas for mapping out thoughts, brainstorming ideas, and structuring information. Users can create nodes, establish relationships, and design interactive diagrams dynamically.',
    coverImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    techStack: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    category: 'Frontend Web',
    tags: ['Visualization', 'SVG', 'Interactive Canvas'],
    links: { github: `https://github.com/${username}/Mind-Map-Generator`, liveDemo: 'https://pratikdate.netlify.app/' },
    gallery: [],
    caseStudy: {
      problem: 'Brainstorming flows are often slow when using standard diagramming utilities with complex layout configurations.',
      research: 'Compared HTML canvas drawing vs SVG rendering for responsive node manipulations.',
      architecture: 'Hierarchical node state -> Tree traversal calculation -> Scalable Vector Graphics (SVG) rendering.',
      challenges: 'Overlapping coordinate grids when adding multiple sibling nodes to a single parent branch.',
      solutions: 'Developed a basic node displacement layout solver that auto-positions siblings based on subtree depth.',
      results: 'Built a responsive visualization tool allowing users to map concepts seamlessly.',
      metrics: [
        { label: 'CANVAS_ZOOM_LIMITS', value: '0.5x - 2.0x' },
        { label: 'NODE_ADD_RENDER_TIME', value: '<10ms' },
        { label: 'MAX_ACTIVE_NODES', value: '150+' }
      ],
      lessonsLearned: 'Relying on state-driven SVG layouts makes React updates highly predictable compared to manual canvas painting.'
    },
    status: 'published',
    featured: true,
    viewCount: 210,
    order: 2
  },
  {
    ownerId: 'fallback',
    title: 'AI Code Reviewer System',
    slug: 'ai-code-reviewer',
    summary: 'An AI-powered system designed to analyze and review code quality with intelligent suggestions.',
    description: 'AI Code Reviewer automates pull request code diagnostics. By analyzing syntax structures, it detects performance regressions, typical bugs, and security weaknesses, suggesting exact code corrections for developers.',
    coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    techStack: ['Node.js', 'Express.js', 'React.js', 'Gemini API'],
    category: 'Artificial Intelligence',
    tags: ['LLM', 'Static Analysis', 'GitHub Integration'],
    links: { github: `https://github.com/${username}/ai-code-reviewer` },
    gallery: [],
    caseStudy: {
      problem: 'Manual code verification consumes critical development cycles, and simple lint checkers fail to find logical flow flaws.',
      research: 'Configured model prompting to return structured JSON suggestions with line-specific corrections.',
      architecture: 'React File Upload -> Express Handler -> API integration layer -> Gemini model evaluation -> Suggestions UI grid.',
      challenges: 'LLM responses can introduce syntax errors in recommended code blocks.',
      solutions: 'Designed post-processing regex filters and few-shot formatting instructions.',
      results: 'Built an interactive AI reviewer helper verifying code files.',
      metrics: [
        { label: 'ANALYSIS_TURNAROUND', value: '2.5s' },
        { label: 'LOGICAL_FLOW_ACCURACY', value: '94%' },
        { label: 'FORMATTING_COMPLIANCE', value: '100% JSON' }
      ],
      lessonsLearned: 'Narrowing down code blocks using diff context minimizes token cost and improves LLM diagnostic precision.'
    },
    status: 'published',
    featured: true,
    viewCount: 310,
    order: 3
  },
  {
    ownerId: 'fallback',
    title: 'Online Freelance Marketplace Platform',
    slug: 'freelance-marketplace',
    summary: 'A full-stack web platform connecting freelancers and clients with secure authentication.',
    description: 'A marketplace that enables freelancers to list their services and clients to hire them. Features user profiles, search filters, secure authentication sessions, and real-time database transactions.',
    coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    category: 'Full Stack Web',
    tags: ['E-Commerce', 'User Profiles', 'JWT'],
    links: { github: `https://github.com/${username}/freelancermarketplace` },
    gallery: [],
    caseStudy: {
      problem: 'Clients struggle to verify freelancer details and connect securely on early-stage web boards.',
      research: 'Evaluated JWT session models and password hashing strategies using bcrypt.',
      architecture: 'React.js client -> Express.js API gateway -> Mongoose models -> MongoDB.',
      challenges: 'Slow search responses when sorting through multiple candidate profiles and skill criteria.',
      solutions: 'Created compound database indexes on skills lists and rating metrics.',
      results: 'Built a secure, transactional platform matching talent with clients.',
      metrics: [
        { label: 'SEARCH_QUERY_LATENCY', value: '<40ms' },
        { label: 'JWT_EXPIRATION_LIMIT', value: '24h' },
        { label: 'PASSWORD_HASH_SALT', value: '10 rounds' }
      ],
      lessonsLearned: 'Proper schema design and index configuration are essential for high-throughput transactional queries.'
    },
    status: 'published',
    featured: false,
    viewCount: 128,
    order: 4
  },
  {
    ownerId: 'fallback',
    title: 'Drive Clone System',
    slug: 'drive-clone',
    summary: 'A cloud-based file storage system with secure authentication and file management.',
    description: 'Drive Clone provides users with a private cloud environment to upload, organize, and download files. It features secure credential storage, upload progress bars, and nested folders.',
    coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloud Storage'],
    category: 'Cloud Storage',
    tags: ['Cloud', 'Multer', 'File Uploads'],
    links: { github: `https://github.com/${username}/cloud-drive` },
    gallery: [],
    caseStudy: {
      problem: 'Sharing files privately is hard without relying on third-party tracking portals.',
      research: 'Evaluated multipart streams and binary object storage integration.',
      architecture: 'React Client -> Express Upload Handler (Multer) -> Storage directory -> MongoDB file metadata registry.',
      challenges: 'Orphaned temporary files remaining in staging when a user interrupts upload streams.',
      solutions: 'Configured transaction timeouts and validation checkpoints.',
      results: 'Designed a private drive clone for file uploads.',
      metrics: [
        { label: 'MAX_UPLOAD_SIZE', value: '100MB' },
        { label: 'METADATA_WRITE', value: '<15ms' },
        { label: 'FILE_STREAM_RATE', value: 'Full speed' }
      ],
      lessonsLearned: 'Cleaning up transient files after failed requests is crucial for keeping storage nodes tidy.'
    },
    status: 'published',
    featured: false,
    viewCount: 165,
    order: 5
  },
  {
    ownerId: 'fallback',
    title: 'Lost and Found Portal',
    slug: 'lost-found-portal',
    summary: 'A community bulletin board portal to report lost and found items with location tags.',
    description: 'Lost & Found Portal helps communities recover lost items by letting users publish reports with images, categories, and locations. Other users can view reports and securely contact owners.',
    coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    category: 'Full Stack Web',
    tags: ['Community', 'Location Services', 'Geospatial Query'],
    links: { github: `https://github.com/${username}/lost-found-portal` },
    gallery: [],
    caseStudy: {
      problem: 'No structured local system exists for community members to search for lost belongings.',
      research: 'Tested MongoDB geospatial index queries using GeoJSON format markers.',
      architecture: 'Report submission form -> location geolocation indexing -> geospatial proximity search.',
      challenges: 'Filtering reports dynamically based on distance radius and item categories simultaneously.',
      solutions: 'Developed compound database indexing over geospatial tags and category fields.',
      results: 'Created a neighborhood item recovery board.',
      metrics: [
        { label: 'GEOSPATIAL_RADIUS', value: '10km' },
        { label: 'MATCHING_ALERT_TIME', value: '<5s' },
        { label: 'INDEX_TYPE', value: '2dsphere' }
      ],
      lessonsLearned: 'Geospatial database indexes simplify distance radius calculations significantly.'
    },
    status: 'published',
    featured: false,
    viewCount: 92,
    order: 6
  }
];

export default function CaseStudyView({ params, username }: { params: { slug: string }; username?: string }) {
  const { slug } = params;

  // Query project from API
  const { data: serverProject } = useQuery({
    queryKey: ['project', slug, username],
    queryFn: async () => {
      const url = username ? `/projects/${slug}?username=${encodeURIComponent(username)}` : `/projects/${slug}`;
      const res = await apiFetch<Project>(url);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    retry: false
  });

  const project = serverProject || getFallbackProjects(username).find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <Server className="h-12 w-12 text-zinc-700 mb-4 animate-pulse" />
          <h1 className="text-xl font-bold text-zinc-400 font-sans">Case Study Not Found</h1>
          <Link href={username ? `/p/${username}/projects` : "/projects"} className="text-teal-400 mt-4 hover:underline text-sm font-sans flex items-center space-x-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Showcase</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const study = project.caseStudy || {
    problem: 'Detailed case study data is currently compiling or not provided.',
    research: 'N/A',
    architecture: 'N/A',
    challenges: 'N/A',
    solutions: 'N/A',
    results: 'N/A',
    metrics: [],
    lessonsLearned: 'N/A'
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link
            href={username ? `/p/${username}/projects` : "/projects"}
            className="inline-flex items-center space-x-2 text-xs font-sans text-zinc-550 hover:text-teal-400 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Showcase</span>
          </Link>

          {/* Banner */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 relative mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 text-xs font-mono">
                {project.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-4">{project.title}</h1>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xs font-sans text-zinc-400 mb-2 font-semibold">System Summary</h2>
                <p className="text-zinc-300 leading-relaxed">{project.description}</p>
              </div>

              <div>
                <h2 className="text-xs font-sans text-zinc-400 mb-3 font-semibold">Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-200 border border-zinc-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 font-semibold">
                <span className="flex items-center space-x-1.5">
                  <Eye className="h-4 w-4 text-teal-500" />
                  <span>Page Views</span>
                </span>
                <span className="text-zinc-300 font-bold">{project.viewCount}</span>
              </div>

              {(project.links?.github || project.links?.liveDemo) && (
                <div className="space-y-3 pt-4 border-t border-zinc-900">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 rounded-lg border border-zinc-800 py-2.5 text-sm font-sans text-zinc-300 hover:bg-zinc-900 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>View Repository</span>
                    </a>
                  )}
                  {project.links.liveDemo && (
                    <a
                      href={project.links.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 py-2.5 text-sm font-sans font-bold transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Architectural Metrics */}
          {study.metrics && study.metrics.length > 0 && (
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 mb-12">
              <h2 className="text-xs font-mono text-zinc-500 mb-4 flex items-center space-x-1.5 font-semibold">
                <Sparkles className="h-4 w-4 text-teal-400" />
                <span>Architectural Metrics</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {study.metrics.map((metric, idx) => (
                  <div key={idx} className="rounded-lg bg-zinc-900/40 border border-zinc-850 p-4 text-center">
                    <div className="text-[10px] font-sans text-zinc-450 uppercase tracking-wider font-semibold">{metric.label.replace(/_/g, ' ')}</div>
                    <div className="text-lg font-mono font-bold text-teal-400 mt-1.5">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case Study Details */}
          <div className="border-t border-zinc-900 pt-10 space-y-10">
            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">1. The Problem Space</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{study.problem}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">2. Applied Research & Prototypes</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{study.research}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">3. System Architecture Design</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{study.architecture}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">4. Key Challenges & Core Solutions</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-lg bg-zinc-950 border border-red-500/10 p-5">
                  <div className="text-xs font-sans text-red-400 font-bold mb-2">Challenge:</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{study.challenges}</p>
                </div>
                <div className="rounded-lg bg-zinc-950 border border-teal-500/10 p-5">
                  <div className="text-xs font-sans text-teal-400 font-bold mb-2">Solution:</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{study.solutions}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-sans">5. Deployment Outcomes & Results</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{study.results}</p>
            </div>

            <div className="rounded-lg border border-zinc-900 bg-zinc-950/40 p-6">
              <h3 className="text-xs font-sans text-zinc-300 mb-2.5 font-semibold">Lessons Learned</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{study.lessonsLearned}</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
