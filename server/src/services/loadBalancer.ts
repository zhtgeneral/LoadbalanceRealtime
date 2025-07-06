import Redis from "ioredis";

const redis = new Redis();

const busyServers = new Set();
const servers = ['server-a', 'server-b']; 

const BUSY_KEY = 'busy_servers';

export default class LoadBalancer {
  static async pickAvailableServer(): Promise<string | null> {
    const busyList = await redis.smembers(BUSY_KEY);
  
    for (const srv of servers) {
      if (!busyList.includes(srv)) return srv;
    }
  
    return null;
  }
  
  static async process(server) {
    await redis.sadd(BUSY_KEY, server); 
    setTimeout(async () => {
      await redis.srem(BUSY_KEY, server); 
    }, 4000);
  }
}