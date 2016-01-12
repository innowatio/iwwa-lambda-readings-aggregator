import moment from "moment";

import {
    AGGREGATES_COLLECTION_NAME,
    MEASUREMENTS_DELTA_IN_MS
} from "../common/config";
import mongodb from "../common/mongodb";

function getDayFromReading (reading) {
    return moment.utc(reading.date, moment.ISO_8601, true).format("YYYY-MM-DD");
}

function getAggregateId (reading, source) {
    return `${source}-${reading.sensorId}-${getDayFromReading(reading)}`;
}

function getDefaultAggregate (reading, source) {
    return {
        _id: getAggregateId(reading, source),
        sensorId: reading.sensorId,
        source,
        day: getDayFromReading(reading),
        measurements: {},
        measurementsDeltaInMs: MEASUREMENTS_DELTA_IN_MS
    };
}

export default async function getAggregate (reading, source) {
    const db = await mongodb;
    const aggregate = await db
        .collection(AGGREGATES_COLLECTION_NAME)
        .findOne({_id: getAggregateId(reading, source)});
    return aggregate || getDefaultAggregate(reading, source);
}
