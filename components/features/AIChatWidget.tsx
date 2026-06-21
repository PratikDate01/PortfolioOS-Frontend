'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api-client';
import {
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatWidget({ username, displayName }: { username?: string; displayName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore sessionId from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = sessionStorage.getItem('ai_chat_session');
      if (savedSession) setSessionId(savedSession);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await apiFetch<{ reply: string; sessionId: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          username,
        }),
      });

      if (res.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: res.error || 'Sorry, something went wrong. Please try again.',
            timestamp: new Date(),
          },
        ]);
      } else if (res.data) {
        const newSessionId = res.data.sessionId;
        setSessionId(newSessionId);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ai_chat_session', newSessionId);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: res.data!.reply,
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Connection error. Please check your internet and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 transition-shadow hover:shadow-xl hover:shadow-teal-500/30"
            aria-label="Open AI Chat"
          >
            <Sparkles className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/95 shadow-2xl shadow-black/40 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500/20 to-teal-600/20 border border-teal-500/30">
                  <Bot className="h-4 w-4 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">AI Assistant</h3>
                  <p className="text-[10px] text-zinc-500">Ask me about {displayName || 'this user'}&apos;s work</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
                    <Sparkles className="h-6 w-6 text-teal-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-200 mb-1">
                    Hi! I&apos;m {displayName || 'this user'}&apos;s AI assistant
                  </h4>
                  <p className="text-xs text-zinc-500 mb-4">
                    Ask me about their projects, skills, experience, or anything from their portfolio.
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    {[
                      `What projects has ${displayName || 'this user'} built?`,
                      `What are their technical skills?`,
                      `Tell me about their experience`,
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setMessages((prev) => [
                            ...prev,
                            { role: 'user', content: suggestion, timestamp: new Date() },
                          ]);
                          setIsLoading(true);
                          apiFetch<{ reply: string; sessionId: string }>('/ai/chat', {
                            method: 'POST',
                            body: JSON.stringify({ message: suggestion, sessionId, username }),
                          }).then((res) => {
                            if (res.data) {
                              setSessionId(res.data.sessionId);
                              sessionStorage.setItem('ai_chat_session', res.data.sessionId);
                              setMessages((prev) => [
                                ...prev,
                                { role: 'assistant', content: res.data!.reply, timestamp: new Date() },
                              ]);
                            }
                            setIsLoading(false);
                          }).catch(() => setIsLoading(false));
                        }}
                        className="rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400 text-left transition-colors hover:border-teal-500/30 hover:text-teal-400"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-teal-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-500/15 text-teal-100 rounded-br-md'
                        : 'bg-zinc-800/60 text-zinc-200 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700/50 mt-0.5">
                      <User className="h-3.5 w-3.5 text-zinc-300" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20">
                    <Bot className="h-3.5 w-3.5 text-teal-400" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-zinc-800/60 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-400" />
                      <span className="text-xs text-zinc-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 p-3">
              <div className="flex items-center gap-2 rounded-xl bg-zinc-800/50 border border-zinc-700/50 px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask something..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none disabled:opacity-50"
                  maxLength={1000}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 transition-all hover:bg-teal-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[9px] text-zinc-600">
                Powered by AI · Responses are about {displayName || 'this user'}&apos;s portfolio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
