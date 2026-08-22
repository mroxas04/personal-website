import type { Metadata } from 'next';
import WritingCategoryPage from '../category-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Articles by Matthew Roxas for fellowships, organizations, and outside outlets.',
  alternates: { canonical: '/writing/articles' },
};

export default function ArticlesPage() {
  return <WritingCategoryPage category="Article" />;
}
