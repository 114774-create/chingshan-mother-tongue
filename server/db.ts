import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";
import { 
  users, videos, photos, plans, announcements, 
  feedbacks, pageContents, bannerSlides 
} from "../drizzle/schema.js";

// 防止 Vercel 頻繁建立連線，確保連線穩定
let connection: mysql.Connection | null = null;
let _db: any = null;

export async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("[Database] 找不到 DATABASE_URL");
    return null;
  }

  if (!_db) {
    try {
      connection = await mysql.createConnection(url);
      _db = drizzle(connection, { schema, mode: "default" });
      console.log("[Database] 已成功連線至 TiDB");
    } catch (error) {
      console.error("[Database] 連線失敗:", error);
      _db = null;
    }
  }
  return _db;
}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function upsertUser(user: any): Promise<void> {
  if (!user.openId) return;
  const db = await getDb();
  if (!db) return;
  try {
    const values: any = { ...user };
    if (user.email === '114774@csps.tn.edu.tw') {
      values.role = "admin";
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: values });
  } catch (e) { console.error(e); }
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
  return await db.select().from(videos).where(eq(videos.isActive, true)).orderBy(desc(videos.sortOrder), desc(videos.createdAt));
}
export async function getAllVideos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(videos).orderBy(desc(videos.sortOrder), desc(videos.createdAt));
}
export async function createVideo(data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.insert(videos).values({ ...data, isActive: true });
}
export async function updateVideo(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.update(videos).set(data).where(eq(videos.id, id));
}
export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.delete(videos).where(eq(videos.id, id));
}

// ── Photos ────────────────────────────────────────────────────────────────────
export async function getActivePhotos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(photos).where(eq(photos.isActive, true)).orderBy(desc(photos.sortOrder), desc(photos.createdAt));
}
export async function getAllPhotos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(photos).orderBy(desc(photos.sortOrder), desc(photos.createdAt));
}
export async function getPhotoAlbums() {
  const db = await getDb();
  if (!db) return [];
  const all = await db.select({ albumName: photos.albumName }).from(photos).where(eq(photos.isActive, true));
  return [...new Set(all.map(p => p.albumName))];
}
export async function createPhoto(data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.insert(photos).values({ ...data, isActive: true });
}
export async function updatePhoto(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.update(photos).set(data).where(eq(photos.id, id));
}
export async function deletePhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.delete(photos).where(eq(photos.id, id));
}

// ── Plans ─────────────────────────────────────────────────────────────────────
export async function getActivePlansByType(type: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plans).where(and(eq(plans.isActive, true), eq(plans.type, type as any))).orderBy(desc(plans.year), desc(plans.sortOrder));
}
export async function getAllPlans() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plans).orderBy(desc(plans.year), desc(plans.sortOrder));
}
export async function createPlan(data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.insert(plans).values({ ...data, isActive: true });
}
export async function updatePlan(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.update(plans).set(data).where(eq(plans.id, id));
}
export async function deletePlan(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.delete(plans).where(eq(plans.id, id));
}

// ── Announcements ─────────────────────────────────────────────────────────────
export async function getActiveAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.publishedAt));
}
export async function getAllAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(announcements).orderBy(desc(announcements.publishedAt));
}
export async function createAnnouncement(data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.insert(announcements).values({ ...data, isActive: true, publishedAt: new Date() });
}
export async function updateAnnouncement(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.update(announcements).set(data).where(eq(announcements.id, id));
}
export async function deleteAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.delete(announcements).where(eq(announcements.id, id));
}

// ── Feedbacks ─────────────────────────────────────────────────────────────────
export async function getApprovedFeedbacks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(feedbacks).where(eq(feedbacks.isApproved, true)).orderBy(desc(feedbacks.createdAt));
}
export async function getAllFeedbacks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt));
}
export async function createFeedback(data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.insert(feedbacks).values({ ...data, isApproved: false });
}
export async function updateFeedback(id: number, data: { isApproved: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.update(feedbacks).set(data).where(eq(feedbacks.id, id));
}
export async function deleteFeedback(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
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
  return await db.select().from(pageContents).orderBy(pageContents.pageKey);
}
export async function createPageContent(data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.insert(pageContents).values({ ...data, isActive: true });
}
export async function updatePageContent(pageKey: string, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.update(pageContents).set(data).where(eq(pageContents.pageKey, pageKey));
}
export async function deletePageContent(pageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.delete(pageContents).where(eq(pageContents.pageKey, pageKey));
}

// ── Banner Slides ─────────────────────────────────────────────────────────────
export async function getActiveBannerSlides() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bannerSlides).where(eq(bannerSlides.isActive, true)).orderBy(bannerSlides.sortOrder);
}
export async function getAllBannerSlides() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bannerSlides).orderBy(bannerSlides.sortOrder);
}
export async function createBannerSlide(data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.insert(bannerSlides).values({ ...data, isActive: true });
}
export async function updateBannerSlide(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.update(bannerSlides).set(data).where(eq(bannerSlides.id, id));
}
export async function deleteBannerSlide(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await db.delete(bannerSlides).where(eq(bannerSlides.id, id));
}
export async function reorderBannerSlides(slides: Array<{ id: number; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("DB Error");
  await Promise.all(slides.map(s => db.update(bannerSlides).set({ sortOrder: s.sortOrder }).where(eq(bannerSlides.id, s.id))));
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { videos: 0, photos: 0, announcements: 0, feedbacks: 0 };
  try {
    const [v, p, a, f] = await Promise.all([
      db.select().from(videos), db.select().from(photos),
      db.select().from(announcements), db.select().from(feedbacks),
    ]);
    return { videos: v.length, photos: p.length, announcements: a.length, feedbacks: f.length };
  } catch { return { videos: 0, photos: 0, announcements: 0, feedbacks: 0 }; }
}
