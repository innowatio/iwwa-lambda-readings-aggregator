import BPromise from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import R from "ramda";

chai.use(chaiAsPromised);

import {handler} from "index";
import mongodb from "common/mongodb";
import {AGGREGATES_COLLECTION_NAME} from "common/config";
import * as utils from "../utils";
import {getEventFromObject, run} from "../mock";

describe("On reading", async () => {

    var aggregates;
    var db;
    before(async () => {
        db = await mongodb;
        aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
    });
    after(async () => {
        await db.close();
    });
    beforeEach(async () => {
        await aggregates.remove({});
    });

    describe("creates an aggregate for each measurement in the reading (assuming measurements all have different type-s)", () => {

        it("reading with `activeEnergy`, `reactiveEnergy` and `maxPower` measurements", async () => {
            const event = getEventFromObject(
                utils.getActiveEnergyReactiveEnergyMaxPower("2015-01-01T00:02:00.000Z", "reading")
            );
            await run(handler, event);
            const count = await aggregates.count({});
            expect(count).to.equal(3);
        });

        it("reading with `temperature`, `humidity` and `illuminance` measurements", async () => {
            const event = getEventFromObject(
                utils.getTemperatureHumidityIlluminance("2015-01-01T00:02:00.000Z", "reading")
            );
            await run(handler, event);
            const count = await aggregates.count({});
            expect(count).to.equal(3);
        });

        it("reading with `co2` measurement", async () => {
            const event = getEventFromObject(
                utils.getCO2("2015-01-01T00:02:00.000Z", "reading")
            );
            await run(handler, event);
            const count = await aggregates.count({});
            expect(count).to.equal(1);
        });

    });

    describe("correctly builds the aggregate:", () => {

        it("top-level source, reading", async () => {
            const event = getEventFromObject(
                utils.getActiveEnergyReactiveEnergyMaxPower("2015-01-01T00:00:30.000Z", "reading")
            );
            await run(handler, event);
            const aggregate1 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-activeEnergy"});
            expect(aggregate1).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-activeEnergy",
                source: "reading",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                unitOfMeasurement: "kWh",
                measurementValues: "0.808",
                measurementTimes: "1420070430000"
            });
            const aggregate2 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-maxPower"});
            expect(aggregate2).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-maxPower",
                source: "reading",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "maxPower",
                unitOfMeasurement: "VAr",
                measurementValues: "0",
                measurementTimes: "1420070430000"
            });
            const aggregate3 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-reactiveEnergy"});
            expect(aggregate3).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-reactiveEnergy",
                source: "reading",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "reactiveEnergy",
                unitOfMeasurement: "kVArh",
                measurementValues: "-0.085",
                measurementTimes: "1420070430000"
            });
        });

        it("top-level source, forecast", async () => {
            const event = getEventFromObject(
                utils.getActiveEnergyReactiveEnergyMaxPower("2015-01-01T00:00:30.000Z", "forecast")
            );
            await run(handler, event);
            const aggregate1 = await aggregates.findOne({_id: "sensorId-2015-01-01-forecast-activeEnergy"});
            expect(aggregate1).to.deep.equal({
                _id: "sensorId-2015-01-01-forecast-activeEnergy",
                source: "forecast",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                unitOfMeasurement: "kWh",
                measurementValues: "0.808",
                measurementTimes: "1420070430000"
            });
            const aggregate2 = await aggregates.findOne({_id: "sensorId-2015-01-01-forecast-maxPower"});
            expect(aggregate2).to.deep.equal({
                _id: "sensorId-2015-01-01-forecast-maxPower",
                source: "forecast",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "maxPower",
                unitOfMeasurement: "VAr",
                measurementValues: "0",
                measurementTimes: "1420070430000"
            });
            const aggregate3 = await aggregates.findOne({_id: "sensorId-2015-01-01-forecast-reactiveEnergy"});
            expect(aggregate3).to.deep.equal({
                _id: "sensorId-2015-01-01-forecast-reactiveEnergy",
                source: "forecast",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "reactiveEnergy",
                unitOfMeasurement: "kVArh",
                measurementValues: "-0.085",
                measurementTimes: "1420070430000"
            });
        });

        it("measurement-level source, reading", async () => {
            const event = getEventFromObject(
                utils.getActiveEnergyReactiveEnergyMaxPower("2015-01-01T00:00:30.000Z", "reading", true)
            );
            await run(handler, event);
            const aggregate1 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-activeEnergy"});
            expect(aggregate1).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-activeEnergy",
                source: "reading",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                unitOfMeasurement: "kWh",
                measurementValues: "0.808",
                measurementTimes: "1420070430000"
            });
            const aggregate2 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-maxPower"});
            expect(aggregate2).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-maxPower",
                source: "reading",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "maxPower",
                unitOfMeasurement: "VAr",
                measurementValues: "0",
                measurementTimes: "1420070430000"
            });
            const aggregate3 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-reactiveEnergy"});
            expect(aggregate3).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-reactiveEnergy",
                source: "reading",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "reactiveEnergy",
                unitOfMeasurement: "kVArh",
                measurementValues: "-0.085",
                measurementTimes: "1420070430000"
            });
        });

        it("measurement-level source, forecast", async () => {
            const event = getEventFromObject(
                utils.getActiveEnergyReactiveEnergyMaxPower("2015-01-01T00:00:30.000Z", "forecast", true)
            );
            await run(handler, event);
            const aggregate1 = await aggregates.findOne({_id: "sensorId-2015-01-01-forecast-activeEnergy"});
            expect(aggregate1).to.deep.equal({
                _id: "sensorId-2015-01-01-forecast-activeEnergy",
                source: "forecast",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                unitOfMeasurement: "kWh",
                measurementValues: "0.808",
                measurementTimes: "1420070430000"
            });
            const aggregate2 = await aggregates.findOne({_id: "sensorId-2015-01-01-forecast-maxPower"});
            expect(aggregate2).to.deep.equal({
                _id: "sensorId-2015-01-01-forecast-maxPower",
                source: "forecast",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "maxPower",
                unitOfMeasurement: "VAr",
                measurementValues: "0",
                measurementTimes: "1420070430000"
            });
            const aggregate3 = await aggregates.findOne({_id: "sensorId-2015-01-01-forecast-reactiveEnergy"});
            expect(aggregate3).to.deep.equal({
                _id: "sensorId-2015-01-01-forecast-reactiveEnergy",
                source: "forecast",
                sensorId: "sensorId",
                day: "2015-01-01",
                measurementType: "reactiveEnergy",
                unitOfMeasurement: "kVArh",
                measurementValues: "-0.085",
                measurementTimes: "1420070430000"
            });
        });

        it("electrical reading (activeEnergy, reactiveEnergy, maxPower)", async () => {
            const event = getEventFromObject(
                utils.getActiveEnergyReactiveEnergyMaxPower("2015-01-01T00:16:00.000Z", "reading")
            );
            await run(handler, event);
            const aggregate1 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-activeEnergy"});
            expect(aggregate1).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-activeEnergy",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                measurementValues: "0.808",
                unitOfMeasurement: "kWh",
                measurementTimes: "1420071360000"
            });
            const aggregate2 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-reactiveEnergy"});
            expect(aggregate2).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-reactiveEnergy",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "reactiveEnergy",
                measurementValues: "-0.085",
                unitOfMeasurement: "kVArh",
                measurementTimes: "1420071360000"
            });
            const aggregate3 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-maxPower"});
            expect(aggregate3).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-maxPower",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "maxPower",
                measurementValues: "0",
                unitOfMeasurement: "VAr",
                measurementTimes: "1420071360000"
            });
        });

        it("environment reading (temperature, humidity, illuminance)", async () => {
            const event = getEventFromObject(
                utils.getTemperatureHumidityIlluminance("2015-01-01T00:16:00.000Z", "reading")
            );
            await run(handler, event);
            const aggregate1 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-temperature"});
            expect(aggregate1).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-temperature",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "temperature",
                measurementValues: "21.4",
                unitOfMeasurement: "°C",
                measurementTimes: "1420071360000"
            });
            const aggregate2 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-humidity"});
            expect(aggregate2).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-humidity",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "humidity",
                measurementValues: "49",
                unitOfMeasurement: "%",
                measurementTimes: "1420071360000"
            });
            const aggregate3 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-illuminance"});
            expect(aggregate3).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-illuminance",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "illuminance",
                measurementValues: "145",
                unitOfMeasurement: "Lux",
                measurementTimes: "1420071360000"
            });
        });

        it("environment reading (co2)", async () => {
            const event = getEventFromObject(
                utils.getCO2("2015-01-01T00:00:11.000Z", "reading")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-co2"});
            expect(aggregate).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-co2",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "co2",
                measurementValues: "446",
                unitOfMeasurement: "ppm",
                measurementTimes: "1420070411000"
            });
        });

        it("all in one", async () => {
            const dates = [
                "2015-01-01T00:15:00.000Z",
                "2015-01-01T00:15:00.000Z",
                "2015-01-01T00:15:00.000Z",
                "2015-01-01T00:06:00.000Z",
                "2015-01-01T00:06:00.000Z",
                "2015-01-01T00:00:01.000Z",
                "2015-01-01T00:47:00.000Z"
            ];
            const events = R.pipe(
                R.map(date => [
                    utils.getActiveEnergyReactiveEnergyMaxPower(date, "reading"),
                    utils.getTemperatureHumidityIlluminance(date, "reading"),
                    utils.getCO2(date, "reading")
                ]),
                R.flatten,
                R.map(getEventFromObject)
            )(dates);
            await BPromise.reduce(
                events,
                (ignore, event) => run(handler, event),
                BPromise.resolve()
            );
            const aggregateReadingActiveEnergy = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-activeEnergy"});
            const aggregateReadingMaxPower = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-maxPower"});
            const aggregateReadingReactiveEnergy = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-reactiveEnergy"});
            const aggregateReadingTemperature = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-temperature"});
            const aggregateReadingHumidity = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-humidity"});
            const aggregateReadingIlluminance = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-illuminance"});
            const aggregateReadingCo2 = await aggregates.findOne({_id: "sensorId-2015-01-01-reading-co2"});
            expect(aggregateReadingActiveEnergy).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-activeEnergy",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "activeEnergy",
                measurementValues: "0.808,0.808,0.808,0.808",
                unitOfMeasurement: "kWh",
                measurementTimes: "1420070401000,1420070760000,1420071300000,1420073220000"
            });
            expect(aggregateReadingReactiveEnergy).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-reactiveEnergy",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "reactiveEnergy",
                measurementValues: "-0.085,-0.085,-0.085,-0.085",
                unitOfMeasurement: "kVArh",
                measurementTimes: "1420070401000,1420070760000,1420071300000,1420073220000"
            });
            expect(aggregateReadingMaxPower).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-maxPower",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "maxPower",
                measurementValues: "0,0,0,0",
                unitOfMeasurement: "VAr",
                measurementTimes: "1420070401000,1420070760000,1420071300000,1420073220000"
            });
            expect(aggregateReadingTemperature).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-temperature",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "temperature",
                measurementValues: "21.4,21.4,21.4,21.4",
                unitOfMeasurement: "°C",
                measurementTimes: "1420070401000,1420070760000,1420071300000,1420073220000"
            });
            expect(aggregateReadingHumidity).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-humidity",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "humidity",
                measurementValues: "49,49,49,49",
                unitOfMeasurement: "%",
                measurementTimes: "1420070401000,1420070760000,1420071300000,1420073220000"
            });
            expect(aggregateReadingIlluminance).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-illuminance",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "illuminance",
                measurementValues: "145,145,145,145",
                unitOfMeasurement: "Lux",
                measurementTimes: "1420070401000,1420070760000,1420071300000,1420073220000"
            });
            expect(aggregateReadingCo2).to.deep.equal({
                _id: "sensorId-2015-01-01-reading-co2",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-01",
                measurementType: "co2",
                measurementValues: "446,446,446,446",
                unitOfMeasurement: "ppm",
                measurementTimes: "1420070401000,1420070760000,1420071300000,1420073220000"
            });
        });

        it("non-first day of the month [CASE: 1/2 (only testing different combinations)]", async () => {
            const event = getEventFromObject(
                utils.getCO2("2015-01-02T00:00:11.000Z", "reading")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "sensorId-2015-01-02-reading-co2"});
            expect(aggregate).to.deep.equal({
                _id: "sensorId-2015-01-02-reading-co2",
                sensorId: "sensorId",
                source: "reading",
                measurementType: "co2",
                day: "2015-01-02",
                measurementValues: "446",
                unitOfMeasurement: "ppm",
                measurementTimes: "1420156811000"
            });
        });

        it("non-first day of the month [CASE: 2/2 (only testing different combinations)]", async () => {
            const db = await mongodb;
            const aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
            const event = getEventFromObject(
                utils.getCO2("2015-01-03T00:51:51.000Z", "reading")
            );
            await run(handler, event);
            const aggregate = await aggregates.findOne({_id: "sensorId-2015-01-03-reading-co2"});
            expect(aggregate).to.deep.equal({
                _id: "sensorId-2015-01-03-reading-co2",
                sensorId: "sensorId",
                source: "reading",
                day: "2015-01-03",
                measurementType: "co2",
                measurementValues: "446",
                unitOfMeasurement: "ppm",
                measurementTimes: "1420246311000"
            });
        });

    });

});
