import {reduce, resolve} from "bluebird";
import {expect} from "chai";
import * as R from "ramda";
import * as kinesis from "../../../lambda-mock-events/lib/mocks/kinesis.js";
import run from "../../../lambda-mock-events/lib/run.js";

import {handler} from "index";
import * as mongodb from "common/mongodb";
import * as utils from "../utils";

describe("On sensor-reading", () => {

    const siteMonthReadingsAggregates = mongodb.collection("site-month-readings-aggregates");
    const sitePodMappings = mongodb.collection("site-pod-mappings");

    beforeEach(() => {
        return resolve()
            .then(() => (
                siteMonthReadingsAggregates.remove({})
            ))
            .then(() => (
                sitePodMappings.remove({})
            ))
            .then(() => (
                sitePodMappings.insert({podId: "podId", siteId: "siteId"})
            ));
    });

    it("creates a site-month-readings-aggregate element if it doesn't exist", () => {
        const event = kinesis.getEventFromObject(
            utils.getSensor("01/01/2015 00:00:00")
        );
        return run(handler, event)
            .then(() => {
                return siteMonthReadingsAggregates.count({});
            })
            .then(count => {
                expect(count).to.equal(1);
            });
    });

    describe("fills the correct properties of the site-month-readings-aggregate", () => {

        it("sensor reading", () => {
            const event = kinesis.getEventFromObject(
                utils.getSensor("01/01/2015 00:00:00")
            );
            return run(handler, event)
                .then(() => {
                    return siteMonthReadingsAggregates.findOne({_id: "podId-2015-01"});
                })
                .then(aggregate => {
                    expect(aggregate).to.deep.equal({
                        _id: "podId-2015-01",
                        podId: "podId",
                        month: "2015-01",
                        readings: {
                            "energia attiva": "0.808",
                            "energia reattiva": "-0.085",
                            "potenza massima": "0",
                            "temperature": null,
                            "humidity": null,
                            "illuminance": null,
                            "co2": null
                        }
                    });
                });
        });

        it("environment reading (temperature, humidity, illuminance)", () => {
            const event = kinesis.getEventFromObject(
                utils.getTemperatureHumidityIlluminance("01/01/2015 00:16:00")
            );
            return run(handler, event)
                .then(() => {
                    return siteMonthReadingsAggregates.findOne({_id: "podId-2015-01"});
                })
                .then(aggregate => {
                    expect(aggregate).to.deep.equal({
                        _id: "podId-2015-01",
                        podId: "podId",
                        month: "2015-01",
                        readings: {
                            "energia attiva": null,
                            "energia reattiva": null,
                            "potenza massima": null,
                            "temperature": ",,,21.4",
                            "humidity": ",,,49",
                            "illuminance": ",,,145",
                            "co2": null
                        }
                    });
                });
        });

        it("environment reading (co2)", () => {
            const event = kinesis.getEventFromObject(
                utils.getCO2("01/01/2015 00:00:00")
            );
            return run(handler, event)
                .then(() => {
                    return siteMonthReadingsAggregates.findOne({_id: "podId-2015-01"});
                })
                .then(aggregate => {
                    expect(aggregate).to.deep.equal({
                        _id: "podId-2015-01",
                        podId: "podId",
                        month: "2015-01",
                        readings: {
                            "energia attiva": null,
                            "energia reattiva": null,
                            "potenza massima": null,
                            "temperature": null,
                            "humidity": null,
                            "illuminance": null,
                            "co2": "446"
                        }
                    });
                });
        });

        it("all in one", () => {
            const dates = [
                "01/01/2015 00:00:00",
                "01/01/2015 00:05:00",
                "01/01/2015 00:15:00",
                "01/01/2015 00:45:00"
            ];
            const events = R.pipe(
                R.map(date => [
                    utils.getSensor(date),
                    utils.getTemperatureHumidityIlluminance(date),
                    utils.getCO2(date)
                ]),
                R.flatten,
                R.map(kinesis.getEventFromObject)
            )(dates);
            const runsPromise = reduce(
                events,
                (ignore, event) => run(handler, event),
                resolve()
            );
            return runsPromise
                .then(() => {
                    return siteMonthReadingsAggregates.findOne({_id: "podId-2015-01"});
                })
                .then(aggregate => {
                    expect(aggregate).to.deep.equal({
                        _id: "podId-2015-01",
                        podId: "podId",
                        month: "2015-01",
                        readings: {
                            "energia attiva": "0.808,0.808,,0.808,,,,,,0.808",
                            "energia reattiva": "-0.085,-0.085,,-0.085,,,,,,-0.085",
                            "potenza massima": "0,0,,0,,,,,,0",
                            "temperature": "21.4,21.4,,21.4,,,,,,21.4",
                            "humidity": "49,49,,49,,,,,,49",
                            "illuminance": "145,145,,145,,,,,,145",
                            "co2": "446,446,,446,,,,,,446"
                        }
                    });
                });
        });

    });

});
