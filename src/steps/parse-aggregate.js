function parse (measure, parseFunc) {
    return measure !== null ? (
        measure
            .split(",")
            .map(value => parseFunc(value))
    ) : [];
}

export default function parseAggregate (aggregate) {
    return {
        ...aggregate,
        measurementValues: parse(aggregate.measurementValues, parseFloat),
        measurementTimes: parse(aggregate.measurementTimes, parseInt)
    };
}
