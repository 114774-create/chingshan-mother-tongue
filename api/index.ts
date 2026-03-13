import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth"; 

// --- 關鍵修正區 ---
// 如果 routers.ts 是在最外面，就把 ../server/ 拿掉，改為 ../routers
import { appRouter } from "../routers"; 

// 如果 context.ts 也是在最外面，就改為 ../context
import { createContext } from "../context"; 
// ----------------

import { serveStatic } from "../server/_core/vite";
// ...後面保持不變

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 2. 這行也先關掉，我們用萬能密碼登入，不需要 oauth
// registeroauthRoutes(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

serveStatic(app);

export default app;
