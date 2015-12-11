import {map} from "ramda";

function parseMeasurement (measurement) {
    return measurement !== null ? (
        measurement
            .split(",")
            .map(value => parseFloat(value))
            .map(value => isNaN(value) ? null : value)
    ) : [];
}

export default function parseAggregate (aggregate) {
    return {
        ...aggregate,
        measurements: map(parseMeasurement, aggregate.measurements)
    };
}
