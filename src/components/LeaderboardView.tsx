import React, { useState } from 'react';
import { getLatestExamResult, getStoredUserTotalPoints } from '../utils/examStorage';
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
  isCourseContext?: boolean;
  hideFilters?: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string;
  cadre: string;
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
  location: string;
  isCurrentUser?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ 
  user, 
  onTabChange,
  onBackToExam,
  examTitle,
  isPremiumExam = false,
  isCourseContext = false,
  hideFilters = false
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'thisExam' | 'weekly' | 'monthly' | 'allTime'>(
    isCourseContext ? 'allTime' : 'thisExam'
  );
  const [leaderboardType, setLeaderboardType] = useState<'free' | 'premium'>(isPremiumExam ? 'premium' : 'free');

  const showThisExamStats = filterPeriod === 'thisExam' && !isCourseContext;

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

  // Fetch stored exam results and user accumulated points
  const latestResult = getLatestExamResult();
  const storedTotalPoints = getStoredUserTotalPoints();

  // Dynamic candidate list & score/rank calculation per filter tab
  let rawCandidates: LeaderboardUser[] = [];

  if (isCourseContext) {
    // Course Leaderboard System: exam count, avg points, total points
    const userExams = 18 + Math.floor((storedTotalPoints - 840) / 20);
    const userAvg = Math.min(30, Number((27.5 + (storedTotalPoints > 840 ? 1.5 : 0)).toFixed(1)));
    const userTotalPoints = Math.round(userExams * userAvg);

    const userObj: LeaderboardUser = {
      rank: 1,
      name: user?.name || 'আরিফুল ইসলাম (আপনি)',
      cadre: 'সহকারী শিক্ষক (আরবি)',
      score: userTotalPoints,
      maxScore: userExams * 30,
      accuracyPercentage: Math.round((userAvg / 30) * 100),
      totalExamsTaken: userExams,
      avgPoints: userAvg,
      timeSpentMinutes: userExams * 20,
      avgTimePerQuestionSec: 24,
      streakDays: user?.streakDays || 14,
      location: 'ময়মনসিংহ',
      isCurrentUser: true
    };

    const mockOthers: LeaderboardUser[] = [
      { rank: 1, name: 'মাওলানা হাফেজ আব্দুল মালেক', cadre: 'প্রভাষক (আরবি)', score: 870, maxScore: 900, accuracyPercentage: 97, totalExamsTaken: 30, avgPoints: 29.0, timeSpentMinutes: 600, avgTimePerQuestionSec: 22, streakDays: 24, location: 'ঢাকা' },
      { rank: 2, name: 'মুফতি তানভীর আহমেদ', cadre: 'সহকারী শিক্ষক (আরবি)', score: 806, maxScore: 840, accuracyPercentage: 96, totalExamsTaken: 28, avgPoints: 28.8, timeSpentMinutes: 560, avgTimePerQuestionSec: 24, streakDays: 18, location: 'চট্টগ্রাম' },
      { rank: 3, name: 'কারি মোশতাক মাহমুদ', cadre: 'সহকারী মৌলভী', score: 713, maxScore: 750, accuracyPercentage: 95, totalExamsTaken: 25, avgPoints: 28.5, timeSpentMinutes: 500, avgTimePerQuestionSec: 26, streakDays: 15, location: 'সিলেট' },
      { rank: 4, name: 'হাফেজ মাওলানা সিফাত উল্লাহ', cadre: 'লেকচারার ফিকহ', score: 621, maxScore: 660, accuracyPercentage: 94, totalExamsTaken: 22, avgPoints: 28.2, timeSpentMinutes: 440, avgTimePerQuestionSec: 27, streakDays: 12, location: 'কুমিল্লা' },
      { rank: 5, name: 'মাওলানা উবায়দুল ইসলাম', cadre: 'সহকারী মৌলভী', score: 560, maxScore: 600, accuracyPercentage: 93, totalExamsTaken: 20, avgPoints: 28.0, timeSpentMinutes: 400, avgTimePerQuestionSec: 28, streakDays: 14, location: 'রাজশাহী' },
      { rank: 6, name: 'মুফতি আব্দুর রশীদ', cadre: 'প্রভাষক (আরবি)', score: 495, maxScore: 540, accuracyPercentage: 92, totalExamsTaken: 18, avgPoints: 27.5, timeSpentMinutes: 360, avgTimePerQuestionSec: 29, streakDays: 11, location: 'রংপুর' },
    ];

    rawCandidates = [...mockOthers, userObj];
  } else if (filterPeriod === 'thisExam') {
    const examQuestions = latestResult ? latestResult.totalQuestions : 16;
    const uScore = latestResult ? latestResult.score : Math.min(15, examQuestions);
    const uCorrect = latestResult ? latestResult.correctCount : uScore;
    const uWrong = latestResult ? latestResult.wrongCount : Math.max(0, examQuestions - uScore);
    const uAcc = latestResult ? latestResult.percentage : (examQuestions > 0 ? Math.round((uScore / examQuestions) * 100) : 94);

    const userObj: LeaderboardUser = {
      rank: 1,
      name: user?.name || 'আরিফুল ইসলাম (আপনি)',
      cadre: 'সহকারী শিক্ষক (আরবি)',
      score: uScore,
      maxScore: examQuestions,
      accuracyPercentage: uAcc,
      correctCount: uCorrect,
      wrongCount: uWrong,
      timeSpentMinutes: 25,
      avgTimePerQuestionSec: 24,
      totalExamsTaken: 16,
      streakDays: user?.streakDays || 14,
      location: 'ময়মনসিংহ',
      isCurrentUser: true
    };

    const mockOthers: LeaderboardUser[] = [
      { rank: 1, name: 'মাওলানা হাফেজ আব্দুল মালেক', cadre: 'প্রভাষক (আরবি)', score: examQuestions, maxScore: examQuestions, accuracyPercentage: 100, correctCount: examQuestions, wrongCount: 0, timeSpentMinutes: 38, avgTimePerQuestionSec: 22, totalExamsTaken: 28, streakDays: 24, location: 'ঢাকা' },
      { rank: 2, name: 'মুফতি তানভীর আহমেদ', cadre: 'সহকারী শিক্ষক (আরবি)', score: Math.max(1, examQuestions - 1), maxScore: examQuestions, accuracyPercentage: Math.round(((examQuestions - 1) / examQuestions) * 100), correctCount: Math.max(1, examQuestions - 1), wrongCount: 1, timeSpentMinutes: 41, avgTimePerQuestionSec: 24, totalExamsTaken: 25, streakDays: 18, location: 'চট্টগ্রাম' },
      { rank: 3, name: 'কারি মোশতাক মাহমুদ', cadre: 'সহকারী মৌলভী', score: Math.max(1, examQuestions - 1), maxScore: examQuestions, accuracyPercentage: Math.round(((examQuestions - 1) / examQuestions) * 100), correctCount: Math.max(1, examQuestions - 1), wrongCount: 1, timeSpentMinutes: 44, avgTimePerQuestionSec: 26, totalExamsTaken: 22, streakDays: 15, location: 'সিলেট' },
      { rank: 4, name: 'হাফেজ মাওলানা সিফাত উল্লাহ', cadre: 'লেকচারার ফিকহ', score: Math.max(1, examQuestions - 2), maxScore: examQuestions, accuracyPercentage: Math.round(((examQuestions - 2) / examQuestions) * 100), correctCount: Math.max(1, examQuestions - 2), wrongCount: 2, timeSpentMinutes: 45, avgTimePerQuestionSec: 27, totalExamsTaken: 20, streakDays: 12, location: 'কুমিল্লা' },
      { rank: 5, name: 'মাওলানা উবায়দুল ইসলাম', cadre: 'সহকারী মৌলভী', score: Math.max(1, examQuestions - 2), maxScore: examQuestions, accuracyPercentage: Math.round(((examQuestions - 2) / examQuestions) * 100), correctCount: Math.max(1, examQuestions - 2), wrongCount: 2, timeSpentMinutes: 46, avgTimePerQuestionSec: 28, totalExamsTaken: 19, streakDays: 14, location: 'রাজশাহী' },
      { rank: 6, name: 'মুফতি আব্দুর রশীদ', cadre: 'প্রভাষক (আরবি)', score: Math.max(1, examQuestions - 3), maxScore: examQuestions, accuracyPercentage: Math.round(((examQuestions - 3) / examQuestions) * 100), correctCount: Math.max(1, examQuestions - 3), wrongCount: 3, timeSpentMinutes: 48, avgTimePerQuestionSec: 29, totalExamsTaken: 18, streakDays: 11, location: 'রংপুর' },
      { rank: 7, name: 'কারী কামরুল হাসান', cadre: 'ইবতেদায়ী প্রধান', score: Math.max(1, examQuestions - 3), maxScore: examQuestions, accuracyPercentage: Math.round(((examQuestions - 3) / examQuestions) * 100), correctCount: Math.max(1, examQuestions - 3), wrongCount: 3, timeSpentMinutes: 49, avgTimePerQuestionSec: 29, totalExamsTaken: 17, streakDays: 10, location: 'বরিশাল' },
      { rank: 8, name: 'হাফেজ তরিকুল ইসলাম', cadre: 'সহকারী শিক্ষক (আরবি)', score: Math.max(1, examQuestions - 4), maxScore: examQuestions, accuracyPercentage: Math.round(((examQuestions - 4) / examQuestions) * 100), correctCount: Math.max(1, examQuestions - 4), wrongCount: 4, timeSpentMinutes: 50, avgTimePerQuestionSec: 30, totalExamsTaken: 16, streakDays: 9, location: 'খুলনা' },
    ];

    rawCandidates = [...mockOthers, userObj];
  } else if (filterPeriod === 'weekly') {
    const userWeeklyPoints = Math.min(500, Math.max(450, 460 + Math.round((storedTotalPoints - 840) / 10)));
    const userObj: LeaderboardUser = {
      rank: 1,
      name: user?.name || 'আরিফুল ইসলাম (আপনি)',
      cadre: 'সহকারী শিক্ষক (আরবি)',
      score: userWeeklyPoints,
      maxScore: 500,
      accuracyPercentage: 96,
      correctCount: userWeeklyPoints,
      wrongCount: 10,
      timeSpentMinutes: 180,
      avgTimePerQuestionSec: 25,
      totalExamsTaken: 14 + Math.floor((storedTotalPoints - 840) / 20),
      streakDays: user?.streakDays || 14,
      location: 'ময়মনসিংহ',
      isCurrentUser: true
    };

    const mockOthers: LeaderboardUser[] = [
      { rank: 1, name: 'মুফতি তানভীর আহমেদ', cadre: 'সহকারী শিক্ষক (আরবি)', score: 485, maxScore: 500, accuracyPercentage: 97, timeSpentMinutes: 210, avgTimePerQuestionSec: 23, totalExamsTaken: 14, streakDays: 30, location: 'চট্টগ্রাম' },
      { rank: 2, name: 'মাওলানা হাফেজ আব্দুল মালেক', cadre: 'প্রভাষক (আরবি)', score: 478, maxScore: 500, accuracyPercentage: 95, timeSpentMinutes: 205, avgTimePerQuestionSec: 24, totalExamsTaken: 12, streakDays: 24, location: 'ঢাকা' },
      { rank: 3, name: 'হাফেজ ওবায়দুল ইসলাম', cadre: 'ইবতেদায়ী প্রধান', score: 462, maxScore: 500, accuracyPercentage: 92, timeSpentMinutes: 225, avgTimePerQuestionSec: 27, totalExamsTaken: 11, streakDays: 19, location: 'রাজশাহী' },
      { rank: 4, name: 'কারি মোশতাক মাহমুদ', cadre: 'সহকারী মৌলভী', score: 440, maxScore: 500, accuracyPercentage: 88, timeSpentMinutes: 230, avgTimePerQuestionSec: 28, totalExamsTaken: 10, streakDays: 15, location: 'সিলেট' },
      { rank: 5, name: 'মুফতি আব্দুর রশীদ', cadre: 'প্রভাষক (আরবি)', score: 410, maxScore: 500, accuracyPercentage: 82, timeSpentMinutes: 240, avgTimePerQuestionSec: 29, totalExamsTaken: 9, streakDays: 11, location: 'রংপুর' },
    ];

    rawCandidates = [...mockOthers, userObj];
  } else if (filterPeriod === 'monthly') {
    const userMonthlyPoints = Math.min(2000, Math.max(1800, 1860 + Math.round((storedTotalPoints - 840) / 5)));
    const userObj: LeaderboardUser = {
      rank: 1,
      name: user?.name || 'আরিফুল ইসলাম (আপনি)',
      cadre: 'সহকারী শিক্ষক (আরবি)',
      score: userMonthlyPoints,
      maxScore: 2000,
      accuracyPercentage: 95,
      correctCount: userMonthlyPoints,
      wrongCount: 30,
      timeSpentMinutes: 720,
      avgTimePerQuestionSec: 25,
      totalExamsTaken: 42 + Math.floor((storedTotalPoints - 840) / 20),
      streakDays: user?.streakDays || 14,
      location: 'ময়মনসিংহ',
      isCurrentUser: true
    };

    const mockOthers: LeaderboardUser[] = [
      { rank: 1, name: 'মাওলানা হাফেজ আব্দুল মালেক', cadre: 'প্রভাষক (আরবি)', score: 1920, maxScore: 2000, accuracyPercentage: 96, timeSpentMinutes: 840, avgTimePerQuestionSec: 23, totalExamsTaken: 45, streakDays: 45, location: 'ঢাকা' },
      { rank: 2, name: 'কারি মোশতাক মাহমুদ', cadre: 'সহকারী মৌলভী', score: 1880, maxScore: 2000, accuracyPercentage: 94, timeSpentMinutes: 890, avgTimePerQuestionSec: 25, totalExamsTaken: 42, streakDays: 38, location: 'সিলেট' },
      { rank: 3, name: 'মুফতি তানভীর আহমেদ', cadre: 'সহকারী শিক্ষক (আরবি)', score: 1845, maxScore: 2000, accuracyPercentage: 92, timeSpentMinutes: 860, avgTimePerQuestionSec: 26, totalExamsTaken: 40, streakDays: 30, location: 'চট্টগ্রাম' },
      { rank: 4, name: 'হাফেজ ওবায়দুল ইসলাম', cadre: 'ইবতেদায়ী প্রধান', score: 1720, maxScore: 2000, accuracyPercentage: 86, timeSpentMinutes: 900, avgTimePerQuestionSec: 28, totalExamsTaken: 36, streakDays: 25, location: 'রাজশাহী' },
    ];

    rawCandidates = [...mockOthers, userObj];
  } else {
    // allTime
    const userAllTimePoints = Math.min(5600, Math.max(5100, 5250 + Math.round((storedTotalPoints - 840) / 2)));
    const userObj: LeaderboardUser = {
      rank: 1,
      name: user?.name || 'আরিফুল ইসলাম (আপনি)',
      cadre: 'সহকারী শিক্ষক (আরবি)',
      score: userAllTimePoints,
      maxScore: 5600,
      accuracyPercentage: 96,
      correctCount: userAllTimePoints,
      wrongCount: 90,
      timeSpentMinutes: 2100,
      avgTimePerQuestionSec: 24,
      totalExamsTaken: 112 + Math.floor((storedTotalPoints - 840) / 10),
      streakDays: user?.streakDays || 14,
      location: 'ময়মনসিংহ',
      isCurrentUser: true
    };

    const mockOthers: LeaderboardUser[] = [
      { rank: 1, name: 'মাওলানা হাফেজ আব্দুল মালেক', cadre: 'প্রভাষক (আরবি)', score: 5420, maxScore: 5600, accuracyPercentage: 97, timeSpentMinutes: 2400, avgTimePerQuestionSec: 22, totalExamsTaken: 120, streakDays: 120, location: 'ঢাকা' },
      { rank: 2, name: 'মুফতি তানভীর আহমেদ', cadre: 'সহকারী শিক্ষক (আরবি)', score: 5180, maxScore: 5600, accuracyPercentage: 95, timeSpentMinutes: 2510, avgTimePerQuestionSec: 24, totalExamsTaken: 110, streakDays: 95, location: 'চট্টগ্রাম' },
      { rank: 3, name: 'কারি মোশতাক মাহমুদ', cadre: 'সহকারী মৌলভী', score: 4950, maxScore: 5600, accuracyPercentage: 93, timeSpentMinutes: 2480, avgTimePerQuestionSec: 25, totalExamsTaken: 105, streakDays: 88, location: 'সিলেট' },
      { rank: 4, name: 'হাফেজ ওবায়দুল ইসলাম', cadre: 'ইবতেদায়ী প্রধান', score: 4500, maxScore: 5600, accuracyPercentage: 88, timeSpentMinutes: 2600, avgTimePerQuestionSec: 27, totalExamsTaken: 95, streakDays: 70, location: 'রাজশাহী' },
    ];

    rawCandidates = [...mockOthers, userObj];
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

  // Remaining Users
  const remainingUsers = rawCandidates.slice(3);

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
            <span className="text-slate-500 dark:text-slate-400">এক্যুরেসি:</span>
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

        {/* Filter Tabs (Hidden in Course Context) */}
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

      {/* ========================================================= */}
      {/* TOP 3 WINNERS PODIUM DESIGN                               */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 text-center flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>শীর্ষ ৩ বিজয়ী</span>
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
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">চ্যাম্পিয়ন</span>
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
      {/* CURRENT USER HIGHLIGHTED CARD (My Rank - Slim Bar)        */}
      {/* ========================================================= */}
      <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-emerald-500/15 to-teal-500/10 dark:from-emerald-950/90 dark:to-teal-950/90 border border-emerald-500/80 shadow-md backdrop-blur-md transition-all space-y-2">
        
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs border border-emerald-400">
              {currentUser.rank}
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {currentUser.name}
                </h3>
                <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                  আপনি
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                আপনার মেধা অবস্থান • {currentUser.cadre} ({currentUser.location})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 text-right">
            {isCourseContext ? (
              <>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">পরীক্ষা সংখ্যা</span>
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                    {currentUser.totalExamsTaken || 18}টি
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">গড় পয়েন্ট</span>
                  <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                    {currentUser.avgPoints || 28.5}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">মোট পয়েন্ট</span>
                  <span className="font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                    {currentUser.score}
                  </span>
                </div>
              </>
            ) : showThisExamStats ? (
              <>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">সঠিক উত্তর</span>
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {currentUser.score}টি
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">ভুল উত্তর</span>
                  <span className="font-bold text-xs text-rose-500">
                    {currentUser.maxScore - currentUser.score}টি
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">নম্বর / পয়েন্ট</span>
                  <span className="font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                    {currentUser.score} পয়েন্ট
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">পরীক্ষা সংখ্যা</span>
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                    {currentUser.totalExamsTaken || 16}টি
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">গড় এক্যুরেসি</span>
                  <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                    {currentUser.accuracyPercentage}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-medium">পয়েন্ট</span>
                  <span className="font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                    {currentUser.score}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compact Thin Accuracy Progress Line */}
        <div className="w-full h-1.5 rounded-full bg-emerald-950/20 dark:bg-slate-700/80 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, currentUser.accuracyPercentage))}%` }}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* REMAINING USERS LIST (SLIM / COMPACT LINE ITEM FORMAT)     */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <span>অন্যান্য পরীক্ষার্থীদের র‍্যাঙ্কিং</span>
          <span className="text-xs font-semibold text-slate-500">মোট পরীক্ষার্থী: ৪,৮৫০+</span>
        </h3>

        {/* Compact Table / List Header */}
        <div className="hidden sm:flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center space-x-3">
            <span className="w-8 text-center">ক্রম</span>
            <span>পরীক্ষার্থীর নাম</span>
          </div>
          {isCourseContext ? (
            <div className="flex items-center space-x-6 pr-2">
              <span>পরীক্ষা সংখ্যা</span>
              <span>গড় পয়েন্ট</span>
              <span>মোট পয়েন্ট</span>
            </div>
          ) : showThisExamStats ? (
            <div className="flex items-center space-x-8 pr-2">
              <span>সঠিক উত্তর</span>
              <span>ভুল উত্তর</span>
              <span>নম্বর / পয়েন্ট</span>
            </div>
          ) : (
            <div className="flex items-center space-x-6 pr-2">
              <span>পরীক্ষা সংখ্যা</span>
              <span>গড় এক্যুরেসি</span>
              <span>পয়েন্ট</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          {remainingUsers.map((u) => (
            <div
              key={u.rank}
              className="py-2 px-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/60 flex items-center justify-between hover:bg-emerald-50/60 dark:hover:bg-slate-800 transition-colors"
            >
              {/* 1. Serial Number & 2. Name */}
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {u.rank}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                    {u.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    {u.cadre} • {u.location}
                  </p>
                </div>
              </div>

              {/* 3. Stats Column */}
              {isCourseContext ? (
                <div className="flex items-center space-x-3 sm:space-x-6 shrink-0 text-right">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">পরীক্ষা:</span>
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                      {u.totalExamsTaken || 18}টি
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">গড়:</span>
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      {u.avgPoints || 28.0}
                    </span>
                  </div>
                  <div className="text-right min-w-[55px]">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">পয়েন্ট:</span>
                    <span className="font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                      {u.score}
                    </span>
                  </div>
                </div>
              ) : showThisExamStats ? (
                <div className="flex items-center space-x-4 sm:space-x-8 shrink-0 text-right">
                  <div className="text-right min-w-[50px]">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">সঠিক:</span>
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      {u.correctCount ?? u.score}টি
                    </span>
                  </div>
                  <div className="text-right min-w-[50px]">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">ভুল:</span>
                    <span className="font-bold text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200/60 dark:border-rose-800/60">
                      {u.wrongCount ?? Math.max(0, u.maxScore - u.score)}টি
                    </span>
                  </div>
                  <div className="text-right min-w-[65px]">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">পয়েন্ট:</span>
                    <span className="font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                      {u.score}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 sm:space-x-6 shrink-0 text-right">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">পরীক্ষা:</span>
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                      {u.totalExamsTaken || 16}টি
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">গড়:</span>
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      {u.accuracyPercentage}%
                    </span>
                  </div>
                  <div className="text-right min-w-[55px]">
                    <span className="text-[10px] text-slate-400 font-semibold block sm:hidden">পয়েন্ট:</span>
                    <span className="font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                      {u.score}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

