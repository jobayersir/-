export interface StoredExamResult {
  examId: string;
  examTitle: string;
  score: number; // 1 point per correct answer
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  percentage: number;
  rank: number;
  timestamp: number;
}

export interface RegisteredUserInfo {
  name: string;
  phone: string;
}

export interface RealLeaderboardEntry {
  id: string;
  examId: string;
  examTitle: string;
  userName: string;
  userPhone: string;
  userAvatar?: string;
  score: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercentage: number;
  timeSpentMinutes: number;
  timestamp: number;
}

const RESULTS_KEY = 'tamreen_exam_results';
const USER_POINTS_KEY = 'tamreen_user_total_points';
const REGISTERED_USER_KEY = 'tamreen_registered_user';
const LEADERBOARD_RECORDS_KEY = 'tamreen_real_leaderboard_records';

export const getRegisteredUserInfo = (): RegisteredUserInfo | null => {
  try {
    const data = localStorage.getItem(REGISTERED_USER_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.name && parsed.phone) {
        return parsed;
      }
    }
    // Fallback check on user profile
    const profileData = localStorage.getItem('tamreen_user_profile');
    if (profileData) {
      const parsedProfile = JSON.parse(profileData);
      if (parsedProfile && parsedProfile.name && (parsedProfile.phone || parsedProfile.email)) {
        return {
          name: parsedProfile.name,
          phone: parsedProfile.phone || parsedProfile.email || '০১৭০০-০০০০০'
        };
      }
    }
  } catch (e) {
    console.error('Error reading registered user info:', e);
  }
  return null;
};

export const saveRegisteredUserInfo = (info: RegisteredUserInfo): void => {
  try {
    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(info));
    // Automatically create / sync Free Member profile
    const existingProfileStr = localStorage.getItem('tamreen_user_profile');
    let profile = existingProfileStr ? JSON.parse(existingProfileStr) : {};
    profile.name = info.name;
    profile.phone = info.phone;
    if (profile.isPremium === undefined) {
      profile.isPremium = false;
    }
    if (!profile.role) {
      profile.role = 'ফ্রি মেম্বার';
    }
    if (!profile.joinedDate) {
      profile.joinedDate = new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' });
    }
    if (!profile.institution) {
      profile.institution = 'সাধারণ লার্নার';
    }
    localStorage.setItem('tamreen_user_profile', JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving registered user info:', e);
  }
};

export const getRealLeaderboardEntries = (): RealLeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading real leaderboard entries:', e);
    return [];
  }
};

export const saveRealLeaderboardEntry = (entry: Omit<RealLeaderboardEntry, 'id'>): RealLeaderboardEntry => {
  const entries = getRealLeaderboardEntries();
  const id = `lb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const fullEntry: RealLeaderboardEntry = {
    ...entry,
    id
  };

  // Check if entry for same exam and phone already exists -> update or append
  const existingIdx = entries.findIndex(e => e.examId === entry.examId && (e.userPhone === entry.userPhone || e.userName === entry.userName));
  if (existingIdx !== -1) {
    // Keep highest score or latest attempt
    entries[existingIdx] = fullEntry;
  } else {
    entries.push(fullEntry);
  }

  try {
    localStorage.setItem(LEADERBOARD_RECORDS_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Error saving leaderboard entry:', e);
  }

  return fullEntry;
};

export const getStoredExamResults = (): Record<string, StoredExamResult> => {
  try {
    const data = localStorage.getItem(RESULTS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Error reading exam results from localStorage:', e);
    return {};
  }
};

export const getStoredExamResult = (examId: string): StoredExamResult | null => {
  const results = getStoredExamResults();
  return results[examId] || null;
};

export const saveExamResult = (result: Omit<StoredExamResult, 'rank'>): StoredExamResult => {
  const results = getStoredExamResults();
  
  // Calculate rank dynamically based on score percentage
  // Higher score = better rank (e.g., 95%+ -> rank 1, 90%+ -> rank 2, 85%+ -> rank 3, etc.)
  let rank = 15;
  if (result.percentage >= 98) rank = 1;
  else if (result.percentage >= 92) rank = 2;
  else if (result.percentage >= 88) rank = 3;
  else if (result.percentage >= 82) rank = 4;
  else if (result.percentage >= 75) rank = 5;
  else if (result.percentage >= 68) rank = 7;
  else if (result.percentage >= 60) rank = 9;
  else if (result.percentage >= 50) rank = 11;
  else rank = 15;

  const fullResult: StoredExamResult = {
    ...result,
    rank
  };

  results[result.examId] = fullResult;
  
  try {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    
    // Add correctCount (1 point per correct MCQ) to user's total points
    const currentTotalPoints = getStoredUserTotalPoints();
    const newTotalPoints = currentTotalPoints + result.score;
    localStorage.setItem(USER_POINTS_KEY, newTotalPoints.toString());
  } catch (e) {
    console.error('Error saving exam result to localStorage:', e);
  }

  return fullResult;
};

export const getStoredUserTotalPoints = (): number => {
  try {
    const val = localStorage.getItem(USER_POINTS_KEY);
    return val ? parseInt(val, 10) : 840; // Default base points
  } catch (e) {
    return 840;
  }
};

export const getLatestExamResult = (): StoredExamResult | null => {
  const results = getStoredExamResults();
  const list = Object.values(results);
  if (list.length === 0) return null;
  list.sort((a, b) => b.timestamp - a.timestamp);
  return list[0];
};
