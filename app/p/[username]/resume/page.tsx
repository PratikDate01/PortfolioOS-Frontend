import ResumeView from '@/app/resume/ResumeView';
import { Metadata } from 'next';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username} — Resume`,
    description: `Professional credentials and resume of ${params.username}.`,
  };
}

export default function Page({ params }: Props) {
  return <ResumeView username={params.username} />;
}
