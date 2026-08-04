export const SUPABASE_SQL_SCRIPT = `-- ==========================================
-- MADRASA NTRCA PREP APP - SUPABASE SQL SCHEMA
-- ==========================================

-- 1. Create Users Profile table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  target_cadre TEXT DEFAULT 'assistant_teacher_arabic',
  target_exam_year TEXT DEFAULT '18th NTRCA',
  arabic_font_preference TEXT DEFAULT 'Amiri',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create User Exam Results / Mock Test Logs table
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cadre TEXT NOT NULL,
  subject_filter TEXT DEFAULT 'all',
  score NUMERIC(5,2) NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  wrong_answers INT NOT NULL,
  skipped INT NOT NULL,
  time_taken_seconds INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT CHECK (item_type IN ('mcq', 'cq', 'term')),
  target_id TEXT NOT NULL,
  user_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Personal Notes table
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  subject_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own test results" ON public.test_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert test results" ON public.test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage bookmarks" ON public.bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage notes" ON public.user_notes
  FOR ALL USING (auth.uid() = user_id);
`;

export interface DeploymentStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  commandsOrActions: string[];
  tips: string;
}

export const DEPLOYMENT_ROADMAP: DeploymentStep[] = [
  {
    stepNumber: 1,
    title: '১. গিটহাব রির্পোজিটরিতে কোড আপলোড (GitHub Setup)',
    subtitle: 'AI Studio থেকে কোড ডাউনলোড ও গিটহাবে পুশ',
    description: 'অ্যাপটি সম্পূর্ণ রেডি হওয়ার পর গিটহাবে আপনার নিজের একাউন্টে ব্যাকআপ ও ডেভেলপমেন্ট ভার্সন রাখবেন।',
    commandsOrActions: [
      '১. AI Studio UI-এর উপর ডান কোনায় "Export / GitHub" বোতামে ক্লিক করে Zip ফাইল নামান অথবা সরাসরি গিটহাবে Export করুন।',
      '২. আপনার কম্পিউটারে গিট ব্যাশ/টার্মিনাল খুলে নতুন গিটহাব রেপো তৈরি করুন:',
      'git init',
      'git add .',
      'git commit -m "Initial Madrasa NTRCA App Commit"',
      'git branch -M main',
      'git remote add origin https://github.com/your-username/madrasa-ntrca-app.git',
      'git push -u origin main'
    ],
    tips: 'গিটহাবে কোড থাকলে খুব সহজেই পরবর্তীতে আপডেট করতে পারবেন এবং অ্যান্ড্রয়েড অ্যাপ তৈরিতে সুবিধা পাবেন।'
  },
  {
    stepNumber: 2,
    title: '২. সুপাবেস ডাটাবেইজ সেটআপ (Supabase Integration)',
    subtitle: 'ইউজার লগইন, স্কোর সেভ ও বুকমার্কের জন্য বিনামূল্যে Supabase',
    description: 'Supabase হলো একটি আধুনিক ওপেন সোর্স পোস্টগ্রেস ডাটাবেইজ যা ফ্রিতে ব্যবহার করা যায়।',
    commandsOrActions: [
      '১. https://supabase.com এ যান এবং সম্পূর্ণ বিনামূল্যে একটি অ্যাকাউন্ট খুলে New Project তৈরি করুন।',
      '২. প্রজেক্ট তৈরির পর বামপাশের "SQL Editor" এ ক্লিক করুন।',
      '৩. আমাদের অ্যাপের নিচের "Copy Supabase SQL Schema" বাটনে ক্লিক করে কোড কপি করুন।',
      '৪. Supabase এর SQL Editor এ পেস্ট করে "Run" বাটনে চাপ দিন। আপনার সব টেবিল এক ক্লিকে তৈরি হয়ে যাবে!',
      '৫. Project Settings > API এ গিয়ে URL এবং anon_key টি নোট করে রাখুন।'
    ],
    tips: 'সুপাবেসে Row Level Security (RLS) সক্রিয় থাকায় ব্যবহারকারীর ডাটা শতভাগ সুরক্ষিত থাকে।'
  },
  {
    stepNumber: 3,
    title: '৩. ভার্সেল এ ওয়েবসাইট ডিপ্লয়মেন্ট (Vercel Web Hosting)',
    subtitle: 'বিনামূল্যে লাইভ ওয়েব ভার্সন প্রকাশের ধাপ',
    description: 'Vercel থেকে বিশ্বমানের ফাস্ট স্পিডে আপনার ওয়েবসাইট ফ্রিতে হোস্ট করতে পারবেন।',
    commandsOrActions: [
      '১. https://vercel.com এ গিয়ে GitHub দিয়ে একাউন্ট খুলুন বা সাইন ইন করুন।',
      '২. "Add New..." > "Project" এ চাপ দিয়ে আপনার গিটহাবের madrasa-ntrca-app রেপোটি সিলেক্ট করুন।',
      '৩. Environment Variables সেকশনে নিচের কি-গুলো যোগ করুন:',
      'GEMINI_API_KEY = (আপনার Gemini API Key)',
      'VITE_SUPABASE_URL = (Supabase Project URL)',
      'VITE_SUPABASE_ANON_KEY = (Supabase Anon Key)',
      '৪. "Deploy" বাটনে চাপ দিন। ১ মিনিটের মধ্যে সাইট লাইভ হয়ে যাবে!'
    ],
    tips: 'Vercel স্বয়ংক্রিয়ভাবে ফ্রি SSL (HTTPS) সার্টিফিকেট প্রদান করবে।'
  },
  {
    stepNumber: 4,
    title: '৪. কাস্টম .com ডোমেইন যুক্ত করা (Custom Domain Setup)',
    subtitle: 'আপনার নিজস্ব ব্র্যান্ড নাম কানেক্ট করা',
    description: 'Namecheap, NameSilo বা অন্য কোনো প্রোভাইডার থেকে ডোমেইন কেনার পর ভার্সেলের সাথে যুক্ত করুন।',
    commandsOrActions: [
      '১. Vercel Dashboard > Your Project > Settings > Domains এ যান।',
      '২. আপনার কেনা ডোমেইন টাইপ করুন (যেমন: madrasanotes.com বা ntrcamadrasa.com)।',
      '৩. Vercel আপনাকে যে CNAME ও A Record দেবে (যেমন: 76.76.21.21), তা আপনার ডোমেইন প্রোভাইডারের DNS Management এ বসিয়ে দিন।',
      '৪. ৫-১০ মিনিটের মধ্যে আপনার কাস্টম .com ডোমেইনে ওয়েবসাইট চালু হয়ে যাবে।'
    ],
    tips: '.com ডোমেইনের জন্য Namecheap বা Cloudflare DNS ব্যবহার করলে স্পিড ও সিকিউরিটি ভালো পাওয়া যায়।'
  },
  {
    stepNumber: 5,
    title: '৫. মোবাইল অ্যাপ ভার্সন (Android PWA & APK)',
    subtitle: 'ওয়েবসাইটকে অ্যান্ডয়েড মোবাইল অ্যাপে রূপান্তর',
    description: 'আপনার এই অ্যাপটি PWA (Progressive Web App) হিসেবে তৈরি করা। শিক্ষার্থীরা সরাসরি হোমস্ক্রিনে ইন্সটল করতে পারবে।',
    commandsOrActions: [
      '১. PWA Mode: আপনার সাইট ব্রাউজারে খুললে মোবাইলে "Add to Home Screen" নোটিফিকেশন আসবে, ক্লিক করলেই অ্যাপের মতো কাজ করবে।',
      '২. APK File Build: Capacitor.js বা Bubblewrap (Web2APK) টুল ব্যবহার করে সরাসরি প্লে-স্টোর যোগ্য .apk ও .aab ফাইল বানাতে পারবেন:',
      'npx cap init "Madrasa Prep" "com.madrasa.prep"',
      'npx cap add android',
      'npx cap open android (Android Studio তে খুলে Build APK দিন)'
    ],
    tips: 'প্লে-স্টোরে পাবলিশ করার আগে PWA টেস্ট করে নিলে অ্যান্ড্রয়েড অ্যাপে কোনো সমস্যা থাকে না।'
  }
];
