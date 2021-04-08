import { LocationPublisher } from "../src/LocationPublisher";
import { v4 as uuidv4 } from "uuid";

class LocationPublisherSimulator extends LocationPublisher {
    getPosition() {
        const currentPosition = this.vehicle && this.vehicle.position;
        if (currentPosition) {
            const latitude = currentPosition.coord.latitude + Math.random() * 0.0001;
            const longitude = currentPosition.coord.longitude + Math.random() * 0.0001;
            return { timestamp: Date.now(), coord: { latitude, longitude } };
        }
        return { timestamp: Date.now(), coord: { latitude: Math.random() * 90, longitude: Math.random() * 180 } };
    }
}

const fn = async () => {
    try {
        const simulator = new LocationPublisherSimulator(uuidv4());
        simulator.start();
    } catch (ex) {
        console.log(ex.message);
    }
};

fn();
