import React, { useState } from 'react';
import { DEPLOYMENT_ROADMAP, SUPABASE_SQL_SCRIPT } from '../data/supabaseSetup';
import { Rocket, Copy, Check, Database, Github, Globe, Smartphone, CheckCircle, Terminal, HelpCircle } from 'lucide-react';

export const DeploymentGuideView: React.FC = () => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
          <Rocket className="w-3.5 h-3.5 text-amber-400" />
          <span>ডিপ্লয়মেন্ট ও আর্কিটেকচার গাইড (GitHub • Supabase • Vercel • .com)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          অ্যাপটি যেভাবে ডাউনলোড, হোস্ট এবং .com ডোমেইনে চালনা করবেন
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          আপনার পছন্দমতো সুপাবেস (Supabase) ডাটাবেইজ, গিটহাব (GitHub) ভার্সন কন্ট্রোল, ভার্সেল (Vercel) ফ্রি হোস্টিং এবং কাস্টম .কম ডোমেইন কানেক্ট করার ধাপে ধাপে পূর্ণাঙ্গ গাইডলাইন নিচে দেওয়া হলো।
        </p>
      </div>

      {/* Supabase SQL Code Box (1-Click Copy) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
              <Database className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
              সুপাবেস ডাটাবেইজ স্কিমা (Supabase SQL Script)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Supabase এর SQL Editor এ পেস্ট করে চালান। ইউজার, পরীক্ষা ও বুকমার্ক টেবিল স্বয়ংক্রিয় তৈরি হবে।
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
          >
            {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'কপি সম্পন্ন হয়েছে!' : 'SQL কোড কপি করুন'}</span>
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-2xl overflow-x-auto max-h-60 border border-slate-800">
          <pre>{SUPABASE_SQL_SCRIPT}</pre>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <Terminal className="w-5 h-5 mr-2 text-teal-600" />
          ধাপে ধাপে ডিপ্লয়মেন্ট রোডম্যাপ
        </h3>

        <div className="space-y-6">
          {DEPLOYMENT_ROADMAP.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4 hover:border-emerald-500/80 transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-base shrink-0 shadow-md">
                  {step.stepNumber}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    {step.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-14">
                {step.description}
              </p>

              {/* Actions & Commands List */}
              <div className="pl-14 space-y-2">
                {step.commandsOrActions.map((cmd, idx) => {
                  const isCode = cmd.startsWith('git') || cmd.startsWith('npx') || cmd.startsWith('GEMINI');
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      {isCode ? (
                        <div className="flex-1 bg-slate-900 text-emerald-300 font-mono p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                          <span>{cmd}</span>
                          <button
                            onClick={() => handleCopyCommand(cmd)}
                            className="text-slate-400 hover:text-white ml-2"
                            title="কমান্ড কপি করুন"
                          >
                            {copiedCmd === cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{cmd}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pl-14 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center">
                <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600 shrink-0" />
                <span>পরামর্শ: {step.tips}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
