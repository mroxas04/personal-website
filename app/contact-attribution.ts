export const ATTRIBUTION_STORAGE_KEY = 'mr-contact-attribution-v1';

export type ContactAttribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  landingPath: string;
  referrer: string;
};
