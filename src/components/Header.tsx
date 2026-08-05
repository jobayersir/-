import React, { useState } from 'react';
import { PostCadre, NavTab, NotificationItem, UserProfileData } from '../types';
import { Logo } from './Logo';
import { UstadAiLogo } from './UstadAiLogo';
import { 
  Home, 
  FileCheck2, 
  GraduationCap, 
  Bell, 
  Moon, 
  Sun, 
  Type, 
  Check, 
  Crown,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  selectedCadre: PostCadre;
  onSelectCadre: (cadre: PostCadre) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: string;
  onTabChange: (tab: NavTab) => void;
  bengaliFont: string;
  onChangeBengaliFont: (font: string) => void;
  arabicFont: string;
  onChangeArabicFont: (font: string) => void;
  harakatVisible: boolean;
  onToggleHarakat: () => void;
  user: UserProfileData;
  onOpenProfileSideSheet: () => void;
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
  user,
  onOpenProfileSideSheet,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFontSettings, setShowFontSettings] = useState(false);

  // Sample Notifications list
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'আজকের স্পেশাল মক টেস্ট লাইভ',
      description: 'সহকারী শিক্ষক (আরবি) পদের ২৫ নম্বরের ডেইলি মডেল টেস্ট শুরু হয়েছে।',
      timeAgo: '১০ মিনিট আগে',
      isRead: false,
      type: 'exam',
    },
    {
      id: '2',
      title: 'তামরীন AI আপডেট',
      description: 'নাহু ও সরফের কঠিন বাক্য বিশ্লেষণের জন্য নতুন মডেল যুক্ত হয়েছে।',
      timeAgo: '১ ঘণ্টা আগে',
      isRead: false,
      type: 'ai',
    },
    {
      id: '3',
      title: 'কোর্স মডিউল প্রকাশিত',
      description: 'ফিকহুস সুন্নাহ ক্লাসের অধ্যায় ৪ নোট ও এমসিকিউ অনুশীলনী সংযুক্ত হয়েছে।',
      timeAgo: '৩ ঘণ্টা আগে',
      isRead: true,
      type: 'course',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const desktopNavItems = [
    { id: 'home', label: 'Home', labelBn: 'হোম', icon: Home },
    { id: 'exams', label: 'Exams', labelBn: 'পরীক্ষা দিন', icon: FileCheck2 },
    { id: 'courses', label: 'Courses', labelBn: 'কোর্স', icon: GraduationCap },
    { id: 'ustad_ai', label: 'AI Assistant', labelBn: 'তামরীন AI', icon: null, isSpecial: true },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer py-1 group"
            onClick={() => onTabChange('home')}
          >
            <Logo variant="horizontal" size="md" />
            <div className="hidden lg:block border-l border-emerald-200 dark:border-slate-700 pl-3.5 py-0.5">
              <span className="block text-xs font-bold text-emerald-950 dark:text-emerald-200">
                মাদ্রাসা মডেল টেস্ট প্ল্যাটফর্ম
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Madrasa Subject Prep
              </span>
            </div>
          </div>

          {/* Desktop Top Navigation Bar (Logo | Home | পরীক্ষা দিন | কোর্স | উস্তাদ AI) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-100/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#020617,inset_-2px_-2px_4px_#1e293b]">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as NavTab)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 dark:bg-emerald-700 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.2)] scale-[1.02]'
                      : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-[3px_3px_6px_#cbd5e1,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#020617,-3px_-3px_6px_#1e293b] hover:scale-[1.02]'
                  }`}
                >
                  {item.id === 'ustad_ai' ? (
                    <UstadAiLogo size="sm" />
                  ) : (
                    Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`} />
                  )}
                  <span>{item.labelBn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Font & Arabic Harakat Settings Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFontSettings(!showFontSettings);
                  setShowNotifications(false);
                }}
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                title="ফন্ট কনফিগারেশন"
              >
                <Type className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">ফন্ট</span>
              </button>

              {/* Font Settings Dropdown Menu */}
              {showFontSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 text-xs space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">টাইপোগ্রাফি সেটিংস</span>
                    <button 
                      onClick={() => setShowFontSettings(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                    >
                      বন্ধ
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-[11px] mb-1 font-medium">বাংলা ফন্ট</label>
                    <select
                      value={bengaliFont}
                      onChange={(e) => onChangeBengaliFont(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                    >
                      <option value="Hind Siliguri">হিন্দ শিলিগুড়ি (Sans)</option>
                      <option value="Noto Serif Bengali">নোটো শরিফ (Serif)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-[11px] mb-1 font-medium">আরবি ফন্ট (Arabic)</label>
                    <select
                      value={arabicFont}
                      onChange={(e) => onChangeArabicFont(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none font-arabic"
                    >
                      <option value="Amiri">الأميري (Amiri)</option>
                      <option value="Noto Naskh Arabic">নাসখ (Noto Naskh)</option>
                      <option value="Scheherazade New">شهرزاد (Scheherazade)</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">হরকত (حركات) প্রদর্শন</span>
                    <button
                      onClick={onToggleHarakat}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
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

            {/* Notifications Icon Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowFontSettings(false);
                }}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors relative"
                title="নোটিফিকেশন"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">নোটিফিকেশন</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          {unreadCount} নতুন
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                      >
                        পড়া হয়েছে চিহ্নিত করুন
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-80 overflow-y-auto my-2 space-y-1">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl transition-colors ${
                          item.isRead
                            ? 'bg-transparent'
                            : 'bg-emerald-50/50 dark:bg-emerald-950/30'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                            {item.timeAgo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-500 font-medium hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="থিম পরিবর্তন করুন"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Profile Avatar Button (Tapping opens Profile Side Sheet) */}
            <button
              onClick={onOpenProfileSideSheet}
              className="flex items-center space-x-2 pl-1 sm:pl-2 group focus:outline-none"
              title="প্রোফাইল মেনু খুলুন"
              aria-label="Open Profile Menu"
            >
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-bold text-sm text-emerald-300">
                    {user.name.charAt(0)}
                  </div>
                </div>
                {user.isPremium && (
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-amber-500 text-slate-950 rounded-full shadow-xs">
                    <Crown className="w-2.5 h-2.5 stroke-[2.5]" />
                  </span>
                )}
              </div>

              <div className="hidden xl:flex flex-col items-start text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                  {user.name}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                  <span>সহকারী শিক্ষক</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
