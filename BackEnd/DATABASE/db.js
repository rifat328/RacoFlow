import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { DATABASE_URL } from "../config/env.js";
import * as schema from "./schema.js";

if (DATABASE_URL)
  throw new Error(
    "Database URI is not defined, please define DB_URI inside .env.development/production.local  environment file",
  );
const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
