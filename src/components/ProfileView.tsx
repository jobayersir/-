import React, { useState, useRef } from 'react';
import { UserProfileData, NavTab, PostCadre } from '../types';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  GraduationCap, 
  Target, 
  Calendar, 
  Crown, 
  Camera, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  Award, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfileData;
  onTabChange: (tab: NavTab) => void;
  onUpdateProfile?: (updatedProfile: UserProfileData) => void;
}

const CADRE_OPTIONS: { id: PostCadre; label: string }[] = [
  { id: 'assistant_teacher_arabic', label: 'সহকারী শিক্ষক (আরবি)' },
  { id: 'lecturer_arabic', label: 'প্রভাষক (আরবি / হাদিস / ফিকহ)' },
  { id: 'assistant_maulvi', label: 'সহকারী মৌলভী' },
  { id: 'ebtedayee_head', label: 'ইবতেদায়ী প্রধান / শিক্ষক' },
  { id: 'lecturer_islamic_history', label: 'প্রভাষক (ইসলামী ইতিহাস)' },
  { id: 'general_subject', label: 'সাধারণ বিষয় (বাংলা, ইংরেজি, গণিত)' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onTabChange, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable Form State
  const [formData, setFormData] = useState<UserProfileData>({ ...user });

  const handleStartEdit = () => {
    setFormData({ ...user });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Image upload via File Reader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, avatarUrl: '' }));
  };

  const currentCadreLabel = CADRE_OPTIONS.find(c => c.id === user.cadre)?.label || 'সহকারী শিক্ষক (আরবি)';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-emerald-400/40 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="font-bold text-xs sm:text-sm">
            প্রোফাইল তথ্য ও ছবি সফলভাবে পরিবর্তন করা হয়েছে!
          </span>
        </div>
      )}

      {/* Top Banner & Main Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden relative">
        {/* Cover Background */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)]" />
          <div className="absolute bottom-3 right-4 flex items-center space-x-2 text-[11px] text-emerald-300 font-bold bg-slate-950/40 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>তামরীন প্রিমিয়াম মেম্বার</span>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            {/* Avatar Container */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-1 shadow-xl ring-4 ring-white dark:ring-slate-900">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center font-black text-3xl sm:text-4xl text-emerald-300 overflow-hidden relative">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
              </div>

              {/* Edit Photo Trigger Button */}
              <button
                onClick={handleStartEdit}
                className="absolute bottom-1 right-1 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg border-2 border-white dark:border-slate-900 transition-transform active:scale-95"
                title="ছবি পরিবর্তন করুন"
                aria-label="Change photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Name & Basic Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {user.name}
                </h1>
                {user.isPremium && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase shadow-xs">
                    <Crown className="w-3 h-3 stroke-[2.5]" />
                    <span>ভিআইপি</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user.email} {user.phone && `• ${user.phone}`}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <GraduationCap className="w-3.5 h-3.5 mr-1" />
                  {currentCadreLabel}
                </span>
                {user.location && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    {user.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleStartEdit}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 border border-emerald-500/30 active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>তথ্য ও ছবি সম্পাদন করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] sm:text-xs text-slate-400 font-semibold block">উত্তরকৃত প্রশ্ন</span>
          <div className="flex items-center justify-between">
            <span className="font-black text-lg sm:text-xl text-slate-800 dark:text-slate-100">
              {user.totalSolvedQuestions.toLocaleString('bn-BD')}টি
            </span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] sm:text-xs text-slate-400 font-semibold block">এক্যুরেসি রেট</span>
          <div className="flex items-center justify-between">
            <span className="font-black text-lg sm:text-xl text-emerald-600 dark:text-emerald-400">
              {user.accuracyRate}%
            </span>
            <Sparkles className="w-5 h-5 text-teal-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] sm:text-xs text-slate-400 font-semibold block">চলতি স্ট্রিক</span>
          <div className="flex items-center justify-between">
            <span className="font-black text-lg sm:text-xl text-amber-500">
              {user.streakDays} দিন
            </span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] sm:text-xs text-slate-400 font-semibold block">সদস্যতার বয়স</span>
          <div className="flex items-center justify-between">
            <span className="font-black text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {user.joinedDate}
            </span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Personal Information Detail Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center">
            <User className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
            ব্যক্তিগত ও অ্যাকাডেমিক তথ্যাবলী
          </h2>
          <button
            onClick={handleStartEdit}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            এডিট করুন
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80 flex items-start space-x-3">
            <User className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">পূর্ণ নাম</span>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{user.name}</span>
            </div>
          </div>

          {/* Email Address */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80 flex items-start space-x-3">
            <Mail className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">ইমেইল ঠিকানা</span>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{user.email}</span>
            </div>
          </div>

          {/* Phone Number */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80 flex items-start space-x-3">
            <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">মোবাইল নম্বর</span>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {user.phone || 'যুক্ত করা হয়নি'}
              </span>
            </div>
          </div>

          {/* Institution / Madrasa */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80 flex items-start space-x-3">
            <Building2 className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">মাদ্রাসা / প্রতিষ্ঠান</span>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {user.institution || 'গফরগাঁও ইসলামিয়া কামিল মাদ্রাসা'}
              </span>
            </div>
          </div>

          {/* District / Location */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80 flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">জেলা / ঠিকানা</span>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {user.location || 'ময়মনসিংহ'}
              </span>
            </div>
          </div>

          {/* Post Cadre */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80 flex items-start space-x-3">
            <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">লক্ষ্যযুক্ত পদবি / ক্যাডার</span>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{currentCadreLabel}</span>
            </div>
          </div>

          {/* Target Exam / Year */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/80 flex items-start space-x-3 md:col-span-2">
            <Target className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">লক্ষ্য পরীক্ষা</span>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {user.targetYear || '১৮তম এনটিআরসিএ (মাদ্রাসা শিক্ষক নিবন্ধন ২০২৬)'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>পারফরম্যান্স ড্যাশবোর্ড দেখুন</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100">
                  ব্যক্তিগত তথ্য ও ছবি সম্পাদনা
                </h3>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Profile Photo Upload / Change Section */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-4">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  প্রোফাইল ছবি (Profile Picture)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Photo Preview */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-1 shadow-md">
                      <div className="w-full h-full rounded-[12px] bg-slate-950 flex items-center justify-center font-bold text-2xl text-emerald-300 overflow-hidden">
                        {formData.avatarUrl ? (
                          <img src={formData.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span>{formData.name.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ছবি আপলোড করুন</span>
                      </button>

                      {formData.avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ছবি মুছুন</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      JPG, PNG বা WEBP ফাইল সিলেক্ট করুন (সর্বোচ্চ ৫ মেগাবাইট)
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information Form Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  ব্যক্তিগত বিবরণী
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      পূর্ণ নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="আপনার নাম লিখুন"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="আপনার ইমেইল লিখুন"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="যেমন: 01700-000000"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Institution Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      মাদ্রাসা / প্রতিষ্ঠান
                    </label>
                    <input
                      type="text"
                      value={formData.institution || ''}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="আপনার মাদ্রাসার নাম লিখুন"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* District Location Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      জেলা / ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="যেমন: ময়মনসিংহ"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Cadre Select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      প্রস্তুতি ক্যাডার / পদবি
                    </label>
                    <select
                      value={formData.cadre}
                      onChange={(e) => setFormData({ ...formData, cadre: e.target.value as PostCadre })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {CADRE_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Year / Exam Input */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      লক্ষ্য পরীক্ষা
                    </label>
                    <input
                      type="text"
                      value={formData.targetYear || ''}
                      onChange={(e) => setFormData({ ...formData, targetYear: e.target.value })}
                      placeholder="যেমন: ১৮তম মাদ্রাসা এনটিআরসিএ পরীক্ষা ২০২৬"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>পরিবর্তন সংরক্ষণ করুন</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
