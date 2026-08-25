/* eslint-disable @next/next/no-html-link-for-pages -- Vinext beta navigation interception breaks normal clicks. */

type SiteFooterProps = {
  note?: string;
};

export default function SiteFooter({ note = 'Systems, AI & Philosophy · Indianapolis' }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <a className="footer-mark" href="/">Matthew Roxas<span>.</span></a>
      <div className="footer-details">
        <p>{note}</p>
        <nav className="footer-legal" aria-label="Legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">SMS terms</a>
        </nav>
      </div>
      <a href="/">Home ↑</a>
    </footer>
  );
}
