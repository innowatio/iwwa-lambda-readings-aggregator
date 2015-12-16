import * as config from "../common/config";
import {collection} from "../common/mongodb";

export default function getSiteId (reading) {
    if (!reading) {
        return null;
    }
    return collection(config.SITES_COLLECTION_NAME)
        .findOne({
            sensorsIds: {
                $in: [reading.sensorId]
            }
        })
        .then(site => site && site._id);
}
