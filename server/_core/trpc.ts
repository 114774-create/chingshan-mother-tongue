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

  // 在密碼硬編碼模式下，不再需要嚴格的用戶驗證，但保留此中間件以防萬一
  // if (!ctx.user) {
  //   throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  // }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

// ── Admin Procedure (密碼硬編碼模式：無條件放行並賦予管理員身分) ─────────────────────────────────────────────
export const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  // 只要是從後台進來的，我們直接賦予他管理員身分
  return next({
    ctx: { ...ctx, user: { role: 'admin', email: 'admin@qingshan', id: 999, openId: 'hardcoded_admin' } }
  });
});
