import { v4 as uuidv4 } from 'uuid';
import { DBService } from '../services/databaseService';
import { NotificationService } from '../services/notificationService';
import { ClientService } from '../services/clientService';
import { Request, Response } from 'express';

export function postEvent(req: Request, res: Response): void {
  const { message, server } = req.body;

  if (!message) {
    console.error("/api/events POST missing message");
    res.status(400).json({
      succes: false,
      error: 'message is required'
    })
    return;
  }
  if (!server) {
    console.error("/api/events POST missing server");
    res.status(400).json({
      succes: false,
      error: 'server is required'
    })
    return;
  }

  const event = {
    id: uuidv4(),
    message: `[${server}] ${message}`,
    timestamp: new Date().toISOString(),
  };

  try {
    DBService.saveToDB(event);
  } catch (error: any) {
    console.warn("/api/events POST unknown error during save to DB: " + JSON.stringify(error, null, 2));
  }

  try {
    NotificationService.sendNotification(event);
  } catch (error: any) {
    console.warn("/api/events POST unknown error during sending notification: " + JSON.stringify(error, null, 2));
  }

  try {
    ClientService.broadcastToClients(event);
  } catch (error: any) {
    console.warn("/api/events POST unknown error during broadcast to clients: " + JSON.stringify(error, null, 2));
  }

  console.log("/api/events POST sucessfully handled event");
  res.status(200).json({ 
    success: true,
    message: "Event handled successfully" 
  });
}
