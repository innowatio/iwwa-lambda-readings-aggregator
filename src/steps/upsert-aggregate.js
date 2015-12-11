import * as config from "../common/config";
import {collection} from "../common/mongodb";

const aggregates = collection(config.AGGREGATES_COLLECTION_NAME);

export default function upsertAggregate (aggregate) {
    return aggregates.update(
        {_id: aggregate._id},
        aggregate,
        {upsert: true}
    );
}
