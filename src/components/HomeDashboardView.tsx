import React from 'react';
import { PostCadre } from '../types';
import { Logo } from './Logo';
import { 
  Sparkles, 
  CheckSquare, 
  Edit3, 
  BookOpen, 
  Bot, 
  Award, 
  Flame, 
  Target, 
  ArrowRight, 
  BookMarked, 
  Rocket, 
  ShieldCheck,
  Zap,
  TrendingUp,
  Brain
} from 'lucide-react';

interface HomeDashboardViewProps {
  selectedCadre: PostCadre;
  onTabChange: (tab: string) => void;
  testCount: number;
  averageScore: number;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  selectedCadre,
  onTabChange,
  testCount,
  averageScore,
}) => {
  const cadreLabels: Record<PostCadre, string> = {
    all: 'সকল ক্যাডার / পদ',
    assistant_teacher_arabic: 'সহকারী শিক্ষক (আরবি)',
    lecturer_arabic: 'প্রভাষক (আরবি/হাদিস/ফিকহ)',
    assistant_maulvi: 'সহকারী মৌলভী',
    ebtedayee_head: 'ইবতেদায়ী প্রধান ও ক্বারী',
    lecturer_islamic_history: 'প্রভাষক (ইসলামী ইতিহাস)',
    general_subject: 'সাধারণ বিষয় (বাংলা, ইংরেজি, গণিত)',
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>তামরীন একাডেমি • মাদ্রাসা স্পেশাল ব্যাচ</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              বিসমিল্লাহির রহমানির রহিম <br />
              <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                মাদ্রাসা শিক্ষা ও পরীক্ষা সফলতার বিশ্বস্ত সঙ্গী
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              সহকারী শিক্ষক (আরবি), প্রভাষক (হাদিস/ফিকহ), সহকারী মৌলভী ও ইবতেদায়ী ক্যাডারের জন্য তামরীন একাডেমির বিশ্বস্ত আরবি-বাংলা-ইংরেজি সিলেবাস, উস্তাদ এআই, এমসিকিউ ও সিকিউ প্রস্তুতির সেরা ডিজিটাল প্ল্যাটফর্ম।
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onTabChange('mcq')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4" />
                <span>মক টেস্ট শুরু করুন</span>
              </button>

              <button
                onClick={() => onTabChange('ustad_ai')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 flex items-center space-x-2 transition-all"
              >
                <Bot className="w-4 h-4 text-teal-300" />
                <span>উস্তাদ এআই সাহায্য নিন</span>
              </button>
            </div>
          </div>

          {/* Logo Badge in Hero */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-white/10 dark:bg-slate-900/80 rounded-2xl backdrop-blur-md border border-white/15 shadow-2xl flex-shrink-0">
            <Logo variant="stacked" size="lg" />
          </div>
        </div>
      </div>

      {/* Target Status & Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Selected Cadre */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">আপনার লক্ষ্যভুক্ত পদ</p>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {cadreLabels[selectedCadre]}
            </h4>
          </div>
        </div>

        {/* Tests Completed */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">সম্পন্ন মক টেস্ট</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {testCount} টি
            </h4>
          </div>
        </div>

        {/* Avg Score */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">গড় অর্জন</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {averageScore > 0 ? `${averageScore.toFixed(0)}%` : 'নতুন শুরু'}
            </h4>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">স্টাডি স্ট্রিক</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              ৭ দিন 🔥
            </h4>
          </div>
        </div>
      </div>

      {/* Main Core Features Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
            মূল ফিচারসমূহ ও প্রস্তুতি বিভাগ
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">বিষয়ভিত্তিক সিলেবাস উপযোগী</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: MCQ Practice */}
          <div 
            onClick={() => onTabChange('mcq')}
            className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                এমসিকিউ ও মডেল টেস্ট
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                বিষয়ভিত্তিক ও পদভিত্তিক টাইমড মডেল টেস্ট। নেগেটিভ মার্কিং (০.২৫), তাৎক্ষণিক স্কোর, সঠিক উত্তর ও বিস্তারিত ব্যাখ্যাসহ সমাধান।
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>টেস্ট দিন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: CQ / Written */}
          <div 
            onClick={() => onTabChange('cq')}
            className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Edit3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                সিকিউ ও লিখিত প্রস্তুতি
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                রচনামূলক ও সংক্ষিপ্ত প্রশ্ন, আরবি-বাংলা নমুনা উত্তর এবং আপনার হাতে লেখা বা টাইপ করা উত্তর উস্তাদ এআই দিয়ে মার্কিং করান।
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
              <span>অনুশীলন করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Ustad AI */}
          <div 
            onClick={() => onTabChange('ustad_ai')}
            className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                উস্তাদ এআই
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                আরবি ব্যাকরণ, ফিকহ জটিলতা, হাদিসের সনদ বা নিবন্ধন সিলেবাস সম্পর্কিত যেকোনো প্রশ্ন উস্তাদ এআই-কে জিজ্ঞেস করুন।
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>কথা বলুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Question Bank */}
          <div 
            onClick={() => onTabChange('question_bank')}
            className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                বিগত বছরের প্রশ্ন ব্যাংক
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                আরবি, ফিকহ, হাদিস ও ইসলামিক বিষয়ের বিগত বছরের সকল পরীক্ষার সমাধানকৃত প্রশ্নপত্র ও ট্যাগভিত্তিক ফিল্টার।
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>প্রশ্ন ব্যাংক দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Arabic Glossary */}
          <div 
            onClick={() => onTabChange('glossary')}
            className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookMarked className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                আরবি পরিভাষা ও ডিকশনারি
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                বালাগাত, নাহু, সরফ, ফিকহ ও হাদীসের জটিল ইসলামিক পরিভাষার আরবি-বাংলা অভিধান।
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <span>অভিধান খুলুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Deployment & Supabase Guide */}
          <div 
            onClick={() => onTabChange('deployment')}
            className="group bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-white"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/30">
                <Rocket className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors">
                গিটহাব, সুপাবেস ও ভার্সেল গাইড
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                এই অ্যাপটিকে গিটহাব থেকে ডাউনলোড, সুপাবেস ডাটাবেইজ সেটআপ, Vercel এ ডিপ্লয় এবং .com ডোমেইন যুক্ত করার সম্পূর্ণ স্টেপ-বাই-স্টেপ গাইড।
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>গাইডলাইন দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Featured Question of the Day */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 rounded-2xl p-6 border border-emerald-200/80 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center">
            <Brain className="w-4 h-4 mr-1.5 text-emerald-600" />
            আজকের বিশেষ সাধারণ প্রশ্ন
          </span>
          <span className="text-[11px] bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
            ফিকহ ও উসূলে ফিকহ
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
          ইসলামী শরীয়তের ৪র্থ মৌলিক উৎস কোনটি এবং কিয়াসের প্রধান রুকন কয়টি?
        </h4>

        <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300">
            উত্তর: <strong className="text-emerald-700 dark:text-emerald-400">কিয়াস</strong>, রুকন: ৪টি (আসল, ফারঅ, ইল্লত, হুকুম)।
          </span>
          <button
            onClick={() => onTabChange('mcq')}
            className="mt-2 sm:mt-0 text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center"
          >
            অনুরূপ আরও প্রশ্ন সমাধান করুন <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

    </div>
  );
};
