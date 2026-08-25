'use client';

import { useEffect } from 'react';
import {
  ATTRIBUTION_STORAGE_KEY,
  clearStoredAttribution,
  createContactAttribution,
  readStoredAttribution,
} from '../contact-attribution';

export default function AttributionCapture() {
  useEffect(() => {
    try {
      if (readStoredAttribution(sessionStorage)) return;
      clearStoredAttribution(sessionStorage);

      const attribution = createContactAttribution({
        search: window.location.search,
        landingPath: window.location.pathname,
        referrer: document.referrer,
      });

      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    } catch {
      // Attribution is supplemental; blocked browser storage must never break the site.
    }
  }, []);

  return null;
}
