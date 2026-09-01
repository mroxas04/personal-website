export type MediaSlot = {
  kind: 'image' | 'video';
  src: string | null;
  alt: string;
  caption: string;
  poster?: string | null;
  objectPosition?: string;
};

export type PeopleGroup = 'mentors' | 'peers' | 'mentees';

export type PeopleCard = {
  group: PeopleGroup;
  name: string;
  linkedinUrl: string | null;
  role: string;
  imageSrc: string | null;
  imageAlt: string;
  imagePosition?: string;
  note?: string;
};
export type PublicContactPhone = {
  /**
   * Store only an explicitly approved public business number in E.164 format.
   * Never place a private forwarding destination in this public configuration.
   */
  e164: string | null;
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
    src: `${MEDIA_BASE_URL}/High level UML ECE 461-Page 1.jpg`,
    alt: 'Featured image for Matthew Roxas’s work and projects',
    caption: 'UML I created for Phase 1 for ECE 461 (repo at https://github.com/mroxas04/SWE-Course-Project/)',
  },
  aboutHero: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/F0E80AE6-22FD-4D9D-A0F7-7E7DEE37AB26_1_105_c.jpeg`,
    alt: 'Featured image for Matthew Roxas’s about page',
    caption: 'February 2026 Gen Meeting for the Purdue Filipino Association, where I previously served as House Head and Treasurer',
  },
  elsewhereHero: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/BF976CA1-E3CF-4958-A338-525D3CCD8C4B_1_102_o.jpeg`,
    alt: 'Featured image for Matthew Roxas’s links and profiles',
    caption: 'Trying to decrease the average degree of separation between me and the rest of the world',
  },
  writingHero: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/2EB907BC-CED8-4CA7-9157-5AF439E73459_1_105_c.jpeg`,
    alt: 'Featured image for Matthew Roxas’s writing archive',
    caption: 'My very first physical journal',
  },
  papersHero: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/morpheus_graphic.png`,
    alt: 'Featured image for Matthew Roxas’s academic papers',
    caption: 'A Philosophy-Specific GPT (contact me for more information)',
  },
  articlesHero: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/F3D4E142-A051-4D8A-9C4F-28B2317E697E_1_105_c.jpeg`,
    alt: 'Featured image for Matthew Roxas’s published articles',
    caption: 'The mindset I approach when creating, building, and writing',
  },
  blogHero: {
    kind: 'image',
    src: `${MEDIA_BASE_URL}/29A4C9C8-01D3-4F24-AE69-DAC0F96E642F_1_105_c.jpeg`,
    alt: 'Featured image for Matthew Roxas’s blog',
    caption: 'From my trip to Planet Word Museum in Washington DC for Fall Break 2025',
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
    caption: 'Little timelapse I forced myself to take so I wasn\'t distracted by my phone when I had to lock in'
  },
} satisfies Record<string, MediaSlot>;

/** Set this when you have GA4, Plausible, or another analytics dashboard. */
export const ANALYTICS_DASHBOARD_URL: string | null = null;

/**
 * Public payment identifiers. Matthew explicitly authorized the personal Venmo
 * handle and Zelle email address below for display on the public site.
 * Do not add or replace personal identifiers without renewed authorization.
 */
export const SUPPORT_PAYMENT: {
  venmoProfileUrl: string | null;
  venmoHandle: string | null;
  zelleEmail: string | null;
  zelleQrImage: string | null;
  zelleDisplayName: string | null;
} = {
  venmoProfileUrl: 'https://venmo.com/u/Matthew-Roxas-1',
  venmoHandle: '@Matthew-Roxas-1',
  zelleEmail: 'matthewroxas@gmail.com',
  zelleQrImage: null,
  zelleDisplayName: null,
};

/** Public booking links. Keep the primary conversation separate from paid support. */
export const CALENDLY_BOOKING = {
  talkThroughAnAiQuestionUrl: 'https://calendly.com/matthewgroxas/talk-through-an-ai-question',
  talkThroughAnAiQuestionDurationMinutes: 45,
  implementationRoadmapDeepDiveUrl: 'https://calendly.com/matthewgroxas/30min',
  implementationRoadmapDurationMinutes: 30,
  implementationRoadmapPriceUsd: 30,
} as const;

/**
 * Approved public business contact number. Publishing this value still requires
 * explicit release authorization and does not establish forwarding readiness.
 */
export const PUBLIC_CONTACT_PHONE: PublicContactPhone = {
  e164: '+13179786815',
};

export function formatPublicContactPhone(e164: string) {
  const compact = e164.trim();
  const usNumber = compact.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  return usNumber
    ? `(${usNumber[1]}) ${usNumber[2]}-${usNumber[3]}`
    : compact;
}

export function normalizePublicContactPhone(e164: string | null) {
  const compact = e164?.trim() ?? '';
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : null;
}

export function getPublicContactPhone(e164: string | null) {
  const normalized = normalizePublicContactPhone(e164);
  return normalized
    ? { e164: normalized, display: formatPublicContactPhone(normalized) }
    : null;
}

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

/**
 * The gratitude page is generated from this list.
 *
 * - Keep `group` as mentors, peers, or mentees.
 * - Set `imageSrc` to a public image URL and describe the real photo in `imageAlt`.
 * - Use `imagePosition` (for example, "50% 30%") to adjust a photo's crop.
 * - `linkedinUrl` and `note` are optional. Entries render in the order below.
 */
export const PEOPLE_SPOTLIGHTS: PeopleCard[] = [
  {
    group: 'mentors',
    name: 'Add a mentor',
    linkedinUrl: null,
    role: 'Describe how this person has guided your thinking, work, or direction.',
    imageSrc: null,
    imageAlt: 'Photo slot for a mentor',
    note: 'Starter card. Replace these details when you are ready to publish someone.',
  },
  {
    group: 'peers',
    name: 'Add a peer',
    linkedinUrl: null,
    role: 'Describe what you have built, learned, experienced, or worked through together.',
    imageSrc: null,
    imageAlt: 'Photo slot for a peer',
    note: 'Starter card. Replace these details when you are ready to publish someone.',
  },
  {
    group: 'mentees',
    name: 'Add a mentee',
    linkedinUrl: null,
    role: 'Describe the part of their growth or trajectory that you have been able to support.',
    imageSrc: null,
    imageAlt: 'Photo slot for a mentee',
    note: 'Starter card. Replace these details when you are ready to publish someone.',
  },
] satisfies PeopleCard[];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.mroxas.chatgpt.site';
