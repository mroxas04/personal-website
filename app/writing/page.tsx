import type { Metadata } from 'next';
import PageHero from '../components/page-hero';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import WritingList from '../components/writing-list';
import { MEDIA, SITE_URL } from '../../content/site';
import { WRITING, WRITING_CATEGORIES } from '../../content/writing';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Papers, articles, and blog writing by Matthew Roxas.',
  alternates: { canonical: '/writing' },
};

export default function WritingPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Writing by Matthew Roxas',
    url: `${SITE_URL}/writing`,
    description: metadata.description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: WRITING.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.title,
        ...(entry.href ? { url: entry.href } : {}),
      })),
    },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteHeader returnTo="/writing" />
      <PageHero
        eyebrow={['Writing', 'Papers → Blog']}
        title="Thinking should leave a trail."
        description="Research, outside articles, and shorter pieces organized by form."
        media={MEDIA.writingHero}
        mediaVariable="MEDIA.writingHero"
        className="writing-page-hero"
      />
      <WritingList categories={WRITING_CATEGORIES} />
      <SiteFooter note="Writing · Papers, articles & blog" />
    </main>
  );
}
