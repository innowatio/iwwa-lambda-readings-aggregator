import moment from "moment";

import * as config from "../common/config";
import {collection} from "../common/mongodb";

function getMonthFromReading (reading) {
    return moment.utc(reading.date, moment.ISO_8601, true).format("YYYY-MM");
}

function getAggregateId (siteId, reading) {
    return `${siteId}-${getMonthFromReading(reading)}`;
}

function getDefaultAggregate (siteId, reading) {
    return {
        _id: getAggregateId(siteId, reading),
        siteId: siteId,
        month: getMonthFromReading(reading),
        measurements: {}
    };
}

export default function getAggregate (siteId, reading) {
    return collection(config.AGGREGATES_COLLECTION_NAME)
        .findOne({_id: getAggregateId(siteId, reading)})
        .then(aggregate => aggregate || getDefaultAggregate(siteId, reading));
}
