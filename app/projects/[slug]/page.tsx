import CaseStudyView from './CaseStudyView';

export default function Page({ params }: { params: { slug: string } }) {
  return <CaseStudyView params={params} />;
}
