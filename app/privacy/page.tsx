import type { Metadata } from 'next';
import SiteFooter from '../components/site-footer';
import SiteHeader from '../components/site-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Matthew Roxas collects, uses, and protects information submitted through this website and SMS communications.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <SiteHeader returnTo="/privacy" />
      <section className="page-hero legal-hero">
        <p className="eyebrow"><span>Privacy</span><span>Plain-language policy</span></p>
        <h1>Privacy, without the fog.</h1>
        <p>This policy explains how Matthew Roxas, operating as a solo proprietor, handles information connected to this website and direct communications.</p>
      </section>

      <section className="section legal-content">
        <aside className="legal-aside" aria-label="Policy details">
          <span className="content-meta">Last updated</span>
          <p>August 25, 2026</p>
          <p>This policy covers this website, its forms, and Matthew Roxas SMS communications.</p>
        </aside>

        <div className="legal-copy">
          <section>
            <h2>Information collected</h2>
            <p>Matthew collects information you choose to provide, such as your name, email address, organization, message, feedback, support details, and, if you provide it, your mobile phone number and SMS consent choice.</p>
            <p>The site may also collect limited referral and technical context, such as the page where your visit began, campaign parameters, and a query-free referring page. If you use Sign in with ChatGPT, the site receives a site-scoped user ID, email address, and optional full name. It does not receive your ChatGPT files, memories, chats, or interests.</p>
          </section>

          <section>
            <h2>How information is used</h2>
            <p>Information is used to respond to requests, operate and secure the site, remember basic referral context, provide requested services, maintain private records, and communicate with you when you have asked Matthew to do so.</p>
            <p>If you separately opt in to SMS, your mobile number and consent record are used to send the conversational, scheduling, or project-related messages described when you opt in. SMS consent is optional and is not a condition of submitting a contact request or purchasing a service.</p>
          </section>

          <section>
            <h2>Mobile information stays private</h2>
            <p><strong>Mobile phone numbers, SMS opt-in data, and messaging consent are not sold, rented, or shared with third parties or affiliates for their marketing or promotional purposes.</strong> SMS consent is specific to Matthew Roxas and is not transferred to another business or sender.</p>
            <p>Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to opt out of SMS messages at any time. Reply <strong>HELP</strong> for help or email <a href="mailto:matthewgroxas@gmail.com">matthewgroxas@gmail.com</a>. See the <a href="/terms">SMS terms and conditions</a> for more information.</p>
          </section>

          <section>
            <h2>Limited service-provider sharing</h2>
            <p>Matthew may disclose only the information needed to service providers that help operate the website and requested communications. These may include website hosting and storage providers, authentication services, booking or payment services you choose to use, and communications providers such as Twilio, mobile carriers, and related messaging vendors.</p>
            <p>These providers may process information only to perform services for Matthew, comply with law, or protect the service. This operational sharing does not permit them to use your mobile number or SMS consent for their own marketing or promotional purposes. Information may also be disclosed when required by law or when reasonably necessary to protect rights, safety, or the integrity of the service.</p>
          </section>

          <section>
            <h2>Retention and security</h2>
            <p>Matthew retains information only as long as reasonably needed for the purposes described here, including recordkeeping, consent records, dispute resolution, security, and legal obligations. Reasonable administrative and technical safeguards are used, but no internet or messaging system can be guaranteed completely secure.</p>
          </section>

          <section>
            <h2>Your choices</h2>
            <p>You may ask to access, correct, or delete information you submitted, subject to records Matthew must retain for legal, security, or transactional reasons. You can also unsubscribe from SMS at any time by replying <strong>STOP</strong>.</p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>Questions or privacy requests can be sent to Matthew Roxas at <a href="mailto:matthewgroxas@gmail.com">matthewgroxas@gmail.com</a>.</p>
          </section>
        </div>
      </section>
      <SiteFooter note="Privacy · Clear boundaries for personal information" />
    </main>
  );
}
