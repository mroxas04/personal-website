export const ATTRIBUTION_STORAGE_KEY = 'mr-contact-attribution-v2';
export const ATTRIBUTION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const CLICK_ID_PARAMS = [
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
  'ttclid',
  'li_fat_id',
] as const;

export type ClickIdType = (typeof CLICK_ID_PARAMS)[number];

export type ContactAttribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  clickIdType: ClickIdType | '';
  clickId: string;
  landingPath: string;
  referrer: string;
  capturedAt: number;
};

export type StoredContactAttribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  click_id_type: ClickIdType | null;
  click_id: string | null;
  landing_path: string | null;
  referrer: string | null;
};

type CaptureInput = {
  search: string;
  landingPath: string;
  referrer: string;
  capturedAt?: number;
};

type AttributionStorage = {
  getItem(key: string): string | null;
  removeItem(key: string): void;
};

function cleanText(value: unknown, maxLength = 200) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function safeLandingPath(value: unknown) {
  const candidate = cleanText(value, 300);
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return '';
  return candidate.split(/[?#]/, 1)[0].slice(0, 300);
}

function safeReferrer(value: unknown) {
  const candidate = cleanText(value, 500);
  if (!candidate) return '';

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return '';
  }
}

function safeClickIdType(value: unknown): ClickIdType | '' {
  const candidate = cleanText(value, 40);
  return CLICK_ID_PARAMS.includes(candidate as ClickIdType)
    ? candidate as ClickIdType
    : '';
}

export function createContactAttribution({
  search,
  landingPath,
  referrer,
  capturedAt = Date.now(),
}: CaptureInput): ContactAttribution {
  const params = new URLSearchParams(search);
  const clickIdType = CLICK_ID_PARAMS.find((name) => cleanText(params.get(name), 300)) ?? '';

  return {
    utmSource: cleanText(params.get('utm_source')),
    utmMedium: cleanText(params.get('utm_medium')),
    utmCampaign: cleanText(params.get('utm_campaign')),
    utmContent: cleanText(params.get('utm_content')),
    utmTerm: cleanText(params.get('utm_term')),
    clickIdType,
    clickId: clickIdType ? cleanText(params.get(clickIdType), 300) : '',
    landingPath: safeLandingPath(landingPath),
    referrer: safeReferrer(referrer),
    capturedAt,
  };
}

export function parseStoredAttribution(
  stored: string,
  now = Date.now(),
): ContactAttribution | null {
  try {
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    const capturedAt = parsed.capturedAt;
    if (
      typeof capturedAt !== 'number'
      || !Number.isFinite(capturedAt)
      || capturedAt > now
      || now - capturedAt >= ATTRIBUTION_MAX_AGE_MS
    ) {
      return null;
    }

    const clickIdType = safeClickIdType(parsed.clickIdType);
    return {
      utmSource: cleanText(parsed.utmSource),
      utmMedium: cleanText(parsed.utmMedium),
      utmCampaign: cleanText(parsed.utmCampaign),
      utmContent: cleanText(parsed.utmContent),
      utmTerm: cleanText(parsed.utmTerm),
      clickIdType,
      clickId: clickIdType ? cleanText(parsed.clickId, 300) : '',
      landingPath: safeLandingPath(parsed.landingPath),
      referrer: safeReferrer(parsed.referrer),
      capturedAt,
    };
  } catch {
    return null;
  }
}

export function readStoredAttribution(
  storage: AttributionStorage,
  now = Date.now(),
): ContactAttribution | null {
  try {
    const stored = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!stored) return null;

    const attribution = parseStoredAttribution(stored, now);
    if (!attribution) storage.removeItem(ATTRIBUTION_STORAGE_KEY);
    return attribution;
  } catch {
    return null;
  }
}

export function clearStoredAttribution(storage: AttributionStorage) {
  try {
    storage.removeItem(ATTRIBUTION_STORAGE_KEY);
  } catch {
    // Attribution is supplemental; blocked browser storage must never break submission.
  }
}

export function sanitizeSubmittedAttribution(
  body: Record<string, unknown>,
): StoredContactAttribution {
  const clickIdType = safeClickIdType(body.clickIdType);
  const clickId = clickIdType ? cleanText(body.clickId, 300) : '';

  return {
    utm_source: cleanText(body.utmSource) || null,
    utm_medium: cleanText(body.utmMedium) || null,
    utm_campaign: cleanText(body.utmCampaign) || null,
    utm_content: cleanText(body.utmContent) || null,
    utm_term: cleanText(body.utmTerm) || null,
    click_id_type: clickId ? clickIdType : null,
    click_id: clickId || null,
    landing_path: safeLandingPath(body.landingPath) || null,
    referrer: safeReferrer(body.referrer) || null,
  };
}
