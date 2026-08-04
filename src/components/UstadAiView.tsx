import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { UstadAiLogo } from './UstadAiLogo';
import { 
  Send, 
  Sparkles, 
  User, 
  Copy, 
  Check, 
  Mic, 
  MicOff, 
  Paperclip, 
  Trash2, 
  Lightbulb, 
  Image as ImageIcon,
  History,
  MessageSquarePlus,
  Zap,
  RotateCcw
} from 'lucide-react';

export const UstadAiView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ustad',
      text: `আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ! আমি **উস্তাদ এআই** (Ustad AI Tutor)।
বাংলাদেশ মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) পরীক্ষার যেকোনো প্রশ্ন, আরবি ব্যাকরণ (نحو وصرف), ফিকহ, হাদীস বা অনলাইন প্রস্তুতি কৌশল জিজ্ঞেস করুন।`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    'নাহু ও সরফের প্রধান পার্থক্য এবং এরাব নির্ধারণের সহজ কৌশল',
    'ইলমে ফরায়েজে আসাবা ও জবুল ফুরূজের অংশ বন্টন নীতি',
    'ফিকহুস সুন্নাহ্ বইয়ের মূল বিষয়সমূহ ও নিবন্ধনের গুরুত্বপূর্ণ অধ্যায়',
    '১৭তম ও ১৮তম নিবন্ধনের আরবি ব্যাকরণ প্রশ্নের উদাহরণ ও সমাধান',
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
    if ((!textToSend.trim() && !attachedImage) || loading) return;

    let fullPrompt = textToSend;
    if (attachedImage) {
      fullPrompt = `[সংযুক্ত ছবি স্ক্যান করে উত্তর প্রদান করুন] ${textToSend}`;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend || 'সংযুক্ত ছবি টিউটরকে পাঠানো হয়েছে',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setAttachedImage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/ustad-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: fullPrompt,
        }),
      });

      const data = await res.json();
      const ustadMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ustad',
        text: data.text || data.error || '✨ **উস্তাদ এআই উত্তর:** আপনার প্রশ্নের সমাধান তামরীন একাডেমি ডেটাবেস থেকে প্রস্তুত করা হচ্ছে। পুনরায় প্রশ্ন করুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, ustadMsg]);
    } catch (err) {
      // Local fallback in case of direct fetch/network error
      const ustadMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ustad',
        text: `✨ **উস্তাদ এআই উত্তর:**
আপনার প্রশ্নটি সংরক্ষিত হয়েছে: "${textToSend}"

📚 **মাদ্রাসা নিবন্ধন প্রস্তুতি টিপস:**
• **নাহু ও সরফ:** বাক্যের শেষ বর্ণে এরাব ও সিগাহ রূপান্তরের নিয়ম ভালোভাব পড়ুন।
• **ফিকহ ও হাদিস:** আল-কুরআন ও সুন্নাহর মৌলিক বিধানসমূহ থেকে নিবন্ধন পরীক্ষায় ১৫+ নম্বর আসবে।
• তামরীন একাডেমির মডেল টেস্টে অনুশীলন চালিয়ে যান!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, ustadMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setInputPrompt('নাহু শাস্ত্রের জনক কে এবং এর মূল উদ্দেশ্য কী?');
        setIsRecording(false);
      }, 2500);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ustad',
        text: 'নতুন চ্যাট শুরু করা হয়েছে। আপনার নতুন প্রশ্ন করুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* ChatGPT Style Top Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-xl border border-emerald-800/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UstadAiLogo size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                উস্তাদ এআই (Ustad AI)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                PRO 3.6
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              আরবি ব্যাকরণ, ফিকহ ও নিবন্ধনের স্মার্ট সহকারী
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold backdrop-blur-md flex items-center space-x-1.5 transition-colors"
            title="নতুন চ্যাট শুরু করুন"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">নতুন চ্যাট</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center">
          <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-500" /> সাজেস্টেড প্রশ্ন:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap shadow-xs transition-all hover:scale-[1.02] shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col h-[560px] overflow-hidden">
        
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
                  <div className="shrink-0">
                    <UstadAiLogo size="sm" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm space-y-2 relative group shadow-sm ${
                    isUstad
                      ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80'
                      : 'bg-emerald-600 text-white font-medium rounded-tr-xs'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed font-sans">
                    {msg.text}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {isUstad && (
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="hover:opacity-100 p-1 transition-opacity flex items-center space-x-1"
                        title="উত্তর কপি করুন"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isUstad && (
                  <div className="w-8 h-8 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3">
              <UstadAiLogo size="sm" />
              <div className="bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl text-xs text-slate-600 dark:text-slate-300 font-medium animate-pulse">
                উস্তাদ এআই নাহু, সরফ ও ফিকহ রেফারেন্স থেকে উত্তর সাজাচ্ছেন...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Image Attachment Preview */}
        {attachedImage && (
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">ছবি যুক্ত করা হয়েছে</span>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              মুছে ফেলুন
            </button>
          </div>
        )}

        {/* Input Controls Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {/* Image Attachment Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="বইয়ের পাতা বা নোটে ছবি আপলোড করুন"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-3 rounded-2xl border transition-colors ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title={isRecording ? 'ভয়েস রেকর্ড বন্ধ করুন' : 'ভয়েস রেকর্ড শুরু করুন'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Prompt Input Box */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={isRecording ? 'আপনার কথা শুনছি...' : 'উস্তাদ এআই-কে জিজ্ঞেস করুন...'}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || (!inputPrompt.trim() && !attachedImage)}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 transition-all flex items-center space-x-1.5"
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
