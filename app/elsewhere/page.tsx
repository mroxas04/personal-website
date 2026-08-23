import type { Metadata } from 'next';
import PageHero from '../components/page-hero';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import { MEDIA, SOCIAL_LINKS } from '../../content/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Elsewhere',
  description: 'Find Matthew Roxas across professional, technical, and social platforms.',
  alternates: { canonical: '/elsewhere' },
};

export default function ElsewherePage() {
  return (
    <main>
      <SiteHeader returnTo="/elsewhere" />
      <PageHero
        eyebrow={['Elsewhere', 'The other tabs I keep open']}
        title="Find me around the internet."
        description="Professional updates, code, daily life, language streaks, and a few increasingly specific corners of the web."
        media={MEDIA.elsewhereHero}
        mediaVariable="MEDIA.elsewhereHero"
      />
      <section className="section elsewhere-section standalone-section"><div className="social-board">{SOCIAL_LINKS.map(([name, handle, href], index) => <a className="social-link" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'} key={name}><span className="social-index">0{index + 1}</span><span className="social-name">{name}</span><span className="social-handle">{handle}</span><span aria-hidden="true">↗</span></a>)}</div></section>
      <SiteFooter note="Elsewhere · Links and profiles" />
    </main>
  );
}
