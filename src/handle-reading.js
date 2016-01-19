import assert from "assert";
import {map} from "bluebird";
import {is, path} from "ramda";

// TODO naming
import getAggregate from "./steps/get-aggregate";
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

// TODO naming
function unpackReading (reading) {
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

// TODO naming
async function aggregatePipeline (reading) {
    const aggregate = await getAggregate(reading);
    const parsedAggregate = parseAggregate(aggregate);
    const updatedParsedAggregate = updateAggregate(parsedAggregate, reading);
    const updatedAggregate = stringifyAggregate(updatedParsedAggregate);
    return upsertAggregate(updatedAggregate);
}

export default async function handleReading (event) {
    const rawReading = event.data.element;
    const readings = unpackReading(rawReading);
    await map(readings, aggregatePipeline);
    return null;
}
