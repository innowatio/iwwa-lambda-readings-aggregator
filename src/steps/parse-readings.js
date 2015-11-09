import {map} from "ramda";

function parseReading (reading) {
    return reading !== null ? (
        reading
            .split(",")
            .map(value => parseFloat(value))
            .map(value => isNaN(value) ? null : value)
    ) : [];
}

export default function parseReadings (element) {
    return {
        ...element,
        readings: map(parseReading, element.readings)
    };
}
