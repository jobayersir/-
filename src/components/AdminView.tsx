import React, { useState, useEffect } from 'react';
import { MCQQuestion, SubjectCategory, PostCadre, CourseItem, CourseContentItem } from '../types';
import { QUESTION_BANK } from '../data/questionBank';
import { getStoredCourses, saveCoursesToStorage, DEFAULT_COURSES } from '../data/coursesData';
import { 
  PlusCircle, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  BookOpen, 
  ShieldAlert, 
  FileText, 
  Save, 
  HelpCircle,
  Copy,
  Layers,
  Bot,
  Lock,
  Unlock,
  GraduationCap,
  FileSpreadsheet,
  Users,
  RotateCcw,
  Plus,
  PenTool,
  DollarSign
} from 'lucide-react';

interface AdminViewProps {
  customQuestions?: MCQQuestion[];
  onAddQuestion?: (newQ: MCQQuestion) => void;
  onUpdateQuestion?: (updatedQ: MCQQuestion) => void;
  onDeleteQuestion?: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  customQuestions = [],
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  const [allQuestions, setAllQuestions] = useState<MCQQuestion[]>(() => {
    const saved = localStorage.getItem('tamreen_admin_questions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved admin questions');
      }
    }
    return QUESTION_BANK;
  });

  // Course Management State
  const [courses, setCourses] = useState<CourseItem[]>(() => getStoredCourses());
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  const [activeTab, setActiveTab] = useState<'courses' | 'add' | 'manage'>('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [editingQ, setEditingQ] = useState<MCQQuestion | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State for New Question
  const [questionText, setQuestionText] = useState('');
  const [questionArabic, setQuestionArabic] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [manualExplanation, setManualExplanation] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('arabic_grammar');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [yearTag, setYearTag] = useState('মাদ্রাসা মডেল টেস্ট ২০২৬');

  // New Content Item Form inside Course Edit
  const [newItemType, setNewItemType] = useState<'plan' | 'routine' | 'syllabus' | 'sheet' | 'exam'>('plan');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemSizeTime, setNewItemSizeTime] = useState('');

  const saveToStorage = (updatedList: MCQQuestion[]) => {
    setAllQuestions(updatedList);
    localStorage.setItem('tamreen_admin_questions', JSON.stringify(updatedList));
  };

  const handleSaveCourse = (updatedCourse: CourseItem) => {
    const updated = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    setCourses(updated);
    saveCoursesToStorage(updated);
    setEditingCourse(null);
    setSuccessMsg('কোর্স তথ্য সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddNewCourse = () => {
    const newC: CourseItem = {
      id: `c_admin_${Date.now()}`,
      title: 'নতুন মাদ্রাসা বিশেষ কোর্স',
      cadre: 'assistant_maulvi',
      instructor: 'ওস্তাদ নাম',
      totalModules: 20,
      completedModules: 0,
      isPremium: true,
      rating: 5.0,
      studentCount: 100,
      progressPercent: 0,
      thumbnailBg: 'from-emerald-800 via-teal-900 to-slate-900',
      description: 'এডমিন প্যানেল থেকে যুক্তকৃত কোর্স বিবরণ।',
      badgeType: 'exam',
      sheetsCount: 10,
      examsCount: 10,
      classesCount: 10,
      priceText: '৳৫০০',
      isEnrolled: false,
      isFreeCourse: false,
      isPlanLocked: true,
      isSheetsLocked: true,
      isExamsLocked: true,
      customPlans: [
        { id: 'p1', title: 'কোর্স প্ল্যান ও ওরিয়েন্টেশন', code: 'Plan- 01', sizeOrTime: '১ মেগাবাইট' }
      ],
      customSheets: [
        { id: 's1', title: 'লেকচার নোট ১.pdf', code: 'PDF Sheet 01', sizeOrTime: '১.৫ মেগাবাইট' }
      ],
      customExams: [
        { id: 'e1', title: 'মডেল টেস্ট ১', code: '৫০টি প্রশ্ন', sizeOrTime: '৩০ মিনিট' }
      ]
    };

    const updated = [newC, ...courses];
    setCourses(updated);
    saveCoursesToStorage(updated);
    setEditingCourse(newC);
    setSuccessMsg('নতুন কোর্স তৈরি করা হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই কোর্সটি মুছে ফেলতে চান?')) {
      const updated = courses.filter((c) => c.id !== id);
      setCourses(updated);
      saveCoursesToStorage(updated);
      if (editingCourse?.id === id) setEditingCourse(null);
    }
  };

  const handleResetCourses = () => {
    if (confirm('কোর্স ডাটা কি ডিফল্ট অবস্থায় নিয়ে যেতে চান?')) {
      setCourses(DEFAULT_COURSES);
      saveCoursesToStorage(DEFAULT_COURSES);
      setEditingCourse(null);
      setSuccessMsg('কোর্স ডাটা রিসেট সম্পন্ন হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 2500);
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !opt0.trim() || !opt1.trim() || !opt2.trim() || !opt3.trim()) {
      alert('অনুগ্রহ করে প্রশ্ন এবং ৪টি অপশন পূরণ করুন।');
      return;
    }

    const newQ: MCQQuestion = {
      id: `admin_q_${Date.now()}`,
      question: questionText.trim(),
      questionArabic: questionArabic.trim() || undefined,
      options: [opt0.trim(), opt1.trim(), opt2.trim(), opt3.trim()],
      correctAnswer: correctAnswerIndex,
      explanation: manualExplanation.trim(),
      subject,
      cadre: ['assistant_teacher_arabic', 'lecturer_arabic'],
      difficulty,
      yearTag: yearTag.trim() || 'তামরীন ব্যাংক ২০২৬',
    };

    const updated = [newQ, ...allQuestions];
    saveToStorage(updated);
    if (onAddQuestion) onAddQuestion(newQ);

    // Reset Form
    setQuestionText('');
    setQuestionArabic('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setCorrectAnswerIndex(0);
    setManualExplanation('');
    setSuccessMsg('প্রশ্ন ও ব্যাখ্যা সফলভাবে এডমিন প্যানেলে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleGenerateAiExplanation = async () => {
    if (!questionText.trim()) {
      alert('AI ব্যাখ্যা তৈরি করার জন্য প্রথমে প্রশ্ন লিখুন।');
      return;
    }
    setAiGenerating(true);
    try {
      const optionsList = [opt0, opt1, opt2, opt3].filter((o) => o.trim());
      const res = await fetch('/api/ustad-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain_mcq',
          questionData: {
            question: questionText,
            options: optionsList.length === 4 ? optionsList : ['অপশন ১', 'অপশন ২', 'অপশন ৩', 'অপশন ৪'],
            correctAnswer: correctAnswerIndex,
            subject,
          },
        }),
      });
      const data = await res.json();
      if (data.text) {
        setManualExplanation(data.text);
      }
    } catch (err) {
      console.error(err);
      alert('উস্তাদ এআই সংযোগ ব্যর্থ হয়েছে।');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleUpdateSave = () => {
    if (!editingQ) return;
    const updated = allQuestions.map((q) => (q.id === editingQ.id ? editingQ : q));
    saveToStorage(updated);
    if (onUpdateQuestion) onUpdateQuestion(editingQ);
    setEditingQ(null);
    setSuccessMsg('প্রশ্ন সফলভাবে আপডেট করা হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?')) {
      const updated = allQuestions.filter((q) => q.id !== id);
      saveToStorage(updated);
      if (onDeleteQuestion) onDeleteQuestion(id);
    }
  };

  const filteredQuestions = allQuestions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (q.explanation && q.explanation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = subjectFilter === 'all' || q.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Admin Panel Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-emerald-700/50">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                Admin Panel (এডমিন প্যানেল)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              প্রশ্ন ও ম্যানুয়াল ব্যাখ্যা ব্যবস্থাপনা
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium">
              পরীক্ষার জন্য প্রশ্ন এবং নির্ভুল ব্যাখ্যা সংযোজন ও পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center space-x-1.5 ${
                activeTab === 'courses'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>কোর্স ও লকিং প্যানেল ({courses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all ${
                activeTab === 'add'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              + প্রশ্ন যোগ
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all ${
                activeTab === 'manage'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              প্রশ্ন তালিকা ({allQuestions.length})
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold text-sm flex items-center space-x-2 shadow-sm animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 0: COURSE & LOCKS MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>কোর্স, লকিং ও পেমেন্ট কন্ট্রোল প্যানেল</span>
              </h2>
              <p className="text-xs text-slate-500">
                এখানে পরিবর্তনকৃত তথ্যাবলী ও লক/আনলক সেটিংস সরাসরি শিক্ষার্থী অ্যাপে প্রদর্শিত হবে।
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetCourses}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-extrabold text-xs flex items-center space-x-1"
                title="ডিফল্ট কোর্সে ফিরে যান"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">রিসেট</span>
              </button>
              <button
                onClick={handleAddNewCourse}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ নতুন কোর্স যুক্ত করুন</span>
              </button>
            </div>
          </div>

          {/* Courses List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        course.isFreeCourse || course.priceText === 'ফ্রি'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {course.isFreeCourse || course.priceText === 'ফ্রি' ? 'ফ্রি কোর্স' : `পেইড (${course.priceText})`}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {course.badgeType === 'exam' ? 'এক্সাম ব্যাচ' : course.badgeType === 'recorded' ? 'রেকর্ডেড' : 'লাইভ'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ইনস্ট্রাক্টর: <span className="font-bold text-slate-700 dark:text-slate-300">{course.instructor}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>এডিট</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Counts & Status Summary */}
                <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">শিক্ষার্থী</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">{course.studentCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">ক্লাস</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">{course.classesCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">শিট</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">{course.sheetsCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">পরীক্ষা</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">{course.examsCount || 0}</span>
                  </div>
                </div>

                {/* Lock Status Bar */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                    বাটন ও কনটেন্ট লক অবস্থা (Locks Control)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`p-2 rounded-xl border flex items-center space-x-1.5 text-[11px] font-bold ${
                      course.isPlanLocked ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-300' : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-300'
                    }`}>
                      {course.isPlanLocked ? <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      <span className="truncate">প্ল্যান: {course.isPlanLocked ? 'লকড' : 'ওপেন'}</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center space-x-1.5 text-[11px] font-bold ${
                      course.isSheetsLocked ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-300' : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-300'
                    }`}>
                      {course.isSheetsLocked ? <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      <span className="truncate">শিট: {course.isSheetsLocked ? 'লকড' : 'ওপেন'}</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center space-x-1.5 text-[11px] font-bold ${
                      course.isExamsLocked ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-300' : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-300'
                    }`}>
                      {course.isExamsLocked ? <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      <span className="truncate">পরীক্ষা: {course.isExamsLocked ? 'লকড' : 'ওপেন'}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT COURSE FULL MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                  এডমিন কোর্স এডিটর
                </span>
                <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                  {editingCourse.title} সম্পাদনা
                </h3>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-extrabold"
              >
                বন্ধ করুন
              </button>
            </div>

            {/* Form Sections */}
            <div className="space-y-4">
              
              {/* 1. Basic Information */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  ১. মৌলিক তথ্য ও কোর্স ফি
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      কোর্সের নাম (Title)
                    </label>
                    <input
                      type="text"
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ইনস্ট্রাক্টর নাম
                    </label>
                    <input
                      type="text"
                      value={editingCourse.instructor}
                      onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      মূল্য টেক্সট (Price Text e.g. ৳৪৫০ / ফ্রি)
                    </label>
                    <input
                      type="text"
                      value={editingCourse.priceText || '৳৪৫০'}
                      onChange={(e) => setEditingCourse({ ...editingCourse, priceText: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ব্যাচ টাইপ (Badge Type)
                    </label>
                    <select
                      value={editingCourse.badgeType || 'exam'}
                      onChange={(e) => setEditingCourse({ ...editingCourse, badgeType: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-extrabold"
                    >
                      <option value="exam">Exam Batch (এক্সাম ব্যাচ)</option>
                      <option value="recorded">Recorded Batch (রেকর্ডেড)</option>
                      <option value="live">Live Batch (লাইভ)</option>
                      <option value="free">Free Batch (ফ্রি ব্যাচ)</option>
                    </select>
                  </div>
                </div>

                {/* Free vs Paid Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      কোর্স টাইপ: {editingCourse.isFreeCourse || editingCourse.priceText === 'ফ্রি' ? 'সম্পূর্ণ ফ্রি কোর্স' : 'পেইড কোর্স'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !editingCourse.isFreeCourse;
                      setEditingCourse({
                        ...editingCourse,
                        isFreeCourse: nextState,
                        priceText: nextState ? 'ফ্রি' : (editingCourse.priceText === 'ফ্রি' ? '৳৪৫০' : editingCourse.priceText)
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                      editingCourse.isFreeCourse || editingCourse.priceText === 'ফ্রি'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {editingCourse.isFreeCourse || editingCourse.priceText === 'ফ্রি' ? 'ফ্রি থেকে পেইড করুন' : 'পেইড থেকে ফ্রি করুন'}
                  </button>
                </div>
              </div>

              {/* 2. Lock & Permission Controls */}
              <div className="space-y-3 bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-800/60">
                <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>২. বাটন ও কনটেন্ট লক/আনলক নিয়ন্ত্রণ (Access Locks)</span>
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  এখানে কোন বাটন 'লক করা' থাকবে আর কোনটি 'সবার জন্য উন্মুক্ত' থাকবে তা নির্ধারণ করুন:
                </p>

                <div className="space-y-2">
                  {/* Plan Lock */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
                        কোর্স সম্পর্কে বিস্তারিত বাটন (Details)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {editingCourse.isPlanLocked ? 'শুধুমাত্র এনরোলড ইউজার দেখতে পারবে (লকড)' : 'সকল ইউজার দেখতে পারবে (উন্মুক্ত)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingCourse({ ...editingCourse, isPlanLocked: !editingCourse.isPlanLocked })}
                      className={`px-3 py-1 rounded-xl text-xs font-black flex items-center space-x-1 ${
                        editingCourse.isPlanLocked ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {editingCourse.isPlanLocked ? <Lock className="w-3 h-3 text-amber-700" /> : <Unlock className="w-3 h-3 text-emerald-700" />}
                      <span>{editingCourse.isPlanLocked ? 'লকড' : 'আনলকড'}</span>
                    </button>
                  </div>

                  {/* Routine Lock */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
                        রুটিন বাটন (Routine)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {editingCourse.isRoutineLocked ? 'শুধুমাত্র এনরোলড ইউজার দেখতে পারবে (লকড)' : 'সকল ইউজার দেখতে পারবে (উন্মুক্ত)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingCourse({ ...editingCourse, isRoutineLocked: !editingCourse.isRoutineLocked })}
                      className={`px-3 py-1 rounded-xl text-xs font-black flex items-center space-x-1 ${
                        editingCourse.isRoutineLocked ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {editingCourse.isRoutineLocked ? <Lock className="w-3 h-3 text-amber-700" /> : <Unlock className="w-3 h-3 text-emerald-700" />}
                      <span>{editingCourse.isRoutineLocked ? 'লকড' : 'আনলকড'}</span>
                    </button>
                  </div>

                  {/* Syllabus Lock */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
                        সিলেবাস বাটন (Syllabus)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {editingCourse.isSyllabusLocked ? 'শুধুমাত্র এনরোলড ইউজার দেখতে পারবে (লকড)' : 'সকল ইউজার দেখতে পারবে (উন্মুক্ত)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingCourse({ ...editingCourse, isSyllabusLocked: !editingCourse.isSyllabusLocked })}
                      className={`px-3 py-1 rounded-xl text-xs font-black flex items-center space-x-1 ${
                        editingCourse.isSyllabusLocked ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {editingCourse.isSyllabusLocked ? <Lock className="w-3 h-3 text-amber-700" /> : <Unlock className="w-3 h-3 text-emerald-700" />}
                      <span>{editingCourse.isSyllabusLocked ? 'লকড' : 'আনলকড'}</span>
                    </button>
                  </div>

                  {/* Sheets Lock */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
                        PDF লেকচার শিট বাটন
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {editingCourse.isSheetsLocked ? 'শুধুমাত্র এনরোলড ইউজার ডাউনলোড পারবে (লকড)' : 'সকল ইউজার ফ্রি ডাউনলোড পারবে (উন্মুক্ত)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingCourse({ ...editingCourse, isSheetsLocked: !editingCourse.isSheetsLocked })}
                      className={`px-3 py-1 rounded-xl text-xs font-black flex items-center space-x-1 ${
                        editingCourse.isSheetsLocked ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {editingCourse.isSheetsLocked ? <Lock className="w-3 h-3 text-amber-700" /> : <Unlock className="w-3 h-3 text-emerald-700" />}
                      <span>{editingCourse.isSheetsLocked ? 'লকড' : 'আনলকড'}</span>
                    </button>
                  </div>

                  {/* Exams Lock */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
                        পরীক্ষা / মডেল টেস্ট বাটন
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {editingCourse.isExamsLocked ? 'শুধুমাত্র এনরোলড ইউজার পরীক্ষা দিতে পারবে (লকড)' : 'সকল ইউজার ফ্রি পরীক্ষা দিতে পারবে (উন্মুক্ত)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingCourse({ ...editingCourse, isExamsLocked: !editingCourse.isExamsLocked })}
                      className={`px-3 py-1 rounded-xl text-xs font-black flex items-center space-x-1 ${
                        editingCourse.isExamsLocked ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {editingCourse.isExamsLocked ? <Lock className="w-3 h-3 text-amber-700" /> : <Unlock className="w-3 h-3 text-emerald-700" />}
                      <span>{editingCourse.isExamsLocked ? 'লকড' : 'আনলকড'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Counts Customization */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  ৩. শিক্ষার্থী ও শিট/পরীক্ষা সংখ্যা
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      মোট শিক্ষার্থী
                    </label>
                    <input
                      type="number"
                      value={editingCourse.studentCount}
                      onChange={(e) => setEditingCourse({ ...editingCourse, studentCount: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      ভিডিও/ক্লাস সংখ্যা
                    </label>
                    <input
                      type="number"
                      value={editingCourse.classesCount || 0}
                      onChange={(e) => setEditingCourse({ ...editingCourse, classesCount: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      মোট শিট সংখ্যা
                    </label>
                    <input
                      type="number"
                      value={editingCourse.sheetsCount || 0}
                      onChange={(e) => setEditingCourse({ ...editingCourse, sheetsCount: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      মোট পরীক্ষা সংখ্যা
                    </label>
                    <input
                      type="number"
                      value={editingCourse.examsCount || 0}
                      onChange={(e) => setEditingCourse({ ...editingCourse, examsCount: Number(e.target.value) })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Add Custom Plan / Sheet / Exam Items */}
              <div className="space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60">
                <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>৪. নির্দিষ্ট শিট বা পরীক্ষা যোগ করুন (Custom Item Add)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="plan">কোর্স সম্পর্কে বিস্তারিত (Details)</option>
                    <option value="routine">রুটিন (Routine)</option>
                    <option value="syllabus">সিলেবাস (Syllabus)</option>
                    <option value="sheet">PDF শিট (Sheet)</option>
                    <option value="exam">পরীক্ষা (Exam)</option>
                  </select>

                  <input
                    type="text"
                    placeholder="আইটেম শিরোনাম (Title)"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!newItemTitle.trim()) return;
                      const newItem: CourseContentItem = {
                        id: `item_${Date.now()}`,
                        title: newItemTitle.trim(),
                        code: newItemType === 'sheet' ? 'PDF Sheet' : newItemType === 'exam' ? 'Exam' : newItemType === 'routine' ? 'Routine' : newItemType === 'syllabus' ? 'Syllabus' : 'Plan',
                        sizeOrTime: 'এডমিন আইটেম',
                      };

                      if (newItemType === 'plan') {
                        const updatedPlans = [...(editingCourse.customPlans || []), newItem];
                        setEditingCourse({ ...editingCourse, customPlans: updatedPlans });
                      } else if (newItemType === 'routine') {
                        const updatedRoutines = [...(editingCourse.customRoutines || []), newItem];
                        setEditingCourse({ ...editingCourse, customRoutines: updatedRoutines });
                      } else if (newItemType === 'syllabus') {
                        const updatedSyllabuses = [...(editingCourse.customSyllabuses || []), newItem];
                        setEditingCourse({ ...editingCourse, customSyllabuses: updatedSyllabuses });
                      } else if (newItemType === 'sheet') {
                        const updatedSheets = [...(editingCourse.customSheets || []), newItem];
                        setEditingCourse({ ...editingCourse, customSheets: updatedSheets, sheetsCount: (editingCourse.sheetsCount || 0) + 1 });
                      } else {
                        const updatedExams = [...(editingCourse.customExams || []), newItem];
                        setEditingCourse({ ...editingCourse, customExams: updatedExams, examsCount: (editingCourse.examsCount || 0) + 1 });
                      }

                      setNewItemTitle('');
                    }}
                    className="py-2 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xs"
                  >
                    + আইটেম যোগ করুন
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleSaveCourse(editingCourse)}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>পরিবর্তন সেভ করুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 1: ADD NEW QUESTION & MANUAL EXPLANATION */}
      {activeTab === 'add' && (
        <form onSubmit={handleCreateQuestion} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>নতুন প্রশ্ন ও ম্যানুয়াল ব্যাখ্যা যোগ করুন</span>
            </h2>
            <span className="text-xs text-slate-500 font-bold">এডমিন এন্ট্রি</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                বিষয় নির্বাচন (Subject) *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="quran_hadith">আল-কুরআন ও আল-হাদিস</option>
                <option value="fiqh_usul">ফিকহ ও উসূলে ফিকহ</option>
                <option value="arabic_grammar">আরবি ভাষা ও ব্যাকরণ (নাহু, সরফ)</option>
                <option value="islamic_history">ইসলামী ইতিহাস ও সংস্কৃতি</option>
                <option value="bangla">বাংলা সাহিত্য ও ব্যাকরণ</option>
                <option value="english">English Language</option>
                <option value="mathematics">সাধারণ গণিত</option>
                <option value="general_knowledge">সাধারণ জ্ঞান</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                পরীক্ষার বছর / ট্যাগ (Tag)
              </label>
              <input
                type="text"
                value={yearTag}
                onChange={(e) => setYearTag(e.target.value)}
                placeholder="যেমন: বিষয়ভিত্তিক মডেল টেস্ট ২০২৬"
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Question text inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                প্রশ্ন (বাংলায়) *
              </label>
              <textarea
                required
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="যেমন: আরবি বর্ণমালার প্রথম বর্ণ কোনটি?"
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                আরবি প্রশ্ন (ঐচ্ছিক - Arabic Version)
              </label>
              <input
                type="text"
                value={questionArabic}
                onChange={(e) => setQuestionArabic(e.target.value)}
                placeholder="যেমন: ما هو الحرف الأول من الحروف الأبجدية؟"
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-arabic font-bold text-slate-900 dark:text-slate-100 text-right"
              />
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
              অপশনসমূহ (৪টি বিকল্প ও সঠিক উত্তর নির্বাচন করুন) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'ক. অপশন ১', val: opt0, setVal: setOpt0, idx: 0 },
                { label: 'খ. অপশন ২', val: opt1, setVal: setOpt1, idx: 1 },
                { label: 'গ. অপশন ৩', val: opt2, setVal: setOpt2, idx: 2 },
                { label: 'ঘ. অপশন ৪', val: opt3, setVal: setOpt3, idx: 3 },
              ].map((opt) => (
                <div key={opt.idx} className={`p-3 rounded-2xl border flex items-center space-x-2 ${
                  correctAnswerIndex === opt.idx 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/40' 
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={correctAnswerIndex === opt.idx}
                    onChange={() => setCorrectAnswerIndex(opt.idx)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    value={opt.val}
                    onChange={(e) => opt.setVal(e.target.value)}
                    placeholder={opt.label}
                    className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                  {correctAnswerIndex === opt.idx && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-600 text-white">
                      সঠিক
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MANUAL EXPLANATION TEXTAREA */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>ম্যানুয়াল বিস্তারিত ব্যাখ্যা (Manual Explanation)</span>
              </label>

              <button
                type="button"
                onClick={handleGenerateAiExplanation}
                disabled={aiGenerating}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-xs flex items-center space-x-1 border border-amber-400/40 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>{aiGenerating ? 'উস্তাদ এআই লিখছে...' : 'উস্তাদ এআই অটো-জেনারেট'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={manualExplanation}
              onChange={(e) => setManualExplanation(e.target.value)}
              placeholder="এই প্রশ্নের ম্যানুয়াল বিস্তারিত উত্তর ব্যাখ্যা এখানে লিখুন... (পরীক্ষার পর শিক্ষার্থীরা এই ব্যাখ্যাটি দেখতে পাবে)"
              className="w-full p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-800/60 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              💡 টিপস: আপনি ম্যানুয়ালি ব্যাখ্যা লিখতে পারেন অথবা উস্তাদ এআই দিয়ে অটো-জেনারেট করে পরবর্তীতে সংশোধন করতে পারেন।
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>প্রশ্ন ও ম্যানুয়াল ব্যাখ্যা সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {/* TAB 2: MANAGE & EDIT QUESTION BANK */}
      {activeTab === 'manage' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="প্রশ্ন বা ব্যাখ্যা খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full sm:w-auto p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border-none"
              >
                <option value="all">সকল বিষয় ({allQuestions.length})</option>
                <option value="quran_hadith">আল-কুরআন ও হাদিস</option>
                <option value="fiqh_usul">ফিকহ ও উসূলে ফিকহ</option>
                <option value="arabic_grammar">আরবি ভাষা ও ব্যাকরণ</option>
                <option value="islamic_history">ইসলামী ইতিহাস</option>
                <option value="bangla">বাংলা</option>
                <option value="english">English</option>
                <option value="mathematics">গণিত</option>
                <option value="general_knowledge">সাধারণ জ্ঞান</option>
              </select>
            </div>
          </div>

          {/* List of Questions */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold text-xs">
                কোনো প্রশ্ন পাওয়া যায়নি।
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const hasExplanation = Boolean(q.explanation && q.explanation.trim().length > 0);

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3 hover:border-emerald-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-500">#{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {q.subject}
                          </span>
                          {hasExplanation ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-400 text-slate-950 flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-slate-950" />
                              <span>ম্যানুয়াল ব্যাখ্যা সংরক্ষিত</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              ব্যাখ্যা অনুপস্থিত (উস্তাদ এআই রেডি)
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {q.question}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => setEditingQ(q)}
                          className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition-all"
                          title="সম্পাদনা করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 hover:bg-rose-600 hover:text-white transition-all"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Options Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border ${
                            q.correctAnswer === oIdx
                              ? 'bg-emerald-100/80 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold border-emerald-400'
                              : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700'
                          }`}
                        >
                          <span className="text-[10px] opacity-60 block">অপশন {oIdx + 1}</span>
                          <span className="truncate block">{opt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Explanation snippet if present */}
                    {hasExplanation && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                        <span className="font-black text-amber-800 dark:text-amber-300 text-[10px] uppercase block">
                          ম্যানুয়াল ব্যাখ্যা:
                        </span>
                        <p className="line-clamp-2">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingQ && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <span>প্রশ্ন ও ম্যানুয়াল ব্যাখ্যা সম্পাদনা করুন</span>
              </h3>
              <button
                onClick={() => setEditingQ(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                বন্ধ করুন
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">প্রশ্ন (বাংলা)</label>
                <input
                  type="text"
                  value={editingQ.question}
                  onChange={(e) => setEditingQ({ ...editingQ, question: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ম্যানুয়াল বিস্তারিত ব্যাখ্যা</label>
                <textarea
                  rows={4}
                  value={editingQ.explanation || ''}
                  onChange={(e) => setEditingQ({ ...editingQ, explanation: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setEditingQ(null)}
                className="py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                onClick={handleUpdateSave}
                className="py-3 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
