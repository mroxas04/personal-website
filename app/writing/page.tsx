import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '../../content/site';
import { WRITING, WRITING_CATEGORIES } from '../../content/writing';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Publications, articles, essays, and notes by Matthew Roxas on AI, embodied cognition, systems, and human judgment.',
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
      <header className="site-header">
        <Link className="wordmark" href="/#top" aria-label="Matthew Roxas, home">
          MR<span className="wordmark-dot" aria-hidden="true" />
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          <Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/#elsewhere">Elsewhere</Link><Link href="/dashboard">Dashboard</Link>
        </nav>
        <Link className="contact-link" href="/#contact">Start a conversation ↗</Link>
      </header>

      <section className="page-hero writing-page-hero">
        <p className="eyebrow"><span>Writing archive</span><span>Publications → notes</span></p>
        <h1>Thinking should leave a trail.</h1>
        <p>A growing index of formal publications, outside articles, longer essays, and compact notes—organized by what each piece is, not just where it appeared.</p>
      </section>

      <div className="writing-index">
        {WRITING_CATEGORIES.map((category, categoryIndex) => {
          const entries = WRITING.filter((entry) => entry.category === category);
          return (
            <section className="writing-category" key={category} aria-labelledby={`category-${category}`}>
              <div className="writing-category-heading">
                <span>0{categoryIndex + 1}</span>
                <h2 id={`category-${category}`}>{category}s</h2>
                <p>{entries.length} {entries.length === 1 ? 'piece' : 'pieces'}</p>
              </div>
              <div className="writing-list">
                {entries.map((entry) => {
                  const body = <><div className="writing-entry-meta"><span>{entry.status}</span><span>{entry.year}</span></div><div><p className="content-meta">{entry.outlet}</p><h3>{entry.title}</h3><p>{entry.description}</p></div><span className="writing-entry-action" aria-hidden="true">{entry.href ? '↗' : '—'}</span></>;
                  return entry.href ? <a className="writing-entry" href={entry.href} target="_blank" rel="noreferrer" key={entry.title}>{body}</a> : <article className="writing-entry" key={entry.title}>{body}</article>;
                })}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="site-footer compact-footer">
        <Link className="footer-mark" href="/">Matthew Roxas<span>.</span></Link>
        <p>Writing index · Maintained in content/writing.ts</p>
        <Link href="/#top">Home ↑</Link>
      </footer>
    </main>
  );
}
