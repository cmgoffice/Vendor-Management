CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "account_role" CHECK("accounts"."role" IN ('admin','vendor'))
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`reviewer_id` text NOT NULL,
	`reviewer` text NOT NULL,
	`quality` integer NOT NULL,
	`price` integer NOT NULL,
	`delivery` integer NOT NULL,
	`service` integer NOT NULL,
	`reliability` integer NOT NULL,
	`comment` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "review_scores" CHECK("reviews"."quality" BETWEEN 1 AND 5 AND "reviews"."price" BETWEEN 1 AND 5 AND "reviews"."delivery" BETWEEN 1 AND 5 AND "reviews"."service" BETWEEN 1 AND 5 AND "reviews"."reliability" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_vendor` ON `reviews` (`vendor_id`);--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`contact` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`tax_id` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "vendor_status" CHECK("vendors"."status" IN ('Active','Pending','Inactive'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_vendors_owner` ON `vendors` (`owner_id`);--> statement-breakpoint
CREATE TABLE `workspace` (
	`id` integer PRIMARY KEY NOT NULL,
	`admin_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "workspace_singleton" CHECK("workspace"."id"=1)
);
