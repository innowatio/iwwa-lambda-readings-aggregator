import getSiteId from "./steps/get-site-id";
import getAggregate from "./steps/get-aggregate";
import parseAggregate from "./steps/parse-aggregate";
import updateAggregate from "./steps/update-aggregate";
import stringifyAggregate from "./steps/stringify-aggregate";
import upsertAggregate from "./steps/upsert-aggregate";

export default async function handleReading (event) {
    const reading = event.data.element;
    const siteId = await getSiteId(reading);
    if (!siteId) {
        return null;
    }
    const aggregate = await getAggregate(siteId, reading);
    const parsedAggregate = parseAggregate(aggregate);
    const updatedParsedAggregate = updateAggregate(parsedAggregate, reading);
    const updatedAggregate = stringifyAggregate(updatedParsedAggregate);
    await upsertAggregate(updatedAggregate);
    return null;
}
