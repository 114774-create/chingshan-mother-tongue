import { createHTTPHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "./routers.js";    // ✅ 加 .js
import { createContext } from "./context.js"; // ✅ 加 .js

export default createHTTPHandler({
  router: appRouter,
  createContext,
});
