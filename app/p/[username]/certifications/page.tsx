import CertificationsView from '@/app/certifications/CertificationsView';
import { Metadata } from 'next';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username} — Certifications`,
    description: `Verified certifications and credentials of ${params.username}.`,
  };
}

export default function Page({ params }: Props) {
  return <CertificationsView username={params.username} />;
}
