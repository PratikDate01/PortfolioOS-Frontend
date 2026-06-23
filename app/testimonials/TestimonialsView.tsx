'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { Testimonial, Project } from '@/types';
import { Star, MessageSquare, Plus, CheckCircle, Terminal, User } from 'lucide-react';

const fallbackTestimonials: Testimonial[] = [
  {
    portfolioOwnerId: 'fallback',
    authorName: 'Sarah Jenkins',
    authorRole: 'VP of Product',
    authorCompany: 'OrbitTech Corp',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    body: 'Pratik is an exceptional engineer who transformed our development pipeline. His knowledge of monorepos, isolated builds, and typed schemas saved our team hours.',
    status: 'approved',
  },
  {
    portfolioOwnerId: 'fallback',
    authorName: 'David Chen',
    authorRole: 'CTO',
    authorCompany: 'SaaSify Inc',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    body: 'Outstanding attention to detail and design. The real-time interactive canvas he built works flawlessly, and he was very helpful with training our staff.',
    status: 'approved',
  },
];

export default function TestimonialsView({ username }: { username?: string }) {
  const queryClient = useQueryClient();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);


  // Form states
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorCompany, setAuthorCompany] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [relatedProjectId, setRelatedProjectId] = useState('');

  // Fetch approved testimonials
  const { data: serverTestimonials } = useQuery<Testimonial[]>({
    queryKey: ['testimonials', username],
    queryFn: async () => {
      const url = username ? `/testimonials?username=${encodeURIComponent(username)}` : '/testimonials';
      const res = await apiFetch<Testimonial[]>(url);
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    retry: false,
  });

  // Fetch projects list for form selector
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['projects-list', username],
    queryFn: async () => {
      const url = username ? `/projects?username=${encodeURIComponent(username)}` : '/projects';
      const res = await apiFetch<Project[]>(url);
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    retry: false,
  });

  const testimonials =
    serverTestimonials && serverTestimonials.length > 0
      ? serverTestimonials.filter((t) => t.status === 'approved')
      : fallbackTestimonials;

  // Submit mutation
  const submitMutation = useMutation({
    mutationKey: ['create-testimonial'],
    mutationFn: async (data: Partial<Testimonial> & { username?: string }) => {
      const res = await apiFetch<Testimonial>('/testimonials', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      // Clear form
      setAuthorName('');
      setAuthorRole('');
      setAuthorCompany('');
      setAuthorAvatarUrl('');
      setRating(5);
      setBody('');
      setVideoUrl('');
      setRelatedProjectId('');
      
      // Close modal & show success alerts
      setShowSubmitModal(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 5000);
      
      queryClient.invalidateQueries({ queryKey: ['testimonials', username] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      authorName,
      authorRole,
      authorCompany: authorCompany || undefined,
      authorAvatarUrl: authorAvatarUrl || undefined,
      rating,
      body,
      videoUrl: videoUrl || undefined,
      relatedProjectId: relatedProjectId || undefined,
      username: username || undefined,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />



      <main className="flex-1 bg-zinc-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-zinc-900 pb-8 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-teal-400 font-sans text-xs mb-2">
                <MessageSquare className="h-4 w-4" />
                <span>Verified Recommendations</span>
              </div>
              <h1 className="text-3xl font-bold text-white font-sans sm:text-4xl">Client Testimonials</h1>
              <p className="mt-3 text-zinc-400">Feedback, recommendations, and reviews from product owners and team leads.</p>
            </div>
            
            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-teal-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors font-mono"
            >
              <Plus className="h-4 w-4" />
              <span>Add Recommendation</span>
            </button>
          </div>

          {/* Success Alerts */}
          {successMessage && (
            <div className="mb-8 rounded-lg border border-teal-500/30 bg-teal-950/20 p-4 text-sm text-teal-400 flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                 <p className="font-semibold">Submission Successful</p>
                <p className="text-xs text-zinc-400 mt-1 font-sans">Thank you! Your recommendation has been submitted. It will appear on the page once verified by the administrator.</p>
              </div>
            </div>
          )}

          {/* Testimonial grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((test, index) => (
              <div
                key={test._id || index}
                className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mb-4 text-teal-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < test.rating ? 'fill-teal-400' : 'text-zinc-800'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                    &ldquo;{test.body}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-900/60 flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    {test.authorAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={test.authorAvatarUrl} alt={test.authorName} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-zinc-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{test.authorName}</h4>
                    <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                      {test.authorRole}
                      {test.authorCompany && ` @ ${test.authorCompany}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white font-sans flex items-center space-x-2 border-b border-zinc-900 pb-4 mb-6">
              <Terminal className="h-4.5 w-4.5 text-teal-400" />
              <span>Submit Recommendation</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1.5 font-semibold">Your Name *</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Sarah Jenkins"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1.5 font-semibold">Your Role *</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. VP of Product"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1.5 font-semibold">Your Company</label>
                  <input
                    type="text"
                    value={authorCompany}
                    onChange={(e) => setAuthorCompany(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. OrbitTech Corp"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1.5 font-semibold">Avatar Image URL</label>
                  <input
                    type="url"
                    value={authorAvatarUrl}
                    onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500 transition-colors"
                    placeholder="https://images.unsplash.com..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans text-zinc-400 mb-1.5 font-semibold">Rating (1-5 Stars)</label>
                <div className="flex items-center space-x-2 bg-zinc-900/35 border border-zinc-800 rounded-lg p-2.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRating(stars)}
                      className="text-zinc-600 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          stars <= rating ? 'text-teal-400 fill-teal-400' : 'text-zinc-800'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-zinc-400 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans text-zinc-400 mb-1.5 font-semibold">Recommendation *</label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-205 outline-none focus:border-teal-500 transition-colors font-sans"
                  placeholder="Share details about collaboration quality, speed, or outcomes..."
                  required
                />
              </div>

              {projects && projects.length > 0 && (
                <div>
                  <label className="block text-[10px] font-sans text-zinc-400 mb-1.5 font-semibold">Related Project</label>
                  <select
                    value={relatedProjectId}
                    onChange={(e) => setRelatedProjectId(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500 transition-colors font-mono"
                  >
                    <option value="">Select Project (Optional)</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-lg border border-zinc-850 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors disabled:opacity-50"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
