/* eslint-disable @next/next/no-html-link-for-pages -- Vinext beta navigation interception breaks normal clicks. */

import { WRITING_CATEGORIES, WRITING_CATEGORY_DETAILS } from '../../content/writing';
import {
  chatGPTSignInPath,
  chatGPTSignOutPath,
  getChatGPTUser,
  isDashboardOwner,
} from '../chatgpt-auth';

type SiteHeaderProps = {
  returnTo?: string;
};

const mainLinks = [
  ['Work', '/work'],
  ['About', '/about'],
  ['Gratitude', '/gratitude'],
  ['Support', '/support'],
  ['Elsewhere', '/elsewhere'],
] as const;

export default async function SiteHeader({ returnTo = '/' }: SiteHeaderProps) {
  const user = await getChatGPTUser();
  const showDashboard = isDashboardOwner(user);

  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Matthew Roxas, home">
        MR<span className="wordmark-dot" aria-hidden="true" />
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        <details className="nav-dropdown">
          <summary>Writing <span aria-hidden="true">⌄</span></summary>
          <div className="nav-dropdown-menu">
            <a href="/writing">All writing</a>
            {WRITING_CATEGORIES.map((category) => (
              <a href={`/writing/${WRITING_CATEGORY_DETAILS[category].slug}`} key={category}>
                {WRITING_CATEGORY_DETAILS[category].plural}
              </a>
            ))}
          </div>
        </details>
        {mainLinks.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        {showDashboard ? <a href="/dashboard">Dashboard</a> : null}
      </nav>

      <div className="header-actions">
        <a className="contact-link" href="/contact">Start a conversation</a>
        {user ? (
          <a className="auth-link" href={chatGPTSignOutPath(returnTo)}>
            Sign out <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <a className="auth-link" href={chatGPTSignInPath(returnTo)}>
            <span className="auth-label-long">Sign in with ChatGPT</span>
            <span className="auth-label-short">Sign in</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      <details className="mobile-menu">
        <summary aria-label="Open navigation">Menu</summary>
        <nav aria-label="Mobile navigation">
          <a href="/writing">Writing</a>
          <div className="mobile-subnav">
            {WRITING_CATEGORIES.map((category) => (
              <a href={`/writing/${WRITING_CATEGORY_DETAILS[category].slug}`} key={category}>
                {WRITING_CATEGORY_DETAILS[category].plural}
              </a>
            ))}
          </div>
          {mainLinks.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          <a href="/contact">Contact</a>
          {showDashboard ? <a href="/dashboard">Dashboard</a> : null}
        </nav>
      </details>
    </header>
  );
}
