import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";

// 這裡我們直接使用一個全域變數，避免 Vercel 重複開啟太多連線導致資料庫爆炸
let connection: mysql.Connection | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function getDb() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    console.error("[資料庫錯誤] 找不到 DATABASE_URL，請檢查 Vercel 環境變數。");
    return null;
  }

  if (!_db) {
    try {
      // TiDB Cloud 必須使用 SSL 連線，這裡強迫開啟
      connection = await mysql.createConnection(url);
      _db = drizzle(connection, { schema, mode: "default" });
      console.log("[資料庫] 成功建立新連線");
    } catch (error) {
      console.error("[資料庫] 連線失敗:", error);
      _db = null;
    }
  }
  return _db;
}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;

    textFields.forEach((field) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    });

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.email === '114774@csps.tn.edu.tw') {
      values.role = "admin";
      updateSet.role = "admin";
    } else if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Videos ────────────────────────────────────────────────────────────────────
export async function getActiveVideos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(videos).where(eq(videos.isActive, true)).orderBy(desc(videos.sortOrder), desc(videos.createdAt));
}

export async function getAllVideos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(videos).orderBy(desc(videos.sortOrder), desc(videos.createdAt));
}

export async function createVideo(data: {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  language: string;
  category: string;
  sortOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(videos).values({ ...data, isActive: true });
}

export async function updateVideo(id: number, data: Partial<{
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  language: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(videos).set(data).where(eq(videos.id, id));
}

export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(videos).where(eq(videos.id, id));
}

// ── Photos ────────────────────────────────────────────────────────────────────
export async function getActivePhotos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(photos).where(eq(photos.isActive, true)).orderBy(desc(photos.sortOrder), desc(photos.createdAt));
}

export async function getAllPhotos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(photos).orderBy(desc(photos.sortOrder), desc(photos.createdAt));
}

export async function getPhotoAlbums() {
  const db = await getDb();
  if (!db) return [];
  const all = await db.select({ albumName: photos.albumName }).from(photos).where(eq(photos.isActive, true));
  const names = all.map((p) => p.albumName);
  return names.filter((v, i) => names.indexOf(v) === i);
}

export async function createPhoto(data: {
  title: string;
  description?: string;
  imageUrl: string;
  imageKey?: string;
  albumName: string;
  year: string;
  sortOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(photos).values({ ...data, isActive: true });
}

export async function updatePhoto(id: number, data: Partial<{
  title: string;
  description: string;
  imageUrl: string;
  albumName: string;
  year: string;
  sortOrder: number;
  isActive: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(photos).set(data).where(eq(photos.id, id));
}

export async function deletePhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(photos).where(eq(photos.id, id));
}

// ── Plans ─────────────────────────────────────────────────────────────────────
export async function getActivePlansByType(type: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plans)
    .where(and(eq(plans.isActive, true), eq(plans.type, type as any)))
    .orderBy(desc(plans.year), desc(plans.sortOrder));
}

export async function getAllPlans() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plans).orderBy(desc(plans.year), desc(plans.sortOrder));
}

export async function createPlan(data: {
  type: "mother_tongue_day" | "curriculum_plan" | "teaching_material" | "other";
  title: string;
  description?: string;
  externalUrl?: string;
  fileUrl?: string;
  fileKey?: string;
  year: string;
  sortOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(plans).values({ ...data, isActive: true });
}

export async function updatePlan(id: number, data: Partial<{
  type: "mother_tongue_day" | "curriculum_plan" | "teaching_material" | "other";
  title: string;
  description: string;
  externalUrl: string;
  fileUrl: string;
  year: string;
  sortOrder: number;
  isActive: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(plans).set(data).where(eq(plans.id, id));
}

export async function deletePlan(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(plans).where(eq(plans.id, id));
}

// ── Announcements ─────────────────────────────────────────────────────────────
export async function getActiveAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.publishedAt));
}

export async function getAllAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(announcements).orderBy(desc(announcements.publishedAt));
}

export async function createAnnouncement(data: {
  title: string;
  content?: string;
  linkUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(announcements).values({ ...data, isActive: true, publishedAt: new Date() });
}

export async function updateAnnouncement(id: number, data: Partial<{
  title: string;
  content: string;
  linkUrl: string;
  isActive: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(announcements).set(data).where(eq(announcements.id, id));
}

export async function deleteAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(announcements).where(eq(announcements.id, id));
}

// ── Feedbacks ─────────────────────────────────────────────────────────────────
export async function getApprovedFeedbacks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(feedbacks).where(eq(feedbacks.isApproved, true)).orderBy(desc(feedbacks.createdAt));
}

export async function getAllFeedbacks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt));
}

export async function createFeedback(data: {
  name: string;
  email?: string;
  role: string;
  message: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(feedbacks).values({ ...data, isApproved: false });
}

export async function updateFeedback(id: number, data: { isApproved: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(feedbacks).set(data).where(eq(feedbacks.id, id));
}

export async function deleteFeedback(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(feedbacks).where(eq(feedbacks.id, id));
}

// ── Page Contents ───────────────────────────────────────────────────────────────
export async function getPageContent(pageKey: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(pageContents).where(eq(pageContents.pageKey, pageKey)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllPageContents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pageContents).orderBy(pageContents.pageKey);
}

export async function createPageContent(data: {
  pageKey: string;
  pageTitle: string;
  content?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(pageContents).values({ ...data, isActive: true });
}

export async function updatePageContent(pageKey: string, data: Partial<{
  pageTitle: string;
  content: string;
  isActive: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(pageContents).set(data).where(eq(pageContents.pageKey, pageKey));
}

export async function deletePageContent(pageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pageContents).where(eq(pageContents.pageKey, pageKey));
}

// ── Banner Slides ─────────────────────────────────────────────────────────────
export async function getActiveBannerSlides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bannerSlides).where(eq(bannerSlides.isActive, true)).orderBy(bannerSlides.sortOrder);
}

export async function getAllBannerSlides() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bannerSlides).orderBy(bannerSlides.sortOrder);
}

export async function createBannerSlide(data: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageKey?: string;
  externalLink?: string;
  sortOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bannerSlides).values({ ...data, isActive: true });
}

export async function updateBannerSlide(id: number, data: Partial<{
  title: string;
  subtitle: string;
  imageUrl: string;
  externalLink: string;
  sortOrder: number;
  isActive: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bannerSlides).set(data).where(eq(bannerSlides.id, id));
}

export async function deleteBannerSlide(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bannerSlides).where(eq(bannerSlides.id, id));
}

export async function reorderBannerSlides(slides: Array<{ id: number; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const slide of slides) {
    await db.update(bannerSlides).set({ sortOrder: slide.sortOrder }).where(eq(bannerSlides.id, slide.id));
  }
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { videos: 0, photos: 0, announcements: 0, feedbacks: 0 };

  const [videoCount, photoCount, announcementCount, feedbackCount] = await Promise.all([
    db.select().from(videos),
    db.select().from(photos),
    db.select().from(announcements),
    db.select().from(feedbacks),
  ]);

  return {
    videos: videoCount.length,
    photos: photoCount.length,
    announcements: announcementCount.length,
    feedbacks: feedbackCount.length,
  };
}
