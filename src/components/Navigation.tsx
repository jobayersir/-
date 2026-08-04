import React from 'react';
import { Home, CheckSquare, Edit3, BookOpen, Bot, BookMarked, Rocket, HelpCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'হোম', icon: Home, badge: '' },
    { id: 'mcq', label: 'এমসিকিউ', icon: CheckSquare, badge: 'MCQ' },
    { id: 'cq', label: 'সিকিউ/লিখিত', icon: Edit3, badge: 'CQ' },
    { id: 'question_bank', label: 'প্রশ্ন ব্যাংক', icon: BookOpen, badge: 'Past Papers' },
    { id: 'ustad_ai', label: 'উস্তাদ এআই', icon: Bot, badge: 'AI' },
    { id: 'glossary', label: 'পরিভাষা', icon: BookMarked, badge: 'Glossary' },
    { id: 'deployment', label: 'ডিপ্লয়মেন্ট গাইড', icon: Rocket, badge: 'New' },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
