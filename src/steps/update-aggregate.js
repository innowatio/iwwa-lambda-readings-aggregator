import moment from "moment";

export default function updateAggregate (aggregate, reading) {
    var readingValue = parseFloat(reading.measurementValue);
    var readingTime = moment.utc(reading.date).valueOf();

    var measurementValues = [...aggregate.measurementValues];
    var measurementTimes = [...aggregate.measurementTimes];
    
    var indexExist = aggregate.measurementTimes.indexOf(readingTime);
    if (indexExist >= 0) {
        measurementValues[indexExist] = readingValue;
    }
    
    return {
        ...aggregate,
        measurementValues: [...measurementValues, readingValue],
        measurementTimes: [...measurementTimes, readingTime]
    };
}
