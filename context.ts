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

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // 若登入的 email 為管理員信箱，強制補上 admin role
  if (user && user.email === '114774@csps.tn.edu.tw' && user.role !== 'admin') {
    user = { ...user, role: 'admin' };
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
