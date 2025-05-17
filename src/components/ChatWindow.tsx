import { useRef, useState, useEffect } from 'react';
import { Bot, X } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash.debounce';

import { API } from '../lib/constants';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! How can I help you today?' },
  ]);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState('');
  const [typingIdx, setTypingIdx] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Scroll to bottom when messages change
  const scrollToBottom = debounce(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 60);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      scrollToBottom.cancel();
    };
  }, []);

  // Only keep last 5 messages from each side
  const getTrimmedHistory = () => {
    const userMsgs = messages.filter((m) => m.role === 'user').slice(-5);
    const modelMsgs = messages.filter((m) => m.role === 'model').slice(-5);
    // Interleave user/model messages in order
    const all = [];
    let u = 0,
      m = 0;
    for (let i = 0; i < userMsgs.length + modelMsgs.length; i++) {
      if (messages[0].role === 'user') {
        if (u < userMsgs.length) all.push(userMsgs[u++]);
        if (m < modelMsgs.length) all.push(modelMsgs[m++]);
      } else {
        if (m < modelMsgs.length) all.push(modelMsgs[m++]);
        if (u < userMsgs.length) all.push(userMsgs[u++]);
      }
    }
    return all.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user' as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(
        API.CHAT,
        {
          message: input,
          history: getTrimmedHistory(),
        },
        {
          withCredentials: true,
        }
      );
      setMessages((msgs) => [
        ...msgs,
        { role: 'model', text: res.data.message || 'No response.' },
      ]);
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setMessages((msgs) => [
        ...msgs,
        { role: 'model', text: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Find the last model message
    const lastIdx = messages.length - 1;
    if (lastIdx >= 0 && messages[lastIdx].role === 'model') {
      setTypedText('');
      setTypingIdx(lastIdx);
      const fullText = messages[lastIdx].text;
      let i = 0;
      const type = () => {
        setTypedText(fullText.slice(0, i));
        if (i < fullText.length) {
          i++;
          setTimeout(type, 5 + Math.random() * 10);
        } else {
          setTypedText(fullText);
        }
      };
      type();
    } else {
      setTypedText('');
      setTypingIdx(null);
    }
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 10);
  };

  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, [typedText, autoScroll]);

  // Prevent page scroll when mouse is over chat window
  const handleMouseEnter = () => {
    document.body.style.overflow = 'hidden';
  };
  const handleMouseLeave = () => {
    document.body.style.overflow = '';
  };

  return !chatOpen ? (
    <button
      aria-label="Open chat"
      className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
      onClick={() => setChatOpen(true)}
      style={{ display: chatOpen ? 'none' : 'flex' }}
    >
      <Bot className="w-7 h-7" />
    </button>
  ) : (
    <div
      className="fixed bottom-6 right-6 z-50 w-160 max-w-[90vw] bg-[#262a36] border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in h-[75vh] overflow-y-auto"
      style={{ fontSize: '1rem', touchAction: 'pan-y' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
        <span className="font-semibold">AI Chat</span>
        <button
          aria-label="Close chat"
          className="ml-2 p-1 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          onClick={() => {
            setChatOpen(false);
            handleMouseLeave();
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div
        className="flex-1 p-4 overflow-y-auto text-slate-200 text-base custom-scrollbar text-sm"
        style={{ minHeight: '240px', background: 'rgba(36,41,54,0.95)' }}
        onScroll={handleScroll}
      >
        <div className="flex flex-col gap-3 pb-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.role === 'user'
                  ? 'self-end bg-indigo-500 text-white px-4 py-2 rounded-2xl rounded-br-md max-w-[75%] break-words shadow'
                  : 'self-start bg-slate-800 text-indigo-100 px-4 py-2 rounded-2xl rounded-bl-md max-w-[75%] break-words shadow'
              }
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
            >
              {msg.role === 'model' ? (
                <div className="prose prose-invert prose-sm">
                  <ReactMarkdown>
                    {typingIdx === idx ? typedText : msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {loading && (
          <div className="text-center text-xs text-slate-400 mt-2">
            Thinking ...
          </div>
        )}
      </div>
      <form
        className="flex items-center gap-2 p-3 border-t border-slate-700 bg-[#23272f]"
        onSubmit={handleSend}
      >
        <input
          type="text"
          className="flex-1 rounded-lg bg-slate-800 text-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-base transition disabled:opacity-60"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #23272f;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
