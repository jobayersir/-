import React, { useState, useEffect } from 'react';
import { PostCadre, ExamResult, NavTab, UserProfileData } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ProfileSideSheet } from './components/ProfileSideSheet';
import { HomeView } from './components/HomeView';
import { ExamsView } from './components/ExamsView';
import { CoursesView } from './components/CoursesView';
import { UstadAiView } from './components/UstadAiView';
import { DashboardView } from './components/DashboardView';
import { McqPracticeView } from './components/McqPracticeView';
import { CqPracticeView } from './components/CqPracticeView';
import { QuestionBankView } from './components/QuestionBankView';
import { GlossaryView } from './components/GlossaryView';
import { DeploymentGuideView } from './components/DeploymentGuideView';
import { AdminView } from './components/AdminView';
import { 
  ProfileView, 
  BookmarksView, 
  WrongQuestionsView, 
  LeaderboardView, 
  PremiumView, 
  SettingsView 
} from './components/SecondaryViews';
import { QUESTION_BANK } from './data/questionBank';
import { Logo } from './components/Logo';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCadre, setSelectedCadre] = useState<PostCadre>('assistant_teacher_arabic');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [bengaliFont, setBengaliFont] = useState<string>('Noto Serif Bengali');
  const [arabicFont, setArabicFont] = useState<string>('Noto Naskh Arabic');
  const [harakatVisible, setHarakatVisible] = useState<boolean>(true);
  const [isProfileSideSheetOpen, setIsProfileSideSheetOpen] = useState<boolean>(false);

  // User persistent state
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // User Profile persistent state
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('tamreen_user_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse user profile', e);
    }
    return {
      name: 'মাওলানা মোঃ আব্দুল্লাহ',
      email: 'abdullah.tamreen@gmail.com',
      phone: '০১৭১২-৩৪৫৬৭৮',
      institution: 'গফরগাঁও ইসলামিয়া কামিল মাদ্রাসা',
      location: 'ময়মনসিংহ',
      cadre: selectedCadre,
      isPremium: true,
      joinedDate: 'জানুয়ারি ২০২৬',
      totalSolvedQuestions: 1420,
      accuracyRate: 84,
      streakDays: 14,
      targetYear: '১৮তম এনটিআরসিএ (মাদ্রাসা শিক্ষক নিবন্ধন ২০২৬)',
      avatarUrl: '',
    };
  });

  const handleUpdateProfile = (updatedProfile: UserProfileData) => {
    setUserProfile(updatedProfile);
    if (updatedProfile.cadre && updatedProfile.cadre !== selectedCadre) {
      setSelectedCadre(updatedProfile.cadre);
    }
    localStorage.setItem('tamreen_user_profile', JSON.stringify(updatedProfile));
  };

  // Navigation handler synchronized with browser history for mobile back button support
  const handleNavigateTab = (tab: NavTab, replace: boolean = false) => {
    if (isProfileSideSheetOpen) {
      setIsProfileSideSheetOpen(false);
    }
    
    setActiveTab(tab);
    
    const hash = `#${tab}`;
    if (replace) {
      window.history.replaceState({ tab }, '', hash);
    } else if (window.history.state?.tab !== tab) {
      window.history.pushState({ tab }, '', hash);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfileSideSheet = () => {
    setIsProfileSideSheetOpen(true);
    window.history.pushState({ tab: activeTab, drawerOpen: true }, '', `#${activeTab}`);
  };

  const handleCloseProfileSideSheet = () => {
    setIsProfileSideSheetOpen(false);
  };

  // Sync initial tab with URL hash & handle popstate for mobile back button
  useEffect(() => {
    const VALID_TABS: NavTab[] = [
      'home', 'exams', 'courses', 'ustad_ai', 'dashboard', 'profile', 
      'my_courses', 'bookmarks', 'wrong_questions', 'history', 
      'leaderboard', 'admin', 'premium', 'settings', 'mcq', 'cq', 
      'qbank', 'glossary', 'deployment'
    ];

    const initialHash = window.location.hash.replace('#', '') as NavTab;
    const initialTab = VALID_TABS.includes(initialHash) ? initialHash : 'home';
    setActiveTab(initialTab);

    // Initialize history stack so back button doesn't exit the app on first back tap
    if (initialTab !== 'home') {
      window.history.replaceState({ tab: 'home', isRoot: true }, '', '#home');
      window.history.pushState({ tab: initialTab }, '', `#${initialTab}`);
    } else {
      window.history.replaceState({ tab: 'home', isRoot: true }, '', '#home');
    }

    const handlePopState = (event: PopStateEvent) => {
      setIsProfileSideSheetOpen(false);

      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab as NavTab);
      } else {
        // If popped state is null or missing tab, keep user in app on 'home' page
        setActiveTab('home');
        window.history.pushState({ tab: 'home', isRoot: true }, '', '#home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load local state on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('tamreen_theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      const savedBengaliFont = localStorage.getItem('tamreen_bengali_font');
      if (savedBengaliFont) {
        setBengaliFont(savedBengaliFont);
      }

      const savedArabicFont = localStorage.getItem('tamreen_arabic_font');
      if (savedArabicFont) {
        setArabicFont(savedArabicFont);
      }

      const savedResults = localStorage.getItem('tamreen_results');
      if (savedResults) {
        setExamResults(JSON.parse(savedResults));
      }

      const savedBookmarks = localStorage.getItem('tamreen_bookmarks');
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
    localStorage.setItem('tamreen_bengali_font', bengaliFont);
  }, [bengaliFont]);

  // Sync Arabic font preference
  const handleChangeArabicFont = (font: string) => {
    setArabicFont(font);
    localStorage.setItem('tamreen_arabic_font', font);
  };

  // Dark mode toggle handler
  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tamreen_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tamreen_theme', 'light');
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
      score: Math.round((correct / total) * 100),
      timeTakenSeconds,
      cadre: selectedCadre,
      subjectFilter: 'all',
    };

    const updated = [newRes, ...examResults];
    setExamResults(updated);
    localStorage.setItem('tamreen_results', JSON.stringify(updated));
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
    localStorage.setItem('tamreen_bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Header */}
      <Header
        selectedCadre={selectedCadre}
        onSelectCadre={setSelectedCadre}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigateTab(tab)}
        bengaliFont={bengaliFont}
        onChangeBengaliFont={setBengaliFont}
        arabicFont={arabicFont}
        onChangeArabicFont={handleChangeArabicFont}
        harakatVisible={harakatVisible}
        onToggleHarakat={() => setHarakatVisible(!harakatVisible)}
        user={userProfile}
        onOpenProfileSideSheet={handleOpenProfileSideSheet}
      />

      {/* Mobile Fixed Bottom Navigation (Only 4 items: Home, Exams, Courses, Ustad AI) */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={(tab) => handleNavigateTab(tab)} 
      />

      {/* Profile Side Sheet Drawer */}
      <ProfileSideSheet
        isOpen={isProfileSideSheetOpen}
        onClose={handleCloseProfileSideSheet}
        activeTab={activeTab}
        onSelectTab={(tab) => handleNavigateTab(tab)}
        user={userProfile}
        onToggleTheme={handleToggleDarkMode}
        isDarkMode={darkMode}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {activeTab === 'home' && (
          <HomeView 
            onTabChange={(tab) => handleNavigateTab(tab)} 
          />
        )}

        {activeTab === 'exams' && (
          <ExamsView mcqQuestions={QUESTION_BANK} onOpenLeaderboard={() => handleNavigateTab('leaderboard')} />
        )}

        {activeTab === 'courses' && (
          <CoursesView />
        )}

        {activeTab === 'ustad_ai' && (
          <UstadAiView
            bengaliFont={bengaliFont}
            arabicFont={arabicFont}
            harakatVisible={harakatVisible}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView user={userProfile} examResults={examResults} />
        )}

        {activeTab === 'profile' && (
          <ProfileView 
            user={userProfile} 
            onTabChange={handleNavigateTab} 
            onUpdateProfile={handleUpdateProfile} 
          />
        )}

        {activeTab === 'my_courses' && (
          <CoursesView />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksView user={userProfile} onTabChange={handleNavigateTab} />
        )}

        {activeTab === 'wrong_questions' && (
          <WrongQuestionsView user={userProfile} onTabChange={handleNavigateTab} />
        )}

        {activeTab === 'history' && (
          <DashboardView user={userProfile} examResults={examResults} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView user={userProfile} onTabChange={handleNavigateTab} />
        )}

        {activeTab === 'admin' && (
          <AdminView />
        )}

        {activeTab === 'premium' && (
          <PremiumView />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            user={userProfile} 
            onTabChange={handleNavigateTab}
            selectedCadre={selectedCadre}
            onSelectCadre={setSelectedCadre}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
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

        {activeTab === 'qbank' && (
          <QuestionBankView
            selectedCadre={selectedCadre}
            arabicFont={arabicFont}
            onBookmark={handleBookmarkToggle}
            bookmarkedIds={bookmarkedIds}
          />
        )}

        {activeTab === 'glossary' && (
          <GlossaryView
            arabicFont={arabicFont}
            onBookmark={handleBookmarkToggle}
            bookmarkedIds={bookmarkedIds}
          />
        )}

        {activeTab === 'deployment' && (
          <DeploymentGuideView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Logo variant="horizontal" size="sm" />
            <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                TAMREEN ACADEMY • তামরীন একাডেমি
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                মাদ্রাসা বিষয়ের অনলাইন মডেল টেস্ট ও লার্নিং প্ল্যাটফর্ম
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <button onClick={() => handleNavigateTab('exams')} className="text-emerald-600 dark:text-emerald-400 hover:underline">
              মক টেস্ট
            </button>
            <span>•</span>
            <button onClick={() => handleNavigateTab('courses')} className="text-emerald-600 dark:text-emerald-400 hover:underline">
              কোর্সসমূহ
            </button>
            <span>•</span>
            <button onClick={() => handleNavigateTab('ustad_ai')} className="text-emerald-600 dark:text-emerald-400 hover:underline">
              উস্তাদ AI
            </button>
            <span>•</span>
            <span className="text-slate-400">© ২০২৬ তামরীন একাডেমি</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
