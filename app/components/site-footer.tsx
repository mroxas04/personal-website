import Link from 'next/link';

type SiteFooterProps = {
  note?: string;
};

export default function SiteFooter({ note = 'Systems, AI & Philosophy · Indianapolis' }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <Link className="footer-mark" href="/">Matthew Roxas<span>.</span></Link>
      <p>{note}</p>
      <Link href="/">Home ↑</Link>
    </footer>
  );
}
