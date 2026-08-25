import { env } from 'cloudflare:workers';
import type { ContactRequestStatus } from '../app/contact-request-status';

export type ContactRequestRecord = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  phone: string | null;
  reason: string;
  message: string;
  heard_about: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  click_id_type: string | null;
  click_id: string | null;
  sms_consent_at: number | null;
  sms_consent_version: string | null;
  landing_path: string | null;
  referrer: string | null;
  status: ContactRequestStatus;
  created_at: number;
  email_request_count: number;
};

export type ContactRequestFilters = {
  query?: string;
  status?: ContactRequestStatus | 'all';
  email?: string;
};

const createTableSql = `CREATE TABLE IF NOT EXISTS contact_requests (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  phone TEXT,
  reason TEXT NOT NULL,
  message TEXT NOT NULL,
  heard_about TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  click_id_type TEXT,
  click_id TEXT,
  sms_consent_at INTEGER,
  sms_consent_version TEXT,
  landing_path TEXT,
  referrer TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at INTEGER NOT NULL
)`;

const createIndexSql =
  'CREATE INDEX IF NOT EXISTS contact_requests_created_at_idx ON contact_requests (created_at)';
const createEmailIndexSql =
  'CREATE INDEX IF NOT EXISTS contact_requests_email_created_at_idx ON contact_requests (email, created_at)';
const createStatusIndexSql =
  'CREATE INDEX IF NOT EXISTS contact_requests_status_created_at_idx ON contact_requests (status, created_at)';

export async function ensureContactRequestsTable() {
  const database = env.DB;
  await database.batch([
    database.prepare(createTableSql),
    database.prepare(createIndexSql),
    database.prepare(createEmailIndexSql),
    database.prepare(createStatusIndexSql),
  ]);
  return database;
}

export async function createContactRequest(input: Omit<ContactRequestRecord, 'id' | 'status' | 'created_at' | 'email_request_count'>) {
  const database = await ensureContactRequestsTable();
  await database
    .prepare(
      `INSERT INTO contact_requests
        (id, name, email, organization, phone, reason, message, heard_about, utm_source,
         utm_medium, utm_campaign, utm_content, utm_term, click_id_type, click_id,
         sms_consent_at, sms_consent_version, landing_path, referrer, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    )
    .bind(
      crypto.randomUUID(),
      input.name,
      input.email,
      input.organization,
      input.phone,
      input.reason,
      input.message,
      input.heard_about,
      input.utm_source,
      input.utm_medium,
      input.utm_campaign,
      input.utm_content,
      input.utm_term,
      input.click_id_type,
      input.click_id,
      input.sms_consent_at,
      input.sms_consent_version,
      input.landing_path,
      input.referrer,
      Date.now(),
    )
    .run();
}

export async function getContactDashboardData(filters: ContactRequestFilters = {}) {
  const database = await ensureContactRequestsTable();
  const where: string[] = [];
  const bindings: string[] = [];

  if (filters.email) {
    where.push('cr.email = ?');
    bindings.push(filters.email.trim().toLowerCase());
  }

  if (filters.query) {
    const search = `%${filters.query.trim().toLowerCase()}%`;
    where.push(`(
      LOWER(cr.name) LIKE ? OR LOWER(cr.email) LIKE ? OR
      LOWER(COALESCE(cr.organization, '')) LIKE ? OR LOWER(cr.message) LIKE ? OR
      LOWER(cr.reason) LIKE ?
    )`);
    bindings.push(search, search, search, search, search);
  }

  if (filters.status && filters.status !== 'all') {
    where.push('cr.status = ?');
    bindings.push(filters.status);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const requestsStatement = database.prepare(
    `SELECT cr.id, cr.name, cr.email, cr.organization, cr.phone, cr.reason, cr.message,
            cr.heard_about, cr.utm_source, cr.utm_medium, cr.utm_campaign,
            cr.utm_content, cr.utm_term, cr.click_id_type, cr.click_id,
            cr.sms_consent_at, cr.sms_consent_version, cr.landing_path, cr.referrer,
            cr.status, cr.created_at,
            (SELECT COUNT(*)
             FROM contact_requests AS related
             WHERE related.email = cr.email) AS email_request_count
     FROM contact_requests AS cr
     ${whereSql}
     ORDER BY cr.created_at DESC
     LIMIT 100`,
  );
  const requestsQuery = bindings.length
    ? requestsStatement.bind(...bindings)
    : requestsStatement;

  const [requestsResult, totalsResult] = await Promise.all([
    requestsQuery.all<ContactRequestRecord>(),
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

export async function updateContactRequestStatus(id: string, status: ContactRequestStatus) {
  const database = await ensureContactRequestsTable();
  const result = await database
    .prepare('UPDATE contact_requests SET status = ? WHERE id = ?')
    .bind(status, id)
    .run();

  return (result.meta.changes ?? 0) > 0;
}
