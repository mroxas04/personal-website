import type { Metadata } from 'next';
import FeedbackForm from '../components/feedback-form';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Share feedback',
  description: 'Privately share feedback after a conversation with Matthew Roxas.',
  alternates: { canonical: '/feedback' },
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return (
    <main>
      <SiteHeader returnTo="/feedback" />
      <section className="section contact-section feedback-page">
        <div className="contact-heading">
          <p className="section-kicker">After the conversation</p>
          <h1>Tell me what actually helped.</h1>
          <p>Specific, honest feedback makes the work better. Praise is welcome, but clarity is more useful.</p>
          <div className="availability"><span className="availability-dot" aria-hidden="true" />Private by default</div>
        </div>
        <FeedbackForm />
      </section>
      <SiteFooter note="Feedback · Honest evidence, used with consent" />
    </main>
  );
}
