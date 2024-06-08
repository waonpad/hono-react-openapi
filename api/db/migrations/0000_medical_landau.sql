CREATE TABLE `posts` (
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`public` integer,
	`authorId` text NOT NULL,
	FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`hashed_password` text NOT NULL,
	`role` text DEFAULT 'USER' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);