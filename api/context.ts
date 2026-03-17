import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import { parse } from "cookie";

export async function createContext(
  opts: NodeHTTPCreateContextFnOptions<any, any>
) {
  const cookieHeader = opts.req.headers.cookie || "";
  const cookies = parse(cookieHeader);
  const adminToken = cookies.admin_token;
  const isAuthenticated = adminToken === "114774";

  return {
    req: opts.req,
    res: opts.res,
    isAuthenticated,
    user: isAuthenticated ? { id: 0, role: "admin", name: "青山管理員" } : null,
  };
}
```

這三個改動完成後，登入流程才會完整通：
```
前端呼叫 auth.login
→ api/trpc.ts 接收（node-http）
→ api/context.ts 建立 context（node-http，讀 cookie）
→ api/routers.ts 的 login mutation 執行
→ 設定 cookie 回傳 { success: true }
