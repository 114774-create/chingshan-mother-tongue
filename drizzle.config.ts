import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./drizzle/schema.ts", // 如果您的 schema 在別處請調整路徑
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
