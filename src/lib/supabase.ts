import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MCQQuestion, CQQuestion, CourseItem, ExamItem } from '../types';

// Helper to race a promise with a timeout (essential for slow/flaky mobile data connections)
function withTimeout<T>(promiseLike: PromiseLike<T>, timeoutMs: number = 3500): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Network request timed out after ${timeoutMs}ms (mobile data / connection delay)`));
    }, timeoutMs);

    Promise.resolve(promiseLike)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Helper to get active Supabase credentials
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const metaEnv = (import.meta as any)?.env || {};
  const procEnv = (typeof process !== 'undefined' && process?.env) ? process.env : {};

  let url = metaEnv.VITE_SUPABASE_URL || procEnv.VITE_SUPABASE_URL || '';
  let anonKey = metaEnv.VITE_SUPABASE_ANON_KEY || procEnv.VITE_SUPABASE_ANON_KEY || '';

  // Fallback to localStorage if configured via UI
  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
    const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');
    if (localUrl && localKey) {
      url = localUrl;
      anonKey = localKey;
    }
  }

  return { url: url.trim(), anonKey: anonKey.trim() };
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

let cachedClient: SupabaseClient | null = null;
let cachedCredentialsKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (
    url &&
    anonKey &&
    url !== 'https://your-supabase-project.supabase.co' &&
    url.startsWith('https://')
  ) {
    const key = `${url}:${anonKey}`;
    if (!cachedClient || cachedCredentialsKey !== key) {
      cachedClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      });
      cachedCredentialsKey = key;
    }
    return cachedClient;
  }
  return null;
}

export const supabase = getSupabaseClient();

/**
 * Fetch MCQ Questions from Supabase if configured (with parallel queries & offline cache for mobile data)
 */
export async function fetchMcqQuestionsFromSupabase(): Promise<MCQQuestion[] | null> {
  // Check local cache first for instant mobile load
  let cached: MCQQuestion[] | null = null;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('tamreen_cached_mcqs');
      if (saved) cached = JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse cached MCQs:', e);
    }
  }

  const client = getSupabaseClient();
  if (!client) return cached;

  const tablesToTry = ['mcq_questions', 'questions', 'question_bank'];
  
  // Parallel fetch across tables for mobile data speed
  const results = await Promise.allSettled(
    tablesToTry.map(table =>
      withTimeout(
        client
          .from(table)
          .select('*')
          .order('created_at', { ascending: false }),
        5000
      )
    )
  );

  for (const res of results) {
    if (res.status === 'fulfilled' && !res.value.error && Array.isArray(res.value.data) && res.value.data.length > 0) {
      const formatted: MCQQuestion[] = res.value.data.map((q: any) => ({
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

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tamreen_cached_mcqs', JSON.stringify(formatted));
        } catch (e) {
          console.warn('Cache write failed:', e);
        }
      }

      return formatted;
    }
  }

  return cached;
}

/**
 * Helper to robustly parse raw question objects from Supabase (Admin Panel or DB) into MCQQuestion
 */
export function parseQuestionObject(q: any): MCQQuestion {
  const id = String(q.id || q.question_id || q.mcq_id || Math.random());
  const question = q.question || q.title || q.question_text || q.text || q.question_bn || q.question_en || q.stem || q.mcq || q.qs || q.question_title || q.question_name || '';
  const questionArabic = q.question_arabic || q.questionArabic || undefined;

  let options: string[] = [];
  const rawOpts = q.options || q.options_json || q.option_list || q.choices || q.answers;

  if (Array.isArray(rawOpts)) {
    options = rawOpts.map((opt: any) => typeof opt === 'string' ? opt : (opt?.text || opt?.option || opt?.title || opt?.choice || String(opt)));
  } else if (typeof rawOpts === 'string') {
    try {
      const trimmed = rawOpts.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsedOpts = JSON.parse(trimmed);
        if (Array.isArray(parsedOpts)) {
          options = parsedOpts.map((opt: any) => typeof opt === 'string' ? opt : (opt?.text || opt?.option || opt?.title || opt?.choice || String(opt)));
        } else if (typeof parsedOpts === 'object' && parsedOpts !== null) {
          options = Object.values(parsedOpts).map((val: any) => typeof val === 'string' ? val : (val?.text || val?.option || String(val)));
        }
      } else {
        options = trimmed.split(',').map(s => s.trim()).filter(Boolean);
      }
    } catch (e) {
      options = [rawOpts];
    }
  } else if (typeof rawOpts === 'object' && rawOpts !== null) {
    options = Object.values(rawOpts).map((val: any) => typeof val === 'string' ? val : (val?.text || val?.option || String(val)));
  } else {
    const candidateOpts = [
      q.option1 || q.option_1 || q.option_a || q.a || q.opt1 || q.op1,
      q.option2 || q.option_2 || q.option_b || q.b || q.opt2 || q.op2,
      q.option3 || q.option_3 || q.option_c || q.c || q.opt3 || q.op3,
      q.option4 || q.option_4 || q.option_d || q.d || q.opt4 || q.op4,
    ].filter(Boolean);
    options = candidateOpts.map(String);
  }

  const optionsArabic = q.options_arabic || q.optionsArabic || undefined;

  let correctAnswer = 0;
  const rawAns = q.correct_answer ?? q.correctAnswer ?? q.answer ?? q.correct_option ?? q.right_answer ?? q.correct ?? q.ans ?? q.correct_ans ?? q.answer_index ?? q.correctIndex;

  if (typeof rawAns === 'number') {
    correctAnswer = rawAns;
  } else if (typeof rawAns === 'string') {
    const cleanAns = rawAns.trim().toLowerCase();
    if (['a', '1', 'ক', 'option1', 'option_1', 'option_a'].includes(cleanAns)) correctAnswer = 0;
    else if (['b', '2', 'খ', 'option2', 'option_2', 'option_b'].includes(cleanAns)) correctAnswer = 1;
    else if (['c', '3', 'গ', 'option3', 'option_3', 'option_c'].includes(cleanAns)) correctAnswer = 2;
    else if (['d', '4', 'ঘ', 'option4', 'option_4', 'option_d'].includes(cleanAns)) correctAnswer = 3;
    else if (!isNaN(Number(cleanAns))) {
      const num = Number(cleanAns);
      correctAnswer = num >= 1 && num <= 4 ? num - 1 : num;
    } else {
      const foundIdx = options.findIndex(opt => opt.trim().toLowerCase() === cleanAns);
      if (foundIdx >= 0) correctAnswer = foundIdx;
    }
  }

  const explanation = q.explanation || q.answer_explanation || q.explain || q.explanation_bn || q.exp || q.details || '';
  const explanationArabic = q.explanation_arabic || q.explanationArabic || undefined;

  return {
    id,
    question,
    questionArabic,
    options,
    optionsArabic,
    correctAnswer: Math.max(0, Math.min(Math.max(0, options.length - 1), correctAnswer)),
    explanation,
    explanationArabic,
    subject: q.subject || 'সাধারণ বিষয়',
    cadre: ['all'],
    difficulty: q.difficulty || 'medium',
  };
}

/**
 * Fetch Questions for a specific exam from relational tables without 400 Bad Request errors
 */
export async function fetchQuestionsForExam(examId: string, examTitle?: string): Promise<MCQQuestion[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const qTablesToTry = ['questions', 'mcq_questions', 'exam_questions', 'model_test_questions', 'quiz_questions', 'test_questions', 'mcqs', 'question_bank'];
  const numExamId = !isNaN(Number(examId)) ? Number(examId) : null;

  for (const qTable of qTablesToTry) {
    try {
      // 1. Query column-specific matches individually to avoid 400 Bad Request if a column is missing
      const idFields = ['exam_id', 'test_id', 'model_test_id', 'quiz_id'];
      for (const field of idFields) {
        let res = await withTimeout(client.from(qTable).select('*').eq(field, examId), 2500).catch(() => null);
        if (!res || res.error || !Array.isArray(res.data) || res.data.length === 0) {
          if (numExamId !== null) {
            res = await withTimeout(client.from(qTable).select('*').eq(field, numExamId), 2000).catch(() => null);
          }
        }
        if (res && !res.error && Array.isArray(res.data) && res.data.length > 0) {
          console.log(`[Supabase Question Fetch] Loaded ${res.data.length} question(s) from table "${qTable}" using field "${field}=${examId}"`);
          return res.data.map((q: any) => parseQuestionObject(q));
        }
      }

      // 2. Query title fields individually if examTitle is provided
      if (examTitle && examTitle.trim()) {
        const cleanTitle = examTitle.trim();
        const titleFields = ['exam_title', 'test_name', 'exam_name', 'subject', 'model_test_title'];
        for (const tField of titleFields) {
          const res = await withTimeout(client.from(qTable).select('*').eq(tField, cleanTitle), 2000).catch(() => null);
          if (res && !res.error && Array.isArray(res.data) && res.data.length > 0) {
            console.log(`[Supabase Question Fetch] Loaded ${res.data.length} question(s) from table "${qTable}" using title field "${tField}=${cleanTitle}"`);
            return res.data.map((q: any) => parseQuestionObject(q));
          }
        }
      }

      // 3. Fallback: Select all rows from table and filter in JS
      const allRes = await withTimeout(client.from(qTable).select('*').limit(500), 2500).catch(() => null);
      if (allRes && !allRes.error && Array.isArray(allRes.data) && allRes.data.length > 0) {
        const filtered = allRes.data.filter((q: any) => {
          const qExamId = String(q.exam_id ?? q.test_id ?? q.model_test_id ?? q.quiz_id ?? q.examId ?? '');
          if (qExamId && (qExamId === String(examId) || (numExamId !== null && Number(qExamId) === numExamId))) {
            return true;
          }
          if (examTitle) {
            const qTitle = String(q.exam_title ?? q.test_name ?? q.exam_name ?? q.model_test_title ?? '').trim();
            if (qTitle && qTitle.toLowerCase() === examTitle.trim().toLowerCase()) {
              return true;
            }
          }
          return false;
        });

        if (filtered.length > 0) {
          console.log(`[Supabase Question Fetch] Loaded ${filtered.length} question(s) from table "${qTable}" via in-memory filter`);
          return filtered.map((q: any) => parseQuestionObject(q));
        }
      }
    } catch (err) {
      // Continue trying next candidate table
    }
  }

  return null;
}

/**
 * Fetch Exams from Supabase (queries 'exams', 'model_tests', 'quizzes', 'tests', 'mock_tests', 'exam_list', 'mcq_exams')
 */
export async function fetchExamsFromSupabase(): Promise<ExamItem[] | null> {
  const { url } = getSupabaseCredentials();
  console.log(`[Supabase Production Sync] Fetching published exams from project URL: "${url || 'NOT_CONFIGURED'}"`);

  // Check local cache first
  let cached: ExamItem[] | null = null;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('tamreen_cached_exams');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const hasLegacyMocks = parsed.some((e: any) => 
            ['e1', 'e2', 'e3', 'e4', 'm1', 'm2', 'm3', 'm4', 'm5', 'l1', 'f1', 'f2'].includes(e.id) ||
            (e.title && (e.title.includes('ইবতেদায়ী শিক্ষকমণ্ডলী') || e.title.includes('সহকারী শিক্ষক (আরবি)') || e.title.includes('প্রভাষক (আরবি)')))
          );
          if (hasLegacyMocks) {
            localStorage.removeItem('tamreen_cached_exams');
          } else {
            cached = parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached exams:', e);
      localStorage.removeItem('tamreen_cached_exams');
    }
  }

  const client = getSupabaseClient();
  if (!client) {
    console.warn(`[Supabase Production Sync] Client not initialized. Returning cached or empty list.`);
    return cached || [];
  }

  const tablesToTry = ['exams', 'model_tests', 'quizzes', 'tests', 'mock_tests', 'exam_list', 'mcq_exams', 'course_exams'];
  const aggregatedExams: ExamItem[] = [];
  const seenIds = new Set<string>();

  // Execute queries in parallel for all candidate tables for mobile data speed
  const tableResults = await Promise.allSettled(
    tablesToTry.map(table =>
      withTimeout(
        client.from(table).select('*').order('created_at', { ascending: false }),
        5000
      ).catch(() =>
        withTimeout(client.from(table).select('*'), 3000).catch(() => null)
      )
    )
  );

  for (const res of tableResults) {
    if (res.status === 'fulfilled' && res.value && !res.value.error && Array.isArray(res.value.data) && res.value.data.length > 0) {
      for (const e of res.value.data) {
        const rawId = String(e.id || e.exam_id || Math.random());
        if (seenIds.has(rawId)) continue;

        // Requirement 7: Only show exams with status = 'published'
        const rawStatus = (e.status || e.exam_status || e.publish_status || e.state || '').toString().trim().toLowerCase();
        const isPublishedBool = e.is_published ?? e.published ?? e.isPublished;

        // If status field is present in the record, it must equal 'published' (or 'active'/'live' for legacy compatibility)
        if (rawStatus && rawStatus !== 'published' && rawStatus !== 'active' && rawStatus !== 'live') {
          console.log(`[Supabase Production Sync] Excluded exam ID "${rawId}" (title: "${e.title || 'Untitled'}") because status="${rawStatus}" (not 'published')`);
          continue;
        }

        // If explicit boolean is_published is false, filter out
        if (isPublishedBool === false) {
          console.log(`[Supabase Production Sync] Excluded exam ID "${rawId}" (title: "${e.title || 'Untitled'}") because is_published=false`);
          continue;
        }

        seenIds.add(rawId);

        let rawCategory = (e.category || e.type || e.exam_type || e.exam_category || e.tag || 'free').toString().toLowerCase();
        let normalizedCategory: any = 'free';

        if (rawCategory.includes('daily') || rawCategory.includes('model') || rawCategory.includes('মডেল') || rawCategory.includes('দৈনিক')) {
          normalizedCategory = 'daily';
        } else if (rawCategory.includes('live') || rawCategory.includes('লাইভ')) {
          normalizedCategory = 'live';
        } else if (rawCategory.includes('premium') || rawCategory.includes('paid') || Boolean(e.is_premium || e.isPremium || e.paid)) {
          normalizedCategory = 'premium';
        } else {
          normalizedCategory = 'free';
        }

        // Parse questions if attached directly to exam row
        let questions: MCQQuestion[] | undefined = undefined;
        const rawQuestions = e.questions || e.question_list || e.mcqs || e.question_data || e.questions_json || e.mcq_list || e.question_bank || e.items || e.quiz_questions || e.data || e.questions_data || e.mcq_data || e.all_questions;
        if (rawQuestions) {
          try {
            const parsed = typeof rawQuestions === 'string' ? JSON.parse(rawQuestions) : rawQuestions;
            if (Array.isArray(parsed) && parsed.length > 0) {
              questions = parsed.map((q: any) => parseQuestionObject(q));
            }
          } catch (err) {
            console.warn('Failed parsing questions array from exam row:', err);
          }
        }

        // If no direct questions on exam row, attempt fetching relational questions from DB
        if (!questions || questions.length === 0) {
          try {
            const relQuestions = await fetchQuestionsForExam(rawId, e.title || e.name || e.test_name || e.exam_title);
            if (relQuestions && relQuestions.length > 0) {
              questions = relQuestions;
            }
          } catch (relErr) {
            console.warn('Failed fetching relational questions for exam:', relErr);
          }
        }

        const recordQCount = Number(e.total_questions || e.totalQuestions || e.questions_count || e.question_count || 0);
        const actualQuestionCount = (questions && questions.length > 0)
          ? questions.length
          : (recordQCount > 0 ? recordQCount : 0);

        aggregatedExams.push({
          id: rawId,
          title: e.title || e.name || e.test_name || e.exam_title || e.subject || 'মডেল টেস্ট',
          titleArabic: e.title_arabic || e.titleArabic || undefined,
          category: normalizedCategory,
          durationMinutes: Number(e.duration_minutes || e.durationMinutes || e.duration || e.time_limit || e.time || 30),
          totalQuestions: actualQuestionCount,
          difficulty: e.difficulty || e.level || 'মাঝারি',
          participantsCount: String(e.participants_count || e.participantsCount || e.participants || '০'),
          subject: e.subject || e.subject_name || e.topic || 'সাধারণ বিষয়',
          isPremium: Boolean(e.is_premium || e.isPremium || e.paid || normalizedCategory === 'premium'),
          thumbnailUrl: e.thumbnail_url || e.thumbnailUrl || e.image || undefined,
          scheduledTime: e.scheduled_time || e.scheduledTime || e.date || e.created_at || e.exam_date || undefined,
          questions,
        });
      }
    }
  }

  const fetchedIds = aggregatedExams.map(e => e.id);
  console.log(`[Supabase Production Sync] Successfully fetched ${aggregatedExams.length} published exam(s) from project URL: "${url}". Exam IDs:`, fetchedIds);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('tamreen_cached_exams', JSON.stringify(aggregatedExams));
    } catch (e) {
      console.warn('Cache write failed:', e);
    }
  }

  return aggregatedExams;
}

/**
 * Fetch Courses from Supabase if configured
 */
export async function fetchCoursesFromSupabase(): Promise<CourseItem[] | null> {
  let cached: CourseItem[] | null = null;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('tamreen_cached_courses');
      if (saved) cached = JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse cached courses:', e);
    }
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return cached;
  }

  const client = getSupabaseClient();
  if (!client) return cached;

  try {
    const queryPromise = client
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await withTimeout(queryPromise, 5000);

    if (error || !data) return cached;

    const formatted: CourseItem[] = data.map((c: any) => ({
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

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tamreen_cached_courses', JSON.stringify(formatted));
      } catch (e) {
        console.warn('Cache write failed:', e);
      }
    }

    return formatted;
  } catch (err) {
    console.warn('Failed to fetch Courses from Supabase (mobile timeout/error):', err);
    return cached;
  }
}

/**
 * Save user exam submission result to Supabase
 */
export async function saveExamResultToSupabase(result: any): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const insertPromise = client
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

    const { error } = await withTimeout(insertPromise, 4000);
    return !error;
  } catch (err) {
    console.error('Failed to save exam result to Supabase:', err);
    return false;
  }
}

