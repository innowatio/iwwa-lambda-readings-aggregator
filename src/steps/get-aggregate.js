import moment from "moment";

import {
    AGGREGATES_COLLECTION_NAME,
    MEASUREMENTS_DELTA_IN_MS
} from "../common/config";
import mongodb from "../common/mongodb";

function getDayFromReading (reading) {
    return moment.utc(reading.date, moment.ISO_8601, true).format("YYYY-MM-DD");
}

function getAggregateId (reading) {
    return `${reading.sensorId}-${getDayFromReading(reading)}`;
}

function getDefaultAggregate (reading) {
    return {
        _id: getAggregateId(reading),
        sensorId: reading.sensorId,
        day: getDayFromReading(reading),
        measurements: {},
        measurementsDeltaInMs: MEASUREMENTS_DELTA_IN_MS
    };
}

export default async function getAggregate (reading) {
    const db = await mongodb;
    const aggregate = await db
        .collection(AGGREGATES_COLLECTION_NAME)
        .findOne({_id: getAggregateId(reading)});
    return aggregate || getDefaultAggregate(reading);
}
