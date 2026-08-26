import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PUBLIC_CONTACT_PHONE,
  formatPublicContactPhone,
  getPublicContactPhone,
  normalizePublicContactPhone,
} from '../content/site.ts';

test('stores the approved public business number in normalized E.164 format', () => {
  assert.equal(PUBLIC_CONTACT_PHONE.e164, '+13179786815');
  assert.equal(
    normalizePublicContactPhone(PUBLIC_CONTACT_PHONE.e164),
    PUBLIC_CONTACT_PHONE.e164,
  );
});

test('formats the approved US business number for display without changing the call target', () => {
  assert.equal(formatPublicContactPhone(PUBLIC_CONTACT_PHONE.e164), '(317) 978-6815');
  assert.deepEqual(getPublicContactPhone(PUBLIC_CONTACT_PHONE.e164), {
    e164: '+13179786815',
    display: '(317) 978-6815',
  });
});

test('preserves non-US E.164 numbers for display', () => {
  assert.equal(formatPublicContactPhone('+442071838750'), '+442071838750');
});

test('fails closed instead of rendering a malformed public phone link', () => {
  assert.equal(normalizePublicContactPhone('317-555-0100'), null);
  assert.equal(normalizePublicContactPhone(null), null);
  assert.equal(normalizePublicContactPhone(' +13175550100 '), '+13175550100');
  assert.equal(getPublicContactPhone('317-555-0100'), null);
});
