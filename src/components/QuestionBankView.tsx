import React, { useState } from 'react';
import { MCQQuestion, PostCadre } from '../types';
import { QUESTION_BANK } from '../data/questionBank';
import { BookOpen, CheckCircle, Search, Sparkles, Filter, Bookmark } from 'lucide-react';

interface QuestionBankViewProps {
  selectedCadre: PostCadre;
  arabicFont: string;
  onBookmark: (id: string, type: 'mcq') => void;
  bookmarkedIds: string[];
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  selectedCadre,
  arabicFont,
  onBookmark,
  bookmarkedIds,
}) => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = QUESTION_BANK.filter((q) => {
    const matchesCadre = selectedCadre === 'all' || q.cadre.includes('all') || q.cadre.includes(selectedCadre);
    const matchesYear = selectedYear === 'all' || (q.yearTag && q.yearTag.includes(selectedYear));
    const matchesSearch =
      q.question.includes(searchQuery) ||
      (q.questionArabic && q.questionArabic.includes(searchQuery)) ||
      q.explanation.includes(searchQuery);

    return matchesCadre && matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            বিগত বছরের প্রশ্ন ব্যাংক (Past Madrasa Question Bank)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            মাদ্রাসা বিষয়ভিত্তিক সকল পরীক্ষার শতভাগ সঠিক সমাধান ও তথ্যবহুল ব্যাখ্যা
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্রশ্ন ব্যাংকে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">সকল সাল</option>
            <option value="২০২৩">২০২৩ সালের প্রশ্ন</option>
            <option value="২০১৯">২০১৯ সালের প্রশ্ন</option>
            <option value="২০১৮">২০১৮ সালের প্রশ্ন</option>
            <option value="২০১৭">২০১৭ সালের প্রশ্ন</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4 hover:border-purple-500 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold">
                  প্রশ্ন #{idx + 1}
                </span>
                {q.yearTag && (
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full font-medium">
                    {q.yearTag}
                  </span>
                )}
              </div>

              <button
                onClick={() => onBookmark(q.id, 'mcq')}
                className={`p-2 rounded-xl transition-colors ${
                  bookmarkedIds.includes(q.id)
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                }`}
                title="বুকমার্ক করুন"
              >
                <Bookmark className="w-4 h-4" fill={bookmarkedIds.includes(q.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {q.question}
            </h4>

            {q.questionArabic && (
              <p style={{ fontFamily: arabicFont }} className="font-arabic text-xl text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                {q.questionArabic}
              </p>
            )}

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              {q.options.map((opt, oIdx) => {
                const isCorrect = oIdx === q.correctAnswer;
                return (
                  <div
                    key={oIdx}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{['ক', 'খ', 'গ', 'ঘ'][oIdx]}. {opt}</span>
                    {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                  </div>
                );
              })}
            </div>

            {/* Detailed Explanation */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-900 border border-purple-100 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1">
              <span className="font-bold text-purple-900 dark:text-purple-300">ব্যাখ্যা:</span>
              <p className="leading-relaxed">{q.explanation}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
