import React, { useState, useEffect, useRef } from 'react';
import { CourseItem, PostCadre, CourseContentItem, MCQQuestion } from '../types';
import { getStoredCourses, saveCoursesToStorage } from '../data/coursesData';
import { QUESTION_BANK } from '../data/questionBank';
import { Logo } from './Logo';
import { LeaderboardView } from './LeaderboardView';
import { CbtExamRunner } from './CbtExamRunner';
import { ExtendedExamItem } from './ExamsView';
import { formatArabicText } from '../utils/arabic';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Users, 
  Star, 
  Crown, 
  Search, 
  CheckCircle2, 
  XCircle,
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers,
  Video,
  FileText,
  FileSpreadsheet,
  Check,
  Zap,
  Book,
  PenTool,
  HelpCircle,
  Download,
  Library,
  BookOpenCheck,
  ScrollText,
  Calendar,
  BookmarkCheck,
  School,
  Globe,
  ArrowLeft,
  Lock,
  Unlock,
  Trophy,
  ShieldCheck,
  Settings,
  Medal,
  Flame,
  Award,
  Target,
  TrendingUp,
  RotateCcw,
  X,
  AlertCircle
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const [selectedCadre, setSelectedCadre] = useState<PostCadre | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);
  const [detailTab, setDetailTab] = useState<'plan' | 'routine' | 'syllabus' | 'sheets' | 'exams' | 'leaderboard'>('plan');
  const [showEnrollAlert, setShowEnrollAlert] = useState(false);

  // Exam Attempt States & Modals for Course Exams Tab
  const [examAttempts, setExamAttempts] = useState<Record<string, {
    score: number;
    maxScore: number;
    userAnswers: Record<number, number>;
    completedAt: string;
    attemptsCount: number;
  }>>(() => {
    try {
      const saved = localStorage.getItem('tamreen_course_exam_attempts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load course exam attempts', e);
    }
    return {};
  });

  const [runningExamModal, setRunningExamModal] = useState<{
    exam: CourseContentItem;
    isRetake: boolean;
  } | null>(null);

  const [reviewExamModal, setReviewExamModal] = useState<{
    exam: CourseContentItem;
    attempt: {
      score: number;
      maxScore: number;
      userAnswers: Record<number, number>;
      completedAt: string;
    };
    questions: MCQQuestion[];
  } | null>(null);

  const [examLeaderboardModal, setExamLeaderboardModal] = useState<{
    exam: CourseContentItem;
  } | null>(null);

  const getExamQuestions = (examItem: CourseContentItem): MCQQuestion[] => {
    if (QUESTION_BANK.length === 0) return [];
    const charSum = examItem.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const startIdx = charSum % Math.max(1, QUESTION_BANK.length - 8);
    return QUESTION_BANK.slice(startIdx, startIdx + 10);
  };

  const handleFinishCourseExam = (
    examItem: CourseContentItem,
    score: number,
    maxScore: number,
    userAnswers: Record<number, number>,
    isRetake: boolean
  ) => {
    if (!activeCourse) return;
    const key = `${activeCourse.id}_${examItem.id}`;
    
    setExamAttempts((prev) => {
      const existing = prev[key];
      const attemptsCount = existing ? existing.attemptsCount + 1 : 1;
      // On first attempt, we save the first score. On retake, we preserve the original score for leaderboard points.
      const firstScore = existing ? existing.score : score;

      const updated = {
        ...prev,
        [key]: {
          score: firstScore,
          maxScore,
          userAnswers,
          completedAt: new Date().toISOString(),
          attemptsCount,
        }
      };

      try {
        localStorage.setItem('tamreen_course_exam_attempts', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      return updated;
    });

    setRunningExamModal(null);
  };

  const cadreScrollRef = useRef<HTMLDivElement>(null);

  const scrollCadresRight = () => {
    if (cadreScrollRef.current) {
      cadreScrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const [coursesList, setCoursesList] = useState<CourseItem[]>(() => getStoredCourses());

  // Listen for admin edits dynamically across views
  useEffect(() => {
    const reloadCourses = () => {
      const updated = getStoredCourses();
      setCoursesList(updated);
      if (activeCourse) {
        const refreshed = updated.find((c) => c.id === activeCourse.id);
        if (refreshed) setActiveCourse(refreshed);
      }
    };

    window.addEventListener('tamreen_courses_updated', reloadCourses);
    return () => window.removeEventListener('tamreen_courses_updated', reloadCourses);
  }, [activeCourse]);

  const handleEnrollCourse = (courseId: string) => {
    const updated = coursesList.map((c) => (c.id === courseId ? { ...c, isEnrolled: true, studentCount: c.studentCount + 1 } : c));
    setCoursesList(updated);
    saveCoursesToStorage(updated);
    if (activeCourse?.id === courseId) {
      setActiveCourse({ ...activeCourse, isEnrolled: true, studentCount: activeCourse.studentCount + 1 });
    }
  };

  // Listen for popstate to close active course modal when back button is pressed
  React.useEffect(() => {
    const handlePopState = () => {
      if (activeCourse) {
        setActiveCourse(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeCourse]);

  const cadreCategories = [
    { 
      id: 'all', 
      label: 'সকল বিষয়', 
      icon: Library,
      bgColor: 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
    },
    { 
      id: 'lecturer_arabic', 
      label: 'আরবি প্রভাষক', 
      icon: BookOpenCheck,
      bgColor: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
    },
    { 
      id: 'assistant_maulvi', 
      label: 'সহকারী মৌলবি', 
      icon: ScrollText,
      bgColor: 'bg-rose-100/90 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
    },
    { 
      id: 'ebtedayee_head', 
      label: 'ইবতেদায়ী মৌলবি', 
      icon: School,
      bgColor: 'bg-amber-100/90 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
    },
    { 
      id: 'general_subject', 
      label: 'জেনারেল বিষয়', 
      icon: Globe,
      bgColor: 'bg-indigo-100/90 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
    },
  ];

  const filteredCourses = coursesList.filter((c) => {
    const matchesCadre = selectedCadre === 'all' || c.cadre === selectedCadre;
    const matchesQuery = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCadre && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">

      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-4 text-white shadow-md border border-emerald-600/30 flex items-center justify-between">
        <div className="space-y-0.5 z-10">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-extrabold tracking-widest text-emerald-200 uppercase">
              তামরীন একাডেমি
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
            আমাদের কোর্স সমূহ
          </h1>
        </div>
        <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 z-10">
          <GraduationCap className="w-6 h-6 stroke-[2.2]" />
        </div>
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* 1. TOP HEADER & SUBJECT SELECTOR SECTION                  */}
      {/* ========================================================= */}
      <div className="space-y-4">
        
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            বিষয় নির্বাচন করুন
          </h2>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {filteredCourses.length}টি কোর্স সহজলভ্য
          </span>
        </div>

        {/* Horizontal Category Cards Row */}
        <div className="relative">
          <div 
            ref={cadreScrollRef}
            className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
          >
            {cadreCategories.map((cadre) => {
              const IconComp = cadre.icon;
              const isSelected = selectedCadre === cadre.id;
              return (
                <button
                  key={cadre.id}
                  onClick={() => setSelectedCadre(cadre.id as any)}
                  className={`shrink-0 min-w-[125px] sm:min-w-[140px] p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col items-center justify-center space-y-2 text-center active:scale-95 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${cadre.bgColor} shadow-sm transition-transform ${isSelected ? 'scale-110' : ''}`}>
                    <IconComp className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold leading-snug ${isSelected ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-slate-700 dark:text-slate-300'}`}>
                    {cadre.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Arrow Indicator Button */}
          <button
            onClick={scrollCadresRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg border border-slate-200 dark:border-slate-700 hidden sm:flex items-center justify-center hover:bg-slate-50 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-slate-800 dark:text-slate-100" />
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. COURSE CARDS LIST (EXACT MATCH FOR USER SCREENSHOT)     */}
      {/* ========================================================= */}
      <div className="space-y-3">
        {filteredCourses.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              এই ক্যাটাগরিতে কোনো কোর্স পাওয়া যায়নি।
            </p>
            <button
              onClick={() => setSelectedCadre('all')}
              className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 underline"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          filteredCourses.map((course) => {
            // Determine border accent, card background, and thumbnail styling based on enrollment & badge
            const isEnrolled = course.isEnrolled;
            
            const borderAccentClass = isEnrolled
              ? 'border-l-[5px] border-l-emerald-600 dark:border-l-emerald-500'
              : course.badgeType === 'recorded'
              ? 'border-l-[5px] border-l-purple-600 dark:border-l-purple-500'
              : 'border-l-[5px] border-l-amber-500 dark:border-l-amber-400';

            const cardBgClass = isEnrolled
              ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50'
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/90';

            return (
              <div
                key={course.id}
                onClick={() => {
                  setActiveCourse(course);
                  window.history.pushState({ tab: 'courses', subview: 'courseDetail' }, '', `#course-${course.id}`);
                }}
                className={`group cursor-pointer ${cardBgClass} rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.985] transition-all duration-200 p-2.5 sm:p-3.5 ${borderAccentClass} flex items-center space-x-3 sm:space-x-4`}
              >
                {/* Left Thumbnail Banner Emblem Box */}
                <div className={`w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl ${
                  isEnrolled 
                    ? 'bg-gradient-to-br from-emerald-100/80 via-teal-50 to-slate-100 dark:from-slate-800 dark:via-emerald-950/60 dark:to-slate-900 border-emerald-200/90 dark:border-emerald-800/70' 
                    : 'bg-gradient-to-br from-amber-50/90 via-amber-100/40 to-slate-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-slate-200/80 dark:border-slate-700/80'
                } p-2 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-inner transform group-hover:scale-[1.03] transition-transform duration-300 ease-out`}>
                  
                  {/* Logo mark */}
                  <div className={`w-6 h-6 rounded-full ${
                    isEnrolled
                      ? 'bg-emerald-700 text-white border border-emerald-400'
                      : 'bg-slate-900 text-amber-400 border border-amber-400/60'
                  } flex items-center justify-center p-0.5 shadow-sm mt-0.5`}>
                    <Logo variant="icon" size="xs" />
                  </div>

                  {/* Ribbon Badge Banner */}
                  <div className={`w-full ${
                    isEnrolled
                      ? 'bg-emerald-800 text-emerald-50 border-emerald-600/50'
                      : 'bg-[#1e293b] text-white border-amber-400/40'
                  } py-0.5 px-1 rounded text-[8px] sm:text-[9px] font-extrabold tracking-tight truncate border shadow-xs`}>
                    {course.badgeType === 'exam' ? 'এক্সাম ব্যাচ-১' : course.badgeType === 'recorded' ? 'রেকর্ডেড ব্যাচ' : 'ফ্রি এক্সাম ব্যাচ'}
                  </div>

                  {/* Course Title Line inside graphic */}
                  <p className="text-[9px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight px-0.5">
                    {course.title}
                  </p>

                  {/* Bottom ornament line */}
                  <div className={`w-8 h-0.5 ${isEnrolled ? 'bg-emerald-500' : 'bg-amber-400/80'} rounded-full mb-0.5`} />
                </div>

                {/* Right Details Container */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-2">
                  
                  {/* Title */}
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug truncate">
                    {course.title}
                  </h3>

                  {/* Enrolled Badge OR Student Count Tag */}
                  <div className="space-y-1">
                    {!course.isEnrolled && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          course.badgeType === 'recorded'
                            ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-200'
                            : 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200'
                        }`}>
                          <Users className="w-3 h-3 text-current" />
                          <span>{course.studentCount} জন ভর্তি</span>
                        </span>
                      </div>
                    )}

                    {/* Meta info (classes, sheets, exams) */}
                    <div className="text-slate-500 dark:text-slate-400 font-medium text-[11px] sm:text-xs flex items-center space-x-2">
                      {course.classesCount && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{course.classesCount} ক্লাস</span>
                        </span>
                      )}
                      {course.sheetsCount && (
                        <span className="flex items-center space-x-1">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span>{course.sheetsCount} শিট</span>
                        </span>
                      )}
                      {course.examsCount && (
                        <span className="flex items-center space-x-1">
                          <FileSpreadsheet className="w-3 h-3 text-slate-400" />
                          <span>{course.examsCount} পরীক্ষা</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Status/Price on Left & Button on Right */}
                  <div className="pt-1 flex items-center justify-between">
                    
                    {/* Left: Enrolled Badge or Price */}
                    <div>
                      {course.isEnrolled ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 text-[11px] sm:text-xs font-extrabold">
                          <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-700 dark:text-emerald-400" />
                          <span>ভর্তি সম্পন্ন</span>
                        </span>
                      ) : (
                        <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                          {course.priceText || 'ফ্রি'}
                        </span>
                      )}
                    </div>

                    {/* Right: Primary Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCourse(course);
                        window.history.pushState({ tab: 'courses', subview: 'courseDetail' }, '', `#course-${course.id}`);
                      }}
                      className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl font-extrabold text-xs shadow-sm transition-all group-hover:scale-[1.04] active:scale-90 flex items-center space-x-1 ${
                        isEnrolled
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-600/20'
                          : 'bg-[#132238] hover:bg-[#0b1526] text-white dark:bg-slate-800 dark:hover:bg-slate-700'
                      }`}
                    >
                      {course.isEnrolled ? (
                        <>
                          <Play className="w-3 h-3 fill-white shrink-0" />
                          <span>প্রবেশ করুন</span>
                        </>
                      ) : (
                        <span>বিস্তারিত</span>
                      )}
                    </button>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. COURSE DETAIL SCREEN (FULL VIEW)                      */}
      {/* ========================================================= */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-3 sm:p-6 pb-28 animate-in fade-in duration-200">
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveCourse(null);
                  window.history.pushState({ tab: 'courses' }, '', '#courses');
                }}
                className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-extrabold text-xs sm:text-sm py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-850 transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span>হোমে ফিরুন</span>
              </button>

              {activeCourse.isEnrolled && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>ভর্তি সক্রিয়</span>
                </span>
              )}
            </div>

            {/* Banner Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
              
              {/* Premium Compact Graphic/Image Poster Banner */}
              <div className="relative w-full h-40 sm:h-52 bg-slate-950 rounded-t-3xl overflow-hidden flex items-end">
                {activeCourse.bannerUrl ? (
                  <img
                    src={activeCourse.bannerUrl}
                    alt={activeCourse.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-5 sm:p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-sm flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-slate-950" />
                        <span>{activeCourse.badgeType === 'exam' ? 'পরীক্ষা ব্যাচ' : activeCourse.badgeType === 'recorded' ? 'রেকর্ডেড ব্যাচ' : 'ফ্রি ব্যাচ'}</span>
                      </span>
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 shadow-lg flex items-center justify-center">
                        <Logo variant="icon" size="sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />

                {/* Top Right Batch Badge if bannerUrl is present */}
                {activeCourse.bannerUrl && (
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black shadow-md z-10">
                    {activeCourse.badgeType === 'exam' ? 'এক্সাম ব্যাচ' : activeCourse.badgeType === 'recorded' ? 'রেকর্ডেড ব্যাচ' : 'ফ্রি ব্যাচ'}
                  </div>
                )}

                {/* Floating Info Badges INSIDE Banner */}
                <div className="relative z-10 p-3 sm:p-4 w-full flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-black shadow-xs">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeCourse.sheetsCount || 20} শিট</span>
                  </div>

                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-xs font-black shadow-xs">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeCourse.examsCount || 25} পরীক্ষা</span>
                  </div>

                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-sky-400/40 text-sky-300 text-[10px] sm:text-xs font-black shadow-xs">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                    <span>৭ ফুল মডেল</span>
                  </div>

                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-slate-200 text-[10px] sm:text-xs font-bold shadow-xs ml-auto">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeCourse.studentCount} জন</span>
                  </div>
                </div>

              </div>

              {/* Title & Instructor Info Header below Banner */}
              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                  {activeCourse.title}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                  <span>৯ম শিক্ষক নিয়োগ</span>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{activeCourse.instructor}</span>
                </p>
              </div>

            </div>

            {/* Sub-Nav Action Buttons */}
            {/* Selected tab turns GREEN as requested */}
            {/* Leaderboard tab is shown ONLY if enrolled */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'plan', label: 'কোর্স সম্পর্কে বিস্তারিত', icon: ScrollText },
                { id: 'routine', label: 'রুটিন', icon: Calendar },
                { id: 'syllabus', label: 'সিলেবাস', icon: BookmarkCheck },
                { id: 'sheets', label: 'লেকচার শিট', icon: FileText },
                { id: 'exams', label: 'পরীক্ষা', icon: PenTool },
                ...(activeCourse.isEnrolled ? [{ id: 'leaderboard', label: 'লিডারবোর্ড', icon: Trophy }] : [])
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = detailTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center space-x-2 whitespace-nowrap transition-all duration-200 active:scale-95 shadow-2xs ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/40'
                        : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="space-y-2.5">
              
              {/* PLAN / COURSE DETAILS TAB */}
              {detailTab === 'plan' && (
                <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
                  <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <ScrollText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                        কোর্স সম্পর্কে বিস্তারিত
                      </h3>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                        {activeCourse.title}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap pt-1">
                    {activeCourse.detailsText || activeCourse.description || 'এই কোর্স সম্পর্কিত বিস্তারিত কোনো বিবরণ প্রদান করা হয়নি। এডমিন প্যানেল থেকে বিবরণ যুক্ত করুন।'}
                  </div>
                </div>
              )}

              {/* ROUTINE TAB */}
              {detailTab === 'routine' && (() => {
                const isRoutineUnlocked = activeCourse.isEnrolled || activeCourse.isRoutineLocked === false;
                const defaultRoutineText = `📅 ${activeCourse.title} - লাইভ ক্লাস ও পরীক্ষা রুটিন:\n\n• শনি-সোম-বুধ (রাত ৮:০০ টা): বিষয়ভিত্তিক লাইভ ক্লাস\n• রবি-মঙ্গল-বৃহস্পতি (রাত ৮:০০ টা): প্রশ্ন সমাধান ও ওস্তাদ সলভ সেসন\n• প্রতিদিন রাত ৯:৩০ টা: বিষয়ভিত্তিক অনলাইন এক্সাম (২০ নম্বর)\n• শুক্রবার রাত ৮:০০ টা: সাপ্তাহিক পূর্ণাঙ্গ মডেল টেস্ট (১০০ নম্বর)`;
                const routineTextToDisplay = activeCourse.routineText || defaultRoutineText;
                const routinesToRender = activeCourse.customRoutines || [];

                const handleRoutineDownload = () => {
                  if (!isRoutineUnlocked) {
                    setShowEnrollAlert(true);
                    return;
                  }
                  const element = document.createElement("a");
                  const file = new Blob([routineTextToDisplay], { type: 'text/plain;charset=utf-8' });
                  element.href = URL.createObjectURL(file);
                  element.download = `${activeCourse.title}_Routine.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                };

                return (
                  <div className="space-y-3">
                    {/* Routine Main Card with Download Button */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                              কোর্স রুটিন ও সময়সূচি
                            </h3>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                              {activeCourse.title}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRoutineDownload}
                          className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-2xs transition-all active:scale-95 ${
                            !isRoutineUnlocked
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {!isRoutineUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                          <span>রুটিন ডাউনলোড করুন</span>
                        </button>
                      </div>

                      {/* Direct Written Routine Text */}
                      <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-850/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {routineTextToDisplay}
                      </div>
                    </div>

                    {/* Additional Routine Files if any */}
                    {routinesToRender.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1">অন্যান্য রুটিন ফাইলসমূহ</h4>
                        {routinesToRender.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (!isRoutineUnlocked) setShowEnrollAlert(true);
                              else handleRoutineDownload();
                            }}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-300"
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                            <Download className="w-4 h-4 text-emerald-600" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* SYLLABUS TAB */}
              {detailTab === 'syllabus' && (() => {
                const isSyllabusUnlocked = activeCourse.isEnrolled || activeCourse.isSyllabusLocked === false;
                const defaultSyllabusText = `📖 ${activeCourse.title} - সম্পূর্ণ সিলেবাস ও মানবণ্টন:\n\n১. সাধারণ অংশ (৫০ নম্বর):\n   - বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান।\n\n২. বিষয়ভিত্তিক অংশ (৫০ নম্বর):\n   - সংশিষ্ট বিষয়ের অধ্যায়ভিত্তিক গুরুত্ব ও প্রস্তুতি নির্দেশিকা।`;
                const syllabusTextToDisplay = activeCourse.syllabusText || defaultSyllabusText;
                const syllabusesToRender = activeCourse.customSyllabuses || [];

                const handleSyllabusDownload = () => {
                  if (!isSyllabusUnlocked) {
                    setShowEnrollAlert(true);
                    return;
                  }
                  const element = document.createElement("a");
                  const file = new Blob([syllabusTextToDisplay], { type: 'text/plain;charset=utf-8' });
                  element.href = URL.createObjectURL(file);
                  element.download = `${activeCourse.title}_Syllabus.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                };

                return (
                  <div className="space-y-3">
                    {/* Syllabus Main Card with Download Button */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
                            <BookmarkCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                              কোর্স সিলেবাস ও নম্বর বণ্টন
                            </h3>
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">
                              {activeCourse.title}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleSyllabusDownload}
                          className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-2xs transition-all active:scale-95 ${
                            !isSyllabusUnlocked
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {!isSyllabusUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                          <span>সিলেবাস ডাউনলোড করুন</span>
                        </button>
                      </div>

                      {/* Direct Written Syllabus Text */}
                      <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-850/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {syllabusTextToDisplay}
                      </div>
                    </div>

                    {/* Additional Syllabus Files if any */}
                    {syllabusesToRender.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1">অন্যান্য সিলেবাস ফাইলসমূহ</h4>
                        {syllabusesToRender.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (!isSyllabusUnlocked) setShowEnrollAlert(true);
                              else handleSyllabusDownload();
                            }}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-300"
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                            <Download className="w-4 h-4 text-emerald-600" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* SHEETS TAB */}
              {detailTab === 'sheets' && (() => {
                const isSheetsUnlocked = activeCourse.isEnrolled || activeCourse.isSheetsLocked === false;
                const sheetsToRender = (activeCourse.customSheets && activeCourse.customSheets.length > 0)
                  ? activeCourse.customSheets
                  : [
                      { id: 's1', title: 'লেকচার ১: মাকামাতু কুফিয়্যাহ', code: 'শিট ০১', sizeOrTime: '১.৮ মেগাবাইট' },
                      { id: 's2', title: 'লেকচার ২: সূরা বাকারা বিশেষ টীকা', code: 'শিট ০২', sizeOrTime: '২.১ মেগাবাইট' },
                      { id: 's3', title: 'লেকচার ৩: কিতাবুল ঈমান ব্যাখ্যামূলক শিট', code: 'শিট ০৩', sizeOrTime: '১.৪ মেগাবাইট' },
                      { id: 's4', title: 'লেকচার ৪: আল-হাদিস ও সানাদ হ্যান্ডআউট', code: 'শিট ০৪', sizeOrTime: '২.৯ মেগাবাইট' },
                      { id: 's5', title: 'লেকচার ৫: নাহু ও সরফ তারকীব রুলস', code: 'শিট ০৫', sizeOrTime: '১.৬ মেগাবাইট' },
                    ];

                return (
                  <div className="space-y-2.5">
                    {sheetsToRender.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!isSheetsUnlocked) {
                            setShowEnrollAlert(true);
                          }
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-all ${
                          !isSheetsUnlocked ? 'cursor-pointer hover:border-amber-300' : 'hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-2">
                          <div className={`p-2.5 rounded-xl shrink-0 ${
                            isSheetsUnlocked ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                              {item.code} {item.sizeOrTime ? `• ${item.sizeOrTime}` : ''}
                            </span>
                          </div>
                        </div>

                        <div>
                          {!isSheetsUnlocked ? (
                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center space-x-1">
                              <Lock className="w-4 h-4 text-amber-600" />
                              <span className="text-[10px] font-bold text-amber-700 hidden sm:inline">লকড</span>
                            </div>
                          ) : (
                            <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center space-x-1">
                              <Download className="w-3.5 h-3.5" />
                              <span>ডাউনলোড</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* EXAMS TAB */}
              {detailTab === 'exams' && (() => {
                const isExamsUnlocked = activeCourse.isEnrolled || activeCourse.isExamsLocked === false;
                const rawExams = (activeCourse.customExams && activeCourse.customExams.length > 0)
                  ? activeCourse.customExams
                  : [
                      { id: 'e1', title: 'পরীক্ষা 01: আল-কুরআন ও তাফসীর মডেল টেস্ট', examNumber: 'পরীক্ষা ০১', topic: 'আল-কুরআন ও তাফসীর', date: '০৫ আগস্ট, ২০২৬', dayName: 'বুধবার', isUpcoming: false, code: '৫০টি প্রশ্ন', sizeOrTime: '৩০ মিনিট' },
                      { id: 'e2', title: 'পরীক্ষা 02: আল-হাদিস ও সানাদ মডেল টেস্ট', examNumber: 'পরীক্ষা ০২', topic: 'আল-হাদিস ও আসমাউর রিজাল', date: '০৮ আগস্ট, ২০২৬', dayName: 'শনিবার', isUpcoming: false, code: '৫০টি প্রশ্ন', sizeOrTime: '৩০ মিনিট' },
                      { id: 'e3', title: 'পরীক্ষা 03: নাহু ও সরফ অধ্যায় মডেল টেস্ট', examNumber: 'পরীক্ষা ০৩', topic: 'নাহু, সরফ ও তারকীব', date: '১২ আগস্ট, ২০২৬', dayName: 'বুধবার', isUpcoming: true, code: '৫০টি প্রশ্ন', sizeOrTime: '৩০ মিনিট' },
                      { id: 'e4', title: 'পরীক্ষা 04: ফিকহ ও মূল মাসআলা মডেল টেস্ট', examNumber: 'পরীক্ষা ০৪', topic: 'ফিকহুস সুন্নাহ্ ও উসূল', date: '১৬ আগস্ট, ২০২৬', dayName: 'রবিবার', isUpcoming: true, code: '১০০টি প্রশ্ন', sizeOrTime: '৬০ মিনিট' },
                    ];

                return (
                  <div className="space-y-3">
                    {rawExams.map((item, idx) => {
                      const attemptKey = `${activeCourse.id}_${item.id}`;
                      const attemptData = examAttempts[attemptKey];
                      const examNoDisplay = item.examNumber || `পরীক্ষা ০${idx + 1}`;
                      const topicDisplay = item.topic || item.title;
                      const dateDisplay = item.date || '১৫ আগস্ট, ২০২৬';
                      const dayDisplay = item.dayName || 'শনিবার';

                      return (
                        <div
                          key={item.id}
                          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          {/* Top Row: Exam Number, Topic, Date & Day, Meta/Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Exam No Badge */}
                                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300/80 dark:border-emerald-800">
                                  {examNoDisplay}
                                </span>

                                {/* Date & Day Name */}
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-lg">
                                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>{dateDisplay} ({dayDisplay})</span>
                                </span>
                              </div>

                              {/* Topic */}
                              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug break-words">
                                <span className="text-emerald-700 dark:text-emerald-400 font-black mr-1.5">টপিক:</span>
                                <span>{topicDisplay}</span>
                              </h4>
                            </div>

                            {/* Status Badge or Questions info */}
                            <div className="shrink-0 flex items-center space-x-2">
                              {!isExamsUnlocked ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300">
                                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>লকড</span>
                                </span>
                              ) : item.isUpcoming ? (
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-extrabold animate-pulse">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Upcoming</span>
                                </span>
                              ) : attemptData ? (
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-black shadow-2xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>সম্পন্ন (স্কোর: {attemptData.score}/{attemptData.maxScore})</span>
                                </span>
                              ) : (
                                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                                  {item.code || '৫০টি প্রশ্ন'} • {item.sizeOrTime || '৩০ মিনিট'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons Section */}
                          {/* 1. Unenrolled & Paid Course -> Show Lock Alert Button */}
                          {!isExamsUnlocked ? (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                                <Lock className="w-3.5 h-3.5" />
                                <span>কোর্সে ভর্তি হয়ে পরীক্ষাটি আনলক করুন</span>
                              </span>
                              <button
                                onClick={() => setShowEnrollAlert(true)}
                                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm active:scale-95 transition-all"
                              >
                                আনলক করুন
                              </button>
                            </div>
                          ) : item.isUpcoming ? (
                            /* 2. Upcoming Exam -> Disabled Notice */
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50">
                              <span className="text-amber-900 dark:text-amber-200 font-bold flex items-center space-x-1.5">
                                <Calendar className="w-4 h-4 text-amber-600" />
                                <span>পরীক্ষার নির্ধারিত দিন: {dateDisplay} ({dayDisplay})</span>
                              </span>
                              <span className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-[11px] self-start sm:self-auto">
                                শীঘ্রই শুরু হবে (Upcoming)
                              </span>
                            </div>
                          ) : !attemptData ? (
                            /* 3. Available Active Exam NOT yet completed -> Show "পরীক্ষা দিন" */
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                অনলাইন সিবিটি ফরম্যাটে পরীক্ষা দিতে প্রস্তুত হন
                              </span>
                              <button
                                onClick={() => setRunningExamModal({ exam: item, isRetake: false })}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center space-x-1.5 active:scale-95 transition-all"
                              >
                                <Play className="w-4 h-4 fill-white" />
                                <span>পরীক্ষা দিন</span>
                              </button>
                            </div>
                          ) : (
                            /* 4. Completed Exam -> Show EXACTLY 3 Buttons */
                            <div className="pt-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Button 1: পুনরায় পরীক্ষা দিন / প্র্যাকটিস */}
                                <button
                                  onClick={() => setRunningExamModal({ exam: item, isRetake: true })}
                                  className="flex-1 min-w-[150px] px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-300/80 dark:border-amber-800 font-extrabold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-2xs"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                                  <span>পুনরায় পরীক্ষা দিন (প্র্যাকটিস)</span>
                                </button>

                                {/* Button 2: ব্যাখ্যা সহ উত্তর */}
                                <button
                                  onClick={() => setReviewExamModal({
                                    exam: item,
                                    attempt: attemptData,
                                    questions: getExamQuestions(item)
                                  })}
                                  className="flex-1 min-w-[130px] px-3 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-950 dark:text-indigo-200 border border-indigo-300/80 dark:border-indigo-800 font-extrabold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-2xs"
                                >
                                  <FileText className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
                                  <span>ব্যাখ্যা সহ উত্তর</span>
                                </button>

                                {/* Button 3: মেধাতালিকা */}
                                <button
                                  onClick={() => setExamLeaderboardModal({ exam: item })}
                                  className="flex-1 min-w-[110px] px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-800 font-extrabold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-2xs"
                                >
                                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                  <span>মেধাতালিকা</span>
                                </button>
                              </div>

                              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 italic">
                                * দ্রষ্টব্য: পুনরায় পরীক্ষা (প্র্যাকটিস) দিলে নতুন পয়েন্ট যুক্ত হবে না। লিডারবোর্ডে ১ম চেষ্টার ফলাফল সংরক্ষিত থাকবে।
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* LEADERBOARD TAB (ENROLLED ONLY) */}
              {detailTab === 'leaderboard' && activeCourse.isEnrolled && (
                <div className="-mt-2 space-y-4">
                  <LeaderboardView 
                    examTitle={activeCourse.title} 
                    isPremiumExam={true} 
                    isCourseContext={true}
                    hideFilters={true}
                  />
                </div>
              )}

            </div>

            {/* Sticky Bottom Bar - Shown ONLY if not enrolled */}
            {!activeCourse.isEnrolled && (
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xl">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                      {activeCourse.priceText || '৳৪৫০'}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-bold">
                      শিটসহ
                    </span>
                  </div>

                  <button
                    onClick={() => handleEnrollCourse(activeCourse.id)}
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-[#132238] hover:bg-[#0a1322] text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center space-x-2 active:scale-95 transition-all"
                  >
                    <span>ভর্তি হন</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {/* Locked Modal Prompt */}
            {showEnrollAlert && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                    <Lock className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      কনটেন্টটি লক করা রয়েছে
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      এই শিট ও পরীক্ষা ব্যবহারের জন্য আপনাকে প্রথমে কোর্সটিতে ভর্তি হতে হবে।
                    </p>
                  </div>
                  <div className="pt-2 flex space-x-2">
                    <button
                      onClick={() => setShowEnrollAlert(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={() => {
                        setShowEnrollAlert(false);
                        handleEnrollCourse(activeCourse.id);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                    >
                      এখনই ভর্তি হন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 1: CBT Exam Runner Modal */}
            {runningExamModal && activeCourse && (() => {
              const cbtExamData: ExtendedExamItem = {
                id: runningExamModal.exam.id,
                title: `${runningExamModal.exam.examNumber || 'পরীক্ষা'}: ${runningExamModal.exam.topic || runningExamModal.exam.title}`,
                category: 'premium',
                durationMinutes: runningExamModal.exam.durationMinutes || 30,
                totalQuestions: runningExamModal.exam.questionsCount || 10,
                difficulty: 'মাঝারি',
                participantsCount: '১,৪২০ জন',
                subject: activeCourse.title,
                isPremium: activeCourse.isPremium,
                date: runningExamModal.exam.date || '১৫ আগস্ট, ২০২৬',
                totalMarks: (runningExamModal.exam.questionsCount || 10) * 2,
                subjectIcon: 'general'
              };

              const questions = getExamQuestions(runningExamModal.exam);

              return (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
                  <div className="w-full max-w-4xl h-[95vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
                    {runningExamModal.isRetake && (
                      <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-900 p-2.5 text-center text-xs font-extrabold text-amber-900 dark:text-amber-200 flex items-center justify-center space-x-2 shrink-0">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>প্র্যাকটিস পরীক্ষা মোড: এই ফলাফলের নতুন পয়েন্ট লিডারবোর্ডে যুক্ত হবে না (১ম ট্রাই এর পয়েন্ট ও স্থান সংরক্ষিত থাকবে)।</span>
                      </div>
                    )}
                    <div className="flex-1 overflow-y-auto">
                      <CbtExamRunner
                        exam={cbtExamData}
                        questions={questions}
                        onClose={() => setRunningExamModal(null)}
                        onOpenLeaderboard={() => {
                          const examToPass = runningExamModal.exam;
                          setRunningExamModal(null);
                          setExamLeaderboardModal({ exam: examToPass });
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Modal 2: Answer Review Modal (ব্যাখ্যা সহ উত্তর) */}
            {reviewExamModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
                <div className="w-full max-w-3xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
                  {/* Review Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        <FileText className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 block">
                          পরীক্ষার উত্তর ও বিস্তারিত ব্যাখ্যা
                        </span>
                        <h3 className="font-black text-sm sm:text-base text-white">
                          {reviewExamModal.exam.topic || reviewExamModal.exam.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                        প্রাপ্ত নম্বর: {reviewExamModal.attempt.score}/{reviewExamModal.attempt.maxScore}
                      </span>
                      <button
                        onClick={() => setReviewExamModal(null)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Question List */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {reviewExamModal.questions.map((q, qIdx) => {
                      const userAns = reviewExamModal.attempt.userAnswers[qIdx];
                      const correctAns = q.correctAnswer;
                      const banglaOptionBadges = ['ক', 'খ', 'গ', 'ঘ'];

                      return (
                        <div
                          key={q.id || qIdx}
                          className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3"
                        >
                          {/* Question Title & Arabic */}
                          <div className="space-y-1">
                            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 block">
                              প্রশ্ন {qIdx + 1} / {reviewExamModal.questions.length}
                            </span>
                            <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug">
                              {q.question}
                            </h4>
                            {q.questionArabic && (
                              <p className="font-serif text-base sm:text-lg text-emerald-800 dark:text-emerald-300 dir-rtl text-right pt-1 leading-loose">
                                {formatArabicText(q.questionArabic)}
                              </p>
                            )}
                          </div>

                          {/* 4 Options Grid */}
                          <div className="grid grid-cols-1 gap-2.5 pt-2">
                            {q.options.map((opt, oIdx) => {
                              const isCorrectChoice = oIdx === correctAns;
                              const isUserWrongChoice = userAns === oIdx && !isCorrectChoice;

                              let cardClass = "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300";
                              if (isCorrectChoice) {
                                cardClass = "bg-emerald-100 dark:bg-emerald-950/90 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-extrabold shadow-2xs";
                              } else if (isUserWrongChoice) {
                                cardClass = "bg-rose-100 dark:bg-rose-950/90 border-2 border-rose-500 text-rose-950 dark:text-rose-100 font-extrabold shadow-2xs";
                              }

                              return (
                                <div
                                  key={oIdx}
                                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${cardClass}`}
                                >
                                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                                    <span className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                                      isCorrectChoice
                                        ? 'bg-emerald-600 text-white'
                                        : isUserWrongChoice
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}>
                                      {banglaOptionBadges[oIdx] || oIdx + 1}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold leading-snug">
                                      {opt}
                                    </span>
                                  </div>

                                  {/* Result Indicator Badges */}
                                  <div className="shrink-0">
                                    {isCorrectChoice && (
                                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-black flex items-center space-x-1 shadow-2xs">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>সঠিক উত্তর</span>
                                      </span>
                                    )}
                                    {isUserWrongChoice && (
                                      <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black flex items-center space-x-1 shadow-2xs">
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>আপনার ভুল উত্তর</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Detailed Explanation Box */}
                          {q.explanation && (
                            <div className="mt-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/90 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-1 text-xs sm:text-sm">
                              <div className="font-black text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
                                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <span>বিস্তারিত ব্যাখ্যা:</span>
                              </div>
                              <p className="font-semibold leading-relaxed pl-5 text-slate-800 dark:text-slate-200">
                                {q.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Modal 3: Specific Exam Leaderboard Modal */}
            {examLeaderboardModal && (() => {
              const attemptKey = activeCourse ? `${activeCourse.id}_${examLeaderboardModal.exam.id}` : '';
              const attemptData = examAttempts[attemptKey];

              return (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
                  <div className="w-full max-w-3xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Trophy className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                            পরীক্ষার বিশেষ মেধাতালিকা
                          </span>
                          <h3 className="font-black text-sm sm:text-base text-white">
                            {examLeaderboardModal.exam.topic || examLeaderboardModal.exam.title}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => setExamLeaderboardModal(null)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <LeaderboardView
                        examTitle={examLeaderboardModal.exam.topic || examLeaderboardModal.exam.title}
                        isPremiumExam={true}
                        isCourseContext={false}
                        hideFilters={true}
                        userScore={attemptData?.score}
                        userMaxScore={attemptData?.maxScore}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
};
