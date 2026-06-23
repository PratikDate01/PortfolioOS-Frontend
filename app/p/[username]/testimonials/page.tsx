import TestimonialsView from '@/app/testimonials/TestimonialsView';
import { Metadata } from 'next';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username} — Testimonials`,
    description: `Recommendations and client testimonials for ${params.username}.`,
  };
}

export default function Page({ params }: Props) {
  return <TestimonialsView username={params.username} />;
}
