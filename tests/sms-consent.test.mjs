import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SMS_CONSENT_VERSION,
  parseSmsConsentSubmission,
} from '../app/sms-consent.ts';

test('stores a mobile number without inventing consent when opt-in is unchecked', () => {
  assert.deepEqual(
    parseSmsConsentSubmission({ phone: '+1 (317) 555-0182' }, 1_777_777_777_777),
    {
      value: {
        phone: '+1 (317) 555-0182',
        sms_consent_at: null,
        sms_consent_version: null,
      },
    },
  );
});

test('records server time and disclosure version only for an affirmative opt-in', () => {
  const now = 1_777_777_777_777;
  assert.deepEqual(
    parseSmsConsentSubmission({
      phone: '+13175550182',
      smsConsent: 'yes',
      smsConsentAt: 123,
      smsConsentVersion: 'attacker-controlled',
    }, now),
    {
      value: {
        phone: '+13175550182',
        sms_consent_at: now,
        sms_consent_version: SMS_CONSENT_VERSION,
      },
    },
  );
});

test('allows contact submission with no mobile number and no SMS consent', () => {
  assert.deepEqual(
    parseSmsConsentSubmission({}, 1_777_777_777_777),
    {
      value: {
        phone: null,
        sms_consent_at: null,
        sms_consent_version: null,
      },
    },
  );
});

test('requires a valid mobile number only when one is supplied or consent is checked', () => {
  assert.deepEqual(
    parseSmsConsentSubmission({ smsConsent: 'yes' }, 1_777_777_777_777),
    { error: 'Add a mobile number before opting in to SMS follow-up.' },
  );
  assert.deepEqual(
    parseSmsConsentSubmission({ phone: 'not-a-phone' }, 1_777_777_777_777),
    { error: 'Enter a valid mobile number or leave that field blank.' },
  );
});
