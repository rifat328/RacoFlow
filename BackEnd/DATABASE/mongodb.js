import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Database URI is not defined, please define DB_URI inside .env.development/production.local  environment file",
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`connected to the database successfully in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting to the databse:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
