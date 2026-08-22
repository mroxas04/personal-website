import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Matthew Roxas — Systems, AI & Philosophy',
    template: '%s · Matthew Roxas',
  },
  description:
    'Matthew Roxas is a computer engineer, operator, and philosopher of AI working across technical systems, human judgment, and lived experience.',
  keywords: [
    'Matthew Roxas',
    'philosophy of AI',
    'computer engineering',
    'embodied cognition',
    'marketing operations',
  ],
  authors: [{ name: 'Matthew Roxas' }],
  creator: 'Matthew Roxas',
  icons: { icon: '/favicon.png' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Matthew Roxas',
    title: 'Matthew Roxas — Systems, AI & Philosophy',
    description:
      'A computer engineer, operator, and philosopher of AI working across technical systems, human judgment, and lived experience.',
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
      'A computer engineer, operator, and philosopher of AI working across technical systems, human judgment, and lived experience.',
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
      <body>{children}</body>
    </html>
  );
}
