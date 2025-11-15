import { notFound } from 'next/navigation';
import { guideToc, getGuideSectionFull } from '@/lib/guide-domain';
import { GuideSectionSidebar } from '@/components/guide/guide-section-sidebar';
import { GuideSectionContent } from '@/components/guide/guide-section-content';
import { GuideRightPanel } from '@/components/guide/guide-right-panel';

interface Props {
  params: Promise<{ code: string }>;
}

export function generateStaticParams() {
  return guideToc.map((entry) => ({ code: entry.code }));
}

export default async function GuideSectionPage({ params }: Props) {
  const { code } = await params;
  const section = getGuideSectionFull(code);
  if (!section) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl gap-6 px-6 py-8 lg:grid lg:grid-cols-[280px_1fr_320px]">
      <GuideSectionSidebar activeCode={section.toc.code} />
      <GuideSectionContent section={section} />
      <GuideRightPanel section={section} />
    </div>
  );
}
