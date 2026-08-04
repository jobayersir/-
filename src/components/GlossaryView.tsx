import React, { useState } from 'react';
import { GlossaryTerm } from '../types';
import { GLOSSARY_TERMS } from '../data/glossary';
import { BookMarked, Search, Volume2, Bookmark, Check, Sparkles, Filter } from 'lucide-react';

interface GlossaryViewProps {
  arabicFont: string;
  onBookmark: (id: string, type: 'term') => void;
  bookmarkedIds: string[];
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ arabicFont, onBookmark, bookmarkedIds }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const matchesSearch =
      t.termArabic.includes(searchQuery) ||
      t.termBangla.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.termEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.definitionBangla.includes(searchQuery);

    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <BookMarked className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
            আরবি পরিভাষা ও ইসলামিক অভিধান (Madrasa Exam Glossary)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            বালাগাত, ফিকহ, উসূল, নাহু ও হাদিস শাস্ত্রের প্রামাণ্য ইসলামিক পরিভাষাসমূহ
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পরিভাষা খুঁজুন (আরবি, বাংলা বা ইংরেজিতে)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">সকল বিভাগ</option>
            <option value="arabic_grammar">বালাগাত, নাহু ও সরফ</option>
            <option value="fiqh_usul">ফিকহ ও উসূলে ফিকহ</option>
            <option value="quran_hadith">আল-কুরআন ও হাদিস</option>
          </select>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4 hover:border-emerald-500 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontFamily: arabicFont }} className="text-3xl sm:text-4xl font-bold text-emerald-950 dark:text-emerald-200 font-arabic leading-[2.2]">
                  {term.termArabic}
                </p>
                <h4 className="text-base sm:text-lg font-bold text-slate-950 dark:text-slate-50 mt-1">
                  {term.termBangla}
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {term.termEnglish}
                </p>
              </div>

              <button
                onClick={() => onBookmark(term.id, 'term')}
                className={`p-2 rounded-xl transition-colors ${
                  bookmarkedIds.includes(term.id)
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'
                }`}
                title="বুকমার্ক করুন"
              >
                <Bookmark className="w-4 h-4" fill={bookmarkedIds.includes(term.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {term.definitionBangla}
            </p>

            {term.quranicReference && (
              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                <span>রেফারেন্স: {term.quranicReference}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
