import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  createAnnouncement,
  createBannerSlide,
  createFeedback,
  createPageContent,
  createPhoto,
  createPlan,
  createVideo,
  deleteAnnouncement,
  deleteBannerSlide,
  deleteFeedback,
  deletePageContent,
  deletePhoto,
  deletePlan,
  deleteVideo,
  getActiveBannerSlides,
  getActiveAnnouncements,
  getActivePhotos,
  getActivePlansByType,
  getActiveVideos,
  getAllAnnouncements,
  getAllBannerSlides,
  getAllFeedbacks,
  getAllPageContents,
  getAllPhotos,
  getAllPlans,
  getAllVideos,
  getApprovedFeedbacks,
  getDashboardStats,
  getPageContent,
  getPhotoAlbums,
  reorderBannerSlides,
  updateAnnouncement,
  updateBannerSlide,
  updateFeedback,
  updatePageContent,
  updatePhoto,
  updatePlan,
  updateVideo,
} from "./db";


// ── Upload Router ─────────────────────────────────────────────────────────────
const uploadRouter = router({
  uploadBase64: adminProcedure
    .input(z.object({
      fileName: z.string(),
      base64Data: z.string(),
      contentType: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64Data, "base64");
      const fileKey = `uploads/${Date.now()}-${input.fileName}`;
      const result = await storagePut(fileKey, buffer, input.contentType);
      return result;
    }),
});

// ── Videos Router ─────────────────────────────────────────────────────────────
const videosRouter = router({
  list: publicProcedure.query(() => getActiveVideos()),
  listAll: adminProcedure.query(() => getAllVideos()),
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      videoUrl: z.string(),
      thumbnailUrl: z.string().optional(),
      language: z.string().default("閩南語"),
      category: z.string().default("一般"),
    }))
    .mutation(({ input }) => createVideo(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      videoUrl: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      language: z.string().optional(),
      category: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateVideo(id, data);
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteVideo(input.id)),
});

// ── Photos Router ─────────────────────────────────────────────────────────────
const photosRouter = router({
  list: publicProcedure.query(() => getActivePhotos()),
  listAll: adminProcedure.query(() => getAllPhotos()),
  albums: publicProcedure.query(() => getPhotoAlbums()),
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      imageUrl: z.string(),
      imageKey: z.string(),
      album: z.string().default("活動照片"),
    }))
    .mutation(({ input }) => createPhoto(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      album: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updatePhoto(id, data);
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deletePhoto(input.id)),
});

// ── Plans Router ──────────────────────────────────────────────────────────────
const plansRouter = router({
  listByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ input }) => getActivePlansByType(input.type)),
  listAll: adminProcedure.query(() => getAllPlans()),
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      planUrl: z.string(),
      planType: z.string(),
    }))
    .mutation(({ input }) => createPlan(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      planUrl: z.string().optional(),
      planType: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updatePlan(id, data);
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deletePlan(input.id)),
});

// ── Announcements Router ──────────────────────────────────────────────────────
const announcementsRouter = router({
  list: publicProcedure.query(() => getActiveAnnouncements()),
  listAll: adminProcedure.query(() => getAllAnnouncements()),
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
    }))
    .mutation(({ input }) => createAnnouncement(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateAnnouncement(id, data);
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteAnnouncement(input.id)),
});

// ── Feedbacks Router ──────────────────────────────────────────────────────────
const feedbacksRouter = router({
  listApproved: publicProcedure.query(() => getApprovedFeedbacks()),
  listAll: adminProcedure.query(() => getAllFeedbacks()),
  create: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email().optional(),
      role: z.string().default("訪客"),
      message: z.string().min(1),
    }))
    .mutation(({ input }) => createFeedback(input)),
  approve: adminProcedure
    .input(z.object({ id: z.number(), isApproved: z.boolean() }))
    .mutation(({ input }) => updateFeedback(input.id, { isApproved: input.isApproved })),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteFeedback(input.id)),
});

// ── Page Content Router ───────────────────────────────────────────────────────
const pageContentRouter = router({
  getByPageKey: publicProcedure
    .input(z.object({ pageKey: z.string() }))
    .query(({ input }) => getPageContent(input.pageKey)),
  getAll: publicProcedure.query(() => getAllPageContents()),
  create: adminProcedure
    .input(z.object({
      pageKey: z.string(),
      pageTitle: z.string(),
      content: z.string().optional(),
    }))
    .mutation(({ input }) => createPageContent(input)),
  update: adminProcedure
    .input(z.object({
      pageKey: z.string(),
      pageTitle: z.string().optional(),
      content: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(({ input }) => {
      const { pageKey, ...data } = input;
      return updatePageContent(pageKey, data);
    }),
  delete: adminProcedure
    .input(z.object({ pageKey: z.string() }))
    .mutation(({ input }) => deletePageContent(input.pageKey)),
});

// ── Banner Slides Router ──────────────────────────────────────────────────────
const bannerSlidesRouter = router({
  list: publicProcedure.query(() => getActiveBannerSlides()),
  listAll: adminProcedure.query(() => getAllBannerSlides()),
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      imageUrl: z.string(),
      imageKey: z.string().optional(),
      externalLink: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(({ input }) => createBannerSlide(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      imageUrl: z.string().optional(),
      externalLink: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateBannerSlide(id, data);
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteBannerSlide(input.id)),
  reorder: adminProcedure
    .input(z.object({
      slides: z.array(z.object({ id: z.number(), sortOrder: z.number() }))
    }))
    .mutation(({ input }) => reorderBannerSlides(input.slides)),
  uploadImage: adminProcedure
    .input(z.object({
      base64: z.string(),
      fileName: z.string(),
      mimeType: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // 將 Base64 轉換為 Buffer
        const base64Data = input.base64.split(",")[1] || input.base64;
        const buffer = Buffer.from(base64Data, "base64");
        
        // 上傳到 S3
        const fileKey = `banners/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        return { url, key: fileKey };
      } catch (error) {
        console.error("Banner upload error:", error);
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to upload banner image" });
      }
    }),
});

// ── Dashboard Router ──────────────────────────────────────────────────────────
const dashboardRouter = router({
  stats: adminProcedure.query(() => getDashboardStats()),
});

// ── App Router ────────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  upload: uploadRouter,
  videos: videosRouter,
  photos: photosRouter,
  plans: plansRouter,
  announcements: announcementsRouter,
  feedbacks: feedbacksRouter,
  pageContent: pageContentRouter,
  bannerSlides: bannerSlidesRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
