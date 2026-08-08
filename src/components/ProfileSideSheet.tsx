import React from 'react';
import { NavTab, UserProfileData } from '../types';
import { Logo } from './Logo';
import { 
  X, 
  User, 
  LayoutDashboard, 
  BookOpen, 
  Bookmark, 
  AlertTriangle, 
  History, 
  Trophy, 
  Crown, 
  Settings, 
  LogOut,
  ChevronRight,
  Flame,
  Sparkles,
  ShieldCheck,
  Target
} from 'lucide-react';

interface ProfileSideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfileData;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export const ProfileSideSheet: React.FC<ProfileSideSheetProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  user,
  onToggleTheme,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'profile', label: 'My Profile', labelBn: 'আমার প্রোফাইল', icon: User, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { id: 'dashboard', label: 'Dashboard', labelBn: 'পারফরম্যান্স ড্যাশবোর্ড', icon: LayoutDashboard, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/50' },
    { id: 'my_courses', label: 'My Courses', labelBn: 'আমার কোর্সসমূহ', icon: BookOpen, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
    { id: 'bookmarks', label: 'Bookmarks', labelBn: 'বুকমার্ককৃত প্রশ্ন', icon: Bookmark, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
    { id: 'wrong_questions', label: 'Wrong Questions', labelBn: 'ভুল উত্তরের ব্যাংক', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
    { id: 'history', label: 'Exam History', labelBn: 'পরীক্ষার আর্কাইভ', icon: History, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' },
    { id: 'leaderboard', label: 'Leaderboard', labelBn: 'মেধা তালিকা', icon: Trophy, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
    { id: 'premium', label: 'Premium', labelBn: 'প্রিমিয়াম মেম্বারশিপ', icon: Crown, color: 'text-emerald-500 bg-amber-100/60 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
    { id: 'settings', label: 'Settings', labelBn: 'সেটিংস ও পছন্দ', icon: Settings, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
  ];

  const handleItemClick = (tabId: string) => {
    onSelectTab(tabId as NavTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Side Sheet Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/80 dark:border-slate-800 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out">
          
          {/* Header Bar */}
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Logo variant="horizontal" size="sm" />
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Summary Card */}
            <div className="p-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-md">
                      <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-bold text-lg text-emerald-300 overflow-hidden">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                    </div>
                    {user.isPremium && (
                      <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow" title="Premium Student">
                        <Crown className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-white truncate">
                      {user.name}
                    </h3>
                    <p className="text-xs text-emerald-200/80 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-800/80 text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="w-2.5 h-2.5 mr-1 text-emerald-400" />
                        সহকারী শিক্ষক (আরবি)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Strip inside profile header */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                  <div className="bg-white/5 rounded-xl p-2 backdrop-blur-sm">
                    <span className="text-[10px] text-slate-300 block">স্ট্রিক</span>
                    <span className="font-bold text-amber-300 text-sm flex items-center justify-center space-x-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                      <span>{user.streakDays} দিন</span>
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 backdrop-blur-sm">
                    <span className="text-[10px] text-slate-300 block">সমাধান</span>
                    <span className="font-bold text-emerald-300 text-sm">
                      {user.totalSolvedQuestions}টি
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 backdrop-blur-sm">
                    <span className="text-[10px] text-slate-300 block">লক্ষ্য</span>
                    <span className="font-bold text-teal-300 text-sm">
                      {user.targetYear}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu List */}
            <div className="p-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group text-left ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800/60'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${item.color} shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {item.labelBn}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <button
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <span>থিম মোড ({isDarkMode ? 'ডার্ক মোড' : 'লাইট মোড'})</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">পরিবর্তন করুন</span>
            </button>

            <button
              onClick={() => {
                alert('লগআউট করা হয়েছে।');
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border border-rose-200/60 dark:border-rose-900/40"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
