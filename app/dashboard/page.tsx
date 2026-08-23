/* eslint-disable @next/next/no-html-link-for-pages -- Vinext beta navigation interception breaks normal clicks. */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DashboardInbox from '../components/dashboard-inbox';
import { chatGPTSignOutPath, isDashboardOwner, requireChatGPTUser } from '../chatgpt-auth';
import { ANALYTICS_DASHBOARD_URL } from '../../content/site';
import { getContactDashboardData } from '../../db/contact-requests';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Internal dashboard',
  description: 'Private contact request inbox for Matthew Roxas.',
  robots: { index: false, follow: false, nocache: true },
};

type DashboardPageProps = {
  searchParams: Promise<{ email?: string | string[] }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireChatGPTUser('/dashboard');
  if (!isDashboardOwner(user)) notFound();
  const params = await searchParams;
  const initialEmail = typeof params.email === 'string'
    ? params.email.trim().toLowerCase().slice(0, 180)
    : '';

  let data: Awaited<ReturnType<typeof getContactDashboardData>> | null = null;
  let databaseError = false;
  try { data = await getContactDashboardData({ email: initialEmail }); } catch (error) {
    databaseError = true;
    console.error('Dashboard database read failed', error);
  }
  const requests = data?.requests ?? [];
  const totals = data?.totals ?? { total: 0, unread: 0, lastSevenDays: 0 };

  return (
    <main className="dashboard-shell">
      <header className="site-header dashboard-header">
        <a className="wordmark" href="/" aria-label="Matthew Roxas, home">MR<span className="wordmark-dot" aria-hidden="true" /></a>
        <nav className="primary-nav" aria-label="Dashboard navigation"><a href="/">Site</a><a href="/writing">Writing</a></nav>
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
          <div className="inbox-heading"><h2 id="inbox-heading">Request database</h2><span>Searches up to 100 matches</span></div>
          <DashboardInbox
            initialRequests={requests}
            initialEmail={initialEmail}
            databaseError={databaseError}
          />
        </section>
      </section>
    </main>
  );
}
