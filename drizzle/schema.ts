import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { eq } from "drizzle-orm";

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Videos ────────────────────────────────────────────────────────────────────
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  language: varchar("language", { length: 50 }).notNull().default("閩南語"),
  category: varchar("category", { length: 100 }).notNull().default("一般"),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

// ── Photos ────────────────────────────────────────────────────────────────────
export const photos = mysqlTable("photos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 500 }),
  albumName: varchar("albumName", { length: 200 }).notNull().default("母語日活動"),
  year: varchar("year", { length: 10 }).notNull().default("2024"),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

// ── Plans ─────────────────────────────────────────────────────────────────────
export const plans = mysqlTable("plans", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["mother_tongue_day", "curriculum_plan", "teaching_material", "other"])
    .notNull()
    .default("other"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  externalUrl: text("externalUrl"),
  fileUrl: text("fileUrl"),
  fileKey: text("fileKey"),
  year: varchar("year", { length: 10 }).notNull().default("2024"),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = typeof plans.$inferInsert;

// ── Announcements ─────────────────────────────────────────────────────────────
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  linkUrl: text("linkUrl"),
  isActive: boolean("isActive").notNull().default(true),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

// ── Feedbacks ─────────────────────────────────────────────────────────────────
export const feedbacks = mysqlTable("feedbacks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  role: varchar("role", { length: 50 }).notNull().default("訪客"),
  message: text("message").notNull(),
  isApproved: boolean("isApproved").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;

// ── Banner Slides ─────────────────────────────────────────────────────────────
export const bannerSlides = mysqlTable("banner_slides", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 400 }),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 500 }),
  externalLink: text("externalLink"),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BannerSlide = typeof bannerSlides.$inferSelect;
export type InsertBannerSlide = typeof bannerSlides.$inferInsert;

// ── Page Contents ─────────────────────────────────────────────────────────────
export const pageContents = mysqlTable("page_contents", {
  id: int("id").autoincrement().primaryKey(),
  pageKey: varchar("pageKey", { length: 100 }).notNull().unique(),
  pageTitle: varchar("pageTitle", { length: 255 }).notNull(),
  content: text("content"),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PageContent = typeof pageContents.$inferSelect;
export type InsertPageContent = typeof pageContents.$inferInsert;
