import { X } from 'lucide-react';

export default function ChatWindow({
  setChatOpen,
}: {
  setChatOpen: (open: boolean) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] bg-[#23272f] border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
        <span className="font-semibold">AI Chat</span>
        <button
          aria-label="Close chat"
          className="ml-2 p-1 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          onClick={() => setChatOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div
        className="flex-1 p-4 overflow-y-auto text-slate-200 text-sm"
        style={{ minHeight: '200px' }}
      >
        <div className="text-center text-slate-400 mt-8">
          AI chat coming soon...
        </div>
      </div>
      <form className="flex items-center gap-2 p-3 border-t border-slate-700 bg-[#23272f]">
        <input
          type="text"
          className="flex-1 rounded-lg bg-slate-800 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-60"
          disabled
        >
          Send
        </button>
      </form>
    </div>
  );
}
