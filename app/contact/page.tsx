import type { Metadata } from 'next';
import CalendlyBookingLink from '../components/calendly-booking-link';
import ContactForm from '../components/contact-form';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import {
  CALENDLY_BOOKING,
  PUBLIC_CONTACT_PHONE,
  getPublicContactPhone,
} from '../../content/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a free Strategic Diagnosis Call with Matthew Roxas or send a note.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const publicPhone = getPublicContactPhone(PUBLIC_CONTACT_PHONE.e164);

  return (
    <main>
      <SiteHeader returnTo="/contact" />
      <section className="section contact-section contact-page">
        <div className="contact-heading">
          <p className="section-kicker">Start a conversation</p>
          <h1>Bring me the interesting, messy question.</h1>
          <p>I’m especially open to conversations about AI and human judgment, philosophical consulting, technical systems, teaching, or a project that does not fit neatly into one box yet.</p>
          <div className="availability"><span className="availability-dot" aria-hidden="true" />Open to thoughtful conversations</div>
        </div>

        <div className="contact-actions">
          {publicPhone ? (
            <article className="diagnosis-booking business-phone-card" aria-labelledby="business-phone-heading">
              <p className="section-kicker">Business phone</p>
              <h2 id="business-phone-heading">Call or text Matthew directly.</h2>
              <a className="business-phone-number" href={`tel:${publicPhone.e164}`}>
                {publicPhone.display}
              </a>
              <p>Use this line for a consultation question or a casual reconnect. If calling is not convenient, send a text or use the written contact form below.</p>
              <div className="diagnosis-booking-action business-phone-action">
                <div className="business-phone-buttons">
                  <a className="button button-dark" href={`tel:${publicPhone.e164}`}>Call Matthew</a>
                  <a className="button button-outline" href={`sms:${publicPhone.e164}`}>Text Matthew</a>
                </div>
              </div>
              <p className="diagnosis-booking-note">Texting is optional. Message and data rates may apply. See the <a href="/terms">SMS terms</a> and <a href="/privacy">privacy policy</a>.</p>
            </article>
          ) : null}

          <article className="diagnosis-booking" aria-labelledby="diagnosis-booking-heading">
            <p className="section-kicker">Book directly</p>
            <h2 id="diagnosis-booking-heading">Start with a free Strategic Diagnosis Call.</h2>
            <p>Thirty minutes to clarify your goals, name the challenge, and decide whether a deeper roadmap session would actually help. You can book now; no written intake is required.</p>
            <div className="diagnosis-booking-action">
              <div>
                <p className="diagnosis-booking-meta">Free · {CALENDLY_BOOKING.strategicDiagnosisDurationMinutes} minutes · Google Meet</p>
                <p className="diagnosis-booking-note">Calendly opens in a new tab.</p>
              </div>
              <CalendlyBookingLink
                className="button button-dark"
                href={CALENDLY_BOOKING.strategicDiagnosisCallUrl}
              >
                Book the free call <span aria-hidden="true">↗</span>
              </CalendlyBookingLink>
            </div>
          </article>

          <section className="written-contact" id="write" aria-labelledby="written-contact-heading">
            <div className="written-contact-heading">
              <p className="section-kicker">Write instead</p>
              <h2 id="written-contact-heading">Prefer to send context first?</h2>
              <p>Use the form if writing is easier, the call is not the right fit, or you simply want to start asynchronously. Your note goes to Matthew’s private inbox.</p>
            </div>
            <ContactForm />
          </section>
        </div>
      </section>
      <SiteFooter note="Contact · Thoughtful questions welcome" />
    </main>
  );
}
