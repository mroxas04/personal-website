import { getChatGPTUser, isDashboardOwner } from '../../../chatgpt-auth';
import { isContactRequestStatus } from '../../../contact-request-status';
import {
  getContactDashboardData,
  updateContactRequestStatus,
} from '../../../../db/contact-requests';

function clean(value: string | null, maxLength: number) {
  return value?.trim().slice(0, maxLength) ?? '';
}

async function isAuthorized() {
  const user = await getChatGPTUser();
  return isDashboardOwner(user);
}

export async function GET(request: Request) {
  if (!(await isAuthorized())) {
    return Response.json({ error: 'Not found.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const query = clean(url.searchParams.get('q'), 120);
    const email = clean(url.searchParams.get('email'), 180).toLowerCase();
    const statusCandidate = clean(url.searchParams.get('status'), 40);
    const status = isContactRequestStatus(statusCandidate) ? statusCandidate : 'all';
    const data = await getContactDashboardData({ query, email, status });

    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Dashboard search failed', error);
    return Response.json({ error: 'The inbox could not be searched just now.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAuthorized())) {
    return Response.json({ error: 'Not found.' }, { status: 404 });
  }

  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Cross-site updates are not allowed.' }, { status: 403 });
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'JSON is required.' }, { status: 415 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id.trim().slice(0, 100) : '';
    const status = typeof body.status === 'string' ? body.status : '';

    if (!id || !isContactRequestStatus(status)) {
      return Response.json({ error: 'Choose a valid request status.' }, { status: 400 });
    }

    const updated = await updateContactRequestStatus(id, status);
    if (!updated) return Response.json({ error: 'Request not found.' }, { status: 404 });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Dashboard status update failed', error);
    return Response.json({ error: 'The status could not be saved just now.' }, { status: 500 });
  }
}
