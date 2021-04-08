import { NextFunction, Request, Response } from 'express';
import FleetService from '../../services/fleet.service';
import { VehicleDetails } from '@fleet-management/vehicle';
import { mapToObj } from '../../../common/util';

export class Controller {
  all(_req: Request, res: Response, next: NextFunction): void {
    try {
      const vehicles = FleetService.all();
      const data = mapToObj(vehicles);
      res.json({ data, status: 'SUCCESS' });
    } catch (ex) {
      next(ex);
    }
  }

  byUuid(req: Request, res: Response, next: NextFunction): void {
    try {
      const uuid = req.params['uuid'];
      const vehicle = FleetService.byUuid(uuid);
      if (!vehicle) {
        return res.status(404).end();
      }
      res.json({ data: vehicle, status: 'SUCCESS' });
    } catch (ex) {
      next(ex);
    }
  }

  set(req: Request, res: Response, next: NextFunction): void {
    try {
      const vehicleDetails = req.body.data as VehicleDetails;
      const vehicle = FleetService.set(vehicleDetails);
      res.json({ data: vehicle, status: 'SUCCESS' });
    } catch (ex) {
      next(ex);
    }
  }
}

export default new Controller();
