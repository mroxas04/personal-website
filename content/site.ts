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
    src: '/media/88EC9006-D927-4C9C-9B61-CDBDFC155F40_1_102_o.jpeg',
    alt: 'Portrait of Matthew Roxas',
    caption: 'A portrait that feels like you—not a headshot by default.',
    objectPosition: '50% 35%',
  },
  studioMoment: {
    kind: 'image',
    src: '/media/2D859B7F-16E4-469C-AA34-7207933B2078_1_105_c.jpeg',
    alt: 'Matthew Roxas working on a project',
    caption: 'Building, teaching, or working through a complicated system.',
  },
  livedMoment: {
    kind: 'image',
    src: '/media/21140066-985E-457A-BC39-A5626BDE2D12_1_102_o.jpeg',
    alt: 'A moment from Matthew Roxas’s life in Indianapolis',
    caption: 'A frame from daily life—people, place, food, or movement.',
  },
  fieldNote: {
    kind: 'image',
    src: 'media/289CD059-D33F-4CA6-995B-44324402CC02_1_201_a.jpg',
    alt: 'A scene photographed by Matthew Roxas',
    caption: 'Something you noticed and wanted to keep looking at.',
  },
  motionStudy: {
    kind: 'video',
    src: '/media/IMG_0095.mov',
    poster: '/media/2BA4FD45-7B16-4F39-861A-14A2DB32302A_1_105_c.jpeg',
    alt: 'A short video recorded by Matthew Roxas',
    caption: 'A short film, process clip, or moving field note.',
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
