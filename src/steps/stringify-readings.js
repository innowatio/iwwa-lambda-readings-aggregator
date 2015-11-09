import {isEmpty, map} from "ramda";

function strinfigyReading (reading) {
    return isEmpty(reading) ? null : reading.join(",");
}

export default function stringifyReadings (element) {
    return {
        ...element,
        readings: map(strinfigyReading, element.readings)
    };
}
