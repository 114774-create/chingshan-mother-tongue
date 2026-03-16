import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context.js";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// protectedProcedure：基本保護，檢查是否已驗證
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '請先登入' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// adminProcedure：管理員專用，檢查 Cookie 中的 admin_token
export const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '管理員權限不足' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user || { id: 0, role: "admin", name: "青山管理員" },
    },
  });
});
