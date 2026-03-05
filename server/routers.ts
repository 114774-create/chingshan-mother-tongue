import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  createAnnouncement,
  createFeedback,
  createPhoto,
  createPlan,
  createVideo,
  deleteAnnouncement,
  deleteFeedback,
  deletePhoto,
  deletePlan,
  deleteVideo,
  getActiveBannerSlides,
  getActiveAnnouncements,
  getActivePhotos,
  getActivePlansByType,
  getActiveVideos,
  getAllAnnouncements,
  getAllFeedbacks,
  getAllPhotos,
  getAllPlans,
  getAllVideos,
  getApprovedFeedbacks,
  getDashboardStats,
  getPhotoAlbums,
  updateAnnouncement,
  updateFeedback,
  updatePhoto,
  updatePlan,
  updateVideo,
} from "./db";

// ── Admin guard ───────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "管理員權限不足" });
  }
  return next({ ctx });
});

// ── Upload Router ─────────────────────────────────────────────────────────────
const uploadRouter = router({
  uploadBase64: adminProcedure
    .input(z.object({
      base64: z.string(),
      contentType: z.string(),
      folder: z.string().default("uploads"),
      filename: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      const ext = input.filename.split(".").pop() ?? "jpg";
      const key = `${input.folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url, key };
    }),
});

// ── Videos Router ─────────────────────────────────────────────────────────────
const videosRouter = router({
  list: publicProcedure.query(() => getActiveVideos()),
  adminList: adminProcedure.query(() => getAllVideos()),
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      videoUrl: z.string().url(),
      thumbnailUrl: z.string().optional(),
      language: z.string().default("閩南語"),
      category: z.string().default("一般"),
      sortOrder: z.number().default(0),
    }))
    .mutation(({ input }) => createVideo(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      videoUrl: z.string().url().optional(),
      thumbnailUrl: z.string().optional(),
      language: z.string().optional(),
      category: z.string().optional(),
      sortOrder: z.number().optional(),
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
  adminList: adminProcedure.query(() => getAllPhotos()),
  albums: publicProcedure.query(() => getPhotoAlbums()),
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      imageUrl: z.string().url(),
      imageKey: z.string().optional(),
      albumName: z.string().default("母語日活動"),
      year: z.string().default("2024"),
      sortOrder: z.number().default(0),
    }))
    .mutation(({ input }) => createPhoto(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      albumName: z.string().optional(),
      year: z.string().optional(),
      sortOrder: z.number().optional(),
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
  list: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ input }) => getActivePlansByType(input.type)),
  adminList: adminProcedure.query(() => getAllPlans()),
  create: adminProcedure
    .input(z.object({
      type: z.enum(["mother_tongue_day", "curriculum_plan", "teaching_material", "other"]),
      title: z.string().min(1),
      description: z.string().optional(),
      externalUrl: z.string().optional(),
      fileUrl: z.string().optional(),
      fileKey: z.string().optional(),
      year: z.string().default("2024"),
      sortOrder: z.number().default(0),
    }))
    .mutation(({ input }) => createPlan(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      type: z.enum(["mother_tongue_day", "curriculum_plan", "teaching_material", "other"]).optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      externalUrl: z.string().optional(),
      fileUrl: z.string().optional(),
      year: z.string().optional(),
      sortOrder: z.number().optional(),
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
  adminList: adminProcedure.query(() => getAllAnnouncements()),
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().optional(),
      linkUrl: z.string().optional(),
    }))
    .mutation(({ input }) => createAnnouncement(input)),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      linkUrl: z.string().optional(),
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
  list: publicProcedure.query(() => getApprovedFeedbacks()),
  adminList: adminProcedure.query(() => getAllFeedbacks()),
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
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

// ── Banner Slides Router ──────────────────────────────────────────────────────
const bannerSlidesRouter = router({
  list: publicProcedure.query(() => getActiveBannerSlides()),
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
  bannerSlides: bannerSlidesRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
