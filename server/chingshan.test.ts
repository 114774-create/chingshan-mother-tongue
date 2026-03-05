import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// ── Helper: create mock context ───────────────────────────────────────────────
type CookieCall = { name: string; options: Record<string, unknown> };
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: "admin" | "user" = "user"): {
  ctx: TrpcContext;
  clearedCookies: CookieCall[];
} {
  const clearedCookies: CookieCall[] = [];
  const user: AuthenticatedUser = {
    id: 1,
    openId: role === "admin" ? "admin-open-id" : "user-open-id",
    email: "test@example.com",
    name: role === "admin" ? "管理員" : "一般使用者",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

// ── Auth Tests ────────────────────────────────────────────────────────────────
describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createContext("user");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({
      maxAge: -1,
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  });

  it("returns current user when authenticated", async () => {
    const { ctx } = createContext("user");
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).not.toBeNull();
    expect(user?.role).toBe("user");
  });

  it("returns null when not authenticated", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });
});

// ── Admin Guard Tests ─────────────────────────────────────────────────────────
describe("admin guard", () => {
  it("throws FORBIDDEN when non-admin accesses admin endpoint", async () => {
    const { ctx } = createContext("user");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.videos.adminList()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("allows admin to access admin endpoints", async () => {
    const { ctx } = createContext("admin");
    const caller = appRouter.createCaller(ctx);
    // Should not throw (returns empty array from mock DB)
    const result = await caller.videos.adminList();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── Public Endpoints Tests ────────────────────────────────────────────────────
describe("public endpoints", () => {
  it("allows unauthenticated access to videos list", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.videos.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated access to photos list", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.photos.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated access to announcements list", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.announcements.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated access to plans list", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plans.list({ type: "mother_tongue_day" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated access to banner slides", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.bannerSlides.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated access to approved feedbacks", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.feedbacks.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── Feedback Creation Tests ───────────────────────────────────────────────────
describe("feedbacks.create", () => {
  it("throws when name is empty", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.feedbacks.create({ name: "", role: "訪客", message: "測試留言" })
    ).rejects.toBeDefined();
  });

  it("throws when message is empty", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.feedbacks.create({ name: "測試者", role: "訪客", message: "" })
    ).rejects.toBeDefined();
  });
});

// ── Dashboard Stats Tests ─────────────────────────────────────────────────────
describe("dashboard.stats", () => {
  it("throws FORBIDDEN for non-admin", async () => {
    const { ctx } = createContext("user");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.dashboard.stats()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("returns stats object for admin", async () => {
    const { ctx } = createContext("admin");
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.dashboard.stats();
    expect(stats).toHaveProperty("videos");
    expect(stats).toHaveProperty("photos");
    expect(stats).toHaveProperty("announcements");
    expect(stats).toHaveProperty("feedbacks");
  });
});
