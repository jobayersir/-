import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  ArrowLeft, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Award, 
  BarChart2, 
  Trophy, 
  Share2, 
  Home, 
  Copy, 
  Check, 
  HelpCircle, 
  Sparkles, 
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Layers,
  Zap,
  Target
} from 'lucide-react';
import { ExtendedExamItem } from './ExamsView';
import { MCQQuestion } from '../types';

interface CbtExamRunnerProps {
  exam: ExtendedExamItem;
  questions: MCQQuestion[];
  onClose: () => void;
  onOpenLeaderboard?: (exam?: ExtendedExamItem) => void;
}

export const CbtExamRunner: React.FC<CbtExamRunnerProps> = ({
  exam,
  questions,
  onClose,
  onOpenLeaderboard
}) => {
  // Active Question Index
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  
  // User Selected Answers: { questionIndex: optionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  
  // Flagged Questions Set
  const [flaggedIdxs, setFlaggedIdxs] = useState<Set<number>>(new Set());

  // Timer State in seconds
  const totalExamSeconds = (exam.durationMinutes || 30) * 60;
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(totalExamSeconds);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  // Modal States
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showQuestionGridDrawer, setShowQuestionGridDrawer] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);

  // Exam Result Mode State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState<number>(0);

  // Explanation Accordion Open States for Question Review
  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});

  // Ustad AI Explanation States per Question
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [loadingAiIdx, setLoadingAiIdx] = useState<number | null>(null);

  const handleFetchAiExplanation = async (idx: number, q: MCQQuestion) => {
    setLoadingAiIdx(idx);
    try {
      const res = await fetch('/api/ustad-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain_mcq',
          questionData: {
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            subject: q.subject,
          },
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiExplanations((prev) => ({ ...prev, [idx]: data.text }));
        setOpenExplanations((prev) => ({ ...prev, [idx]: true }));
      }
    } catch (err) {
      console.error(err);
      alert('উস্তাদ এআই সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoadingAiIdx(null);
    }
  };

  // Copy Toast State
  const [copiedToastText, setCopiedToastText] = useState<string | null>(null);

  // Question review scroll ref
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  // Timer Countdown Effect
  useEffect(() => {
    if (!isTimerActive || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, isSubmitted]);

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // Answer selection handler
  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  // Flag toggle handler
  const handleToggleFlag = (qIdx: number) => {
    setFlaggedIdxs((prev) => {
      const next = new Set(prev);
      if (next.has(qIdx)) {
        next.delete(qIdx);
      } else {
        next.add(qIdx);
      }
      return next;
    });
  };

  // Final Submit Handler
  const handleFinalSubmit = () => {
    setIsTimerActive(false);
    setShowSubmitModal(false);
    setTimeUsedSeconds(totalExamSeconds - timeRemainingSeconds);
    setIsSubmitted(true);
    
    // Default open first 3 explanations
    const initialExps: Record<number, boolean> = {};
    questions.forEach((_, idx) => {
      initialExps[idx] = idx < 3;
    });
    setOpenExplanations(initialExps);
  };

  // Calculate Exam Statistics
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;

  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  questions.forEach((q, idx) => {
    const userChoice = userAnswers[idx];
    if (userChoice === undefined) {
      skippedCount++;
    } else if (userChoice === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const progressPercentage = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  // Copy Explanation to Clipboard with Toast
  const handleCopyExplanation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToastText('Copied Successfully ✓');
    setTimeout(() => {
      setCopiedToastText(null);
    }, 2200);
  };

  // Convert English numerals to Bengali / Arabic
  const toBnNumeral = (num: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d)]);
  };

  const toArNumeral = (num: number) => {
    const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/\d/g, (d) => arDigits[parseInt(d)]);
  };

  // Helper to detect language direction and font
  const getLanguageDetails = (text: string) => {
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const isEnglish = /^[A-Za-z0-9\s.,?!'"():;-]+$/.test(text.replace(/[0-9.]/g, '').trim());

    if (isArabic) {
      return {
        type: 'arabic',
        dir: 'rtl' as const,
        align: 'text-right',
        fontClass: 'font-arabic text-xl sm:text-2xl lg:text-3xl leading-[2.2]',
        numeral: toArNumeral(currentIdx + 1) + ' .',
      };
    } else if (isEnglish) {
      return {
        type: 'english',
        dir: 'ltr' as const,
        align: 'text-left',
        fontClass: 'text-left font-bold text-base sm:text-lg lg:text-xl leading-relaxed',
        numeral: `${currentIdx + 1}.`,
      };
    } else {
      // Default Bengali
      return {
        type: 'bengali',
        dir: 'ltr' as const,
        align: 'text-left',
        fontClass: 'text-left font-extrabold text-base sm:text-lg lg:text-xl leading-relaxed',
        numeral: `${toBnNumeral(currentIdx + 1)}।`,
      };
    }
  };

  const currentQuestion = questions[currentIdx] || questions[0];
  const langDetails = currentQuestion ? getLanguageDetails(currentQuestion.question) : null;

  // Subject Performance Mock Breakdown
  const subjectPerformance = [
    { name: 'আরবি ভাষা ও বালাগাত (Arabic Language)', percentage: 92, color: 'bg-emerald-600' },
    { name: 'হাদিস ও উসূলে হাদিস (Hadith & Usul)', percentage: 86, color: 'bg-teal-600' },
    { name: 'ফিকহ ও ফরায়েজ (Fiqh & Farayezi)', percentage: 81, color: 'bg-emerald-500' },
    { name: 'বাংলা সাহিত্য ও ব্যাকরণ (Bangla)', percentage: 76, color: 'bg-amber-500' },
    { name: 'English Grammar & Literature', percentage: 73, color: 'bg-indigo-500' },
    { name: 'সাধারণ গণিত ও মানসিক দক্ষতা (Math)', percentage: 68, color: 'bg-rose-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between text-slate-900 dark:text-slate-100 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* TOAST NOTIFICATION (Copied Successfully ✓)               */}
      {/* ========================================================= */}
      {copiedToastText && (
        <div className="fixed top-20 inset-x-0 mx-auto z-50 w-max bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-2xl border border-emerald-400/50 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span>{copiedToastText}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP APP BAR (Real CBT Bar)                                */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-emerald-950/90 text-white border-b border-emerald-800/80 backdrop-blur-md px-4 sm:px-6 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Back Button */}
          <button
            onClick={() => {
              if (isSubmitted) {
                onClose();
              } else {
                setShowExitConfirm(true);
              }
            }}
            className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-white flex items-center space-x-1 transition-all active:scale-95 shrink-0"
            title="পরীক্ষা হতে বের হন"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-300" />
            <span className="hidden sm:inline text-xs font-bold">বের হন</span>
          </button>

          {/* Exam Name & Progress */}
          <div className="text-center flex-1 min-w-0 px-2">
            <h1 className="font-black text-xs sm:text-sm md:text-base text-amber-300 truncate">
              {exam.title}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-[11px] sm:text-xs text-emerald-200 font-semibold mt-0.5">
              <span>Question {currentIdx + 1} of {totalQuestions}</span>
              <span>•</span>
              <span className="text-amber-400 font-extrabold">{progressPercentage}%</span>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          {!isSubmitted ? (
            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-950 to-red-900 border border-rose-500/50 text-white font-mono font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shrink-0">
              <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-900 border border-amber-400/50 text-amber-300 font-extrabold text-xs flex items-center space-x-1 shadow-md shrink-0">
              <Award className="w-4 h-4 text-amber-400" />
              <span>রেজাল্ট</span>
            </div>
          )}

        </div>

        {/* Top Progress Bar */}
        <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden mt-2.5 max-w-4xl mx-auto">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTENT CONTAINER                                    */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-28">
        
        {!isSubmitted ? (
          /* ========================================================= */
          /* ACTIVE EXAM CBT QUESTION CARD                             */
          /* ========================================================= */
          <div className="space-y-6 animate-in slide-in-from-bottom duration-200">
            
            {/* Question Card Header */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden">
              
              {/* Question Serial Pill */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs sm:text-sm border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                    প্রশ্ন {toBnNumeral(currentIdx + 1)} / {toBnNumeral(totalQuestions)}
                  </span>
                  {flaggedIdxs.has(currentIdx) && (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center space-x-1">
                      <Flag className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>চিহ্নিত</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleFlag(currentIdx)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    flaggedIdxs.has(currentIdx)
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Flag className={`w-4 h-4 ${flaggedIdxs.has(currentIdx) ? 'fill-slate-950' : ''}`} />
                  <span className="hidden sm:inline">ফ্ল্যাগ</span>
                </button>
              </div>

              {/* Question Text Area with Direction Rules */}
              {currentQuestion && (
                <div className="space-y-4">
                  {/* Serial Number Display above Question */}
                  <div className="text-emerald-700 dark:text-emerald-400 font-black text-sm sm:text-base">
                    {langDetails?.numeral}
                  </div>

                  {/* Primary Question Text */}
                  <div 
                    dir={langDetails?.dir}
                    className={`${langDetails?.align} ${langDetails?.fontClass} text-slate-950 dark:text-slate-100 font-extrabold tracking-tight`}
                    style={{ fontFamily: langDetails?.type === 'arabic' ? "'Amiri', 'Noto Naskh Arabic', serif" : undefined }}
                  >
                    {currentQuestion.question}
                  </div>

                  {/* Additional Arabic Sub-question if present */}
                  {currentQuestion.questionArabic && langDetails?.type !== 'arabic' && (
                    <div 
                      dir="rtl"
                      className="text-right font-arabic text-xl sm:text-2xl text-emerald-900 dark:text-emerald-200 font-bold bg-emerald-50/70 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 leading-[2.2]"
                      style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                    >
                      {currentQuestion.questionArabic}
                    </div>
                  )}

                  {/* MCQ Options List */}
                  <div className="space-y-3 pt-4">
                    {currentQuestion.options.map((optionText, oIdx) => {
                      const isSelected = userAnswers[currentIdx] === oIdx;
                      const isOptArabic = /[\u0600-\u06FF]/.test(optionText);

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(currentIdx, oIdx)}
                          className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex items-center justify-between touch-manipulation active:scale-[0.99] ${
                            isSelected
                              ? 'bg-emerald-600 text-white font-extrabold border-emerald-600 shadow-xl scale-[1.01]'
                              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-3.5 w-full">
                            <span className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center shrink-0 shadow-2xs ${
                              isSelected 
                                ? 'bg-white text-emerald-800' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            }`}>
                              {['ক', 'খ', 'গ', 'ঘ'][oIdx] || ['A', 'B', 'C', 'D'][oIdx]}
                            </span>

                            <span 
                              dir={isOptArabic ? 'rtl' : 'ltr'}
                              className={isOptArabic 
                                ? 'font-arabic text-right w-full text-xl sm:text-2xl font-bold leading-[2.2]' 
                                : 'text-left font-bold text-sm sm:text-base lg:text-lg leading-relaxed'
                              }
                              style={{ fontFamily: isOptArabic ? "'Amiri', serif" : undefined }}
                            >
                              {optionText}
                            </span>
                          </div>

                          {isSelected && (
                            <CheckCircle2 className="w-6 h-6 text-white shrink-0 ml-3" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>

          </div>
        ) : (
          /* ========================================================= */
          /* RESULT SCREEN (Premium Performance Report)                */
          /* ========================================================= */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Score Hero Card */}
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-800 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>🎉 Congratulations! (অভিনন্দন)</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {scorePercentage >= 80 ? 'Excellent Performance!' : scorePercentage >= 60 ? 'Good Job!' : 'keep Practicing!'}
                </h2>
                <p className="text-emerald-200 text-xs sm:text-sm font-medium mt-1">
                  তামরীন একাডেমি জাতীয় মেধা তালিকায় আপনার ফলাফল সংযুক্ত হয়েছে।
                </p>
              </div>

              {/* Circular Score Animation Ring */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-emerald-950/60"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-amber-400 transition-all duration-1000 ease-out"
                    strokeDasharray="263.89"
                    strokeDashoffset={263.89 - (263.89 * scorePercentage) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                    {scorePercentage}%
                  </span>
                  <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider">
                    স্কোর শতাংশ
                  </span>
                </div>
              </div>

              {/* 2 Primary Result Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all border border-emerald-600/50"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-300" />
                  <span>ব্যাখ্যা সহ উত্তর</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenLeaderboard) {
                      onOpenLeaderboard(exam);
                    }
                  }}
                  className="py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-all"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  <span>মেধা তালিকা</span>
                </button>
              </div>

            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                <span className="text-xs text-slate-400 font-semibold block">সঠিক (Correct)</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-xl font-black">{correctCount}</strong>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                <span className="text-xs text-slate-400 font-semibold block">ভুল (Wrong)</span>
                <strong className="text-rose-500 text-xl font-black">{wrongCount}</strong>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                <span className="text-xs text-slate-400 font-semibold block">অনুত্তরিত (Skipped)</span>
                <strong className="text-slate-500 text-xl font-black">{skippedCount}</strong>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                <span className="text-xs text-slate-400 font-semibold block">সময় (Time Used)</span>
                <strong className="text-slate-900 dark:text-slate-100 text-sm font-black mt-1 block">
                  {Math.floor(timeUsedSeconds / 60)} মি. {timeUsedSeconds % 60} সে.
                </strong>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-amber-500/10 border border-amber-400/40 p-4 rounded-2xl text-center shadow-sm">
                <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold block">জাতীয় মেধা Rank</span>
                <strong className="text-amber-600 dark:text-amber-400 text-xl font-black">১৫তম</strong>
              </div>
            </div>

            {/* Subject Performance Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                <span>বিষয়ভিত্তিক দক্ষতা (Subject Performance)</span>
              </h3>

              <div className="space-y-3.5">
                {subjectPerformance.map((sub, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>{sub.name}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{sub.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${sub.color} h-full rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${sub.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Review Section */}
            <div ref={reviewSectionRef} className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <span>প্রশ্নোত্তর রিভিউ ও ব্যাখ্যা (Question Review)</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  মোট {totalQuestions}টি প্রশ্ন
                </span>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userChoice = userAnswers[idx];
                  const isCorrect = userChoice === q.correctAnswer;
                  const isSkipped = userChoice === undefined;
                  const isOpen = openExplanations[idx];

                  return (
                    <div
                      key={q.id || idx}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80'
                          : isSkipped
                          ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                          : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/80'
                      }`}
                    >
                      {/* Status Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                          প্রশ্ন {toBnNumeral(idx + 1)}.
                        </span>

                        {isCorrect ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>সঠিক হয়েছে</span>
                          </span>
                        ) : isSkipped ? (
                          <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                            উত্তর দেওয়া হয়নি
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[11px] flex items-center space-x-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>ভুল হয়েছে</span>
                          </span>
                        )}
                      </div>

                      {/* Question Text */}
                      <div className="pt-3 space-y-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                          {q.question}
                        </h4>

                        {q.questionArabic && (
                          <p className="font-arabic text-right text-lg sm:text-xl text-emerald-950 dark:text-emerald-200 font-bold bg-emerald-50/50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 leading-[2.1]">
                            {q.questionArabic}
                          </p>
                        )}
                      </div>

                      {/* Answers Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs font-bold">
                        <div className={`p-3 rounded-xl border ${
                          isCorrect ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 border-emerald-300' : 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300'
                        }`}>
                          <span className="text-[10px] uppercase block text-slate-500 mb-0.5">আপনার উত্তর:</span>
                          <span>{userChoice !== undefined ? q.options[userChoice] : 'উত্তর প্রদান করেননি'}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 border border-emerald-300">
                          <span className="text-[10px] uppercase block text-slate-500 mb-0.5">সঠিক উত্তর:</span>
                          <span>{q.options[q.correctAnswer]}</span>
                        </div>
                      </div>

                      {/* Manual & Ustad AI Explanation Section */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
                        
                        {/* 1. Manual Explanation (If present from Admin Panel) */}
                        {q.explanation && q.explanation.trim().length > 0 ? (
                          <div className="space-y-2">
                            <button
                              onClick={() => setOpenExplanations((p) => ({ ...p, [idx]: !p[idx] }))}
                              className="w-full flex items-center justify-between text-xs font-black text-amber-700 dark:text-amber-300 py-1"
                            >
                              <span className="flex items-center space-x-1.5">
                                <FileText className="w-4 h-4 text-amber-500" />
                                <span>ম্যানুয়াল বিবরণী ও ব্যাখ্যা (Manual Explanation)</span>
                              </span>
                              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {isOpen && (
                              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed space-y-3 shadow-2xs">
                                <p className="font-medium">{q.explanation}</p>
                                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 dark:border-amber-800/50">
                                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400">
                                    সহীহ ম্যানুয়াল বিবরণী
                                  </span>
                                  <button
                                    onClick={() => handleCopyExplanation(q.explanation || '')}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] flex items-center space-x-1 shadow-xs transition-all active:scale-95"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>কপি করুন</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}

                        {/* 2. Ustad AI Explanation Button & Box */}
                        <div className="space-y-2">
                          {!aiExplanations[idx] && (
                            <button
                              onClick={() => handleFetchAiExplanation(idx, q)}
                              disabled={loadingAiIdx === idx}
                              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs flex items-center justify-between shadow-md transition-all active:scale-95 disabled:opacity-60"
                            >
                              <span className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                                <span>
                                  {loadingAiIdx === idx
                                    ? 'উস্তাদ এআই ব্যাখ্যা বিশ্লেষণ করছে...'
                                    : q.explanation
                                    ? 'উস্তাদ এআই দিয়ে আরও বিস্তৃত ব্যাখ্যা জানুন'
                                    : 'উস্তাদ এআই দিয়ে ব্যাখ্যা জানুন'}
                                </span>
                              </span>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                                AI Tutor
                              </span>
                            </button>
                          )}

                          {aiExplanations[idx] && (
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 text-white border border-emerald-500/50 text-xs sm:text-sm leading-relaxed space-y-3 shadow-lg relative">
                              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
                                <span className="font-black text-amber-400 text-xs flex items-center space-x-1.5">
                                  <Sparkles className="w-4 h-4 text-amber-400" />
                                  <span>উস্তাদ এআই বিশ্লেষণ ও ব্যাখ্যা</span>
                                </span>
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-700 text-white">
                                  Gemini AI Powered
                                </span>
                              </div>

                              <p className="whitespace-pre-line font-medium text-emerald-50">
                                {aiExplanations[idx]}
                              </p>

                              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-emerald-800/60">
                                <button
                                  onClick={() => handleCopyExplanation(aiExplanations[idx])}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 shadow-sm active:scale-95"
                                >
                                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                                  <span>কপি করুন</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Result Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>রিভিউ উত্তর</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenLeaderboard) {
                    onOpenLeaderboard(exam);
                  } else {
                    alert('লিডারবোর্ডে নিয়ে যাওয়া হচ্ছে...');
                  }
                }}
                className="py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
              >
                <Trophy className="w-4 h-4 text-slate-950" />
                <span>মেধা তালিকা</span>
              </button>

              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}${window.location.pathname}?examId=${exam.id}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl);
                  }
                  setShowShareToast(true);
                  setTimeout(() => setShowShareToast(false), 3000);
                }}
                className="py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>শেয়ার রেজাল্ট</span>
              </button>

              <button
                onClick={onClose}
                className="py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>হোমে ফিরুন</span>
              </button>
            </div>

            {/* Share Result Toast */}
            {showShareToast && (
              <div className="fixed bottom-24 inset-x-0 mx-auto z-50 w-max bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>রেজাল্ট কপি করা হয়েছে! সোশ্যাল মিডিয়ায় শেয়ার করুন।</span>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* BOTTOM STICKY CONTROL BAR FOR ACTIVE EXAM                 */}
      {/* ========================================================= */}
      {!isSubmitted && (
        <footer className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Previous Button */}
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-1 active:scale-95 shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>পূর্ববর্তী</span>
            </button>

            {/* Question Quick Grid Drawer Toggle Button */}
            <button
              onClick={() => setShowQuestionGridDrawer(true)}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold flex items-center space-x-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
              title="সকল প্রশ্নের গ্রিড দেখুন"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">প্রশ্ন তালিকা ({answeredCount}/{totalQuestions})</span>
            </button>

            {/* Next / Submit Button */}
            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIdx((p) => Math.min(totalQuestions - 1, p + 1))}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center space-x-1 active:scale-95 shrink-0"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg transition-all flex items-center space-x-1.5 active:scale-95 shrink-0"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>সাবমিট করুন</span>
              </button>
            )}

          </div>
        </footer>
      )}

      {/* ========================================================= */}
      {/* SUBMIT CONFIRMATION DIALOG MODAL                          */}
      {/* ========================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full shadow-2xl border border-emerald-500/40 p-6 space-y-5 text-center relative">
            
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-400/30">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-950 dark:text-slate-100">
                Submit Exam? (পরীক্ষা সাবমিট করবেন?)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                সাবমিট করার পর উত্তর পরিবর্তন করা সম্ভব হবে না।
              </p>
            </div>

            {/* Unanswered count badge */}
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Remaining unanswered (উত্তর না দেওয়া প্রশ্ন):{' '}
              <strong className="text-amber-600 dark:text-amber-400 font-black text-sm">{unansweredCount}টি</strong>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel (বাতিল)
              </button>
              <button
                onClick={handleFinalSubmit}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
              >
                Submit (সাবমিট)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EXIT CONFIRMATION MODAL                                   */}
      {/* ========================================================= */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full shadow-2xl border border-rose-500/40 p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-950 dark:text-slate-100">
                পরীক্ষাটি ছেড়ে বের হবেন?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                এখনই বের হয়ে গেলে আপনার বর্তমান প্রশ্নের উত্তরগুলো সংরক্ষিত নাও হতে পারে।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm"
              >
                পরীক্ষা চালিয়ে যান
              </button>
              <button
                onClick={onClose}
                className="py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-rose-500 hover:text-white"
              >
                বের হয়ে যান
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* QUESTION GRID DRAWER SHEET                                */}
      {/* ========================================================= */}
      {showQuestionGridDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                প্রশ্ন নেভিগেশন গ্রিড (Question Map)
              </h3>
              <button
                onClick={() => setShowQuestionGridDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-around text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                <span>উত্তর প্রদানকৃত</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                <span>অনুত্তরিত</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span>ফ্ল্যাগকৃত</span>
              </span>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 max-h-60 overflow-y-auto p-1">
              {questions.map((_, qIdx) => {
                const isAnswered = userAnswers[qIdx] !== undefined;
                const isFlagged = flaggedIdxs.has(qIdx);
                const isCurrent = qIdx === currentIdx;

                return (
                  <button
                    key={qIdx}
                    onClick={() => {
                      setCurrentIdx(qIdx);
                      setShowQuestionGridDrawer(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-black transition-all flex items-center justify-center relative ${
                      isCurrent
                        ? 'ring-2 ring-emerald-500 ring-offset-2 font-black scale-105'
                        : ''
                    } ${
                      isFlagged
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : isAnswered
                        ? 'bg-emerald-600 text-white font-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {toBnNumeral(qIdx + 1)}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowQuestionGridDrawer(false)}
              className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
