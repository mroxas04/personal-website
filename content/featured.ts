export type FeaturedItem = {
  type: string;
  title: string;
  description: string;
  status: string;
  href: string;
  cta: string;
  external?: boolean;
};

/**
 * Homepage features are intentionally curated rather than inferred.
 * Keep the newest or most representative item first; the first entry receives
 * the largest visual treatment on the landing page.
 */
export const FEATURED_ITEMS: FeaturedItem[] = [
  {
    type: 'Published article',
    title: 'What if We Only Hired for Soft Skills?',
    description:
      'A reflection on why judgment, communication, and adaptability become more valuable—not less—as technical work evolves.',
    status: 'Orr Fellowship · 2026',
    href: 'https://orrfellowship.org/what-if-we-only-hired-for-soft-skills/',
    cta: 'Read the article',
    external: true,
  },
  {
    type: 'Working paper',
    title: 'Does artificial intelligence truly reason?',
    description:
      'An inquiry into embodiment, history, possibility, and what it would mean for an artificial system to have a meaningful world.',
    status: 'Philosophy of AI · In progress',
    href: 'https://docs.google.com/document/d/1D0h71GGJhiPjnGyw8SA7FIU4Hv6eFu5xY7Kak6Ik5Fs/edit?usp=sharing',
    cta: 'See the research',
    external: true,
  },
  {
    type: 'Personal AI system',
    title: 'Second Mind',
    description:
      'A private, local-first system that turns journals and dated media into a grounded record of memory, identity, and change.',
    status: 'In development',
    href: 'https://github.com/mroxas04/second-mind',
    cta: 'Explore the project',
    external: true,
  },
];
