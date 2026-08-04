import React from 'react';
import { PostCadre } from '../types';
import { Logo } from './Logo';
import { BookOpen, Sparkles, Moon, Sun, Type, SlidersHorizontal, Layers, Target } from 'lucide-react';

interface HeaderProps {
  selectedCadre: PostCadre;
  onSelectCadre: (cadre: PostCadre) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  bengaliFont: string;
  onChangeBengaliFont: (font: string) => void;
  arabicFont: string;
  onChangeArabicFont: (font: string) => void;
  harakatVisible: boolean;
  onToggleHarakat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCadre,
  onSelectCadre,
  darkMode,
  onToggleDarkMode,
  activeTab,
  onTabChange,
  bengaliFont,
  onChangeBengaliFont,
  arabicFont,
  onChangeArabicFont,
  harakatVisible,
  onToggleHarakat,
}) => {
  const [showFontMenu, setShowFontMenu] = React.useState(false);

  const cadreNames: Record<PostCadre, string> = {
    all: 'সকল পদ (All Cadres)',
    assistant_teacher_arabic: 'সহকারী শিক্ষক (আরবি)',
    lecturer_arabic: 'প্রভাষক (আরবি/হাদিস/ফিকহ)',
    assistant_maulvi: 'সহকারী মৌলভী',
    ebtedayee_head: 'ইবতেদায়ী প্রধান ও ক্বারী',
    lecturer_islamic_history: 'প্রভাষক (ইসলামী ইতিহাস)',
    general_subject: 'সাধারণ বিষয় (বাংলা, ইংরেজি, গণিত)',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer py-1" onClick={() => onTabChange('home')}>
            <Logo variant="horizontal" size="md" />
            <div className="hidden xl:block border-l border-emerald-200 dark:border-slate-700 pl-3.5 py-0.5">
              <span className="block text-xs font-bold text-emerald-900 dark:text-emerald-200">
                মাদ্রাসা শিক্ষক নিবন্ধন
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                NTRCA Madrasa Prep
              </span>
            </div>
          </div>

          {/* Controls Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Cadre Selector Dropdown */}
            <div className="hidden md:flex items-center bg-emerald-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-slate-700 text-xs">
              <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-2" />
              <select
                value={selectedCadre}
                onChange={(e) => onSelectCadre(e.target.value as PostCadre)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
              >
                {Object.entries(cadreNames).map(([key, name]) => (
                  <option key={key} value={key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font & Display Options Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-all"
                title="ফন্ট ও প্রদর্শন সেটআপ"
              >
                <Type className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline font-bold">ফন্ট</span>
                <span className="hidden sm:inline font-arabic text-sm">/ خط</span>
              </button>

              {showFontMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3.5 z-50 text-xs space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* Bangla Font Selector */}
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1.5 mb-2">
                      বাংলা ফন্ট (Bangla Font)
                    </div>
                    <div className="space-y-1">
                      {[
                        { name: 'Noto Serif Bengali', label: 'নোটো শরিফ (Serif)' },
                        { name: 'Hind Siliguri', label: 'হিন্দ শিলিগুড়ি (Sans)' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            onChangeBengaliFont(item.name);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm flex items-center justify-between transition-colors ${
                            bengaliFont === item.name
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{item.label}</span>
                          {bengaliFont === item.name && (
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">সক্রিয়</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Arabic Font Selector */}
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-1.5 mb-2">
                      আরবি ফন্ট (Arabic Font)
                    </div>
                    <div className="space-y-1">
                      {[
                        { name: 'Amiri', label: 'الأميري (Amiri)' },
                        { name: 'Noto Naskh Arabic', label: 'নাসখ (Noto Naskh)' },
                        { name: 'Scheherazade New', label: 'شهرزاد (Scheherazade)' },
                      ].map((font) => (
                        <button
                          key={font.name}
                          onClick={() => {
                            onChangeArabicFont(font.name);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md font-arabic text-base flex items-center justify-between transition-colors ${
                            arabicFont === font.name
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{font.label}</span>
                          {arabicFont === font.name && (
                            <span className="text-xs font-sans bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">সক্রিয়</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Harakat Toggle */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">হরকত (حركات) প্রদর্শন</span>
                    <button
                      onClick={onToggleHarakat}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        harakatVisible
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {harakatVisible ? 'চালু' : 'বন্ধ'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Ustad AI Quick Button */}
            <button
              onClick={() => onTabChange('ustad_ai')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-600/30 text-xs font-medium transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>উস্তাদ এআই</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="থিম পরিবর্তন করুন"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Cadre Selector Bar */}
        <div className="md:hidden py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center">
            <Target className="w-3.5 h-3.5 mr-1 text-emerald-600" /> পদ:
          </span>
          <select
            value={selectedCadre}
            onChange={(e) => onSelectCadre(e.target.value as PostCadre)}
            className="bg-emerald-50 dark:bg-slate-800 text-emerald-900 dark:text-emerald-200 font-medium py-1 px-2.5 rounded-md border border-emerald-200/80 dark:border-slate-700 focus:outline-none"
          >
            {Object.entries(cadreNames).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
