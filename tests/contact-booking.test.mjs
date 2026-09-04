import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildCalendlyBookingUrl } from '../app/calendly-booking.ts';
import { CALENDLY_BOOKING } from '../content/site.ts';

const TALK_THROUGH_AI_QUESTION_URL = 'https://calendly.com/matthewgroxas/coffee-chat-1';
const IMPLEMENTATION_ROADMAP_URL = 'https://calendly.com/matthewgroxas/30min';

test('publishes one free AI-question conversation while preserving the paid deep dive', () => {
  assert.equal(CALENDLY_BOOKING.talkThroughAnAiQuestionUrl, TALK_THROUGH_AI_QUESTION_URL);
  assert.equal(CALENDLY_BOOKING.talkThroughAnAiQuestionDurationMinutes, 45);
  assert.equal(CALENDLY_BOOKING.implementationRoadmapDeepDiveUrl, IMPLEMENTATION_ROADMAP_URL);
  assert.notEqual(
    CALENDLY_BOOKING.talkThroughAnAiQuestionUrl,
    CALENDLY_BOOKING.implementationRoadmapDeepDiveUrl,
  );
});

test('offers one AI-question path on Contact while keeping the paid deep dive business-only', async () => {
  const [contactPage, supportPage] = await Promise.all([
    readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/support/page.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(contactPage, /CALENDLY_BOOKING\.talkThroughAnAiQuestionUrl/);
  assert.match(contactPage, /Talk Through an AI Question/);
  assert.match(contactPage, /develop and refine my approach to AI advising/);
  assert.doesNotMatch(contactPage, /CALENDLY_BOOKING\.implementationRoadmapDeepDiveUrl/);
  assert.match(contactPage, /ContactForm/);
  assert.doesNotMatch(contactPage, /Business AI Strategy Call|AI Coaching Conversation/);

  assert.match(supportPage, /CALENDLY_BOOKING\.implementationRoadmapDeepDiveUrl/);
  assert.match(supportPage, /Implementation Roadmap Deep Dive/);
  assert.match(supportPage, /exclusively for business AI consulting/i);
  assert.doesNotMatch(supportPage, /CALENDLY_BOOKING\.talkThroughAnAiQuestionUrl/);
});

test('carries the existing lead UTM fields into the public booking without forwarding private context', () => {
  for (const bookingUrl of [TALK_THROUGH_AI_QUESTION_URL]) {
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
