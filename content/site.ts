export type MediaSlot = {
  kind: 'image' | 'video';
  src: string | null;
  alt: string;
  caption: string;
  poster?: string | null;
  objectPosition?: string;
};

/**
 * Replace `src: null` with a path in /public/media (for example,
 * `/media/hero-portrait.jpg`). The UI automatically swaps the labeled
 * placeholder for the real image or video.
 */
export const MEDIA = {
  heroPortrait: {
    kind: 'image',
    src: null,
    alt: 'Portrait of Matthew Roxas',
    caption: 'A portrait that feels like you—not a headshot by default.',
    objectPosition: '50% 35%',
  },
  studioMoment: {
    kind: 'image',
    src: null,
    alt: 'Matthew Roxas working on a project',
    caption: 'Building, teaching, or working through a complicated system.',
  },
  livedMoment: {
    kind: 'image',
    src: null,
    alt: 'A moment from Matthew Roxas’s life in Indianapolis',
    caption: 'A frame from daily life—people, place, food, or movement.',
  },
  fieldNote: {
    kind: 'image',
    src: null,
    alt: 'A scene photographed by Matthew Roxas',
    caption: 'Something you noticed and wanted to keep looking at.',
  },
  motionStudy: {
    kind: 'video',
    src: null,
    poster: null,
    alt: 'A short video recorded by Matthew Roxas',
    caption: 'A short film, process clip, or moving field note.',
  },
} satisfies Record<string, MediaSlot>;

/** Set this when you have GA4, Plausible, or another analytics dashboard. */
export const ANALYTICS_DASHBOARD_URL: string | null = null;

export const SOCIAL_LINKS = [
  ['LinkedIn', '/in/matthew-roxas', 'https://www.linkedin.com/in/matthew-roxas'],
  ['GitHub', '@mroxas04', 'https://github.com/mroxas04'],
  ['Email', 'matthewgroxas@gmail.com', 'mailto:matthewgroxas@gmail.com'],
  ['Instagram', '@roxas.matthew', 'https://www.instagram.com/roxas.matthew/'],
  ['BeReal', '@mroxas042', 'https://bere.al/mroxas042'],
  ['Beli', '@mroxas', 'https://beliapp.co/app/mroxas'],
  ['Roxasisms', '@roxasisms', 'https://www.instagram.com/roxasisms/'],
  ['Duolingo', '@MatthewRox5', 'https://invite.duolingo.com/profile-share/MatthewRox5'],
] as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.mroxas.chatgpt.site';
