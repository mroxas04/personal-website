import type {
  FeedbackStatus,
  ReferralIntent,
  SupportType,
  TestimonialPermission,
} from '../app/support-types';
import { ensureContactRequestsTable } from './contact-requests';

export type ConsultationFeedbackRecord = {
  id: string;
  contact_request_id: string | null;
  name: string;
  email: string;
  organization: string | null;
  rating: number;
  outcome: string;
  testimonial: string | null;
  testimonial_permission: TestimonialPermission;
  referral_intent: ReferralIntent;
  can_follow_up: number;
  status: FeedbackStatus;
  created_at: number;
};

export type SupportContributionRecord = {
  id: string;
  contact_request_id: string | null;
  supporter_name: string;
  supporter_email: string | null;
  support_type: SupportType;
  amount_cents: number | null;
  impact_points: number;
  note: string | null;
  occurred_at: number;
  created_at: number;
};

export type SupporterLeaderboardRecord = {
  supporter_key: string;
  supporter_name: string;
  supporter_email: string | null;
  contribution_count: number;
  impact_points: number;
  amount_cents: number;
  last_support_at: number;
};

const createFeedbackTableSql = `CREATE TABLE IF NOT EXISTS consultation_feedback (
  id TEXT PRIMARY KEY NOT NULL,
  contact_request_id TEXT REFERENCES contact_requests(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  rating INTEGER NOT NULL,
  outcome TEXT NOT NULL,
  testimonial TEXT,
  testimonial_permission TEXT NOT NULL DEFAULT 'private',
  referral_intent TEXT NOT NULL DEFAULT 'maybe',
  can_follow_up INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'new',
  created_at INTEGER NOT NULL
)`;

const createContributionsTableSql = `CREATE TABLE IF NOT EXISTS support_contributions (
  id TEXT PRIMARY KEY NOT NULL,
  contact_request_id TEXT REFERENCES contact_requests(id) ON DELETE SET NULL,
  supporter_name TEXT NOT NULL,
  supporter_email TEXT,
  support_type TEXT NOT NULL,
  amount_cents INTEGER,
  impact_points INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  occurred_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
)`;

const supportIndexSql = [
  'CREATE INDEX IF NOT EXISTS consultation_feedback_email_created_at_idx ON consultation_feedback (email, created_at)',
  'CREATE INDEX IF NOT EXISTS consultation_feedback_status_created_at_idx ON consultation_feedback (status, created_at)',
  'CREATE INDEX IF NOT EXISTS consultation_feedback_contact_request_idx ON consultation_feedback (contact_request_id)',
  'CREATE INDEX IF NOT EXISTS support_contributions_email_occurred_at_idx ON support_contributions (supporter_email, occurred_at)',
  'CREATE INDEX IF NOT EXISTS support_contributions_type_occurred_at_idx ON support_contributions (support_type, occurred_at)',
  'CREATE INDEX IF NOT EXISTS support_contributions_contact_request_idx ON support_contributions (contact_request_id)',
] as const;

export async function ensureSupportTables() {
  const database = await ensureContactRequestsTable();
  await database.batch([
    database.prepare(createFeedbackTableSql),
    database.prepare(createContributionsTableSql),
    ...supportIndexSql.map((statement) => database.prepare(statement)),
  ]);
  return database;
}

export async function createConsultationFeedback(input: {
  name: string;
  email: string;
  organization: string | null;
  rating: number;
  outcome: string;
  testimonial: string | null;
  testimonialPermission: TestimonialPermission;
  referralIntent: ReferralIntent;
  canFollowUp: boolean;
}) {
  const database = await ensureSupportTables();
  const contact = await database
    .prepare('SELECT id FROM contact_requests WHERE email = ? ORDER BY created_at DESC LIMIT 1')
    .bind(input.email)
    .first<{ id: string }>();

  await database
    .prepare(
      `INSERT INTO consultation_feedback
        (id, contact_request_id, name, email, organization, rating, outcome,
         testimonial, testimonial_permission, referral_intent, can_follow_up,
         status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    )
    .bind(
      crypto.randomUUID(),
      contact?.id ?? null,
      input.name,
      input.email,
      input.organization,
      input.rating,
      input.outcome,
      input.testimonial,
      input.testimonialPermission,
      input.referralIntent,
      input.canFollowUp ? 1 : 0,
      Date.now(),
    )
    .run();
}

export async function createSupportContribution(input: {
  supporterName: string;
  supporterEmail: string | null;
  supportType: SupportType;
  amountCents: number | null;
  impactPoints: number;
  note: string | null;
  occurredAt: number;
}) {
  const database = await ensureSupportTables();
  const contact = input.supporterEmail
    ? await database
      .prepare('SELECT id FROM contact_requests WHERE email = ? ORDER BY created_at DESC LIMIT 1')
      .bind(input.supporterEmail)
      .first<{ id: string }>()
    : null;

  await database
    .prepare(
      `INSERT INTO support_contributions
        (id, contact_request_id, supporter_name, supporter_email, support_type,
         amount_cents, impact_points, note, occurred_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      crypto.randomUUID(),
      contact?.id ?? null,
      input.supporterName,
      input.supporterEmail,
      input.supportType,
      input.amountCents,
      input.impactPoints,
      input.note,
      input.occurredAt,
      Date.now(),
    )
    .run();
}

export async function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  const database = await ensureSupportTables();
  const result = await database
    .prepare('UPDATE consultation_feedback SET status = ? WHERE id = ?')
    .bind(status, id)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function getSupportDashboardData() {
  const database = await ensureSupportTables();
  const [contributions, feedback, leaderboard, contributionStats, feedbackStats] = await Promise.all([
    database.prepare(
      `SELECT id, contact_request_id, supporter_name, supporter_email, support_type,
              amount_cents, impact_points, note, occurred_at, created_at
       FROM support_contributions
       ORDER BY occurred_at DESC
       LIMIT 50`,
    ).all<SupportContributionRecord>(),
    database.prepare(
      `SELECT id, contact_request_id, name, email, organization, rating, outcome,
              testimonial, testimonial_permission, referral_intent, can_follow_up,
              status, created_at
       FROM consultation_feedback
       ORDER BY created_at DESC
       LIMIT 50`,
    ).all<ConsultationFeedbackRecord>(),
    database.prepare(
      `SELECT
         COALESCE(NULLIF(LOWER(TRIM(supporter_email)), ''), LOWER(TRIM(supporter_name))) AS supporter_key,
         MAX(supporter_name) AS supporter_name,
         MAX(supporter_email) AS supporter_email,
         COUNT(*) AS contribution_count,
         SUM(impact_points) AS impact_points,
         COALESCE(SUM(amount_cents), 0) AS amount_cents,
         MAX(occurred_at) AS last_support_at
       FROM support_contributions
       GROUP BY supporter_key
       ORDER BY impact_points DESC, amount_cents DESC, last_support_at DESC
       LIMIT 25`,
    ).all<SupporterLeaderboardRecord>(),
    database.prepare(
      `SELECT COUNT(*) AS contribution_count,
              COALESCE(SUM(amount_cents), 0) AS amount_cents,
              COUNT(DISTINCT COALESCE(NULLIF(LOWER(TRIM(supporter_email)), ''), LOWER(TRIM(supporter_name)))) AS supporter_count
       FROM support_contributions`,
    ).first<{ contribution_count: number; amount_cents: number; supporter_count: number }>(),
    database.prepare(
      `SELECT COUNT(*) AS feedback_count,
              SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_feedback_count
       FROM consultation_feedback`,
    ).first<{ feedback_count: number; new_feedback_count: number | null }>(),
  ]);

  return {
    contributions: contributions.results ?? [],
    feedback: feedback.results ?? [],
    leaderboard: leaderboard.results ?? [],
    stats: {
      contributionCount: contributionStats?.contribution_count ?? 0,
      amountCents: contributionStats?.amount_cents ?? 0,
      supporterCount: contributionStats?.supporter_count ?? 0,
      feedbackCount: feedbackStats?.feedback_count ?? 0,
      newFeedbackCount: feedbackStats?.new_feedback_count ?? 0,
    },
  };
}
