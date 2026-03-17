import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse } from "cookie";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const adminPassword = req.headers["x-admin-password"] || "";
  const isAuthenticated = adminPassword === "114774";

  return {
    req,
    res,
    isAuthenticated,
    user: isAuthenticated ? { id: 0, role: "admin", name: "青山管理員" } : null,
  };
}
