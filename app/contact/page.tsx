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
  description: 'Talk through an AI question with Matthew Roxas, call or text, or send a note.',
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
          <p>Talk through how AI fits into your work, organization, or life. If a call is not the right fit, you can still call, text, or send a note.</p>
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
              <p className="section-kicker">Talk Through an AI Question</p>
              <h2 id="booking-paths-heading">One conversation, open to the question in front of you.</h2>
            </div>

            <div className="booking-path-grid">
              <article className="diagnosis-booking booking-path-card" aria-labelledby="talk-through-ai-question-heading">
                <p className="section-kicker">For anyone thinking seriously about AI</p>
                <h2 id="talk-through-ai-question-heading">Talk Through an AI Question</h2>
                <p>Bring a problem, idea, workflow, or question you&apos;re wrestling with. We&apos;ll explore what&apos;s technically possible, what makes sense in practice, and the human considerations that are easy to overlook.</p>
                <p>I&apos;m currently using these conversations to develop and refine my approach to AI advising.</p>
                <div className="diagnosis-booking-action">
                  <div>
                    <p className="diagnosis-booking-meta">{CALENDLY_BOOKING.talkThroughAnAiQuestionDurationMinutes} minutes · Free</p>
                    <p className="diagnosis-booking-note">Calendly opens in a new tab.</p>
                  </div>
                  <CalendlyBookingLink
                    className="button button-dark"
                    href={CALENDLY_BOOKING.talkThroughAnAiQuestionUrl}
                  >
                    Book the conversation <span aria-hidden="true">↗</span>
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
