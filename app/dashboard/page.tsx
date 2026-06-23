import { Suspense } from 'react';
import DashboardView from './DashboardView';
import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-300">
        <Loader2 className="h-10 w-10 animate-spin text-teal-400 mb-4" />
        <p className="text-sm font-mono tracking-wide">Loading workspace...</p>
      </div>
    }>
      <DashboardView />
    </Suspense>
  );
}
