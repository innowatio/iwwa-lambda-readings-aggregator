import moment from "moment";

export default function updateAggregate (aggregate, reading) {
    const value = parseFloat(reading.measurementValue);
    const time = moment.utc(reading.date).valueOf();

    const filteredMeasurements = aggregate.measurements.filter(x => x.time != time);
    const updatedMeasurements = [...filteredMeasurements, {
        value,
        time
    }];

    const sortedMeasurements = updatedMeasurements.sort((x, y) => x.time - y.time);

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
