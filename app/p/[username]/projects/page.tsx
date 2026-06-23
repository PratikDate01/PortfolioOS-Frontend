import ProjectsView from '@/app/projects/ProjectsView';
import { Metadata } from 'next';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username} — Projects`,
    description: `Explore projects built by ${params.username}.`,
  };
}

export default function Page({ params }: Props) {
  return <ProjectsView username={params.username} />;
}
