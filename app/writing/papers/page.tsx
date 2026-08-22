import type { Metadata } from 'next';
import WritingCategoryPage from '../category-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Papers',
  description: 'Formal research and working papers by Matthew Roxas.',
  alternates: { canonical: '/writing/papers' },
};

export default function PapersPage() {
  return <WritingCategoryPage category="Paper" />;
}
