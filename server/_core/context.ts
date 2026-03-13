import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext() {
  // 這裡強行偽造一個管理員身分
  return {
    user: {
      id: 1,
      openId: 'admin_bypass',
      email: '114774@csps.tn.edu.tw',
      role: 'admin',
      name: '青山管理員'
    }
  };
}
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
