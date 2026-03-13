import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers"; // 注意：這裡改為 ./routers
import { createContext } from "./context"; // 注意：這裡改為 ./context
import { serveStatic } from "./server/_core/vite";

const app = express(); // 確保這一行存在！

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

export default app;
serveStatic(app);

export default app;
