import MQTT from "async-mqtt";

export interface Position {
    timestamp: number;
    coord: Coordinates;
}

interface Coordinates {
    latitude: number;
    longitude: number;
    speed: number;
}

export interface LocationUpdate {
    uuid: string;
    position: Position;
}

export class Vehicle {
    private uuid: string;
    private position: Position;
    private mqttClient?: MQTT.AsyncMqttClient;

    constructor(uuid: string, position: Position) {
        this.uuid = uuid;
        this.position = position;
    }

    async connect(url: string) {
        this.mqttClient = await MQTT.connectAsync(url);
    }

    async disconnect() {
        this.mqttClient?.end();
    }

    async setPosition(position: Position) {
        this.position = position;
        try {
            await this.mqttClient?.publish("vehicle/locationupdate", JSON.stringify({ position: this.position, uuid: this.uuid } as LocationUpdate));
        } catch (e) {
            console.log(e);
        }
    }
}
