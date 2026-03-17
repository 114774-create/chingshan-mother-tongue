import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "./routers.js";
import { createContext } from "./context.js";

const app = express();

app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
