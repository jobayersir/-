import React from 'react';
import { UserProfileData, ExamResult } from '../types';
import { 
  LayoutDashboard, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Target, 
  Trophy, 
  TrendingUp, 
  BarChart2, 
  BookOpen, 
  Award,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfileData;
  examResults: ExamResult[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, examResults }) => {
  const sampleExamHistory: ExamResult[] = examResults.length > 0 ? examResults : [
    {
      id: 'res-1',
      date: '০৩ আগস্ট ২০২৬',
      totalQuestions: 25,
      correctAnswers: 21,
      wrongAnswers: 3,
      skipped: 1,
      score: 84,
      timeTakenSeconds: 980,
      cadre: 'assistant_teacher_arabic',
      subjectFilter: 'আরবি ব্যাকরণ (নাহু ও সরফ)',
    },
    {
      id: 'res-2',
      date: '০১ আগস্ট ২০২৬',
      totalQuestions: 50,
      correctAnswers: 42,
      wrongAnswers: 6,
      skipped: 2,
      score: 84,
      timeTakenSeconds: 1820,
      cadre: 'assistant_teacher_arabic',
      subjectFilter: 'সাধারণ বিষয় (বাংলা ও গণিত)',
    },
    {
      id: 'res-3',
      date: '২৯ জুলাই ২০২৬',
      totalQuestions: 30,
      correctAnswers: 22,
      wrongAnswers: 5,
      skipped: 3,
      score: 73,
      timeTakenSeconds: 1200,
      cadre: 'assistant_teacher_arabic',
      subjectFilter: 'ফিকহ ও উসূলে ফিকহ',
    },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-teal-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>ব্যক্তিগত পারফরম্যান্স ও অগ্রগতি বিশ্লেষণ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            স্টুডেন্ট পারফরম্যান্স ড্যাশবোর্ড (Dashboard)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            আপনার প্রস্তুতি, সমাধানকৃত প্রশ্নের পরিসংখ্যান, নির্ভুলতার হার ও বিগত মডেল টেস্টগুলোর রিপোর্ট।
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/15">
          <Award className="w-8 h-8 text-amber-400" />
          <div className="text-left">
            <span className="text-[10px] text-slate-300 block">বর্তমান রেটিং</span>
            <span className="font-extrabold text-white text-base">টপ ৫% পরীক্ষার্থী</span>
          </div>
        </div>
      </div>

      {/* Hero Performance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">অধ্যয়ন স্ট্রিক</span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="font-black text-2xl text-slate-900 dark:text-slate-100">
            {user.streakDays} দিন
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            ধারাবাহিক পড়াশোনা অব্যাহত রয়েছে
          </p>
        </div>

        {/* Solved Questions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">সমাধানকৃত প্রশ্ন</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-black text-2xl text-slate-900 dark:text-slate-100">
            {user.totalSolvedQuestions}টি
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            লক্ষ্য: ৩,০০০টি প্রশ্ন
          </p>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">নির্ভুলতার হার</span>
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-black text-2xl text-slate-900 dark:text-slate-100">
            {user.accuracyRate}%
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
            বিগত মডেল টেস্টের ভিত্তিতে
          </p>
        </div>

        {/* Target Cadre */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ক্যাডার লক্ষ্য</span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="font-black text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
            সহকারী শিক্ষক (আরবি)
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            {user.targetYear} নিবন্ধন
          </p>
        </div>

      </div>

      {/* Subject Strength Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
            বিষয়ভিত্তিক দক্ষতার চার্ট (Subject Strength)
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { subject: 'আল-কুরআন ও আল-হাদিস', percent: 88, color: 'bg-emerald-500' },
            { subject: 'ফিকহ ও উসূলে ফিকহ', percent: 82, color: 'bg-teal-500' },
            { subject: 'আরবি ভাষা ও সাহিত্য (নাহু ও সরফ)', percent: 76, color: 'bg-amber-500' },
            { subject: 'বাংলা ও ইংরেজি ব্যাকরণ', percent: 70, color: 'bg-blue-500' },
            { subject: 'সাধারণ গণিত ও মানসিক দক্ষতা', percent: 65, color: 'bg-rose-500' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>{item.subject}</span>
                <span className="font-bold">{item.percent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Exam History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
            বিগত পরীক্ষার স্কোর ও রিপোর্ট
          </h3>
          <span className="text-xs text-slate-400">সর্বশেষ ৩টি পরীক্ষা</span>
        </div>

        <div className="space-y-3">
          {sampleExamHistory.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                    {res.date}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {res.subjectFilter}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center space-x-3 pt-1">
                  <span>মোট প্রশ্ন: {res.totalQuestions}টি</span>
                  <span>সঠিক: {res.correctAnswers}টি</span>
                  <span>ভুল: {res.wrongAnswers}টি</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                    {res.score}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">স্কোর</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
