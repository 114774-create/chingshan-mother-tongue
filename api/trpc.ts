import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./routers.js";
import { createContext } from "./context.js";

export default async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req } as any),
  });
}
