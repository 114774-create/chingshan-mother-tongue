import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";
import { 
  users, videos, photos, plans, announcements, 
  feedbacks, pageContents, bannerSlides 
} from "../drizzle/schema.js";

// 防止 Vercel 頻繁建立連線
let connection: mysql.Connection | null = null;
let _db: any = null;

export async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  if (!_db) {
    try {
      connection = await mysql.createConnection(url);
      _db = drizzle(connection, { schema, mode: "default" });
    } catch (error) {
      console.error("[Database] 連線失敗:", error);
      _db = null;
    }
  }
  return _db;
}

// ── Users ─────────────────────────────────────────────────────────────────────
// 這裡我們用 any 來處理 InsertUser，避免 TypeScript 在 Vercel 上因為嚴格檢查而報錯
export async function upsertUser(user: any): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.error("[Database] 找不到資料庫，無法更新使用者。");
    return;
  }

  try {
    const values: any = { openId: user.openId };
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

    // 🏆 老師的「大絕招」：如果是您的信箱，強制設為管理員
    if (user.email === '114774@csps.tn.edu.tw') {
      values.role = "admin";
      updateSet.role = "admin";
    } else if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    // 執行資料庫寫入：如果 openId 已存在就更新，不存在就新增
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
    console.log(`[Database] 使用者 ${user.email || user.openId} 同步成功`);
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] 查詢使用者失敗:", error);
    return undefined;
  }
}

// ── Videos ────────────────────────────────────────────────────────────────────
export async function getActiveVideos() {
  try {
    const db = await getDb();
    if (!db) return [];
    // 這裡我們加上 await 確保資料抓完才回傳
    return await db.select().from(videos)
      .where(eq(videos.isActive, true))
      .orderBy(desc(videos.sortOrder), desc(videos.createdAt));
  } catch (error) {
    console.error("[Database] 抓取啟動影片失敗:", error);
    return []; // 失敗時回傳空陣列，網頁就不會崩潰
  }
}

export async function getAllVideos() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(videos)
      .orderBy(desc(videos.sortOrder), desc(videos.createdAt));
  } catch (error) {
    console.error("[Database] 抓取所有影片失敗:", error);
    return [];
  }
}

export async function createVideo(data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法新增影片");
  try {
    // 確保新增時預設是啟動狀態
    await db.insert(videos).values({ ...data, isActive: true });
    console.log(`[Database] 影片新增成功: ${data.title}`);
  } catch (error) {
    console.error("[Database] createVideo 失敗:", error);
    throw error;
  }
}

export async function updateVideo(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法更新影片");
  try {
    await db.update(videos).set(data).where(eq(videos.id, id));
    console.log(`[Database] 影片更新成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] updateVideo 失敗:", error);
    throw error;
  }
}

export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法刪除影片");
  try {
    await db.delete(videos).where(eq(videos.id, id));
    console.log(`[Database] 影片刪除成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] deleteVideo 失敗:", error);
    throw error;
  }
}

// ── Photos ────────────────────────────────────────────────────────────────────
export async function getActivePhotos() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(photos)
      .where(eq(photos.isActive, true))
      .orderBy(desc(photos.sortOrder), desc(photos.createdAt));
  } catch (error) {
    console.error("[Database] 抓取啟動照片失敗:", error);
    return [];
  }
}

export async function getAllPhotos() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(photos)
      .orderBy(desc(photos.sortOrder), desc(photos.createdAt));
  } catch (error) {
    console.error("[Database] 抓取所有照片失敗:", error);
    return [];
  }
}

export async function getPhotoAlbums() {
  try {
    const db = await getDb();
    if (!db) return [];
    // 抓取所有相簿名稱
    const all = await db.select({ albumName: photos.albumName })
      .from(photos)
      .where(eq(photos.isActive, true));
    
    const names = all.map((p) => p.albumName);
    // 使用 Set 來確保相簿名稱不重複，這比 indexOf 快且準確
    return [...new Set(names)];
  } catch (error) {
    console.error("[Database] 抓取相簿清單失敗:", error);
    return [];
  }
}

export async function createPhoto(data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法新增照片");
  try {
    await db.insert(photos).values({ ...data, isActive: true });
    console.log(`[Database] 照片新增成功: ${data.title} (相簿: ${data.albumName})`);
  } catch (error) {
    console.error("[Database] createPhoto 失敗:", error);
    throw error;
  }
}

export async function updatePhoto(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法更新照片");
  try {
    await db.update(photos).set(data).where(eq(photos.id, id));
    console.log(`[Database] 照片更新成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] updatePhoto 失敗:", error);
    throw error;
  }
}

export async function deletePhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法刪除照片");
  try {
    await db.delete(photos).where(eq(photos.id, id));
    console.log(`[Database] 照片刪除成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] deletePhoto 失敗:", error);
    throw error;
  }
}

// ── Plans ─────────────────────────────────────────────────────────────────────
export async function getActivePlansByType(type: string) {
  try {
    const db = await getDb();
    if (!db) return [];
    // 加上 await 確保查詢完成，並處理 type 的轉型
    return await db.select().from(plans)
      .where(and(eq(plans.isActive, true), eq(plans.type, type as any)))
      .orderBy(desc(plans.year), desc(plans.sortOrder));
  } catch (error) {
    console.error(`[Database] 抓取計畫失敗 (類型: ${type}):`, error);
    return [];
  }
}

export async function getAllPlans() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(plans)
      .orderBy(desc(plans.year), desc(plans.sortOrder));
  } catch (error) {
    console.error("[Database] 抓取所有計畫失敗:", error);
    return [];
  }
}

export async function createPlan(data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法新增計畫");
  try {
    await db.insert(plans).values({ ...data, isActive: true });
    console.log(`[Database] 計畫新增成功: ${data.title}`);
  } catch (error) {
    console.error("[Database] createPlan 失敗:", error);
    throw error;
  }
}

export async function updatePlan(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法更新計畫");
  try {
    await db.update(plans).set(data).where(eq(plans.id, id));
    console.log(`[Database] 計畫更新成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] updatePlan 失敗:", error);
    throw error;
  }
}

export async function deletePlan(id: number) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法刪除計畫");
  try {
    await db.delete(plans).where(eq(plans.id, id));
    console.log(`[Database] 計畫刪除成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] deletePlan 失敗:", error);
    throw error;
  }
}

// ── Announcements ─────────────────────────────────────────────────────────────
export async function getActiveAnnouncements() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(desc(announcements.publishedAt));
  } catch (error) {
    console.error("[Database] 抓取啟動公告失敗:", error);
    return [];
  }
}

export async function getAllAnnouncements() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(announcements)
      .orderBy(desc(announcements.publishedAt));
  } catch (error) {
    console.error("[Database] 抓取所有公告失敗:", error);
    return [];
  }
}

export async function createAnnouncement(data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法新增公告");
  try {
    // 強制設定 isActive 為 true 並補上當前時間
    await db.insert(announcements).values({ 
      ...data, 
      isActive: true, 
      publishedAt: new Date() 
    });
    console.log(`[Database] 公告發布成功: ${data.title}`);
  } catch (error) {
    console.error("[Database] createAnnouncement 失敗:", error);
    throw error;
  }
}

export async function updateAnnouncement(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法更新公告");
  try {
    await db.update(announcements).set(data).where(eq(announcements.id, id));
    console.log(`[Database] 公告更新成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] updateAnnouncement 失敗:", error);
    throw error;
  }
}

export async function deleteAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法刪除公告");
  try {
    await db.delete(announcements).where(eq(announcements.id, id));
    console.log(`[Database] 公告刪除成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] deleteAnnouncement 失敗:", error);
    throw error;
  }
}

// ── Feedbacks ─────────────────────────────────────────────────────────────────
export async function getApprovedFeedbacks() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(feedbacks)
      .where(eq(feedbacks.isApproved, true))
      .orderBy(desc(feedbacks.createdAt));
  } catch (error) {
    console.error("[Database] 抓取已審核回饋失敗:", error);
    return [];
  }
}

export async function getAllFeedbacks() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(feedbacks)
      .orderBy(desc(feedbacks.createdAt));
  } catch (error) {
    console.error("[Database] 抓取所有回饋失敗:", error);
    return [];
  }
}

export async function createFeedback(data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法送出回饋");
  try {
    // 預設 isApproved 為 false，需等老師從後台勾選通過
    await db.insert(feedbacks).values({ ...data, isApproved: false });
    console.log(`[Database] 收到新的意見回饋: ${data.name}`);
  } catch (error) {
    console.error("[Database] createFeedback 失敗:", error);
    throw error;
  }
}

export async function updateFeedback(id: number, data: { isApproved: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法更新回饋狀態");
  try {
    await db.update(feedbacks).set(data).where(eq(feedbacks.id, id));
    console.log(`[Database] 回饋審核狀態更新 ID: ${id} -> ${data.isApproved}`);
  } catch (error) {
    console.error("[Database] updateFeedback 失敗:", error);
    throw error;
  }
}

export async function deleteFeedback(id: number) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法刪除回饋");
  try {
    await db.delete(feedbacks).where(eq(feedbacks.id, id));
    console.log(`[Database] 回饋刪除成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] deleteFeedback 失敗:", error);
    throw error;
  }
}

// ── Page Contents ───────────────────────────────────────────────────────────────
export async function getPageContent(pageKey: string) {
  try {
    const db = await getDb();
    if (!db) return null;
    const result = await db.select().from(pageContents)
      .where(eq(pageContents.pageKey, pageKey))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`[Database] 抓取頁面內容失敗 (Key: ${pageKey}):`, error);
    return null;
  }
}

export async function getAllPageContents() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(pageContents).orderBy(pageContents.pageKey);
  } catch (error) {
    console.error("[Database] 抓取所有頁面清單失敗:", error);
    return [];
  }
}

export async function createPageContent(data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法建立頁面內容");
  try {
    await db.insert(pageContents).values({ ...data, isActive: true });
    console.log(`[Database] 頁面內容建立成功: ${data.pageTitle}`);
  } catch (error) {
    console.error("[Database] createPageContent 失敗:", error);
    throw error;
  }
}

export async function updatePageContent(pageKey: string, data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法更新頁面內容");
  try {
    await db.update(pageContents).set(data).where(eq(pageContents.pageKey, pageKey));
    console.log(`[Database] 頁面內容更新成功 Key: ${pageKey}`);
  } catch (error) {
    console.error("[Database] updatePageContent 失敗:", error);
    throw error;
  }
}

export async function deletePageContent(pageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法刪除頁面內容");
  try {
    await db.delete(pageContents).where(eq(pageContents.pageKey, pageKey));
    console.log(`[Database] 頁面內容刪除成功 Key: ${pageKey}`);
  } catch (error) {
    console.error("[Database] deletePageContent 失敗:", error);
    throw error;
  }
}

// ── Banner Slides ─────────────────────────────────────────────────────────────
export async function getActiveBannerSlides() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(bannerSlides)
      .where(eq(bannerSlides.isActive, true))
      .orderBy(bannerSlides.sortOrder);
  } catch (error) {
    console.error("[Database] 抓取啟動輪播圖失敗:", error);
    return [];
  }
}

export async function getAllBannerSlides() {
  try {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(bannerSlides).orderBy(bannerSlides.sortOrder);
  } catch (error) {
    console.error("[Database] 抓取所有輪播圖清單失敗:", error);
    return [];
  }
}

export async function createBannerSlide(data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法建立輪播圖");
  try {
    await db.insert(bannerSlides).values({ ...data, isActive: true });
    console.log(`[Database] 輪播圖建立成功: ${data.title}`);
  } catch (error) {
    console.error("[Database] createBannerSlide 失敗:", error);
    throw error;
  }
}

export async function updateBannerSlide(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法更新輪播圖");
  try {
    await db.update(bannerSlides).set(data).where(eq(bannerSlides.id, id));
    console.log(`[Database] 輪播圖更新成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] updateBannerSlide 失敗:", error);
    throw error;
  }
}

export async function deleteBannerSlide(id: number) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法刪除輪播圖");
  try {
    await db.delete(bannerSlides).where(eq(bannerSlides.id, id));
    console.log(`[Database] 輪播圖刪除成功 ID: ${id}`);
  } catch (error) {
    console.error("[Database] deleteBannerSlide 失敗:", error);
    throw error;
  }
}

export async function reorderBannerSlides(slides: Array<{ id: number; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("資料庫連線中斷，無法重新排序");
  try {
    // 使用 Promise.all 同時處理多個更新，效率更高且更穩定
    await Promise.all(
      slides.map((slide) =>
        db.update(bannerSlides)
          .set({ sortOrder: slide.sortOrder })
          .where(eq(bannerSlides.id, slide.id))
      )
    );
    console.log("[Database] 輪播圖排序更新完成");
  } catch (error) {
    console.error("[Database] reorderBannerSlides 失敗:", error);
    throw error;
  }
}

// ── Dashboard Stats (最後一段) ───────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { videos: 0, photos: 0, announcements: 0, feedbacks: 0 };
  try {
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
  } catch (error) {
    return { videos: 0, photos: 0, announcements: 0, feedbacks: 0 };
  }
}
