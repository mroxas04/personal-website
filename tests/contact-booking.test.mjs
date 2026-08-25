import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildCalendlyBookingUrl } from '../app/calendly-booking.ts';
import { CALENDLY_BOOKING } from '../content/site.ts';

const FREE_DIAGNOSIS_URL = 'https://calendly.com/matthewgroxas/strategic-diagnosis-call';

test('publishes the free 30-minute Strategic Diagnosis Call as a distinct booking option', () => {
  assert.equal(CALENDLY_BOOKING.strategicDiagnosisCallUrl, FREE_DIAGNOSIS_URL);
  assert.equal(CALENDLY_BOOKING.strategicDiagnosisDurationMinutes, 30);
  assert.notEqual(
    CALENDLY_BOOKING.strategicDiagnosisCallUrl,
    CALENDLY_BOOKING.philosophicalAiConsultationUrl,
  );
});

test('uses the free diagnosis link on Contact without promoting the paid booking link', async () => {
  const contactPage = await readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8');

  assert.match(contactPage, /CALENDLY_BOOKING\.strategicDiagnosisCallUrl/);
  assert.doesNotMatch(contactPage, /CALENDLY_BOOKING\.philosophicalAiConsultationUrl/);
  assert.match(contactPage, /ContactForm/);
});

test('carries the existing lead UTM fields into Calendly without forwarding private context', () => {
  const url = new URL(buildCalendlyBookingUrl(FREE_DIAGNOSIS_URL, {
    utmSource: 'linkedin',
    utmMedium: 'social',
    utmCampaign: 'profile',
    utmContent: 'contact-cta',
    utmTerm: 'ai consulting',
    clickId: 'private-click-id',
    landingPath: '/contact',
    referrer: 'https://example.com/private-path',
  }));

  assert.equal(url.searchParams.get('utm_source'), 'linkedin');
  assert.equal(url.searchParams.get('utm_medium'), 'social');
  assert.equal(url.searchParams.get('utm_campaign'), 'profile');
  assert.equal(url.searchParams.get('utm_content'), 'contact-cta');
  assert.equal(url.searchParams.get('utm_term'), 'ai consulting');
  assert.equal(url.searchParams.has('clickId'), false);
  assert.equal(url.searchParams.has('landingPath'), false);
  assert.equal(url.searchParams.has('referrer'), false);
});
