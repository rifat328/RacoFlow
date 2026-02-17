import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  ARCJET_KEY,
  SERVER,
  CORS_ORIGIN,
} = process.env;
