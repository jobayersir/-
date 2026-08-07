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

const RESULTS_KEY = 'tamreen_exam_results';
const USER_POINTS_KEY = 'tamreen_user_total_points';

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
