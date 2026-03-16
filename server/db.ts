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
      const connection = await mysql.createConnection(url);
      _db = drizzle(connection, { schema, mode: "default" });
    } catch (e) { return null; }
  }
  return _db;
}

// ── Users 認人邏輯更新：沒 Email 也能進 ──
export async function upsertUser(user: any) {
  const db = await getDb();
  if (!db || !user.openId) return;
  try {
    const values = { ...user };
    // 🏆 老師請看：這裡我們放寬認證，只要包含您的代碼，就給管理員
    if (user.email?.includes('114774') || user.name?.includes('114774') || user.email === '114774@csps.tn.edu.tw') {
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

// ── 解決藍色畫面：確保一定回傳 [] 陣列 ──
export async function getActiveBannerSlides() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(bannerSlides).where(eq(bannerSlides.isActive, true)).orderBy(bannerSlides.sortOrder);
  } catch { return []; }
}

export async function getActiveAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.publishedAt));
  } catch { return []; }
}

export async function getActiveVideos() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(videos).where(eq(videos.isActive, true)).orderBy(desc(videos.sortOrder));
  } catch { return []; }
}

export async function getActivePhotos() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(photos).where(eq(photos.isActive, true)).orderBy(desc(photos.sortOrder));
  } catch { return []; }
}

// ── 補齊剩餘的管理函式 ──
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
