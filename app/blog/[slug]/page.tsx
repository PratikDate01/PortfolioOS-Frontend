import BlogPostView from './BlogPostView';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <BlogPostView slug={params.slug} />;
}
