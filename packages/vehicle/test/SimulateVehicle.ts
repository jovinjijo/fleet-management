import { LocationPublisher } from "../src/LocationPublisher";
import { v4 as uuidv4 } from "uuid";

class LocationPublisherSimulator extends LocationPublisher {
    getPosition() {
        return { timestamp: Date.now(), coord: { latitude: 56, longitude: 65, speed: 0 } };
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
