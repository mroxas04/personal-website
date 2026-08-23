/* eslint-disable @next/next/no-html-link-for-pages -- Vinext beta navigation interception breaks normal clicks. */

export default function DashboardNotFound() {
  return (
    <main className="dashboard-denied">
      <p className="section-kicker">Private workspace</p>
      <h1>This dashboard isn’t available for this account.</h1>
      <p>The public portfolio is open to everyone, but contact-request data is restricted to Matthew’s configured owner account.</p>
      <div className="denied-actions">
        <a className="button button-dark" href="/">Return to the site →</a>
        <a className="text-link" href="/signout-with-chatgpt?return_to=%2F">Sign out ↗</a>
      </div>
    </main>
  );
}
