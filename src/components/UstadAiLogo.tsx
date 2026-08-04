import React from 'react';

interface UstadAiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const UstadAiLogo: React.FC<UstadAiLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Visual Glowing Badge with Islamic AI Emblem */}
      <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
        {/* Outer Radiant Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-emerald-500 to-teal-400 rounded-2xl blur-xs opacity-75 animate-pulse" />

        {/* 8-Pointed Star (Rub el Hizb) / Islamic Tech Emblem SVG */}
        <svg
          viewBox="0 0 100 100"
          className="relative z-10 w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ustadBg" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="50%" stopColor="#022c22" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            <linearGradient id="emeraldSpark" x1="0" y1="0" x2="100" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Container */}
          <rect width="100" height="100" rx="28" fill="url(#ustadBg)" />
          <rect width="96" height="96" x="2" y="2" rx="26" stroke="url(#goldGradient)" strokeWidth="2.5" opacity="0.8" />

          {/* Islamic Geometric 8-Pointed Star Overlay */}
          <path
            d="M50 12 L61 25 L78 25 L78 42 L91 50 L78 58 L78 75 L61 75 L50 88 L39 75 L22 75 L22 58 L9 50 L22 42 L22 25 L39 25 Z"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.35"
            fill="none"
          />

          {/* Open Mushaf / Book of Wisdom */}
          <path
            d="M50 68 C35 58 20 62 14 68 V45 C20 39 35 36 50 48 Z"
            fill="#047857"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          <path
            d="M50 68 C65 58 80 62 86 68 V45 C80 39 65 36 50 48 Z"
            fill="#065f46"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />

          {/* Book Inner Illuminated Pages */}
          <path d="M50 62 C37 53 23 56 17 62 V47 C23 41 37 38 50 48 Z" fill="#fef08a" opacity="0.9" />
          <path d="M50 62 C63 53 77 56 83 62 V47 C77 41 63 38 50 48 Z" fill="#fef08a" opacity="0.9" />

          {/* AI Neural Spark / Crescent Crown */}
          <path
            d="M50 20 C42 20 36 25 36 32 C36 39 42 44 50 44 C46 41 43 37 43 32 C43 27 46 23 50 20 Z"
            fill="url(#goldGradient)"
          />

          {/* AI Tech Sparkle Nodes */}
          <circle cx="50" cy="28" r="3" fill="#ffffff" />
          <circle cx="62" cy="22" r="2.5" fill="url(#emeraldSpark)" />
          <circle cx="38" cy="22" r="2" fill="url(#emeraldSpark)" />

          <path d="M62 22 L50 28 L38 22" stroke="url(#emeraldSpark)" strokeWidth="1" strokeDasharray="2 2" />
        </svg>

        {/* Small AI Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-slate-900"></span>
        </span>
      </div>

      {/* Optional Typography Text */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              উস্তাদ এআই
            </span>
            <span className="px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[10px] font-black border border-amber-400/30">
              PRO 3.6
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">
            NTRCA মাদ্রাসা এআই টিউটর
          </span>
        </div>
      )}
    </div>
  );
};
