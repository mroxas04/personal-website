import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const contactRequests = sqliteTable(
  'contact_requests',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    organization: text('organization'),
    reason: text('reason').notNull(),
    message: text('message').notNull(),
    heardAbout: text('heard_about'),
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    utmContent: text('utm_content'),
    utmTerm: text('utm_term'),
    landingPath: text('landing_path'),
    referrer: text('referrer'),
    status: text('status').notNull().default('new'),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    index('contact_requests_created_at_idx').on(table.createdAt),
    index('contact_requests_email_created_at_idx').on(table.email, table.createdAt),
    index('contact_requests_status_created_at_idx').on(table.status, table.createdAt),
  ],
);

export const consultationFeedback = sqliteTable(
  'consultation_feedback',
  {
    id: text('id').primaryKey(),
    contactRequestId: text('contact_request_id').references(() => contactRequests.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    organization: text('organization'),
    rating: integer('rating').notNull(),
    outcome: text('outcome').notNull(),
    testimonial: text('testimonial'),
    testimonialPermission: text('testimonial_permission').notNull().default('private'),
    referralIntent: text('referral_intent').notNull().default('maybe'),
    canFollowUp: integer('can_follow_up').notNull().default(1),
    status: text('status').notNull().default('new'),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    index('consultation_feedback_email_created_at_idx').on(table.email, table.createdAt),
    index('consultation_feedback_status_created_at_idx').on(table.status, table.createdAt),
    index('consultation_feedback_contact_request_idx').on(table.contactRequestId),
  ],
);

export const supportContributions = sqliteTable(
  'support_contributions',
  {
    id: text('id').primaryKey(),
    contactRequestId: text('contact_request_id').references(() => contactRequests.id, { onDelete: 'set null' }),
    supporterName: text('supporter_name').notNull(),
    supporterEmail: text('supporter_email'),
    supportType: text('support_type').notNull(),
    amountCents: integer('amount_cents'),
    impactPoints: integer('impact_points').notNull().default(1),
    note: text('note'),
    occurredAt: integer('occurred_at').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    index('support_contributions_email_occurred_at_idx').on(table.supporterEmail, table.occurredAt),
    index('support_contributions_type_occurred_at_idx').on(table.supportType, table.occurredAt),
    index('support_contributions_contact_request_idx').on(table.contactRequestId),
  ],
);
