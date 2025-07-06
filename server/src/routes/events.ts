import { Request, Response } from 'express';

import DBService from '../services/databaseService';
import NotificationService from '../services/notificationService';
import ClientService from '../services/clientService';

export function postEvent(req: Request, res: Response): void {
  const { message, server } = req.body;

  if (!message) {
    console.error("/api/events POST missing message");
    res.status(400).json({
      success: false,
      error: 'message is required'
    })
    return;
  }
  if (!server) {
    console.error("/api/events POST missing server");
    res.status(400).json({
      success: false,
      error: 'server is required'
    })
    return;
  }

  const event = ClientService.createEvent(server, message);

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
    res.status(500).json({ 
      success: false,
      error: "Unable to broadcast message",
    });
    console.error("/api/events POST unknown error during broadcast to clients: " + JSON.stringify(error, null, 2));
    return;
  }

  console.log("/api/events POST sucessfully handled event");
  res.status(200).json({ 
    success: true,
    message: "Event handled successfully",
    event: event
  });
}
