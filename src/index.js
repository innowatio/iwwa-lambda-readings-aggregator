import "babel-polyfill";
import router from "kinesis-router";

import handleReading from "./handle-reading";

export const handler = router()
    .on("element inserted in collection readings", handleReading);
