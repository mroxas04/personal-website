export type MediaSlot = {
  kind: 'image' | 'video';
  src: string | null;
  alt: string;
  caption: string;
  poster?: string | null;
  objectPosition?: string;
};

const MEDIA_BASE_URL =
  'https://cdn.jsdelivr.net/gh/mroxas04/personal-website@main/public/media';

/**
 * Replace `src: null` with a path in /public/media (for example,
 * `/media/hero-portrait.jpg`). The UI automatically swaps the labeled
 * placeholder for the real image or video.
 */
export const MEDIA = {
  workHero: {
    kind: 'image',
    src: null,
    alt: 'Featured image for Matthew Roxas’s selected work',
    caption: 'Replace with a project, process, or working-session image.',
  },
  aboutHero: {
    kind: 'image',
    src: null,
    alt: 'Featured image for Matthew Roxas’s about page',
    caption: 'Replace with a portrait or a candid image that feels like you.',
  },
  elsewhereHero: {
    kind: 'image',
    src: null,
    alt: 'Featured image for Matthew Roxas’s links and profiles',
    caption: 'Replace with an image from daily life or the wider internet orbit.',
  },
  writingHero: {
    kind: 'image',
    src: null,
    alt: 'Featured image for Matthew Roxas’s writing archive',
    caption: 'Replace with a desk, notebook, book, or writing-process image.',
  },
  papersHero: {
    kind: 'image',
    src: null,
    alt: 'Featured image for Matthew Roxas’s academic papers',
    caption: 'Replace with an image connected to research or academic work.',
  },
  articlesHero: {
    kind: 'image',
    src: null,
    alt: 'Featured image for Matthew Roxas’s published articles',
    caption: 'Replace with an image connected to your public-facing ideas.',
  },
  blogHero: {
    kind: 'image',
    src: null,
    alt: 'Featured image for Matthew Roxas’s blog',
    caption: 'Replace with an informal field note, snapshot, or observation.',
  },
  heroPortrait: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/88EC9006-D927-4C9C-9B61-CDBDFC155F40_1_102_o.jpeg`,
    alt: 'Portrait of Matthew Roxas',
    caption: 'Somehow graduated May 2026!',
    objectPosition: '50% 35%',
  },
  studioMoment: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/2D859B7F-16E4-469C-AA34-7207933B2078_1_105_c.jpeg`,
    alt: 'Matthew Roxas working on a project',
    caption: 'Final Design Review for the Standing Rock Data Dashboard, where I was the Project Manager and GitHub lead',
  },
  livedMoment: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/21140066-985E-457A-BC39-A5626BDE2D12_1_102_o.jpeg`,
    alt: 'A moment from Matthew Roxas’s life in Indianapolis',
    caption: 'Currently living in Broad Ripple, where this is dearly missed (iykyk)',
  },
  fieldNote: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/289CD059-D33F-4CA6-995B-44324402CC02_1_201_a.jpg`,
    alt: 'A scene photographed by Matthew Roxas',
    caption: 'I always love me some good natural framing :)',
  },
  motionStudy: {
    kind: 'video',
    src: `${MEDIA_BASE_URL}/IMG_0095.mp4`,
    poster: `${MEDIA_BASE_URL}/2BA4FD45-7B16-4F39-861A-14A2DB32302A_1_105_c.jpeg`,
    alt: 'A short video recorded by Matthew Roxas',
    caption: 'Little timelapse I forced myself to take so I wasn\'t distracted by my phone whe I had to lock in'
  },
} satisfies Record<string, MediaSlot>;

/** Set this when you have GA4, Plausible, or another analytics dashboard. */
export const ANALYTICS_DASHBOARD_URL: string | null = null;

/** Topics used in the personalized welcome. Edit freely as your interests evolve. */
export const CONVERSATION_INTERESTS = [
  'AI and human judgment',
  'embodied cognition',
  'systems design',
  'philosophy of technology',
  'technical teaching',
  'marketing operations and automation',
  'basketball',
  'travel and photography',
  'merleau-ponty and phenomenology',
] as const;

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
