import { Application } from 'express';
import examplesRouter from './api/controllers/fleet/router';
export default function routes(app: Application): void {
  app.use('/api/v1/fleet', examplesRouter);
}
