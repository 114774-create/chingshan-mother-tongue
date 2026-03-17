import { createHTTPHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "./routers.js";
import { createContext } from "./context.js";

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
});

export default handler;
