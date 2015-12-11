import * as config from "../common/config";
import {collection} from "../common/mongodb";

export default function getSiteId (reading) {
    return collection(config.SENSORS_COLLECTION_NAME)
        .findOne({_id: reading.sensorId})
        .then(sensor => sensor.siteId);
}
