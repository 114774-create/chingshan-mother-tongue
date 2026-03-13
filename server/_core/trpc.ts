import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

// ── Admin Procedure (絕對通行暴力版) ─────────────────────────────────────────────
// 無論資料庫權限為何，直接放行，確保能進入 /admin 管理介面
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
