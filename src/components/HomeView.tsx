import React from 'react';
import { NavTab, CourseItem, ExamItem } from '../types';
import { Logo } from './Logo';
import { 
  Sparkles, 
  Zap, 
  Bot, 
  BookOpen, 
  GraduationCap, 
  FileCheck2, 
  Clock, 
  Users, 
  Star, 
  Crown, 
  Trophy, 
  ArrowRight, 
  Bell, 
  Play, 
  Flame, 
  CheckCircle2, 
  Lock, 
  ChevronRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';

interface HomeViewProps {
  onTabChange: (tab: NavTab) => void;
  onSelectCourse?: (courseId: string) => void;
  onSelectExam?: (examId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onTabChange,
  onSelectCourse,
  onSelectExam,
}) => {

  // Featured Courses mock data
  const featuredCourses: CourseItem[] = [
    {
      id: 'c1',
      title: 'প্রভাষক (আরবি, হাদিস ও ফিকহ)',
      titleArabic: 'محاضر في اللغة العربية والعلوم الإسلامية',
      cadre: 'lecturer_arabic',
      instructor: 'মাওলানা ড. আহমেদ হাসান',
      totalModules: 24,
      completedModules: 11,
      isPremium: true,
      rating: 4.9,
      studentCount: 3420,
      progressPercent: 45,
      thumbnailBg: 'from-emerald-800 to-teal-900',
      description: 'মাদ্রাসা বিষয়ের পূর্ণাঙ্গ আরবি সাহিত্য, নাহু, সরফ, বালাগাত ও ফিকহুস সুন্নাহ্ মাস্টারকোর্স।',
    },
    {
      id: 'c2',
      title: 'সহকারী মৌলভী নিবন্ধন স্পেশাল',
      titleArabic: 'دورة المدرس المساعد الشرعي',
      cadre: 'assistant_maulvi',
      instructor: 'ওস্তাদ মুফতি ইউসুফ আল-মাদানী',
      totalModules: 18,
      completedModules: 6,
      isPremium: false,
      rating: 4.8,
      studentCount: 5100,
      progressPercent: 33,
      thumbnailBg: 'from-teal-800 to-emerald-950',
      description: 'সহকারী মৌলভী পদের জন্য আল-কুরআন, আল-হাদিস, আকাইদ ও ফিকহ্ সিলেবাসের সহজ সমাধান।',
    },
    {
      id: 'c3',
      title: 'ইবতেদায়ি মৌলভী ও কারী শিক্ষক',
      titleArabic: 'إعداد معلم المعهد الابتدائي والقارئ',
      cadre: 'ebtedayee_head',
      instructor: 'কারী মাওলানা ওবায়দুল্লাহ',
      totalModules: 15,
      completedModules: 0,
      isPremium: false,
      rating: 4.7,
      studentCount: 2890,
      progressPercent: 0,
      thumbnailBg: 'from-slate-800 to-emerald-900',
      description: 'তাজবীদ, রেওয়ায়েত, প্রাথমিক আরবি ব্যাকরণ ও পেডাগজির ১০০% প্রস্তুতির সাধারণ কোর্স।',
    },
  ];

  // Daily & Free Exams mock list
  const sampleExams: ExamItem[] = [
    {
      id: 'e1',
      title: 'আজকের ডেইলি মডেল টেস্ট (২৫ প্রশ্ন)',
      titleArabic: 'الاختبار اليومي النموذجية',
      category: 'daily',
      durationMinutes: 20,
      totalQuestions: 25,
      difficulty: 'মাঝারি',
      participantsCount: '১.৮k+',
      subject: 'আরবি ব্যাকরণ ও ফিকহ',
      isPremium: false,
    },
    {
      id: 'e2',
      title: 'মাদ্রাসা বিষয়ভিত্তিক ফ্রি স্পেশাল টেস্ট - ১',
      titleArabic: 'الاختبار العام المجاني',
      category: 'free',
      durationMinutes: 30,
      totalQuestions: 50,
      difficulty: 'সহজ',
      participantsCount: '৪.২k+',
      subject: 'সাধারণ বিষয় (বাংলা, ইংরেজি, গণিত, সাধারণ জ্ঞান)',
      isPremium: false,
    },
    {
      id: 'e3',
      title: 'ভিআইপি প্রিমিয়াম লাইভ মক টেস্ট - প্রভাষক ক্যাডার',
      titleArabic: 'اختبار المحاضرين المتميز',
      category: 'premium',
      durationMinutes: 60,
      totalQuestions: 100,
      difficulty: 'কঠিন',
      participantsCount: '৯৫০+',
      subject: 'আল-কুরআন, হাদিস, বালাগাত ও ফিকহুস সুন্নাহ্',
      isPremium: true,
    },
  ];

  // Leaderboard Top 3 Candidates
  const topLeaders = [
    { rank: 1, name: 'মাওলানা হাফেজ আব্দুল মালেক', position: '১ম স্থান', points: 2840, avatar: 'M', bg: 'from-amber-400 to-amber-600' },
    { rank: 2, name: 'মুফতি তানভীর আহমেদ', position: '২য় স্থান', points: 2710, avatar: 'T', bg: 'from-slate-300 to-slate-500' },
    { rank: 3, name: 'কারি মোশতাক মাহমুদ', position: '৩য় স্থান', points: 2650, avatar: 'K', bg: 'from-amber-600 to-amber-800' },
  ];

  // Latest Updates
  const updates = [
    { title: 'মাদ্রাসা পরীক্ষা ও বিষয়ভিত্তিক মডেল টেস্টের সংশোধিত প্রশ্নব্যাংক হালনাগাদ করা হয়েছে।', date: '৩ আগস্ট ২০২৬' },
    { title: 'প্রভাষক (আরবি) পদের বিষয়ে বালাগাত ও ফিকহ্ অংশে নতুন প্রশ্ন যুক্ত।', date: '১ আগস্ট ২০২৬' },
    { title: 'উস্তাদ এআই-তে যুক্ত হলো আল-কুরআন ও হাদিসের সরাসরি রেফারেন্স অনুবাদ সিস্টেম।', date: '৩০ জুলাই ২০২৬' },
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>তামরীন একাডেমি (TAMREEN ACADEMY) • বিশেষ বিষয়ভিত্তিক প্রস্তুতি</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              বিসমিল্লাহির রহমানির রহিম <br />
              <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                মাদ্রাসা বিষয়ভিত্তিক পরীক্ষা সফলতার বিশ্বস্ত সঙ্গী
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              সহকারী শিক্ষক (আরবি), প্রভাষক (হাদিস/ফিকহ), সহকারী মৌলভী ও ইবতেদায়ী পদের জন্য তামরীন একাডেমির বিশ্বস্ত আরবি-বাংলা-ইংরেজি সিলেবাস, উস্তাদ এআই (Ustad AI), মডেল টেস্ট ও প্র্যাকটিস প্ল্যাটফর্ম।
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onTabChange('exams')}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4" />
                <span>মক টেস্ট শুরু করুন</span>
              </button>

              <button
                onClick={() => onTabChange('courses')}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 flex items-center space-x-2 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-teal-300" />
                <span>কোর্সসমূহ দেখুন</span>
              </button>
            </div>
          </div>

          {/* Hero Branding Card */}
          <div className="hidden lg:flex flex-col items-center justify-center p-7 bg-white/10 dark:bg-slate-900/80 rounded-3xl backdrop-blur-md border border-white/15 shadow-2xl flex-shrink-0 text-center space-y-3">
            <Logo variant="stacked" size="lg" />
            <div className="pt-2 border-t border-white/10 w-full text-xs text-emerald-200 font-medium">
              সহজ • নির্ভুল • বিশ্বস্ত
            </div>
          </div>
        </div>
      </section>

      {/* 2. Continue Learning Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Play className="w-5 h-5 fill-emerald-600 dark:fill-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                পড়া চালিয়ে যান (Continue Learning)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার সর্বশেষ অধ্যায় ও লেকচার নোট
              </p>
            </div>
          </div>

          <button
            onClick={() => onTabChange('courses')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>সকল লেসন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold">
                সহকারী শিক্ষক (আরবি)
              </span>
              <span className="text-xs font-medium text-slate-400">অধ্যায় ৪</span>
            </div>

            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              নাহু ও সরফ: ফেএল-এর প্রকারভেদ (الفعل وأقسامه) এবং ব্যাকরণিক প্রয়োগ
            </h3>

            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
              <div className="bg-emerald-500 h-2 rounded-full w-[65%]" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
              <span>অগ্রগতি: ৬৫% সম্পন্ন</span>
              <span>১৩/২০ মিনিট</span>
            </div>
          </div>

          <button
            onClick={() => onTabChange('courses')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center space-x-2 whitespace-nowrap self-end sm:self-center"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>চালিয়ে যান</span>
          </button>
        </div>
      </section>

      {/* 3. Featured Courses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
              পছন্দসই কোর্সসমূহ (Featured Courses)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              মাদ্রাসা ক্যাডারভিত্তিক বিশেষায়িত কোর্স মডিউল
            </p>
          </div>

          <button
            onClick={() => onTabChange('courses')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>সব কোর্স দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onTabChange('courses')}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
            >
              <div>
                {/* Course Header Banner */}
                <div className={`p-5 bg-gradient-to-r ${course.thumbnailBg} text-white relative`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-emerald-200 border border-white/10">
                      {course.totalModules}টি মডিউল
                    </span>
                    {course.isPremium ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center space-x-1">
                        <Crown className="w-3 h-3 fill-slate-950" />
                        <span>PREMIUM</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                        FREE
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-amber-200 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-emerald-200/80 font-arabic mt-1" style={{ fontFamily: "'Amiri', serif" }}>
                    {course.titleArabic}
                  </p>
                </div>

                {/* Course Body */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{course.studentCount} জন ছাত্র</span>
                    </span>
                    <span className="flex items-center space-x-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="px-5 pb-5 pt-0">
                <button
                  className="w-full py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-800 dark:text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <span>কোর্সে প্রবেশ করুন</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Daily Model Test & Free / Premium Exams Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
              পরীক্ষা ও মক টেস্ট (Exams Center)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ডেইলি টেস্ট, ফ্রি পরীক্ষা এবং ভিআইপি প্রিমিয়াম লাইভ পরীক্ষা
            </p>
          </div>

          <button
            onClick={() => onTabChange('exams')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>সকল পরীক্ষা</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleExams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => onTabChange('exams')}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 cursor-pointer hover:border-emerald-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                    exam.category === 'daily'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      : exam.category === 'free'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                  }`}>
                    {exam.category === 'daily' ? 'আজকের ডেইলি টেস্ট' : exam.category === 'free' ? 'ফ্রি পরীক্ষা' : 'প্রিমিয়াম স্পেশাল'}
                  </span>

                  <span className="text-xs text-slate-400 font-medium">
                    {exam.difficulty} স্তর
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 leading-snug">
                  {exam.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  বিষয়: <span className="font-semibold text-slate-700 dark:text-slate-300">{exam.subject}</span>
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{exam.durationMinutes} মিনিট</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{exam.totalQuestions} প্রশ্ন</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onTabChange('exams')}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>পরীক্ষা দিন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AI Ustad Interactive Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-700/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-800/80 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Bot className="w-4 h-4 text-amber-300" />
              <span>২৪/৭ আপনার এআই টিউটর (Ustad AI)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              নাহু, সরফ বা ফিকহ বিষয়ে যেকোনো প্রশ্ন করুন উস্তাদ এআই-কে!
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              আরবি ব্যাকরণের জটিল তারকীব, আয়াত বা হাদিসের ব্যাকরণিক বিশ্লেষণ এবং মাদ্রাসার সকল বিষয়ভিত্তিক সিলেবাস সংক্রান্ত যেকোনো জিজ্ঞাসা সাথে সাথে সমাধান পান।
            </p>
          </div>

          <button
            onClick={() => onTabChange('ustad_ai')}
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl flex items-center space-x-2 whitespace-nowrap transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>উস্তাদ এআই প্রশ্ন করুন</span>
          </button>
        </div>
      </section>

      {/* 6. Leaderboard Preview & Latest Updates Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Leaderboard Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                সপ্তাহের সেরা মেধাবী (Leaderboard)
              </h3>
            </div>
            <button
              onClick={() => onTabChange('leaderboard')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              সব দেখুন
            </button>
          </div>

          <div className="space-y-2.5">
            {topLeaders.map((leader) => (
              <div
                key={leader.rank}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-full bg-gradient-to-tr ${leader.bg} text-slate-950 font-black text-xs flex items-center justify-center shadow-xs`}>
                    #{leader.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {leader.name}
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {leader.position}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
                    {leader.points}
                  </span>
                  <span className="text-[10px] text-slate-400 block">পয়েন্ট</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Updates Ticker Cards */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              সর্বশেষ সার্কুলার ও নোটিশ (Updates)
            </h3>
          </div>

          <div className="space-y-3">
            {updates.map((update, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700/60 space-y-1"
              >
                <div className="flex items-center space-x-2 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <Calendar className="w-3 h-3" />
                  <span>{update.date}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {update.title}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7. Premium Membership VIP Banner */}
      <section className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-800 text-slate-950 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase tracking-widest inline-block">
            VIP ACCESS
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            তামরীন একাডেমি ভিআইপি প্রিমিয়াম মেম্বারশিপ
          </h3>
          <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-xl">
            সকল বিষয়ভিত্তিক প্রিমিয়াম কোর্স, আনলিমিটেড উস্তাদ এআই প্রম্পট, লাইভ মক টেস্ট ও অধ্যায়ভিত্তিক বিগত বছরের সমাধানের পূর্ণাঙ্গ এক্সেস পান।
          </p>
        </div>

        <button
          onClick={() => onTabChange('premium')}
          className="px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm shadow-xl flex items-center space-x-2 whitespace-nowrap transition-transform hover:scale-105"
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>প্রিমিয়াম হন (Upgrade)</span>
        </button>
      </section>

    </div>
  );
};
