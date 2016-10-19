import {AGGREGATES_COLLECTION_NAME} from "../common/config";
import {getMongoClient} from "../common/mongodb";

export default async function upsertAggregate (aggregate) {
    const db = await getMongoClient();
    return db.collection(AGGREGATES_COLLECTION_NAME).update(
        {_id: aggregate._id},
        aggregate,
        {upsert: true}
    );
}
