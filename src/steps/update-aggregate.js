import moment from "moment";
import {is} from "ramda";

const fiveMinutesInMilliseconds = 5 * 60 * 1000;

function convertReadingDate (dateString) {
    const date = moment.utc(dateString, moment.ISO_8601, true);
    const minute = date.get("minute");
    const previousFifthMinute = minute - (minute % 5);
    // Notice: the `set` method mutates `date`
    date.set({
        minute: previousFifthMinute,
        second: 0,
        millisecond: 0
    });
    return date.valueOf();
}

function getOffset (reading) {
    const date = convertReadingDate(reading.date);
    const startOfMonth = moment.utc(date).startOf("month").valueOf();
    return (date - startOfMonth) / fiveMinutesInMilliseconds;
}

function updateMeasurement (aggregateMeasurement, offset, value) {
    const measurement = (
        is(Array, aggregateMeasurement) ?
        aggregateMeasurement.slice(0) :
        []
    );
    // Notice: mutating array measurement
    measurement[offset] = parseFloat(value);
    return measurement;
}

function updateMeasurements (aggregate, reading) {
    const offset = getOffset(reading);
    return reading.measurements.reduce((aggregateMeasurements, readingMeasurement) => {
        const {type, value} = readingMeasurement;
        return {
            ...aggregateMeasurements,
            [type]: updateMeasurement(aggregateMeasurements[type], offset, value)
        };
    }, aggregate.measurements);
}

export default function updateAggregate (aggregate, reading) {
    return {
        ...aggregate,
        measurements: updateMeasurements(aggregate, reading)
    };
}
