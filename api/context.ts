import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import { parse } from "cookie";

export async function createContext(
  opts: NodeHTTPCreateContextFnOptions<any, any>
) {
  const cookieHeader = opts.req.headers.cookie || "";
  const cookies = parse(cookieHeader);
  const adminPassword = opts.req.headers["x-admin-password"] || "";

  const isAuthenticated = adminPassword === "114774";

  return {
    req: opts.req,
    res: opts.res,
    isAuthenticated,
    user: isAuthenticated ? { id: 0, role: "admin", name: "青山管理員" } : null,
  };
}
