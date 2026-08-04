import React from 'react';
import { UserProfileData, NavTab, PostCadre } from '../types';
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

// 1. My Profile View
export const ProfileView: React.FC<ViewProps> = ({ user, onTabChange }) => (
  <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
    <div className="flex items-center space-x-4 pb-6 border-b border-slate-100 dark:border-slate-800">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-1 shadow-md">
        <div className="w-full h-full rounded-[20px] bg-slate-900 flex items-center justify-center font-bold text-2xl text-emerald-300">
          {user.name.charAt(0)}
        </div>
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <span>{user.name}</span>
          {user.isPremium && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              VIP PREM
            </span>
          )}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
          সহকারী শিক্ষক (আরবি) • {user.targetYear} নিবন্ধন
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
        <span className="text-xs text-slate-400 font-medium block">সদস্যপদ যোগদানের তারিখ</span>
        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{user.joinedDate}</span>
      </div>
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
        <span className="text-xs text-slate-400 font-medium block">চলতি স্ট্রিক</span>
        <span className="font-bold text-sm text-amber-500">{user.streakDays} দিন টানা অধ্যয়ন</span>
      </div>
    </div>

    <button
      onClick={() => onTabChange('dashboard')}
      className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
    >
      পারফরম্যান্স ড্যাশবোর্ড দেখুন
    </button>
  </div>
);

// 2. Bookmarks View
export const BookmarksView: React.FC<ViewProps> = ({ onTabChange }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
    <div className="flex items-center space-x-2">
      <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
      <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
        বুকমার্ককৃত প্রশ্ন ও নোটস (Bookmarks)
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

// 3. Wrong Questions View
export const WrongQuestionsView: React.FC<ViewProps> = ({ onTabChange }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
    <div className="flex items-center space-x-2">
      <AlertTriangle className="w-5 h-5 text-rose-500" />
      <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
        ভুল উত্তরের ব্যাংক (Wrong Questions Review)
      </h2>
    </div>

    <p className="text-xs text-slate-500">
      পূর্বে অনুষ্ঠিত মডেল টেস্টে যে প্রশ্নগুলো ভুল উত্তর দিয়েছিলেন, সেগুলো পুনরায় রিভিশন দিয়ে প্রস্তুতি নিখুঁত করুন।
    </p>

    <div className="space-y-3">
      {[
        { q: 'বালাগাত শাস্ত্রে ‘ইলমুল বায়ান’ এর মূল আলোচ্য বিষয় কী?', wrongAns: 'শব্দের সজ্জা', correctAns: 'তাশবীহ ও ইস্তিয়ারা', cadre: 'সহকারী শিক্ষক (আরবি)' },
        { q: 'কিয়াস শব্দের অভিধানিক অর্থ কী?', wrongAns: 'সংক্ষেপকরণ', correctAns: 'অনুমান বা পরিমাপ করা', cadre: 'প্রভাষক (আরবি)' },
      ].map((item, idx) => (
        <div key={idx} className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-2">
          <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.q}</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="text-rose-600 dark:text-rose-400">ভুল উত্তর: {item.wrongAns}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">সঠিক উত্তর: {item.correctAns}</span>
          </div>
        </div>
      ))}
    </div>

    <button
      onClick={() => onTabChange('mcq')}
      className="w-full py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md"
    >
      পুনরায় ভুল প্রশ্নের পরীক্ষা দিন
    </button>
  </div>
);

// 4. Leaderboard View
export const LeaderboardView: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
    <div className="flex items-center space-x-2">
      <Trophy className="w-6 h-6 text-amber-500" />
      <h2 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
        তামরীন একাডেমি জাতীয় মেধা তালিকা (Leaderboard)
      </h2>
    </div>

    <div className="space-y-2">
      {[
        { rank: 1, name: 'মাওলানা হাফেজ আব্দুল মালেক', location: 'ঢাকা', score: '২,৮৪০ পয়েন্ট', bg: 'from-amber-400 to-amber-600' },
        { rank: 2, name: 'মুফতি তানভীর আহমেদ', location: 'চট্টগ্রাম', score: '২,৭১০ পয়েন্ট', bg: 'from-slate-300 to-slate-500' },
        { rank: 3, name: 'কারি মোশতাক মাহমুদ', location: 'সিলেট', score: '২,৬৫০ পয়েন্ট', bg: 'from-amber-600 to-amber-800' },
        { rank: 4, name: 'মাওলানা মোঃ আব্দুল্লাহ (আপনি)', location: 'ময়মনসিংহ', score: '২,৪২০ পয়েন্ট', bg: 'from-emerald-500 to-teal-700' },
        { rank: 5, name: 'মাওলানা উবায়দুল ইসলাম', location: 'রাজশাহী', score: '২,৩৮০ পয়েন্ট', bg: 'from-slate-400 to-slate-600' },
      ].map((user) => (
        <div
          key={user.rank}
          className={`flex items-center justify-between p-4 rounded-2xl border ${
            user.rank === 4
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700 font-bold'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/50 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${user.bg} text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-xs`}>
              #{user.rank}
            </span>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">{user.name}</h3>
              <span className="text-[10px] text-slate-400">{user.location}</span>
            </div>
          </div>

          <span className="font-black text-xs text-amber-600 dark:text-amber-400">{user.score}</span>
        </div>
      ))}
    </div>
  </div>
);

// 5. Premium Membership View
export const PremiumView: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-800 text-slate-950 rounded-3xl p-8 shadow-xl text-center space-y-3">
      <Crown className="w-12 h-12 text-slate-950 mx-auto" />
      <h2 className="text-2xl font-black">ভিআইপি প্রিমিয়াম মেম্বারশিপ প্ল্যান</h2>
      <p className="text-xs sm:text-sm font-semibold max-w-xl mx-auto text-slate-900">
        ১৮তম মাদ্রাসা শিক্ষক নিবন্ধন পরীক্ষায় প্রথম চয়েসে টিকতে প্রিমিয়াম মেম্বার হয়ে আনলিমিটেড মক টেস্ট ও উস্তাদ এআই এক্সেস নিন।
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { plan: 'মাসিক প্ল্যান', price: '৳ ২৯৯', duration: '১ মাস এক্সেস', features: ['সকল ফ্রি কোর্স', 'ডেইলি মডেল টেস্ট', 'উস্তাদ এআই প্রম্পট ৫০টি'] },
        { plan: 'ষাণ্মাসিক প্ল্যান', price: '৳ ৯৯৯', duration: '৬ মাস এক্সেস', popular: true, features: ['সকল প্রিমিয়াম ভিডিও কোর্স', 'আনলিমিটেড উস্তাদ এআই', 'লাইভ মক টেস্ট', 'বিগত ১০ বছরের ব্যাংক'] },
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
}) => (
  <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
    <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
      <Settings className="w-5 h-5 text-emerald-600" />
      <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
        অ্যাপ সেটিংস ও পছন্দসমূহ (Settings)
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
          {darkMode ? 'সক্রিয় (Dark)' : 'বন্ধ (Light)'}
        </button>
      </div>
    </div>
  </div>
);
