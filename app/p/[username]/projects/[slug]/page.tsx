import CaseStudyView from '@/app/projects/[slug]/CaseStudyView';
import { Metadata } from 'next';

interface Props {
  params: { username: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ')} — Case Study`,
    description: `Detailed case study for project ${params.slug}.`,
  };
}

export default function Page({ params }: Props) {
  return <CaseStudyView params={{ slug: params.slug }} username={params.username} />;
}
