import React, { useState, useEffect } from 'react';
import { 
  getLatestExamResult, 
  getStoredUserTotalPoints, 
  getRealLeaderboardEntries, 
  getRegisteredUserInfo,
  getStoredExamResults 
} from '../utils/examStorage';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Award, 
  Zap, 
  Sparkles,
  Medal,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle2,
  XCircle,
  BarChart2
} from 'lucide-react';
import { UserProfileData, NavTab } from '../types';

interface LeaderboardViewProps {
  user?: UserProfileData;
  onTabChange?: (tab: NavTab) => void;
  onBackToExam?: () => void;
  examTitle?: string;
  isPremiumExam?: boolean;
  isCourseContext?: boolean;
  hideFilters?: boolean;
  userScore?: number;
  userMaxScore?: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string;
  cadre?: string;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  correctCount?: number;
  wrongCount?: number;
  timeSpentMinutes: number;
  avgTimePerQuestionSec?: number;
  totalExamsTaken?: number;
  avgPoints?: number;
  streakDays: number;
  location?: string;
  isCurrentUser?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ 
  user, 
  onTabChange,
  onBackToExam,
  examTitle,
  isPremiumExam = false,
  isCourseContext = false,
  hideFilters = false,
  userScore,
  userMaxScore
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'thisExam' | 'weekly' | 'monthly' | 'allTime'>(
    isCourseContext ? 'allTime' : 'thisExam'
  );
  const [leaderboardType, setLeaderboardType] = useState<'free' | 'premium'>(isPremiumExam ? 'premium' : 'free');
  
  // Pagination State (Max 20 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 20;

  const showThisExamStats = filterPeriod === 'thisExam' && !isCourseContext;

  // Keep leaderboardType in sync if isPremiumExam prop changes
  useEffect(() => {
    if (isPremiumExam !== undefined) {
      setLeaderboardType(isPremiumExam ? 'premium' : 'free');
    }
  }, [isPremiumExam]);

  // Reset page to 1 whenever tab/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterPeriod, leaderboardType, isCourseContext]);

  // Fetch stored exam results and user accumulated points
  const latestResult = getLatestExamResult();
  const storedTotalPoints = getStoredUserTotalPoints();
  const realEntries = getRealLeaderboardEntries();
  const regUser = getRegisteredUserInfo();
  const storedProfileStr = typeof window !== 'undefined' ? localStorage.getItem('tamreen_user_profile') : null;
  const storedProfile = storedProfileStr ? JSON.parse(storedProfileStr) : null;
  const currentUserName = user?.name || storedProfile?.name || regUser?.name || 'পরীক্ষার্থী';
  const currentUserAvatar = user?.avatarUrl || storedProfile?.avatarUrl || '';

  // Dynamic candidate list built strictly from real exam submissions
  let rawCandidates: LeaderboardUser[] = [];

  let filteredEntries = realEntries;

  if (filterPeriod === 'thisExam') {
    if (examTitle) {
      filteredEntries = realEntries.filter(
        e => e.examTitle === examTitle || e.examId === examTitle
      );
    }

    rawCandidates = filteredEntries.map((entry) => {
      const isCurrUser = Boolean((regUser && entry.userPhone === regUser.phone) || entry.userName === currentUserName);
      return {
        rank: 1,
        name: entry.userName,
        avatar: entry.userAvatar || (isCurrUser ? currentUserAvatar : ''),
        score: entry.score,
        maxScore: entry.maxScore,
        accuracyPercentage: entry.accuracyPercentage,
        correctCount: entry.correctCount,
        wrongCount: entry.wrongCount,
        timeSpentMinutes: entry.timeSpentMinutes,
        avgTimePerQuestionSec: 24,
        totalExamsTaken: 1,
        avgPoints: entry.score,
        streakDays: 1,
        isCurrentUser: isCurrUser
      };
    });

    // If current user completed exam, ensure present
    if (latestResult && rawCandidates.length === 0 && (!examTitle || latestResult.examTitle === examTitle || latestResult.examId === examTitle)) {
      const uScore = userScore !== undefined ? userScore : latestResult.score;
      const uMax = userMaxScore !== undefined ? userMaxScore : latestResult.totalQuestions;
      rawCandidates.push({
        rank: 1,
        name: currentUserName,
        avatar: currentUserAvatar,
        score: uScore,
        maxScore: uMax,
        accuracyPercentage: latestResult.percentage,
        correctCount: latestResult.correctCount,
        wrongCount: latestResult.wrongCount,
        timeSpentMinutes: 20,
        avgTimePerQuestionSec: 24,
        totalExamsTaken: 1,
        avgPoints: uScore,
        streakDays: user?.streakDays || 1,
        isCurrentUser: true
      });
    }
  } else {
    // For weekly, monthly, allTime: aggregate real entries by user
    const userMap: Record<string, LeaderboardUser> = {};

    realEntries.forEach((entry) => {
      const isCurrUser = Boolean((regUser && entry.userPhone === regUser.phone) || entry.userName === currentUserName);
      const key = entry.userPhone || entry.userName;
      if (!userMap[key]) {
        userMap[key] = {
          rank: 1,
          name: entry.userName,
          avatar: entry.userAvatar || (isCurrUser ? currentUserAvatar : ''),
          score: 0,
          maxScore: 0,
          accuracyPercentage: 0,
          correctCount: 0,
          wrongCount: 0,
          timeSpentMinutes: 0,
          totalExamsTaken: 0,
          avgPoints: 0,
          streakDays: 1,
          isCurrentUser: isCurrUser
        };
      }
      const u = userMap[key];
      if (!u.avatar && entry.userAvatar) {
        u.avatar = entry.userAvatar;
      }
      u.score += entry.score;
      u.maxScore += entry.maxScore;
      u.correctCount = (u.correctCount || 0) + entry.correctCount;
      u.wrongCount = (u.wrongCount || 0) + entry.wrongCount;
      u.timeSpentMinutes += entry.timeSpentMinutes;
      u.totalExamsTaken = (u.totalExamsTaken || 0) + 1;
      u.accuracyPercentage = u.maxScore > 0 ? Math.round((u.score / u.maxScore) * 100) : 0;
      u.avgPoints = Number((u.score / u.totalExamsTaken).toFixed(1));
    });

    rawCandidates = Object.values(userMap);

    const currentUserInMap = rawCandidates.some(c => c.isCurrentUser);
    if (!currentUserInMap && latestResult) {
      rawCandidates.push({
        rank: 1,
        name: currentUserName,
        avatar: currentUserAvatar,
        score: latestResult.score,
        maxScore: latestResult.totalQuestions,
        accuracyPercentage: latestResult.percentage,
        correctCount: latestResult.correctCount,
        wrongCount: latestResult.wrongCount,
        timeSpentMinutes: 20,
        totalExamsTaken: Object.keys(getStoredExamResults()).length || 1,
        avgPoints: latestResult.score,
        streakDays: user?.streakDays || 1,
        isCurrentUser: true
      });
    }
  }

  // Sort candidates by score descending, accuracy descending
  rawCandidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.accuracyPercentage - a.accuracyPercentage;
  });

  // Re-index ranks 1..N dynamically
  rawCandidates.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  // Extract current user with exact dynamic rank
  const currentUser = rawCandidates.find(c => c.isCurrentUser) || rawCandidates[0];

  // Top 3 Podium
  const currentPodium = rawCandidates.slice(0, 3);

  // Remaining Users (Rank 4 onwards)
  const remainingUsers = rawCandidates.slice(3);

  // Calculate Pagination
  const totalRemainingPages = Math.max(1, Math.ceil(remainingUsers.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalRemainingPages);
  
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRemaining = remainingUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Helper to Render Avatar Circle
  const renderAvatarCircle = (u: LeaderboardUser, sizeClass: string = 'w-8 h-8') => {
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-0.5 shrink-0 shadow-xs`}>
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-emerald-300 overflow-hidden">
          {u.avatar ? (
            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs">{u.name.charAt(0)}</span>
          )}
        </div>
      </div>
    );
  };

  // Helper for Rank Badge Styling
  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-xs">
          <Crown className="w-3 h-3 text-slate-950 fill-slate-950" />
          <span>১ম স্থান</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-black text-[10px]">
          <Medal className="w-3 h-3 text-slate-600 dark:text-slate-300" />
          <span>২য় স্থান</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-800 text-amber-100 font-black text-[10px]">
          <Award className="w-3 h-3 text-amber-300" />
          <span>৩য় স্থান</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-800/60">
        <div className="absolute -right-12 -bottom-12 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>লাইভ মেধা তালিকা</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isCourseContext 
                ? 'কোর্সে অংশগ্রহণকারীদের মেধা তালিকা' 
                : leaderboardType === 'premium' 
                  ? 'প্রিমিয়াম পরীক্ষায় অংশগ্রহণকারীদের মেধা তালিকা' 
                  : 'ফ্রি পরীক্ষায় অংশগ্রহণকারীদের মেধা তালিকা'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              {examTitle ? `${isCourseContext ? 'কোর্স: ' : 'বিষয়: '}${examTitle}` : 'বিষয়ভিত্তিক ও মডেল টেস্ট পরীক্ষার সেরা পরীক্ষার্থীদের তালিকা'}
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
        {isCourseContext ? (
          <div className="relative z-10 flex items-center justify-center mt-4">
            <div className="px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-amber-400 shadow-md flex items-center space-x-1.5">
              <Trophy className="w-4 h-4" />
              <span>কোর্স ব্যাচ মেধা তালিকা</span>
            </div>
          </div>
        ) : isPremiumExam === undefined ? (
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
              <span>{isPremiumExam ? 'প্রিমিয়াম মেধা তালিকা' : 'ফ্রি মেধা তালিকা'}</span>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {!hideFilters && !isCourseContext && (
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
        )}
      </div>

      {rawCandidates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
              এখনো কোনো পরীক্ষার্থী পরীক্ষা সম্পন্ন করেনি
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              ডিফল্ট তালিকা অপসারণ করা হয়েছে। প্রথম পরীক্ষার্থী হিসেবে আপনি পরীক্ষা দিন এবং মেধা তালিকায় আপনার নাম যুক্ত করুন!
            </p>
          </div>
          {onBackToExam && (
            <button
              onClick={onBackToExam}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              পরীক্ষায় অংশ নিন
            </button>
          )}
        </div>
      ) : (
        <>
      {/* TOP 3 WINNERS PODIUM DESIGN */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 text-center flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>শীর্ষ ৩ বিজয়ী</span>
        </h2>

        {/* Podium Layout */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-6 pb-2 max-w-2xl mx-auto">
          
          {/* 🥈 SILVER - Rank 2 (Left) */}
          {currentPodium[1] && (
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-400 p-1 shadow-lg flex items-center justify-center overflow-hidden">
                  {currentPodium[1].avatar ? (
                    <img src={currentPodium[1].avatar} alt={currentPodium[1].name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-slate-200 font-extrabold text-lg sm:text-xl">
                      {currentPodium[1].name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-2 inset-x-0 mx-auto w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md border border-white">
                  🥈
                </span>
              </div>
              
              <div className="text-center space-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 block line-clamp-1">
                  {currentPodium[1].name}
                </span>
                <div className="my-1">{renderRankBadge(2)}</div>
                <span className="text-[10px] text-slate-500 font-semibold block">
                  {currentPodium[1].totalExamsTaken || 18}টি পরীক্ষা • গড় {currentPodium[1].avgPoints || 28.5}
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                  {currentPodium[1].score} পয়েন্ট
                </span>
              </div>

              <div className="w-full mt-1 h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700/80 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-2 shadow-inner">
                <span className="text-xl sm:text-2xl font-black text-slate-600 dark:text-slate-300">২</span>
                <span className="text-[10px] font-bold text-slate-500">রানার-আপ</span>
              </div>
            </div>
          )}

          {/* 🥇 GOLD - Rank 1 (Center - Tallest) */}
          {currentPodium[0] && (
            <div className="flex flex-col items-center -mt-6 space-y-2">
              <div className="relative">
                <div className="absolute -top-6 inset-x-0 mx-auto flex justify-center animate-bounce">
                  <Crown className="w-7 h-7 text-amber-400 drop-shadow-md" />
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
                  {currentPodium[0].avatar ? (
                    <img src={currentPodium[0].avatar} alt={currentPodium[0].name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-amber-300 font-black text-xl sm:text-2xl">
                      {currentPodium[0].name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-2 inset-x-0 mx-auto w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg border-2 border-white">
                  🥇
                </span>
              </div>

              <div className="text-center space-y-0.5">
                <span className="text-xs sm:text-base font-black text-slate-950 dark:text-slate-100 block line-clamp-1">
                  {currentPodium[0].name}
                </span>
                <div className="my-1">{renderRankBadge(1)}</div>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">
                  {currentPodium[0].totalExamsTaken || 25}টি পরীক্ষা • গড় {currentPodium[0].avgPoints || 29.0}
                </span>
                <span className="text-sm font-black text-amber-500 block">
                  {currentPodium[0].score} পয়েন্ট
                </span>
              </div>

              <div className="w-full mt-1 h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-500/30 via-amber-400/20 to-amber-300/10 dark:from-amber-900/40 dark:to-slate-800 border-2 border-amber-400/50 flex flex-col items-center justify-center p-2 shadow-lg">
                <span className="text-2xl sm:text-3xl font-black text-amber-500">১</span>
                <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">চ্যাম্পিয়ন</span>
              </div>
            </div>
          )}

          {/* 🥉 BRONZE - Rank 3 (Right) */}
          {currentPodium[2] && (
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-800 p-1 shadow-lg flex items-center justify-center overflow-hidden">
                  {currentPodium[2].avatar ? (
                    <img src={currentPodium[2].avatar} alt={currentPodium[2].name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-amber-200 font-extrabold text-lg sm:text-xl">
                      {currentPodium[2].name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-2 inset-x-0 mx-auto w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-md border border-white">
                  🥉
                </span>
              </div>

              <div className="text-center space-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 block line-clamp-1">
                  {currentPodium[2].name}
                </span>
                <div className="my-1">{renderRankBadge(3)}</div>
                <span className="text-[10px] text-slate-500 font-semibold block">
                  {currentPodium[2].totalExamsTaken || 20}টি পরীক্ষা • গড় {currentPodium[2].avgPoints || 28.0}
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                  {currentPodium[2].score} পয়েন্ট
                </span>
              </div>

              <div className="w-full mt-1 h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-amber-900/20 to-slate-100 dark:from-slate-800 dark:to-slate-700/80 border border-amber-800/30 flex flex-col items-center justify-center p-2 shadow-inner">
                <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400">৩</span>
                <span className="text-[10px] font-bold text-slate-500">৩য় স্থান</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CURRENT USER HIGHLIGHTED CARD */}
      <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-emerald-500/15 to-teal-500/10 dark:from-emerald-950/90 dark:to-teal-950/90 border-2 border-emerald-500/80 shadow-md backdrop-blur-md transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 w-6 text-right shrink-0">
              {currentUser.rank}.
            </span>
            
            {renderAvatarCircle(currentUser, 'w-10 h-10 sm:w-11 sm:h-11')}

            <div className="min-w-0 space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                  {currentUser.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shrink-0">
                  আপনি
                </span>
              </div>

              {!showThisExamStats ? (
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-extrabold text-[11px] border border-sky-200 dark:border-sky-800/80">
                    টেস্ট: {currentUser.totalExamsTaken || 18}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800/80">
                    গড়: {currentUser.avgPoints || 28.5}%
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  আপনার মেধা অবস্থান • এক্যুরেসি {currentUser.accuracyPercentage}%
                </p>
              )}
            </div>
          </div>

          {showThisExamStats ? (
            <div className="flex items-center space-x-2.5 sm:space-x-5 shrink-0 text-right">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">সঠিক</span>
                <span className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                  {currentUser.score}টি
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">ভুল</span>
                <span className="font-bold text-xs sm:text-sm text-rose-500">
                  {currentUser.maxScore - currentUser.score}টি
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">নাম্বার</span>
                <span className="font-black text-sm sm:text-lg text-amber-600 dark:text-amber-400">
                  {currentUser.score}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-right shrink-0 pl-2">
              <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider">
                পয়েন্ট
              </span>
              <span className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {currentUser.score}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* REMAINING USERS LIST WITH PAGINATION (MAX 20 CANDIDATES PER PAGE) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <span>অন্যান্য পরীক্ষার্থীদের র‍্যাঙ্কিং</span>
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            মোট পরীক্ষার্থী: {rawCandidates.length} জন
          </span>
        </div>

        {/* List of Candidates */}
        <div className="space-y-2.5">
          {paginatedRemaining.map((u) => (
            <div
              key={u.rank}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                u.isCurrentUser 
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/80 shadow-sm' 
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/70 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-2xs'
              }`}
            >
              {/* 1. Rank, Avatar Image & Name */}
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <span className="text-sm sm:text-base font-black text-slate-600 dark:text-slate-400 w-6 text-right shrink-0">
                  {u.rank}.
                </span>

                {/* Profile Picture */}
                {renderAvatarCircle(u, 'w-10 h-10 sm:w-11 sm:h-11')}

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                      {u.name}
                    </h4>
                    {u.isCurrentUser && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold shrink-0">
                        আপনি
                      </span>
                    )}
                  </div>

                  {!showThisExamStats ? (
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-extrabold text-[11px] border border-sky-200 dark:border-sky-800/80">
                        টেস্ট: {u.totalExamsTaken || 3}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800/80">
                        গড়: {u.avgPoints || 28.0}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      এক্যুরেসি {u.accuracyPercentage}%
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Stats Column */}
              {showThisExamStats ? (
                <div className="flex items-center space-x-2.5 sm:space-x-5 shrink-0 text-right">
                  <div className="text-right min-w-[36px] sm:min-w-[45px]">
                    <span className="text-[10px] text-slate-400 font-semibold block">সঠিক</span>
                    <span className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                      {u.correctCount ?? u.score}টি
                    </span>
                  </div>
                  <div className="text-right min-w-[36px] sm:min-w-[45px]">
                    <span className="text-[10px] text-slate-400 font-semibold block">ভুল</span>
                    <span className="font-bold text-xs sm:text-sm text-rose-500">
                      {u.wrongCount ?? Math.max(0, u.maxScore - u.score)}টি
                    </span>
                  </div>
                  <div className="text-right min-w-[45px] sm:min-w-[55px]">
                    <span className="text-[10px] text-slate-400 font-semibold block">নাম্বার</span>
                    <span className="font-black text-sm sm:text-base text-amber-600 dark:text-amber-400">
                      {u.score}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-right shrink-0 pl-2">
                  <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider">
                    পয়েন্ট
                  </span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                    {u.score}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* PAGINATION CONTROLS (Max 20 per page) */}
        {totalRemainingPages > 1 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">
              পৃষ্ঠা {validCurrentPage} এর {totalRemainingPages} (মোট {remainingUsers.length} জন)
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী</span>
              </button>

              {Array.from({ length: totalRemainingPages }, (_, idx) => idx + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-9 h-9 rounded-xl font-extrabold text-xs transition-colors ${
                    validCurrentPage === num
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalRemainingPages, p + 1))}
                disabled={validCurrentPage === totalRemainingPages}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
        </>
      )}

    </div>
  );
};
