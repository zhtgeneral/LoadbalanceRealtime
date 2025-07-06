import { NextFunction, Request, Response } from "express";
import Redis from "ioredis";

import { servers } from "../index";

const redis = new Redis();

const BUSY_KEY = 'busy_servers';

export async function loadBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
  const server = await pickAvailableServer();
  console.log(`[Middleware] ${server ?? 'none'} assigned to request`);

  if (!server) {
    console.log("[Middleware] all servers busy");
    res.status(503).json({ error: 'All servers busy' });
    return;
  }

  await redis.sadd(BUSY_KEY, server); 
    
  req.body.server = server;

  process(server);  
  next();
}

async function pickAvailableServer(): Promise<string | null> {
  const busyList = await redis.smembers(BUSY_KEY);

  for (const srv of servers) {
    if (!busyList.includes(srv)) return srv;
  }

  return null;
}

function process(server) {
  setTimeout(async () => {
    await redis.srem(BUSY_KEY, server); 
  }, 4000);
}