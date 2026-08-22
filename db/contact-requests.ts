import { env } from 'cloudflare:workers';

export type ContactRequestRecord = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  reason: string;
  message: string;
  status: string;
  created_at: number;
};

const createTableSql = `CREATE TABLE IF NOT EXISTS contact_requests (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  reason TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at INTEGER NOT NULL
)`;

const createIndexSql =
  'CREATE INDEX IF NOT EXISTS contact_requests_created_at_idx ON contact_requests (created_at)';

export async function ensureContactRequestsTable() {
  const database = env.DB;
  await database.batch([
    database.prepare(createTableSql),
    database.prepare(createIndexSql),
  ]);
  return database;
}

export async function createContactRequest(input: Omit<ContactRequestRecord, 'id' | 'status' | 'created_at'>) {
  const database = await ensureContactRequestsTable();
  await database
    .prepare(
      `INSERT INTO contact_requests
        (id, name, email, organization, reason, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`,
    )
    .bind(
      crypto.randomUUID(),
      input.name,
      input.email,
      input.organization,
      input.reason,
      input.message,
      Date.now(),
    )
    .run();
}

export async function getContactDashboardData() {
  const database = await ensureContactRequestsTable();
  const [requestsResult, totalsResult] = await Promise.all([
    database
      .prepare(
        `SELECT id, name, email, organization, reason, message, status, created_at
         FROM contact_requests
         ORDER BY created_at DESC
         LIMIT 100`,
      )
      .all<ContactRequestRecord>(),
    database
      .prepare(
        `SELECT
           COUNT(*) AS total,
           SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS unread,
           SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS last_seven_days
         FROM contact_requests`,
      )
      .bind(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .first<{ total: number; unread: number | null; last_seven_days: number | null }>(),
  ]);

  return {
    requests: requestsResult.results ?? [],
    totals: {
      total: totalsResult?.total ?? 0,
      unread: totalsResult?.unread ?? 0,
      lastSevenDays: totalsResult?.last_seven_days ?? 0,
    },
  };
}
