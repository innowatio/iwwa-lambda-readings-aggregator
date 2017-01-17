import bunyan from "bunyan";

import {LOG_LEVEL} from "./config";

export default bunyan.createLogger({
    name: "readings-aggregator",
    level: (process.env.NODE_ENV === "test" && !process.env.LOG_LEVEL) ? "fatal" : LOG_LEVEL
});
