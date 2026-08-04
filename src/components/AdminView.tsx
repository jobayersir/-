import React, { useState } from 'react';
import { MCQQuestion, SubjectCategory, PostCadre } from '../types';
import { QUESTION_BANK } from '../data/questionBank';
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
  Bot
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

  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
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
  const [yearTag, setYearTag] = useState('১৮তম নিবন্ধন ২০২৬');

  const saveToStorage = (updatedList: MCQQuestion[]) => {
    setAllQuestions(updatedList);
    localStorage.setItem('tamreen_admin_questions', JSON.stringify(updatedList));
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

          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
                activeTab === 'add'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              + নতুন প্রশ্ন ও ব্যাখ্যা
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
                activeTab === 'manage'
                  ? 'bg-emerald-600 text-white shadow-md'
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
                placeholder="যেমন: ১৮তম মাদ্রাসা নিবন্ধন ২০২৬"
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
