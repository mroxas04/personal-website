import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ATTRIBUTION_MAX_AGE_MS,
  ATTRIBUTION_STORAGE_KEY,
  clearStoredAttribution,
  createContactAttribution,
  parseStoredAttribution,
  readStoredAttribution,
  sanitizeSubmittedAttribution,
} from '../app/contact-attribution.ts';

test('captures allowlisted campaign context without retaining arbitrary query data', () => {
  const capturedAt = Date.UTC(2026, 7, 25, 14, 0, 0);
  const attribution = createContactAttribution({
    search: '?utm_source=linkedin&utm_medium=paid-social&utm_campaign=judgment&utm_content=blue-rule&fbclid=fb-123&email=private%40example.com',
    landingPath: '/writing/papers',
    referrer: 'https://www.linkedin.com/feed/?tracking=secret',
    capturedAt,
  });

  assert.deepEqual(attribution, {
    utmSource: 'linkedin',
    utmMedium: 'paid-social',
    utmCampaign: 'judgment',
    utmContent: 'blue-rule',
    utmTerm: '',
    clickIdType: 'fbclid',
    clickId: 'fb-123',
    landingPath: '/writing/papers',
    referrer: 'https://www.linkedin.com/feed/',
    capturedAt,
  });
  assert.equal(JSON.stringify(attribution).includes('private@example.com'), false);
  assert.equal(JSON.stringify(attribution).includes('tracking=secret'), false);
});

test('recognizes common click identifiers through a fixed allowlist', () => {
  for (const clickIdType of [
    'gclid',
    'gbraid',
    'wbraid',
    'fbclid',
    'msclkid',
    'ttclid',
    'li_fat_id',
  ]) {
    const attribution = createContactAttribution({
      search: `?${clickIdType}=campaign-click`,
      landingPath: '/',
      referrer: '',
      capturedAt: 1,
    });

    assert.equal(attribution.clickIdType, clickIdType);
    assert.equal(attribution.clickId, 'campaign-click');
  }
});

test('handles direct visits as first-party attribution with no invented campaign', () => {
  const attribution = createContactAttribution({
    search: '',
    landingPath: '/contact',
    referrer: '',
    capturedAt: 10,
  });

  assert.equal(attribution.utmSource, '');
  assert.equal(attribution.clickIdType, '');
  assert.equal(attribution.clickId, '');
  assert.equal(attribution.landingPath, '/contact');
  assert.equal(attribution.referrer, '');
});

test('accepts fresh session attribution and rejects stale or malformed values', () => {
  const capturedAt = Date.UTC(2026, 7, 25, 14, 0, 0);
  const stored = JSON.stringify(createContactAttribution({
    search: '?utm_source=newsletter',
    landingPath: '/',
    referrer: '',
    capturedAt,
  }));

  assert.equal(
    parseStoredAttribution(stored, capturedAt + ATTRIBUTION_MAX_AGE_MS - 1)?.utmSource,
    'newsletter',
  );
  assert.equal(parseStoredAttribution(stored, capturedAt + ATTRIBUTION_MAX_AGE_MS), null);
  assert.equal(parseStoredAttribution('{not-json', capturedAt), null);
});

test('removes expired attribution from session storage', () => {
  const removed = [];
  const stored = JSON.stringify(createContactAttribution({
    search: '?utm_source=stale',
    landingPath: '/',
    referrer: '',
    capturedAt: 100,
  }));

  assert.equal(readStoredAttribution({
    getItem: () => stored,
    removeItem: (key) => removed.push(key),
  }, 100 + ATTRIBUTION_MAX_AGE_MS), null);
  assert.deepEqual(removed, [ATTRIBUTION_STORAGE_KEY]);
});

test('clears attribution after use without letting storage errors break the form', () => {
  const removed = [];
  clearStoredAttribution({
    getItem: () => null,
    removeItem: (key) => removed.push(key),
  });
  assert.deepEqual(removed, [ATTRIBUTION_STORAGE_KEY]);

  assert.doesNotThrow(() => clearStoredAttribution({
    getItem: () => null,
    removeItem: () => {
      throw new Error('storage blocked');
    },
  }));
});

test('sanitizes submitted attribution into the contact-request storage contract', () => {
  assert.deepEqual(
    sanitizeSubmittedAttribution({
      utmSource: '  linkedin  ',
      utmMedium: 'paid-social',
      utmCampaign: 'judgment',
      utmContent: 'blue-rule',
      utmTerm: 'ai philosophy',
      clickIdType: 'gclid',
      clickId: 'google-click-123',
      landingPath: '/writing/papers?private=no',
      referrer: 'https://search.example/results?q=private',
      arbitraryIdentifier: 'must-not-survive',
    }),
    {
      utm_source: 'linkedin',
      utm_medium: 'paid-social',
      utm_campaign: 'judgment',
      utm_content: 'blue-rule',
      utm_term: 'ai philosophy',
      click_id_type: 'gclid',
      click_id: 'google-click-123',
      landing_path: '/writing/papers',
      referrer: 'https://search.example/results',
    },
  );

  assert.deepEqual(
    sanitizeSubmittedAttribution({
      clickIdType: 'unknown_network',
      clickId: 'do-not-store',
      landingPath: 'https://attacker.example/path',
      referrer: 'javascript:alert(1)',
    }),
    {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      click_id_type: null,
      click_id: null,
      landing_path: null,
      referrer: null,
    },
  );
});
