import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user?: any; // 改成 any 避免 Manus 之前寫錯的型別報錯
  adminPassword?: string;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  // 1. 從請求頭中抓取密碼
  const adminPassword = opts.req.headers["x-admin-password"];
  
  // 2. 從環境變數讀取正確答案（Vercel 裡的 ADMIN_PASSWORD）
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // 3. 核心邏輯：如果密碼對了，就給予管理員權限
  // 這樣後面的 adminProcedure 才會讓您過關
  const isAdmin = typeof adminPassword === "string" && adminPassword === expectedPassword;

  return {
    req: opts.req,
    res: opts.res,
    adminPassword: typeof adminPassword === "string" ? adminPassword : undefined,
    // 只要密碼對了，我們就「手動注入」一個管理員身分
    user: isAdmin ? { id: 0, role: "admin", name: "管理員" } : null,
  };
}
