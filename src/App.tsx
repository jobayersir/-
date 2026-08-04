import React, { useState, useEffect } from 'react';
import { PostCadre, ExamResult } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeDashboardView } from './components/HomeDashboardView';
import { McqPracticeView } from './components/McqPracticeView';
import { CqPracticeView } from './components/CqPracticeView';
import { QuestionBankView } from './components/QuestionBankView';
import { UstadAiView } from './components/UstadAiView';
import { GlossaryView } from './components/GlossaryView';
import { DeploymentGuideView } from './components/DeploymentGuideView';
import { Logo } from './components/Logo';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCadre, setSelectedCadre] = useState<PostCadre>('assistant_teacher_arabic');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [bengaliFont, setBengaliFont] = useState<string>('Noto Serif Bengali');
  const [arabicFont, setArabicFont] = useState<string>('Amiri');
  const [harakatVisible, setHarakatVisible] = useState<boolean>(true);

  // User persistent state
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Load local state on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('madrasa_prep_theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      const savedBengaliFont = localStorage.getItem('madrasa_prep_bengali_font');
      if (savedBengaliFont) {
        setBengaliFont(savedBengaliFont);
      }

      const savedArabicFont = localStorage.getItem('madrasa_prep_arabic_font');
      if (savedArabicFont) {
        setArabicFont(savedArabicFont);
      }

      const savedResults = localStorage.getItem('madrasa_prep_results');
      if (savedResults) {
        setExamResults(JSON.parse(savedResults));
      }

      const savedBookmarks = localStorage.getItem('madrasa_prep_bookmarks');
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }
    } catch (e) {
      console.error('Failed to parse local storage', e);
    }
  }, []);

  // Sync dark mode class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync Bengali font on body
  useEffect(() => {
    if (bengaliFont === 'Noto Serif Bengali') {
      document.body.style.fontFamily = "'Noto Serif Bengali', 'Hind Siliguri', serif, system-ui";
    } else {
      document.body.style.fontFamily = "'Hind Siliguri', 'Noto Serif Bengali', sans-serif, system-ui";
    }
    localStorage.setItem('madrasa_prep_bengali_font', bengaliFont);
  }, [bengaliFont]);

  // Sync Arabic font preference
  const handleChangeArabicFont = (font: string) => {
    setArabicFont(font);
    localStorage.setItem('madrasa_prep_arabic_font', font);
  };

  // Dark mode toggle handler
  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('madrasa_prep_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('madrasa_prep_theme', 'light');
    }
  };

  // Save new test result
  const handleSaveResult = (correct: number, total: number, timeTakenSeconds: number) => {
    const newRes: ExamResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('bn-BD'),
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: total - correct,
      skipped: 0,
      score: (correct / total) * 100,
      timeTakenSeconds,
      cadre: selectedCadre,
      subjectFilter: 'all',
    };

    const updated = [newRes, ...examResults];
    setExamResults(updated);
    localStorage.setItem('madrasa_prep_results', JSON.stringify(updated));
  };

  // Bookmark toggle
  const handleBookmarkToggle = (id: string, type: 'mcq' | 'cq' | 'term') => {
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((b) => b !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem('madrasa_prep_bookmarks', JSON.stringify(updated));
  };

  // Calculate average accuracy
  const averageScore =
    examResults.length > 0
      ? examResults.reduce((acc, curr) => acc + curr.score, 0) / examResults.length
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Header */}
      <Header
        selectedCadre={selectedCadre}
        onSelectCadre={setSelectedCadre}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bengaliFont={bengaliFont}
        onChangeBengaliFont={setBengaliFont}
        arabicFont={arabicFont}
        onChangeArabicFont={handleChangeArabicFont}
        harakatVisible={harakatVisible}
        onToggleHarakat={() => setHarakatVisible(!harakatVisible)}
      />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeDashboardView
            selectedCadre={selectedCadre}
            onTabChange={setActiveTab}
            testCount={examResults.length}
            averageScore={averageScore}
          />
        )}

        {activeTab === 'mcq' && (
          <McqPracticeView
            selectedCadre={selectedCadre}
            arabicFont={arabicFont}
            harakatVisible={harakatVisible}
            onSaveResult={handleSaveResult}
            onBookmark={handleBookmarkToggle}
            bookmarkedIds={bookmarkedIds}
          />
        )}

        {activeTab === 'cq' && (
          <CqPracticeView selectedCadre={selectedCadre} arabicFont={arabicFont} />
        )}

        {activeTab === 'question_bank' && (
          <QuestionBankView
            selectedCadre={selectedCadre}
            arabicFont={arabicFont}
            onBookmark={handleBookmarkToggle}
            bookmarkedIds={bookmarkedIds}
          />
        )}

        {activeTab === 'ustad_ai' && <UstadAiView />}

        {activeTab === 'glossary' && (
          <GlossaryView
            arabicFont={arabicFont}
            onBookmark={handleBookmarkToggle}
            bookmarkedIds={bookmarkedIds}
          />
        )}

        {activeTab === 'deployment' && <DeploymentGuideView />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-8 mt-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Logo variant="horizontal" size="sm" />
            <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                TAMREEN ACADEMY • তামরীন একাডেমি
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                মাদ্রাসা শিক্ষক নিবন্ধন (NTRCA) স্পেশাল টিচিং প্ল্যাটফর্ম
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium">
            <button onClick={() => setActiveTab('deployment')} className="text-emerald-600 dark:text-emerald-400 hover:underline">
              গিটহাব & ভার্সেল ডিপ্লয়মেন্ট
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('ustad_ai')} className="text-emerald-600 dark:text-emerald-400 hover:underline">
              উস্তাদ এআই (Ustad AI)
            </button>
            <span>•</span>
            <span className="text-slate-400">© ২০২৬ সর্বস্বত্ব সংরক্ষিত</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
