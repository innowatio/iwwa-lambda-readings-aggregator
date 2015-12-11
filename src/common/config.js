import dotenv from "dotenv";
dotenv.load();

export const MONGODB_URL = process.env.MONGODB_URL;
export const AGGREGATES_COLLECTION_NAME = "site-month-readings-aggregates";
export const SENSORS_COLLECTION_NAME = "sensors";
export const DEBUG = process.env.DEBUG;
