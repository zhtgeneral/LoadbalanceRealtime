import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { postEvent } from './routes/events';
import { loadBalance } from './middleware/middleware';

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: '*' },
});

export const busyServers = new Set();
export const servers = ['server-a', 'server-b']; 

app.use(cors());
app.use(express.json());

app.post('/api/events', loadBalance, postEvent);

io.on('connection', (socket) => {
  console.log('Client connected');
});

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});