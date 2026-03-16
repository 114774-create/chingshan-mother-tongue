import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
// 注意：就算您的檔案是 .ts，這裡的路徑也要寫 .js，Vercel 才能在執行時找到它
import * as schema from "../drizzle/schema.js";
import { 
  users, 
  videos, 
  photos, 
  plans, 
  announcements, 
  feedbacks, 
  bannerSlides, 
  pageContents 
} from "../drizzle/schema.js";

// 建立資料庫連線池，避免 Vercel 重複連線導致 TiDB 爆炸
let _db: any = null;

export async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("[資料庫] 找不到 DATABASE_URL 環境變數");
    return null;
  }

  if (!_db) {
    try {
      const connection = await mysql.createConnection(url);
      _db = drizzle(connection, { schema, mode: "default" });
      console.log("[資料庫] 成功連線至 TiDB: github_sample");
    } catch (error) {
      console.error("[資料庫] 連線失敗:", error);
      _db = null;
    }
  }
  return _db;
}

// ── 以下是所有功能函式，我已經幫老師把引用都校正好了 ──

export async function upsertUser(user: any) {
  const db = await getDb();
  if (!db || !user.openId) return;
  try {
    const values = { ...user };
    if (user.email === '114774@csps.tn.edu.tw') values.role = "admin";
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: values });
  } catch (e) { console.error(e); }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

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
  if (!db) throw new Error("DB Unavailable");
  await db.insert(videos).values({ ...data, isActive: true });
}

export async function updateVideo(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.update(videos).set(data).where(eq(videos.id, id));
}

export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.delete(videos).where(eq(videos.id, id));
}

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
  const names = all.map((p) => p.albumName);
  return [...new Set(names)];
}

export async function createPhoto(data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.insert(photos).values({ ...data, isActive: true });
}

export async function updatePhoto(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.update(photos).set(data).where(eq(photos.id, id));
}

export async function deletePhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.delete(photos).where(eq(photos.id, id));
}

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
  if (!db) throw new Error("DB Unavailable");
  await db.insert(plans).values({ ...data, isActive: true });
}

export async function updatePlan(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.update(plans).set(data).where(eq(plans.id, id));
}

export async function deletePlan(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.delete(plans).where(eq(plans.id, id));
}

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
  if (!db) throw new Error("DB Unavailable");
  await db.insert(announcements).values({ ...data, isActive: true, publishedAt: new Date() });
}

export async function updateAnnouncement(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.update(announcements).set(data).where(eq(announcements.id, id));
}

export async function deleteAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.delete(announcements).where(eq(announcements.id, id));
}

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
  if (!db) throw new Error("DB Unavailable");
  await db.insert(feedbacks).values({ ...data, isApproved: false });
}

export async function updateFeedback(id: number, data: { isApproved: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.update(feedbacks).set(data).where(eq(feedbacks.id, id));
}

export async function deleteFeedback(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.delete(feedbacks).where(eq(feedbacks.id, id));
}

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
  if (!db) throw new Error("DB Unavailable");
  await db.insert(pageContents).values({ ...data, isActive: true });
}

export async function updatePageContent(pageKey: string, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.update(pageContents).set(data).where(eq(pageContents.pageKey, pageKey));
}

export async function deletePageContent(pageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.delete(pageContents).where(eq(pageContents.pageKey, pageKey));
}

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
  if (!db) throw new Error("DB Unavailable");
  await db.insert(bannerSlides).values({ ...data, isActive: true });
}

export async function updateBannerSlide(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.update(bannerSlides).set(data).where(eq(bannerSlides.id, id));
}

export async function deleteBannerSlide(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await db.delete(bannerSlides).where(eq(bannerSlides.id, id));
}

export async function reorderBannerSlides(slides: Array<{ id: number; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("DB Unavailable");
  await Promise.all(slides.map(s => db.update(bannerSlides).set({ sortOrder: s.sortOrder }).where(eq(bannerSlides.id, s.id))));
}

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { videos: 0, photos: 0, announcements: 0, feedbacks: 0 };
  try {
    const [v, p, a, f] = await Promise.all([
      db.select().from(videos),
      db.select().from(photos),
      db.select().from(announcements),
      db.select().from(feedbacks),
    ]);
    return { videos: v.length, photos: p.length, announcements: a.length, feedbacks: f.length };
  } catch {
    return { videos: 0, photos: 0, announcements: 0, feedbacks: 0 };
  }
}
