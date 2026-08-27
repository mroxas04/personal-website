import MediaSlot from './components/media-slot';
import HomeContactPrompt from './components/home-contact-prompt';
import SiteFooter from './components/site-footer';
import SiteHeader from './components/site-header';
import { getChatGPTUser } from './chatgpt-auth';
import {
  CALENDLY_BOOKING,
  CONVERSATION_INTERESTS,
  MEDIA,
  PUBLIC_CONTACT_PHONE,
  SITE_URL,
  SOCIAL_LINKS,
  getPublicContactPhone,
} from '../content/site';

export const dynamic = 'force-dynamic';

const intersections = [
  { index: '01', label: 'Technical', detail: 'AI, data & software', description: 'Understanding how the system actually works.' },
  { index: '02', label: 'Operational', detail: 'People, process & decisions', description: 'Turning scattered inputs into useful movement.' },
  { index: '03', label: 'Philosophical', detail: 'Meaning, embodiment & agency', description: 'Asking what the system means for a life lived inside it.' },
];

const pageLinks = [
  { index: '01', title: 'Writing', href: '/writing', detail: 'Papers, articles, and blog notes.' },
  { index: '02', title: 'Work', href: '/work', detail: 'Projects where ideas met code, classrooms, and operating constraints.' },
  { index: '03', title: 'About', href: '/about', detail: 'The path connecting engineering, operations, and philosophy.' },
  { index: '04', title: 'Elsewhere', href: '/elsewhere', detail: 'Code, social profiles, and the other places I show up.' },
];

function formatInterests(interests: readonly string[]) {
  return new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(interests);
}

export default async function Home() {
  const user = await getChatGPTUser();
  const visitorName = user?.displayName ?? null;
  const publicPhone = getPublicContactPhone(PUBLIC_CONTACT_PHONE.e164);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Matthew Roxas',
        description: 'Systems, AI, philosophy, and the work between them.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: 'Matthew Roxas — Systems, AI & Philosophy',
        mainEntity: {
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: 'Matthew Roxas',
          url: SITE_URL,
          homeLocation: { '@type': 'City', name: 'Indianapolis' },
          jobTitle: 'Marketing Operations Specialist',
          alumniOf: { '@type': 'CollegeOrUniversity', name: 'Purdue University' },
          knowsAbout: ['Artificial intelligence', 'Computer engineering', 'Embodied cognition', 'Marketing operations', 'Philosophy of technology'],
          sameAs: SOCIAL_LINKS.filter(([name]) => name !== 'Email').map(([, , href]) => href),
        },
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {publicPhone ? (
        <HomeContactPrompt
          businessBookingUrl={CALENDLY_BOOKING.businessAiStrategyCallUrl}
          coachingBookingUrl={CALENDLY_BOOKING.aiCoachingConversationUrl}
          phone={publicPhone}
        />
      ) : null}
      <SiteHeader returnTo="/" />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>{user ? `Signed in · ${visitorName}` : 'Welcome'}</span><span>Indianapolis, IN</span></p>
          <p className="hero-manifesto">Building at the edge of <em>systems</em> and lived experience.</p>
          <h1>{visitorName ? <>Hi, <em>{visitorName}</em>. I’m Matthew Roxas.</> : <>Hi, I’m <em>Matthew Roxas</em>.</>}</h1>
          <div className="hero-intro">
            <div className="hero-bio">
              <p>I’m a computer engineer, operator, and philosopher of AI. I turn messy information into useful systems, then ask what those systems mean for the people living inside them.</p>
              <a className="text-link" href="/about">A little more about me <span aria-hidden="true">→</span></a>
            </div>
            <aside className="conversation-context" aria-label="Possible conversation topics">
              <span className="content-meta">A few places we might overlap</span>
              <p>{user ? <>ChatGPT keeps your files and interest profile private from this site. Based on the work I share here, we could talk about {formatInterests(CONVERSATION_INTERESTS)}. Looking forward to starting a conversation with you, {visitorName}!</> : <>We could talk about {formatInterests(CONVERSATION_INTERESTS)}. Sign in if you’d like a personal hello. Your ChatGPT files and interest profile stay private.</>}</p>
            </aside>
          </div>
        </div>
        <aside className="portrait-card" aria-label="Profile summary">
          <div className="portrait-frame">
            <MediaSlot slot={MEDIA.heroPortrait} variableName="MEDIA.heroPortrait" className="portrait-media" priority />
            <span className="portrait-status">Currently curious</span>
          </div>
          <div className="portrait-caption"><span>Marketing Operations Specialist</span><span>Orr Fellow · ’26</span></div>
        </aside>
      </section>

      <section className="intersection-strip" aria-label="Areas of practice">
        <div className="section-marker"><span>My practice</span><span>Three lenses, one perspective</span></div>
        <div className="intersection-grid">
          {intersections.map((item) => (
            <article className="intersection" key={item.index}>
              <span className="intersection-index">{item.index}</span>
              <div><h2>{item.label}</h2><p>{item.detail}</p><p className="intersection-description">{item.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section route-section" aria-labelledby="explore-heading">
        <div className="section-intro"><p className="section-kicker">Explore</p><h2 id="explore-heading">Choose a direction.</h2><p>Start with the kind of work or thinking you want to see.</p></div>
        <div className="route-grid">
          {pageLinks.map((item) => (
            <a className="route-card" href={item.href} key={item.href}>
              <span className="route-index">{item.index}</span><h3>{item.title}</h3><p>{item.detail}</p><span aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
