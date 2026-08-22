import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { chatGPTSignOutPath, isDashboardOwner, requireChatGPTUser } from '../chatgpt-auth';
import { ANALYTICS_DASHBOARD_URL } from '../../content/site';
import { getContactDashboardData } from '../../db/contact-requests';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Internal dashboard',
  description: 'Private contact request inbox for Matthew Roxas.',
  robots: { index: false, follow: false, nocache: true },
};

const reasonLabels: Record<string, string> = {
  'philosophy-ai': 'Philosophy / AI', consulting: 'Consulting', technical: 'Technical',
  teaching: 'Speaking / teaching', other: 'Other',
};

export default async function DashboardPage() {
  const user = await requireChatGPTUser('/dashboard');
  if (!isDashboardOwner(user)) notFound();

  let data: Awaited<ReturnType<typeof getContactDashboardData>> | null = null;
  let databaseError = false;
  try { data = await getContactDashboardData(); } catch (error) {
    databaseError = true;
    console.error('Dashboard database read failed', error);
  }
  const requests = data?.requests ?? [];
  const totals = data?.totals ?? { total: 0, unread: 0, lastSevenDays: 0 };

  return (
    <main className="dashboard-shell">
      <header className="site-header dashboard-header">
        <Link className="wordmark" href="/" aria-label="Matthew Roxas, home">MR<span className="wordmark-dot" aria-hidden="true" /></Link>
        <nav className="primary-nav" aria-label="Dashboard navigation"><Link href="/">Site</Link><Link href="/writing">Writing</Link></nav>
        <a className="private-label" href={chatGPTSignOutPath('/')}>Sign out ↗</a>
      </header>

      <section className="dashboard-main">
        <div className="dashboard-title-row">
          <div><p className="section-kicker">Internal / Contact intake</p><h1>Conversation inbox.</h1></div>
          <div className="privacy-note"><strong>Server-protected</strong><span>Signed in as {user.displayName}.</span><small>Only the configured owner account can read this inbox.</small></div>
        </div>
        <div className="dashboard-stats" aria-label="Contact request totals">
          <article><span>Total requests</span><strong>{totals.total}</strong></article>
          <article><span>New</span><strong>{totals.unread}</strong></article>
          <article><span>Last 7 days</span><strong>{totals.lastSevenDays}</strong></article>
          <article className="analytics-card"><span>Analytics</span>{ANALYTICS_DASHBOARD_URL ? <a href={ANALYTICS_DASHBOARD_URL} target="_blank" rel="noreferrer">Open dashboard ↗</a> : <><strong>—</strong><small>Set ANALYTICS_DASHBOARD_URL in content/site.ts</small></>}</article>
        </div>

        <section className="inbox-section" aria-labelledby="inbox-heading">
          <div className="inbox-heading"><h2 id="inbox-heading">Latest requests</h2><span>Showing up to 100</span></div>
          {databaseError ? <div className="dashboard-empty"><h3>Database unavailable.</h3><p>The D1 binding could not be read in this environment. The hosted deployment will use the configured DB binding.</p></div>
            : requests.length === 0 ? <div className="dashboard-empty"><h3>The inbox is quiet.</h3><p>New submissions from the contact form will appear here automatically.</p></div>
            : <div className="request-list">{requests.map((request) => <article className="request-card" key={request.id}>
                <div className="request-meta"><span className={`request-status request-status-${request.status}`}>{request.status}</span><time dateTime={new Date(request.created_at).toISOString()}>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(request.created_at)}</time><span>{reasonLabels[request.reason] ?? request.reason}</span></div>
                <div className="request-sender"><h3>{request.name}</h3><a href={`mailto:${request.email}`}>{request.email}</a>{request.organization ? <span>{request.organization}</span> : null}</div><p>{request.message}</p>
              </article>)}</div>}
        </section>
      </section>
    </main>
  );
}
