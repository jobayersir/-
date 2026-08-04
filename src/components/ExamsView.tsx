import React, { useState } from 'react';
import { ExamCategory, ExamItem, MCQQuestion } from '../types';
import { 
  FileCheck2, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Play, 
  Search, 
  Filter, 
  Flame, 
  Calendar, 
  Award, 
  X, 
  AlertCircle,
  ChevronRight,
  Crown,
  Radio,
  RotateCcw,
  TrendingUp,
  BarChart2,
  Target,
  Zap,
  BookOpen,
  SlidersHorizontal,
  Layers,
  RefreshCw,
  GraduationCap,
  Star,
  ShieldCheck,
  Check,
  XCircle,
  ArrowRight,
  Timer
} from 'lucide-react';

interface ExamsViewProps {
  mcqQuestions: MCQQuestion[];
}

export interface ExtendedExamItem extends ExamItem {
  date: string;
  totalMarks: number;
  subjectIcon: 'quran' | 'hadith' | 'fiqh' | 'grammar' | 'history' | 'general';
  score?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  accuracy?: number;
  isLiveNow?: boolean;
}

export const ExamsView: React.FC<ExamsViewProps> = ({ mcqQuestions }) => {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'questions'>('latest');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);

  // State for actively taking an exam
  const [activeExam, setActiveExam] = useState<ExtendedExamItem | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  // State for viewing detailed report of a completed exam
  const [viewingReportExam, setViewingReportExam] = useState<ExtendedExamItem | null>(null);

  // State for Premium Upgrade Modal
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Extended mock exams catalog with rich metadata
  const examsList: ExtendedExamItem[] = [
    {
      id: 'ex-daily-1',
      title: 'আজকের স্পেশাল ডেইলি মডেল টেস্ট (২৯তম দিন)',
      titleArabic: 'الاختبار اليومي النموذج المتخصص - اليوم ٢٩',
      category: 'daily',
      durationMinutes: 25,
      totalQuestions: 25,
      totalMarks: 25,
      difficulty: 'মাঝারি',
      participantsCount: '২,৮৫০+',
      subject: 'আরবি ব্যাকরণ (নাহু ও সরফ)',
      isPremium: false,
      date: 'আজকের টেস্ট',
      subjectIcon: 'grammar',
    },
    {
      id: 'ex-daily-2',
      title: 'ডেইলি স্পেশাল মডেল টেস্ট - ইবতেদায়ী আরবি',
      titleArabic: 'اختبار القواعد واللغة العربية',
      category: 'daily',
      durationMinutes: 20,
      totalQuestions: 20,
      totalMarks: 20,
      difficulty: 'সহজ',
      participantsCount: '১,৪২০+',
      subject: 'তাজবীদ ও বালাগাত শাস্ত্র',
      isPremium: false,
      date: 'আজকের টেস্ট',
      subjectIcon: 'quran',
    },
    {
      id: 'ex-free-1',
      title: '১৮তম নিবন্ধন ফ্রি প্রি-রেজিস্ট্রেশন ফুল মক টেস্ট',
      titleArabic: 'اختبار التسجيل العام المجاني الكامل',
      category: 'free',
      durationMinutes: 45,
      totalQuestions: 50,
      totalMarks: 50,
      difficulty: 'মাঝারি',
      participantsCount: '৬,৫০০+',
      subject: 'বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান',
      isPremium: false,
      date: 'চলতি সপ্তাহ',
      subjectIcon: 'general',
    },
    {
      id: 'ex-free-2',
      title: 'সহকারী মৌলভী বিষয়ভিত্তিক ফ্রি প্র্যাকটিস টেস্ট',
      titleArabic: 'اختبار المعلم المساعد في الفقه والحديث',
      category: 'free',
      durationMinutes: 30,
      totalQuestions: 30,
      totalMarks: 30,
      difficulty: 'সহজ',
      participantsCount: '৩,২০০+',
      subject: 'ফিকহ ও উসূলে ফিকহ',
      isPremium: false,
      date: 'চলতি সপ্তাহ',
      subjectIcon: 'fiqh',
    },
    {
      id: 'ex-prem-1',
      title: 'ভিআইপি প্রভাষক (আরবি ক্যাডার) প্রিমিয়াম মেগা মডেল টেস্ট',
      titleArabic: 'اختبار المحاضرين الفائق المتميز المحترف',
      category: 'premium',
      durationMinutes: 90,
      totalQuestions: 100,
      totalMarks: 100,
      difficulty: 'কঠিন',
      participantsCount: '১,৯৮০+',
      subject: 'আল-কুরআন, হাদিস, বালাগাত ও ফিকহুস সুন্নাহ্',
      isPremium: true,
      date: 'স্পেশাল ভিআইপি',
      subjectIcon: 'hadith',
    },
    {
      id: 'ex-prem-2',
      title: 'প্রভাষক ইসলামী ইতিহাস ও সংস্কৃতি প্রিমিয়াম স্পেশাল',
      titleArabic: 'اختبار التاريخ الإسلامي والثقافة',
      category: 'premium',
      durationMinutes: 60,
      totalQuestions: 75,
      totalMarks: 75,
      difficulty: 'কঠিন',
      participantsCount: '১,১৫০+',
      subject: 'ইসলামী ইতিহাস ও সংস্কৃতি',
      isPremium: true,
      date: 'স্পেশাল ভিআইপি',
      subjectIcon: 'history',
    },
    {
      id: 'ex-live-1',
      title: 'আজকের লাইভ গ্র্যান্ড অল-বাংলাদেশ মক টেস্ট',
      titleArabic: 'الاختبار المباشر الكبيـر على مستوى البلاد',
      category: 'live',
      durationMinutes: 60,
      totalQuestions: 80,
      totalMarks: 80,
      difficulty: 'মাঝারি',
      participantsCount: '৪,১২০+ লাইভ',
      subject: 'সহকারী শিক্ষক (আরবি) অল সাবজেক্ট',
      isPremium: false,
      date: 'আজ রাত ৯:০০ টা',
      scheduledTime: 'আজ রাত ৯:০০ টা',
      isLiveNow: true,
      subjectIcon: 'grammar',
    },
    {
      id: 'ex-live-2',
      title: 'আগামীকালের লাইভ সাবজেক্ট উইকলি ব্যাটল',
      titleArabic: 'المنافسة الأسبوعية المباشرة القادمة',
      category: 'live',
      durationMinutes: 40,
      totalQuestions: 40,
      totalMarks: 40,
      difficulty: 'কঠিন',
      participantsCount: '২,১৫০+ নিবন্ধিত',
      subject: 'নাহু-সরফ ও আরবি সাহিত্য',
      isPremium: false,
      date: 'আগামীকাল সন্ধ্যা ৭:৩০ মি.',
      scheduledTime: 'আগামীকাল সন্ধ্যা ৭:৩০ মি.',
      isLiveNow: false,
      subjectIcon: 'grammar',
    },
    {
      id: 'ex-comp-1',
      title: 'বিগত সপ্তাহের সম্পন্নকৃত মডেল টেস্ট - ১',
      titleArabic: 'الاختبار المكتمل الأسبوعي الماضي',
      category: 'completed',
      durationMinutes: 30,
      totalQuestions: 30,
      totalMarks: 30,
      difficulty: 'মাঝারি',
      participantsCount: '৫,০০০+',
      subject: 'ইসলামী ইতিহাস ও সমাজবিজ্ঞান',
      isPremium: false,
      date: '২ দিন আগে সম্পন্ন',
      subjectIcon: 'history',
      score: 26,
      correctAnswers: 26,
      wrongAnswers: 4,
      accuracy: 87,
    },
    {
      id: 'ex-comp-2',
      title: '১৭তম শিক্ষক নিবন্ধন বিগত বছরের প্রশ্ন সমাধান টেস্ট',
      titleArabic: 'اختبار حل أسئلة الامتحان السابق',
      category: 'completed',
      durationMinutes: 50,
      totalQuestions: 50,
      totalMarks: 50,
      difficulty: 'মাঝারি',
      participantsCount: '৮,২০০+',
      subject: 'আরবি ও সাধারণ বিষয়াবলি',
      isPremium: false,
      date: '৫ দিন আগে সম্পন্ন',
      subjectIcon: 'general',
      score: 44,
      correctAnswers: 44,
      wrongAnswers: 6,
      accuracy: 88,
    },
  ];

  const categories = [
    { id: 'all', label: 'সবগুলো', icon: Layers },
    { id: 'daily', label: 'দৈনিক মডেল টেস্ট', icon: Flame },
    { id: 'free', label: 'ফ্রি এক্সাম', icon: GiftBadgeIcon },
    { id: 'premium', label: 'প্রিমিয়াম', icon: Crown },
    { id: 'live', label: 'লাইভ', icon: Radio },
    { id: 'completed', label: 'পূর্ববর্তী', icon: CheckCircle2 },
  ];

  function GiftBadgeIcon(props: any) {
    return <Zap {...props} />;
  }

  // Handle manual Refresh trigger
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoadingSkeleton(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoadingSkeleton(false);
    }, 600);
  };

  const handleCategoryChange = (catId: any) => {
    setSelectedCategory(catId);
    setIsLoadingSkeleton(true);
    setTimeout(() => {
      setIsLoadingSkeleton(false);
    }, 250);
  };

  // Filtering Logic
  const filteredExams = examsList.filter((exam) => {
    const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.titleArabic && exam.titleArabic.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject =
      selectedSubjectFilter === 'all' || exam.subject.includes(selectedSubjectFilter);

    const matchesDifficulty =
      selectedDifficultyFilter === 'all' || exam.difficulty === selectedDifficultyFilter;

    return matchesCategory && matchesSearch && matchesSubject && matchesDifficulty;
  }).sort((a, b) => {
    if (sortBy === 'popular') {
      return parseInt(b.participantsCount) - parseInt(a.participantsCount);
    }
    if (sortBy === 'questions') {
      return b.totalQuestions - a.totalQuestions;
    }
    return 0; // default latest order
  });

  const handleStartExam = (exam: ExtendedExamItem) => {
    if (exam.isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setActiveExam(exam);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setIsExamSubmitted(false);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
  };

  // Exam Score Calculations
  const questionsToUse = mcqQuestions.slice(0, activeExam?.totalQuestions || 10);
  const correctCount = Object.entries(userAnswers).filter(
    ([qIdx, ansIdx]) => questionsToUse[Number(qIdx)]?.correctAnswer === ansIdx
  ).length;
  const wrongCount = Object.keys(userAnswers).length - correctCount;
  const totalQuestionsCount = questionsToUse.length;
  const scorePercentage = totalQuestionsCount > 0 ? Math.round((correctCount / totalQuestionsCount) * 100) : 0;

  // Helper for subject icon styling
  const getSubjectIconComponent = (type: ExtendedExamItem['subjectIcon']) => {
    switch (type) {
      case 'quran':
        return <BookOpen className="w-5 h-5 text-amber-500" />;
      case 'hadith':
        return <Award className="w-5 h-5 text-amber-500" />;
      case 'fiqh':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'grammar':
        return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'history':
        return <Calendar className="w-5 h-5 text-teal-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      
      {/* ========================================================= */}
      {/* 1. HEADER HERO BANNER (Green & Gold Islamic Luxury Theme)  */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-800/60">
        
        {/* Subtle Islamic Geometric Backdrop Accent */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-56 h-56 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>১৮তম মাদ্রাসা শিক্ষক নিবন্ধন প্রিপারেশন হাব</span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                পরীক্ষা দিন <span className="text-amber-400 font-extrabold text-2xl sm:text-3xl font-arabic">(اختبارات)</span>
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/90 font-medium mt-1 leading-relaxed">
                নিজেকে যাচাই করুন, সাফল্যের পথে এগিয়ে যান
              </p>
            </div>

            {/* Stats Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center space-x-2 bg-emerald-900/60 border border-emerald-700/50 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold text-emerald-200">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>আজকের মোট পরীক্ষা: <strong className="text-white font-extrabold">২৭টি</strong></span>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-900/60 border border-emerald-700/50 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold text-emerald-200">
                <FileCheck2 className="w-4 h-4 text-teal-300" />
                <span>সর্বমোট প্রশ্নব্যাংক: <strong className="text-white font-extrabold">১,২৫০+ টি</strong></span>
              </div>
            </div>
          </div>

          {/* Right Header Action Card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full md:w-auto gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-800/50">
            <div className="bg-emerald-900/80 border border-amber-400/30 p-4 rounded-2xl backdrop-blur-md flex items-center space-x-3.5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-left">
                <span className="text-xs text-amber-200/90 font-semibold block">আজকের লাইভ মক টেস্ট</span>
                <span className="font-extrabold text-white text-sm sm:text-base">রাত ৯:০০ টায় শুরু</span>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center space-x-2 transition-all active:scale-95"
              title="পরীক্ষার তালিকা আপডেট করুন"
            >
              <RefreshCw className={`w-4 h-4 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SEARCH & FILTER CONTROLS                               */}
      {/* ========================================================= */}
      <div className="space-y-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg">
        
        {/* Large Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="পরীক্ষার নাম, বিষয় বা প্রশ্নপত্র দিয়ে খুঁজুন (যেমন: ব্যাকরণ, ফিকহ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm sm:text-base text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CatIcon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Dropdowns & Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Subject Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">সকল বিষয় (All Subjects)</option>
              <option value="আরবি ব্যাকরণ">আরবি ব্যাকরণ (নাহু ও সরফ)</option>
              <option value="আল-কুরআন">আল-কুরআন ও হাদিস</option>
              <option value="ফিকহ">ফিকহ ও উসূলে ফিকহ</option>
              <option value="বাংলা">বাংলা সাহিত্য ও ভাষা</option>
              <option value="ইংরেজি">English Language</option>
              <option value="সাধারণ জ্ঞান">সাধারণ জ্ঞান ও গণিত</option>
              <option value="ইসলামী ইতিহাস">ইসলামী ইতিহাস</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <Target className="w-4 h-4 text-amber-500 shrink-0" />
            <select
              value={selectedDifficultyFilter}
              onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">সকল কাঠিন্য স্তর</option>
              <option value="সহজ">সহজ স্তর</option>
              <option value="মাঝারি">মাঝারি স্তর</option>
              <option value="কঠিন">কঠিন স্তর</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-teal-600 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="latest">সর্বশেষ প্রকাশিত</option>
              <option value="popular">সর্বাধিক জনপ্রিয়</option>
              <option value="questions">সর্বোচ্চ প্রশ্নসংখ্যা</option>
            </select>
          </div>
        </div>

        {/* Reset Filters Option if any active */}
        {(selectedSubjectFilter !== 'all' || selectedDifficultyFilter !== 'all' || searchQuery !== '') && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSelectedSubjectFilter('all');
                setSelectedDifficultyFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. EXAMS CATALOG GRID & CARDS                              */}
      {/* ========================================================= */}
      {isLoadingSkeleton ? (
        /* Skeleton Loading State */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
            </div>
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-slate-800 text-amber-500 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              কোনো পরীক্ষা পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              আপনার অনুসন্ধান বা ফিল্টারের সাথে মিল রেখে এই মুহূর্তে কোনো পরীক্ষা নেই। অনুগ্রহ করে অন্য কী-ওয়ার্ড অথবা ফিল্টার রিসেট করে চেষ্টা করুন।
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubjectFilter('all');
              setSelectedDifficultyFilter('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
          >
            সকল পরীক্ষা দেখুন
          </button>
        </div>
      ) : (
        /* Exam Cards List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => {
            const isCompleted = exam.category === 'completed';
            const isLive = exam.category === 'live';
            const isDaily = exam.category === 'daily';
            const isPremium = exam.isPremium;

            return (
              <div
                key={exam.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 relative group overflow-hidden ${
                  isPremium
                    ? 'border-amber-400/60 dark:border-amber-500/50 bg-gradient-to-b from-amber-50/20 to-white dark:from-slate-900 dark:to-slate-900'
                    : isLive
                    ? 'border-rose-300 dark:border-rose-900/60'
                    : isDaily
                    ? 'border-emerald-300 dark:border-emerald-800/80'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Top Subtle Glow for Premium or Live */}
                {isPremium && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
                )}
                {isLive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600 animate-pulse" />
                )}

                <div className="space-y-3.5">
                  {/* Category Badge & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {/* Subject Icon Badge */}
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
                        {getSubjectIconComponent(exam.subjectIcon)}
                      </div>

                      {/* Category Pill */}
                      <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 ${
                        isDaily
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-300 border border-amber-300/50'
                          : exam.category === 'free'
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-300 border border-emerald-300/50'
                          : isPremium
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border border-amber-400 font-extrabold shadow-sm'
                          : isLive
                          ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/90 dark:text-rose-300 border border-rose-300/50'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {isLive && <Radio className="w-3 h-3 text-rose-600 dark:text-rose-400 animate-pulse" />}
                        {isPremium && <Crown className="w-3.5 h-3.5 text-slate-950" />}
                        <span>
                          {isDaily ? 'দৈনিক মডেল টেস্ট' : exam.category === 'free' ? 'ফ্রি এক্সাম' : isPremium ? 'প্রিমিয়াম ভিআইপি' : isLive ? 'লাইভ পরীক্ষা' : 'সম্পন্নকৃত'}
                        </span>
                      </span>
                    </div>

                    {/* Difficulty Badge */}
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                      {exam.difficulty}
                    </span>
                  </div>

                  {/* Title & Arabic Subtitle */}
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-950 dark:text-slate-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {exam.title}
                    </h3>
                    {exam.titleArabic && (
                      <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-arabic font-semibold mt-1" style={{ fontFamily: "'Amiri', serif" }}>
                        {exam.titleArabic}
                      </p>
                    )}
                  </div>

                  {/* Subject Name */}
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    বিষয়: <strong className="font-bold text-slate-900 dark:text-slate-100">{exam.subject}</strong>
                  </div>

                  {/* Key Stats Bar (Duration, Questions, Total Marks) */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="text-center border-r border-slate-200/80 dark:border-slate-700/80 pr-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">সময়</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold">{exam.durationMinutes} মিনিট</strong>
                    </div>
                    <div className="text-center border-r border-slate-200/80 dark:border-slate-700/80 px-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">প্রশ্ন</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold">{exam.totalQuestions}টি</strong>
                    </div>
                    <div className="text-center pl-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">মোট নম্বর</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{exam.totalMarks}</strong>
                    </div>
                  </div>

                  {/* Live Exam Countdown or Participant Count */}
                  {isLive ? (
                    <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-2xl flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                      <div className="flex items-center space-x-1.5">
                        <Timer className="w-4 h-4 animate-spin text-rose-500" />
                        <span>{exam.scheduledTime}</span>
                      </div>
                      <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-lg animate-pulse">LIVE NOW</span>
                    </div>
                  ) : isCompleted ? (
                    <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-bold">
                      <span>প্রাপ্ত স্কোর: <strong className="text-emerald-600 text-sm font-extrabold">{exam.score}/{exam.totalMarks}</strong></span>
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold">{exam.accuracy}% নির্ভুলতা</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exam.participantsCount} পরীক্ষার্থী</span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{exam.date}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2">
                  {isCompleted ? (
                    <button
                      onClick={() => setViewingReportExam(exam)}
                      className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
                    >
                      <BarChart2 className="w-4 h-4 text-emerald-600" />
                      <span>পূর্ণাঙ্গ রিপোর্ট দেখুন</span>
                    </button>
                  ) : isPremium ? (
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
                    >
                      <Crown className="w-4 h-4 text-slate-950" />
                      <span>প্রিমিয়াম পরীক্ষা আনলক করুন</span>
                    </button>
                  ) : isLive ? (
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-sm shadow-md shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
                    >
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>লাইভ পরীক্ষায় অংশ নিন</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>পরীক্ষা দিন</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. INTERACTIVE EXAM RUNNER MODAL                          */}
      {/* ========================================================= */}
      {activeExam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {activeExam.subject}
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-950 dark:text-slate-100">
                  {activeExam.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveExam(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!isExamSubmitted ? (
              /* Exam Question View */
              <div className="space-y-6">
                {/* Timer & Stepper Bar */}
                <div className="flex justify-between items-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                  <span>প্রশ্ন {currentQuestionIdx + 1} / {questionsToUse.length}</span>
                  <span className="flex items-center text-rose-600 dark:text-rose-400 font-extrabold">
                    <Clock className="w-4 h-4 mr-1.5 animate-pulse" /> সময় বাকি: ১৮:৪০ মি.
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / questionsToUse.length) * 100}%` }}
                  />
                </div>

                {questionsToUse[currentQuestionIdx] && (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-base sm:text-lg text-slate-950 dark:text-slate-100 leading-relaxed">
                      {currentQuestionIdx + 1}. {questionsToUse[currentQuestionIdx].question}
                    </h4>

                    {questionsToUse[currentQuestionIdx].questionArabic && (
                      <p className="font-arabic text-xl sm:text-2xl text-emerald-950 dark:text-emerald-200 font-bold bg-emerald-50/70 dark:bg-emerald-950/50 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 leading-[2.2]" style={{ fontFamily: "'Amiri', serif" }}>
                        {questionsToUse[currentQuestionIdx].questionArabic}
                      </p>
                    )}

                    <div className="space-y-3 pt-2">
                      {questionsToUse[currentQuestionIdx].options.map((opt, oIdx) => {
                        const isSelected = userAnswers[currentQuestionIdx] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(currentQuestionIdx, oIdx)}
                            className={`w-full text-left p-4 rounded-2xl text-sm sm:text-base font-semibold transition-all flex items-center justify-between border ${
                              isSelected
                                ? 'bg-emerald-600 text-white font-extrabold border-emerald-600 shadow-md scale-[1.01]'
                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-white text-emerald-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                              }`}>
                                {['ক', 'খ', 'গ', 'ঘ'][oIdx]}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    পূর্ববর্তী
                  </button>

                  {currentQuestionIdx < questionsToUse.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md"
                    >
                      পরবর্তী প্রশ্ন
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg"
                    >
                      পরীক্ষা সাবমিট করুন
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Exam Result View */
              <div className="text-center space-y-6 py-4 animate-in fade-in">
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner border border-emerald-200 dark:border-emerald-800">
                  <Award className="w-10 h-10 text-amber-500" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-950 dark:text-slate-100">
                    পরীক্ষার ফলাফল সাবমিট হয়েছে!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    তামরীন একাডেমি লিডারবোর্ডে আপনার রেজাল্ট যুক্ত হয়েছে।
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">মোট প্রশ্ন</span>
                    <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{totalQuestionsCount}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">সঠিক উত্তর</span>
                    <span className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">{correctCount}টি</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">সঠিকতার হার</span>
                    <span className="font-extrabold text-lg text-amber-500">{scorePercentage}%</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveExam(null)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                >
                  পরীক্ষার প্রধান তালিকায় ফিরে যান
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. COMPLETED EXAM REPORT MODAL                            */}
      {/* ========================================================= */}
      {viewingReportExam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base sm:text-lg text-slate-950 dark:text-slate-100">
                  পরীক্ষার পারফরম্যান্স রিপোর্ট
                </h3>
              </div>
              <button
                onClick={() => setViewingReportExam(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {viewingReportExam.title}
                </h4>
                <p className="text-xs text-slate-500">{viewingReportExam.subject}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">প্রাপ্ত স্কোর</span>
                  <span className="font-extrabold text-base text-emerald-600">{viewingReportExam.score}/{viewingReportExam.totalMarks}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">সঠিক উত্তর</span>
                  <span className="font-extrabold text-base text-teal-600">{viewingReportExam.correctAnswers}টি</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">ভুল উত্তর</span>
                  <span className="font-extrabold text-base text-rose-500">{viewingReportExam.wrongAnswers}টি</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">নির্ভুলতা</span>
                  <span className="font-extrabold text-base text-amber-500">{viewingReportExam.accuracy}%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-2">
                <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-amber-500" />
                  উস্তাদ এআই বিশ্লেষণ পরামর্শ:
                </h5>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  আপনার ইসলামী ইতিহাস ও সরফ বিষয়ে দখল চমৎকার। তবে আরবি ব্যাকরণের বালাগাত অংশের প্রশ্নে আরেকটু প্রস্তুতি নেওয়া প্রয়োজন।
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewingReportExam(null)}
              className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. PREMIUM UPGRADE MODAL                                 */}
      {/* ========================================================= */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-amber-400/50 p-6 space-y-5 relative">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                <Crown className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-slate-950 dark:text-slate-100">
                ভিআইপি প্রিমিয়াম মেম্বারশিপ
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                ১৮তম মাদ্রাসা শিক্ষক নিবন্ধনের ৫০০+ প্রিমিয়াম মডেল টেস্ট ও লাইভ প্রশ্নব্যাংক অ্যাক্সেস করতে প্রিমিয়াম প্যাক আনলক করুন।
              </p>
            </div>

            <div className="space-y-2.5 bg-amber-50/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200 font-semibold">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সকল প্রভাষক (আরবি) ক্যাডার স্পেশাল মডেল টেস্ট</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>উস্তাদ এআই লিখিত উত্তর মূল্যায়ন ও ইনস্ট্যান্ট ফিডব্যাক</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>অল-বাংলাদেশ রিয়েল-টাইম লাইভ র‍্যাঙ্কিং</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowPremiumModal(false);
                alert('তামরীন একাডেমি প্রিমিয়াম সাবস্ক্রিপশন পেইজে নিয়ে যাওয়া হচ্ছে...');
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center space-x-2"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>এখনই আনলক করুন</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

