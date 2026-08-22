import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const contactRequests = sqliteTable('contact_requests', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  organization: text('organization'),
  reason: text('reason').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: integer('created_at').notNull(),
});
