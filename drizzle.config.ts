import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./drizzle/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    // 這裡我們直接從環境變數抓網址
    url: process.env.DATABASE_URL!,
  },
});
