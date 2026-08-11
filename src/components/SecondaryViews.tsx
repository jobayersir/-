import React, { useState } from 'react';
import { UserProfileData, NavTab, PostCadre } from '../types';
import { LeaderboardView } from './LeaderboardView';
import { ProfileView } from './ProfileView';
import { WrongQuestionsView } from './WrongQuestionsView';
export { LeaderboardView, ProfileView, WrongQuestionsView };
import { 
  User, 
  Bookmark, 
  AlertTriangle, 
  Trophy, 
  Crown, 
  Settings, 
  Check, 
  ShieldCheck, 
  Flame, 
  Target,
  Sparkles,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ViewProps {
  user: UserProfileData;
  onTabChange: (tab: NavTab) => void;
  selectedCadre?: PostCadre;
  onSelectCadre?: (cadre: PostCadre) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

// 1. My Profile View is exported from ./ProfileView.tsx

// 2. Bookmarks View
export const BookmarksView: React.FC<ViewProps> = ({ onTabChange }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
    <div className="flex items-center space-x-2">
      <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
      <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
        বুকমার্ককৃত প্রশ্ন ও নোটস
      </h2>
    </div>

    <div className="space-y-3">
      {[
        { title: 'নাহু: الفعل المتعدي এবং এর ৩টি মফউল প্রাপ্তির নিয়মাবলী', tag: 'MCQ #142', date: '২ আগস্ট' },
        { title: 'ফিকহুস সুন্নাহ্: অজুর ফারায়েজ ও সুন্নাতসমূহের প্রধান তারতম্য', tag: 'CQ #28', date: '৩১ জুলাই' },
        { title: 'পরিভাষা: الإجماع এবং இதன் শরিয়তি হুজ্জত মানার দলীল', tag: 'Glossary #09', date: '২৭ জুলাই' },
      ].map((item, idx) => (
        <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700 flex items-center justify-between">
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
              {item.tag}
            </span>
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.title}</h3>
          </div>
          <button 
            onClick={() => onTabChange('mcq')}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            অনুশীলন করুন
          </button>
        </div>
      ))}
    </div>
  </div>
);

// 3. Wrong Questions View is imported and exported from ./WrongQuestionsView above

// 4. Leaderboard View is imported from ./LeaderboardView above

// 5. Premium Membership View
export const PremiumView: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-800 text-slate-950 rounded-3xl p-8 shadow-xl text-center space-y-3">
      <Crown className="w-12 h-12 text-slate-950 mx-auto" />
      <h2 className="text-2xl font-black">ভিআইপি প্রিমিয়াম মেম্বারশিপ প্ল্যান</h2>
      <p className="text-xs sm:text-sm font-semibold max-w-xl mx-auto text-slate-900">
        মাদ্রাসা বিষয়ভিত্তিক পরীক্ষায় সর্বোচ্চ নম্বর অর্জনে প্রিমিয়াম মেম্বার হয়ে আনলিমিটেড মক টেস্ট ও তামরীন AI এক্সেস নিন।
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { plan: 'মাসিক প্ল্যান', price: '৳ ২৯৯', duration: '১ মাস এক্সেস', features: ['সকল ফ্রি কোর্স', 'ডেইলি মডেল টেস্ট', 'তামরীন AI প্রম্পট ৫০টি'] },
        { plan: 'ষাণ্মাসিক প্ল্যান', price: '৳ ৯৯৯', duration: '৬ মাস এক্সেস', popular: true, features: ['সকল প্রিমিয়াম ভিডিও কোর্স', 'আনলিমিটেড তামরীন AI', 'লাইভ মক টেস্ট', 'বিগত ১০ বছরের ব্যাংক'] },
        { plan: 'বাৎসরিক ভিআইপি', price: '৳ ১,৪৯৯', duration: '১ বছর এক্সেস', features: ['সকল ক্যাডার কোর্স', '১:১ এআই সাপোর্ট', 'ব্যক্তিগত টিউটর গাইডেন্স', 'প্রিন্টযোগ্য লেকচার শিট'] },
      ].map((p, idx) => (
        <div
          key={idx}
          className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-lg flex flex-col justify-between space-y-5 relative ${
            p.popular ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          {p.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full">
              সবচেয়ে জনপ্রিয়
            </span>
          )}

          <div className="space-y-3 text-center">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{p.plan}</h3>
            <div className="font-black text-3xl text-emerald-600 dark:text-emerald-400">{p.price}</div>
            <span className="text-[11px] text-slate-400 block">{p.duration}</span>

            <ul className="space-y-2 text-left pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              {p.features.map((f, fIdx) => (
                <li key={fIdx} className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => alert(`"${p.plan}" নির্বাচন করা হয়েছে। পেমেন্ট গেটওয়েতে রিডাইরেক্ট করা হচ্ছে...`)}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
          >
            মেম্বারশিপ চালু করুন
          </button>
        </div>
      ))}
    </div>
  </div>
);

// 6. Settings View
export const SettingsView: React.FC<ViewProps> = ({
  selectedCadre,
  onSelectCadre,
  darkMode,
  onToggleDarkMode,
}) => {
  const [sbUrl, setSbUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('VITE_SUPABASE_URL') || (import.meta as any).env?.VITE_SUPABASE_URL || '';
    }
    return '';
  });
  const [sbKey, setSbKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('VITE_SUPABASE_ANON_KEY') || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
    }
    return '';
  });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      if (sbUrl.trim()) {
        localStorage.setItem('VITE_SUPABASE_URL', sbUrl.trim());
      } else {
        localStorage.removeItem('VITE_SUPABASE_URL');
      }

      if (sbKey.trim()) {
        localStorage.setItem('VITE_SUPABASE_ANON_KEY', sbKey.trim());
      } else {
        localStorage.removeItem('VITE_SUPABASE_ANON_KEY');
      }

      localStorage.removeItem('tamreen_cached_exams');
      setSaveMessage('সুপাবেস কানেকশন সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => {
        setSaveMessage(null);
        window.location.reload();
      }, 1200);
    }
  };

  const isConfigured = Boolean(sbUrl && sbKey && sbUrl.startsWith('https://'));

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Settings className="w-5 h-5 text-emerald-600" />
        <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
          অ্যাপ সেটিংস ও পছন্দসমূহ
        </h2>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-500 font-semibold mb-1">পছন্দনীয় ক্যাডার পদ</label>
          <select
            value={selectedCadre}
            onChange={(e) => onSelectCadre?.(e.target.value as PostCadre)}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="assistant_teacher_arabic">সহকারী শিক্ষক (আরবি)</option>
            <option value="lecturer_arabic">প্রভাষক (আরবি/হাদিস/ফিকহ)</option>
            <option value="assistant_maulvi">সহকারী মৌলভী</option>
            <option value="ebtedayee_head">ইবতেদায়ী প্রধান ও ক্বারী</option>
            <option value="general_subject">সাধারণ বিষয় (বাংলা, ইংরেজি, গণিত)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
          <span className="font-semibold text-slate-800 dark:text-slate-200">ডার্ক মোড / নাইট ভিশন</span>
          <button
            onClick={onToggleDarkMode}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
          >
            {darkMode ? 'সক্রিয়' : 'বন্ধ'}
          </button>
        </div>

        {/* Supabase Connection Configuration */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span>সুপাবেস (Supabase) ডাটাবেইজ সিঙ্ক সেটিংস</span>
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isConfigured ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
              {isConfigured ? 'কানেক্টেড' : 'সেটআপ প্রয়োজন'}
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            এডমিন প্যানেল থেকে তৈরি নতুন পরীক্ষা সরাসরি অ্যাপে আনতে Supabase Project URL এবং Anon Key দিন। (Vercel-এ Environment Variables সেট থাকলে সরাসরি কাজ করবে)।
          </p>

          <form onSubmit={handleSaveSupabase} className="space-y-3 pt-2">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Supabase Project URL (https://xxx.supabase.co)
              </label>
              <input
                type="url"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Supabase Anon Key
              </label>
              <input
                type="password"
                value={sbKey}
                onChange={(e) => setSbKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs"
              />
            </div>

            {saveMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold text-center">
                {saveMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-98"
            >
              কানেকশন সেভ করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
