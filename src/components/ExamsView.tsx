import React, { useState } from 'react';
import { ExamCategory, ExamItem, MCQQuestion } from '../types';
import { 
  FileCheck2, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Play, 
  Search, 
  Filter, 
  Flame, 
  Calendar, 
  Award, 
  X, 
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface ExamsViewProps {
  mcqQuestions: MCQQuestion[];
}

export const ExamsView: React.FC<ExamsViewProps> = ({ mcqQuestions }) => {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for actively taking an exam
  const [activeExam, setActiveExam] = useState<ExamItem | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  // Mock Exams catalog list
  const examsList: ExamItem[] = [
    {
      id: 'ex1',
      title: 'আজকের স্পেশাল ডেইলি মডেল টেস্ট (২৮তম দিন)',
      titleArabic: 'الاختبار اليومي المتخصص النموذجية',
      category: 'daily',
      durationMinutes: 20,
      totalQuestions: 25,
      difficulty: 'মাঝারি',
      participantsCount: '২.১k+',
      subject: 'আরবি ব্যাকরণ (নাহু ও সরফ)',
      isPremium: false,
    },
    {
      id: 'ex2',
      title: '১৮তম নিবন্ধন প্রি-রেজিস্ট্রেশন ফ্রি ফুল টেস্ট',
      titleArabic: 'الاختبار العام التمهيدي',
      category: 'free',
      durationMinutes: 45,
      totalQuestions: 50,
      difficulty: 'সহজ',
      participantsCount: '৫.৪k+',
      subject: 'বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান',
      isPremium: false,
    },
    {
      id: 'ex3',
      title: 'ভিআইপি প্রিমিয়াম মেগা টেস্ট: প্রভাষক আরবি ক্যাডার',
      titleArabic: 'اختبار المحاضرين الفائق المتميز',
      category: 'premium',
      durationMinutes: 60,
      totalQuestions: 100,
      difficulty: 'কঠিন',
      participantsCount: '১.২k+',
      subject: 'আল-কুরআন, হাদিস, বালাগাত ও ফিকহুস সুন্নাহ্',
      isPremium: true,
    },
    {
      id: 'ex4',
      title: 'লাইভ গ্র্যান্ড মক টেস্ট (আজ রাত ৯:০০ টা)',
      titleArabic: 'الاختبار المباشر الكبيـر',
      category: 'live',
      durationMinutes: 60,
      totalQuestions: 80,
      difficulty: 'মাঝারি',
      participantsCount: '৩.৮k+',
      subject: 'সহকারী শিক্ষক (আরবি) অল সাবজেক্ট',
      isPremium: false,
      scheduledTime: 'আজ রাত ৯:০০ টা',
    },
    {
      id: 'ex5',
      title: 'আসন্ন স্পেশাল বিষয়ভিত্তিক মডেল টেস্ট - ইবতেদায়ি কারী',
      titleArabic: 'الاختبار القادم للتجويد والقراءة',
      category: 'upcoming',
      durationMinutes: 30,
      totalQuestions: 40,
      difficulty: 'সহজ',
      participantsCount: '১.৫k+',
      subject: 'তাজবীদ ও কিরাআত শাস্ত্র',
      isPremium: false,
      scheduledTime: 'আগামীকাল সকাল ১০:০০ টা',
    },
    {
      id: 'ex6',
      title: 'বিগত সপ্তাহের সম্পন্নকৃত মডেল টেস্ট - ১',
      titleArabic: 'الاختبار المكتمل الأسبوعي',
      category: 'completed',
      durationMinutes: 30,
      totalQuestions: 30,
      difficulty: 'মাঝারি',
      participantsCount: '৪.০k+',
      subject: 'ইসলামী ইতিহাস ও সামাজিক বিজ্ঞান',
      isPremium: false,
    },
  ];

  const categories = [
    { id: 'all', label: 'সকল পরীক্ষা' },
    { id: 'daily', label: 'ডেইলি মডেল টেস্ট' },
    { id: 'free', label: 'ফ্রি পরীক্ষা' },
    { id: 'premium', label: 'প্রিমিয়াম পরীক্ষা' },
    { id: 'live', label: 'লাইভ পরীক্ষা' },
    { id: 'upcoming', label: 'আসন্ন পরীক্ষা' },
    { id: 'completed', label: 'সম্পন্নকৃত' },
  ];

  const filteredExams = examsList.filter((exam) => {
    const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartExam = (exam: ExamItem) => {
    setActiveExam(exam);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setIsExamSubmitted(false);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
  };

  // Exam Score Calculations
  const questionsToUse = mcqQuestions.slice(0, activeExam?.totalQuestions || 10);
  const correctCount = Object.entries(userAnswers).filter(
    ([qIdx, ansIdx]) => questionsToUse[Number(qIdx)]?.correctAnswer === ansIdx
  ).length;
  const totalQuestionsCount = questionsToUse.length;
  const scorePercentage = totalQuestionsCount > 0 ? Math.round((correctCount / totalQuestionsCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>১৮তম নিবন্ধন পরীক্ষা স্পেশাল হলের অনুকরণে</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            মডেল টেস্ট ও পরীক্ষা সেন্টার (Exams)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            ডেইলি মডেল টেস্ট, বিনামূল্যে সাধারণ পরীক্ষা এবং প্রিমিয়াম লাইভ পরীক্ষার মাধ্যমে নিজের প্রস্তুতি যাচাই করুন।
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/15">
          <FileCheck2 className="w-8 h-8 text-amber-400" />
          <div className="text-left">
            <span className="text-[10px] text-slate-300 block">মোট পরীক্ষা</span>
            <span className="font-extrabold text-white text-base">১,২৫০+ টি</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="পরীক্ষা বা বিষয় দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  exam.category === 'daily'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    : exam.category === 'free'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : exam.category === 'premium'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                }`}>
                  {exam.category === 'daily' ? 'ডেইলি মডেল টেস্ট' : exam.category === 'free' ? 'ফ্রি পরীক্ষা' : exam.category === 'premium' ? 'প্রিমিয়াম' : 'লাইভ / স্পেশাল'}
                </span>

                <span className="text-[11px] font-medium text-slate-400">
                  {exam.difficulty} স্তর
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 leading-snug">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-arabic mt-0.5" style={{ fontFamily: "'Amiri', serif" }}>
                  {exam.titleArabic}
                </p>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400">
                বিষয়: <span className="font-semibold text-slate-800 dark:text-slate-200">{exam.subject}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{exam.durationMinutes} মিনিট</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{exam.totalQuestions} প্রশ্ন</span>
                </div>
                <div className="flex items-center space-x-1.5 col-span-2 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exam.participantsCount} পরীক্ষার্থী অংশগ্রহণ করেছে</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartExam(exam)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>পরীক্ষা শুরু করুন</span>
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Exam Modal Runner */}
      {activeExam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
                  {activeExam.subject}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                  {activeExam.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveExam(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isExamSubmitted ? (
              /* Exam Question View */
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  <span>প্রশ্ন {currentQuestionIdx + 1} / {questionsToUse.length}</span>
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <Clock className="w-3.5 h-3.5 mr-1" /> সময় বাকি: ১৮:৪০ মি.
                  </span>
                </div>

                {questionsToUse[currentQuestionIdx] && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                      {questionsToUse[currentQuestionIdx].question}
                    </h4>

                    {questionsToUse[currentQuestionIdx].questionArabic && (
                      <p className="font-arabic text-lg text-emerald-900 dark:text-emerald-300 font-semibold bg-emerald-50/50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/40" style={{ fontFamily: "'Amiri', serif" }}>
                        {questionsToUse[currentQuestionIdx].questionArabic}
                      </p>
                    )}

                    <div className="space-y-2.5">
                      {questionsToUse[currentQuestionIdx].options.map((opt, oIdx) => {
                        const isSelected = userAnswers[currentQuestionIdx] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(currentQuestionIdx, oIdx)}
                            className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                              isSelected
                                ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-md'
                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:bg-emerald-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  >
                    পূর্ববর্তী
                  </button>

                  {currentQuestionIdx < questionsToUse.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow"
                    >
                      পরবর্তী প্রশ্ন
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg"
                    >
                      পরীক্ষা সাবমিট করুন
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Exam Result View */
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    পরীক্ষার ফলাফল সাবমিট হয়েছে!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    তামরীন একাডেমি লিডারবোর্ডে আপনার নম্বর যুক্ত হয়েছে
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">মোট প্রশ্ন</span>
                    <span className="font-extrabold text-base text-slate-800 dark:text-slate-200">{totalQuestionsCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">সঠিক উত্তর</span>
                    <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">{correctCount}টি</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">স্কোর হার</span>
                    <span className="font-extrabold text-base text-amber-500">{scorePercentage}%</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveExam(null)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  পরীক্ষার তালিকা দেখুন
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
