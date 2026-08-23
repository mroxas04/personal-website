'use client';

import { useEffect } from 'react';
import { ATTRIBUTION_STORAGE_KEY, type ContactAttribution } from '../contact-attribution';

function trimValue(value: string | null, maxLength = 200) {
  return (value ?? '').trim().slice(0, maxLength);
}

function safeReferrer(value: string) {
  if (!value) return '';

  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return '';
  }
}

export default function AttributionCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;

      const params = new URLSearchParams(window.location.search);
      const attribution: ContactAttribution = {
        utmSource: trimValue(params.get('utm_source')),
        utmMedium: trimValue(params.get('utm_medium')),
        utmCampaign: trimValue(params.get('utm_campaign')),
        utmContent: trimValue(params.get('utm_content')),
        utmTerm: trimValue(params.get('utm_term')),
        landingPath: window.location.pathname.slice(0, 300),
        referrer: safeReferrer(document.referrer),
      };

      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    } catch {
      // Attribution is supplemental; blocked browser storage must never break the site.
    }
  }, []);

  return null;
}
