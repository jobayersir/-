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
      {/* Visual Badge in Single Unified Emerald Theme */}
      <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
        {/* Soft Outer Emerald Glow */}
        <div className="absolute inset-0 bg-emerald-600 rounded-2xl blur-xs opacity-50" />

        {/* 8-Pointed Star (Rub el Hizb) / Islamic Emblem SVG */}
        <svg
          viewBox="0 0 100 100"
          className="relative z-10 w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ustadSingleBg" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            <linearGradient id="emeraldStroke" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Container */}
          <rect width="100" height="100" rx="28" fill="url(#ustadSingleBg)" />
          <rect width="96" height="96" x="2" y="2" rx="26" stroke="url(#emeraldStroke)" strokeWidth="2.5" opacity="0.9" />

          {/* Islamic Geometric 8-Pointed Star Overlay */}
          <path
            d="M50 12 L61 25 L78 25 L78 42 L91 50 L78 58 L78 75 L61 75 L50 88 L39 75 L22 75 L22 58 L9 50 L22 42 L22 25 L39 25 Z"
            stroke="url(#emeraldStroke)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.4"
            fill="none"
          />

          {/* Open Mushaf / Book of Wisdom */}
          <path
            d="M50 68 C35 58 20 62 14 68 V45 C20 39 35 36 50 48 Z"
            fill="#065f46"
            stroke="#a7f3d0"
            strokeWidth="1.5"
          />
          <path
            d="M50 68 C65 58 80 62 86 68 V45 C80 39 65 36 50 48 Z"
            fill="#047857"
            stroke="#a7f3d0"
            strokeWidth="1.5"
          />

          {/* Book Inner Illuminated Pages */}
          <path d="M50 62 C37 53 23 56 17 62 V47 C23 41 37 38 50 48 Z" fill="#ecfdf5" opacity="0.95" />
          <path d="M50 62 C63 53 77 56 83 62 V47 C77 41 63 38 50 48 Z" fill="#ecfdf5" opacity="0.95" />

          {/* AI Sparkle / Crescent Crown */}
          <circle cx="50" cy="28" r="3.5" fill="#ffffff" />
          <circle cx="62" cy="22" r="2.5" fill="#a7f3d0" />
          <circle cx="38" cy="22" r="2.5" fill="#a7f3d0" />

          <path d="M62 22 L50 28 L38 22" stroke="#a7f3d0" strokeWidth="1" strokeDasharray="2 2" />
        </svg>

        {/* Active Dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-slate-900"></span>
        </span>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              উস্তাদ এআই
            </span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-500/20">
              মাদ্রাসা টিউটর
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
