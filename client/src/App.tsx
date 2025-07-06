import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001');

interface LogEvent {
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

  const sendEvent = async () => {
    if (!input.trim()) return;
    await axios.post('http://localhost:3001/events', { message: input });
    setInput('');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Real-Time Logs</h1>
      <div className="flex mb-4">
        <input
          className="border p-2 flex-1 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type an event message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={sendEvent}>
          Send
        </button>
      </div>
      <ul>
        {logs.map((log) => (
          <li key={log.id} className="border-b py-1">
            [{log.timestamp}] {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
}