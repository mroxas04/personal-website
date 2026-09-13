import type { Metadata } from 'next';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import { SUPPORT_PAYMENT } from '../../content/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Support the work',
  description: 'Support Matthew Roxas’s conversations, research, and independent work, or start a conversation about organizational AI.',
  alternates: { canonical: '/support' },
};

export default function SupportPage() {
  const paymentsReady = Boolean(
    SUPPORT_PAYMENT.venmoProfileUrl ||
    SUPPORT_PAYMENT.zelleEmail ||
    SUPPORT_PAYMENT.zelleQrImage,
  );

  return (
    <main>
      <SiteHeader returnTo="/support" />
      <section className="support-hero">
        <p className="eyebrow"><span>Support</span><span>No fixed price</span></p>
        <h1>Support what was useful.</h1>
        <p>I want early conversations to remain available based on need, not a rigid fee. If our time together helped, support can be financial, relational, or simply honest.</p>
      </section>

      <section className="section support-options" aria-labelledby="support-options-heading">
        <div className="section-intro">
          <p className="section-kicker">Three useful forms</p>
          <h2 id="support-options-heading">Pay it forward in the way that fits.</h2>
          <p>There is no expected amount and no obligation to contribute. A thoughtful referral or candid feedback can matter as much as money.</p>
        </div>
        <div className="support-option-grid">
          <article><span>01</span><h3>Pay what you can</h3><p>Optional financial support helps create room for research, preparation, and future conversations.</p></article>
          <article><span>02</span><h3>Pass it on</h3><p>Tell one person who might benefit, make an introduction, or share the work in your own words.</p></article>
          <article><span>03</span><h3>Leave evidence</h3><p>Share honest feedback about what changed. With your permission, a reviewed excerpt may later help others understand the value.</p><a className="text-link" href="/feedback">Share feedback <span aria-hidden="true">↗</span></a></article>
        </div>
      </section>

      <section className="section booking-section" id="implementation-roadmap" aria-labelledby="booking-heading">
        <div className="booking-copy">
          <p className="section-kicker">For organizations</p>
          <h2 id="booking-heading">Business AI work starts with context.</h2>
          <p>If your team has a concrete AI opportunity, share the situation first. I&apos;ll help determine whether a roadmap, a smaller experiment, or another next step fits the problem.</p>
        </div>
        <div className="booking-details">
          <p>When a decision-ready roadmap is the right next step, we&apos;ll agree on the scope, timing, deliverable, and price before any paid work begins.</p>
          <a className="button button-outline" href="/contact#write">Share the situation <span aria-hidden="true">↗</span></a>
          <p className="booking-note">The Implementation Roadmap remains available by fit, not as a self-serve booking.</p>
        </div>
      </section>

      <section className="section payment-section" aria-labelledby="payment-heading">
        <div className="payment-heading">
          <p className="section-kicker">Optional financial support</p>
          <h2 id="payment-heading">Choose the amount yourself.</h2>
          <p>Use whichever method fits. There is no expected amount, and financial support is never required to continue the conversation.</p>
        </div>
        <div className="payment-grid">
          <article className="payment-card">
            <span>Venmo</span>
            <h3>Personal profile</h3>
            {SUPPORT_PAYMENT.venmoProfileUrl ? <>
              <p className="payment-identifier">{SUPPORT_PAYMENT.venmoHandle}</p>
              <a className="button button-dark" href={SUPPORT_PAYMENT.venmoProfileUrl} target="_blank" rel="noreferrer">Open Venmo <span aria-hidden="true">↗</span></a>
              <p className="payment-safety-note">If your payment is connected to a session or service, mark it as a purchase in Venmo when that option is available.</p>
            </> : <p>Not publicly activated yet.</p>}
          </article>
          <article className="payment-card">
            <span>Zelle</span>
            <h3>{SUPPORT_PAYMENT.zelleDisplayName ?? 'Send by email address'}</h3>
            {SUPPORT_PAYMENT.zelleEmail ? <p className="payment-identifier">{SUPPORT_PAYMENT.zelleEmail}</p> : null}
            {SUPPORT_PAYMENT.zelleQrImage ? <>
              {/* Native img keeps a user-supplied QR asset provider-agnostic. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SUPPORT_PAYMENT.zelleQrImage} alt={`Zelle QR code for ${SUPPORT_PAYMENT.zelleDisplayName ?? 'Matthew Roxas'}`} />
            </> : null}
            {SUPPORT_PAYMENT.zelleEmail || SUPPORT_PAYMENT.zelleQrImage ? <p className="payment-safety-note">Enter the email address in your banking app, then confirm the displayed recipient before sending. Zelle payments generally cannot be reversed.</p> : <p>Not publicly activated yet.</p>}
          </article>
        </div>
        {!paymentsReady ? <p className="payment-pending-note">Financial details are not publicly activated yet.</p> : null}
        <p className="support-legal-note">Support is optional payment connected to Matthew’s time and work, not a tax-deductible charitable donation. Payment records are tracked privately for accounting and follow-up.</p>
      </section>
      <SiteFooter note="Support · Pay what you can, pass it on" />
    </main>
  );
}
