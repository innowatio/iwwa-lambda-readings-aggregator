import {isEmpty, map} from "ramda";

function strinfigyMeasurement (measurement) {
    return isEmpty(measurement) ? null : measurement.join(",");
}

export default function stringifyAggregate (aggregate) {
    return {
        ...aggregate,
        measurements: map(strinfigyMeasurement, aggregate.measurements)
    };
}
