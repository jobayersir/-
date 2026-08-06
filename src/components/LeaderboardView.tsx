import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Clock, 
  Award, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  ArrowUp,
  Medal,
  Calendar,
  ChevronRight,
  UserCheck,
  Target,
  TrendingUp,
  BarChart2,
  Users,
  Timer
} from 'lucide-react';
import { UserProfileData, NavTab } from '../types';

interface LeaderboardViewProps {
  user?: UserProfileData;
  onTabChange?: (tab: NavTab) => void;
  onBackToExam?: () => void;
  examTitle?: string;
  isPremiumExam?: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string;
  cadre: string;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  timeSpentMinutes: number;
  avgTimePerQuestionSec?: number;
  totalExamsTaken?: number;
  streakDays: number;
  location: string;
  isCurrentUser?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ 
  user, 
  onTabChange,
  onBackToExam,
  examTitle,
  isPremiumExam = false
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'thisExam' | 'weekly' | 'monthly' | 'allTime'>('thisExam');
  const [leaderboardType, setLeaderboardType] = useState<'free' | 'premium'>(isPremiumExam ? 'premium' : 'free');

  // Keep leaderboardType in sync if isPremiumExam prop changes
  React.useEffect(() => {
    if (isPremiumExam !== undefined) {
      setLeaderboardType(isPremiumExam ? 'premium' : 'free');
    }
  }, [isPremiumExam]);

  // Top 3 Podium Mock Data for Tamreen Academy
  const topWinners: Record<string, LeaderboardUser[]> = {
    thisExam: [
      {
        rank: 1,
        name: 'মাওলানা হাফেজ আব্দুল মালেক',
        cadre: 'প্রভাষক (আরবি)',
        score: 98,
        maxScore: 100,
        accuracyPercentage: 98,
        timeSpentMinutes: 38,
        avgTimePerQuestionSec: 22,
        totalExamsTaken: 28,
        streakDays: 24,
        location: 'ঢাকা'
      },
      {
        rank: 2,
        name: 'মুফতি তানভীর আহমেদ',
        cadre: 'সহকারী শিক্ষক (আরবি)',
        score: 95,
        maxScore: 100,
        accuracyPercentage: 95,
        timeSpentMinutes: 41,
        avgTimePerQuestionSec: 24,
        totalExamsTaken: 25,
        streakDays: 18,
        location: 'চট্টগ্রাম'
      },
      {
        rank: 3,
        name: 'কারি মোশতাক মাহমুদ',
        cadre: 'সহকারী মৌলভী',
        score: 92,
        maxScore: 100,
        accuracyPercentage: 92,
        timeSpentMinutes: 44,
        avgTimePerQuestionSec: 26,
        totalExamsTaken: 22,
        streakDays: 15,
        location: 'সিলেট'
      }
    ],
    weekly: [
      {
        rank: 1,
        name: 'মুফতি তানভীর আহমেদ',
        cadre: 'সহকারী শিক্ষক (আরবি)',
        score: 485,
        maxScore: 500,
        accuracyPercentage: 97,
        timeSpentMinutes: 210,
        avgTimePerQuestionSec: 23,
        totalExamsTaken: 14,
        streakDays: 30,
        location: 'চট্টগ্রাম'
      },
      {
        rank: 2,
        name: 'মাওলানা হাফেজ আব্দুল মালেক',
        cadre: 'প্রভাষক (আরবি)',
        score: 478,
        maxScore: 500,
        accuracyPercentage: 95,
        timeSpentMinutes: 205,
        avgTimePerQuestionSec: 24,
        totalExamsTaken: 12,
        streakDays: 24,
        location: 'ঢাকা'
      },
      {
        rank: 3,
        name: 'হাফেজ ওবায়দুল ইসলাম',
        cadre: 'ইবতেদায়ী প্রধান',
        score: 462,
        maxScore: 500,
        accuracyPercentage: 92,
        timeSpentMinutes: 225,
        avgTimePerQuestionSec: 27,
        totalExamsTaken: 11,
        streakDays: 19,
        location: 'রাজশাহী'
      }
    ],
    monthly: [
      {
        rank: 1,
        name: 'মাওলানা হাফেজ আব্দুল মালেক',
        cadre: 'প্রভাষক (আরবি)',
        score: 1920,
        maxScore: 2000,
        accuracyPercentage: 96,
        timeSpentMinutes: 840,
        avgTimePerQuestionSec: 23,
        totalExamsTaken: 45,
        streakDays: 45,
        location: 'ঢাকা'
      },
      {
        rank: 2,
        name: 'কারি মোশতাক মাহমুদ',
        cadre: 'সহকারী মৌলভী',
        score: 1880,
        maxScore: 2000,
        accuracyPercentage: 94,
        timeSpentMinutes: 890,
        avgTimePerQuestionSec: 25,
        totalExamsTaken: 42,
        streakDays: 38,
        location: 'সিলেট'
      },
      {
        rank: 3,
        name: 'মুফতি তানভীর আহমেদ',
        cadre: 'সহকারী শিক্ষক (আরবি)',
        score: 1845,
        maxScore: 2000,
        accuracyPercentage: 92,
        timeSpentMinutes: 860,
        avgTimePerQuestionSec: 26,
        totalExamsTaken: 40,
        streakDays: 30,
        location: 'চট্টগ্রাম'
      }
    ],
    allTime: [
      {
        rank: 1,
        name: 'মাওলানা হাফেজ আব্দুল মালেক',
        cadre: 'প্রভাষক (আরবি)',
        score: 5420,
        maxScore: 5600,
        accuracyPercentage: 97,
        timeSpentMinutes: 2400,
        avgTimePerQuestionSec: 22,
        totalExamsTaken: 120,
        streakDays: 120,
        location: 'ঢাকা'
      },
      {
        rank: 2,
        name: 'মুফতি তানভীর আহমেদ',
        cadre: 'সহকারী শিক্ষক (আরবি)',
        score: 5180,
        maxScore: 5600,
        accuracyPercentage: 95,
        timeSpentMinutes: 2510,
        avgTimePerQuestionSec: 24,
        totalExamsTaken: 110,
        streakDays: 95,
        location: 'চট্টগ্রাম'
      },
      {
        rank: 3,
        name: 'কারি মোশতাক মাহমুদ',
        cadre: 'সহকারী মৌলভী',
        score: 4950,
        maxScore: 5600,
        accuracyPercentage: 93,
        timeSpentMinutes: 2480,
        avgTimePerQuestionSec: 25,
        totalExamsTaken: 105,
        streakDays: 88,
        location: 'সিলেট'
      }
    ]
  };

  // Current User Card Info
  const currentUser: LeaderboardUser = {
    rank: 15,
    name: user?.name || 'মাওলানা মোঃ আব্দুল্লাহ (আপনি)',
    cadre: 'সহকারী শিক্ষক (আরবি)',
    score: 84,
    maxScore: 100,
    accuracyPercentage: 84,
    timeSpentMinutes: 52,
    avgTimePerQuestionSec: 31,
    totalExamsTaken: 16,
    streakDays: user?.streakDays || 14,
    location: 'ময়মনসিংহ',
    isCurrentUser: true
  };

  // List of other ranked users (4th to 12th)
  const remainingUsers: LeaderboardUser[] = [
    { rank: 4, name: 'হাফেজ মাওলানা সিফাত উল্লাহ', cadre: 'লেকচারার ফিকহ', score: 90, maxScore: 100, accuracyPercentage: 90, timeSpentMinutes: 45, avgTimePerQuestionSec: 27, totalExamsTaken: 20, streakDays: 12, location: 'কুমিল্লা' },
    { rank: 5, name: 'মাওলানা উবায়দুল ইসলাম', cadre: 'সহকারী মৌলভী', score: 89, maxScore: 100, accuracyPercentage: 89, timeSpentMinutes: 46, avgTimePerQuestionSec: 28, totalExamsTaken: 19, streakDays: 14, location: 'রাজশাহী' },
    { rank: 6, name: 'মুফতি আব্দুর রশীদ', cadre: 'প্রভাষক (আরবি)', score: 88, maxScore: 100, accuracyPercentage: 88, timeSpentMinutes: 48, avgTimePerQuestionSec: 29, totalExamsTaken: 18, streakDays: 11, location: 'রংপুর' },
    { rank: 7, name: 'কারী কামরুল হাসান', cadre: 'ইবতেদায়ী প্রধান', score: 87, maxScore: 100, accuracyPercentage: 87, timeSpentMinutes: 49, avgTimePerQuestionSec: 29, totalExamsTaken: 17, streakDays: 10, location: 'বরিশাল' },
    { rank: 8, name: 'হাফেজ তরিকুল ইসলাম', cadre: 'সহকারী শিক্ষক (আরবি)', score: 86, maxScore: 100, accuracyPercentage: 86, timeSpentMinutes: 50, avgTimePerQuestionSec: 30, totalExamsTaken: 16, streakDays: 9, location: 'খুলনা' },
    { rank: 9, name: 'মাওলানা মাহমুদুল হাসান', cadre: 'সহকারী মৌলভী', score: 85, maxScore: 100, accuracyPercentage: 85, timeSpentMinutes: 51, avgTimePerQuestionSec: 30, totalExamsTaken: 15, streakDays: 8, location: 'গাজীপুর' },
    { rank: 10, name: 'মুফতি শফিকুল ইসলাম', cadre: 'প্রভাষক হাদিস', score: 85, maxScore: 100, accuracyPercentage: 85, timeSpentMinutes: 51, avgTimePerQuestionSec: 31, totalExamsTaken: 15, streakDays: 15, location: 'ময়মনসিংহ' },
    { rank: 11, name: 'হাফেজ জহিরুল ইসলাম', cadre: 'সহকারী শিক্ষক', score: 84, maxScore: 100, accuracyPercentage: 84, timeSpentMinutes: 53, avgTimePerQuestionSec: 32, totalExamsTaken: 14, streakDays: 7, location: 'বগুড়া' },
    { rank: 12, name: 'কারি নোমান আহমেদ', cadre: 'ইবতেদায়ী কারী', score: 83, maxScore: 100, accuracyPercentage: 83, timeSpentMinutes: 54, avgTimePerQuestionSec: 33, totalExamsTaken: 13, streakDays: 6, location: 'নোয়াখালী' },
  ];

  const currentPodium = topWinners[filterPeriod] || topWinners.thisExam;

  // Helper for Rank Badge Styling
  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-2xs border border-amber-200">
          <Crown className="w-3 h-3 text-slate-950 fill-slate-950" />
          <span>🥇 ১ম স্থান • চ্যাম্পিয়ন</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-black text-[10px] shadow-2xs border border-slate-300 dark:border-slate-600">
          <Medal className="w-3 h-3 text-slate-600 dark:text-slate-300" />
          <span>🥈 ২য় স্থান • রানার-আপ</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-800 text-amber-100 font-black text-[10px] shadow-2xs border border-amber-600">
          <Award className="w-3 h-3 text-amber-300" />
          <span>🥉 ৩য় স্থান • ব্রোঞ্জ মেডেল</span>
        </span>
      );
    }
    if (rank <= 5) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300 dark:border-emerald-800">
          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>🏅 টপ ৫ স্টার</span>
        </span>
      );
    }
    if (rank <= 10) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 font-bold text-[10px] border border-teal-300 dark:border-teal-800">
          <Zap className="w-3 h-3 text-teal-600 dark:text-teal-400" />
          <span>🌟 টপ ১০ পারফরমার</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-[10px]">
        <span>⭐ টপ ১৫%</span>
      </span>
    );
  };

  // Visual Accuracy Progress Bar Helper Component
  const AccuracyProgressBar: React.FC<{ accuracy: number; showLabel?: boolean; compact?: boolean }> = ({ 
    accuracy, 
    showLabel = true,
    compact = false
  }) => {
    return (
      <div className="w-full space-y-1">
        {showLabel && (
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500 dark:text-slate-400">এক্যুরেসি (Accuracy):</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">{accuracy}%</span>
          </div>
        )}
        <div className={`w-full ${compact ? 'h-1.5' : 'h-2'} rounded-full bg-slate-200 dark:bg-slate-700/80 overflow-hidden p-0.5 shadow-inner`}>
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500 shadow-xs"
            style={{ width: `${Math.min(100, Math.max(0, accuracy))}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* ========================================================= */}
      {/* HEADER BANNER                                             */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-800/60">
        <div className="absolute -right-12 -bottom-12 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-sm">
              <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                {leaderboardType === 'premium' 
                  ? 'প্রিমিয়াম পরীক্ষায় অংশগ্রহণকারীদের মেধা তালিকা' 
                  : 'ফ্রি পরীক্ষায় অংশগ্রহণকারীদের মেধা তালিকা'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              অল-বাংলাদেশ মেধা তালিকা <span className="text-amber-400 font-arabic font-extrabold text-xl">(قائمة المتفوقين)</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              {examTitle ? `বিষয়: ${examTitle}` : 'বিষয়ভিত্তিক ও মডেল টেস্ট পরীক্ষার সেরা পরীক্ষার্থীদের তালিকা'}
            </p>
          </div>

          {onBackToExam && (
            <button
              onClick={onBackToExam}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all active:scale-95 shrink-0"
            >
              পরীক্ষায় ফিরে যান
            </button>
          )}
        </div>

        {/* Free vs Premium Leaderboard Switcher */}
        {isPremiumExam === undefined ? (
          <div className="relative z-10 flex items-center justify-center gap-2 mt-5 p-1 bg-black/20 rounded-2xl border border-white/10">
            <button
              onClick={() => setLeaderboardType('free')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                leaderboardType === 'free'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              ফ্রি মেধা তালিকা
            </button>
            <button
              onClick={() => setLeaderboardType('premium')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                leaderboardType === 'premium'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              প্রিমিয়াম মেধা তালিকা
            </button>
          </div>
        ) : (
          <div className="relative z-10 flex items-center justify-center mt-4">
            <div className={`px-4 py-2 rounded-xl text-xs font-black text-slate-950 shadow-md flex items-center space-x-1.5 ${
              isPremiumExam ? 'bg-amber-400' : 'bg-emerald-400'
            }`}>
              <Trophy className="w-4 h-4" />
              <span>{isPremiumExam ? 'প্রিমিয়াম মেধা তালিকা (Premium Leaderboard)' : 'ফ্রি মেধা তালিকা (Free Leaderboard)'}</span>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="relative z-10 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-4 p-1.5 bg-emerald-900/60 backdrop-blur-md rounded-2xl border border-emerald-700/50 w-full overflow-x-auto">
          {[
            { id: 'thisExam', label: 'এই পরীক্ষা' },
            { id: 'weekly', label: 'এই সপ্তাহে' },
            { id: 'monthly', label: 'এই মাসে' },
            { id: 'allTime', label: 'সর্বকালের' }
          ].map((tab) => {
            const isActive = filterPeriod === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterPeriod(tab.id as any)}
                className={`flex-1 min-w-[70px] sm:min-w-[90px] py-2 rounded-xl text-xs font-extrabold transition-all text-center ${
                  isActive 
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105' 
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TOP PERFORMERS ANALYTICS CARD                              */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-800/50 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <BarChart2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg text-white">
                সেরা পরীক্ষার্থীদের বিস্তারিত এনালাইটিক্স (Top Performers Analytics)
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-200/80 font-medium">
                জাতীয় মেধা তালিকায় শীর্ষ ১০ জন পরীক্ষার্থীর গড় পরিসংখ্যান
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 bg-emerald-800/60 text-emerald-200 text-xs font-bold rounded-full border border-emerald-700/50">
            লাইভ ইনসাইটস
          </span>
        </div>

        {/* 4-Stat Grid Analytics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-center space-x-1 text-emerald-400 text-[10px] font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>গড় স্কোর</span>
            </div>
            <strong className="text-lg sm:text-xl font-black text-amber-300 block">৯৪.৫%</strong>
            <span className="text-[9px] text-slate-400 block font-medium">শীর্ষ ১০ পরীক্ষার্থী</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-center space-x-1 text-emerald-400 text-[10px] font-bold">
              <Timer className="w-3.5 h-3.5" />
              <span>প্রশ্নপ্রতি গড় সময়</span>
            </div>
            <strong className="text-lg sm:text-xl font-black text-white block">২৪ সে.</strong>
            <span className="text-[9px] text-slate-400 block font-medium">দ্রুততম উত্তর রেকর্ড</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-center space-x-1 text-emerald-400 text-[10px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>সামগ্রিক এক্যুরেসি</span>
            </div>
            <strong className="text-lg sm:text-xl font-black text-emerald-300 block">৯৫.২%</strong>
            <span className="text-[9px] text-slate-400 block font-medium">সঠিক উত্তরের হার</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-center space-x-1 text-emerald-400 text-[10px] font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>অংশগ্রহণকারী</span>
            </div>
            <strong className="text-lg sm:text-xl font-black text-amber-300 block">৪,৮৫০+</strong>
            <span className="text-[9px] text-slate-400 block font-medium">সক্রিয় শিক্ষক প্রার্থী</span>
          </div>
        </div>

        {/* Top Performer Overall Progress Gauge Bar */}
        <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-emerald-200 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>শীর্ষস্থান অর্জনকারীদের গড় এক্যুরেসি থ্রেশহোল্ড:</span>
            </span>
            <span className="text-amber-300 font-black">৯৫.২%</span>
          </div>
          <AccuracyProgressBar accuracy={95.2} showLabel={false} />
        </div>
      </div>

      {/* ========================================================= */}
      {/* TOP 3 WINNERS PODIUM DESIGN                               */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 text-center flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>শীর্ষ ৩ বিজয়ী (Top Performers Podium)</span>
        </h2>

        {/* Podium Layout */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-6 pb-2 max-w-2xl mx-auto">
          
          {/* 🥈 SILVER - Rank 2 (Left) */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-400 p-1 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-slate-200 font-extrabold text-lg sm:text-xl">
                  {currentPodium[1]?.name.charAt(0) || '2'}
                </div>
              </div>
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md border border-white">
                🥈
              </span>
            </div>
            
            <div className="text-center space-y-0.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 block line-clamp-1">
                {currentPodium[1]?.name}
              </span>
              <div className="my-1">{renderRankBadge(2)}</div>
              <span className="text-[10px] text-slate-500 font-semibold block">{currentPodium[1]?.location}</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                {currentPodium[1]?.score} পয়েন্ট
              </span>
              {currentPodium[1]?.avgTimePerQuestionSec && (
                <span className="text-[9px] font-bold text-slate-500 block">
                  ⚡ {currentPodium[1]?.avgTimePerQuestionSec} সে./প্রশ্ন
                </span>
              )}
            </div>

            <div className="w-full px-1">
              <AccuracyProgressBar accuracy={currentPodium[1]?.accuracyPercentage || 95} compact />
            </div>

            <div className="w-full mt-1 h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700/80 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-2 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-slate-600 dark:text-slate-300">২</span>
              <span className="text-[10px] font-bold text-slate-500">রানার-আপ</span>
            </div>
          </div>

          {/* 🥇 GOLD - Rank 1 (Center - Tallest) */}
          <div className="flex flex-col items-center -mt-6 space-y-2">
            <div className="relative">
              <div className="absolute -top-6 inset-x-0 mx-auto flex justify-center animate-bounce">
                <Crown className="w-7 h-7 text-amber-400 drop-shadow-md" />
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1.5 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-amber-300 font-black text-xl sm:text-2xl">
                  {currentPodium[0]?.name.charAt(0) || '1'}
                </div>
              </div>
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg border-2 border-white">
                🥇
              </span>
            </div>

            <div className="text-center space-y-0.5">
              <span className="text-xs sm:text-base font-black text-slate-950 dark:text-slate-100 block line-clamp-1">
                {currentPodium[0]?.name}
              </span>
              <div className="my-1">{renderRankBadge(1)}</div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">{currentPodium[0]?.cadre}</span>
              <span className="text-sm font-black text-amber-500 block">
                {currentPodium[0]?.score} পয়েন্ট
              </span>
              {currentPodium[0]?.avgTimePerQuestionSec && (
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 block">
                  ⚡ {currentPodium[0]?.avgTimePerQuestionSec} সে./প্রশ্ন
                </span>
              )}
            </div>

            <div className="w-full px-1">
              <AccuracyProgressBar accuracy={currentPodium[0]?.accuracyPercentage || 98} compact />
            </div>

            <div className="w-full mt-1 h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-500/30 via-amber-400/20 to-amber-300/10 dark:from-amber-900/40 dark:to-slate-800 border-2 border-amber-400/50 flex flex-col items-center justify-center p-2 shadow-lg">
              <span className="text-2xl sm:text-3xl font-black text-amber-500">১</span>
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">জাতীয় চ্যাম্পিয়ন</span>
            </div>
          </div>

          {/* 🥉 BRONZE - Rank 3 (Right) */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-800 p-1 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-amber-200 font-extrabold text-lg sm:text-xl">
                  {currentPodium[2]?.name.charAt(0) || '3'}
                </div>
              </div>
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-md border border-white">
                🥉
              </span>
            </div>

            <div className="text-center space-y-0.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 block line-clamp-1">
                {currentPodium[2]?.name}
              </span>
              <div className="my-1">{renderRankBadge(3)}</div>
              <span className="text-[10px] text-slate-500 font-semibold block">{currentPodium[2]?.location}</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                {currentPodium[2]?.score} পয়েন্ট
              </span>
              {currentPodium[2]?.avgTimePerQuestionSec && (
                <span className="text-[9px] font-bold text-slate-500 block">
                  ⚡ {currentPodium[2]?.avgTimePerQuestionSec} সে./প্রশ্ন
                </span>
              )}
            </div>

            <div className="w-full px-1">
              <AccuracyProgressBar accuracy={currentPodium[2]?.accuracyPercentage || 92} compact />
            </div>

            <div className="w-full mt-1 h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-amber-900/20 to-slate-100 dark:from-slate-800 dark:to-slate-700/80 border border-amber-800/30 flex flex-col items-center justify-center p-2 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400">৩</span>
              <span className="text-[10px] font-bold text-slate-500">৩য় স্থান</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* CURRENT USER HIGHLIGHTED CARD (My Rank with Green Glow)   */}
      {/* ========================================================= */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-emerald-500/15 to-teal-500/10 dark:from-emerald-950/90 dark:to-teal-950/90 border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] backdrop-blur-md transition-all space-y-3">
        
        <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2.5">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              আপনার অবস্থান (MY RANK PERFORMANCE)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {renderRankBadge(currentUser.rank)}
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-sm">
              জাতীয় অবস্থান: #{currentUser.rank}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-emerald-300 shrink-0">
              #{currentUser.rank}
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-950 dark:text-slate-100 flex items-center space-x-2">
                <span>{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                  আপনি
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {currentUser.cadre} • {currentUser.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-emerald-500/20 pt-2 sm:pt-0">
            <div className="text-center px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-slate-400 block font-semibold">প্রাপ্ত নম্বর</span>
              <strong className="text-emerald-700 dark:text-emerald-300 text-sm font-black">{currentUser.score}/{currentUser.maxScore}</strong>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-slate-400 block font-semibold">প্রশ্নপ্রতি সময়</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm font-black">{currentUser.avgTimePerQuestionSec || 31} সে.</strong>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-slate-400 block font-semibold">স্ট্রিক</span>
              <strong className="text-amber-500 text-sm font-black">{currentUser.streakDays} দিন 🔥</strong>
            </div>
          </div>
        </div>

        {/* Current User Accuracy Bar */}
        <div className="pt-1">
          <AccuracyProgressBar accuracy={currentUser.accuracyPercentage} />
        </div>
      </div>

      {/* ========================================================= */}
      {/* REMAINING USERS LIST WITH ACCURACY BARS & BADGES          */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center justify-between">
          <span>অন্যান্য পরীক্ষার্থীদের র‍্যাঙ্কিং</span>
          <span className="text-xs font-normal text-slate-500">মোট পরীক্ষার্থী: ৪,৮৫০+</span>
        </h3>

        <div className="space-y-3">
          {remainingUsers.map((u) => (
            <div
              key={u.rank}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80 space-y-2.5 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <span className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-xs flex items-center justify-center shrink-0">
                    #{u.rank}
                  </span>

                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-sm flex items-center justify-center shrink-0">
                    {u.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-950 dark:text-slate-100 leading-snug">
                        {u.name}
                      </h4>
                      {renderRankBadge(u.rank)}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {u.cadre} • {u.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-right shrink-0">
                  <div>
                    <span className="font-black text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 block">
                      {u.score} পয়েন্ট
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      {u.avgTimePerQuestionSec ? `⚡ ${u.avgTimePerQuestionSec} সে./প্রশ্ন` : `সময়: ${u.timeSpentMinutes} মি.`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Accuracy Progress Bar for User */}
              <AccuracyProgressBar accuracy={u.accuracyPercentage} compact />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

