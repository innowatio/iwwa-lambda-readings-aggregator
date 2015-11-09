export default function upsertElement (element) {
    return this.collection.update(
        {_id: element._id},
        element,
        {upsert: true}
    ).then(() => null);
}
