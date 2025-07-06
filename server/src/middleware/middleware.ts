import { NextFunction, Request, Response } from "express";

import LoadBalancer from "../services/loadBalancer";

export async function loadBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
  const server = await LoadBalancer.pickAvailableServer();
  console.log(`[Middleware] ${server ?? 'none'} assigned to request`);

  if (!server) {
    console.log("[Middleware] all servers busy");
    res.status(503).json({
      success: false, 
      error: 'All servers busy'
    });
    return;
  }
    
  req.body.server = server;

  await LoadBalancer.process(server);  

  next();
}