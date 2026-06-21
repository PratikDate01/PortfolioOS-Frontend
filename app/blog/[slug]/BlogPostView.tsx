'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { apiFetch } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { BlogPost, Comment } from '@/types';
import { Calendar, Clock, ArrowLeft, Terminal, MessageSquare, CornerDownRight, ShieldCheck, Heart, Eye } from 'lucide-react';
import Link from 'next/link';

interface BlogPostViewProps {
  slug: string;
}

const fallbackPosts: Record<string, BlogPost & { comments?: Comment[] }> = {
  'mastering-monorepos-with-npm-workspaces': {
    ownerId: 'fallback',
    title: 'Mastering Monorepos with NPM Workspaces',
    slug: 'mastering-monorepos-with-npm-workspaces',
    excerpt: 'Learn how to structure and coordinate a full-stack typescript project using workspaces and shared type definition trees.',
    contentMarkdown: `## Structural Overview

Modern applications often benefit from unifying the client, api, and shared definitions into a single repository. NPM Workspaces makes managing dependencies clean and fast without complex external tooling.

### Why Workspace Packages?

1. **Shared Types**: Make changes in \`@portfolio-os/types\` and see compile feedback in real-time in both \`frontend\` and \`backend\`.
2. **Simplified Node Modules**: One root \`package-lock.json\` resolves all project trees.

\`\`\`json
{
  "workspaces": [
    "frontend",
    "backend",
    "types"
  ]
}
\`\`\`

Using this structure ensures consistent dependencies across all environments.`,
    coverImageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
    authorId: 'default-author',
    categories: ['Development', 'TypeScript'],
    tags: ['Workspaces', 'Monorepo', 'NPM'],
    status: 'published',
    readingTimeMinutes: 3,
    viewCount: 189,
    likeCount: 42,
    publishedAt: new Date().toISOString(),
  },
  'rise-of-agentic-ai-coding-assistants': {
    ownerId: 'fallback',
    title: 'The Rise of Agentic AI Coding Assistants',
    slug: 'rise-of-agentic-ai-coding-assistants',
    excerpt: 'Exploring autonomous developer paradigms, agent workflows, and the future of pair programming.',
    contentMarkdown: `## Moving Beyond Autocomplete

We are witnessing a shift from static code autocomplete tools towards autonomous, goal-driven agents. Rather than just suggesting the next line of code, agentic systems analyze requirements, formulate plans, write tests, and run validation loops.

### Key Characteristics of Agent Workflows:
- **Planning Mode**: Design, iterate, and verify before modifying production components.
- **Tool Access**: Running build checks, inspecting directories, querying search databases.
- **Closed-Loop Verification**: Re-running tests automatically to check for lint issues.

This paradigm allows developers to focus on higher-level architecture and system design rather than boilerplate implementation details.`,
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    authorId: 'default-author',
    categories: ['AI', 'Future of Work'],
    tags: ['LLM', 'AI Coding', 'Agentic Systems'],
    status: 'published',
    readingTimeMinutes: 4,
    viewCount: 251,
    likeCount: 89,
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
};

interface CommentAuthor {
  _id: string;
  name: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
}

const fallbackCommentsList: Comment[] = [
  {
    _id: 'c1',
    postId: 'mastering-monorepos-with-npm-workspaces',
    body: 'This monorepo breakdown is super helpful! How do you handle environment-specific configurations in workspaces?',
    status: 'visible',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    authorId: { _id: 'guest-user-1', name: 'Jane Doe', avatarUrl: '', role: 'member' } as unknown as string
  },
  {
    _id: 'c2',
    postId: 'mastering-monorepos-with-npm-workspaces',
    body: 'Thanks Jane! I typically keep dotenv files in each workspace folder and load them individually, or use a shared tool config at the root.',
    parentCommentId: 'c1',
    status: 'visible',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    authorId: { _id: 'owner-user', name: 'Pratik', avatarUrl: '', role: 'owner' } as unknown as string
  }
];

export default function BlogPostView({ slug }: BlogPostViewProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [commentBody, setCommentBody] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [xpReward, setXpReward] = useState(false);

  // Retrieve post details
  const { data: serverPost } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const res = await apiFetch<BlogPost>(`/blog/${slug}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    retry: false,
  });

  const post = serverPost || fallbackPosts[slug] || fallbackPosts['mastering-monorepos-with-npm-workspaces'];

  // Retrieve comments
  const { data: serverComments } = useQuery<Comment[]>({
    queryKey: ['comments', post?._id || slug],
    queryFn: async () => {
      if (!post?._id) return [];
      const res = await apiFetch<Comment[]>(`/blog/${post._id}/comments`);
      if (res.error) throw new Error(res.error);
      return res.data || [];
    },
    enabled: !!post?._id,
    retry: false,
  });

  const comments = serverComments && serverComments.length > 0 ? serverComments : (slug === 'mastering-monorepos-with-npm-workspaces' ? fallbackCommentsList : []);

  // Post comment mutation
  const commentMutation = useMutation({
    mutationFn: async (body: { body: string; parentCommentId?: string }) => {
      const res = await apiFetch<Comment>(`/blog/${post._id}/comments`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      setCommentBody('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['comments', post._id] });
      
      // Trigger XP floating reward animation
      setXpReward(true);
      setTimeout(() => setXpReward(false), 3000);
    },
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim() || !post?._id) return;
    commentMutation.mutate({
      body: commentBody,
      parentCommentId: replyingTo?.id || undefined,
    });
  };

  // Build comment threads
  const rootComments = comments.filter((c) => !c.parentCommentId);
  const repliesMap = comments.reduce<Record<string, Comment[]>>((acc, curr) => {
    if (curr.parentCommentId) {
      if (!acc[curr.parentCommentId]) acc[curr.parentCommentId] = [];
      acc[curr.parentCommentId].push(curr);
    }
    return acc;
  }, {});

  const renderComment = (comment: Comment, isReply = false) => {
    const author = (comment.authorId as unknown as CommentAuthor) || { name: 'Anonymous', role: 'member' };
    const dateStr = comment.createdAt
      ? new Date(comment.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return (
      <div
        key={comment._id}
        className={`rounded-lg border border-zinc-900 bg-zinc-950/30 p-4 transition-all duration-200 ${
          isReply ? 'ml-8 mt-3 border-l-2 border-l-teal-500/40' : 'mt-4'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-teal-400 border border-zinc-750">
              {author.name[0]?.toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-100">{author.name}</span>
              {(author.role === 'owner' || author.role === 'admin') && (
                <span className="ml-1.5 inline-flex items-center space-x-0.5 rounded bg-teal-500/10 px-1 py-0.2 text-[8px] font-mono text-teal-400 border border-teal-500/20">
                  <ShieldCheck className="h-2 w-2" />
                  <span>Author</span>
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">{dateStr}</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed pl-8">{comment.body}</p>
        
        {!isReply && user && (
          <div className="mt-3 flex justify-end pl-8">
            <button
              onClick={() => setReplyingTo({ id: comment._id!, name: author.name })}
              className="inline-flex items-center space-x-1 text-[10px] font-mono text-zinc-500 hover:text-teal-400 transition-colors"
            >
              <CornerDownRight className="h-3 w-3" />
              <span>Reply</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-sm">
        Article not found
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Floating XP Reward Badge */}
      {xpReward && (
        <div className="fixed bottom-10 right-10 z-50 flex items-center space-x-2 rounded-xl border border-teal-500 bg-teal-950/80 px-4 py-3 text-teal-300 shadow-lg shadow-teal-500/20 animate-bounce font-mono text-sm">
          <span>+100 XP Earned! (Action: Post Comment)</span>
        </div>
      )}

      <main className="flex-1 bg-zinc-950 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>

          {/* Post Header */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded bg-teal-500/10 px-2.5 py-0.5 text-xs font-mono text-teal-400 border border-teal-500/20"
                >
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-extrabold text-white font-sans sm:text-4xl leading-tight">
              {post.title}
            </h1>
            
            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-500 border-y border-zinc-900 py-4">
              <span className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Draft'}
                </span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readingTimeMinutes} min read</span>
              </span>
              <span className="flex items-center space-x-1.5 ml-auto">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount || 0} views</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Heart className="h-4 w-4" />
                <span>{post.likeCount || 0} likes</span>
              </span>
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImageUrl && (
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-900 mb-10 bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
            </div>
          )}

          {/* Post Content */}
          <article className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-6">
            {post.contentMarkdown.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-xl font-bold text-white pt-4 border-b border-zinc-900 pb-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-lg font-semibold text-white pt-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('```')) {
                const lines = paragraph.split('\n');
                const code = lines.slice(1, lines.length - 1).join('\n');
                return (
                  <pre key={index} className="rounded-lg bg-zinc-900/50 p-4 border border-zinc-800 font-mono text-xs text-teal-300 overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1 text-zinc-400">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </article>

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2 border-t border-zinc-900 pt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-zinc-900 px-2.5 py-0.5 text-xs font-mono text-zinc-400 border border-zinc-800"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <section className="mt-16 border-t border-zinc-900 pt-10">
            <div className="flex items-center space-x-2 mb-6">
              <MessageSquare className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-bold text-white font-sans">Comments ({comments.length})</h2>
            </div>

            {/* Comment Thread Tree */}
            <div className="space-y-4 mb-10">
              {rootComments.length === 0 ? (
                <p className="text-xs font-sans text-zinc-550 italic">No comments yet. Start the conversation!</p>
              ) : (
                rootComments.map((root) => (
                  <div key={root._id}>
                    {renderComment(root, false)}
                    {/* Render Replies */}
                    {repliesMap[root._id!]?.map((reply) => renderComment(reply, true))}
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6">
              <h3 className="text-sm font-bold text-white font-sans mb-4 flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-teal-400" />
                <span>Write Comment</span>
              </h3>

              {user ? (
                <form onSubmit={handlePostComment} className="space-y-4">
                  {replyingTo && (
                    <div className="flex items-center justify-between rounded bg-zinc-900 px-3 py-1.5 text-xs font-mono text-teal-400 border border-zinc-800">
                      <span>Replying to @{replyingTo.name}</span>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <textarea
                    rows={4}
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Provide insights, ask questions or add comments..."
                    className="w-full rounded-lg border border-zinc-850 bg-zinc-950/50 p-3 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-teal-500 transition-colors font-sans"
                    required
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={commentMutation.isPending}
                      className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-teal-400 transition-colors disabled:opacity-50"
                    >
                      {commentMutation.isPending ? 'Sending...' : 'Post Comment (+100 XP)'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-zinc-500 mb-4 font-sans">You must be logged in to write a comment.</p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      href="/login"
                      className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
