import moment from "moment";
import {is, filter, partial} from "ramda";

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

function updateMeasurement (aggregateMeasurement, offset, value) {
    const measurement = (
        is(Array, aggregateMeasurement) ?
        // Clone the array to avoid modifying it
        aggregateMeasurement.slice(0) :
        []
    );
    // Notice: mutating array measurement
    measurement[offset] = parseFloat(value);
    return measurement;
}

function updateMeasurements (aggregate, measurements, offset) {
    return measurements.reduce((aggregateMeasurements, readingMeasurement) => {
        const {type, value} = readingMeasurement;
        return {
            ...aggregateMeasurements,
            [type]: updateMeasurement(aggregateMeasurements[type], offset, value)
        };
    }, aggregate.measurements);
}

function filterCriteria (source, measurement) {
    return measurement.source === source;
}

export default function updateAggregate (aggregate, reading, source) {
    const offset = getOffset(reading);
    const measurementsBySource = reading.source ?
        reading.measurements :
        filter(partial(filterCriteria, [source]), reading.measurements);
    return {
        ...aggregate,
        measurements: updateMeasurements(aggregate, measurementsBySource, offset)
    };
}
