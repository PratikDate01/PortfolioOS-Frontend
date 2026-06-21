import { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';
import { API_BASE_URL } from '@/lib/config';

async function getPortfolioData(username: string) {
  try {
    const [
      portfolioRes,
      projectsRes,
      experiencesRes,
      skillsRes,
      certsRes,
      resumesRes,
      blogPostsRes,
      testimonialsRes
    ] = await Promise.all([
      fetch(`${API_BASE_URL}/portfolios/${username}`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/projects?username=${username}`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/experience?username=${username}`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/skills?username=${username}`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/certifications?username=${username}`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/resume?username=${username}`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/blog?username=${username}`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/testimonials?username=${username}`, { cache: 'no-store' })
    ]);

    if (!portfolioRes.ok) {
      return null;
    }

    const [
      portfolio,
      projects,
      experiences,
      skills,
      certifications,
      resumes,
      blogPosts,
      testimonials
    ] = await Promise.all([
      portfolioRes.json().then(r => r.data),
      projectsRes.json().then(r => r.data || []),
      experiencesRes.json().then(r => r.data || []),
      skillsRes.json().then(r => r.data || []),
      certsRes.json().then(r => r.data || []),
      resumesRes.json().then(r => r.data || []),
      blogPostsRes.json().then(r => r.data || []),
      testimonialsRes.json().then(r => r.data || [])
    ]);

    return {
      portfolio,
      projects,
      experiences,
      skills,
      certifications,
      resumes,
      blogPosts,
      testimonials
    };
  } catch (error) {
    console.error('Error fetching portfolio data on server:', error);
    return null;
  }
}

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username;
  const data = await getPortfolioData(username);

  if (!data || !data.portfolio) {
    return {
      title: `${username} — Public Portfolio`,
      description: `Public portfolio website for ${username}.`,
    };
  }

  const { portfolio } = data;
  const ownerName = (portfolio.ownerId as any)?.name || username;
  const headline = portfolio.headline || 'Software Engineer & Designer';
  const bio = portfolio.bio || (portfolio.ownerId as any)?.bio || 'Building future-focused applications.';
  const avatarUrl = portfolio.profileImage?.secureUrl || (portfolio.ownerId as any)?.avatarUrl || '';

  const title = `${ownerName} — ${headline}`;
  const description = bio;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      username,
      images: avatarUrl ? [{ url: avatarUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: avatarUrl ? [avatarUrl] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const username = params.username;
  const data = await getPortfolioData(username);

  const jsonLd = data ? {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'dateCreated': data.portfolio?.createdAt || new Date().toISOString(),
    'mainEntity': {
      '@type': 'Person',
      'name': (data.portfolio?.ownerId as any)?.name || username,
      'jobTitle': data.portfolio?.headline || 'Software Engineer',
      'description': data.portfolio?.bio || '',
      'image': data.portfolio?.profileImage?.secureUrl || (data.portfolio?.ownerId as any)?.avatarUrl || '',
      'sameAs': [
        data.portfolio?.socialLinks?.github,
        data.portfolio?.socialLinks?.linkedin,
        data.portfolio?.socialLinks?.twitter,
        data.portfolio?.socialLinks?.website
      ].filter(Boolean)
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PortfolioClient
        username={username}
        initialPortfolio={data?.portfolio || null}
        initialProjects={data?.projects || []}
        initialExperiences={data?.experiences || []}
        initialSkills={data?.skills || []}
        initialCertifications={data?.certifications || []}
        initialResumes={data?.resumes || []}
        initialBlogPosts={data?.blogPosts || []}
        initialTestimonials={data?.testimonials || []}
      />
    </>
  );
}

