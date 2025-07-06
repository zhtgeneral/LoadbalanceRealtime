import { io } from '../index';
import { v4 as uuidv4 } from 'uuid';

export default class ClientService {
  static createEvent(server: string, message: string) {
    return {
      id: uuidv4(),
      message: `[${server}] ${message}`,
      timestamp: new Date().toISOString(),
    };
  }
  static async broadcastToClients(event) {
    io.emit('log_event', event);
    console.log('/api/events POST Broadcasting to clients');
  }
}