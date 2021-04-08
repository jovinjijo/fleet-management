import MQTT from 'async-mqtt';
import { LocationUpdate } from '@fleet-management/vehicle';
import FleetService from './fleet.service';

const mqttUrl = process.env.MQTT_URL;

class MqttSubscriber {
  client: MQTT.AsyncMqttClient;

  async connect() {
    this.client = await MQTT.connectAsync(mqttUrl);
  }

  async subscribe() {
    this.client.on('message', (topic: string, payload: string) => {
      if (topic === 'vehicle/locationupdate') {
        const locationUpdate = JSON.parse(payload) as LocationUpdate;
        FleetService.set(locationUpdate);
      }
    });

    await this.client.subscribe('vehicle/locationupdate');
  }
}

const mqttSubscriber = new MqttSubscriber();
const fn = async () => {
  try {
    await mqttSubscriber.connect();
    await mqttSubscriber.subscribe();
  } catch (ex) {
    console.log(ex.message);
  }
};

export default fn();
