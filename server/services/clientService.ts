import { io } from '../src';

export class ClientService {
  static async broadcastToClients(event) {
    io.emit('log_event', event);
    console.log('/api/events POST Broadcasting to clients');
  }
}