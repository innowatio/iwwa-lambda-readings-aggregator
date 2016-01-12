import {dropRepeats} from "ramda";

export default function getSources (reading) {
    return dropRepeats(
        reading.measurements
            .map(measurement => measurement.source.toLowerCase())
            .sort()
    );
}
