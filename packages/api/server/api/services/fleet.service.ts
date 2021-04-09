import L from '../../common/logger';
import { VehicleDetails } from '@fleet-management/vehicle';

export interface VehicleDetailsExtended extends Omit<VehicleDetails, 'uuid'> {
  speed: number;
}

export type SocketUpdate = VehicleDetails & VehicleDetailsExtended;

const vehicles: Map<string, VehicleDetailsExtended> = new Map();

export class VehicleService {
  all(): Map<string, VehicleDetailsExtended> {
    L.info(`fetch all vehicle details, number of vehicles: ${vehicles.size}`);
    return vehicles;
  }

  byUuid(uuid: string): VehicleDetailsExtended | undefined {
    L.info(`fetch vehicle details with uuid ${uuid}`);
    return vehicles.get(uuid);
  }

  set(data: VehicleDetails): void {
    L.info(`set data for vehicle with uuid ${data.uuid}`);
    const currentData = vehicles.get(data.uuid);
    let speed = 0;
    if (currentData) {
      speed =
        distance(
          data.position.coord.latitude,
          data.position.coord.longitude,
          currentData.position.coord.latitude,
          currentData.position.coord.longitude
        ) /
        ((data.position.timestamp - currentData.position.timestamp) / 1000);
    }
    vehicles.set(data.uuid, { position: data.position, speed });
    socketServer.broadcast('locationUpdate', {
      uuid: data.uuid,
      position: data.position,
      speed: speed,
    } as SocketUpdate);
  }
}

// https://stackoverflow.com/a/47029153
function distance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const degToRad = Math.PI / 180;
  const R = 6371000;
  return (
    R *
    degToRad *
    Math.sqrt(
      Math.pow(Math.cos(lat1 * degToRad) * (lng1 - lng2), 2) +
        Math.pow(lat1 - lat2, 2)
    )
  );
}

export default new VehicleService();

import './mqttsubscriber.service';
import { socketServer } from '../..';
