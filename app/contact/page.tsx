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
  description: 'Choose business AI consulting or one-to-one AI coaching with Matthew Roxas, or send a note.',
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
          <p>Choose the path that matches the question: business AI consulting for an organization, or one-to-one coaching for how AI fits into your own work and life.</p>
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
              <p>Use this line for a business question, coaching conversation, or casual reconnect. If calling is not convenient, send a text or use the written contact form below.</p>
              <div className="diagnosis-booking-action business-phone-action">
                <div className="business-phone-buttons">
                  <a className="button button-dark" href={`tel:${publicPhone.e164}`}>Call Matthew</a>
                  <a className="button button-outline" href={`sms:${publicPhone.e164}`}>Text Matthew</a>
                </div>
              </div>
              <p className="diagnosis-booking-note">Texting is optional. Message and data rates may apply. See the <a href="/terms">SMS terms</a> and <a href="/privacy">privacy policy</a>.</p>
            </article>
          ) : null}

          <section className="booking-paths" aria-labelledby="booking-paths-heading">
            <div className="booking-paths-heading">
              <p className="section-kicker">Choose a path</p>
              <h2 id="booking-paths-heading">Two kinds of AI conversation.</h2>
            </div>

            <div className="booking-path-grid">
              <article className="diagnosis-booking booking-path-card" aria-labelledby="business-strategy-heading">
                <p className="section-kicker">For organizations</p>
                <h2 id="business-strategy-heading">Business AI Strategy Call</h2>
                <p>For teams deciding where AI belongs in their systems, operations, and implementation work. We’ll clarify the business problem, pressure-test the opportunity, and name a useful next step.</p>
                <p className="business-path-followup">If the work needs a detailed plan, the paid <a href="/support#implementation-roadmap">Implementation Roadmap Deep Dive</a> is available as a separate business-only follow-up.</p>
                <div className="diagnosis-booking-action">
                  <div>
                    <p className="diagnosis-booking-meta">Free · {CALENDLY_BOOKING.businessAiStrategyDurationMinutes} minutes · Google Meet</p>
                    <p className="diagnosis-booking-note">Calendly opens in a new tab.</p>
                  </div>
                  <CalendlyBookingLink
                    className="button button-dark"
                    href={CALENDLY_BOOKING.businessAiStrategyCallUrl}
                  >
                    Book business strategy <span aria-hidden="true">↗</span>
                  </CalendlyBookingLink>
                </div>
              </article>

              <article className="diagnosis-booking booking-path-card coaching-booking" id="ai-coaching" aria-labelledby="ai-coaching-heading">
                <p className="section-kicker">For you</p>
                <h2 id="ai-coaching-heading">AI Coaching Conversation</h2>
                <p>A relaxed one-to-one conversation about using AI with more confidence and intention. Bring a question from your work, learning, creative practice, decisions, or everyday life.</p>
                <div className="diagnosis-booking-action">
                  <div>
                    <p className="diagnosis-booking-meta">One-to-one · Personal · Google Meet</p>
                    <p className="diagnosis-booking-note">Calendly opens in a new tab.</p>
                  </div>
                  <CalendlyBookingLink
                    className="button button-dark"
                    href={CALENDLY_BOOKING.aiCoachingConversationUrl}
                  >
                    Book AI coaching <span aria-hidden="true">↗</span>
                  </CalendlyBookingLink>
                </div>
              </article>
            </div>
          </section>

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
