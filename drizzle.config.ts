import { defineConfig } from "drizzle-kit";

const url = `postgres://${process.env.VITE_DB_USER}:${process.env.VITE_DB_PASSWORD}@${process.env.VITE_DB_HOST}:${process.env.VITE_DB_PORT}/${process.env.VITE_DB_NAME}`;
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url,
  },
});
