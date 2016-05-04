import moment from "moment";

export default function updateAggregate (aggregate, reading) {
    var value = parseFloat(reading.measurementValue);
    var time = moment.utc(reading.date).valueOf();

    var filteredMeasurements = aggregate.measurements.filter(x => x.time != time);
    var updatedMeasurements = [...filteredMeasurements, {
        value,
        time
    }];

    var sortedMeasurements = updatedMeasurements.sort((x, y) => x.time > y.time);

    return {
        _id: aggregate._id,
        day: aggregate.day,
        sensorId: aggregate.sensorId,
        source: aggregate.source,
        measurementType: aggregate.measurementType,
        unitOfMeasurement: aggregate.unitOfMeasurement,
        measurementValues: sortedMeasurements.map(x => x.value),
        measurementTimes: sortedMeasurements.map(x => x.time)
    };
}
