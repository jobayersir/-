import React, { useState } from 'react';
import { CQQuestion, PostCadre } from '../types';
import { CQ_QUESTION_BANK } from '../data/cqQuestions';
import { Edit3, Sparkles, CheckCircle, BookOpen, Send, AlertCircle, ChevronDown, ChevronUp, Award } from 'lucide-react';

interface CqPracticeViewProps {
  selectedCadre: PostCadre;
  arabicFont: string;
}

export const CqPracticeView: React.FC<CqPracticeViewProps> = ({ selectedCadre, arabicFont }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<CQQuestion>(CQ_QUESTION_BANK[0]);
  const [showModelAnswer, setShowModelAnswer] = useState<Record<string, boolean>>({});
  const [userAnswerInput, setUserAnswerInput] = useState<string>('');
  const [aiEvaluation, setAiEvaluation] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  const filteredCqs = CQ_QUESTION_BANK.filter(
    cq => selectedCadre === 'all' || cq.cadre.includes('all') || cq.cadre.includes(selectedCadre)
  );

  const handleEvaluateAnswer = async () => {
    if (!userAnswerInput.trim()) return;
    setEvaluating(true);
    setAiEvaluation(null);

    try {
      const res = await fetch('/api/ustad-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_cq',
          questionData: {
            title: selectedQuestion.title,
            marks: selectedQuestion.marks,
          },
          userAnswer: userAnswerInput,
          apiKey: localStorage.getItem('tamreen_gemini_api_key') || undefined,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setAiEvaluation(data.text);
      } else {
        setAiEvaluation(data.error || 'মূল্যায়ন প্রক্রিয়াকরণে সমস্যা হয়েছে।');
      }
    } catch (err) {
      setAiEvaluation('নেটওয়ার্ক সংযোগ সমস্যা। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Edit3 className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
            সিকিউ ও লিখিত প্রশ্ন অনুশীলন (Written Prep & AI Marking)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            মাদ্রাসা শিক্ষক নিবন্ধন লিখিত পরীক্ষার উচ্চ নম্বর অর্জনের সেরা প্রস্তুতি
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
          মোট প্রশ্ন: {filteredCqs.length} টি
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Question Selector List (Left Side) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            প্রশ্ন তালিকা নির্বাচন করুন
          </h4>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCqs.map((cq) => {
              const isSelected = cq.id === selectedQuestion.id;
              return (
                <div
                  key={cq.id}
                  onClick={() => {
                    setSelectedQuestion(cq);
                    setUserAnswerInput('');
                    setAiEvaluation(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-semibold'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs opacity-90 mb-1">
                    <span>পূর্ণমান: {cq.marks}</span>
                    <span>{cq.yearTag}</span>
                  </div>
                  <h5 className="text-sm font-bold line-clamp-2">{cq.title}</h5>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Question Details & Answer Evaluator (Right Side) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-6">
            
            {/* Title & Tag */}
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  মান: {selectedQuestion.marks} নম্বর
                </span>
                <span className="text-xs text-slate-500">{selectedQuestion.yearTag}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                {selectedQuestion.title}
              </h3>

              {selectedQuestion.titleArabic && (
                <p
                  style={{ fontFamily: arabicFont }}
                  className="font-arabic text-xl text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40"
                >
                  {selectedQuestion.titleArabic}
                </p>
              )}
            </div>

            {/* Key Scoring Points */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                উচ্চ নম্বর অর্জনের মূল পয়েন্টসমূহ (Key Scoring Topics):
              </h5>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-5 list-disc">
                {selectedQuestion.keyPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Model Answer Toggle */}
            <div>
              <button
                onClick={() =>
                  setShowModelAnswer(prev => ({ ...prev, [selectedQuestion.id]: !prev[selectedQuestion.id] }))
                }
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-slate-900 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between border border-emerald-200 dark:border-slate-700 transition-colors"
              >
                <span>আদর্শ নমুনা উত্তর দেখুন (Model Answer)</span>
                {showModelAnswer[selectedQuestion.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showModelAnswer[selectedQuestion.id] && (
                <div className="mt-3 p-5 rounded-2xl bg-emerald-50/40 dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed animate-in fade-in">
                  {selectedQuestion.modelAnswer}
                </div>
              )}
            </div>

            {/* Student Answer Input Box & AI Evaluation */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                  আপনার নিজের উত্তর লিখুন এবং উস্তাদ এআই দ্বারা মূল্যায়ন করান:
                </h4>
              </div>

              <textarea
                value={userAnswerInput}
                onChange={(e) => setUserAnswerInput(e.target.value)}
                rows={5}
                placeholder="এখানে আপনার উত্তর বা খসড়া পয়েন্টগুলো লিখুন বা টাইপ করুন (বাংলা ও আরবিতে)..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <button
                onClick={handleEvaluateAnswer}
                disabled={evaluating || !userAnswerInput.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{evaluating ? 'উস্তাদ এআই মূল্যায়ন করছে...' : 'উস্তাদ এআই মূল্যায়ন জমা দিন'}</span>
              </button>

              {/* AI Feedback Output Box */}
              {aiEvaluation && (
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span>উস্তাদ এআই মূল্যায়ন রিপোর্ট:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {aiEvaluation}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
