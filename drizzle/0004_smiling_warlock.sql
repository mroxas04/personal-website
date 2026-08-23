CREATE TABLE `consultation_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_request_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`organization` text,
	`rating` integer NOT NULL,
	`outcome` text NOT NULL,
	`testimonial` text,
	`testimonial_permission` text DEFAULT 'private' NOT NULL,
	`referral_intent` text DEFAULT 'maybe' NOT NULL,
	`can_follow_up` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`contact_request_id`) REFERENCES `contact_requests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `consultation_feedback_email_created_at_idx` ON `consultation_feedback` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX `consultation_feedback_status_created_at_idx` ON `consultation_feedback` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `consultation_feedback_contact_request_idx` ON `consultation_feedback` (`contact_request_id`);--> statement-breakpoint
CREATE TABLE `support_contributions` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_request_id` text,
	`supporter_name` text NOT NULL,
	`supporter_email` text,
	`support_type` text NOT NULL,
	`amount_cents` integer,
	`impact_points` integer DEFAULT 1 NOT NULL,
	`note` text,
	`occurred_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`contact_request_id`) REFERENCES `contact_requests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `support_contributions_email_occurred_at_idx` ON `support_contributions` (`supporter_email`,`occurred_at`);--> statement-breakpoint
CREATE INDEX `support_contributions_type_occurred_at_idx` ON `support_contributions` (`support_type`,`occurred_at`);--> statement-breakpoint
CREATE INDEX `support_contributions_contact_request_idx` ON `support_contributions` (`contact_request_id`);--> statement-breakpoint
PRAGMA optimize;
