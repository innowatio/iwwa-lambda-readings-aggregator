function parse (measure, parseFunc) {
    return measure !== null ? (
        measure
            .split(",")
            .map(value => parseFunc(value))
    ) : [];
}

export default function parseAggregate (aggregate) {
    var measurementValues = parse(aggregate.measurementValues, parseFloat);
    var measurementTimes = parse(aggregate.measurementTimes, parseInt);
    var measurements = measurementValues.map((value, index) => {
        return {
            value: value,
            time: measurementTimes[index]
        };
    }).sort((x, y) => x.time > y.time);
    
    return {
        ...aggregate,
        measurements 
    };
}
