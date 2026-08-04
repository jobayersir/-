import React from 'react';
import { Home, FileCheck2, GraduationCap, Bot } from 'lucide-react';
import { NavTab } from '../types';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  // Mobile bottom bar EXACTLY 4 items: Home, Exams, Courses, Ustad AI
  const navItems = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'exams', label: 'পরীক্ষা দিন', icon: FileCheck2 },
    { id: 'courses', label: 'কোর্স', icon: GraduationCap },
    { id: 'ustad_ai', label: 'উস্তাদ AI', icon: Bot, isSpecial: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-safe">
      <div className="mx-auto max-w-md rounded-t-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-x border-slate-200/80 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-2 py-2">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as NavTab)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 min-h-[48px] ${
                  isActive
                    ? 'text-emerald-900 dark:text-emerald-300 font-bold scale-[1.03]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {/* Active Pill Indicator Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-emerald-100/80 dark:bg-emerald-950/80 rounded-2xl border border-emerald-300/50 dark:border-emerald-700/50 shadow-sm transition-all" />
                )}

                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-emerald-700 dark:text-emerald-300' : ''}`} />
                    {item.isSpecial && (
                      <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}
                  </div>

                  <span className={`text-[11px] leading-none transition-all ${isActive ? 'font-bold text-emerald-950 dark:text-emerald-200' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
