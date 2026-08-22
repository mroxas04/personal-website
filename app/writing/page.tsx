import type { Metadata } from 'next';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import WritingList from '../components/writing-list';
import { SITE_URL } from '../../content/site';
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
      <section className="page-hero writing-page-hero">
        <p className="eyebrow"><span>Writing</span><span>Papers → Blog</span></p>
        <h1>Thinking should leave a trail.</h1>
        <p>Research, outside articles, and shorter pieces organized by form.</p>
      </section>
      <WritingList categories={WRITING_CATEGORIES} />
      <SiteFooter note="Writing · Papers, articles & blog" />
    </main>
  );
}
