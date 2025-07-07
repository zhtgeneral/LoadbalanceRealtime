import type { LogEvent } from "../App"
import Log from "../components/Log"

interface HomePageProps {
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>
  logs: LogEvent[],
  sendEvent: () => Promise<void>
}

export default function HomePage({
  input,
  setInput,
  logs,
  sendEvent
}: HomePageProps) {
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendEvent();
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Real-Time Logs</h1>

        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type an event message..."
            onKeyDown={(e) => onKeyDown(e)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
            onClick={sendEvent}
          >
            Send
          </button>
        </div>

        <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-4 text-sm space-y-2">
          {
            logs.length === 0 ? (
              <p className="text-gray-400 italic">No logs yet... Don't worry, this app will show the newest logs without needing you to refresh the page.</p>
            ) : (
              logs.map((l) => <Log log={l} />)
            )
          }
        </div>
      </div>
    </div>
  )
}