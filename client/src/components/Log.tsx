import type { LogEvent } from "../App";

interface LogProps {
  log: LogEvent
}

export default function Log({
  log
}: LogProps) {
  const formattedTimestmamp = new Date(log.timestamp).toLocaleTimeString();
  return (
    <div key={log.id} className="border-b border-gray-200 pb-1">
      <span className="text-gray-500 font-mono">
        [{formattedTimestmamp}]
      </span>{" "}
      <span>{log.message}</span>
    </div>
  )
}