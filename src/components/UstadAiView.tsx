import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, Send, Sparkles, User, RefreshCw, BookOpen, Lightbulb, HelpCircle, Copy, Check } from 'lucide-react';

export const UstadAiView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ustad',
      text: 'আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ! আমি "উস্তাদ এআই" (Ustad AI)। বাংলাদেশ মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) প্রস্তুতির বিষয়ে আপনার যেকোনো প্রশ্ন, আরবি ব্যাকরণ, ফিকহ, হাদীস বা প্রস্তুতি কৌশল সম্পর্কিত জটিলতা জিজ্ঞেস করুন।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'নাহু ও সরফের পার্থক্য এবং এরাব নির্ধারণের সহজ নিয়ম',
    'ইলমে ফরায়েজে আসাবা ও জবুল ফুরূজের সম্পদ বন্টন নীতি',
    'কিয়াস এর ৪টি রুকন ও উদাহরণসহ ব্যাখ্যা',
    '১৭তম নিবন্ধন পরীক্ষার সহকারী শিক্ষক (আরবি) প্রস্তুতির সেরা রুটিন',
    'বালাগাত ও ফাসাহাত এর পার্থক্য কী?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ustad-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: textToSend,
        }),
      });

      const data = await res.json();
      const ustadMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ustad',
        text: data.text || data.error || 'দুঃখিত, উত্তর প্রদান করা সম্ভব হয়নি। আবার চেষ্টা করুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, ustadMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ustad',
          text: 'নেটওয়ার্ক সংযোগ ত্রুটি হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center">
              উস্তাদ এআই (Ustad AI Tutor)
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
                Gemini 3.6 Flash
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              মাদ্রাসা শিক্ষক নিবন্ধন বিষয়ক যেকোনো প্রশ্নের উত্তর পেতে টাইপ বা নির্বাচন করুন।
            </p>
          </div>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center">
          <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-500" /> কুইক প্রশ্ন:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap shadow-sm transition-all hover:scale-105 shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-md flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUstad = msg.sender === 'ustad';
            return (
              <div
                key={msg.id}
                className={`flex space-x-3 ${isUstad ? 'justify-start' : 'justify-end'}`}
              >
                {isUstad && (
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm space-y-2 relative group shadow-sm ${
                    isUstad
                      ? 'bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
                      : 'bg-emerald-600 text-white font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  
                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {isUstad && (
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="hover:opacity-100 p-1 transition-opacity"
                        title="কপি করুন"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isUstad && (
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center animate-bounce">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl text-xs text-slate-500 animate-pulse">
                উস্তাদ এআই উত্তর তৈরি করছেন...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="উস্তাদ এআই-কে জিজ্ঞেস করুন (যেমন: বালাগাত এর সংজ্ঞা কী)..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 transition-all flex items-center space-x-1"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">পাঠান</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
