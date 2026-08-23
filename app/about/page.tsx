import type { Metadata } from 'next';
import MediaSlot from '../components/media-slot';
import PageHero from '../components/page-hero';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import { MEDIA } from '../../content/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Matthew Roxas on engineering, operations, philosophy of AI, and the path connecting them.',
  alternates: { canonical: '/about' },
};

const timeline = [
  { period: '2022–26', title: 'Purdue University', detail: 'B.S. Computer Engineering · Philosophy minor · AI/ML concentration' },
  { period: '2023–26', title: 'Teaching & building', detail: 'Data science labs, Fourier analysis, trustworthy AI, and community data systems' },
  { period: 'Now', title: 'Valve+Meter + Orr Fellowship', detail: 'Marketing operations, reporting, automation, and the systems between them' },
  { period: 'Next', title: 'A longer inquiry', detail: 'Graduate work joining philosophy, computer science, and the question of AI' },
];

export default function AboutPage() {
  return (
    <main>
      <SiteHeader returnTo="/about" />
      <PageHero
        eyebrow={['About', 'One path, several disciplines']}
        title="A technical life with philosophical stakes."
        description="I’m most at home when a problem refuses to stay in one discipline."
        media={MEDIA.aboutHero}
        mediaVariable="MEDIA.aboutHero"
      />
      <section className="section about-section standalone-section">
        <div className="about-grid">
          <div className="about-statement"><div className="about-columns"><p>My technical background is in computer engineering, AI, data, and software. My day-to-day work now lives in marketing operations, where I connect reporting, automation, process, and people so decisions have somewhere solid to land.</p><p>Philosophy gives that work a horizon. Through Merleau-Ponty and embodied cognition, I’m interested in what intelligence loses when we treat meaning as disembodied information processing. The long game is scholarship and teaching at that intersection.</p></div><div className="principle-card"><span className="principle-mark">*</span><p>Build systems that support judgment without quietly replacing the person whose judgment matters.</p></div></div>
          <ol className="timeline" aria-label="Matthew's path">{timeline.map((item) => <li key={item.period}><span className="timeline-period">{item.period}</span><div><h2>{item.title}</h2><p>{item.detail}</p></div></li>)}</ol>
        </div>
      </section>
      <section className="section media-section">
        <div className="section-intro"><p className="section-kicker">Field notes</p><h2>A life beyond the résumé.</h2><p>Images from the places, people, and ordinary moments that sit outside the project list.</p></div>
        <div className="media-grid"><MediaSlot slot={MEDIA.studioMoment} variableName="MEDIA.studioMoment" className="media-wide" /><MediaSlot slot={MEDIA.livedMoment} variableName="MEDIA.livedMoment" /><MediaSlot slot={MEDIA.fieldNote} variableName="MEDIA.fieldNote" /><MediaSlot slot={MEDIA.motionStudy} variableName="MEDIA.motionStudy" className="media-wide" /></div>
      </section>
      <SiteFooter note="About · Engineering, operations & philosophy" />
    </main>
  );
}
