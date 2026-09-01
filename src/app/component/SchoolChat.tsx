// components/SchoolChat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  User,
  Bot,
  FileText,
  Loader2,
  Paperclip,
  Send,
  X,
} from 'lucide-react';
import MarkdownRenderer from '../component/MarkdownRenderer';

interface FileAttachment {
  name: string;
  type: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  fileAttachment?: FileAttachment;
}

export default function SchoolChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !file) || isLoading) return;

    const currentInput = input.trim();
    const currentFile = file;

    setInput('');
    setFile(null);

    // Build payload object for state
    const userMsg: ChatMessage = {
      role: 'user',
      content: currentInput,
      ...(currentFile && {
        fileAttachment: { name: currentFile.name, type: currentFile.type },
      }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Map state messages to Gemini history structure
      const apiHistory = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: apiHistory,
          message: currentInput,
        }),
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          { role: 'model', content: data.text },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: `**Error:** ${data.error || 'Failed to generate response.'}`,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: '**Error:** Unable to connect to server. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col relative overflow-hidden font-sans">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col h-full max-w-5xl w-full mx-auto p-2 sm:p-4 md:p-6">
        <div className="flex flex-col h-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                <GraduationCap className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white flex items-center gap-2">
                  Student AI Assistant
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                </h1>
                <p className="text-xs text-blue-200/70">Powered by Gemini 3.6 Flash & KaTeX</p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
              <span className="text-white/70 text-xs">System Online</span>
            </div>
          </header>

          {/* Chat Messages */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-blue-200/60 my-auto py-20">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-blue-300 opacity-50" />
                <h3 className="text-lg font-medium text-white">How can I help you today?</h3>
                <p className="text-sm mt-1 max-w-md mx-auto text-blue-200/70">
                  Ask me about math equations, schedules, exam prep, or study guidance.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`p-2.5 rounded-2xl text-white flex-shrink-0 border border-white/20 backdrop-blur-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg'
                      : 'bg-white/10'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-300" />
                  )}
                </div>

                <div
                  className={`p-4 rounded-3xl max-w-[85%] text-sm leading-relaxed border transition-all backdrop-blur-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white border-white/30 rounded-tr-none shadow-xl'
                      : 'bg-white/10 text-blue-50 border-white/20 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.fileAttachment && (
                    <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-blue-200">
                      <FileText className="w-4 h-4 text-cyan-300" />
                      <span className="truncate">{msg.fileAttachment.name}</span>
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none text-sm space-y-2">
                    <MarkdownRenderer content={msg.content} />
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20 text-blue-300 backdrop-blur-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-3 rounded-3xl rounded-tl-none text-sm text-blue-200">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* Input Area */}
          <footer className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-2">
              {file && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-xs text-blue-200 border border-white/20 backdrop-blur-sm">
                  <FileText className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="max-w-[200px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="hover:text-red-400 transition ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf,text/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white/10 hover:bg-white/20 text-blue-200 rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                  title="Attach File or Image"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question or type LaTeX math (e.g. \int x^2 dx)..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-blue-200/50 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-blue-400/50 transition backdrop-blur-sm"
                />

                <button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !file)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 text-white px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center cursor-pointer disabled:cursor-not-allowed border border-white/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
}