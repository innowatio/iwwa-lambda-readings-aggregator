import {map} from "bluebird";

import getSources from "./steps/get-sources";
import getAggregate from "./steps/get-aggregate";
import parseAggregate from "./steps/parse-aggregate";
import updateAggregate from "./steps/update-aggregate";
import stringifyAggregate from "./steps/stringify-aggregate";
import upsertAggregate from "./steps/upsert-aggregate";

export default async function handleReading (event) {
    const reading = event.data.element;
    const sources = reading.source ? [reading.source] : getSources(reading);
    await map(sources, async source => {
        const aggregate = await getAggregate(reading, source);
        const parsedAggregate = parseAggregate(aggregate);
        const updatedParsedAggregate = updateAggregate(parsedAggregate, reading, source);
        const updatedAggregate = stringifyAggregate(updatedParsedAggregate);
        await upsertAggregate(updatedAggregate);
    });
    return null;
}
