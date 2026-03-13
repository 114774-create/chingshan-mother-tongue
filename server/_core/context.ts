import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
// import { sdk } from "./sdk"; // 不再需要 sdk

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// 最終繞道：createContext 永遠回傳一個硬編碼的管理員物件
export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  return {
    req: opts.req,
    res: opts.res,
    user: {
      id: 1, // 硬編碼 ID
      openId: 'hardcoded_admin_bypass',
      email: '114774@csps.tn.edu.tw',
      role: 'admin',
      name: '青山管理員',
      loginMethod: 'hardcoded',
      lastSignedIn: new Date(),
    },
  };
}
