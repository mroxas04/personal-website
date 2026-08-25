'use client';

import type { MouseEvent, ReactNode } from 'react';
import { buildCalendlyBookingUrl } from '../calendly-booking';
import { readStoredAttribution } from '../contact-attribution';

type CalendlyBookingLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export default function CalendlyBookingLink({
  children,
  className,
  href,
}: CalendlyBookingLinkProps) {
  function addAttribution(event: MouseEvent<HTMLAnchorElement>) {
    try {
      const attribution = readStoredAttribution(sessionStorage);
      if (attribution) {
        event.currentTarget.href = buildCalendlyBookingUrl(href, attribution);
      }
    } catch {
      // Booking remains available when browser storage is unavailable.
    }
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={addAttribution}
      onAuxClick={addAttribution}
      onContextMenu={addAttribution}
    >
      {children}
    </a>
  );
}
