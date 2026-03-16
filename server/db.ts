import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";
import { 
  users, videos, photos, plans, announcements, 
  feedbacks, pageContents, bannerSlides 
} from "../drizzle/schema.js";

let _db: any = null;

export async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!_db) {
    try {
      const connection = await mysql.createPool({ uri: url });
      _db = drizzle(connection, { schema, mode: "default" });
    } catch (e) { return null; }
  }
  return _db;
}

// ── 1. Users (使用者管理) ──
export async function upsertUser(user: any) {
  const db = await getDb();
  if (!db || !user.openId) return;
  try {
    const values = { ...user };
    if (user.email === '114774@csps.tn.edu.tw' || user.name?.includes('114774')) {
      values.role = "admin";
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: values });
  } catch (e) { console.error(e); }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch { return undefined; }
}

// ── 2. Announcements (公告管理 - 這是剛剛噴錯的地方) ──
export async function getActiveAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.publishedAt)); } catch { return []; }
}
export async function getAllAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(announcements).orderBy(desc(announcements.publishedAt)); } catch { return []; }
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

// ── 3. Videos (影片管理) ──
export async function getActiveVideos() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(videos).where(eq(videos.isActive, true)).orderBy(desc(videos.sortOrder)); } catch { return []; }
}
export async function getAllVideos() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(videos).orderBy(desc(videos.sortOrder)); } catch { return []; }
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

// ── 4. Photos (照片管理) ──
export async function getActivePhotos() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(photos).where(eq(photos.isActive, true)).orderBy(desc(photos.sortOrder)); } catch { return []; }
}
export async function getAllPhotos() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(photos).orderBy(desc(photos.sortOrder)); } catch { return []; }
}
export async function getPhotoAlbums() {
  const db = await getDb();
  if (!db) return [];
  try {
    const all = await db.select({ albumName: photos.albumName }).from(photos).where(eq(photos.isActive, true));
    return [...new Set(all.map(p => p.albumName))];
  } catch { return []; }
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

// ── 5. Plans (計畫管理) ──
export async function getActivePlansByType(type: string) {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(plans).where(and(eq(plans.isActive, true), eq(plans.type, type as any))).orderBy(desc(plans.year)); } catch { return []; }
}
export async function getAllPlans() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(plans).orderBy(desc(plans.year)); } catch { return []; }
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

// ── 6. Banner Slides (輪播圖管理) ──
export async function getActiveBannerSlides() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(bannerSlides).where(eq(bannerSlides.isActive, true)).orderBy(bannerSlides.sortOrder); } catch { return []; }
}
export async function getAllBannerSlides() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(bannerSlides).orderBy(bannerSlides.sortOrder); } catch { return []; }
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

// ── 7. Feedbacks (意見回饋) ──
export async function getApprovedFeedbacks() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(feedbacks).where(eq(feedbacks.isApproved, true)).orderBy(desc(feedbacks.createdAt)); } catch { return []; }
}
export async function getAllFeedbacks() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt)); } catch { return []; }
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

// ── 8. Page Contents (頁面內容) ──
export async function getPageContent(pageKey: string) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(pageContents).where(eq(pageContents.pageKey, pageKey)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch { return null; }
}
export async function getAllPageContents() {
  const db = await getDb();
  if (!db) return [];
  try { return await db.select().from(pageContents).orderBy(pageContents.pageKey); } catch { return []; }
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

// ── 9. Dashboard Stats (後台統計) ──
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
