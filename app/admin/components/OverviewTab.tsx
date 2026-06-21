import React from 'react';
import { LayoutGrid, FileText, Award, Inbox, Terminal } from 'lucide-react';
import { User } from '@/types';

interface OverviewTabProps {
  stats: any;
  user: User;
}

export default function OverviewTab({ stats, user }: OverviewTabProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stats cards */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 font-sans">
          <div className="flex items-center justify-between text-zinc-500 mb-3 text-xs font-semibold">
            <span>Total Projects</span>
            <LayoutGrid className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.projects.total}</div>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 font-sans">
          <div className="flex items-center justify-between text-zinc-500 mb-3 text-xs font-semibold">
            <span>Total Blog Posts</span>
            <FileText className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.blog.total}</div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">
            {stats.blog.published} Published | {stats.blog.draft} Drafts
          </div>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 font-sans">
          <div className="flex items-center justify-between text-zinc-500 mb-3 text-xs font-semibold">
            <span>Total Certifications</span>
            <Award className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.certifications.total}</div>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 font-sans">
          <div className="flex items-center justify-between text-zinc-500 mb-3 text-xs font-semibold">
            <span>Unread Messages</span>
            <Inbox className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.messages.unread}</div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">
            Unread (Total: {stats.messages.total})
          </div>
        </div>
      </div>

      {/* Engagement analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-6 font-sans">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
            <span>Engagement Overview</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-zinc-900 pb-2 text-xs">
              <span className="text-zinc-500">Total Article Views:</span>
              <span className="text-teal-400 font-mono font-semibold">{stats.blog.totalViews}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-2 text-xs">
              <span className="text-zinc-500">Total Post Likes:</span>
              <span className="text-teal-400 font-mono font-semibold">{stats.blog.totalLikes}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Total Pending Testimonials:</span>
              <span className="text-yellow-500 font-mono font-semibold">{stats.testimonials.pending}</span>
            </div>
          </div>
        </div>
 
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/30 p-6 flex flex-col justify-center items-center text-center font-sans">
          <Terminal className="h-8 w-8 text-teal-400 mb-2" />
          <h4 className="text-xs text-zinc-500 font-semibold">Session Status</h4>
          <p className="text-sm text-white font-bold mt-1">Status: Active</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Admin: {user.email}</p>
        </div>
      </div>
    </div>
  );
}
