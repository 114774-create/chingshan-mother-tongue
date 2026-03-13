import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export async function createContext(opts: CreateExpressContextOptions) {
  // 使用 (opts.req as any) 來暴力繞過型別錯誤
  const adminPassword = (opts.req as any).headers["x-admin-password"];
  const expectedPassword = process.env.ADMIN_PASSWORD;

  const isAdmin = typeof adminPassword === "string" && adminPassword === expectedPassword;

  return {
    req: opts.req,
    res: opts.res,
    user: isAdmin ? { id: 0, role: "admin", name: "管理員" } : null,
  };
}
