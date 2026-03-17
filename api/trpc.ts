import { createHTTPHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

export default createHTTPHandler({
  router: appRouter,
  createContext,
});
