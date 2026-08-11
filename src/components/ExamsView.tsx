import React, { useState, useEffect } from 'react';
import { ExamCategory, ExamItem, MCQQuestion } from '../types';
import { CbtExamRunner } from './CbtExamRunner';
import { LeaderboardView } from './LeaderboardView';
import { getStoredExamResult, getLatestExamResult, getStoredUserTotalPoints, getRegisteredUserInfo, saveRegisteredUserInfo, getRealLeaderboardEntries } from '../utils/examStorage';
import { fetchExamsFromSupabase, getSupabaseClient } from '../lib/supabase';
import { copyToClipboard } from '../utils/clipboard';
import { QUESTION_BANK } from '../data/questionBank';
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
  Medal,
  ArrowLeft
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
  return String(num).replace(/\d/g, (d) => bnNums[parseInt(d, 10)]);
};

const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const bnDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

export const formatBengaliDateAndDay = (rawDateStr?: string, rawScheduledTime?: string, includeTime: boolean = false): string => {
  let dateObj: Date | null = null;

  if (rawScheduledTime && !isNaN(Date.parse(rawScheduledTime))) {
    dateObj = new Date(rawScheduledTime);
  } else if (rawDateStr && !isNaN(Date.parse(rawDateStr))) {
    dateObj = new Date(rawDateStr);
  }

  if (!dateObj || isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }

  const dayNum = toBnDigits(dateObj.getDate());
  const monthName = bnMonths[dateObj.getMonth()];
  const yearNum = toBnDigits(dateObj.getFullYear());
  const dayOfWeek = bnDays[dateObj.getDay()];

  if (!includeTime) {
    return `${dayNum} ${monthName} ${yearNum}, ${dayOfWeek}`;
  }

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedTime = `${toBnDigits(hours)}:${minutes < 10 ? '০' : ''}${toBnDigits(minutes)} ${ampm}`;

  return `${dayNum} ${monthName} ${yearNum}, ${dayOfWeek} (${formattedTime})`;
};

export const UpcomingCountdownTicker: React.FC<{ targetTimeStr: string; onExpire?: () => void }> = ({ targetTimeStr, onExpire }) => {
  const targetTime = new Date(targetTimeStr).getTime();
  const [diff, setDiff] = useState<number>(() => Math.max(0, targetTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, targetTime - Date.now());
      setDiff(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime, onExpire]);

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-2xl flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
      <div className="flex items-center space-x-1.5 min-w-0">
        <Clock className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
        <span className="truncate">
          কাউন্টডাউন: <strong className="font-mono text-amber-700 dark:text-amber-300 font-black">
            {days > 0 ? `${toBnDigits(days)}দিন ` : ''}
            {toBnDigits(hours)}:{toBnDigits(minutes)}:{toBnDigits(seconds)}
          </strong>
        </span>
      </div>
      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-lg shrink-0">
        আপকামিং
      </span>
    </div>
  );
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
  liveExam?: ExtendedExamItem;
  onStartExam: (exam: ExtendedExamItem) => void;
}> = ({ liveExam, onStartExam }) => {
  if (!liveExam) return null;

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

  // Registration Popup Modal States
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [userRegName, setUserRegName] = useState('');
  const [userRegPhone, setUserRegPhone] = useState('');
  const [pendingExamToStart, setPendingExamToStart] = useState<ExtendedExamItem | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  // Sync existing reg info on mount
  useEffect(() => {
    const regUser = getRegisteredUserInfo();
    if (regUser) {
      setUserRegName(regUser.name);
      setUserRegPhone(regUser.phone);
    }
  }, []);

  // Dynamic exams list state synced with Supabase (no static mock defaults)
  const [examsList, setExamsList] = useState<ExtendedExamItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tamreen_cached_exams');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((e: any) => {
              const qCount = (e.questions && e.questions.length > 0) ? e.questions.length : (e.totalQuestions || 30);
              return {
                id: e.id,
                title: e.title,
                titleArabic: e.titleArabic,
                category: (e.category as any) || 'free',
                durationMinutes: e.durationMinutes || 30,
                totalQuestions: qCount,
                totalMarks: qCount,
                difficulty: e.difficulty || 'মাঝারি',
                participantsCount: e.participantsCount || '১,০০০+',
                subject: e.subject || 'সাধারণ বিষয়',
                isPremium: Boolean(e.isPremium),
                date: e.scheduledTime || 'এখনই লঞ্চ করা',
                scheduledTime: e.scheduledTime,
                subjectIcon: 'general',
                questions: e.questions,
              };
            });
          }
        }
      } catch (e) {
        console.warn('Initial exam cache read error:', e);
      }
    }
    return [];
  });

  // Load Exams from Supabase on mount & refresh
  const loadSupabaseExams = async () => {
    try {
      const remote = await fetchExamsFromSupabase();
      if (remote && remote.length > 0) {
        const formatted: ExtendedExamItem[] = remote.map((e) => {
          const qCount = (e.questions && e.questions.length > 0) ? e.questions.length : (e.totalQuestions || 30);
          return {
            id: e.id,
            title: e.title,
            titleArabic: e.titleArabic,
            category: (e.category as any) || 'free',
            durationMinutes: e.durationMinutes || 30,
            totalQuestions: qCount,
            totalMarks: qCount,
            difficulty: e.difficulty || 'মাঝারি',
            participantsCount: e.participantsCount || '১,০০০+',
            subject: e.subject || 'সাধারণ বিষয়',
            isPremium: Boolean(e.isPremium),
            date: e.scheduledTime || 'এখনই লঞ্চ করা',
            scheduledTime: e.scheduledTime,
            subjectIcon: 'general',
            questions: e.questions,
          };
        });

        setExamsList(formatted);
      } else {
        setExamsList([]);
      }
    } catch (err) {
      console.error('Error loading Supabase exams:', err);
    }
  };

  useEffect(() => {
    loadSupabaseExams();

    // Background auto-polling every 10 seconds
    const interval = setInterval(() => {
      loadSupabaseExams();
    }, 10000);

    // Auto refresh when tab gets focused or network switches (Wifi / Mobile Data)
    const handleFocusOrOnline = () => loadSupabaseExams();
    window.addEventListener('focus', handleFocusOrOnline);
    window.addEventListener('online', handleFocusOrOnline);

    // Supabase Realtime postgres_changes listener
    const client = getSupabaseClient();
    let channel: any = null;
    if (client) {
      try {
        channel = client
          .channel('public-exams-auto-sync')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            loadSupabaseExams();
          })
          .subscribe();
      } catch (e) {
        console.warn('Supabase realtime error:', e);
      }
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocusOrOnline);
      window.removeEventListener('online', handleFocusOrOnline);
      if (client && channel) {
        try {
          client.removeChannel(channel);
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

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
      } else {
        await copyToClipboard(shareUrl);
      }
    } catch (err) {
      await copyToClipboard(shareUrl);
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
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsLoadingSkeleton(true);
    await loadSupabaseExams();
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoadingSkeleton(false);
    }, 400);
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
    const matchesCategory =
      selectedCategory === 'all' ||
      exam.category === selectedCategory ||
      (selectedCategory === 'daily' && (exam.category === 'model_test' || exam.category === 'modelTest' || exam.category === 'daily')) ||
      (selectedCategory === 'free' && (exam.category === 'free' || exam.category === 'model_test' || !exam.isPremium)) ||
      (selectedCategory === 'premium' && (exam.category === 'premium' || exam.isPremium)) ||
      (selectedCategory === 'live' && exam.category === 'live');
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

  const launchExamDirectly = (exam: ExtendedExamItem) => {
    setActiveExam(exam);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setIsExamSubmitted(false);
    window.history.pushState({ tab: 'exams', subview: 'activeExam', examId: exam.id }, '', `#exams-runner-${exam.id}`);
  };

  const handleStartExam = (exam: ExtendedExamItem, bypassRegCheck = false) => {
    const isUpcoming = Boolean(
      exam.scheduledTime &&
      !isNaN(new Date(exam.scheduledTime).getTime()) &&
      new Date(exam.scheduledTime).getTime() > Date.now()
    );

    if (isUpcoming) {
      alert(`এই পরীক্ষাটি এখনও শুরু হয়নি। প্রকাশের নির্ধারিত সময়ে (${formatBengaliDateAndDay(exam.date, exam.scheduledTime, true)}) পরীক্ষাটি উন্মুক্ত হবে।`);
      return;
    }

    if (exam.isPremium) {
      setShowPremiumModal(true);
      window.history.pushState({ tab: 'exams', subview: 'premiumModal' }, '', '#exams-premium');
      return;
    }

    const regUser = getRegisteredUserInfo();
    if (!bypassRegCheck && (!regUser || !regUser.name.trim() || !regUser.phone.trim())) {
      setPendingExamToStart(exam);
      setShowRegisterModal(true);
      return;
    }

    launchExamDirectly(exam);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRegName.trim() || !userRegPhone.trim()) {
      setRegError('অনুগ্রহ করে আপনার নাম ও মোবাইল নাম্বার সঠিক ভাবে দিন');
      return;
    }
    setRegError(null);
    saveRegisteredUserInfo({ name: userRegName.trim(), phone: userRegPhone.trim() });
    setShowRegisterModal(false);

    if (pendingExamToStart) {
      launchExamDirectly(pendingExamToStart);
      setPendingExamToStart(null);
    }
  };

  // Direct exam link listener ?examId=...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const directExamId = urlParams.get('examId');
    if (directExamId && examsList.length > 0 && !activeExam) {
      const targetExam = examsList.find(e => e.id === directExamId);
      if (targetExam) {
        handleStartExam(targetExam);
      }
    }
  }, [examsList]);

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

  const liveExamItem = examsList.find((ex) => ex.category === 'live');

  // If an exam is currently active/running
  if (activeExam) {
    let questionsForThisExam = (activeExam.questions && activeExam.questions.length > 0)
      ? activeExam.questions
      : [];

    if (questionsForThisExam.length === 0) {
      const matched = mcqQuestions.filter(
        q => q.subject && activeExam.subject && (q.subject.toLowerCase().includes(activeExam.subject.toLowerCase()) || activeExam.subject.toLowerCase().includes(q.subject.toLowerCase()))
      );
      if (matched.length > 0) {
        questionsForThisExam = matched.slice(0, activeExam.totalQuestions || 10);
      } else if (mcqQuestions.length > 0) {
        questionsForThisExam = mcqQuestions.slice(0, activeExam.totalQuestions || 10);
      } else {
        questionsForThisExam = QUESTION_BANK.slice(0, activeExam.totalQuestions || 10);
      }
    }

    return (
      <CbtExamRunner
        exam={activeExam}
        questions={questionsForThisExam}
        onClose={() => setActiveExam(null)}
        onOpenLeaderboard={() => {
          setViewingLeaderboardExam(activeExam);
          setActiveExam(null);
        }}
      />
    );
  }

  if (viewingLeaderboardExam) {
    return (
      <div className="space-y-6 pb-28 animate-in fade-in duration-300">
        <button
          onClick={() => setViewingLeaderboardExam(null)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>সকল পরীক্ষার তালিকায় ফিরে যান</span>
        </button>

        <LeaderboardView
          examTitle={viewingLeaderboardExam.title}
          onBackToExam={() => setViewingLeaderboardExam(null)}
          userScore={viewingLeaderboardExam.score}
          userMaxScore={viewingLeaderboardExam.totalMarks}
        />
      </div>
    );
  }

  if (viewingReportExam) {
    const reportQuestions = mcqQuestions.slice(0, viewingReportExam.totalQuestions || 10);
    const filteredReportQuestions = reportQuestions.filter((q, qIdx) => {
      const isMockWrong = qIdx % 7 === 1;
      if (reportFilter === 'wrong') return isMockWrong;
      if (reportFilter === 'correct') return !isMockWrong;
      return true;
    });

    return (
      <div className="space-y-6 pb-28 animate-in fade-in duration-300">
        <button
          onClick={() => setViewingReportExam(null)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>সকল পরীক্ষার তালিকায় ফিরে যান</span>
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 space-y-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-lg sm:text-2xl text-slate-950 dark:text-slate-100 leading-snug">
                  ব্যাখ্যা সহ উত্তর ও প্রশ্নব্যাংক
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {viewingReportExam.title} ({viewingReportExam.subject})
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewingReportExam(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-all"
            >
              বন্ধ করুন
            </button>
          </div>

          {/* Stats Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center">
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold">প্রাপ্ত নম্বর</span>
              <span className="font-extrabold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">{viewingReportExam.score}/{viewingReportExam.totalMarks}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold">সঠিক উত্তর</span>
              <span className="font-extrabold text-base sm:text-lg text-teal-600 dark:text-teal-400">{viewingReportExam.correctAnswers || viewingReportExam.score}টি</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold">ভুল উত্তর</span>
              <span className="font-extrabold text-base sm:text-lg text-rose-500">{viewingReportExam.wrongAnswers || (viewingReportExam.totalMarks - (viewingReportExam.score || 0))}টি</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold">নির্ভুলতা</span>
              <span className="font-extrabold text-base sm:text-lg text-amber-500">{viewingReportExam.accuracy}%</span>
            </div>
          </div>

          {/* Filter Tabs for Questions */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => setReportFilter('all')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                reportFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              সকল প্রশ্ন ({reportQuestions.length})
            </button>
            <button
              onClick={() => setReportFilter('wrong')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                reportFilter === 'wrong'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              ভুল উত্তর ({reportQuestions.filter((_, idx) => idx % 7 === 1).length})
            </button>
            <button
              onClick={() => setReportFilter('correct')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                reportFilter === 'correct'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              সঠিক উত্তর ({reportQuestions.filter((_, idx) => idx % 7 !== 1).length})
            </button>
          </div>

          {/* Questions List with Explanations */}
          <div className="space-y-4">
            {filteredReportQuestions.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm font-bold bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
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
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3.5 shadow-xs"
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
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>ভুল উত্তর</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>সঠিক উত্তর</span>
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <h4 className="font-bold text-[17px] sm:text-lg text-slate-900 dark:text-slate-100 leading-snug">
                      {q.question}
                    </h4>
                    {q.questionArabic && (
                      <p className="text-sm text-emerald-800 dark:text-emerald-300 font-arabic font-semibold" style={{ fontFamily: "'Amiri', serif" }}>
                        {q.questionArabic}
                      </p>
                    )}

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
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
                            className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2 transition-all ${optStyle}`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                              <span className={`w-6 h-6 rounded-md text-xs font-extrabold flex items-center justify-center shrink-0 ${badgeStyle}`}>
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

                    {/* EXPLANATION BOX */}
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 space-y-1.5 mt-2">
                      <div className="flex items-center space-x-1.5 text-amber-900 dark:text-amber-300 font-black text-xs sm:text-sm">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>💡 বিস্তারিত ব্যাখ্যা:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                        {q.explanation || 'এই প্রশ্নের উত্তর সরাসরি তামরীন একাডেমির প্রমিত পাঠ্যবই ও বিগত বছরের বোর্ড প্রশ্ন রেফারেন্স অনুযায়ী সবিস্তারে ব্যাখ্যাকৃত।'}
                      </p>
                      {q.reference && (
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-1">
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
          <div className="pt-3 flex flex-col sm:flex-row gap-3">
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
              className="px-8 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              বন্ধ করুন
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      
      {/* ========================================================= */}
      {/* 1. HEADER HERO BANNER (Compact & Elegant Islamic Theme)    */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 shadow-xl border border-emerald-800/60">
        
        {/* Subtle Backdrop Accent */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-2">
          {/* Top Academy Name */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-bold tracking-wide">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>আত-তামরীন একাডেমি</span>
          </div>

          {/* Centered Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug">
            পরীক্ষা দিন
          </h1>
          
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-md mx-auto leading-relaxed">
            নিজেকে যাচাই করুন, সাফল্যের পথে এগিয়ে যান
          </p>

          {/* Stats & Refresh Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center space-x-1.5 bg-emerald-900/70 border border-emerald-700/60 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-200 shadow-inner">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>উপলব্ধ পরীক্ষা: <strong className="text-white font-black">{examsList.length}টি</strong></span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95"
              title="পরীক্ষার তালিকা আপডেট করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
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
            const userStoredResult = getStoredExamResult(exam.id);
            const isCompleted = exam.category === 'completed' || Boolean(userStoredResult);
            const isLive = exam.category === 'live';
            const isDaily = exam.category === 'daily';
            const isPremium = exam.isPremium;
            const isUpcoming = Boolean(
              exam.scheduledTime &&
              !isNaN(new Date(exam.scheduledTime).getTime()) &&
              new Date(exam.scheduledTime).getTime() > Date.now()
            );

            return (
              <div
                key={exam.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 relative group overflow-hidden ${
                  isUpcoming
                    ? 'border-amber-300/80 dark:border-amber-800/80 bg-gradient-to-b from-amber-50/10 to-white dark:from-slate-900 dark:to-slate-900'
                    : isPremium
                    ? 'border-amber-400/60 dark:border-amber-500/50 bg-gradient-to-b from-amber-50/20 to-white dark:from-slate-900 dark:to-slate-900'
                    : isLive
                    ? 'border-rose-300 dark:border-rose-900/60'
                    : isDaily
                    ? 'border-emerald-300 dark:border-emerald-800/80'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Top Subtle Glow for Premium, Live or Upcoming */}
                {isUpcoming && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 animate-pulse" />
                )}
                {!isUpcoming && isPremium && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
                )}
                {!isUpcoming && isLive && (
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
                        isUpcoming
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-300 border border-amber-300/60'
                          : isDaily
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-300 border border-amber-300/50'
                          : exam.category === 'free'
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-300 border border-emerald-300/50'
                          : isPremium
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border border-amber-400 font-extrabold shadow-sm'
                          : isLive
                          ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/90 dark:text-rose-300 border border-rose-300/50'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {isUpcoming && <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin" />}
                        {!isUpcoming && isLive && <Radio className="w-3 h-3 text-rose-600 dark:text-rose-400 animate-pulse" />}
                        {!isUpcoming && isPremium && <Crown className="w-3.5 h-3.5 text-slate-950" />}
                        <span>
                          {isUpcoming ? 'আপকামিং পরীক্ষা' : isDaily ? 'দৈনিক মডেল টেস্ট' : exam.category === 'free' ? 'ফ্রি এক্সাম' : isPremium ? 'প্রিমিয়াম ভিআইপি' : isLive ? 'লাইভ পরীক্ষা' : 'সম্পন্নকৃত'}
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

                  {/* Live Exam Countdown, Upcoming Countdown, or Participant Count */}
                  {isUpcoming ? (
                    <div className="space-y-2">
                      <UpcomingCountdownTicker targetTimeStr={exam.scheduledTime!} />
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-0.5">
                        <div className="flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{exam.participantsCount} পরীক্ষার্থী</span>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-700 dark:text-amber-300 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span className="truncate">{formatBengaliDateAndDay(exam.date, exam.scheduledTime, true)}</span>
                        </div>
                      </div>
                    </div>
                  ) : isLive ? (
                    <LiveCardTicker />
                  ) : isCompleted ? (
                    <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-bold">
                      <span>প্রাপ্ত স্কোর: <strong className="text-emerald-600 text-sm font-extrabold">{userStoredResult ? userStoredResult.score : (exam.score || 0)}/{userStoredResult ? userStoredResult.totalQuestions : exam.totalMarks}</strong></span>
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold">{userStoredResult ? userStoredResult.percentage : (exam.accuracy || 100)}% নির্ভুলতা</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exam.participantsCount} পরীক্ষার্থী</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-300 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{formatBengaliDateAndDay(exam.date, exam.scheduledTime)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2">
                  {isCompleted ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setViewingReportExam({
                            ...exam,
                            score: userStoredResult ? userStoredResult.score : (exam.score || 0),
                            correctAnswers: userStoredResult ? userStoredResult.correctCount : (exam.correctAnswers || 0),
                            wrongAnswers: userStoredResult ? userStoredResult.wrongCount : (exam.wrongAnswers || 0),
                            accuracy: userStoredResult ? userStoredResult.percentage : (exam.accuracy || 100)
                          });
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
                        <span>লিডারবোর্ড</span>
                      </button>
                    </div>
                  ) : isUpcoming ? (
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
                    >
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
                      <span>পরীক্ষা শীঘ্রই শুরু হবে (আপকামিং)</span>
                    </button>
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
                <span>তামরীন AI লিখিত উত্তর মূল্যায়ন ও ইনস্ট্যান্ট ফিডব্যাক</span>
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

      {/* USER REGISTRATION POPUP MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-500/30 relative space-y-6">
            
            {/* Header Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <UserCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  পরীক্ষা দিতে আপনার তথ্য দিন
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  পরীক্ষা শুরু করতে অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর দিন।
                </p>
              </div>
            </div>

            {regError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold text-center">
                {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                  <span>আপনার নাম</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={userRegName}
                    onChange={(e) => setUserRegName(e.target.value)}
                    placeholder="যেমন: মোঃ আব্দুল্লাহ"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                  <span>মোবাইল নম্বর</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={userRegPhone}
                    onChange={(e) => setUserRegPhone(e.target.value)}
                    placeholder="যেমন: 01712345678"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="w-1/3 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>পরীক্ষা শুরু করুন</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

