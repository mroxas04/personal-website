import type { Metadata } from 'next';
import WritingCategoryPage from '../category-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Essays and shorter notes by Matthew Roxas.',
  alternates: { canonical: '/writing/blog' },
};

export default function BlogPage() {
  return <WritingCategoryPage category="Blog" />;
}
