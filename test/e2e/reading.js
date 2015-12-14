import {all, reduce, resolve} from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import * as R from "ramda";

chai.use(chaiAsPromised);

import {handler} from "index";
import * as mongodb from "common/mongodb";
import * as utils from "../utils";
import {getEventFromObject, run} from "../mock";

describe("On reading", () => {

    const siteMonthReadingsAggregates = mongodb.collection("site-month-readings-aggregates");
    const sites = mongodb.collection("sites");

    beforeEach(() => {
        return resolve()
            .then(() => all([
                siteMonthReadingsAggregates.remove({}),
                sites.remove({})
            ]))
            .then(() => all([
                sites.insert({_id: "siteId", sensorsIds: ["sensorId"]})
            ]));
    });

    it("creates a site-month-readings-aggregate element if it doesn't exist", () => {
        const event = getEventFromObject(
            utils.getSensor("2015-01-01T00:02:00.000Z")
        );
        return run(handler, event)
            .then(() => {
                return siteMonthReadingsAggregates.count({});
            })
            .then(count => {
                expect(count).to.equal(1);
            });
    });

    describe("fills the correct properties of the site-month-readings-aggregate:", () => {

        it("electrical reading", () => {
            const event = getEventFromObject(
                utils.getSensor("2015-01-01T00:00:30.000Z")
            );
            return run(handler, event)
                .then(() => {
                    return siteMonthReadingsAggregates.findOne({_id: "siteId-2015-01"});
                })
                .then(aggregate => {
                    expect(aggregate).to.deep.equal({
                        _id: "siteId-2015-01",
                        siteId: "siteId",
                        month: "2015-01",
                        measurements: {
                            "activeEnergy": "0.808",
                            "reactiveEnergy": "-0.085",
                            "maxPower": "0"
                        }
                    });
                });
        });

        it("environment reading (temperature, humidity, illuminance)", () => {
            const event = getEventFromObject(
                utils.getTemperatureHumidityIlluminance("2015-01-01T00:16:00.000Z")
            );
            return run(handler, event)
                .then(() => {
                    return siteMonthReadingsAggregates.findOne({_id: "siteId-2015-01"});
                })
                .then(aggregate => {
                    expect(aggregate).to.deep.equal({
                        _id: "siteId-2015-01",
                        siteId: "siteId",
                        month: "2015-01",
                        measurements: {
                            "temperature": ",,,21.4",
                            "humidity": ",,,49",
                            "illuminance": ",,,145"
                        }
                    });
                });
        });

        it("environment reading (co2)", () => {
            const event = getEventFromObject(
                utils.getCO2("2015-01-01T00:00:11.000Z")
            );
            return run(handler, event)
                .then(() => {
                    return siteMonthReadingsAggregates.findOne({_id: "siteId-2015-01"});
                })
                .then(aggregate => {
                    expect(aggregate).to.deep.equal({
                        _id: "siteId-2015-01",
                        siteId: "siteId",
                        month: "2015-01",
                        measurements: {
                            "co2": "446"
                        }
                    });
                });
        });

        it("all in one", () => {
            const dates = [
                "2015-01-01T00:00:00.000Z",
                "2015-01-01T00:06:00.000Z",
                "2015-01-01T00:15:00.000Z",
                "2015-01-01T00:47:00.000Z"
            ];
            const events = R.pipe(
                R.map(date => [
                    utils.getSensor(date),
                    utils.getTemperatureHumidityIlluminance(date),
                    utils.getCO2(date)
                ]),
                R.flatten,
                R.map(getEventFromObject)
            )(dates);
            const runsPromise = reduce(
                events,
                (ignore, event) => run(handler, event),
                resolve()
            );
            return runsPromise
                .then(() => {
                    return siteMonthReadingsAggregates.findOne({_id: "siteId-2015-01"});
                })
                .then(aggregate => {
                    expect(aggregate).to.deep.equal({
                        _id: "siteId-2015-01",
                        siteId: "siteId",
                        month: "2015-01",
                        measurements: {
                            "activeEnergy": "0.808,0.808,,0.808,,,,,,0.808",
                            "reactiveEnergy": "-0.085,-0.085,,-0.085,,,,,,-0.085",
                            "maxPower": "0,0,,0,,,,,,0",
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
