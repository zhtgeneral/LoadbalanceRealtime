import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import HomePage from './pages/Home';

const socket = io('http://localhost:3001');

export interface LogEvent {
  id: string;
  message: string;
  timestamp: string;
}

export default function App() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('log_event', (event: LogEvent) => {
      setLogs((prev) => [event, ...prev]);
    });
    return () => {
      socket.off('log_event');
    };
  }, []);

  async function sendEvent() {
    if (!input.trim()) return;
    await axios.post('http://localhost:3001/api/events', { message: input });
    setInput('');
  };

  return (
    <HomePage 
      logs={logs}
      input={input}
      setInput={setInput}
      sendEvent={sendEvent}
    />
  );
}