import router from "kinesis-router";

import handleReading from "./handle-reading";

export const handler = router()
    .on("element inserted in collection sensor-readings", handleReading)
    .on("element inserted in collection environment-readings", handleReading);
