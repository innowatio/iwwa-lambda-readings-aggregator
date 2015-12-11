export function getSensor (date) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "date": date,
                "measurements": [
                    {
                        "type": "activeEnergy",
                        "source": "reading",
                        "value": "0.808",
                        "unitOfMeasurement": "kWh"
                    },
                    {
                        "type": "reactiveEnergy",
                        "source": "reading",
                        "value": "-0.085",
                        "unitOfMeasurement": "kVArh"
                    },
                    {
                        "type": "maxPower",
                        "source": "reading",
                        "value": "0.000",
                        "unitOfMeasurement": "VAr"
                    }
                ]
            },
            "id": "electricalReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection readings"
    };
}

export function getTemperatureHumidityIlluminance (date) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "date": date,
                "measurements": [
                    {
                        "type": "temperature",
                        "source": "reading",
                        "value": "21.4",
                        "unitOfMeasurement": "�C"
                    },
                    {
                        "type": "humidity",
                        "source": "reading",
                        "value": "49",
                        "unitOfMeasurement": "%"
                    },
                    {
                        "type": "illuminance",
                        "source": "reading",
                        "value": "145",
                        "unitOfMeasurement": "Lux"
                    }
                ]
            },
            "id": "environmentReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection readings"
    };
}

export function getCO2 (date) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "date": date,
                "measurements": [
                    {
                        "type": "co2",
                        "source": "reading",
                        "value": "446",
                        "unitOfMeasurement": "ppm"
                    }
                ]
            },
            "id": "co2ReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection readings"
    };
}
