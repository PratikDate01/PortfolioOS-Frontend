import BlogView from '@/app/blog/BlogView';
import { Metadata } from 'next';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username} — Journal`,
    description: `Technical journal and blog posts by ${params.username}.`,
  };
}

export default function Page({ params }: Props) {
  return <BlogView username={params.username} />;
}
