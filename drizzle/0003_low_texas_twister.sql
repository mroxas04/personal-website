CREATE INDEX `contact_requests_email_created_at_idx` ON `contact_requests` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX `contact_requests_status_created_at_idx` ON `contact_requests` (`status`,`created_at`);--> statement-breakpoint
PRAGMA optimize;
