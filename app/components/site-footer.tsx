/* eslint-disable @next/next/no-html-link-for-pages -- Vinext beta navigation interception breaks normal clicks. */

type SiteFooterProps = {
  note?: string;
};

export default function SiteFooter({ note = 'Systems, AI & Philosophy · Indianapolis' }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <a className="footer-mark" href="/">Matthew Roxas<span>.</span></a>
      <p>{note}</p>
      <a href="/">Home ↑</a>
    </footer>
  );
}
