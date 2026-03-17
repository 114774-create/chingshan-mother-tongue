iimport type { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";

export type TrpcContext = {
  req: any;
  res: any;
  user?: any;
  isAuthenticated: boolean;
};

export async function createContext(
  opts: NodeHTTPCreateContextFnOptions
): Promise<TrpcContext> {

  const adminPassword = opts.req.headers["x-admin-password"];
  const expectedPassword = process.env.ADMIN_PASSWORD;

  const isAdmin =
    typeof adminPassword === "string" &&
    expectedPassword !== undefined &&
    adminPassword === expectedPassword;

  return {
    req: opts.req,
    res: opts.res,
    user: isAdmin ? { id: 0, role: "admin", name: "管理員" } : null,
    isAuthenticated: isAdmin,
  };
}
