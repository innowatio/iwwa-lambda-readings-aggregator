import moment from "moment";

import {MEASUREMENTS_DELTA_IN_MS} from "../common/config";

function convertReadingDate (dateString) {
    const dateInMs = moment.utc(dateString, moment.ISO_8601, true).valueOf();
    return dateInMs - (dateInMs % MEASUREMENTS_DELTA_IN_MS);
}

function getOffset (reading) {
    const date = convertReadingDate(reading.date);
    const startOfDay = moment.utc(date).startOf("day").valueOf();
    return (date - startOfDay) / MEASUREMENTS_DELTA_IN_MS;
}

function updateMeasurementValues (measurementValues, offset, measurementValue) {
    /*
    *   Updating the measurementValues array without modifying it:
    *       - clone the array
    *       - update the clone at the correct index
    *       - return the clone
    */
    const measurementValuesClone = measurementValues.slice(0);
    measurementValuesClone[offset] = parseFloat(measurementValue);
    return measurementValuesClone;
}

export default function updateAggregate (aggregate, reading) {
    const offset = getOffset(reading);
    return {
        ...aggregate,
        measurementValues: updateMeasurementValues(
            aggregate.measurementValues, offset, reading.measurementValue
        )
    };
}
