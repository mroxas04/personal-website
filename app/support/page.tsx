import type { Metadata } from 'next';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';
import { SUPPORT_PAYMENT } from '../../content/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Support the work',
  description: 'Optional ways to support Matthew Roxas’s conversations, research, and independent work.',
  alternates: { canonical: '/support' },
};

export default function SupportPage() {
  const paymentsReady = Boolean(
    SUPPORT_PAYMENT.venmoBusinessUrl ||
    (SUPPORT_PAYMENT.zelleQrImage && SUPPORT_PAYMENT.zelleDisplayName),
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

      <section className="section payment-section" aria-labelledby="payment-heading">
        <div className="payment-heading">
          <p className="section-kicker">Optional financial support</p>
          <h2 id="payment-heading">Choose the amount yourself.</h2>
          <p>Payment details are verified before they appear here. For now, Matthew can also share them directly after a conversation.</p>
        </div>
        <div className="payment-grid">
          <article className="payment-card">
            <span>Venmo</span>
            <h3>Business profile</h3>
            {SUPPORT_PAYMENT.venmoBusinessUrl ? <a className="button button-dark" href={SUPPORT_PAYMENT.venmoBusinessUrl} target="_blank" rel="noreferrer">Open Venmo <span aria-hidden="true">↗</span></a> : <p>Not publicly activated yet.</p>}
          </article>
          <article className="payment-card">
            <span>Zelle</span>
            <h3>{SUPPORT_PAYMENT.zelleDisplayName ?? 'Verified recipient'}</h3>
            {SUPPORT_PAYMENT.zelleQrImage ? <>
              {/* Native img keeps a user-supplied QR asset provider-agnostic. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SUPPORT_PAYMENT.zelleQrImage} alt={`Zelle QR code for ${SUPPORT_PAYMENT.zelleDisplayName}`} />
              <p>Confirm the recipient name in your banking app before sending.</p>
            </> : <p>Not publicly activated yet.</p>}
          </article>
        </div>
        {!paymentsReady ? <p className="payment-pending-note">Financial links are intentionally hidden until business-ready account details are supplied.</p> : null}
        <p className="support-legal-note">Support is optional payment connected to Matthew’s time and work, not a tax-deductible charitable donation. Payment records are tracked privately for accounting and follow-up.</p>
      </section>
      <SiteFooter note="Support · Pay what you can, pass it on" />
    </main>
  );
}
