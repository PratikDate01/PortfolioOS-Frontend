import BlogPostView from '@/app/blog/[slug]/BlogPostView';
import { Metadata } from 'next';

interface Props {
  params: { username: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ')} — Article`,
    description: `Read technical blog post ${params.slug}.`,
  };
}

export default function Page({ params }: Props) {
  return <BlogPostView slug={params.slug} username={params.username} />;
}
