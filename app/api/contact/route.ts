import { env } from 'cloudflare:workers';
import { createContactRequest } from '../../../db/contact-requests';
import { sanitizeSubmittedAttribution } from '../../contact-attribution';
import { parseSmsConsentSubmission } from '../../sms-consent';

const allowedReasons = new Set([
  'philosophy-ai',
  'consulting',
  'technical',
  'teaching',
  'other',
]);

const allowedHeardAbout = new Set([
  'linkedin',
  'search',
  'friend-colleague',
  'orr-fellowship',
  'valve-meter',
  'purdue',
  'event-talk',
  'other',
]);

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (clean(body.website, 200)) {
      return Response.json({ ok: true });
    }

    const name = clean(body.name, 120);
    const email = clean(body.email, 180).toLowerCase();
    const organization = clean(body.organization, 180);
    const reason = clean(body.reason, 60);
    const message = clean(body.message, 2400);
    const heardAboutCandidate = clean(body.heardAbout, 120);
    const heardAbout = allowedHeardAbout.has(heardAboutCandidate) ? heardAboutCandidate : '';
    const attribution = sanitizeSubmittedAttribution(body);
    const smsConsent = parseSmsConsentSubmission(body);

    if ('error' in smsConsent) {
      return Response.json({ error: smsConsent.error }, { status: 400 });
    }

    if (!name || !email || !allowedReasons.has(reason) || message.length < 20) {
      return Response.json(
        { error: 'Please complete the required fields and add a little more context.' },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!env.DB) throw new Error('D1 binding DB is unavailable.');
    await createContactRequest({
      name,
      email,
      organization: organization || null,
      reason,
      message,
      heard_about: heardAbout || null,
      ...attribution,
      ...smsConsent.value,
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Contact request failed', error);
    return Response.json(
      { error: 'Your note could not be saved just now. Please try again.' },
      { status: 500 },
    );
  }
}
