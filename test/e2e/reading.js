import {reduce, resolve} from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import * as R from "ramda";

chai.use(chaiAsPromised);

import {handler} from "index";
import mongodb from "common/mongodb";
import {AGGREGATES_COLLECTION_NAME} from "common/config";
import * as utils from "../utils";
import {getEventFromObject, run} from "../mock";

describe("On reading", async () => {


    beforeEach(async () => {
        const db = await mongodb;
        const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
        await aggregates.remove({});
    });

    it("creates two aggregate (reading and forecast) element if it doesn't exist", async () => {
        const db = await mongodb;
        const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
        const event = getEventFromObject(
            utils.getSensor("2015-01-01T00:02:00.000Z")
        );
        await run(handler, event);
        const count = await aggregates.count({});
        expect(count).to.equal(2);
    });

    it("creates an aggregate (reading) element if it doesn't exist", async () => {
        const db = await mongodb;
        const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
        const event = getEventFromObject(
            utils.getTemperatureHumidityIlluminance("2015-01-01T00:02:00.000Z")
        );
        await run(handler, event);
        const count = await aggregates.count({});
        expect(count).to.equal(1);
    });

    describe("correctly builds the aggregate:", () => {

        it("electrical reading", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getSensor("2015-01-01T00:00:30.000Z")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "reading-sensorId-2015-01-01"});
            expect(aggregate).to.deep.equal({
                _id: "reading-sensorId-2015-01-01",
                source: "reading",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurements: {
                    "activeEnergy": "0.808",
                    "maxPower": "0"
                },
                measurementsDeltaInMs: 300000
            });
        });

        it("electrical forecast", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getSensor("2015-01-01T00:00:30.000Z")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "forecast-sensorId-2015-01-01"});
            expect(aggregate).to.deep.equal({
                _id: "forecast-sensorId-2015-01-01",
                source: "forecast",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurements: {
                    "reactiveEnergy": "-0.085"
                },
                measurementsDeltaInMs: 300000
            });
        });

        it("source type outside measurements", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getSensorWithSingleSource(
                    "2015-01-01T00:02:00.000Z",
                    "reading"
                ));
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "reading-sensorId-2015-01-01"});
            expect(aggregate).to.deep.equal({
                _id: "reading-sensorId-2015-01-01",
                source: "reading",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurements: {
                    "activeEnergy": "1",
                    "reactiveEnergy": "2",
                    "maxPower": "-3"
                },
                measurementsDeltaInMs: 300000
            });
        });

        it("environment reading (temperature, humidity, illuminance)", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getTemperatureHumidityIlluminance("2015-01-01T00:16:00.000Z")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "reading-sensorId-2015-01-01"});
            expect(aggregate).to.deep.equal({
                _id: "reading-sensorId-2015-01-01",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurements: {
                    "temperature": ",,,21.4",
                    "humidity": ",,,49",
                    "illuminance": ",,,145"
                },
                measurementsDeltaInMs: 300000
            });
        });

        it("environment forecast (temperature, humidity, illuminance)", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getTemperatureHumidityIlluminanceForecast("2015-01-01T00:16:00.000Z")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "forecast-sensorId-2015-01-01"});
            expect(aggregate).to.deep.equal({
                _id: "forecast-sensorId-2015-01-01",
                sensorId: "sensorId",
                source: "forecast",
                day: "2015-01-01",
                measurements: {
                    "temperature": ",,,21.4",
                    "humidity": ",,,49",
                    "illuminance": ",,,145"
                },
                measurementsDeltaInMs: 300000
            });
        });

        it("environment reading (co2)", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getCO2("2015-01-01T00:00:11.000Z")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "reading-sensorId-2015-01-01"});
            expect(aggregate).to.deep.equal({
                _id: "reading-sensorId-2015-01-01",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurements: {
                    "co2": "446"
                },
                measurementsDeltaInMs: 300000
            });
        });

        it("all in one", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const dates = [
                "2015-01-01T00:00:01.000Z",
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
            await reduce(
                events,
                (ignore, event) => run(handler, event),
                resolve()
            );
            const aggregateReading = await aggregates.findOne({_id: "reading-sensorId-2015-01-01"});
            const aggregateForecast = await aggregates.findOne({_id: "forecast-sensorId-2015-01-01"});
            expect(aggregateReading).to.deep.equal({
                _id: "reading-sensorId-2015-01-01",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurements: {
                    "activeEnergy": "0.808,0.808,,0.808,,,,,,0.808",
                    "maxPower": "0,0,,0,,,,,,0",
                    "temperature": "21.4,21.4,,21.4,,,,,,21.4",
                    "humidity": "49,49,,49,,,,,,49",
                    "illuminance": "145,145,,145,,,,,,145",
                    "co2": "446,446,,446,,,,,,446"
                },
                measurementsDeltaInMs: 300000
            });
            expect(aggregateForecast).to.deep.equal({
                _id: "forecast-sensorId-2015-01-01",
                sensorId: "sensorId",
                source: "forecast",
                day: "2015-01-01",
                measurements: {
                    "reactiveEnergy": "-0.085,-0.085,,-0.085,,,,,,-0.085"
                },
                measurementsDeltaInMs: 300000
            });
        });

        it("non-first day of the month [1/2]", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getCO2("2015-01-02T00:00:11.000Z")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "reading-sensorId-2015-01-02"});
            expect(aggregate).to.deep.equal({
                _id: "reading-sensorId-2015-01-02",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-02",
                measurements: {
                    "co2": "446"
                },
                measurementsDeltaInMs: 300000
            });
        });

        it("non-first day of the month [2/2]", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getCO2("2015-01-03T00:51:51.000Z")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "reading-sensorId-2015-01-03"});
            expect(aggregate).to.deep.equal({
                _id: "reading-sensorId-2015-01-03",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-03",
                measurements: {
                    "co2": ",,,,,,,,,,446"
                },
                measurementsDeltaInMs: 300000
            });
        });

    });

});
