import type { ContactAttribution } from './contact-attribution';

const CALENDLY_UTM_FIELDS = [
  ['utm_source', 'utmSource'],
  ['utm_medium', 'utmMedium'],
  ['utm_campaign', 'utmCampaign'],
  ['utm_content', 'utmContent'],
  ['utm_term', 'utmTerm'],
] as const;

export function buildCalendlyBookingUrl(
  bookingUrl: string,
  attribution: Partial<ContactAttribution>,
) {
  const url = new URL(bookingUrl);

  for (const [queryName, attributionName] of CALENDLY_UTM_FIELDS) {
    const value = attribution[attributionName];
    if (value) url.searchParams.set(queryName, value);
  }

  return url.toString();
}
