import { Position, Vehicle } from "./Vehicle";

const mqttUrl = process.env.MQTT_URL;

export abstract class LocationPublisher {
    abstract getPosition(): Position;

    interval?: NodeJS.Timeout;
    vehicle: Vehicle;

    constructor(uuid: string) {
        this.vehicle = new Vehicle(uuid, this.getPosition());
    }

    async start(interval: number = 5000) {
        if (!mqttUrl) {
            throw new Error("MQTT Host url not specifid via env variable MQ_HOST");
        }
        await this.vehicle.connect(mqttUrl);
        this.interval = setInterval(async () => {
            this.vehicle.setPosition(this.getPosition());
        }, interval);
    }

    async stop() {
        this.interval && clearInterval(this.interval);
        this.interval = undefined;
        await this.vehicle.disconnect();
    }
}
