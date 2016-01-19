function addSource (reading, source, measurementLevel) {
    if (measurementLevel) {
        reading.data.element.measurements.forEach(measurement => {
            measurement.source = source;
        });
        return reading;
    } else {
        reading.data.element.source = source;
        return reading;
    }
}

export function getActiveEnergyReactiveEnergyMaxPower (date, source, measurementLevelSource) {
    return addSource({
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "date": date,
                "measurements": [
                    {
                        "type": "activeEnergy",
                        "value": "0.808",
                        "unitOfMeasurement": "kWh"
                    },
                    {
                        "type": "reactiveEnergy",
                        "value": "-0.085",
                        "unitOfMeasurement": "kVArh"
                    },
                    {
                        "type": "maxPower",
                        "value": "0.000",
                        "unitOfMeasurement": "VAr"
                    }
                ]
            },
            "id": "electricalReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection readings"
    }, source, measurementLevelSource);
}

export function getTemperatureHumidityIlluminance (date, source, measurementLevelSource) {
    return addSource({
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "date": date,
                "measurements": [
                    {
                        "type": "temperature",
                        "value": "21.4",
                        "unitOfMeasurement": "°C"
                    },
                    {
                        "type": "humidity",
                        "value": "49",
                        "unitOfMeasurement": "%"
                    },
                    {
                        "type": "illuminance",
                        "value": "145",
                        "unitOfMeasurement": "Lux"
                    }
                ]
            },
            "id": "environmentReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection readings"
    }, source, measurementLevelSource);
}

export function getCO2 (date, source, measurementLevelSource) {
    return addSource({
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "date": date,
                "measurements": [
                    {
                        "type": "co2",
                        "value": "446",
                        "unitOfMeasurement": "ppm"
                    }
                ]
            },
            "id": "co2ReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection readings"
    }, source, measurementLevelSource);
}
