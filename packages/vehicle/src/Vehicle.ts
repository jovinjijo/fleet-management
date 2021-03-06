import { connectAsync, AsyncMqttClient } from "async-mqtt";

export interface VehicleDetails {
    uuid: string;
    position: Position;
}

export interface Position {
    timestamp: number;
    coord: Coordinates;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface LocationUpdate extends VehicleDetails {}

export class Vehicle implements VehicleDetails {
    uuid: string;
    position: Position;
    private mqttClient?: AsyncMqttClient;

    constructor(uuid: string, position: Position) {
        console.log(`vehicle instance created, uuid: ${uuid}`);
        this.uuid = uuid;
        this.position = position;
    }

    async connect(url: string) {
        console.log(`connected to MQTT server, url: ${url}`);
        this.mqttClient = await connectAsync(url);
    }

    async disconnect() {
        console.log(`disconnected from MQTT server`);
        this.mqttClient?.end();
    }

    async setPosition(position: Position) {
        this.position = position;

        console.log(`location updated to lat: ${position.coord.latitude}, long: ${position.coord.longitude}, time: ${position.timestamp}`);

        try {
            await this.mqttClient?.publish("vehicle/locationupdate", JSON.stringify({ position: this.position, uuid: this.uuid } as LocationUpdate));
        } catch (e) {
            console.log(e);
        }
    }
}
