import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  HOME_CONTACT_PROMPT_SESSION_KEY,
  createHomeContactPromptSessionGate,
} from '../app/home-contact-prompt-session.ts';

test('claims the homepage contact prompt once per browser session', () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const claimPrompt = createHomeContactPromptSessionGate();

  assert.equal(claimPrompt(storage), true);
  assert.equal(values.get(HOME_CONTACT_PROMPT_SESSION_KEY), 'shown');
  assert.equal(claimPrompt(storage), false);
});

test('falls back to one prompt per page runtime when session storage is unavailable', () => {
  const blockedStorage = {
    getItem: () => {
      throw new Error('storage blocked');
    },
    setItem: () => {
      throw new Error('storage blocked');
    },
  };
  const claimPrompt = createHomeContactPromptSessionGate();

  assert.equal(claimPrompt(blockedStorage), true);
  assert.equal(claimPrompt(blockedStorage), false);

  const claimWithoutStorage = createHomeContactPromptSessionGate();
  assert.equal(claimWithoutStorage(null), true);
  assert.equal(claimWithoutStorage(null), false);
});

test('renders an accessible homepage dialog with call, booking, and writing paths', async () => {
  const [homePage, prompt] = await Promise.all([
    readFile(new URL('../app/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/components/home-contact-prompt.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(homePage, /PUBLIC_CONTACT_PHONE/);
  assert.match(homePage, /CALENDLY_BOOKING\.strategicDiagnosisCallUrl/);
  assert.match(homePage, /<HomeContactPrompt/);

  assert.match(prompt, /<dialog/);
  assert.match(prompt, /aria-labelledby="home-contact-prompt-heading"/);
  assert.match(prompt, /aria-describedby="home-contact-prompt-description"/);
  assert.match(prompt, /showModal\(\)/);
  assert.match(prompt, /href=\{`tel:\$\{phone\.e164\}`\}/);
  assert.match(prompt, /<CalendlyBookingLink/);
  assert.match(prompt, /href="\/contact#write"/);
  assert.match(prompt, /aria-label="Close contact options"/);
});

test('keeps the business number ahead of booking and anchors the written form path', async () => {
  const contactPage = await readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8');

  const phonePosition = contactPage.indexOf('business-phone-heading');
  const bookingPosition = contactPage.indexOf('diagnosis-booking-heading');

  assert.ok(phonePosition >= 0);
  assert.ok(bookingPosition > phonePosition);
  assert.match(contactPage, /className="business-phone-number"/);
  assert.match(contactPage, /id="write"/);
});
