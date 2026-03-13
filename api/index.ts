import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
// 1. 如果 oauth.ts 在 server/_core 裡
import { registerOAuthRoutes } from "../server/_core/oauth"; 

// 2. 注意這裡！！如果 routers.ts 在根目錄，就要改為 ../routers
// 如果它在 server 資料夾裡，就保持 ../server/routers
import { appRouter } from "../server/routers"; 

// 3. 注意這裡！！如果 context.ts 在根目錄，就要改為 ../context
// 如果它在 server/_core 裡，就保持 ../server/_core/context
import { createContext } from "../server/_core/context"; 

import { serveStatic } from "../server/_core/vite";

const app = express();

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
