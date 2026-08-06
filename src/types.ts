export type PostCadre = 
  | 'all'
  | 'assistant_teacher_arabic' // সহকারী শিক্ষক - আরবি
  | 'lecturer_arabic'          // প্রভাষক - আরবি / হাদিস / ফিকহ
  | 'assistant_maulvi'          // সহকারী মৌলভী
  | 'ebtedayee_head'           // ইবতেদায়ী প্রধান / শিক্ষক
  | 'lecturer_islamic_history' // প্রভাষক - ইসলামী ইতিহাস
  | 'general_subject';         // সাধারণ বিষয় (বাংলা, ইংরেজি, গণিত, সাধারণ জ্ঞান)

export type SubjectCategory =
  | 'quran_hadith'    // আল-কুরআন ও আল-হাদিস
  | 'fiqh_usul'       // ফিকহ ও উসূলে ফিকহ
  | 'arabic_grammar'  // আরবি ভাষা ও সাহিত্য (নাহু, সরফ, বালাগাত)
  | 'islamic_history' // ইসলামী ইতিহাস ও সংস্কৃতি
  | 'bangla'          // বাংলা সাহিত্য ও ব্যাকরণ
  | 'english'         // English Language & Literature
  | 'mathematics'     // সাধারণ গণিত ও মানসিক দক্ষতা
  | 'general_knowledge'// বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি
  | 'ict_pedagogy';   // তথ্যপ্রযুক্তি ও পেডাগজি (শিক্ষাবিজ্ঞান)

export interface MCQQuestion {
  id: string;
  question: string;
  questionArabic?: string;
  options: string[];
  optionsArabic?: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  explanationArabic?: string;
  subject: SubjectCategory;
  cadre: PostCadre[];
  yearTag?: string; // e.g. "১৭তম মাদ্রাসা পরীক্ষা ২০২৩"
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CQQuestion {
  id: string;
  title: string;
  titleArabic?: string;
  subject: SubjectCategory;
  marks: number;
  cadre: PostCadre[];
  modelAnswer: string;
  modelAnswerArabic?: string;
  keyPoints: string[];
  yearTag?: string;
}

export interface GlossaryTerm {
  id: string;
  termArabic: string;
  termBangla: string;
  termEnglish: string;
  category: SubjectCategory;
  definitionBangla: string;
  exampleSentence?: string;
  quranicReference?: string;
}

export interface ExamResult {
  id: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  score: number;
  timeTakenSeconds: number;
  cadre: PostCadre;
  subjectFilter: string;
}

export interface Bookmark {
  id: string;
  type: 'mcq' | 'cq' | 'term';
  targetId: string;
  addedAt: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ustad';
  text: string;
  timestamp: string;
  isAudioSynthesized?: boolean;
}

export type NavTab = 
  | 'home'
  | 'exams'
  | 'courses'
  | 'ustad_ai'
  | 'mcq'
  | 'cq'
  | 'qbank'
  | 'glossary'
  | 'dashboard'
  | 'profile'
  | 'my_courses'
  | 'bookmarks'
  | 'wrong_questions'
  | 'history'
  | 'leaderboard'
  | 'premium'
  | 'settings'
  | 'deployment'
  | 'admin';

export type ExamCategory = 'daily' | 'free' | 'premium' | 'live' | 'upcoming' | 'completed';

export interface ExamItem {
  id: string;
  title: string;
  titleArabic?: string;
  category: ExamCategory;
  durationMinutes: number;
  totalQuestions: number;
  difficulty: 'সহজ' | 'মাঝারি' | 'কঠিন';
  participantsCount: string;
  subject: string;
  isPremium: boolean;
  thumbnailUrl?: string;
  scheduledTime?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  titleArabic?: string;
  cadre: PostCadre;
  instructor: string;
  totalModules: number;
  completedModules: number;
  isPremium: boolean;
  rating: number;
  studentCount: number;
  progressPercent: number;
  thumbnailBg: string;
  description: string;
  badgeType?: 'live' | 'exam' | 'recorded' | 'free';
  sheetsCount?: number;
  examsCount?: number;
  classesCount?: number;
  priceText?: string;
  isEnrolled?: boolean;
}

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  cadre: PostCadre;
  isPremium: boolean;
  joinedDate: string;
  totalSolvedQuestions: number;
  accuracyRate: number;
  streakDays: number;
  targetYear: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  type: 'exam' | 'course' | 'ai' | 'update';
}

