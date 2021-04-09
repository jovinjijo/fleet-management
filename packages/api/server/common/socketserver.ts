import { Server } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

export class SocketServer {
  private socket: SocketIOServer;

  constructor(server?: Server, onNewConnection?: (socket: Socket) => void) {
    if (server) {
      this.attachServer(server, onNewConnection);
    }
  }

  attachServer(
    server: Server,
    onNewConnection?: (socket: Socket) => void
  ): void {
    this.socket = new SocketIOServer(server);
    this.socket.on('connection', (socket: Socket) => {
      if (onNewConnection) onNewConnection(socket);
    });
  }

  send(socket: Socket, type: string, data: unknown): void {
    socket.emit(type, data);
  }

  broadcast(type: string, data: unknown): void {
    this.socket.emit(type, data);
  }
}
