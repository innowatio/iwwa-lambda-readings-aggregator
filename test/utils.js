export function getSensor (date) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "podId": "podId",
                "date": date,
                "measurements": [
                    {
                        "type": "energia attiva",
                        "source": "reading",
                        "value": "0.808",
                        "unitOfMeasurement": "kWh"
                    },
                    {
                        "type": "energia reattiva",
                        "source": "reading",
                        "value": "-0.085",
                        "unitOfMeasurement": "kVArh"
                    },
                    {
                        "type": "potenza massima",
                        "source": "reading",
                        "value": "0.000",
                        "unitOfMeasurement": "VAr"
                    }
                ]
            },
            "id": "sensorReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection sensor-readings"
    };
}

export function getTemperatureHumidityIlluminance (date) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "siteId": "siteId",
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
        "type": "element inserted in collection environment-readings"
    };
}

export function getCO2 (date) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensorId",
                "siteId": "siteId",
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
            "id": "environmentReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection environment-readings"
    };
}
