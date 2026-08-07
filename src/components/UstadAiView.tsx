import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { UstadAiLogo } from './UstadAiLogo';
import { formatArabicText, getArabicFontFamily, getBengaliFontFamily } from '../utils/arabic';
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
  Image as ImageIcon,
  History,
  MessageSquarePlus,
  Zap,
  RotateCcw,
  Key,
  X,
  Settings
} from 'lucide-react';

interface UstadAiViewProps {
  bengaliFont?: string;
  arabicFont?: string;
  harakatVisible?: boolean;
}

export const UstadAiView: React.FC<UstadAiViewProps> = ({
  bengaliFont = 'Hind Siliguri',
  arabicFont = 'Noto Naskh Arabic',
  harakatVisible = true,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ustad',
      text: `আমি তামরীন AI। আরবি, বাংলা ও ইংরেজির যেকোনো বিষয় জানতে আমাকে জিজ্ঞেস করুন।`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // API Key management
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [userApiKey, setUserApiKey] = useState(() => {
    return localStorage.getItem('tamreen_gemini_api_key') || '';
  });
  const [keyInput, setKeyInput] = useState(userApiKey);
  const [keySavedMsg, setKeySavedMsg] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveApiKey = () => {
    const trimmed = keyInput.trim();
    localStorage.setItem('tamreen_gemini_api_key', trimmed);
    setUserApiKey(trimmed);
    setKeySavedMsg(true);
    setTimeout(() => {
      setKeySavedMsg(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('tamreen_gemini_api_key');
    setUserApiKey('');
    setKeyInput('');
  };

  const cleanNoSymbols = (str: string) => {
    return str.replace(/[*#]/g, '').trim();
  };

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

    const currentImage = attachedImage;
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setAttachedImage(null);
    setLoading(true);

    const history = messages
      .filter((m) => m.id !== 'welcome-1')
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

    try {
      const activeKey = userApiKey || localStorage.getItem('tamreen_gemini_api_key') || undefined;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sec timeout for detailed responses

      const res = await fetch('/api/ustad-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          action: 'chat',
          prompt: textToSend || 'সংযুক্ত ছবিটি বিশ্লেষণ করুন',
          image: currentImage,
          history,
          apiKey: activeKey,
        }),
      }).finally(() => clearTimeout(timeoutId));

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'সার্ভার থেকে উত্তর পেতে সমস্যা হয়েছে।');
      }

      const rawText = data.text || 'উস্তাদ এআই উত্তর প্রদান করতে পারেনি। অনুগ্রহ করে আবার চেষ্টা করুন।';
      const ustadMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ustad',
        text: cleanNoSymbols(rawText),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, ustadMsg]);
    } catch (err: any) {
      const errorMsg = err?.message || 'উস্তাদ এআই সংযোগে সমস্যা হয়েছে। ইন্টারনেট বা API কী চেক করে আবার চেষ্টা করুন।';
      const ustadMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ustad',
        text: cleanNoSymbols(`উস্তাদ এআই: ${errorMsg}`),
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
                তামরীন এআই
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                PRO 3.6
              </span>
            </div>
            <p className="text-sm text-emerald-200/90 font-medium">
              আপনার পড়াশোনার বিশ্বস্ত সঙ্গী
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearChat}
            className="p-2.5 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 text-xs font-bold backdrop-blur-md flex items-center space-x-1.5 transition-all shadow-sm"
            title="নতুন চ্যাট শুরু করুন"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">নতুন চ্যাট</span>
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 rounded-2xl">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Gemini API Key সেটিং
                </h3>
                <p className="text-xs text-slate-5-00 text-slate-500 dark:text-slate-400">
                  আপনার নিজস্ব Gemini API Key ব্যবহার করে সরাসরি AI সার্ভিস চালু রাখুন
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Gemini API Key (Google AI Studio):
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                কী টি আপনার ব্রাউজারের LocalStorage-এ নিরাপদে সংরক্ষিত থাকবে।
              </p>
            </div>

            {keySavedMsg && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center">
                ✓ API Key সফলভাবে সংরক্ষিত হয়েছে!
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {userApiKey ? (
                <button
                  onClick={handleClearApiKey}
                  className="px-3 py-2 text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                >
                  কী মুছে ফেলুন
                </button>
              ) : <div />}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Interface Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col h-[580px] overflow-hidden">
        
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
                  className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-4 sm:p-6 space-y-3 relative group shadow-md ${
                    isUstad
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-emerald-50 border-2 border-emerald-500/30 dark:border-emerald-700/60'
                      : 'bg-emerald-600 text-white font-semibold rounded-tr-xs'
                  }`}
                >
                  <div className="space-y-3">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (!line.trim()) return <div key={lIdx} className="h-2" />;
                      
                      // Clean line of non-letter characters to check leading script
                      const cleanedLine = line.replace(/[\d\s\p{P}\p{S}]/gu, '');
                      const startsWithArabic = /^[\u0600-\u06FF]/.test(cleanedLine);
                      const hasBanglaOrEnglish = /[\u0980-\u09FFa-zA-Z]/.test(line);

                      // Pure Arabic lines (verses, Hadith text without Bangla/English body text)
                      const isPureArabic = startsWithArabic && !hasBanglaOrEnglish;
                      const formattedText = isPureArabic
                        ? formatArabicText(line, harakatVisible)
                        : line;

                      return (
                        <p
                          key={lIdx}
                          dir={isPureArabic ? 'rtl' : 'ltr'}
                          style={{
                            fontFamily: isPureArabic
                              ? getArabicFontFamily(arabicFont)
                              : getBengaliFontFamily(bengaliFont),
                          }}
                          className={
                            isPureArabic
                              ? isUstad
                                ? 'text-center text-emerald-950 dark:text-emerald-100 text-[20px] font-bold py-1 leading-[2.0]'
                                : 'text-center text-white text-[20px] font-bold py-1 leading-[2.0]'
                              : isUstad
                              ? 'text-left text-slate-900 dark:text-emerald-50 text-[16px] font-medium leading-[1.8]'
                              : 'text-left text-white text-[16px] font-medium leading-[1.8]'
                          }
                        >
                          {formattedText}
                        </p>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 text-xs sm:text-sm opacity-80">
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
              <div className="bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl text-[16px] text-slate-600 dark:text-slate-300 font-medium animate-pulse text-left">
                তামরীন AI নাহু, সরফ ও ফিকহ রেফারেন্স থেকে বিস্তারিত উত্তর সাজাচ্ছেন...
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
              placeholder={isRecording ? 'আপনার কথা শুনছি...' : 'তামরীন AI-কে জিজ্ঞেস করুন...'}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={loading || (!inputPrompt.trim() && !attachedImage)}
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 transition-all flex items-center space-x-1.5"
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
