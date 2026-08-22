import type { Metadata } from 'next';
import ContactForm from '../components/contact-form';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a conversation with Matthew Roxas.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main>
      <SiteHeader returnTo="/contact" />
      <section className="section contact-section contact-page"><div className="contact-heading"><p className="section-kicker">Contact</p><h1>Bring me the interesting, messy question.</h1><p>I’m especially open to conversations about AI and human judgment, philosophical consulting, technical systems, teaching, or a project that does not fit neatly into one box yet.</p><div className="availability"><span className="availability-dot" aria-hidden="true" />Open to thoughtful conversations</div></div><ContactForm /></section>
      <SiteFooter note="Contact · Thoughtful questions welcome" />
    </main>
  );
}
