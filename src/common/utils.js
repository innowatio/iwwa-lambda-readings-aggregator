import {resolve} from "bluebird";
import moment from "moment";

import * as mongodb from "./mongodb";

export function getMonthFromReading (reading) {
    return moment(reading.date).format("YYYY-MM");
}

export function getIdFromReading (reading) {
    return `${reading.podId}-${getMonthFromReading(reading)}`;
}

export function convertReadingDate (dateString) {
    const date = moment(dateString, "DD/MM/YYYY HH:mm:ss");
    const minute = date.get("minute");
    const previousFifthMinute = minute - (minute % 5);
    // Notice: the `set` method mutates `date`
    date.set({
        minute: previousFifthMinute,
        second: 0,
        millisecond: 0
    });
    return date.valueOf();
}

export function getPodIdFromReading (reading) {
    if (reading.podId) {
        return resolve(reading.podId);
    } else {
        const collection = mongodb.collection("site-pod-mappings");
        return collection.findOne({siteId: reading.siteId})
            .then(mapping => mapping.podId);
    }
}
