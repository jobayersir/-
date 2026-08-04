import React from 'react';
import { Home, FileCheck2, GraduationCap } from 'lucide-react';
import { NavTab } from '../types';
import { UstadAiLogo } from './UstadAiLogo';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  // Mobile bottom bar EXACTLY 4 items with distinct vibrant active colors
  const navItems = [
    { 
      id: 'home', 
      label: 'হোম', 
      icon: Home,
      activeStyle: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50',
      activeText: 'text-emerald-600 dark:text-emerald-400 font-bold',
    },
    { 
      id: 'exams', 
      label: 'পরীক্ষা দিন', 
      icon: FileCheck2,
      activeStyle: 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50',
      activeText: 'text-blue-600 dark:text-blue-400 font-bold',
    },
    { 
      id: 'courses', 
      label: 'কোর্স', 
      icon: GraduationCap,
      activeStyle: 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/50',
      activeText: 'text-purple-600 dark:text-purple-400 font-bold',
    },
    { 
      id: 'ustad_ai', 
      label: 'উস্তাদ AI', 
      icon: null,
      isSpecial: true,
      activeStyle: 'bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-600 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/60',
      activeText: 'text-amber-600 dark:text-amber-400 font-bold',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-safe">
      <div className="mx-auto max-w-md rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] px-2 py-2 mb-2">
        <div className="grid grid-cols-4 gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as NavTab)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 min-h-[52px] ${
                  isActive
                    ? `${item.activeStyle} scale-[1.05]`
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <div className="relative flex items-center justify-center">
                    {item.id === 'ustad_ai' ? (
                      <UstadAiLogo size="sm" />
                    ) : (
                      Icon && <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-xs' : ''}`} />
                    )}
                    {item.isSpecial && !isActive && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                      </span>
                    )}
                  </div>

                  <span className={`text-[11px] leading-none transition-all ${isActive ? 'font-black tracking-tight text-white' : 'font-semibold'}`}>
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
