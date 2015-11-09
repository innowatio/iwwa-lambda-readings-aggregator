import moment from "moment";

const fiveMinutesInMilliseconds = 5 * 60 * 1000;

function getOffset (date) {
    const startOfMonth = moment(date).startOf("month").valueOf();
    return (date - startOfMonth) / fiveMinutesInMilliseconds;
}

export default function updateReadings (element) {
    const {date, measurements} = this.reading;
    const offset = getOffset(date);
    return {
        ...element,
        readings: measurements.reduce((readings, {type, value}) => {
            const reading = readings[type].slice(0);
            // Notice: mutating array reading
            reading[offset] = parseFloat(value);
            return {
                ...readings,
                [type]: reading
            };
        }, element.readings)
    };
}
