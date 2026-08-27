import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildCalendlyBookingUrl } from '../app/calendly-booking.ts';
import { CALENDLY_BOOKING } from '../content/site.ts';

const BUSINESS_STRATEGY_URL = 'https://calendly.com/matthewgroxas/strategic-diagnosis-call';
const AI_COACHING_URL = 'https://calendly.com/matthewgroxas/coffee-chat';
const IMPLEMENTATION_ROADMAP_URL = 'https://calendly.com/matthewgroxas/30min';

test('publishes distinct business strategy, AI coaching, and business-only deep-dive bookings', () => {
  assert.equal(CALENDLY_BOOKING.businessAiStrategyCallUrl, BUSINESS_STRATEGY_URL);
  assert.equal(CALENDLY_BOOKING.businessAiStrategyDurationMinutes, 30);
  assert.equal(CALENDLY_BOOKING.aiCoachingConversationUrl, AI_COACHING_URL);
  assert.equal(CALENDLY_BOOKING.implementationRoadmapDeepDiveUrl, IMPLEMENTATION_ROADMAP_URL);
  assert.notEqual(
    CALENDLY_BOOKING.businessAiStrategyCallUrl,
    CALENDLY_BOOKING.aiCoachingConversationUrl,
  );
  assert.notEqual(
    CALENDLY_BOOKING.aiCoachingConversationUrl,
    CALENDLY_BOOKING.implementationRoadmapDeepDiveUrl,
  );
});

test('offers business and coaching paths on Contact while keeping the paid deep dive business-only', async () => {
  const [contactPage, supportPage] = await Promise.all([
    readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/support/page.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(contactPage, /CALENDLY_BOOKING\.businessAiStrategyCallUrl/);
  assert.match(contactPage, /CALENDLY_BOOKING\.aiCoachingConversationUrl/);
  assert.match(contactPage, /Business AI Strategy Call/);
  assert.match(contactPage, /AI Coaching Conversation/);
  assert.match(contactPage, /Implementation Roadmap Deep Dive/);
  assert.doesNotMatch(contactPage, /CALENDLY_BOOKING\.implementationRoadmapDeepDiveUrl/);
  assert.match(contactPage, /ContactForm/);

  assert.match(supportPage, /CALENDLY_BOOKING\.implementationRoadmapDeepDiveUrl/);
  assert.match(supportPage, /Implementation Roadmap Deep Dive/);
  assert.match(supportPage, /exclusively for business AI consulting/i);
  assert.doesNotMatch(supportPage, /CALENDLY_BOOKING\.aiCoachingConversationUrl/);
});

test('carries the existing lead UTM fields into both contact bookings without forwarding private context', () => {
  for (const bookingUrl of [BUSINESS_STRATEGY_URL, AI_COACHING_URL]) {
    const url = new URL(buildCalendlyBookingUrl(bookingUrl, {
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
  }
});
