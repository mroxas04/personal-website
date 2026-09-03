export type WritingCategory = 'Paper' | 'Article' | 'Blog';

export type WritingEntry = {
  title: string;
  category: WritingCategory;
  outlet: string;
  year: number;
  status: 'Published' | 'Forthcoming' | 'Working paper' | 'Ongoing';
  description: string;
  href: string | null;
};

/**
 * This is the single writing index used across every writing page.
 * Add the public URL when an item goes live; null URLs render as non-clickable.
 */
export const WRITING: WritingEntry[] = [
  {
    title: 'Does artificial intelligence truly reason?',
    category: 'Paper',
    outlet: 'Independent research · Philosophy of AI',
    year: 2026,
    status: 'Working paper',
    description:
      'An argument that embodiment may give an artificial system a meaningful world, while reasoning demands the ability to take up a history as one’s own and project toward future possibilities.',
    href: null,
  },
  {
    title: 'What if We Only Hired for Soft Skills?',
    category: 'Article',
    outlet: 'Orr Fellowship',
    year: 2026,
    status: 'Published',
    description:
      'Reflecting on the value of soft skills in the evolving professional landscape.',
    href: 'https://orrfellowship.org/what-if-we-only-hired-for-soft-skills/',
  },
  {
    title: 'Context is not just more information',
    category: 'Blog',
    outlet: 'Ongoing inquiry · AI',
    year: 2026,
    status: 'Ongoing',
    description:
      'Context is a lived relation among history, stakes, attention, and the person for whom something matters.',
    href: null,
  },
  {
    title: 'Structured, but malleable',
    category: 'Blog',
    outlet: 'Field note · Systems',
    year: 2026,
    status: 'Ongoing',
    description:
      'Enough structure to move with intention; enough openness to revise the map when the terrain changes.',
    href: null,
  },
];

export const WRITING_CATEGORIES: WritingCategory[] = [
  'Paper',
  'Article',
  'Blog',
];

export const WRITING_CATEGORY_DETAILS: Record<WritingCategory, {
  slug: string;
  plural: string;
  description: string;
}> = {
  Paper: {
    slug: 'papers',
    plural: 'Papers',
    description: 'Formal research and working papers in philosophy of AI.',
  },
  Article: {
    slug: 'articles',
    plural: 'Articles',
    description: 'Writing published through fellowships, organizations, and outside outlets.',
  },
  Blog: {
    slug: 'blog',
    plural: 'Blog',
    description: 'Essays and shorter notes from ongoing questions and experiments.',
  },
};
