import { createHTTPHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "./routers";         // ✅ 改這裡
import { createContext } from "./context";      // ✅ 改這裡

export default createHTTPHandler({
  router: appRouter,
  createContext,
});
