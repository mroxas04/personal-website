import { getChatGPTUser, isDashboardOwner } from '../../../chatgpt-auth';
import {
  FEEDBACK_STATUSES,
  includesValue,
  SUPPORT_TYPES,
} from '../../../support-types';
import {
  createSupportContribution,
  getSupportDashboardData,
  updateFeedbackStatus,
} from '../../../../db/support';

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function isAuthorized() {
  const user = await getChatGPTUser();
  return isDashboardOwner(user);
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

function parseAmountCents(value: string) {
  if (!value) return null;
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(value)) return Number.NaN;
  return Math.round(Number(value) * 100);
}

export async function GET() {
  if (!(await isAuthorized())) return Response.json({ error: 'Not found.' }, { status: 404 });

  try {
    return Response.json(await getSupportDashboardData(), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Support dashboard read failed', error);
    return Response.json({ error: 'Support data could not be loaded just now.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthorized())) return Response.json({ error: 'Not found.' }, { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Cross-site updates are not allowed.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'JSON is required.' }, { status: 415 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const supporterName = clean(body.supporterName, 120);
    const supporterEmail = clean(body.supporterEmail, 180).toLowerCase();
    const supportType = clean(body.supportType, 40);
    const amountCents = parseAmountCents(clean(body.amount, 30));
    const impactPoints = Number.parseInt(clean(body.impactPoints, 2), 10);
    const note = clean(body.note, 800);
    const occurredDate = clean(body.occurredDate, 10);
    const occurredAt = occurredDate ? Date.parse(`${occurredDate}T12:00:00Z`) : Date.now();

    if (!supporterName || !includesValue(SUPPORT_TYPES, supportType) || !Number.isInteger(impactPoints) || impactPoints < 1 || impactPoints > 5 || !Number.isFinite(occurredAt)) {
      return Response.json({ error: 'Complete the supporter, type, date, and impact fields.' }, { status: 400 });
    }
    if (supporterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supporterEmail)) {
      return Response.json({ error: 'Enter a valid email or leave it blank.' }, { status: 400 });
    }
    if (Number.isNaN(amountCents) || ((supportType === 'venmo' || supportType === 'zelle') && amountCents === null)) {
      return Response.json({ error: 'Enter the received amount for a monetary contribution.' }, { status: 400 });
    }

    await createSupportContribution({
      supporterName,
      supporterEmail: supporterEmail || null,
      supportType,
      amountCents,
      impactPoints,
      note: note || null,
      occurredAt,
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Support contribution create failed', error);
    return Response.json({ error: 'The support entry could not be saved just now.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAuthorized())) return Response.json({ error: 'Not found.' }, { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Cross-site updates are not allowed.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'JSON is required.' }, { status: 415 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = clean(body.id, 100);
    const status = clean(body.status, 30);
    if (!id || !includesValue(FEEDBACK_STATUSES, status)) {
      return Response.json({ error: 'Choose a valid feedback status.' }, { status: 400 });
    }

    const updated = await updateFeedbackStatus(id, status);
    if (!updated) return Response.json({ error: 'Feedback not found.' }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Feedback status update failed', error);
    return Response.json({ error: 'The feedback status could not be saved.' }, { status: 500 });
  }
}
