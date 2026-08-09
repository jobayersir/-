import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MCQQuestion, CQQuestion, CourseItem, ExamItem } from '../types';

// Helper to get active Supabase credentials
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const env = (import.meta as any).env || {};
  let url = env.VITE_SUPABASE_URL || '';
  let anonKey = env.VITE_SUPABASE_ANON_KEY || '';

  // Fallback to localStorage if configured via UI
  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
    const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');
    if (localUrl && localKey) {
      url = localUrl;
      anonKey = localKey;
    }
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(
    url &&
    anonKey &&
    url !== 'https://your-supabase-project.supabase.co' &&
    url.startsWith('https://')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (
    url &&
    anonKey &&
    url !== 'https://your-supabase-project.supabase.co' &&
    url.startsWith('https://')
  ) {
    return createClient(url, anonKey);
  }
  return null;
}

export const supabase = getSupabaseClient();

/**
 * Fetch MCQ Questions from Supabase if configured
 */
export async function fetchMcqQuestionsFromSupabase(): Promise<MCQQuestion[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const tablesToTry = ['mcq_questions', 'questions', 'question_bank'];
  for (const table of tablesToTry) {
    try {
      const { data, error } = await client
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((q: any) => ({
          id: String(q.id || Math.random()),
          question: q.question || q.title || q.question_text || '',
          questionArabic: q.question_arabic || q.questionArabic || undefined,
          options: Array.isArray(q.options) ? q.options : (q.options ? JSON.parse(q.options) : []),
          optionsArabic: q.options_arabic || q.optionsArabic || undefined,
          correctAnswer: typeof q.correct_answer === 'number' ? q.correct_answer : (typeof q.correctAnswer === 'number' ? q.correctAnswer : 0),
          explanation: q.explanation || q.answer_explanation || '',
          explanationArabic: q.explanation_arabic || q.explanationArabic || undefined,
          subject: q.subject || q.subject_id || 'quran_hadith',
          cadre: Array.isArray(q.cadre) ? q.cadre : ['all'],
          yearTag: q.year_tag || q.yearTag || undefined,
          difficulty: q.difficulty || 'medium',
        }));
      }
    } catch (err) {
      console.warn(`Fetch from ${table} error:`, err);
    }
  }
  return null;
}

/**
 * Fetch Exams from Supabase (tries 'exams', 'model_tests', 'quizzes', 'tests')
 */
export async function fetchExamsFromSupabase(): Promise<ExamItem[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const tablesToTry = ['exams', 'model_tests', 'quizzes', 'tests'];

  for (const table of tablesToTry) {
    try {
      const { data, error } = await client
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((e: any) => {
          let rawCategory = (e.category || e.type || e.exam_type || 'free').toLowerCase();
          let normalizedCategory: any = 'free';

          if (rawCategory.includes('daily') || rawCategory.includes('model') || rawCategory.includes('মডেল')) {
            normalizedCategory = 'daily';
          } else if (rawCategory.includes('live') || rawCategory.includes('লাইভ')) {
            normalizedCategory = 'live';
          } else if (rawCategory.includes('premium') || rawCategory.includes('paid') || Boolean(e.is_premium || e.isPremium)) {
            normalizedCategory = 'premium';
          } else {
            normalizedCategory = 'free';
          }

          // Parse questions if attached directly to exam
          let questions: MCQQuestion[] | undefined = undefined;
          if (e.questions) {
            try {
              const parsed = typeof e.questions === 'string' ? JSON.parse(e.questions) : e.questions;
              if (Array.isArray(parsed)) {
                questions = parsed.map((q: any) => ({
                  id: String(q.id || Math.random()),
                  question: q.question || q.title || '',
                  options: Array.isArray(q.options) ? q.options : [],
                  correctAnswer: typeof q.correct_answer === 'number' ? q.correct_answer : (q.correctAnswer || 0),
                  explanation: q.explanation || '',
                  subject: q.subject || e.subject || 'সাধারণ বিষয়',
                  cadre: ['all'],
                  difficulty: q.difficulty || 'medium',
                }));
              }
            } catch (err) {
              console.warn('Failed parsing questions array from exam row:', err);
            }
          }

          return {
            id: String(e.id),
            title: e.title || e.name || e.test_name || e.exam_title || 'মডেল টেস্ট',
            titleArabic: e.title_arabic || e.titleArabic || undefined,
            category: normalizedCategory,
            durationMinutes: Number(e.duration_minutes || e.durationMinutes || e.duration || e.time_limit || 30),
            totalQuestions: Number(e.total_questions || e.totalQuestions || e.questions_count || (questions ? questions.length : 30)),
            difficulty: e.difficulty || e.level || 'মাঝারি',
            participantsCount: e.participants_count || e.participantsCount || e.participants || '১,০০০+',
            subject: e.subject || e.subject_name || 'সাধারণ বিষয়',
            isPremium: Boolean(e.is_premium || e.isPremium || e.paid || normalizedCategory === 'premium'),
            thumbnailUrl: e.thumbnail_url || e.thumbnailUrl || undefined,
            scheduledTime: e.scheduled_time || e.scheduledTime || e.date || e.created_at || undefined,
            questions,
          };
        });
      }
    } catch (err) {
      console.warn(`Fetch from ${table} error:`, err);
    }
  }

  return null;
}

/**
 * Fetch Courses from Supabase if configured
 */
export async function fetchCoursesFromSupabase(): Promise<CourseItem[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((c: any) => ({
      id: String(c.id),
      title: c.title || c.name || '',
      titleArabic: c.title_arabic || c.titleArabic || undefined,
      cadre: c.cadre || 'all',
      instructor: c.instructor || 'তামরীন একাডেমি প্যানেল',
      totalModules: Number(c.total_modules || c.totalModules || 10),
      completedModules: Number(c.completed_modules || c.completedModules || 0),
      isPremium: Boolean(c.is_premium || c.isPremium),
      rating: Number(c.rating || 4.9),
      studentCount: Number(c.student_count || c.studentCount || 100),
      progressPercent: Number(c.progress_percent || c.progressPercent || 0),
      thumbnailBg: c.thumbnail_bg || c.thumbnailBg || 'from-teal-600 to-emerald-700',
      description: c.description || '',
      badgeType: c.badge_type || c.badgeType || 'recorded',
      detailsText: c.details_text || c.detailsText || '',
      priceText: c.price_text || c.priceText || '৳ ৯৯৯',
      isEnrolled: Boolean(c.is_enrolled || c.isEnrolled),
      isFreeCourse: Boolean(c.is_free_course || c.isFreeCourse),
      customPlans: c.custom_plans || [],
      customRoutines: c.custom_routines || [],
      customSyllabuses: c.custom_syllabuses || [],
      customSheets: c.custom_sheets || [],
      customExams: c.custom_exams || [],
    }));
  } catch (err) {
    console.error('Failed to fetch Courses from Supabase:', err);
    return null;
  }
}

/**
 * Save user exam submission result to Supabase
 */
export async function saveExamResultToSupabase(result: any): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('exam_results')
      .insert([{
        user_email: result.userEmail || 'guest@tamreen.com',
        score: result.score,
        total_questions: result.totalQuestions,
        correct_answers: result.correctAnswers,
        wrong_answers: result.wrongAnswers,
        skipped: result.skipped,
        time_taken_seconds: result.timeTakenSeconds,
        cadre: result.cadre,
        subject_filter: result.subjectFilter,
        created_at: new Date().toISOString()
      }]);

    return !error;
  } catch (err) {
    console.error('Failed to save exam result to Supabase:', err);
    return false;
  }
}
