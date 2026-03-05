CREATE TABLE `page_contents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageKey` varchar(100) NOT NULL,
	`pageTitle` varchar(255) NOT NULL,
	`content` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_contents_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_contents_pageKey_unique` UNIQUE(`pageKey`)
);
