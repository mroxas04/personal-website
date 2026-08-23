import { env } from 'cloudflare:workers';
import { createContactRequest } from '../../../db/contact-requests';

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

function cleanReferrer(value: unknown) {
  const candidate = clean(value, 500);
  if (!candidate) return '';

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return '';
  }
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
    const utmSource = clean(body.utmSource, 200);
    const utmMedium = clean(body.utmMedium, 200);
    const utmCampaign = clean(body.utmCampaign, 200);
    const utmContent = clean(body.utmContent, 200);
    const utmTerm = clean(body.utmTerm, 200);
    const landingPathCandidate = clean(body.landingPath, 300);
    const landingPath = landingPathCandidate.startsWith('/') ? landingPathCandidate : '';
    const referrer = cleanReferrer(body.referrer);

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
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_content: utmContent || null,
      utm_term: utmTerm || null,
      landing_path: landingPath || null,
      referrer: referrer || null,
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
