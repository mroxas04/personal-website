import Link from 'next/link';
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
  ['Elsewhere', '/elsewhere'],
] as const;

export default async function SiteHeader({ returnTo = '/' }: SiteHeaderProps) {
  const user = await getChatGPTUser();
  const showDashboard = isDashboardOwner(user);

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Matthew Roxas, home">
        MR<span className="wordmark-dot" aria-hidden="true" />
      </Link>

      <nav className="primary-nav" aria-label="Primary navigation">
        <details className="nav-dropdown">
          <summary>Writing <span aria-hidden="true">⌄</span></summary>
          <div className="nav-dropdown-menu">
            <Link href="/writing">All writing</Link>
            {WRITING_CATEGORIES.map((category) => (
              <Link href={`/writing/${WRITING_CATEGORY_DETAILS[category].slug}`} key={category}>
                {WRITING_CATEGORY_DETAILS[category].plural}
              </Link>
            ))}
          </div>
        </details>
        {mainLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        {showDashboard ? <Link href="/dashboard">Dashboard</Link> : null}
      </nav>

      <div className="header-actions">
        <Link className="contact-link" href="/contact">Start a conversation</Link>
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
          <Link href="/writing">Writing</Link>
          <div className="mobile-subnav">
            {WRITING_CATEGORIES.map((category) => (
              <Link href={`/writing/${WRITING_CATEGORY_DETAILS[category].slug}`} key={category}>
                {WRITING_CATEGORY_DETAILS[category].plural}
              </Link>
            ))}
          </div>
          {mainLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          <Link href="/contact">Contact</Link>
          {showDashboard ? <Link href="/dashboard">Dashboard</Link> : null}
        </nav>
      </details>
    </header>
  );
}
