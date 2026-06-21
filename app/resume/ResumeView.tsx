'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Download, Mail, Globe, MapPin, Award } from 'lucide-react';

export default function ResumeView() {
  const handlePrint = () => {
    window.print();
  };

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
              onClick={handlePrint}
              className="flex items-center space-x-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 px-4 py-2 text-xs font-mono font-bold transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download / Print</span>
            </button>
          </div>

          {/* Printable Resume Sheet */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-8 md:p-12 shadow-2xl font-sans text-zinc-300 print:border-none print:shadow-none print:p-0">
            
            {/* Header */}
            <div className="border-b border-zinc-900 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Pratik Satish Date</h2>
                <div className="text-teal-400 font-mono text-sm mt-1.5">IT Engineering Student & Full Stack Developer</div>
                <p className="text-zinc-500 text-xs mt-3 flex items-center space-x-2">
                  <MapPin className="h-3 w-3" />
                  <span>Pune, India</span>
                </p>
              </div>

              <div className="font-mono text-xs text-zinc-500 space-y-1.5 md:text-right">
                <div className="flex items-center md:justify-end space-x-2">
                  <Mail className="h-3.5 w-3.5 text-zinc-600" />
                  <span>pratikdate.sknsits.it@gmail.com</span>
                </div>
                <div className="flex items-center md:justify-end space-x-2">
                  <Globe className="h-3.5 w-3.5 text-zinc-600" />
                  <span>github.com/PratikDate01</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h3 className="text-sm font-sans text-zinc-500 mb-3 uppercase tracking-wider font-semibold">Summary</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                IT Engineering student with hands-on experience in full-stack development, AI/ML, and cloud technologies. Proven ability to build scalable applications, implement intelligent systems, and solve real-world problems through internships, research, and industry-level projects.
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h3 className="text-sm font-sans text-zinc-500 mb-5 uppercase tracking-wider font-semibold">Internship Experience</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h4 className="text-sm font-bold text-white">Web Development Intern @ Labmentix</h4>
                    <span className="text-xs font-mono text-zinc-500">Jul 2025 — Oct 2025</span>
                  </div>
                  <p className="text-xs text-teal-500/80 font-mono mt-0.5">React.js • Node.js • Express.js • MongoDB • Git</p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5 text-xs text-zinc-400 leading-relaxed pl-1">
                    <li>Developed responsive web applications using React.js and Node.js backend services.</li>
                    <li>Implemented REST APIs and optimized database queries improving performance.</li>
                    <li>Collaborated on frontend-backend integration and version control using Git.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h4 className="text-sm font-bold text-white">AI & Machine Learning Intern @ AICTE Edunet Foundation</h4>
                    <span className="text-xs font-mono text-zinc-500">Jan 2026 — Feb 2026</span>
                  </div>
                  <p className="text-xs text-teal-500/80 font-mono mt-0.5">Python • Machine Learning • NLP • Data Science</p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5 text-xs text-zinc-400 leading-relaxed pl-1">
                    <li>Worked on machine learning models and real-world datasets for predictive analysis.</li>
                    <li>Applied NLP techniques for text processing and intelligent solutions.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <div>
                <h3 className="text-sm font-sans text-zinc-500 mb-4 uppercase tracking-wider font-semibold">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['Java', 'JavaScript', 'Python', 'C', 'C#', 'HTML', 'CSS', 'React.js', 'Node.js', 'Express.js', 'MySQL', 'MongoDB', 'Supabase', 'Git', 'GitHub', 'AWS (Basics)', 'Postman'].map((skill) => (
                    <span key={skill} className="rounded bg-zinc-900 px-2.5 py-1 text-xs font-mono text-zinc-300 border border-zinc-850">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-sans text-zinc-500 mb-4 uppercase tracking-wider font-semibold">Education</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">SKN Sinhgad Institute of Technology and Sciences</h4>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">B.E. in Information Technology • CGPA: 7.54/10</div>
                    <div className="text-xs text-zinc-500 font-mono">2024 — 2027 • Pune, India</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sou. Venutai Chavan Polytechnic</h4>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">Diploma in Information Technology • 82.88%</div>
                    <div className="text-xs text-zinc-500 font-mono">2021 — 2024 • Pune, India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-sm font-sans text-zinc-500 mb-4 uppercase tracking-wider font-semibold">Credentials & Certifications</h3>
              <div className="grid gap-3 sm:grid-cols-2 text-xs text-zinc-400">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-teal-500 shrink-0" />
                  <span>AWS: Machine Learning & AI Fundamentals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-teal-500 shrink-0" />
                  <span>IBM: AI, Java, JavaScript Certifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-teal-500 shrink-0" />
                  <span>Microsoft: C# Certification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-teal-500 shrink-0" />
                  <span>Infosys: Data Structures & Algorithms in Java</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-teal-500 shrink-0" />
                  <span>Job Simulations: Deloitte Cyber & Tech, Accenture, TATA</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
