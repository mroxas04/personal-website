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
  (table) => [index('contact_requests_created_at_idx').on(table.createdAt)],
);
