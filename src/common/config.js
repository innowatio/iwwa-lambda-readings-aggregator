import dotenv from "dotenv";
import moment from "moment";

dotenv.load();

export const MONGODB_URL = process.env.MONGODB_URL;
export const MEASUREMENTS_DELTA_IN_MS = moment.duration(5, "minutes").asMilliseconds();
export const AGGREGATES_COLLECTION_NAME = "readings-daily-aggregates";
export const SITES_COLLECTION_NAME = "sites";
export const DEBUG = process.env.DEBUG;
