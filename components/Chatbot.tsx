import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  text: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Persist threadId in localStorage so conversation
   * survives page refresh (stateless backend)
   */
  const [threadId, setThreadId] = useState<string | null>(() => {
    const saved = localStorage.getItem("threadId");
    return saved && saved.length > 0 ? saved : null;
  });

  // Track first interaction (tooltip logic)
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Initial welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hello! I am Rahul's AI Assistant. Ask me anything about his projects, skills, or experience."
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show tooltip after 2s if unopened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasInteracted) {
        setShowTooltip(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen, hasInteracted]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
    setShowTooltip(false);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userText = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          threadId // may be null on first request (backend will create one)
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Chat failed');
      }

      // Save threadId for future messages & refresh persistence
      if (data.threadId) {
        setThreadId(data.threadId);
        localStorage.setItem("threadId", data.threadId);
      }

      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: "I'm having trouble connecting to the neural network. Please try again later."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tooltip */}
      <AnimatePresence>
        {!isOpen && showTooltip && !hasInteracted && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-8 z-50 max-w-[200px]"
          >
            <div className="bg-white/90 backdrop-blur text-black px-4 py-3 rounded-2xl rounded-br-none shadow-xl border border-purple-500/30">
              <p className="text-xs font-bold leading-tight">
                👋 Hi! I'm Rahul's AI Agent. Speak with me!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              y: hasInteracted ? 0 : [0, -15, 0]
            }}
            transition={{
              scale: { duration: 0.2 },
              y: {
                repeat: hasInteracted ? 0 : Infinity,
                repeatDelay: 2,
                duration: 0.6,
                ease: "easeInOut"
              }
            }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 p-4 bg-purple-600 hover:bg-purple-500 rounded-full shadow-[0_0_30px_rgba(147,51,234,0.6)] border border-white/20"
          >
            <div className="relative">
              <Bot className="text-white w-8 h-8" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-purple-600"></span>
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[380px] h-[550px]
                       bg-black/20 backdrop-blur-2xl border border-white/10
                       rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bot className="text-purple-300" />
                <div>
                  <h3 className="text-sm font-bold text-white">Rahul's AI Assistant</h3>
                  <p className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    ONLINE
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] p-3 text-sm rounded-2xl
                      ${m.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-sm'
                        : 'bg-[#111] text-gray-100 rounded-bl-sm'
                      }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#111] px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-xs text-gray-400">PROCESSING...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="relative"
              >
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                  placeholder="Ask something..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="absolute right-2 top-2 p-2 bg-purple-600 rounded-lg text-white"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
