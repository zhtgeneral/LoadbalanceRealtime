import { io } from '../index';

export default class ClientService {
  static async broadcastToClients(event) {
    io.emit('log_event', event);
    console.log('/api/events POST Broadcasting to clients');
  }
}