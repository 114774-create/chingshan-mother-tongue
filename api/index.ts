import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// 注意：這裡改為 ../ 因為檔案在 api 資料夾的外面
import { appRouter } from "../routers"; 
import { createContext } from "../context"; 
import { serveStatic } from "../server/_core/vite";

const app = express();

// 設定傳輸限制，方便您上傳大影片
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API 入口
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// 配置靜態檔案
serveStatic(app);

// 【關鍵修正】這裡只能有一個 export default，解決 TS2528 錯誤
export default app;
