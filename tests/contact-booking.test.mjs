import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildCalendlyBookingUrl } from '../app/calendly-booking.ts';
import { CALENDLY_BOOKING } from '../content/site.ts';

const TALK_THROUGH_AI_QUESTION_URL = 'https://calendly.com/matthewgroxas/talk-through-an-ai-question';
test('publishes one free AI-question conversation as the primary self-serve booking', () => {
  assert.equal(CALENDLY_BOOKING.talkThroughAnAiQuestionUrl, TALK_THROUGH_AI_QUESTION_URL);
  assert.equal(CALENDLY_BOOKING.talkThroughAnAiQuestionDurationMinutes, 45);
  assert.equal('implementationRoadmapDeepDiveUrl' in CALENDLY_BOOKING, false);
  assert.equal('implementationRoadmapDurationMinutes' in CALENDLY_BOOKING, false);
  assert.equal('implementationRoadmapPriceUsd' in CALENDLY_BOOKING, false);
});

test('keeps roadmap work inquiry-only while the free conversation remains self-serve', async () => {
  const [contactPage, supportPage] = await Promise.all([
    readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/support/page.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(contactPage, /CALENDLY_BOOKING\.talkThroughAnAiQuestionUrl/);
  assert.match(contactPage, /Talk Through an AI Question/);
  assert.match(contactPage, /develop and refine my approach to AI advising/);
  assert.match(contactPage, /How the conversation tends to go/);
  assert.match(contactPage, /Start with context/);
  assert.match(contactPage, /Look at the system/);
  assert.match(contactPage, /Name a next move/);
  assert.match(contactPage, /href="\/feedback"/);
  assert.doesNotMatch(contactPage, /CALENDLY_BOOKING\.implementationRoadmapDeepDiveUrl/);
  assert.match(contactPage, /ContactForm/);
  assert.doesNotMatch(contactPage, /Business AI Strategy Call|AI Coaching Conversation/);

  assert.match(supportPage, /Business AI work starts with context/);
  assert.match(supportPage, /href="\/contact#write"/);
  assert.match(supportPage, /Implementation Roadmap remains available by fit/);
  assert.match(supportPage, /scope, timing, deliverable, and price/);
  assert.doesNotMatch(supportPage, /CALENDLY_BOOKING|CalendlyBookingLink/);
  assert.doesNotMatch(supportPage, /Book the Deep Dive|complete payment securely/i);
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

test('keeps the Featured conversion path measurable without replacing first-touch attribution', async () => {
  const homePage = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const contextualUrl = `${TALK_THROUGH_AI_QUESTION_URL}?utm_source=portfolio&utm_medium=website&utm_campaign=featured-work&utm_content=featured-conversation`;

  assert.match(homePage, /featuredConversationUrl/);
  assert.match(homePage, /Book a free conversation/);
  assert.match(homePage, /href="\/contact#write"/);

  const directVisitorUrl = new URL(buildCalendlyBookingUrl(contextualUrl, {}));
  assert.equal(directVisitorUrl.searchParams.get('utm_source'), 'portfolio');
  assert.equal(directVisitorUrl.searchParams.get('utm_campaign'), 'featured-work');
  assert.equal(directVisitorUrl.searchParams.get('utm_content'), 'featured-conversation');

  const referredVisitorUrl = new URL(buildCalendlyBookingUrl(contextualUrl, {
    utmSource: 'linkedin',
    utmMedium: 'social',
    utmCampaign: 'profile',
    utmContent: 'launch-post',
  }));
  assert.equal(referredVisitorUrl.searchParams.get('utm_source'), 'linkedin');
  assert.equal(referredVisitorUrl.searchParams.get('utm_medium'), 'social');
  assert.equal(referredVisitorUrl.searchParams.get('utm_campaign'), 'profile');
  assert.equal(referredVisitorUrl.searchParams.get('utm_content'), 'launch-post');
});
