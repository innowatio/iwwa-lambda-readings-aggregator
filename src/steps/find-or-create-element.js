import {getIdFromReading, getMonthFromReading} from "../common/utils";

function getDefaultElement (reading) {
    return {
        _id: getIdFromReading(reading),
        podId: reading.podId,
        month: getMonthFromReading(reading),
        readings: {
            "energia attiva": null,
            "energia reattiva": null,
            "potenza massima": null,
            "temperature": null,
            "humidity": null,
            "illuminance": null,
            "co2": null
        }
    };
}

export default function findOrCreateElement () {
    const _id = getIdFromReading(this.reading);
    return this.collection.findOne({_id})
        .then(element => element || getDefaultElement(this.reading));
}
