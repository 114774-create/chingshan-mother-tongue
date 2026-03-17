import { parse } from "cookie";

export async function createContext({ req }: { req: any }) {
  const cookieHeader = req.headers?.get?.("cookie") || req.headers?.cookie || "";
  const cookies = parse(cookieHeader);
  const adminPassword = req.headers?.get?.("x-admin-password") 
    || req.headers?.["x-admin-password"] 
    || "";

  const isAuthenticated = adminPassword === "114774";

  return {
    req,
    res: null,
    isAuthenticated,
    user: isAuthenticated ? { id: 0, role: "admin", name: "青山管理員" } : null,
  };
}
