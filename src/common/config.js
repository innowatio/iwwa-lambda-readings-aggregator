import dotenv from "dotenv";
dotenv.load();

export const MONGODB_URL = process.env.MONGODB_URL;
export const DEBUG = process.env.DEBUG;
