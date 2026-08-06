import { MCQQuestion } from '../types';

export const QUESTION_BANK: MCQQuestion[] = [
  // --- আল-কুরআন ও আল-হাদিস (Quran & Hadith) ---
  {
    id: 'qh-1',
    question: 'কুরআন মজিদের সর্বপ্রথম কোন সূরাটি পূর্ণাঙ্গ অবতীর্ণ হয়?',
    questionArabic: 'مَا هِيَ أَوَّلُ سُورَةٍ نَزَلَتْ كَامِلَةً فِي الْقُرْآنِ الْكَرِيمِ؟',
    options: ['سُورَةُ الْفَاتِحَةِ (সূরা আল-ফাতিহা)', 'سُورَةُ الْعَلَقِ (সূরা আল-আলাক্ব)', 'سُورَةُ الْإِخْلَاصِ (সূরা আল-ইখলাস)', 'سُورَةُ الْبَقَرَةِ (সূরা আল-বাক্বারাহ)'],
    optionsArabic: ['سُورَةُ الْفَاتِحَةِ', 'سُورَةُ الْعَلَقِ', 'سُورَةُ الْإِخْلَاصِ', 'سُورَةُ الْبَقَرَةِ'],
    correctAnswer: 0,
    explanation: 'সূরা আল-ফাতিহা কুরআন মজিদের ১ম পূর্ণাঙ্গ অবতীর্ণ সূরা। অপরদিকে সূরা আল-আলাকের প্রথম ৫ আয়াত প্রথম অবতীর্ণ হয়।',
    subject: 'quran_hadith',
    cadre: ['assistant_teacher_arabic', 'lecturer_arabic', 'assistant_maulvi', 'ebtedayee_head'],
    yearTag: '১৭তম মাদ্রাসা পরীক্ষা ২০২৩',
    difficulty: 'easy',
  },
  {
    id: 'qh-2',
    question: "'হাদিসে মুতাওয়াতির' (الْحَدِيثُ الْمُتَوَاتِرُ) বলতে কী বোঝায়?",
    questionArabic: 'مَا الْمُرَادُ بِالْحَدِيثِ الْمُتَوَاتِرِ؟',
    options: [
      'যে হাদিস প্রতি যুগে এত বিপুল সংখ্যক রাবী বর্ণনা করেছেন যে তাদের মিথ্যাচার অসম্ভব',
      'যে হাদিসের সনদে কেবল একজন রাবী রয়েছেন',
      'যে হাদিসের সনদ বিচ্ছিন্ন',
      'যে হাদিস কেবল সাহাবীর বাণী হিসেবে বর্ণিত'
    ],
    correctAnswer: 0,
    explanation: 'যে হাদিস প্রতিটি যুগে এতো অধিক সংখ্যক রাবী বর্ণনা করেছেন যে তাদের সকলে মিলে মিথ্যা চক্রান্ত করা যৌক্তিকভাবে অসম্ভব, তাকে হাদিসে মুতাওয়াতির বলে।',
    subject: 'quran_hadith',
    cadre: ['lecturer_arabic', 'assistant_teacher_arabic', 'assistant_maulvi'],
    yearTag: '১৬তম মাদ্রাসা পরীক্ষা ২০১৯',
    difficulty: 'medium',
  },
  {
    id: 'qh-3',
    question: "কুরআনের তাফসীরে 'তাফসীর বিল মা'ছূর' (التَّفْسِيرُ بِالْمَأْثُورِ) এর প্রধান উৎস কোনটি?",
    questionArabic: 'مَا هُوَ الْمَصْدَرُ الرَّئِيسِيُّ لِلتَّفْسِيرِ بِالْمَأْثُورِ؟',
    options: [
      'কুরআন দ্বারা কুরআনের ব্যাখ্যা ও বিশুদ্ধ হাদিস',
      'ব্যক্তিগত যুক্তি ও রায়',
      'দার্শনিক দৃষ্টিভঙ্গি',
      'ইসরারিলী রেওয়ায়াত'
    ],
    correctAnswer: 0,
    explanation: 'তাফসীর বিল মাছূর হলো কুরআন, হাদিস, সাহাবী ও তাবেঈগণের আসার ভিত্তিক ব্যাখ্যা। তাফসীরে ইবনে কাছীর এর একটি উৎকৃষ্ট উদাহরণ।',
    subject: 'quran_hadith',
    cadre: ['lecturer_arabic', 'assistant_teacher_arabic'],
    yearTag: '১৫তম মাদ্রাসা পরীক্ষা ২০১৮',
    difficulty: 'medium',
  },

  // --- ফিকহ ও উসূলে ফিকহ (Fiqh & Usul) ---
  {
    id: 'fq-1',
    question: "ইসলামী শরীয়তের ৪র্থ মৌলিক উৎস কোনটি?",
    questionArabic: 'مَا هُوَ الْمَصْدَرُ الرَّابِعُ مِنْ مَصَادِرِ التَّشْرِيعِ الْإِسْلَامِيِّ؟',
    options: ['কিয়াসের (الْقِيَاسُ)', 'ইজমা (الْإِجْمَاعُ)', 'কুরআন (الْقُرْآنُ)', 'হাদিস (الْحَدِيثُ)'],
    correctAnswer: 0,
    explanation: 'শরীয়তের চার প্রধান মৌলিক দলিল: ১. কুরআন, ২. সুন্নাহ, ৩. ইজমা, ৪. কিয়াস।',
    subject: 'fiqh_usul',
    cadre: ['assistant_teacher_arabic', 'lecturer_arabic', 'assistant_maulvi', 'ebtedayee_head'],
    yearTag: '১৭তম মাদ্রাসা পরীক্ষা ২০২৩',
    difficulty: 'easy',
  },
  {
    id: 'fq-2',
    question: "ফিকহ শাস্ত্রের বিখ্যাত গ্রন্থ 'আল-হিদায়া' (الْهِدَايَةُ) এর রচয়িতা কে?",
    questionArabic: 'مَنْ هُوَ مُؤَلِّفُ كِتَابِ "الْهِدَايَةِ" فِي الْفِقْهِ الْحَنَفِيِّ؟',
    options: [
      'আল্লামা বুরহানুদ্দীন আল-মারগীনানী (র.) [الْمَرْغِينَانِيُّ]',
      'ইমাম আবু হানিফা (র.) [أَبُو حَنِيفَةَ]',
      'ইমাম ক্বুদূরী (র.) [الْقُدُورِيُّ]',
      'ইমাম আবু ইউসুফ (র.) [أَبُو يُوسُفَ]'
    ],
    correctAnswer: 0,
    explanation: 'আল-হিদায়া গ্রন্থটি হানাফী ফিকহের অন্যতম প্রামাণ্য গ্রন্থ, যা আল্লামা বুরহানুদ্দীন ফারগানী আল-মারগীনানী (রহ.) রচনা করেছেন।',
    subject: 'fiqh_usul',
    cadre: ['lecturer_arabic', 'assistant_teacher_arabic', 'assistant_maulvi'],
    yearTag: '১৬তম মাদ্রাসা পরীক্ষা ২০১৯',
    difficulty: 'medium',
  },
  {
    id: 'fq-3',
    question: "মিরাস বা ফরায়েজ শাস্ত্রে 'আসাবা' (الْعَصَبَةُ) বলতে কাদের বোঝানো হয়?",
    questionArabic: 'مَنْ هُمُ "الْعَصَبَةُ" فِي عِلْمِ الْفَرَائِضِ؟',
    options: [
      'যারা নির্দিষ্ট অংশ নেওয়ার পর অবশিষ্ট সম্পত্তির মালিক হয়',
      'যাদের অংশ কুরআন মজিদে সুনির্দিষ্ট (জবুল ফুরূজ)',
      'যারা সম্পত্তি হতে সম্পূর্ণ বঞ্চিত হয়',
      'দূরের আত্মীয়-স্বজন'
    ],
    correctAnswer: 0,
    explanation: 'আসাবা হলো সেই সব ওয়ারিশ, যারা নির্দিষ্ট অংশীদারদের (জবুল ফুরূজ) অংশ দেয়ার পর অবশিষ্ট সম্পদের সমস্তটা পায়।',
    subject: 'fiqh_usul',
    cadre: ['lecturer_arabic', 'assistant_teacher_arabic'],
    yearTag: '১৪তম মাদ্রাসা পরীক্ষা ২০১৭',
    difficulty: 'hard',
  },

  // --- আরবি ভাষা, নাহু ও সরফ (Arabic Language & Grammar) ---
  {
    id: 'ar-1',
    question: "আরবি ব্যাকরণে 'ইলমে নাহু' (عِلْمُ النَّحْوِ) এর মূল আলোচ্য বিষয় কী?",
    questionArabic: 'مَا هُوَ مَوْضُوعُ عِلْمِ النَّحْوِ؟',
    options: [
      'শব্দসমূহের শেষ অক্ষরের এরাব (إِعْرَابٌ) ও বাক্যের গঠন',
      'একক শব্দের গঠন পরিবর্তন (التَّرْخِيمُ وَالِاشْتِقَاقُ)',
      'বাক্যের সৌন্দর্য ও অলংকার (الْبَلَاغَةُ)',
      'শব্দের সঠিক উচ্চারণ স্থান (مَخْرَجٌ)'
    ],
    correctAnswer: 0,
    explanation: 'ইলমে নাহু বাক্যের শেষ অক্ষরের পরিবর্তন ও হরকত (ইরাব) নির্ধারণ এবং বাক্য গঠন নীতি নিয়ে আলোচনা করে। শব্দের অভ্যন্তরীণ রূপান্তর আলোচনা করে ইলমে সরফ।',
    subject: 'arabic_grammar',
    cadre: ['assistant_teacher_arabic', 'lecturer_arabic', 'assistant_maulvi', 'ebtedayee_head'],
    yearTag: '১৭তম মাদ্রাসা পরীক্ষা ২০২৩',
    difficulty: 'easy',
  },
  {
    id: 'ar-2',
    question: "'হরুফে মুশাব্বাহা বিল ফিল' (الْحُرُوفُ الْمُشَبَّهَةُ بِالْفِعْلِ) কয়টি?",
    questionArabic: 'كَمْ عَدَدُ الْحُرُوفِ الْمُشَبَّهَةِ بِالْفِعْلِ؟',
    options: ['৬টি (أَنَّ، إِنَّ، كَأَنَّ، لٰكِنَّ، لَيْتَ، لَعَلَّ)', '৫টি', '৭টি', '৪টি'],
    correctAnswer: 0,
    explanation: 'الحروف المشبهة بالفعل ৬টি: إنّ, أنّ, كأنّ, لكنّ, ليت, لعلّ। এগুলো ইসমে ফায়েল ও মেফউলের সাথে সাদৃশ্যপূর্ণ কাজ করে।',
    subject: 'arabic_grammar',
    cadre: ['assistant_teacher_arabic', 'lecturer_arabic', 'assistant_maulvi'],
    yearTag: '১৫তম মাদ্রাসা পরীক্ষা ২০১৮',
    difficulty: 'medium',
  },
  {
    id: 'ar-3',
    question: "'ইনকানাত আল-আরদ ফাসিহাতান' - এখানে 'ফাসিহাতান' শব্দের ইরাব কী?",
    questionArabic: 'إِعْرَابُ كَلِمَةِ "فَسِيحَةً" فِي جُمْلَةِ: كَانَتِ الْأَرْضُ فَسِيحَةً؟',
    options: ['খবরে কানা (خَبَرُ كَانَ) এবং মনসূব', 'ইসমে কানা (اسْمُ كَانَ) এবং মরফূ', 'ফায়েল (فَاعِلٌ)', 'মফউলে মুতলাক'],
    correctAnswer: 0,
    explanation: 'كان এবং এর সমগোত্রীয় ফিলগুলো জুমলায়ে ইসমিয়ার উপর প্রবেশ করে ইসমকে পেশ (মরফু) এবং খবরকে জবর (মনসুব) প্রদান করে। তাই ফাসিহাতান হলো খবরে কানা।',
    subject: 'arabic_grammar',
    cadre: ['lecturer_arabic', 'assistant_teacher_arabic'],
    yearTag: '১৬তম মাদ্রাসা পরীক্ষা ২০১৯',
    difficulty: 'medium',
  },

  // --- বাংলা সাহিত্য ও ব্যাকরণ (Bangla Language) ---
  {
    id: 'bn-1',
    question: 'বাংলা সাহিত্যের প্রাচীনতম নিদর্শন "চর্যাপদ" কত সালে আবিষ্কৃত হয়?',
    options: ['১৯০৭ সালে (হরপ্রসাদ শাস্ত্রী কর্তৃক)', '১৯২১ সালে', '১৯১৩ সালে', '১৮৬০ সালে'],
    correctAnswer: 0,
    explanation: '১৯০৭ সালে মহামহোপাধ্যায় হরপ্রসাদ শাস্ত্রী নেপালের রাজদরবারের রয়্যাল লাইব্রেরি থেকে চর্যাপদের পুঁথি আবিষ্কার করেন।',
    subject: 'bangla',
    cadre: ['all'],
    yearTag: '১৭তম প্রশ্নপত্র ২০২৩',
    difficulty: 'easy',
  },
  {
    id: 'bn-2',
    question: '"ক্ষমার যোগ্য" - এর বাক্য সংকোচন কোনটি?',
    options: ['ক্ষমার্হ', 'ক্ষমনীয়', 'ক্ষমাযোগ্য', 'ক্ষমাশীল'],
    correctAnswer: 0,
    explanation: 'ক্ষমার যোগ্য = ক্ষমার্হ। ক্ষমার যোগ্য নয় = অক্ষমনীয়।',
    subject: 'bangla',
    cadre: ['all'],
    yearTag: '১৬তম প্রশ্নপত্র ২০১৯',
    difficulty: 'easy',
  },

  // --- English Language & Grammar ---
  {
    id: 'en-1',
    question: "Choose the correct passive form of: 'Who taught you Arabic?'",
    options: [
      'By whom were you taught Arabic?',
      'Who was taught Arabic by you?',
      'By whom you were taught Arabic?',
      'Whom was Arabic taught to you?'
    ],
    correctAnswer: 0,
    explanation: "Who এর পরিবর্তে 'By whom' বসে + Auxiliary verb (were) + subject (you) + V3 (taught) + object (Arabic)?",
    subject: 'english',
    cadre: ['all'],
    yearTag: '১৭তম প্রশ্নপত্র ২০২৩',
    difficulty: 'medium',
  },
  {
    id: 'en-2',
    question: "What is the synonym of the word 'BENEVOLENT'?",
    options: ['Generous / Kind', 'Malevolent', 'Cruel', 'Selfish'],
    correctAnswer: 0,
    explanation: 'Benevolent শব্দের অর্থ দয়ালু বা দানশীল, যার সমার্থক শব্দ Generous, Kind, Altruistic।',
    subject: 'english',
    cadre: ['all'],
    yearTag: '১৫তম প্রশ্নপত্র ২০১৮',
    difficulty: 'easy',
  },

  // --- সাধারণ গণিত ও মানসিক দক্ষতা (Mathematics) ---
  {
    id: 'math-1',
    question: 'একটি সমবাহু ত্রিভুজের বাহুর দৈর্ঘ্য ৪ সেমি হলে এর ক্ষেত্রফল কত বর্গ সেমি?',
    options: ['4√3', '2√3', '8√3', '16'],
    correctAnswer: 0,
    explanation: 'সমবাহু ত্রিভুজের ক্ষেত্রফল = (√3/4) × a²। এখানে a = 4, সুতরাং (√3/4) × 16 = 4√3 বর্গ সেমি।',
    subject: 'mathematics',
    cadre: ['all'],
    yearTag: '১৭তম প্রশ্নপত্র ২০২৩',
    difficulty: 'medium',
  },

  // --- সাধারণ জ্ঞান ও তথ্যপ্রযুক্তি (General Knowledge & ICT) ---
  {
    id: 'gk-1',
    question: 'বাংলাদেশের প্রথম মাদ্রাসা শিক্ষা বোর্ড কবে প্রতিষ্ঠিত হয়?',
    options: ['১৯৭৮ সালে (মাদ্রাসা শিক্ষা বোর্ড অধ্যাদেশ)', '১৯৪৭ সালে', '১৯৫২ সালে', '১৯৮৫ সালে'],
    correctAnswer: 0,
    explanation: '১৯৭৮ খ্রিষ্টাব্দে বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অধ্যাদেশ অনুযায়ী স্বতন্ত্র বোর্ডের রূপ লাভ করে।',
    subject: 'general_knowledge',
    cadre: ['all'],
    yearTag: '১৬তম মাদ্রাসা পরীক্ষা ২০১৯',
    difficulty: 'medium',
  },
  {
    id: 'gk-2',
    question: "ইসলামী সভ্যতায় প্রথম বায়তুল মাল (জনকল্যাণ তহবিল) গঠন করেন কে?",
    options: ['হযরত ওমর ইবনুল খাত্তাব (রা.) [عُمَرُ بْنُ الْخَطَّابِ]', 'হযরত আবু বকর (রা.) [أَبُو بَكْرٍ]', 'হযরত ওসমান (রা.) [عُثْمَانُ]', 'হযরত আলী (রা.) [عَلِيٌّ]'],
    correctAnswer: 0,
    explanation: 'হযরত ওমর (রা.) ইসলামী রাষ্ট্রব্যবস্থায় সুসংগঠিত বায়তুল মাল, দেওয়ান ও প্রশাসনিক কাঠামো গড়ে তোলেন।',
    subject: 'islamic_history',
    cadre: ['assistant_teacher_arabic', 'lecturer_arabic', 'lecturer_islamic_history', 'assistant_maulvi'],
    yearTag: '১৭তম মাদ্রাসা পরীক্ষা ২০২৩',
    difficulty: 'easy',
  }
];

