import dotenv from "dotenv";

dotenv.load();

export const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/test";
export const AGGREGATES_COLLECTION_NAME = process.env.AGGREGATES_COLLECTION_NAME || "readings-daily-aggregates";
export const SITES_COLLECTION_NAME = "sites";
export const DEBUG = process.env.DEBUG;
