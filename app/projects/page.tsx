'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user?.username) {
        router.replace(`/p/${user.username}/projects`);
      } else {
        router.replace('/p/pratik-satish-date/projects');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-350">
      <Loader2 className="h-8 w-8 animate-spin text-teal-400 mb-4" />
      <p className="text-xs font-mono tracking-wide">Redirecting to project showcase...</p>
    </div>
  );
}
