import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;

  // 檢查是否有特定的管理員標識，例如在請求頭中
  // 這裡我們直接硬編碼，只要是這個 Email，就直接賦予 admin 權限
  // 為了簡化，我們假設在 `adminProcedure` 中會處理更直接的身份注入
  // 因此這裡的 `createContext` 仍然會嘗試認證，但會強制覆蓋角色
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }

  // 如果用戶存在且 Email 符合，強制設定為 admin
  if (user && user.email === '114774@csps.tn.edu.tw') {
    user = { ...user, role: 'admin', id: user.id || 999, openId: user.openId || 'hardcoded_admin' };
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
