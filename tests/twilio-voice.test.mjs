import assert from 'node:assert/strict';
import test from 'node:test';
import twilio from 'twilio';

import { handleTwilioVoiceWebhook } from '../app/twilio-voice.ts';

const AUTH_TOKEN = 'test-auth-token';
const FORWARDING_NUMBER = '+13175550100';
const WEBHOOK_URL = 'https://portfolio.mroxas.chatgpt.site/api/voice/inbound';

function toTwilioParameters(parameters) {
  const result = {};
  for (const [name, value] of parameters) {
    const existing = result[name];
    if (existing === undefined) result[name] = value;
    else if (Array.isArray(existing)) existing.push(value);
    else result[name] = [existing, value];
  }
  return result;
}

function signatureFor(parameters, webhookUrl = WEBHOOK_URL) {
  return twilio.getExpectedTwilioSignature(
    AUTH_TOKEN,
    webhookUrl,
    toTwilioParameters(parameters),
  );
}

function signedRequest(parameters, signature = signatureFor(parameters)) {
  return new Request('http://localhost:3000/api/voice/inbound', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-twilio-signature': signature,
    },
    body: parameters.toString(),
  });
}

function settings(overrides = {}) {
  return {
    authToken: AUTH_TOKEN,
    forwardingNumber: FORWARDING_NUMBER,
    webhookUrl: WEBHOOK_URL,
    ...overrides,
  };
}

test('accepts a valid Twilio signature and returns only a Dial instruction', async () => {
  const parameters = new URLSearchParams({
    AccountSid: 'AC00000000000000000000000000000000',
    CallSid: 'CA00000000000000000000000000000000',
    Direction: 'inbound',
    From: '+13175550101',
    To: '+13175550102',
  });
  const response = await handleTwilioVoiceWebhook(signedRequest(parameters), settings());
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/xml; charset=utf-8');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(
    body,
    `<?xml version="1.0" encoding="UTF-8"?><Response><Dial>${FORWARDING_NUMBER}</Dial></Response>`,
  );
  assert.doesNotMatch(body, /Record|Gather|Say|action=/i);
});

test('rejects a forged signature without returning TwiML', async () => {
  const response = await handleTwilioVoiceWebhook(
    signedRequest(new URLSearchParams({ CallSid: 'CA00000000000000000000000000000000' }), 'forged'),
    settings(),
  );

  assert.equal(response.status, 403);
  assert.equal(await response.text(), 'Forbidden');
});

test('rejects a missing signature without consuming the request body', async () => {
  const request = new Request('http://localhost:3000/api/voice/inbound', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ CallSid: 'CA00000000000000000000000000000000' }),
  });
  const response = await handleTwilioVoiceWebhook(request, settings());

  assert.equal(response.status, 403);
  assert.equal(request.bodyUsed, false);
});

test('validates against the configured public URL instead of request host headers', async () => {
  const parameters = new URLSearchParams({ CallSid: 'CA00000000000000000000000000000000' });
  const attackerSignature = signatureFor(
    parameters,
    'https://attacker.example/api/voice/inbound',
  );
  const response = await handleTwilioVoiceWebhook(
    signedRequest(parameters, attackerSignature),
    settings(),
  );

  assert.equal(response.status, 403);
  assert.equal(await response.text(), 'Forbidden');
});

for (const overrides of [
  { authToken: '' },
  { forwardingNumber: '' },
  { forwardingNumber: 'not-e164' },
  { webhookUrl: '' },
  { webhookUrl: 'http://portfolio.example/api/voice/inbound' },
]) {
  test(`fails closed for unusable voice settings: ${Object.keys(overrides)[0]}`, async () => {
    const parameters = new URLSearchParams({ CallSid: 'CA00000000000000000000000000000000' });
    const response = await handleTwilioVoiceWebhook(
      signedRequest(parameters),
      settings(overrides),
    );

    assert.equal(response.status, 503);
    assert.equal(await response.text(), 'Voice webhook unavailable');
  });
}

test('never accepts a request-supplied destination in place of protected configuration', async () => {
  const parameters = new URLSearchParams({
    CallSid: 'CA00000000000000000000000000000000',
    forwardingNumber: FORWARDING_NUMBER,
  });
  const response = await handleTwilioVoiceWebhook(
    signedRequest(parameters),
    settings({ forwardingNumber: '' }),
  );

  assert.equal(response.status, 503);
  assert.equal(await response.text(), 'Voice webhook unavailable');
});

test('rejects payload formats outside Twilio form-encoded webhooks', async () => {
  const request = new Request('http://localhost:3000/api/voice/inbound', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-twilio-signature': 'unused',
    },
    body: JSON.stringify({ CallSid: 'CA00000000000000000000000000000000' }),
  });
  const response = await handleTwilioVoiceWebhook(request, settings());

  assert.equal(response.status, 415);
  assert.equal(await response.text(), 'Unsupported Media Type');
});

test('rejects an oversized form body before signature validation', async () => {
  const request = signedRequest(
    new URLSearchParams({ CallSid: 'CA00000000000000000000000000000000', Extra: 'x'.repeat(70_000) }),
    'unused',
  );
  const response = await handleTwilioVoiceWebhook(request, settings());

  assert.equal(response.status, 413);
  assert.equal(await response.text(), 'Payload Too Large');
});
