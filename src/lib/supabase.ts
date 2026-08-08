import { createClient } from '@supabase/supabase-js';
import { MCQQuestion, CQQuestion, CourseItem, ExamItem } from '../types';

// Read env variables
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch MCQ Questions from Supabase if configured
 */
export async function fetchMcqQuestionsFromSupabase(): Promise<MCQQuestion[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('mcq_questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase MCQ fetch notice:', error?.message);
      return null;
    }

    return data.map((q: any) => ({
      id: q.id || String(Math.random()),
      question: q.question,
      questionArabic: q.question_arabic || undefined,
      options: q.options || [],
      optionsArabic: q.options_arabic || undefined,
      correctAnswer: typeof q.correct_answer === 'number' ? q.correct_answer : 0,
      explanation: q.explanation || '',
      explanationArabic: q.explanation_arabic || undefined,
      subject: q.subject || 'quran_hadith',
      cadre: Array.isArray(q.cadre) ? q.cadre : ['all'],
      yearTag: q.year_tag || undefined,
      difficulty: q.difficulty || 'medium',
    }));
  } catch (err) {
    console.error('Failed to fetch MCQs from Supabase:', err);
    return null;
  }
}

/**
 * Fetch Exams from Supabase if configured
 */
export async function fetchExamsFromSupabase(): Promise<ExamItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      titleArabic: e.title_arabic || undefined,
      category: e.category || 'free',
      durationMinutes: e.duration_minutes || 30,
      totalQuestions: e.total_questions || 30,
      difficulty: e.difficulty || 'মাঝারি',
      participantsCount: e.participants_count || '0 জন',
      subject: e.subject || 'সাধারণ বিষয়',
      isPremium: Boolean(e.is_premium),
      thumbnailUrl: e.thumbnail_url || undefined,
      scheduledTime: e.scheduled_time || undefined,
    }));
  } catch (err) {
    console.error('Failed to fetch Exams from Supabase:', err);
    return null;
  }
}

/**
 * Fetch Courses from Supabase if configured
 */
export async function fetchCoursesFromSupabase(): Promise<CourseItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      titleArabic: c.title_arabic || undefined,
      cadre: c.cadre || 'all',
      instructor: c.instructor || 'তামরীন একাডেমি প্যানেল',
      totalModules: c.total_modules || 10,
      completedModules: c.completed_modules || 0,
      isPremium: Boolean(c.is_premium),
      rating: c.rating || 4.9,
      studentCount: c.student_count || 100,
      progressPercent: c.progress_percent || 0,
      thumbnailBg: c.thumbnail_bg || 'from-teal-600 to-emerald-700',
      description: c.description || '',
      badgeType: c.badge_type || 'recorded',
      detailsText: c.details_text || '',
      priceText: c.price_text || '৳ ৯৯৯',
      isEnrolled: Boolean(c.is_enrolled),
      isFreeCourse: Boolean(c.is_free_course),
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
  if (!supabase) return false;
  try {
    const { error } = await supabase
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
