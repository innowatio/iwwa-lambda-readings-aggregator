import {MongoClient} from "mongodb";

import {MONGODB_URL} from "./config";

const connection = MongoClient.connect(MONGODB_URL);
const methods = [
    "count",
    "find",
    "findOne",
    "insert",
    "remove",
    "update"
];

function wrap (methodName, collectionName) {
    return (...args) => connection.then(db => {
        const collection = db.collection(collectionName);
        return collection[methodName](...args);
    });
}

export function collection (collectionName) {
    return methods.reduce((collection, method) => ({
        ...collection,
        [method]: wrap(method, collectionName)
    }), {});
}
