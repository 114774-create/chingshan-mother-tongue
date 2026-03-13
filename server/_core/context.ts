import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type TrpcContext = {
  req: any;
  res: any;
  user?: any;
  adminPassword?: string;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  try {
    const adminPassword = opts.req.headers["x-admin-password"];
    const expectedPassword = process.env.ADMIN_PASSWORD;

    // 比對密碼
    const isAdmin = typeof adminPassword === "string" && 
                    expectedPassword !== undefined && 
                    adminPassword === expectedPassword;

    return {
      req: opts.req,
      res: opts.res,
      adminPassword: typeof adminPassword === "string" ? adminPassword : undefined,
      user: isAdmin ? { id: 0, role: "admin", name: "管理員" } : null,
    };
  } catch (error) {
    // 萬一出錯，至少回傳一個空的 context，不要讓伺服器直接死掉
    console.error("Context Error:", error);
    return {
      req: opts.req,
      res: opts.res,
      user: null,
    };
  }
}
