import makePipeline from "./common/make-pipeline";
import * as mongodb from "./common/mongodb";
import {getPodIdFromReading, convertReadingDate} from "./common/utils";

import findOrCreateElement from "./steps/find-or-create-element";
import parseReadings from "./steps/parse-readings";
import updateReadings from "./steps/update-readings";
import stringifyReadings from "./steps/stringify-readings";
import upsertElement from "./steps/upsert-element";

const collection = mongodb.collection("site-month-readings-aggregates");
const pipeline = makePipeline(
    findOrCreateElement,
    parseReadings,
    updateReadings,
    stringifyReadings,
    upsertElement
);

function parseReading (reading) {
    return getPodIdFromReading(reading).then(podId => ({
        podId: podId,
        date: convertReadingDate(reading.date),
        measurements: reading.measurements
    }));
}

export default function handleReading ({data}) {
    return parseReading(data.element).then(
        reading => pipeline(null, {collection, reading})
    );
}
