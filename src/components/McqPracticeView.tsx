import React, { useState, useEffect } from 'react';
import { MCQQuestion, PostCadre, SubjectCategory } from '../types';
import { QUESTION_BANK } from '../data/questionBank';
import { formatArabicText, getArabicFontFamily } from '../utils/arabic';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Bookmark, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  Award,
  AlertCircle,
  Volume2
} from 'lucide-react';

interface McqPracticeViewProps {
  selectedCadre: PostCadre;
  arabicFont: string;
  harakatVisible: boolean;
  onSaveResult: (correct: number, total: number, timeTakenSeconds: number) => void;
  onBookmark: (id: string, type: 'mcq') => void;
  bookmarkedIds: string[];
}

export const McqPracticeView: React.FC<McqPracticeViewProps> = ({
  selectedCadre,
  arabicFont,
  harakatVisible,
  onSaveResult,
  onBookmark,
  bookmarkedIds,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [viewType, setViewType] = useState<'scroll' | 'single'>('scroll'); // Default to bottom-to-top scroll feed
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});

  // Helper for Bengali serial numbers (১, ২, ৩, ৪, ৫...)
  const toBnNum = (n: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n).split('').map(d => bnDigits[parseInt(d)] || d).join('');
  };
  
  // Exam timer states
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [timerActive, setTimerActive] = useState(false);

  // Ustad AI Explanation modal
  const [aiExplainText, setAiExplainText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Filter questions on subject or cadre change
  useEffect(() => {
    let filtered = QUESTION_BANK;

    if (selectedCadre !== 'all') {
      filtered = filtered.filter(q => q.cadre.includes('all') || q.cadre.includes(selectedCadre));
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }

    setQuestions(filtered);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowExplanations({});
    setExamSubmitted(false);
    setTimeLeft(filtered.length * 60 || 600);
    setTimerActive(mode === 'exam');
  }, [selectedCadre, selectedSubject, mode]);

  // Exam Countdown Timer
  useEffect(() => {
    let timer: any;
    if (timerActive && timeLeft > 0 && !examSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !examSubmitted && timerActive) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, examSubmitted]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (examSubmitted && mode === 'exam') return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleToggleExplanation = (index: number) => {
    setShowExplanations((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    setTimerActive(false);

    // Calculate score
    let correct = 0;
    let wrong = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] !== undefined) {
        if (userAnswers[idx] === q.correctAnswer) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const timeTaken = (questions.length * 60) - timeLeft;
    onSaveResult(correct, questions.length, Math.max(timeTaken, 10));
  };

  const handleAskUstadAi = async (q: MCQQuestion) => {
    setAiLoading(true);
    setAiExplainText(null);
    try {
      const res = await fetch('/api/ustad-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain_question',
          questionData: {
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            subject: q.subject,
          },
          apiKey: localStorage.getItem('tamreen_gemini_api_key') || undefined,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiExplainText(data.text);
      } else {
        setAiExplainText(data.error || 'উস্তাদ এআই উত্তর দিতে সমর্থ হয়নি।');
      }
    } catch (err) {
      setAiExplainText('নেটওয়ার্ক সংযোগ ত্রুটি। পুনরায় চেষ্টা করুন।');
    } finally {
      setAiLoading(false);
    }
  };

  const calculateScoreDetails = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined) {
        skipped++;
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    // Negative marking: 0.25 mark per wrong answer
    const netScore = Math.max(0, correct - (wrong * 0.25));
    return { correct, wrong, skipped, netScore };
  };

  const subjectsList: { id: string; label: string }[] = [
    { id: 'all', label: 'সকল বিষয়' },
    { id: 'quran_hadith', label: 'আল-কুরআন ও হাদিস' },
    { id: 'fiqh_usul', label: 'ফিকহ ও উসূলে ফিকহ' },
    { id: 'arabic_grammar', label: 'আরবি ভাষা (নাহু/সরফ)' },
    { id: 'islamic_history', label: 'ইসলামী ইতিহাস' },
    { id: 'bangla', label: 'বাংলা সাহিত্য ও ব্যাকরণ' },
    { id: 'english', label: 'English Language' },
    { id: 'mathematics', label: 'সাধারণ গণিত' },
    { id: 'general_knowledge', label: 'সাধারণ জ্ঞান' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Filter & Mode Switcher */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Mode & View Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#020617,inset_-2px_-2px_4px_#1e293b]">
            <button
              onClick={() => setMode('practice')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                mode === 'practice'
                  ? 'bg-emerald-600 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              অনুশীলন মোড
            </button>
            <button
              onClick={() => setMode('exam')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                mode === 'exam'
                  ? 'bg-amber-600 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              মডেল টেস্ট মোড
            </button>
          </div>

          {/* View Mode Toggle: Scroll Feed vs Single View */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#020617,inset_-2px_-2px_4px_#1e293b]">
            <button
              onClick={() => setViewType('scroll')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewType === 'scroll'
                  ? 'bg-teal-600 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              স্ক্রলিং তালিকা
            </button>
            <button
              onClick={() => setViewType('single')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewType === 'single'
                  ? 'bg-teal-600 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              একক কার্ড
            </button>
          </div>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full md:w-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer shadow-[3px_3px_6px_#cbd5e1,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#020617,-3px_-3px_6px_#1e293b]"
          >
            {subjectsList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Timer during Exam Mode */}
        {mode === 'exam' && !examSubmitted && (
          <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-bold">
            <Clock className="w-4 h-4 animate-spin text-amber-600" />
            <span>অবশিষ্ট সময়: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</span>
          </div>
        )}
      </div>

      {/* Main MCQ Content */}
      {questions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-700">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            এই বিভাগে কোনো প্রশ্ন পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            অন্য কোনো বিষয় বা পদ নির্বাচন করে চেষ্টা করুন।
          </p>
        </div>
      ) : mode === 'exam' && examSubmitted ? (
        
        /* Exam Results Summary Card */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              মডেল টেস্টের ফলাফল
            </h3>
            <p className="text-xs text-slate-500">
              নেগেটিভ মার্কিং সহ হিসাবকৃত
            </p>
          </div>

          {/* Score Stats Grid */}
          {(() => {
            const { correct, wrong, skipped, netScore } = calculateScoreDetails();
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-2xl text-center border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">সঠিক উত্তর</span>
                  <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-1">{correct}</p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-950/50 p-4 rounded-2xl text-center border border-rose-200 dark:border-rose-800">
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">ভুল উত্তর (-০.২৫)</span>
                  <p className="text-2xl font-black text-rose-800 dark:text-rose-200 mt-1">{wrong}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">উত্তর দেননি</span>
                  <p className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">{skipped}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-2xl text-center border border-amber-200 dark:border-amber-800">
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">নিট নম্বর</span>
                  <p className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-1">{netScore} / {questions.length}</p>
                </div>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => {
                setExamSubmitted(false);
                setUserAnswers({});
                setCurrentIndex(0);
                setTimeLeft(questions.length * 60);
                setTimerActive(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>পুনরায় মক টেস্ট দিন</span>
            </button>
            <button
              onClick={() => setMode('practice')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center space-x-2"
            >
              <span>উত্তর ও ব্যাখ্যা দেখুন</span>
            </button>
          </div>
        </div>

      ) : viewType === 'scroll' ? (

        /* Bottom-to-Top Scrollable List Feed View */
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const isAnswered = userAnswers[qIdx] !== undefined;
            const selectedOpt = userAnswers[qIdx];

            return (
              <div
                key={q.id || qIdx}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-5 animate-in slide-in-from-bottom duration-300"
              >
                {/* Question Serial Number & Tag Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)]">
                      প্রশ্ন নং: {toBnNum(qIdx + 1)} / {toBnNum(questions.length)}
                    </span>
                    {q.yearTag && (
                      <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full font-bold">
                        {q.yearTag}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onBookmark(q.id, 'mcq')}
                    className={`p-2 rounded-xl transition-colors ${
                      bookmarkedIds.includes(q.id)
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                    title="বুকমার্ক করুন"
                  >
                    <Bookmark className="w-4 h-4" fill={bookmarkedIds.includes(q.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Question Text (Bangla Left, Arabic Right) */}
                <div className="space-y-3">
                  <h3 dir="ltr" className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-950 dark:text-slate-50 leading-relaxed text-left">
                    {toBnNum(qIdx + 1)}. {q.question}
                  </h3>

                  {q.questionArabic && (
                    <div
                      dir="rtl"
                      style={{ fontFamily: getArabicFontFamily(arabicFont) }}
                      className="text-2xl sm:text-3xl text-emerald-950 dark:text-emerald-200 leading-[2.2] font-bold font-arabic bg-emerald-50/60 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-right"
                    >
                      {formatArabicText(q.questionArabic, harakatVisible)}
                    </div>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isCorrect = optIdx === q.correctAnswer;
                    const showResult = mode === 'practice' && isAnswered;

                    let btnStyle = 'bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-950 dark:text-slate-100 shadow-[3px_3px_6px_#cbd5e1,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#020617,-3px_-3px_6px_#1e293b] hover:border-emerald-500 font-semibold';

                    if (mode === 'practice' && showResult) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-950 dark:text-rose-100 font-bold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-extrabold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]';
                    }

                    const isOptArabic = /[\u0600-\u06FF]/.test(opt);
                    const formattedOpt = isOptArabic ? formatArabicText(opt, harakatVisible) : opt;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          if (examSubmitted && mode === 'exam') return;
                          setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                        }}
                        className={`w-full p-4 rounded-2xl border flex items-center justify-between text-base sm:text-lg transition-all text-left ${btnStyle}`}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <span className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0">
                            {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                          </span>
                          <span
                            dir={isOptArabic ? 'rtl' : 'ltr'}
                            style={isOptArabic ? { fontFamily: getArabicFontFamily(arabicFont) } : undefined}
                            className={isOptArabic ? 'font-arabic text-right w-full text-lg sm:text-xl font-bold leading-[2.1]' : 'text-left font-semibold text-base sm:text-lg leading-relaxed'}
                          >
                            {formattedOpt}
                          </span>
                        </div>

                        {showResult && (
                          <div className="shrink-0 ml-2">
                            {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                            {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation in Practice Mode */}
                {mode === 'practice' && isAnswered && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                        ব্যাখ্যা:
                      </span>
                      <button
                        onClick={() => handleAskUstadAi(q)}
                        disabled={aiLoading}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 shadow-sm"
                      >
                        <Sparkles className="w-3 h-3 text-white animate-pulse" />
                        <span>{aiLoading ? 'ভাবছে...' : 'উস্তাদ এআই ব্যাখ্যা'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-left">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Submit Button in Exam Mode */}
          {mode === 'exam' && !examSubmitted && (
            <div className="text-center pt-4">
              <button
                onClick={handleSubmitExam}
                className="px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-xl"
              >
                পরীক্ষা জমা দিন (Submit Exam)
              </button>
            </div>
          )}
        </div>

      ) : (

        /* Active Single Question Card Display */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-6">
          
          {/* Question Header & Navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold">
                প্রশ্ন {toBnNum(currentIndex + 1)} / {toBnNum(questions.length)}
              </span>
              {currentQ.yearTag && (
                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full font-medium">
                  {currentQ.yearTag}
                </span>
              )}
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onBookmark(currentQ.id, 'mcq')}
              className={`p-2 rounded-xl transition-colors ${
                bookmarkedIds.includes(currentQ.id)
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400'
              }`}
              title="বুকমার্ক করুন"
            >
              <Bookmark className="w-4 h-4" fill={bookmarkedIds.includes(currentQ.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Question Text (Bangla & Arabic) */}
          <div className="space-y-3">
            <h3 dir="ltr" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug text-left">
              {toBnNum(currentIndex + 1)}. {currentQ.question}
            </h3>
            
            {currentQ.questionArabic && (
              <p
                dir="rtl"
                style={{ fontFamily: getArabicFontFamily(arabicFont) }}
                className="text-xl sm:text-2xl text-emerald-800 dark:text-emerald-300 leading-relaxed font-arabic bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-right"
              >
                {formatArabicText(currentQ.questionArabic, harakatVisible)}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentIndex] === optIdx;
              const isCorrect = optIdx === currentQ.correctAnswer;
              const showResult = mode === 'practice' && userAnswers[currentIndex] !== undefined;

              let btnStyle = 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-50/60 dark:hover:bg-slate-700/60';

              if (mode === 'practice' && showResult) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                }
              } else if (isSelected) {
                btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-md';
              }

              const isOptArabic = /[\u0600-\u06FF]/.test(opt);
              const formattedOpt = isOptArabic ? formatArabicText(opt, harakatVisible) : opt;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between text-sm sm:text-base transition-all ${btnStyle}`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <span className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                    </span>
                    <span
                      dir={isOptArabic ? 'rtl' : 'ltr'}
                      style={isOptArabic ? { fontFamily: getArabicFontFamily(arabicFont) } : undefined}
                      className={isOptArabic ? 'font-arabic text-right w-full' : 'text-left'}
                    >
                      {formattedOpt}
                    </span>
                  </div>

                  {showResult && (
                    <div className="shrink-0 ml-2">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Solution & Ustad AI Explanation (Practice Mode) */}
          {mode === 'practice' && userAnswers[currentIndex] !== undefined && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা
                </span>
                
                {/* Ustad AI Button */}
                <button
                  onClick={() => handleAskUstadAi(currentQ)}
                  disabled={aiLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>{aiLoading ? 'উস্তাদ এআই ভাবছে...' : 'উস্তad এআই ব্যাখ্যা'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-left">
                {currentQ.explanation}
              </p>

              {/* AI Generated Text Box */}
              {aiExplainText && (
                <div className="mt-3 p-4 rounded-xl bg-amber-50/80 dark:bg-slate-800/90 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2">
                  <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-amber-600" />
                    উস্তাদ এআই ব্যাখ্যা:
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-left">{aiExplainText}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Prev / Next Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm disabled:opacity-40 flex items-center space-x-1 shadow-[2px_2px_4px_#cbd5e1,-2px_-2px_4px_#ffffff]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>পূর্ববর্তী</span>
            </button>

            {mode === 'exam' && currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md"
              >
                পরীক্ষা জমা দিন (Submit Exam)
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm disabled:opacity-40 flex items-center space-x-1 shadow-[2px_2px_4px_rgba(0,0,0,0.2)]"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
