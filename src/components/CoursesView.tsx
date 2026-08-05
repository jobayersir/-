import React, { useState } from 'react';
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
  Sparkles,
  Layers,
  Video,
  FileText
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const [selectedCadre, setSelectedCadre] = useState<PostCadre | 'all'>('all');
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);

  const coursesList: CourseItem[] = [
    {
      id: 'c_lecturer',
      title: 'প্রভাষক (আরবি, হাদিস ও ফিকহ)',
      titleArabic: 'محاضر في اللغة العربية والعلوم الإسلامية',
      cadre: 'lecturer_arabic',
      instructor: 'মাওলানা ড. আহমেদ হাসান',
      totalModules: 28,
      completedModules: 14,
      isPremium: true,
      rating: 4.9,
      studentCount: 3420,
      progressPercent: 50,
      thumbnailBg: 'from-emerald-900 via-teal-900 to-slate-900',
      description: 'মাদ্রাসা বিষয়ের পূর্ণাঙ্গ আরবি সাহিত্য, নাহু, সরফ, বালাগাত, তাফসীর ও ফিকহুস সুন্নাহ্ মাস্টারকোর্স।',
    },
    {
      id: 'c_maulvi',
      title: 'সহকারী মৌলভী বিষয়ভিত্তিক মাস্টারকোর্স',
      titleArabic: 'دورة المدرس المساعد الشرعي الكاملة',
      cadre: 'assistant_maulvi',
      instructor: 'ওস্তাদ মুফতি ইউসুফ আল-মাদানী',
      totalModules: 22,
      completedModules: 8,
      isPremium: false,
      rating: 4.8,
      studentCount: 5100,
      progressPercent: 36,
      thumbnailBg: 'from-teal-900 via-emerald-950 to-slate-900',
      description: 'সহকারী মৌলভী পদের জন্য আল-কুরআন, আল-হাদিস, আকাইদ ও ফিকহ্ সিলেবাসের সহজ সমাধান ও ব্যাখ্যা।',
    },
    {
      id: 'c_ebtedayee_m',
      title: 'ইবতেদায়ি মৌলভী শিক্ষক কোর্স',
      titleArabic: 'إعداد معلم المعهد الابتدائي الشرعي',
      cadre: 'ebtedayee_head',
      instructor: 'মাওলানা আকমল হোসেন',
      totalModules: 18,
      completedModules: 0,
      isPremium: false,
      rating: 4.7,
      studentCount: 2890,
      progressPercent: 0,
      thumbnailBg: 'from-slate-900 via-emerald-900 to-slate-900',
      description: 'ইবতেদায়ী প্রধান ও সহকারী শিক্ষকদের ব্যাকরণ, তাজবীদ ও শিশু শিক্ষাবিজ্ঞান।',
    },
    {
      id: 'c_ebtedayee_q',
      title: 'ইবতেদায়ি কারী শিক্ষক কোর্স',
      titleArabic: 'دورة القارئ المعلم للتعليم الابتدائي',
      cadre: 'ebtedayee_head',
      instructor: 'ক্বারী মাওলানা ওবায়দুল্লাহ',
      totalModules: 16,
      completedModules: 4,
      isPremium: false,
      rating: 4.9,
      studentCount: 3120,
      progressPercent: 25,
      thumbnailBg: 'from-amber-950 via-emerald-950 to-slate-900',
      description: 'তাজবীদ শাস্ত্র, সালাসা রেওয়ায়েত, মাখরাজ ও প্রাথমিক সাধারণ আরবি কোর্স।',
    },
    {
      id: 'c_general',
      title: 'জেনারেল সাবজেক্ট স্পেশাল (বাংলা, ইংরেজি, গণিত, জিকে)',
      titleArabic: 'المواد العامة (البنغالية، الإنجليزية، الرياضيات)',
      cadre: 'general_subject',
      instructor: 'প্রফেসর মোঃ রফিকুল ইসলাম',
      totalModules: 32,
      completedModules: 12,
      isPremium: false,
      rating: 4.8,
      studentCount: 8400,
      progressPercent: 38,
      thumbnailBg: 'from-blue-950 via-teal-950 to-slate-900',
      description: 'সকল মাদ্রাসা ক্যাডারের ১০০ নম্বরের সাধারণ অংশের সর্বোচ্চ প্রস্তুতির ভিডিও লেকচার ও মডেল প্রশ্ন।',
    },
  ];

  const cadreFilters = [
    { id: 'all', label: 'সকল কোর্স' },
    { id: 'lecturer_arabic', label: 'আরবি প্রভাষক' },
    { id: 'assistant_maulvi', label: 'সহকারী মৌলভী' },
    { id: 'ebtedayee_head', label: 'ইবতেদায়ি মৌলভী ও কারী' },
    { id: 'general_subject', label: 'জেনারেল সাবজেক্ট' },
  ];

  const filteredCourses = coursesList.filter(
    (c) => selectedCadre === 'all' || c.cadre === selectedCadre
  );

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>মাদ্রাসা ক্যাডারভিত্তিক ভিডিও লেকচার ও প্র্যাকটিস মডিউল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            তামরীন একাডেমি কোর্সসমূহ (Courses)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            অভিজ্ঞ আলেম ও শিক্ষকদের পরিচালিত ভিডিও ক্লাস, লেকচার শিট এবং প্রতিটি অধ্যায়ের শেষে বিষয়ভিত্তিক মডেল টেস্ট।
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/15">
          <GraduationCap className="w-8 h-8 text-emerald-300" />
          <div className="text-left">
            <span className="text-[10px] text-slate-300 block">কোর্স শিক্ষার্থী</span>
            <span className="font-extrabold text-white text-base">২২,০০০+ জন</span>
          </div>
        </div>
      </div>

      {/* Cadre Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {cadreFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedCadre(filter.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCadre === filter.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              {/* Visual Thumbnail Banner */}
              <div className={`p-6 bg-gradient-to-br ${course.thumbnailBg} text-white relative`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-bold text-emerald-200 border border-white/10">
                    {course.totalModules}টি ভিডিও মডিউল
                  </span>
                  {course.isPremium ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center space-x-1">
                      <Crown className="w-3 h-3 fill-slate-950" />
                      <span>PREMIUM</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                      FREE
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-lg text-white group-hover:text-amber-200 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-emerald-200/80 font-arabic mt-1" style={{ fontFamily: "'Amiri', serif" }}>
                  {course.titleArabic}
                </p>

                {/* Progress Bar overlay inside thumbnail */}
                <div className="mt-4 pt-3 border-t border-white/15 space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-300">
                    <span>অগ্রগতি</span>
                    <span className="font-bold text-emerald-300">{course.progressPercent}% সম্পন্ন</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-amber-300 h-1.5 rounded-full"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Course Info Body */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  ইনস্ট্রাক্টর: <span className="font-semibold text-slate-800 dark:text-slate-200">{course.instructor}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{course.studentCount} ছাত্র</span>
                  </span>
                  <span className="flex items-center space-x-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.rating}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveCourse(course)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>
                  {course.progressPercent > 0 ? 'পড়া চালিয়ে যান' : 'কোর্সে প্রবেশ করুন'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  তামরীন একাডেমি কোর্স মডিউল
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                  {activeCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeCourse.description}
            </p>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                সিলেবাস মডিউলসমূহ:
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {[
                  { title: 'মডিউল ১: আল-কুরআন ও হাদিস ব্যাকরণ পরিচয়', icon: Video, time: '৪৫ মি.' },
                  { title: 'মডিউল ২: নাহু - ফেএল ও ফায়েল তারকীব বিশ্লেষণ', icon: Video, time: '৫০ মি.' },
                  { title: 'মডিউল ৩: সরফ - আবওয়াব ও মাসদার পরিবর্তন', icon: FileText, time: 'পিডিএফ শিট' },
                  { title: 'মডিউল ৪: ফিকহুস সুন্নাহ্ ও মূল মাসআলাসমূহ', icon: Video, time: '৪০ মি.' },
                ].map((mod, idx) => {
                  const ModIcon = mod.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <ModIcon className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {mod.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{mod.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                alert(`"${activeCourse.title}" এর ক্লাস শুরু হয়েছে!`);
                setActiveCourse(null);
              }}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              লেকচার শুরু করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
