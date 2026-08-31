import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import AttributionCapture from './components/attribution-capture';
import { SITE_URL } from '../content/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Matthew Roxas — Systems, AI & Philosophy',
    template: '%s · Matthew Roxas',
  },
  description:
    'A portfolio of technical work, operational practice, and philosophical inquiry into AI.',
  keywords: [
    'Matthew Roxas',
    'philosophy of AI',
    'computer engineering',
    'embodied cognition',
    'marketing operations',
  ],
  authors: [{ name: 'Matthew Roxas' }],
  creator: 'Matthew Roxas',
  publisher: 'Matthew Roxas',
  alternates: { canonical: '/' },
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: '/favicon.png' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Matthew Roxas',
    title: 'Matthew Roxas — Systems, AI & Philosophy',
    description:
      'Technical work, operational practice, and philosophical inquiry into AI.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Matthew Roxas — Systems, AI & Philosophy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matthew Roxas — Systems, AI & Philosophy',
    description:
      'Technical work, operational practice, and philosophical inquiry into AI.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MKP8BCFEVC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MKP8BCFEVC');`}
        </Script>
        <AttributionCapture />
        {children}
      </body>
    </html>
  );
}
