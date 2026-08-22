export type WritingCategory = 'Publication' | 'Article' | 'Essay' | 'Note';

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
 * This is the single writing index used on both the home page and /writing.
 * Add the public URL when an item goes live; null URLs render as non-clickable.
 */
export const WRITING: WritingEntry[] = [
  {
    title: 'Does artificial intelligence truly reason?',
    category: 'Publication',
    outlet: 'Independent research · Philosophy of AI',
    year: 2026,
    status: 'Working paper',
    description:
      'An argument that embodiment may give an artificial system a meaningful world, while reasoning demands the ability to take up a history as one’s own and project toward future possibilities.',
    href: null,
  },
  {
    title: 'Writing for the Orr Fellowship blog',
    category: 'Article',
    outlet: 'Orr Fellowship',
    year: 2026,
    status: 'Forthcoming',
    description:
      'Essays and field notes on building, operating, leadership, and the questions that emerge when technical systems meet lived experience.',
    href: null,
  },
  {
    title: 'Context is not just more information',
    category: 'Essay',
    outlet: 'Ongoing inquiry · AI',
    year: 2026,
    status: 'Ongoing',
    description:
      'Context is a lived relation among history, stakes, attention, and the person for whom something matters.',
    href: null,
  },
  {
    title: 'Structured, but malleable',
    category: 'Note',
    outlet: 'Field note · Systems',
    year: 2026,
    status: 'Ongoing',
    description:
      'Enough structure to move with intention; enough openness to revise the map when the terrain changes.',
    href: null,
  },
];

export const WRITING_CATEGORIES: WritingCategory[] = [
  'Publication',
  'Article',
  'Essay',
  'Note',
];
