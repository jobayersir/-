import React, { useState } from 'react';
import { ExamCategory, ExamItem, MCQQuestion } from '../types';
import { CbtExamRunner } from './CbtExamRunner';
import { getStoredExamResult, getLatestExamResult, getStoredUserTotalPoints } from '../utils/examStorage';
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
  Timer,
  Share2,
  Trophy,
  Copy,
  MapPin,
  UserCheck,
  Medal
} from 'lucide-react';

interface ExamsViewProps {
  mcqQuestions: MCQQuestion[];
  onOpenLeaderboard?: () => void;
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

const toBnDigits = (num: number | string): string => {
  const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).padStart(2, '0').replace(/\d/g, (d) => bnNums[parseInt(d, 10)]);
};

export const LiveCardTicker: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(2 * 3600 + 45 * 60 + 30);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-2xl flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
      <div className="flex items-center space-x-1.5">
        <Timer className="w-4 h-4 animate-spin text-rose-500" />
        <span>কাউন্টডাউন: <strong className="font-mono text-rose-600 dark:text-rose-300 font-extrabold">{toBnDigits(hours)}:{toBnDigits(minutes)}:{toBnDigits(seconds)}</strong></span>
      </div>
      <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-lg animate-pulse">লাইভ চলছে</span>
    </div>
  );
};

export const LiveExamCountdownBanner: React.FC<{
  liveExam: ExtendedExamItem;
  onStartExam: (exam: ExtendedExamItem) => void;
}> = ({ liveExam, onStartExam }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(2 * 3600 + 45 * 60 + 30);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 shadow-xl border border-rose-500/40 animate-in fade-in duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5">
        <div className="space-y-2.5 text-center lg:text-left min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-md animate-pulse">
              <Radio className="w-3.5 h-3.5 text-white animate-ping" />
              <span>লাইভ পরীক্ষা কাউন্টডাউন</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-extrabold text-xs">
              আজ রাত ৯:০০ টা
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {liveExam.title}
          </h2>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-300 font-medium">
            <span>বিষয়: <strong className="text-amber-300">{liveExam.subject}</strong></span>
            <span>•</span>
            <span>সময়কাল: <strong className="text-white">{liveExam.durationMinutes} মিনিট</strong></span>
            <span>•</span>
            <span>অংশগ্রহণকারী: <strong className="text-emerald-300">{liveExam.participantsCount}</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto justify-center">
          <div className="flex items-center space-x-2 bg-slate-950/90 p-3 px-4 rounded-2xl border border-rose-500/50 shadow-inner">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-rose-400 min-w-[2.5rem] text-center font-mono">
                {toBnDigits(hours)}
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">ঘণ্টা</span>
            </div>
            <span className="text-2xl font-black text-rose-500 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 min-w-[2.5rem] text-center font-mono">
                {toBnDigits(minutes)}
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">মিনিট</span>
            </div>
            <span className="text-2xl font-black text-rose-500 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 min-w-[2.5rem] text-center font-mono">
                {toBnDigits(seconds)}
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">সেকেন্ড</span>
            </div>
          </div>

          <button
            onClick={() => onStartExam(liveExam)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>এখনই লাইভ পরীক্ষা দিন</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ExamsView: React.FC<ExamsViewProps> = ({ mcqQuestions, onOpenLeaderboard }) => {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
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
  const [reportFilter, setReportFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  // State for viewing exam specific leaderboard
  const [viewingLeaderboardExam, setViewingLeaderboardExam] = useState<ExtendedExamItem | null>(null);
  const [modalFilter, setModalFilter] = useState<'thisExam' | 'weekly' | 'monthly' | 'allTime'>('thisExam');

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
      title: 'বিশেষ বিষয়ভিত্তিক ফ্রি প্রি-রেজিস্ট্রেশন ফুল মক টেস্ট',
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
      title: 'মাদ্রাসা বিষয়ভিত্তিক বিগত বছরের প্রশ্ন সমাধান টেস্ট',
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

  // Handle Share Exam Deep Link
  const handleShareExam = async (exam: ExtendedExamItem) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#exams`;
    const shareData = {
      title: `তামরীন একাডেমি: ${exam.title}`,
      text: `তামরীন একাডেমিতে "${exam.title}" ফ্রি পরীক্ষায় অংশ নিয়ে সরাসরি আপনার প্রস্তুতি যাচাই করুন!`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (err) {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
    }
  };

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

    return matchesCategory && matchesSearch && matchesSubject;
  }).sort((a, b) => {
    if (sortBy === 'popular') {
      return parseInt(b.participantsCount) - parseInt(a.participantsCount);
    }
    if (sortBy === 'questions') {
      return b.totalQuestions - a.totalQuestions;
    }
    return 0; // default latest order
  });

  // History popstate listener for subviews / active exam
  React.useEffect(() => {
    const handlePopState = () => {
      if (activeExam) {
        setActiveExam(null);
      }
      if (viewingReportExam) {
        setViewingReportExam(null);
      }
      if (viewingLeaderboardExam) {
        setViewingLeaderboardExam(null);
      }
      if (showPremiumModal) {
        setShowPremiumModal(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeExam, viewingReportExam, viewingLeaderboardExam, showPremiumModal]);

  const handleStartExam = (exam: ExtendedExamItem) => {
    if (exam.isPremium) {
      setShowPremiumModal(true);
      window.history.pushState({ tab: 'exams', subview: 'premiumModal' }, '', '#exams-premium');
      return;
    }
    setActiveExam(exam);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setIsExamSubmitted(false);
    window.history.pushState({ tab: 'exams', subview: 'activeExam', examId: exam.id }, '', `#exams-runner-${exam.id}`);
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

  const liveExamItem = examsList.find((ex) => ex.category === 'live') || examsList[0];

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      
      {/* ========================================================= */}
      {/* 1. HEADER HERO BANNER (Compact & Elegant Islamic Theme)    */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-4 sm:p-5 shadow-xl border border-emerald-800/60">
        
        {/* Subtle Backdrop Accent */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                পরীক্ষা দিন
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-0.5 leading-relaxed">
                নিজেকে যাচাই করুন, সাফল্যের পথে এগিয়ে যান
              </p>
            </div>

            {/* Stats Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center space-x-1.5 bg-emerald-900/60 border border-emerald-700/50 px-3 py-1 rounded-xl text-xs font-semibold text-emerald-200">
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>আজকের পরীক্ষা: <strong className="text-white font-black">২৭টি</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 bg-emerald-900/60 border border-emerald-700/50 px-3 py-1 rounded-xl text-xs font-semibold text-emerald-200">
                <FileCheck2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>প্রশ্নব্যাংক: <strong className="text-white font-black">১,২৫০+ টি</strong></span>
              </div>
            </div>
          </div>

          {/* Right Header Action Card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full md:w-auto gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-800/50">
            <div className="bg-emerald-900/80 border border-amber-400/30 px-3.5 py-2.5 rounded-2xl backdrop-blur-md flex items-center space-x-3 shadow-md">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-amber-200/90 font-semibold block leading-none mb-0.5">লাইভ মক টেস্ট</span>
                <span className="font-extrabold text-white text-xs sm:text-sm">রাত ৯:০০ টায়</span>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95"
              title="পরীক্ষার তালিকা আপডেট করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1.5 LIVE EXAM COUNTDOWN BANNER                            */}
      {/* ========================================================= */}
      <LiveExamCountdownBanner liveExam={liveExamItem} onStartExam={handleStartExam} />

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Subject Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">সকল বিষয়</option>
              <option value="আরবি ব্যাকরণ">আরবি ব্যাকরণ (নাহু ও সরফ)</option>
              <option value="আল-কুরআন">আল-কুরআন ও হাদিস</option>
              <option value="ফিকহ">ফিকহ ও উসূলে ফিকহ</option>
              <option value="বাংলা">বাংলা সাহিত্য ও ভাষা</option>
              <option value="ইংরেজি">ইংরেজি ভাষা</option>
              <option value="সাধারণ জ্ঞান">সাধারণ জ্ঞান ও গণিত</option>
              <option value="ইসলামী ইতিহাস">ইসলামী ইতিহাস</option>
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
        {(selectedSubjectFilter !== 'all' || searchQuery !== '') && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSelectedSubjectFilter('all');
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
                  {/* Category Badge & Free/Premium Status */}
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

                    {/* Admin Selected Free / Premium Badge & Share Button for Free Exams */}
                    {isPremium ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-900 dark:text-amber-300 border border-amber-400/60 flex items-center space-x-1 shadow-2xs">
                        <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>প্রিমিয়াম</span>
                      </span>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>ফ্রি</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareExam(exam);
                          }}
                          className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 transition-all flex items-center space-x-1 active:scale-95 shadow-2xs"
                          title="ফ্রি পরীক্ষার ডিরেক্ট লিঙ্ক শেয়ার করুন"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>শেয়ার</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-950 dark:text-slate-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {exam.title}
                    </h3>
                  </div>

                  {/* Subject Name */}
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    বিষয়: <strong className="font-bold text-slate-900 dark:text-slate-100">{exam.subject}</strong>
                  </div>

                  {/* Key Stats Pill Buttons (Duration, Questions, Total Marks) */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <div className="px-2 sm:px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center space-x-1 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{exam.durationMinutes} মি.</span>
                    </div>
                    <div className="px-2 sm:px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center space-x-1 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                      <FileCheck2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="truncate">{exam.totalQuestions} প্রশ্ন</span>
                    </div>
                    <div className="px-2 sm:px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center space-x-1 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{exam.totalMarks} নম্বর</span>
                    </div>
                  </div>

                  {/* Live Exam Countdown or Participant Count */}
                  {isLive ? (
                    <LiveCardTicker />
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
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setViewingReportExam(exam);
                          window.history.pushState({ tab: 'exams', subview: 'report' }, '', '#exams-report');
                        }}
                        className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                      >
                        <BarChart2 className="w-4 h-4 text-emerald-600" />
                        <span>ব্যাখ্যা সহ উত্তর</span>
                      </button>
                      <button
                        onClick={() => {
                          setViewingLeaderboardExam(exam);
                          window.history.pushState({ tab: 'exams', subview: 'leaderboard' }, '', '#exams-leaderboard');
                        }}
                        className="py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                      >
                        <Trophy className="w-4 h-4 text-slate-950" />
                        <span>মেধা তালিকা</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartExam(exam)}
                      className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                        isPremium
                          ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/20'
                          : isLive
                          ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-rose-600/30'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
                      }`}
                    >
                      {isPremium ? (
                        <>
                          <Crown className="w-4 h-4 text-slate-950" />
                          <span>প্রিমিয়াম পরীক্ষা দিন</span>
                        </>
                      ) : isLive ? (
                        <>
                          <Radio className="w-4 h-4 animate-pulse" />
                          <span>লাইভ পরীক্ষা দিন</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>ফ্রি পরীক্ষা দিন</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. INTERACTIVE EXAM RUNNER MODAL (CBT ENGINE)              */}
      {/* ========================================================= */}
      {activeExam && (
        <CbtExamRunner
          exam={activeExam}
          questions={questionsToUse}
          onClose={() => setActiveExam(null)}
          onOpenLeaderboard={onOpenLeaderboard}
        />
      )}

      {/* ========================================================= */}
      {/* 5. COMPLETED EXAM REPORT & DETAILED ANSWERS MODAL         */}
      {/* ========================================================= */}
      {viewingReportExam && (() => {
        const reportQuestions = mcqQuestions.slice(0, viewingReportExam.totalQuestions || 10);
        
        // Filter report questions based on reportFilter ('all' | 'wrong' | 'correct')
        const filteredReportQuestions = reportQuestions.filter((q, qIdx) => {
          const isMockWrong = qIdx % 7 === 1; // realistic mock answer distribution matching score
          if (reportFilter === 'wrong') return isMockWrong;
          if (reportFilter === 'correct') return !isMockWrong;
          return true;
        });

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 space-y-5 relative max-h-[90vh] flex flex-col my-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-950 dark:text-slate-100 leading-snug">
                      ব্যাখ্যা সহ উত্তর ও প্রশ্নব্যাংক
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {viewingReportExam.title} ({viewingReportExam.subject})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingReportExam(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center shrink-0">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">প্রাপ্ত নম্বর</span>
                  <span className="font-extrabold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">{viewingReportExam.score}/{viewingReportExam.totalMarks}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">সঠিক উত্তর</span>
                  <span className="font-extrabold text-sm sm:text-base text-teal-600 dark:text-teal-400">{viewingReportExam.correctAnswers || viewingReportExam.score}টি</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">ভুল উত্তর</span>
                  <span className="font-extrabold text-sm sm:text-base text-rose-500">{viewingReportExam.wrongAnswers || (viewingReportExam.totalMarks - (viewingReportExam.score || 0))}টি</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">নির্ভুলতা</span>
                  <span className="font-extrabold text-sm sm:text-base text-amber-500">{viewingReportExam.accuracy}%</span>
                </div>
              </div>

              {/* Filter Tabs for Questions (সকল, ভুল উত্তর, সঠিক উত্তর) */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0">
                <button
                  onClick={() => setReportFilter('all')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    reportFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  সকল প্রশ্ন ({reportQuestions.length})
                </button>
                <button
                  onClick={() => setReportFilter('wrong')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    reportFilter === 'wrong'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  ভুল উত্তর ({reportQuestions.filter((_, idx) => idx % 7 === 1).length})
                </button>
                <button
                  onClick={() => setReportFilter('correct')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    reportFilter === 'correct'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  সঠিক উত্তর ({reportQuestions.filter((_, idx) => idx % 7 !== 1).length})
                </button>
              </div>

              {/* Questions List with Explanations */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {filteredReportQuestions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs font-bold">
                    এই ক্যাটাগরিতে কোনো প্রশ্ন পাওয়া যায়নি।
                  </div>
                ) : (
                  filteredReportQuestions.map((q, idx) => {
                    const originalIndex = reportQuestions.findIndex(item => item.question === q.question);
                    const qNum = originalIndex !== -1 ? originalIndex + 1 : idx + 1;
                    const isMockWrong = originalIndex % 7 === 1;
                    const mockUserOptIdx = isMockWrong ? (q.correctAnswer + 1) % q.options.length : q.correctAnswer;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        {/* Question Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                              প্রশ্ন {qNum}
                            </span>
                            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                              বিষয়: {q.subject || viewingReportExam.subject}
                            </span>
                          </div>
                          {isMockWrong ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black flex items-center space-x-1">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>ভুল উত্তর</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>সঠিক উত্তর</span>
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <h4 className="font-bold text-[17px] text-slate-900 dark:text-slate-100 leading-snug">
                          {q.question}
                        </h4>
                        {q.questionArabic && (
                          <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-arabic font-semibold" style={{ fontFamily: "'Amiri', serif" }}>
                            {q.questionArabic}
                          </p>
                        )}

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isCorrectOpt = optIdx === q.correctAnswer;
                            const isUserSelected = optIdx === mockUserOptIdx;
                            const optionLabel = ['ক', 'খ', 'গ', 'ঘ'][optIdx] || `${optIdx + 1}`;

                            let optStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                            let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";

                            if (isCorrectOpt) {
                              optStyle = "bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold";
                              badgeStyle = "bg-emerald-600 text-white font-extrabold";
                            } else if (isUserSelected && isMockWrong) {
                              optStyle = "bg-rose-100 dark:bg-rose-950/80 border-2 border-rose-500 text-rose-950 dark:text-rose-100 font-bold";
                              badgeStyle = "bg-rose-600 text-white font-extrabold";
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${optStyle}`}
                              >
                                <div className="flex items-center space-x-2 min-w-0 flex-1">
                                  <span className={`w-6 h-6 rounded-md text-[11px] font-extrabold flex items-center justify-center shrink-0 ${badgeStyle}`}>
                                    {optionLabel}
                                  </span>
                                  <span className="leading-snug font-bold">{opt}</span>
                                </div>
                                {isCorrectOpt && (
                                  <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200 bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded-md flex items-center space-x-1 shrink-0 ml-1">
                                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>সঠিক উত্তর</span>
                                  </span>
                                )}
                                {isUserSelected && isMockWrong && (
                                  <span className="text-[10px] font-extrabold text-rose-800 dark:text-rose-200 bg-rose-200 dark:bg-rose-900 px-2 py-0.5 rounded-md flex items-center space-x-1 shrink-0 ml-1">
                                    <X className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                                    <span>আপনার ভুল উত্তর</span>
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* 💡 EXPLANATION BOX (ব্যাখ্যা সহ উত্তর) */}
                        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 space-y-1 mt-2">
                          <div className="flex items-center space-x-1.5 text-amber-900 dark:text-amber-300 font-black text-xs">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>💡 বিস্তারিত ব্যাখ্যা:</span>
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                            {q.explanation || 'এই প্রশ্নের উত্তর সরাসরি তামরীন একাডেমির প্রমিত পাঠ্যবই ও বিগত বছরের বোর্ড প্রশ্ন রেফারেন্স অনুযায়ী সবিস্তারে ব্যাখ্যাকৃত।'}
                          </p>
                          {q.reference && (
                            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 pt-1">
                              📚 রেফারেন্স: {q.reference}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => {
                    setViewingLeaderboardExam(viewingReportExam);
                    setViewingReportExam(null);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  <span>জাতীয় মেধা তালিকা দেখুন</span>
                </button>
                <button
                  onClick={() => setViewingReportExam(null)}
                  className="px-6 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* EXAM SPECIFIC LEADERBOARD MODAL (Matches Screen 3)       */}
      {/* ========================================================= */}
      {viewingLeaderboardExam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-500/30 p-5 sm:p-6 space-y-4 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-[10px] font-black text-emerald-800 dark:text-emerald-300 mb-1">
                    {viewingLeaderboardExam.isPremium 
                      ? 'প্রিমিয়াম পরীক্ষায় অংশগ্রহণকারীদের মেধা তালিকা' 
                      : 'ফ্রি পরীক্ষায় অংশগ্রহণকারীদের মেধা তালিকা'}
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-slate-950 dark:text-slate-100 flex items-center space-x-1.5">
                    <span>বিষয়ের মেধা তালিকা</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-extrabold truncate max-w-[220px] sm:max-w-xs">
                    বিষয়: {viewingLeaderboardExam.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingLeaderboardExam(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs in Exam Modal (এই পরীক্ষা, এই সপ্তাহে, এই মাসে, সর্বকালের) */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setModalFilter('thisExam')}
                className={`flex-1 py-1.5 rounded-lg font-black transition-all ${
                  modalFilter === 'thisExam'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                }`}
              >
                এই পরীক্ষা
              </button>
              <button
                onClick={() => setModalFilter('weekly')}
                className={`flex-1 py-1.5 rounded-lg font-black transition-all ${
                  modalFilter === 'weekly'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                }`}
              >
                এই সপ্তাহে
              </button>
              <button
                onClick={() => setModalFilter('monthly')}
                className={`flex-1 py-1.5 rounded-lg font-black transition-all ${
                  modalFilter === 'monthly'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                }`}
              >
                এই মাসে
              </button>
              <button
                onClick={() => setModalFilter('allTime')}
                className={`flex-1 py-1.5 rounded-lg font-black transition-all ${
                  modalFilter === 'allTime'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                }`}
              >
                সর্বকালের
              </button>
            </div>

            {(() => {
              const totalQ = viewingLeaderboardExam ? (viewingLeaderboardExam.questionsCount || viewingLeaderboardExam.questions?.length || 16) : 16;
              const activeRes = viewingLeaderboardExam ? (getStoredExamResult(viewingLeaderboardExam.id) || getLatestExamResult()) : null;
              const storedPoints = getStoredUserTotalPoints();

              let modalCandidatesList: Array<{
                name: string;
                correct: number;
                wrong: number;
                score: number;
                maxScore: number;
                percentage: number;
                isUser?: boolean;
                rank?: number;
              }> = [];

              if (modalFilter === 'thisExam') {
                const uScore = activeRes ? activeRes.score : Math.min(14, totalQ);
                const uCorrect = activeRes ? activeRes.correctCount : uScore;
                const uWrong = activeRes ? activeRes.wrongCount : Math.max(0, totalQ - uScore);
                const uPerc = activeRes ? activeRes.percentage : (totalQ > 0 ? Math.round((uScore / totalQ) * 100) : 88);

                modalCandidatesList = [
                  { name: 'মুশফিকুর রহমান', correct: totalQ, wrong: 0, score: totalQ, maxScore: totalQ, percentage: 100 },
                  { name: 'আহমাদ রাফি', correct: Math.max(1, totalQ - 1), wrong: 1, score: Math.max(1, totalQ - 1), maxScore: totalQ, percentage: Math.round(((totalQ - 1) / totalQ) * 100) },
                  { name: 'ফারিহা নূর', correct: Math.max(1, totalQ - 1), wrong: 1, score: Math.max(1, totalQ - 1), maxScore: totalQ, percentage: Math.round(((totalQ - 1) / totalQ) * 100) },
                  { name: 'তানভীর আহমেদ', correct: Math.max(1, totalQ - 2), wrong: 2, score: Math.max(1, totalQ - 2), maxScore: totalQ, percentage: Math.round(((totalQ - 2) / totalQ) * 100) },
                  { name: 'আরিফুল ইসলাম (আপনি)', correct: uCorrect, wrong: uWrong, score: uScore, maxScore: totalQ, percentage: uPerc, isUser: true },
                  { name: 'সাবিহা আক্তার', correct: Math.max(0, totalQ - 3), wrong: 3, score: Math.max(0, totalQ - 3), maxScore: totalQ, percentage: Math.round(((totalQ - 3) / totalQ) * 100) },
                  { name: 'নাজমুল হাসান', correct: Math.max(0, totalQ - 4), wrong: 4, score: Math.max(0, totalQ - 4), maxScore: totalQ, percentage: Math.round(((totalQ - 4) / totalQ) * 100) },
                  { name: 'ইসরাত জাহান', correct: Math.max(0, totalQ - 5), wrong: 5, score: Math.max(0, totalQ - 5), maxScore: totalQ, percentage: Math.round(((totalQ - 5) / totalQ) * 100) },
                ];
              } else if (modalFilter === 'weekly') {
                const uWeekly = Math.min(500, 360 + (storedPoints - 840));
                modalCandidatesList = [
                  { name: 'মুশফিকুর রহমান', correct: 485, wrong: 5, score: 485, maxScore: 500, percentage: 97 },
                  { name: 'আহমাদ রাফি', correct: 470, wrong: 10, score: 470, maxScore: 500, percentage: 94 },
                  { name: 'ফারিহা নূর', correct: 450, wrong: 15, score: 450, maxScore: 500, percentage: 90 },
                  { name: 'আরিফুল ইসলাম (আপনি)', correct: uWeekly, wrong: 15, score: uWeekly, maxScore: 500, percentage: Math.round((uWeekly / 500) * 100), isUser: true },
                  { name: 'তানভীর আহমেদ', correct: 410, wrong: 20, score: 410, maxScore: 500, percentage: 82 },
                  { name: 'সাবিহা আক্তার', correct: 380, wrong: 25, score: 380, maxScore: 500, percentage: 76 },
                  { name: 'নাজমুল হাসান', correct: 340, wrong: 30, score: 340, maxScore: 500, percentage: 68 },
                  { name: 'ইসরাত জাহান', correct: 300, wrong: 35, score: 300, maxScore: 500, percentage: 60 },
                ];
              } else if (modalFilter === 'monthly') {
                const uMonthly = Math.min(2000, 1480 + (storedPoints - 840));
                modalCandidatesList = [
                  { name: 'মুশফিকুর রহমান', correct: 1920, wrong: 20, score: 1920, maxScore: 2000, percentage: 96 },
                  { name: 'আহমাদ রাফি', correct: 1880, wrong: 30, score: 1880, maxScore: 2000, percentage: 94 },
                  { name: 'ফারিহা নূর', correct: 1840, wrong: 40, score: 1840, maxScore: 2000, percentage: 92 },
                  { name: 'আরিফুল ইসলাম (আপনি)', correct: uMonthly, wrong: 40, score: uMonthly, maxScore: 2000, percentage: Math.round((uMonthly / 2000) * 100), isUser: true },
                  { name: 'তানভীর আহমেদ', correct: 1600, wrong: 50, score: 1600, maxScore: 2000, percentage: 80 },
                  { name: 'সাবিহা আক্তার', correct: 1450, wrong: 60, score: 1450, maxScore: 2000, percentage: 72 },
                  { name: 'নাজমুল হাসান', correct: 1300, wrong: 70, score: 1300, maxScore: 2000, percentage: 65 },
                ];
              } else {
                const uAllTime = Math.min(5600, 3800 + (storedPoints - 840) * 3);
                modalCandidatesList = [
                  { name: 'মুশফিকুর রহমান', correct: 5420, wrong: 60, score: 5420, maxScore: 5600, percentage: 97 },
                  { name: 'আহমাদ রাফি', correct: 5180, wrong: 80, score: 5180, maxScore: 5600, percentage: 92 },
                  { name: 'ফারিহা নূর', correct: 4950, wrong: 100, score: 4950, maxScore: 5600, percentage: 88 },
                  { name: 'আরিফুল ইসলাম (আপনি)', correct: uAllTime, wrong: 120, score: uAllTime, maxScore: 5600, percentage: Math.round((uAllTime / 5600) * 100), isUser: true },
                  { name: 'তানভীর আহমেদ', correct: 4100, wrong: 150, score: 4100, maxScore: 5600, percentage: 73 },
                  { name: 'সাবিহা আক্তার', correct: 3600, wrong: 180, score: 3600, maxScore: 5600, percentage: 64 },
                  { name: 'নাজমুল হাসান', correct: 3100, wrong: 200, score: 3100, maxScore: 5600, percentage: 55 },
                ];
              }

              // Sort descending by score
              modalCandidatesList.sort((a, b) => b.score - a.score);
              modalCandidatesList.forEach((c, idx) => { c.rank = idx + 1; });

              const top2 = modalCandidatesList[1] || modalCandidatesList[0];
              const top1 = modalCandidatesList[0];
              const top3 = modalCandidatesList[2] || modalCandidatesList[0];

              return (
                <>
                  {/* Top 3 Winners Podium Cards */}
                  <div className="grid grid-cols-3 gap-2 items-end pt-2">
                    
                    {/* Rank 2 */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-2.5 sm:p-3 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
                      <div className="relative mb-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-slate-400 overflow-hidden">
                          {top2.name.charAt(0)}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-400 text-white font-black text-[9px] sm:text-[10px] flex items-center justify-center shadow">
                          {top2.rank}
                        </span>
                      </div>
                      <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 dark:text-slate-100 truncate w-full">
                        {top2.name}
                      </span>
                      <span className="text-[11px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {top2.percentage}%
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">
                        {top2.score} পয়েন্ট
                      </span>
                    </div>

                    {/* Rank 1 */}
                    <div className="bg-amber-100 dark:bg-amber-950/60 rounded-2xl p-3 sm:p-3.5 border-2 border-amber-400 text-center flex flex-col items-center -mt-3 shadow-md">
                      <Crown className="w-4 h-4 text-amber-500 mb-0.5 animate-bounce" />
                      <div className="relative mb-1">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-200 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center border-2 border-amber-500 overflow-hidden shadow">
                          {top1.name.charAt(0)}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] flex items-center justify-center shadow">
                          {top1.rank}
                        </span>
                      </div>
                      <span className="font-black text-[11px] sm:text-xs text-slate-950 dark:text-amber-200 truncate w-full">
                        {top1.name}
                      </span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-700 dark:text-amber-400 mt-0.5">
                        {top1.percentage}%
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-amber-800 dark:text-amber-300 font-bold">
                        {top1.score} পয়েন্ট
                      </span>
                    </div>

                    {/* Rank 3 */}
                    <div className="bg-amber-50/80 dark:bg-slate-800/80 rounded-2xl p-2.5 sm:p-3 border border-amber-200/80 dark:border-slate-700 text-center flex flex-col items-center">
                      <div className="relative mb-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-200/80 text-amber-900 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-amber-600 overflow-hidden">
                          {top3.name.charAt(0)}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-700 text-white font-black text-[9px] sm:text-[10px] flex items-center justify-center shadow">
                          {top3.rank}
                        </span>
                      </div>
                      <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 dark:text-slate-100 truncate w-full">
                        {top3.name}
                      </span>
                      <span className="text-[11px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {top3.percentage}%
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">
                        {top3.score} পয়েন্ট
                      </span>
                    </div>

                  </div>

                  {/* Ranked Users List */}
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                      <span>ক্রম ও পরীক্ষার্থীর নাম</span>
                      <div className="flex items-center space-x-4 pr-1">
                        <span>সঠিক</span>
                        <span>ভুল</span>
                        <span>পয়েন্ট</span>
                      </div>
                    </div>
                    {modalCandidatesList.map((row, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          row.isUser
                            ? 'bg-emerald-100/90 dark:bg-emerald-950/80 border-emerald-400 text-emerald-950 dark:text-emerald-100 font-extrabold shadow-2xs'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-slate-100 font-bold'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {row.rank}
                          </span>
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <span className="truncate max-w-[110px] sm:max-w-[150px]">{row.name}</span>
                        </div>

                        <div className="flex items-center space-x-3 text-right shrink-0">
                          <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">{row.correct}টি</span>
                          <span className="font-bold text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200/60 dark:border-rose-800/60">{row.wrong}টি</span>
                          <span className="font-black text-amber-600 dark:text-amber-400 text-xs min-w-[55px]">{row.score} পয়েন্ট</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

            {/* Bottom Modal Actions */}
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setViewingLeaderboardExam(null);
                    if (onOpenLeaderboard) {
                      onOpenLeaderboard();
                    }
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>সম্পূর্ণ লিডারবোর্ড দেখুন</span>
                </button>
                <button
                  onClick={() => {
                    handleShareExam(viewingLeaderboardExam);
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                  title="লিডারবোর্ড শেয়ার করুন"
                >
                  <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            </div>

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
                মাদ্রাসা বিষয়ভিত্তিক ৫০০+ প্রিমিয়াম মডেল টেস্ট ও লাইভ প্রশ্নব্যাংক অ্যাক্সেস করতে প্রিমিয়াম প্যাক আনলক করুন।
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

