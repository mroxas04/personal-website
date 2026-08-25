import type { Metadata } from 'next';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SMS terms and conditions',
  description: 'Terms for SMS messages from Matthew Roxas, including frequency, rates, STOP, HELP, and privacy.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main>
      <SiteHeader returnTo="/terms" />
      <section className="page-hero legal-hero">
        <p className="eyebrow"><span>Terms</span><span>Matthew Roxas SMS</span></p>
        <h1>SMS terms and conditions.</h1>
        <p>These focused terms cover text messages from Matthew Roxas, a solo proprietor. They do not require you to opt in or replace the terms of a separately purchased service.</p>
      </section>

      <section className="section legal-content">
        <aside className="legal-aside" aria-label="Terms details">
          <span className="content-meta">Last updated</span>
          <p>August 25, 2026</p>
          <p>Program name: Matthew Roxas SMS</p>
        </aside>

        <div className="legal-copy">
          <section>
            <h2>Program description</h2>
            <p>If you affirmatively opt in, Matthew Roxas may send you conversational, scheduling, service, or project-related text messages connected to a request or relationship you initiated. Messages may be sent using an automated system, but opting in is not a condition of submitting a contact request or purchasing a service.</p>
          </section>

          <section>
            <h2>Frequency and charges</h2>
            <p><strong>Message frequency varies.</strong> The number of messages depends on your request and the conversation. <strong>Message and data rates may apply.</strong> Contact your wireless carrier with questions about your text or data plan.</p>
          </section>

          <section>
            <h2>STOP and HELP</h2>
            <p><strong>Reply STOP to unsubscribe at any time.</strong> You may receive one final message confirming that your opt-out was processed. After that, no further messages will be sent unless you separately opt in again.</p>
            <p><strong>Reply HELP for help.</strong> You can also contact Matthew at <a href="mailto:matthewgroxas@gmail.com">matthewgroxas@gmail.com</a>.</p>
          </section>

          <section>
            <h2>Delivery</h2>
            <p>Wireless carriers are not liable for delayed or undelivered messages. Delivery is subject to the availability of your carrier’s network and is not guaranteed.</p>
          </section>

          <section>
            <h2>Privacy</h2>
            <p>Your mobile phone number and SMS opt-in data are handled under the <a href="/privacy">privacy policy</a>. They are not sold, rented, or shared with third parties or affiliates for their marketing or promotional purposes.</p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>Matthew may update these terms as the messaging program changes. The current version and its effective date will remain available on this page.</p>
          </section>
        </div>
      </section>
      <SiteFooter note="SMS terms · Matthew Roxas" />
    </main>
  );
}
