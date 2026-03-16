import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse } from "cookie";

export async function createContext(opts: CreateExpressContextOptions) {
  // 從 Cookie 中解析 admin_token
  const cookieHeader = opts.req.headers.cookie || "";
  const cookies = parse(cookieHeader);
  const adminToken = cookies.admin_token;
  
  // 檢查 admin_token 是否存在（即表示已驗證）
  const isAuthenticated = adminToken === "114774";

  return {
    req: opts.req,
    res: opts.res,
    isAuthenticated,
    user: isAuthenticated ? { id: 0, role: "admin", name: "青山管理員" } : null,
  };
}
