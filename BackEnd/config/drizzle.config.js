import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./env.js";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the .env file");
}

export default defineConfig({
  schema: "./DATABASE/schema.js", //  schema file path
  out: "./DATABASE/drizzle", //  migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
