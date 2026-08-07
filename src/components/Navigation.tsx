import React from 'react';
import { Home, FileCheck2, GraduationCap } from 'lucide-react';
import { NavTab } from '../types';
import { UstadAiLogo } from './UstadAiLogo';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  // Mobile bottom bar EXACTLY 4 items with uniform Emerald Neumorphic style
  const navItems = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'exams', label: 'পরীক্ষা দিন', icon: FileCheck2 },
    { id: 'courses', label: 'কোর্স', icon: GraduationCap },
    { id: 'ustad_ai', label: 'তামরীন এআই', icon: null, isSpecial: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-safe">
      <div className="mx-auto max-w-md rounded-3xl bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.03)] px-2.5 py-2 mb-2">
        <div className="grid grid-cols-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as NavTab)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 min-h-[52px] ${
                  isActive
                    ? 'bg-emerald-600 dark:bg-emerald-700 text-white font-extrabold shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(255,255,255,0.2)] scale-[1.02]'
                    : 'bg-slate-200/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-[3px_3px_6px_#cbd5e1,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#020617,-3px_-3px_6px_#1e293b] hover:scale-[1.02]'
                }`}
              >
                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <div className="relative flex items-center justify-center">
                    {item.id === 'ustad_ai' ? (
                      <UstadAiLogo size="sm" />
                    ) : (
                      Icon && <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-xs' : ''}`} />
                    )}
                  </div>
                  <span className={`text-[11px] leading-none transition-all ${isActive ? 'font-black tracking-tight text-white' : 'font-bold'}`}>
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
