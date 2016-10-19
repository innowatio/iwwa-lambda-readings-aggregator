import moment from "moment";

import {
    AGGREGATES_COLLECTION_NAME
} from "../common/config";
import {getMongoClient} from "../common/mongodb";

function getDayFromReading (date) {
    return moment.utc(date, moment.ISO_8601, true).format("YYYY-MM-DD");
}

function getAggregateId (reading) {
    const {sensorId, date, source, measurementType} = reading;
    return `${sensorId}-${getDayFromReading(date)}-${source}-${measurementType}`;
}

function getDefaultAggregate (reading) {
    const {sensorId, date, source, measurementType, unitOfMeasurement} = reading;
    return {
        _id: getAggregateId(reading),
        day: getDayFromReading(date),
        sensorId,
        source,
        measurementType,
        measurementValues: null,
        measurementTimes: null,
        unitOfMeasurement
    };
}

export default async function getOrCreateAggregate (reading) {
    const db = await getMongoClient();
    const aggregate = await db
        .collection(AGGREGATES_COLLECTION_NAME)
        .findOne({_id: getAggregateId(reading)});
    return aggregate || getDefaultAggregate(reading);
}
