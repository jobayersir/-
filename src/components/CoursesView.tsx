import React, { useState, useRef } from 'react';
import { CourseItem, PostCadre } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Users, 
  Star, 
  Crown, 
  Search, 
  CheckCircle2, 
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
  School,
  Globe,
  ArrowLeft,
  Lock,
  Trophy
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const [selectedCadre, setSelectedCadre] = useState<PostCadre | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);
  const [detailTab, setDetailTab] = useState<'plan' | 'sheets' | 'exams' | 'leaderboard'>('plan');
  const [showEnrollAlert, setShowEnrollAlert] = useState(false);

  const cadreScrollRef = useRef<HTMLDivElement>(null);

  const scrollCadresRight = () => {
    if (cadreScrollRef.current) {
      cadreScrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const [coursesList, setCoursesList] = useState<CourseItem[]>([
    {
      id: 'c_general_free',
      title: 'জেনারেল',
      titleArabic: 'المواد العامة (البنغالية، الإنجليزية، الرياضيات)',
      cadre: 'general_subject',
      instructor: 'প্রফেসর মোঃ রফিকুল ইসলাম',
      totalModules: 24,
      completedModules: 24,
      isPremium: false,
      rating: 4.9,
      studentCount: 14200,
      progressPercent: 100,
      thumbnailBg: 'from-amber-600 via-amber-700 to-slate-900',
      description: '৯ম শিক্ষক নিবন্ধন ও মাদ্রাসা পরীক্ষার জেনারেল অংশ (বাংলা, ইংরেজি, গণিত ও জিকে) ফ্রি এক্সাম ব্যাচ।',
      badgeType: 'free',
      sheetsCount: 20,
      examsCount: 25,
      classesCount: 30,
      priceText: 'ফ্রি',
      isEnrolled: true,
    },
    {
      id: 'c_maulvi_exam1',
      title: 'সহকারী মৌলবি এক্সাম ব্যাচ- ১',
      titleArabic: 'دفعة الامتحانات لـ المدرس المساعد الشرعي 1',
      cadre: 'assistant_maulvi',
      instructor: 'ওস্তাদ মুফতি ইউসুফ আল-মাদানী',
      totalModules: 34,
      completedModules: 12,
      isPremium: true,
      rating: 4.8,
      studentCount: 91,
      progressPercent: 35,
      thumbnailBg: 'from-amber-700 via-orange-800 to-slate-900',
      description: 'সহকারী মৌলভী পদের জন্য বিশেষ অধ্যায়ভিত্তিক মডেল টেস্ট, লাইভ উত্তরপত্র রিভিউ ও ওস্তাদ সলভ সেসন।',
      badgeType: 'exam',
      sheetsCount: 36,
      examsCount: 34,
      classesCount: 15,
      priceText: '৳৪৫০+',
      isEnrolled: false,
    },
    {
      id: 'c_maulvi_subjective',
      title: 'সহকারী মৌলবি সাবজেক্টিভ কোর্স',
      titleArabic: 'الدورة الموضوعية لـ المدرس المساعد الشرعي',
      cadre: 'assistant_maulvi',
      instructor: 'মাওলানা ড. আহমেদ হাসান',
      totalModules: 36,
      completedModules: 36,
      isPremium: true,
      rating: 4.9,
      studentCount: 635,
      progressPercent: 100,
      thumbnailBg: 'from-indigo-900 via-purple-950 to-slate-950',
      description: 'আল-কুরআন, আল-হাদিস, আকাইদ ও ফিকহ সিলেবাসের সম্পূর্ণ এইচডি ভিডিও লেকচার ও রিভিশন শিট।',
      badgeType: 'recorded',
      sheetsCount: 36,
      examsCount: 20,
      classesCount: 36,
      priceText: '৳৭৫০',
      isEnrolled: true,
    },
    {
      id: 'c_lecturer_subjective',
      title: 'আরবি প্রভাষক সাবজেক্টিভ কোর্স',
      titleArabic: 'الدورة الموضوعية الكاملة لـ محاضر اللغة العربية',
      cadre: 'lecturer_arabic',
      instructor: 'মাওলানা ড. আহমেদ হাসান',
      totalModules: 42,
      completedModules: 0,
      isPremium: true,
      rating: 4.9,
      studentCount: 722,
      progressPercent: 0,
      thumbnailBg: 'from-emerald-900 via-teal-950 to-slate-950',
      description: 'নাহু, সরফ, বালাগাত, তাফসীর ও ফিকহুস সুন্নাহ্ মাস্টারকোর্স সম্পূর্ণ এইচডি রেকর্ডেড লেকচারসহ।',
      badgeType: 'recorded',
      sheetsCount: 45,
      examsCount: 30,
      classesCount: 42,
      priceText: '৳৯৫০',
      isEnrolled: false,
    },
    {
      id: 'c_ebtedayee_head',
      title: 'ইবতেদায়ী মৌলবি ও কারী শিক্ষক কোর্স',
      titleArabic: 'دورة إعداد معلم المعهد الابتدائي الشرعي والقارئ',
      cadre: 'ebtedayee_head',
      instructor: 'ক্বারী মাওলানা ওবায়দুল্লাহ',
      totalModules: 28,
      completedModules: 14,
      isPremium: false,
      rating: 4.8,
      studentCount: 1850,
      progressPercent: 50,
      thumbnailBg: 'from-teal-800 via-emerald-900 to-slate-900',
      description: 'ইবতেদায়ী প্রধান, মৌলভী ও কারী শিক্ষক নিয়োগ পরীক্ষার তাজবীদ, আরবি ব্যাকরণ ও পেডাগজি কোর্স।',
      badgeType: 'live',
      sheetsCount: 25,
      examsCount: 18,
      classesCount: 28,
      priceText: '৳৫০০',
      isEnrolled: false,
    },
    {
      id: 'c_general_special',
      title: 'জেনারেল সাবজেক্ট মাস্টারকোর্স (বাংলা, ইংরেজি, গণিত)',
      titleArabic: 'دورة المواد العامة الشاملة',
      cadre: 'general_subject',
      instructor: 'প্রফেসর মোঃ রফিকুল ইসলাম',
      totalModules: 40,
      completedModules: 0,
      isPremium: true,
      rating: 4.8,
      studentCount: 3400,
      progressPercent: 0,
      thumbnailBg: 'from-blue-900 via-slate-900 to-slate-950',
      description: 'সকল ক্যাডারের ১০০ নম্বরের সাধারণ অংশের সর্বোচ্চ প্রস্তুতির ভিডিও লেকচার, সুপার শর্টকাট ট্রিকস ও শিট।',
      badgeType: 'recorded',
      sheetsCount: 40,
      examsCount: 25,
      classesCount: 40,
      priceText: '৳৬৫০',
      isEnrolled: false,
    },
  ]);

  const handleEnrollCourse = (courseId: string) => {
    setCoursesList((prev) =>
      prev.map((item) =>
        item.id === courseId ? { ...item, isEnrolled: true } : item
      )
    );
    setActiveCourse((prev) =>
      prev && prev.id === courseId ? { ...prev, isEnrolled: true } : prev
    );
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
                  } flex items-center justify-center font-black text-[10px] shadow-sm mt-0.5`}>
                    ত
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-3.5 sm:p-5 space-y-4 overflow-hidden">
              
              {/* Graphic Poster Header */}
              <div className="relative rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/50 to-emerald-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-amber-300/50 dark:border-slate-700/80 p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-2.5 overflow-hidden shadow-inner">
                
                {/* Top Right Badge */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-2xs">
                  {activeCourse.badgeType === 'exam' ? 'Exam Batch' : activeCourse.badgeType === 'recorded' ? 'Recorded Batch' : 'Free Batch'}
                </div>

                {/* Emblem Seal */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-900 text-amber-400 border-2 border-amber-400/90 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md transform hover:scale-105 transition-transform">
                  ত
                </div>

                {/* Sub Banner Ribbon */}
                <div className="bg-[#182638] text-amber-300 px-4 py-1 rounded-lg text-xs font-extrabold tracking-wide border border-amber-400/40 shadow-2xs">
                  {activeCourse.badgeType === 'exam' ? 'এক্সাম ব্যাচ-১' : activeCourse.badgeType === 'recorded' ? 'রেকর্ডেড ব্যাচ' : 'ফ্রি এক্সাম ব্যাচ'}
                </div>

                {/* Course Main Title Banner */}
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 max-w-lg leading-tight pt-1">
                  {activeCourse.title}
                </h1>

                {/* Instructor */}
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  ৯ম শিক্ষক নিয়োগ • <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{activeCourse.instructor}</span>
                </p>
              </div>

              {/* Statistics Row (3 Pills + Enrolled Pill) */}
              <div className="space-y-2.5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 px-1">
                  {activeCourse.title}
                </h2>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {/* Sheet Count Pill */}
                  <div className="bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 p-2.5 sm:p-3 rounded-2xl flex items-center justify-center space-x-2 text-center sm:text-left">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="font-black text-sm sm:text-base text-amber-950 dark:text-amber-200 block leading-tight">
                        {activeCourse.sheetsCount || 36}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-amber-800 dark:text-amber-400">শিট</span>
                    </div>
                  </div>

                  {/* Exam Count Pill */}
                  <div className="bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 p-2.5 sm:p-3 rounded-2xl flex items-center justify-center space-x-2 text-center sm:text-left">
                    <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-black text-sm sm:text-base text-emerald-950 dark:text-emerald-200 block leading-tight">
                        {activeCourse.examsCount || 34}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-400">পরীক্ষা</span>
                    </div>
                  </div>

                  {/* Model Test Pill */}
                  <div className="bg-sky-100/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 p-2.5 sm:p-3 rounded-2xl flex items-center justify-center space-x-2 text-center sm:text-left">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-sky-800 dark:text-sky-400 shrink-0" />
                    <div>
                      <span className="font-black text-sm sm:text-base text-sky-950 dark:text-sky-200 block leading-tight">
                        ৭
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-sky-800 dark:text-sky-400">ফুল মডেল</span>
                    </div>
                  </div>
                </div>

                {/* Enrolled Students Pill */}
                <div className="bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/90 py-2.5 px-4 rounded-xl text-center flex items-center justify-center space-x-2 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>{activeCourse.studentCount} জন ভর্তি হয়েছেন</span>
                </div>
              </div>

            </div>

            {/* Sub-Nav Action Buttons */}
            {/* Selected tab turns GREEN as requested */}
            {/* Leaderboard tab is shown ONLY if enrolled */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'plan', label: 'কোর্স প্ল্যান', icon: ScrollText },
                { id: 'sheets', label: 'PDF শিট', icon: FileText },
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
              
              {/* PLAN TAB */}
              {detailTab === 'plan' && (
                <div className="space-y-2.5">
                  {[
                    { id: 1, title: 'কোর্স রুটিন ও ওরিয়েন্টেশন নির্দেশিকা', code: 'Plan- 01', size: '১.২ মেগাবাইট' },
                    { id: 2, title: 'অধ্যায়ভিত্তিক পূর্ণাঙ্গ নম্বর বণ্টন ও সিলেবাস', code: 'Plan- 02', size: '২.৫ মেগাবাইট' },
                    { id: 3, title: 'মাদরাসা শিক্ষক নিবন্ধনের বিশেষ প্রশ্ন ব্যাংক সমাধান', code: 'Plan- 03', size: '৩.১ মেগাবাইট' },
                    { id: 4, title: 'লাইভ সলভ ক্লাস ও ওস্তাদ পরামর্শ সূচি', code: 'Plan- 04', size: '১.৮ মেগাবাইট' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (!activeCourse.isEnrolled) {
                          setShowEnrollAlert(true);
                        }
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-all ${
                        !activeCourse.isEnrolled ? 'cursor-pointer hover:border-amber-300' : 'hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          activeCourse.isEnrolled ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          <ScrollText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                            {item.code} • {item.size}
                          </span>
                        </div>
                      </div>

                      <div>
                        {!activeCourse.isEnrolled ? (
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                        ) : (
                          <button className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SHEETS TAB */}
              {detailTab === 'sheets' && (
                <div className="space-y-2.5">
                  {[
                    { id: 1, title: 'Exam- 01 মাকামাতু কুফিয়্যাহ.pdf', code: 'PDF Sheet 01' },
                    { id: 2, title: 'Exam- 02-সূরা বাকারা.pdf', code: 'PDF Sheet 02' },
                    { id: 3, title: 'Exam- 03 কিতাবুল ঈমান.pdf', code: 'PDF Sheet 03' },
                    { id: 4, title: 'Exam- 04 আল-হাদিস ও সানাদ হ্যান্ডআউট.pdf', code: 'PDF Sheet 04' },
                    { id: 5, title: 'Exam- 05 নাহু ও সরফ তারকীব রুলস.pdf', code: 'PDF Sheet 05' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (!activeCourse.isEnrolled) {
                          setShowEnrollAlert(true);
                        }
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-all ${
                        !activeCourse.isEnrolled ? 'cursor-pointer hover:border-amber-300' : 'hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          activeCourse.isEnrolled ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                            {item.code}
                          </span>
                        </div>
                      </div>

                      <div>
                        {!activeCourse.isEnrolled ? (
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                            <Lock className="w-4 h-4" />
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
              )}

              {/* EXAMS TAB */}
              {detailTab === 'exams' && (
                <div className="space-y-2.5">
                  {[
                    { id: 1, title: 'পরীক্ষা 01: আল-কুরআন ও তাফসীর মডেল টেস্ট', qCount: '৫০টি প্রশ্ন', time: '৩০ মিনিট' },
                    { id: 2, title: 'পরীক্ষা 02: আল-হাদিস ও সানাদ মডেল টেস্ট', qCount: '৫০টি প্রশ্ন', time: '৩০ মিনিট' },
                    { id: 3, title: 'পরীক্ষা 03: নাহু ও সরফ অধ্যায় মডেল টেস্ট', qCount: '৫০টি প্রশ্ন', time: '৩০ মিনিট' },
                    { id: 4, title: 'পরীক্ষা 04: ফিকহ ও মূল মাসআলা মডেল টেস্ট', qCount: '১০০টি প্রশ্ন', time: '৬০ মিনিট' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (!activeCourse.isEnrolled) {
                          setShowEnrollAlert(true);
                        }
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-all ${
                        !activeCourse.isEnrolled ? 'cursor-pointer hover:border-amber-300' : 'hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          activeCourse.isEnrolled ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          <PenTool className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                            {item.qCount} • {item.time}
                          </span>
                        </div>
                      </div>

                      <div>
                        {!activeCourse.isEnrolled ? (
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                        ) : (
                          <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center space-x-1">
                            <Play className="w-3 h-3 fill-white" />
                            <span>পরীক্ষা দিন</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* LEADERBOARD TAB (ENROLLED ONLY) */}
              {detailTab === 'leaderboard' && activeCourse.isEnrolled && (
                <div className="space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <span>ব্যাচ মেধা তালিকা (Leaderboard)</span>
                      </h3>
                      <p className="text-xs text-slate-500">সকল মডেল টেস্টের গড় স্কোরের ভিত্তিতে র‍্যাংকিং</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-extrabold text-xs rounded-full border border-amber-300">
                      শীর্ষ ১০
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { rank: 1, name: 'মোঃ আব্দুল্লাহ মারুফ', score: '৯৮%', badge: '🥇 ১ম স্থান', avatarBg: 'bg-amber-500 text-white' },
                      { rank: 2, name: 'ফারহানা ইয়াসমিন', score: '৯৫%', badge: '🥈 ২য় স্থান', avatarBg: 'bg-slate-400 text-white' },
                      { rank: 3, name: 'সাইফুল ইসলাম রাফি', score: '৯২%', badge: '🥉 ৩য় স্থান', avatarBg: 'bg-amber-700 text-white' },
                      { rank: 4, name: 'মুফতি আব্দুর রহমান', score: '৯০%', badge: '৪র্থ স্থান', avatarBg: 'bg-emerald-600 text-white' },
                      { rank: 5, name: 'তানজিলা তাসনিম', score: '৮৯%', badge: '৫ম স্থান', avatarBg: 'bg-emerald-600 text-white' },
                    ].map((student) => (
                      <div key={student.rank} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center ${student.avatarBg}`}>
                            {student.rank}
                          </div>
                          <div>
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 block">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold">{student.badge}</span>
                          </div>
                        </div>
                        <span className="font-black text-sm text-slate-800 dark:text-slate-200">
                          {student.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Bottom Bar */}
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

                {activeCourse.isEnrolled ? (
                  <div className="flex items-center space-x-2">
                    <span className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-xs sm:text-sm border border-emerald-300/80">
                      ✓ ভর্তি সম্পন্ন
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnrollCourse(activeCourse.id)}
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-[#132238] hover:bg-[#0a1322] text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center space-x-2 active:scale-95 transition-all"
                  >
                    <span>ভর্তি হন</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                )}

              </div>
            </div>

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

          </div>
        </div>
      )}

    </div>
  );
};
