import assert from "assert";
import {map} from "bluebird";
import {is, path} from "ramda";

import getOrCreateAggregate from "./steps/get-or-create-aggregate";
import parseAggregate from "./steps/parse-aggregate";
import updateAggregate from "./steps/update-aggregate";
import stringifyAggregate from "./steps/stringify-aggregate";
import upsertAggregate from "./steps/upsert-aggregate";

function getReadingSource (reading) {
    const source = (
        reading.source ?
        reading.source :
        path(["measurements", "0", "source"], reading)
    );
    assert(is(String, source), "Reading has no source");
    return source;
}

function spreadReadingByMeasurementType (reading) {
    const source = getReadingSource(reading);
    return reading.measurements.map(measurement => ({
        sensorId: reading.sensorId,
        date: reading.date,
        source,
        measurementType: measurement.type,
        measurementValue: measurement.value,
        unitOfMeasurement: measurement.unitOfMeasurement
    }));
}

async function updateAggregateWithReading (reading) {
    const aggregate = await getOrCreateAggregate(reading);
    const parsedAggregate = parseAggregate(aggregate);
    const updatedParsedAggregate = updateAggregate(parsedAggregate, reading);
    const updatedAggregate = stringifyAggregate(updatedParsedAggregate);
    return upsertAggregate(updatedAggregate);
}

export default async function handleReading (event) {
    const rawReading = event.data.element;
    const readings = spreadReadingByMeasurementType(rawReading);
    await map(readings, updateAggregateWithReading);
    return null;
}
