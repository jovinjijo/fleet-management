import './common/env';
import Server from './common/server';
import routes from './routes';
import { SocketServer } from './common/socketserver';
import {
  SocketUpdate,
  VehicleDetailsExtended,
} from './api/services/fleet.service';

const port = parseInt(process.env.PORT ?? '3000');

const server = new Server().router(routes);

const httpServer = server.createServer();

const socketServer = new SocketServer(httpServer);

server.listen(httpServer, port);

import './api/services/mqttsubscriber.service';

export { socketServer, SocketUpdate, VehicleDetailsExtended };
