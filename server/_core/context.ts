import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
// import { sdk } from "./sdk"; // 不再需要 sdk

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user?: User | null; // user 現在是可選的，因為可能通過密碼驗證注入
  adminPassword?: string; // 新增 adminPassword 屬性
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  // 從請求頭中抓取我們自定義的密碼標籤
  const adminPassword = opts.req.headers["x-admin-password"];

  return {
    req: opts.req,
    res: opts.res,
    adminPassword: typeof adminPassword === "string" ? adminPassword : undefined,
  };
}
