import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// 在新的密碼驗證系統中，protectedProcedure 也不再需要嚴格的用戶驗證
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// ── Admin Procedure (密碼驗證模式) ─────────────────────────────────────────────
export const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  console.log("[adminProcedure Debug] Received adminPassword:", ctx.adminPassword);
  if (ctx.adminPassword !== '114774') {
    console.log("[adminProcedure Debug] Authentication failed: Incorrect password.");
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '密碼錯誤，請重新登入' });
  }
  console.log("[adminProcedure Debug] Authentication successful. User role set to admin.");
  return next({
    ctx: { ...ctx, user: { role: 'admin', email: '114774@csps.tn.edu.tw', id: 1, openId: 'hardcoded_admin_session' } }
  });
});
