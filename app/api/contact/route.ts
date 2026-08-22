import { env } from 'cloudflare:workers';

const allowedReasons = new Set([
  'philosophy-ai',
  'consulting',
  'technical',
  'teaching',
  'other',
]);

const contactTableSql = `CREATE TABLE IF NOT EXISTS contact_requests (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  reason TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at INTEGER NOT NULL
)`;

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

    if (!name || !email || !allowedReasons.has(reason) || message.length < 20) {
      return Response.json(
        { error: 'Please complete the required fields and add a little more context.' },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const database = env.DB;
    await database.prepare(contactTableSql).run();
    await database
      .prepare(
        `INSERT INTO contact_requests
          (id, name, email, organization, reason, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`,
      )
      .bind(
        crypto.randomUUID(),
        name,
        email,
        organization || null,
        reason,
        message,
        Date.now(),
      )
      .run();

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Contact request failed', error);
    return Response.json(
      { error: 'Your note could not be saved just now. Please try again.' },
      { status: 500 },
    );
  }
}
