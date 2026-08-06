import { CourseItem } from '../types';

export const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'c_general_free',
    title: 'জেনারেল',
    titleArabic: 'المواد العامة (البنغالية، الإنجليزية، الرياضيات)',
    cadre: 'general_subject',
    instructor: 'ওস্তাদ প্যানেল ও বিষয়ভিত্তিক বিশেষজ্ঞ',
    totalModules: 24,
    completedModules: 24,
    isPremium: false,
    rating: 4.9,
    studentCount: 14200,
    progressPercent: 100,
    thumbnailBg: 'from-amber-600 via-amber-700 to-slate-900',
    description: '৯ম শিক্ষক নিবন্ধন ও মাদ্রাসা পরীক্ষার জেনারেল অংশ (বাংলা, ইংরেজি, গণিত ও জিকে) ফ্রি এক্সাম ব্যাচ।',
    badgeType: 'free',
    bannerUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop',
    detailsText: `স্বাগতম জেনারেল ফ্রি এক্সাম ব্যাচে!

কোর্সের বিষয়সমূহ:
• জেনারেল বাংলা ও সাহিত্য
• ইংলিশ গ্রামার ও ভোকাবুলারি
• সাধারণ গণিত ও মানসিক দক্ষতা
• বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী

সুবিধাসমূহ:
১. প্রতিদিন বিষয়ভিত্তিক সংক্ষিপ্ত কুইজ ও উত্তরপত্র পর্যালোচনা।
২. ফ্রি ডাউনলোডযোগ্য হ্যান্ডআউট ও লেকচার নোট।
৩. ওস্তাদ সাপোর্ট ও সাপ্তাহিক সলভ সেসন।`,
    routineText: `📅 ৯ম মাদ্রাসা শিক্ষক নিবন্ধন - লাইভ ক্লাস ও পরীক্ষা রুটিন:

• শনি-সোম-বুধ (রাত ৮:০০ টা): বাংলা ও ইংরেজি স্পেশাল ক্লাস
• রবি-মঙ্গল-বৃহস্পতি (রাত ৮:০০ টা): সাধারণ গণিত ও জিকে সলভ ক্লাস
• প্রতিদিন রাত ৯:৩০ টা: বিষয়ভিত্তিক অনলাইন কুইজ (২০ নম্বর)
• শুক্রবার রাত ৮:০০ টা: সাপ্তাহিক পূর্ণাঙ্গ মডেল টেস্ট (১০০ নম্বর)`,
    syllabusText: `📖 ৯ম মাদ্রাসা শিক্ষক নিবন্ধন সম্পূর্ণ সিলেবাস (১০০ নম্বর):

১. বাংলা (২৫ নম্বর):
   - ব্যাকরণ: সন্ধি, সমাস, কারক, প্রত্যয়, শব্দ ও বাক্য রূপান্তর।
   - সাহিত্য: প্রাচীন, মধ্য ও আধুনিক যুগের গুরুত্বপূর্ণ সাহিত্যিক ও রচনা।

২. ইংরেজি (২৫ নম্বর):
   - Grammar: Parts of Speech, Tense, Voice, Narration, Correction.
   - Vocabulary: Synonyms, Antonyms, Idioms & Phrases, Prepositions.

৩. সাধারণ গণিত (২৫ নম্বর):
   - পাটিগণিত: শতকরা, লাভ-ক্ষতি, অনুপাত, ল.সা.গু ও গ.সা.গু।
   - বীজগণিত ও জ্যামিতি: মান নির্ণয়, উৎপাদক, কোণ ও ত্রিভুজ সংক্রান্ত সূত্রাবলি।

৪. সাধারণ জ্ঞান (২৫ নম্বর):
   - বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি, সাম্প্রতিক তথ্য ও আইসিটি।`,
    sheetsCount: 20,
    examsCount: 25,
    classesCount: 30,
    priceText: 'ফ্রি',
    isEnrolled: true,
    isFreeCourse: true,
    isPlanLocked: false,
    isRoutineLocked: false,
    isSyllabusLocked: false,
    isSheetsLocked: false,
    isExamsLocked: false,
    customPlans: [
      { id: 'p1', title: 'কোর্স রুটিন ও ওরিয়েন্টেশন নির্দেশিকা', code: 'Plan- 01', sizeOrTime: '১.২ মেগাবাইট', isLocked: false },
      { id: 'p2', title: 'অধ্যায়ভিত্তিক পূর্ণাঙ্গ নম্বর বণ্টন ও সিলেবাস', code: 'Plan- 02', sizeOrTime: '২.৫ মেগাবাইট', isLocked: false },
    ],
    customRoutines: [
      { id: 'r1', title: 'সাপ্তাহিক লাইভ ক্লাস ও পরীক্ষা রুটিন (সংশোধিত)', code: 'Routine- 01', sizeOrTime: 'প্রতিদিন রাত ৮:০০ টা', isLocked: false },
      { id: 'r2', title: 'মডেল টেস্ট সূচি ও সলভ সেসন টাইমটেবিল', code: 'Routine- 02', sizeOrTime: 'সপ্তাহে ৩ দিন', isLocked: false },
    ],
    customSyllabuses: [
      { id: 'syl1', title: '৯ম মাদ্রাসা শিক্ষক নিবন্ধন সম্পূর্ণ সিলেবাস', code: 'Syllabus 100 Marks', sizeOrTime: 'pdf (২ মেগাবাইট)', isLocked: false },
      { id: 'syl2', title: 'জেনারেল বাংলা, ইংলিশ ও গণিত টপিকভিত্তিক মার্ক ডিস্ট্রিবিউশন', code: 'Topics Breakdown', sizeOrTime: 'pdf (১.৫ মেগাবাইট)', isLocked: false },
    ],
    customSheets: [
      { id: 's1', title: 'জেনারেল বাংলা ও সাহিত্য সর্ট হ্যান্ডআউট.pdf', code: 'PDF Sheet 01', sizeOrTime: '১.৫ মেগাবাইট', isLocked: false },
      { id: 's2', title: 'English Grammar Quick Revision Sheet.pdf', code: 'PDF Sheet 02', sizeOrTime: '২.০ মেগাবাইট', isLocked: false },
    ],
    customExams: [
      { id: 'e1', title: 'ফ্রি মডেল টেস্ট 01: সাধারণ অংশ পূর্ণাঙ্গ প্রস্তুতি', code: '৫০টি প্রশ্ন', sizeOrTime: '৩০ মিনিট', isLocked: false },
    ],
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
    priceText: '৳৪৫০',
    isEnrolled: false,
    isFreeCourse: false,
    isPlanLocked: true,
    isSheetsLocked: true,
    isExamsLocked: true,
    customPlans: [
      { id: 'p1', title: 'কোর্স রুটিন ও ওরিয়েন্টেশন নির্দেশিকা', code: 'Plan- 01', sizeOrTime: '১.২ মেগাবাইট' },
      { id: 'p2', title: 'অধ্যায়ভিত্তিক পূর্ণাঙ্গ নম্বর বণ্টন ও সিলেবাস', code: 'Plan- 02', sizeOrTime: '২.৫ মেগাবাইট' },
      { id: 'p3', title: 'মাদরাসা শিক্ষক নিবন্ধনের বিশেষ প্রশ্ন ব্যাংক সমাধান', code: 'Plan- 03', sizeOrTime: '৩.১ মেগাবাইট' },
      { id: 'p4', title: 'লাইভ সলভ ক্লাস ও ওস্তাদ পরামর্শ সূচি', code: 'Plan- 04', sizeOrTime: '১.৮ মেগাবাইট' },
    ],
    customSheets: [
      { id: 's1', title: 'Exam- 01 মাকামাতু কুফিয়্যাহ.pdf', code: 'PDF Sheet 01' },
      { id: 's2', title: 'Exam- 02-সূরা বাকারা.pdf', code: 'PDF Sheet 02' },
      { id: 's3', title: 'Exam- 03 কিতাবুল ঈমান.pdf', code: 'PDF Sheet 03' },
      { id: 's4', title: 'Exam- 04 আল-হাদিস ও সানাদ হ্যান্ডআউট.pdf', code: 'PDF Sheet 04' },
      { id: 's5', title: 'Exam- 05 নাহু ও সরফ তারকীব রুলস.pdf', code: 'PDF Sheet 05' },
    ],
    customExams: [
      { id: 'e1', title: 'পরীক্ষা 01: আল-কুরআন ও তাফসীর মডেল টেস্ট', code: '৫০টি প্রশ্ন', sizeOrTime: '৩০ মিনিট' },
      { id: 'e2', title: 'পরীক্ষা 02: আল-হাদিস ও সানাদ মডেল টেস্ট', code: '৫০টি প্রশ্ন', sizeOrTime: '৩০ মিনিট' },
      { id: 'e3', title: 'পরীক্ষা 03: নাহু ও সরফ অধ্যায় মডেল টেস্ট', code: '৫০টি প্রশ্ন', sizeOrTime: '৩০ মিনিট' },
      { id: 'e4', title: 'পরীক্ষা 04: ফিকহ ও মূল মাসআলা মডেল টেস্ট', code: '১০০টি প্রশ্ন', sizeOrTime: '৬০ মিনিট' },
    ],
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
    isFreeCourse: false,
    isPlanLocked: true,
    isSheetsLocked: true,
    isExamsLocked: true,
    customPlans: [
      { id: 'p1', title: 'সাবজেক্টিভ সম্পূর্ণ কোর্স প্ল্যান ও সময়সূচি', code: 'Plan- 01', sizeOrTime: '২.০ মেগাবাইট' },
    ],
    customSheets: [
      { id: 's1', title: 'মৌলবি সাবজেক্টিভ আল-কুরআন প্রশ্ন ব্যাংক.pdf', code: 'PDF Sheet 01' },
      { id: 's2', title: 'ফিকহুস সুন্নাহ্ ও প্রধান মাসআলা নোট.pdf', code: 'PDF Sheet 02' },
    ],
    customExams: [
      { id: 'e1', title: 'সাবজেক্টিভ চুড়ান্ত প্রস্তুতি পরীক্ষা', code: '১০০টি প্রশ্ন', sizeOrTime: '৬০ মিনিট' },
    ],
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
    isFreeCourse: false,
    isPlanLocked: true,
    isSheetsLocked: true,
    isExamsLocked: true,
    customPlans: [
      { id: 'p1', title: 'আরবি প্রভাষক সম্পূর্ণ লেকচার প্ল্যান', code: 'Plan- 01', sizeOrTime: '৩.০ মেগাবাইট' },
    ],
    customSheets: [
      { id: 's1', title: 'উচ্চতর আরবি সাহিত্য ও বালাগাত নোট.pdf', code: 'PDF Sheet 01' },
      { id: 's2', title: 'তাফসীরে জালালাইন ও বায়জাবী নোট.pdf', code: 'PDF Sheet 02' },
    ],
    customExams: [
      { id: 'e1', title: 'প্রভাষক আরবি প্রথম পত্র বিশেষ পরীক্ষা', code: '১০০টি প্রশ্ন', sizeOrTime: '৬০ মিনিট' },
    ],
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
    isFreeCourse: false,
    isPlanLocked: true,
    isSheetsLocked: true,
    isExamsLocked: true,
  },
  {
    id: 'c_general_special',
    title: 'জেনারেল সাবজেক্ট মাস্টারকোর্স (বাংলা, ইংরেজি, গণিত)',
    titleArabic: 'دورة المواد العامة الشاملة',
    cadre: 'general_subject',
    instructor: 'ওস্তাদ প্যানেল ও বিষয়ভিত্তিক বিশেষজ্ঞ',
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
    isFreeCourse: false,
    isPlanLocked: true,
    isSheetsLocked: true,
    isExamsLocked: true,
  },
];

export const getStoredCourses = (): CourseItem[] => {
  try {
    const saved = localStorage.getItem('tamreen_courses_data');
    if (saved) {
      const courses: CourseItem[] = JSON.parse(saved);
      let updated = false;
      const sanitized = courses.map(c => {
        if (c.instructor === 'প্রফেসর মোঃ রফিকুল ইসলাম') {
          updated = true;
          return { ...c, instructor: 'ওস্তাদ প্যানেল ও বিষয়ভিত্তিক বিশেষজ্ঞ' };
        }
        return c;
      });
      if (updated) {
        saveCoursesToStorage(sanitized);
      }
      return sanitized;
    }
  } catch (e) {
    console.error('Failed to load courses from localStorage', e);
  }
  return DEFAULT_COURSES;
};

export const saveCoursesToStorage = (courses: CourseItem[]) => {
  try {
    localStorage.setItem('tamreen_courses_data', JSON.stringify(courses));
    // Trigger custom event so other views refresh automatically
    window.dispatchEvent(new Event('tamreen_courses_updated'));
  } catch (e) {
    console.error('Failed to save courses to localStorage', e);
  }
};
