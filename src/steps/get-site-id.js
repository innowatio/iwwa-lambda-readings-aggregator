import * as config from "../common/config";
import {collection} from "../common/mongodb";

export default function getSiteId (reading) {
    return collection(config.SITES_COLLECTION_NAME)
        .findOne({
            sensorIds: {
                $in: [reading.sensorId]
            }
        })
        .then(site => site && site._id);
}
