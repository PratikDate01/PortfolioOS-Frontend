'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export default function Page({ params }: Props) {
  const router = useRouter();
  const { slug } = params;
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user?.username) {
        router.replace(`/p/${user.username}/blog/${slug}`);
      } else {
        router.replace(`/p/pratik-satish-date/blog/${slug}`);
      }
    }
  }, [user, isLoading, router, slug]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-350">
      <Loader2 className="h-8 w-8 animate-spin text-teal-400 mb-4" />
      <p className="text-xs font-mono tracking-wide">Redirecting to article...</p>
    </div>
  );
}
