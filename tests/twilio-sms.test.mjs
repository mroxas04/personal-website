import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';

import {
  SMS_HELP_MESSAGE,
  SMS_OPT_IN_KEYWORDS,
  SMS_OPT_IN_MESSAGE,
  handleTwilioSmsWebhook,
} from '../app/twilio-sms.ts';

const AUTH_TOKEN = 'test-auth-token';
const WEBHOOK_URL = 'https://portfolio.mroxas.chatgpt.site/api/sms/inbound';

function signatureFor(parameters) {
  const signedValue = [...parameters.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .reduce((value, [name, parameter]) => `${value}${name}${parameter}`, WEBHOOK_URL);

  return createHmac('sha1', AUTH_TOKEN).update(signedValue).digest('base64');
}

function signedRequest(parameters, signature = signatureFor(parameters)) {
  return new Request('http://localhost:3000/api/sms/inbound', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-twilio-signature': signature,
    },
    body: parameters.toString(),
  });
}

async function submit(parameters, signature) {
  return handleTwilioSmsWebhook(signedRequest(parameters, signature), {
    authToken: AUTH_TOKEN,
    webhookUrl: WEBHOOK_URL,
  });
}

test('keeps the Via Text opt-in keyword set exact and replies concise', () => {
  assert.deepEqual(SMS_OPT_IN_KEYWORDS, ['START', 'YES', 'UNSTOP']);
  assert.ok(SMS_OPT_IN_MESSAGE.length <= 320);
  assert.ok(SMS_HELP_MESSAGE.length <= 320);
});

test('accepts a valid signature and returns the factual HELP response case-insensitively', async () => {
  const response = await submit(new URLSearchParams({
    Body: '  hElP  ',
    From: '+13175550182',
    To: '+13175550183',
  }));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/xml; charset=utf-8');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(await response.text(), `<Response><Message>${SMS_HELP_MESSAGE}</Message></Response>`);
  assert.match(SMS_HELP_MESSAGE, /Matthew Roxas/);
  assert.match(SMS_HELP_MESSAGE, /one-to-one follow-up about website inquiries/i);
  assert.match(SMS_HELP_MESSAGE, /frequency varies/i);
  assert.match(SMS_HELP_MESSAGE, /message and data rates may apply/i);
  assert.match(SMS_HELP_MESSAGE, /matthewgroxas@gmail\.com/i);
});

for (const keyword of SMS_OPT_IN_KEYWORDS) {
  test(`returns the same enrollment confirmation for ${keyword} case-insensitively`, async () => {
    const response = await submit(new URLSearchParams({
      Body: `  ${keyword.toLowerCase()}  `,
      From: '+13175550182',
      To: '+13175550183',
    }));

    assert.equal(response.status, 200);
    assert.equal(await response.text(), `<Response><Message>${SMS_OPT_IN_MESSAGE}</Message></Response>`);
    assert.match(SMS_OPT_IN_MESSAGE, /Matthew Roxas/);
    assert.match(SMS_OPT_IN_MESSAGE, /one-to-one follow-up about website inquiries/i);
    assert.match(SMS_OPT_IN_MESSAGE, /frequency varies/i);
    assert.match(SMS_OPT_IN_MESSAGE, /message and data rates may apply/i);
    assert.match(SMS_OPT_IN_MESSAGE, /HELP/);
    assert.match(SMS_OPT_IN_MESSAGE, /STOP/);
  });
}

test('returns empty TwiML for STOP and does not claim application-owned opt-out state', async () => {
  const response = await submit(new URLSearchParams({ Body: 'STOP' }));

  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<Response></Response>');
});

test('returns empty TwiML for a non-keyword message', async () => {
  const response = await submit(new URLSearchParams({ Body: 'Could we schedule a call?' }));

  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<Response></Response>');
});

test('does not duplicate a keyword reply that Twilio Advanced Opt-Out already sent', async () => {
  for (const optOutType of ['HELP', 'START', 'STOP']) {
    const parameters = new URLSearchParams({ Body: optOutType, OptOutType: optOutType });
    const response = await submit(parameters);

    assert.equal(response.status, 200);
    assert.equal(await response.text(), '<Response></Response>');
  }
});

test('rejects an invalid Twilio signature without returning an SMS response', async () => {
  const response = await submit(new URLSearchParams({ Body: 'HELP' }), 'forged-signature');

  assert.equal(response.status, 403);
  assert.equal(await response.text(), 'Forbidden');
});

test('rejects a missing signature without consuming the request body', async () => {
  const request = new Request('http://localhost:3000/api/sms/inbound', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ Body: 'HELP' }),
  });
  const response = await handleTwilioSmsWebhook(request, {
    authToken: AUTH_TOKEN,
    webhookUrl: WEBHOOK_URL,
  });

  assert.equal(response.status, 403);
  assert.equal(request.bodyUsed, false);
});

test('rejects an oversized form body before signature verification', async () => {
  const request = signedRequest(new URLSearchParams({ Body: 'x'.repeat(70_000) }), 'unused');
  const response = await handleTwilioSmsWebhook(request, {
    authToken: AUTH_TOKEN,
    webhookUrl: WEBHOOK_URL,
  });

  assert.equal(response.status, 413);
  assert.equal(await response.text(), 'Payload Too Large');
});

test('fails closed when webhook verification configuration is absent', async () => {
  const parameters = new URLSearchParams({ Body: 'HELP' });
  const request = signedRequest(parameters);
  const response = await handleTwilioSmsWebhook(request, {
    authToken: '',
    webhookUrl: WEBHOOK_URL,
  });

  assert.equal(response.status, 503);
  assert.equal(await response.text(), 'SMS webhook unavailable');
});

test('rejects payload formats outside the signed form-encoded Twilio contract', async () => {
  const request = new Request('http://localhost:3000/api/sms/inbound', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-twilio-signature': 'unused',
    },
    body: JSON.stringify({ Body: 'HELP' }),
  });
  const response = await handleTwilioSmsWebhook(request, {
    authToken: AUTH_TOKEN,
    webhookUrl: WEBHOOK_URL,
  });

  assert.equal(response.status, 415);
});
