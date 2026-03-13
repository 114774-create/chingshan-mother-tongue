import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// 注意：在 ESM 模式下，即便檔案是 .ts，這裡有時候也要寫 .js 才能讓 Vercel 認得
import { appRouter } from "./routers.js"; 
import { createContext } from "./context.js"; 
import { serveStatic } from "../server/_core/vite.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

serveStatic(app);

// 確保只有一個出口
export default app;
