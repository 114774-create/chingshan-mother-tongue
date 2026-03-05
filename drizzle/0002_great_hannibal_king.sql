ALTER TABLE `announcements` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `photos` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `plans` MODIFY COLUMN `type` enum('mother_tongue_day','curriculum_plan','teaching_material','other') NOT NULL DEFAULT 'other';--> statement-breakpoint
ALTER TABLE `plans` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `plans` MODIFY COLUMN `fileKey` text;--> statement-breakpoint
ALTER TABLE `videos` MODIFY COLUMN `title` varchar(255) NOT NULL;