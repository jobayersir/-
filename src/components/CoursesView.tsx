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
  Globe
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const [selectedCadre, setSelectedCadre] = useState<PostCadre | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'sheets' | 'exams'>('videos');

  const cadreScrollRef = useRef<HTMLDivElement>(null);

  const scrollCadresRight = () => {
    if (cadreScrollRef.current) {
      cadreScrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const coursesList: CourseItem[] = [
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
  ];

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
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
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
            // Determine left border color accent based on course badge type / enrolled status
            const borderAccentColor = course.isEnrolled
              ? 'border-l-4 border-l-emerald-500'
              : course.badgeType === 'exam'
              ? 'border-l-4 border-l-amber-500'
              : course.badgeType === 'recorded'
              ? 'border-l-4 border-l-indigo-500'
              : 'border-l-4 border-l-teal-500';

            return (
              <div
                key={course.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${borderAccentColor} flex flex-col sm:flex-row items-stretch`}
              >
                {/* Left Thumbnail Banner Emblem Box */}
                <div className="w-full sm:w-48 lg:w-56 shrink-0 p-5 bg-gradient-to-br from-amber-50/70 via-emerald-50/50 to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  
                  {/* Outer Frame Box Graphic */}
                  <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2 relative">
                    
                    {/* Emblem Logo */}
                    <div className="w-8 h-8 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                      ত
                    </div>

                    {/* Badge Category Title */}
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-extrabold text-[10px]">
                      {course.badgeType === 'exam' ? 'এক্সাম ব্যাচ' : course.badgeType === 'recorded' ? 'রেকর্ডেড ব্যাচ' : 'ফ্রি এক্সাম ব্যাচ'}
                    </span>

                    {/* Course Title inside banner */}
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                      {course.title}
                    </h4>

                    {/* Decorative Footer motif line */}
                    <div className="w-12 h-0.5 bg-amber-400 mx-auto rounded-full" />
                  </div>
                </div>

                {/* Right Details & Actions Container */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-2.5">
                    {/* Title */}
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug">
                      {course.title}
                    </h3>

                    {/* Enrolled Badge or Enrolled Tag */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {course.isEnrolled ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                          <span>ভর্তি সম্পন্ন</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold text-xs">
                          <Users className="w-3.5 h-3.5 text-amber-600" />
                          <span>{course.studentCount} জন ভর্তি</span>
                        </span>
                      )}

                      {/* Video / Sheet / Exam counts */}
                      <div className="text-slate-500 dark:text-slate-400 font-semibold text-xs flex items-center space-x-1.5">
                        {course.classesCount && (
                          <span>• {course.classesCount} ক্লাস</span>
                        )}
                        {course.sheetsCount && (
                          <span>• {course.sheetsCount} শিট</span>
                        )}
                        {course.examsCount && (
                          <span>• {course.examsCount} পরীক্ষা</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Price & Action Buttons */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    
                    {/* Left: Price or Enrolled text */}
                    <div>
                      {course.isEnrolled ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 text-[11px] sm:text-xs font-extrabold">
                          <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-700 dark:text-emerald-400" />
                          <span>ভর্তি সম্পন্ন</span>
                        </span>
                      ) : (
                        <div className="flex items-baseline space-x-1">
                          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                            {course.priceText || 'ফ্রি'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Action Button */}
                    <button
                      onClick={() => {
                        setActiveCourse(course);
                        window.history.pushState({ tab: 'courses', subview: 'courseDetail' }, '', `#course-${course.id}`);
                      }}
                      className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs bg-[#1a2332] hover:bg-[#111827] text-white dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm transition-all active:scale-95 flex items-center space-x-1.5"
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
      {/* 3. COURSE DETAIL MODAL                                   */}
      {/* ========================================================= */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  তামরীন একাডেমি কোর্স প্যানেল
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeCourse.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ইনস্ট্রাক্টর: <span className="font-bold text-slate-700 dark:text-slate-300">{activeCourse.instructor}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tabs for Syllabus Content */}
            <div className="flex space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'videos'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                📹 ভিডিও লেকচার ({activeCourse.classesCount || 20})
              </button>
              <button
                onClick={() => setActiveTab('sheets')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'sheets'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                📄 লেকচার শিট ({activeCourse.sheetsCount || 15})
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'exams'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                📝 মডেল টেস্ট ({activeCourse.examsCount || 10})
              </button>
            </div>

            {/* Tab Content List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {activeTab === 'videos' && [
                { title: 'মডিউল ১: আল-কুরআন ও তাজবীদ সম্পূর্ণ রুলস', time: '৪৫ মিনিট', status: 'সম্পন্ন' },
                { title: 'মডিউল ২: নাহু - ফেএল ও ফায়েল তারকীব বিশ্লেষণ', time: '৫০ মিনিট', status: 'সম্পন্ন' },
                { title: 'মডিউল ৩: সরফ - আবওয়াব ও মাসদার পরিবর্তন নিয়ম', time: '৪০ মিনিট', status: 'নতুন' },
                { title: 'মডিউল ৪: ফিকহুস সুন্নাহ্ ও প্রধান মাসআলাসমূহ', time: '৫৫ মিনিট', status: 'নতুন' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] shadow-sm hover:bg-emerald-700">
                    প্লে করুন
                  </button>
                </div>
              ))}

              {activeTab === 'sheets' && [
                { title: 'বিশেষ আরবি ব্যাকরণ ও নাহু নোট শিট (PDF)', size: '২.৪ মেগাবাইট' },
                { title: 'আল-হাদিস ও সানাদ পরিচিতি হ্যান্ডআউট', size: '১.৮ মেগাবাইট' },
                { title: 'ইবতেদায়ী শিক্ষাবিজ্ঞান ও পেডাগজি শিট', size: '৩.১ মেগাবাইট' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.size}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-[11px] shadow-sm flex items-center space-x-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>ডাউনলোড</span>
                  </button>
                </div>
              ))}

              {activeTab === 'exams' && [
                { title: 'মডেল টেস্ট ১: নাহু ও সরফ অধ্যায়', qCount: '৫০টি প্রশ্ন' },
                { title: 'মডেল টেস্ট ২: আল-কুরআন ও তাফসীর', qCount: '৫০টি প্রশ্ন' },
                { title: 'মডেল টেস্ট ৩: ফিকহ ও মূল মাসআলা', qCount: '১০০টি প্রশ্ন' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.qCount}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] shadow-sm hover:bg-emerald-700">
                    পরীক্ষা দিন
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveCourse(null)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
