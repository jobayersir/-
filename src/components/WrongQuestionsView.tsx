import React, { useState } from 'react';
import { UserProfileData, NavTab, MCQQuestion } from '../types';
import { QUESTION_BANK } from '../data/questionBank';
import { CbtExamRunner } from './CbtExamRunner';
import { ExtendedExamItem } from './ExamsView';
import { formatArabicText } from '../utils/arabic';
import { 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  FileText, 
  Trophy, 
  Clock, 
  Zap, 
  BookOpen, 
  Bot,
  Layers,
  ArrowRight
} from 'lucide-react';

interface WrongQuestionsViewProps {
  user: UserProfileData;
  onTabChange: (tab: NavTab) => void;
  harakatVisible?: boolean;
}

// Sample initial wrong questions derived from Question Bank
const INITIAL_WRONG_QUESTIONS: (MCQQuestion & { userWrongAnswer: number })[] = [
  {
    ...QUESTION_BANK[0],
    userWrongAnswer: 1, // User picked option 1 (wrong) instead of correct answer
  },
  {
    ...QUESTION_BANK[1] || QUESTION_BANK[0],
    userWrongAnswer: 2,
  },
  {
    ...QUESTION_BANK[2] || QUESTION_BANK[0],
    userWrongAnswer: 0,
  },
  {
    ...QUESTION_BANK[3] || QUESTION_BANK[0],
    userWrongAnswer: 3,
  },
  {
    ...QUESTION_BANK[4] || QUESTION_BANK[0],
    userWrongAnswer: 1,
  },
];

const optionBadges = ['ক', 'খ', 'গ', 'ঘ'];

export const WrongQuestionsView: React.FC<WrongQuestionsViewProps> = ({
  user,
  onTabChange,
  harakatVisible = true
}) => {
  const [isRunningExam, setIsRunningExam] = useState<boolean>(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'arabic' | 'general'>('all');
  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});
  const [lastExamScore, setLastExamScore] = useState<{ score: number; maxScore: number } | null>(null);

  // Tamreen AI Help inline state
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [aiLoadingQuestionId, setAiLoadingQuestionId] = useState<string | null>(null);

  const toggleExplanation = (qId: string) => {
    setExpandedExplanation((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleAskTamreenAi = async (q: MCQQuestion) => {
    setAiLoadingQuestionId(q.id);
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
        setAiExplanations((prev) => ({ ...prev, [q.id]: data.text }));
      } else {
        setAiExplanations((prev) => ({ ...prev, [q.id]: data.error || 'তামরীন AI থেকে সম্পূর্ণ ব্যাখ্যা তৈরি করা সম্ভব হয়নি।' }));
      }
    } catch (err) {
      setAiExplanations((prev) => ({ ...prev, [q.id]: 'নেটওয়ার্ক সংযোগ বিঘ্নিত হয়েছে। পুনরায় চেষ্টা করুন।' }));
    } finally {
      setAiLoadingQuestionId(null);
    }
  };

  // Convert wrong questions to ExtendedExamItem format for CBT Runner
  const wrongExamData: ExtendedExamItem = {
    id: 'wrong-questions-bank-retake',
    title: 'ভুল উত্তরের ব্যাংক - বিশেষ রিভিশন সিবিটি পরীক্ষা',
    subject: 'সকল বিষয় (রিভিশন)',
    category: 'daily',
    durationMinutes: 15,
    totalQuestions: INITIAL_WRONG_QUESTIONS.length,
    difficulty: 'মাঝারি',
    participantsCount: '১,৮৪০ জন',
    isPremium: false,
    scheduledTime: 'যেকোনো সময়',
    date: 'আজকের সিবিটি',
    totalMarks: INITIAL_WRONG_QUESTIONS.length,
    subjectIcon: 'quran',
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-rose-800/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold backdrop-blur-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>পারফরম্যান্স রিকভারি • ভুল উত্তরের ব্যাংক</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-tight">
              ভুল উত্তরের ব্যাংক (Mistake Bank)
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              পূর্বে অনুষ্ঠিত মডেল টেস্ট ও প্র্যাকটিসে যেসব প্রশ্ন ভুল উত্তর দিয়েছিলেন, সেগুলোর নির্ভুল সমাধান ও রিভিশন। সিবিটি পরীক্ষা দিয়ে আপনার ভুলগুলো শুধরে নিন।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-rose-200 font-bold">
              <span className="bg-rose-900/50 px-3 py-1 rounded-xl border border-rose-700/50">
                🎯 সংরক্ষিত ভুল প্রশ্ন: {INITIAL_WRONG_QUESTIONS.length} টি
              </span>
              <span className="bg-indigo-900/50 px-3 py-1 rounded-xl border border-indigo-700/50">
                ⏱️ রিভিশন সিবিটি সময়: ১৫ মিনিট
              </span>
            </div>
          </div>

          {/* Primary Big Retake Button */}
          <div className="w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsRunningExam(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center space-x-2.5 active:scale-95 transition-all cursor-pointer border border-rose-400/30"
            >
              <Zap className="w-5 h-5 fill-white text-white animate-pulse" />
              <span>পুনরায় পরীক্ষা দিন (CBT Exam)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Last Exam Result Alert Banner (If completed) */}
      {lastExamScore && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/40 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">সর্বশেষ রিভিশন পরীক্ষার ফলাফল</h4>
              <p className="text-xs text-emerald-200">
                আপনার অর্জিত স্কোর: <strong className="text-amber-300 font-black text-sm">{lastExamScore.score}/{lastExamScore.maxScore}</strong> (শতকরা {Math.round((lastExamScore.score / lastExamScore.maxScore) * 100)}%)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRunningExam(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all shrink-0"
          >
            আবার পরীক্ষা দিন
          </button>
        </div>
      )}

      {/* 3. Filter Controls & Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-rose-500" />
          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
            ভুল প্রশ্ন ও উত্তর বিশ্লেষণ তালিকা
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRunningExam(true)}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>লাইভ সিবিটি পরীক্ষা</span>
          </button>
        </div>
      </div>

      {/* 4. Neumorphic Question Cards */}
      <div className="space-y-4 sm:space-y-5">
        {INITIAL_WRONG_QUESTIONS.map((q, idx) => {
          const isExpOpen = expandedExplanation[q.id];

          return (
            <div
              key={q.id}
              className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950/80 border border-slate-200/90 dark:border-slate-800 shadow-[6px_6px_18px_rgba(0,0,0,0.05),-6px_-6px_18px_rgba(255,255,255,0.85)] dark:shadow-[6px_6px_18px_rgba(0,0,0,0.45),-6px_-6px_18px_rgba(255,255,255,0.02)] space-y-4"
            >
              {/* Question Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    {q.subject}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                  ⚠️ ১টি ভুলের রেকর্ড
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 
                  className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug"
                  style={{ fontFamily: "'Noto Serif Bengali', 'SolaimanLipi', serif" }}
                >
                  {q.question}
                </h3>
                {q.questionArabic && (
                  <p 
                    className="font-arabic text-lg sm:text-xl text-emerald-800 dark:text-emerald-300 dir-rtl text-right leading-relaxed font-semibold bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40"
                    style={{ fontFamily: "'Noto Naskh Arabic', 'Traditional Arabic', serif" }}
                  >
                    {formatArabicText(q.questionArabic, harakatVisible)}
                  </p>
                )}
              </div>

              {/* Options Breakdown with Neumorphic Styling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((optText, oIdx) => {
                  const isUserWrongChoice = oIdx === q.userWrongAnswer;
                  const isCorrectChoice = oIdx === q.correctAnswer;
                  const badge = optionBadges[oIdx] || `${oIdx + 1}`;

                  return (
                    <div
                      key={oIdx}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCorrectChoice
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-extrabold shadow-2xs ring-1 ring-emerald-500/30'
                          : isUserWrongChoice
                          ? 'bg-rose-50/90 dark:bg-rose-950/80 border-rose-400 text-rose-950 dark:text-rose-100 font-bold shadow-2xs'
                          : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span 
                          className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                            isCorrectChoice
                              ? 'bg-emerald-600 text-white'
                              : isUserWrongChoice
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {badge}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold truncate leading-tight">
                          {formatArabicText(optText, harakatVisible)}
                        </span>
                      </div>

                      {/* Status Badges */}
                      {isCorrectChoice ? (
                        <span className="shrink-0 text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-lg flex items-center space-x-1 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>সঠিক উত্তর</span>
                        </span>
                      ) : isUserWrongChoice ? (
                        <span className="shrink-0 text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-lg flex items-center space-x-1 shadow-2xs">
                          <XCircle className="w-3 h-3 text-white" />
                          <span>আপনার উত্তর</span>
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar for Each Question: Explanation & Tamreen AI */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => toggleExplanation(q.id)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-950 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-800 text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{isExpOpen ? 'ব্যাখ্যা লুকান' : 'বিস্তারিত ব্যাখ্যা দেখুন'}</span>
                </button>

                <button
                  onClick={() => handleAskTamreenAi(q)}
                  disabled={aiLoadingQuestionId === q.id}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/80 text-teal-950 dark:text-teal-200 border border-teal-200/80 dark:border-teal-800 text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Bot className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{aiLoadingQuestionId === q.id ? 'ব্যাখ্যা তৈরি হচ্ছে...' : 'তামরীন AI ব্যাখ্যা'}</span>
                </button>
              </div>

              {/* Expanded Manual Explanation Box */}
              {isExpOpen && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-1.5 text-indigo-900 dark:text-indigo-300 font-extrabold">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>ব্যাখ্যা:</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {q.explanation}
                  </p>
                </div>
              )}

              {/* Tamreen AI Explanation Inline Box */}
              {aiExplanations[q.id] && (
                <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 space-y-2 animate-in fade-in duration-200 shadow-xs">
                  <div className="flex items-center space-x-1.5 text-amber-900 dark:text-amber-300 font-extrabold border-b border-amber-200 dark:border-amber-800/60 pb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>তামরীন AI ব্যাখ্যা:</span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed font-medium text-slate-800 dark:text-slate-200">
                    {aiExplanations[q.id]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Bottom Neumorphic CBT Retake Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white border border-rose-500/40 shadow-xl text-center space-y-3">
        <h3 className="font-black text-lg sm:text-xl text-white">
          প্রস্তুতি শতভাগ নির্ভুল করতে চান?
        </h3>
        <p className="text-xs sm:text-sm text-rose-200 max-w-xl mx-auto">
          এখনই উপরোক্ত ভুল প্রশ্নগুলোর ওপর ১৫ মিনিটের সরাসরি অনলাইন সিবিটি পরীক্ষা দিন এবং রিয়েল-টাইম মেধা তালিকা স্কোর অর্জন করুন।
        </p>
        <div className="pt-2">
          <button
            onClick={() => setIsRunningExam(true)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 mx-auto active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>এখনই ভুল প্রশ্নের পরীক্ষা শুরু করুন</span>
          </button>
        </div>
      </div>

      {/* 7. Live CBT Exam Modal */}
      {isRunningExam && (
        <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
          <CbtExamRunner
            exam={wrongExamData}
            questions={INITIAL_WRONG_QUESTIONS}
            harakatVisible={harakatVisible}
            onClose={() => setIsRunningExam(false)}
            onComplete={(res) => {
              setLastExamScore({ score: res.score, maxScore: res.maxScore });
            }}
            onOpenLeaderboard={() => {
              setIsRunningExam(false);
              onTabChange('leaderboard');
            }}
          />
        </div>
      )}

    </div>
  );
};
