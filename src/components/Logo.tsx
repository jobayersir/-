import React from 'react';
const logoImg = '/src/assets/images/tamreen_academy_logo_1785821158176.jpg';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon' | 'image';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Size scaling multipliers carefully balanced so icon height matches text block height
  const sizeMap = {
    sm: { icon: 'w-7 h-7 sm:w-8 sm:h-8', text: 'text-sm sm:text-base', subText: 'text-[8px] sm:text-[9px]', gap: 'space-x-2' },
    md: { icon: 'w-9 h-9 sm:w-11 sm:h-11', text: 'text-lg sm:text-xl', subText: 'text-[9px] sm:text-[10px]', gap: 'space-x-2.5 sm:space-x-3' },
    lg: { icon: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-2xl sm:text-3xl', subText: 'text-xs sm:text-sm', gap: 'space-x-3.5 sm:space-x-4' },
    xl: { icon: 'w-20 h-20 sm:w-24 sm:h-24', text: 'text-4xl sm:text-5xl', subText: 'text-sm sm:text-base', gap: 'space-x-4 sm:space-x-5' },
  };

  const { icon: iconSize, text: textSize, subText: subTextSize, gap } = sizeMap[size];

  // Precision Square Kufic (الخط الكوفي المربع) SVG Emblem for Tamreen Academy
  const KuficEmblem = ({ svgClass }: { svgClass: string }) => (
    <svg
      viewBox="0 0 200 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgClass} transition-all duration-300 drop-shadow-sm`}
    >
      {/* 1. Islamic Pointed Dome Arch Outer Contour */}
      <path
        d="M100 12 C128 36 156 62 156 102 V132 C156 135 154 137 151 137 H49 C46 137 44 135 44 132 V102 C44 62 72 36 100 12 Z"
        className="stroke-emerald-800 dark:stroke-emerald-400 fill-white dark:fill-slate-900"
        strokeWidth="7"
        strokeLinejoin="round"
      />

      {/* Inner Arch Accent */}
      <path
        d="M100 20 C123 42 147 66 147 102 V130 H53 V102 C53 66 77 42 100 20 Z"
        className="stroke-emerald-900/20 dark:stroke-emerald-400/30"
        strokeWidth="2"
        fill="none"
      />

      {/* 2. Gold Crescent Moon & 5-Point Star inside Top Dome */}
      <g className="fill-amber-500 dark:fill-amber-400">
        {/* Crescent facing right */}
        <path d="M100 32 C93 32 87 37 87 45 C87 53 93 58 100 58 C96 55 93 50 93 45 C93 40 96 35 100 32 Z" />
        {/* Star */}
        <polygon points="105,40 106.5,44 111,44 107.5,46.5 109,51 105,48 101,51 102.5,46.5 99,44 103.5,44" />
      </g>

      {/* 3. Square Kufic Frame Box (إطار الكوفي المربع) */}
      <rect
        x="52"
        y="62"
        width="96"
        height="56"
        rx="2"
        className="stroke-emerald-800 dark:stroke-emerald-400 fill-white dark:fill-slate-900"
        strokeWidth="4"
      />

      {/* SQUARE KUFIC CALLIGRAPHY: "تمرين" (Right to Left) */}
      <g className="fill-emerald-800 dark:fill-emerald-400">
        {/* --- Letter 'ت' (Far Right) --- */}
        {/* Base and side walls */}
        <path d="M136 74 H142 V106 H130 V98 H136 V74 Z" />
        {/* Two Gold Dots above 'ت' */}
        <rect x="131" y="68" width="4.5" height="4.5" className="fill-amber-500 dark:fill-amber-400" />
        <rect x="137.5" y="68" width="4.5" height="4.5" className="fill-amber-500 dark:fill-amber-400" />

        {/* --- Letter 'م' (Middle-Right) --- */}
        {/* Square loop */}
        <path d="M116 82 H126 V98 H116 V82 Z M121 87 H121.1 V93 H121 Z" />
        <rect x="119" y="87" width="3" height="6" className="fill-white dark:fill-slate-900" />
        {/* Bottom connecting bar */}
        <path d="M110 98 H130 V106 H110 V98 Z" />

        {/* --- Letter 'ر' (Middle) --- */}
        <path d="M98 82 H104 V106 H90 V98 H98 V82 Z" />

        {/* --- Letter 'ي' (Middle-Left) --- */}
        <path d="M76 82 H82 V106 H68 V98 H76 V82 Z" />
        {/* Two Gold Dots below 'ي' */}
        <rect x="70" y="110" width="4.5" height="4.5" className="fill-amber-500 dark:fill-amber-400" />
        <rect x="76.5" y="110" width="4.5" height="4.5" className="fill-amber-500 dark:fill-amber-400" />

        {/* --- Letter 'ن' (Far Left) --- */}
        <path d="M56 74 H62 V106 H50 V74 H56 V98 H56 Z" />
        {/* One Gold Dot inside 'ن' bowl */}
        <rect x="53" y="84" width="5" height="5" className="fill-amber-500 dark:fill-amber-400" />
      </g>

      {/* 4. Open Book at Base (الكتاب المفتوح) */}
      <g>
        {/* Left Book Cover */}
        <path
          d="M100 178 C65 162 30 168 10 180 V150 C30 138 65 135 100 152 Z"
          className="fill-emerald-900 dark:fill-emerald-500"
        />
        {/* Right Book Cover */}
        <path
          d="M100 178 C135 162 170 168 190 180 V150 C170 138 135 135 100 152 Z"
          className="fill-emerald-900 dark:fill-emerald-500"
        />

        {/* Inner Gold Pages */}
        <path
          d="M100 171 C68 156 34 161 14 171 V158 C34 148 68 145 100 159 Z"
          className="fill-amber-500 dark:fill-amber-400"
        />
        <path
          d="M100 171 C132 156 166 161 186 171 V158 C166 148 132 145 100 159 Z"
          className="fill-amber-500 dark:fill-amber-400"
        />

        {/* Top Page Highlights */}
        <path
          d="M100 166 C70 152 38 156 18 165 V156 C38 147 70 144 100 157 Z"
          className="fill-emerald-100 dark:fill-slate-800"
        />
        <path
          d="M100 166 C130 152 162 156 182 165 V156 C162 147 130 144 100 157 Z"
          className="fill-emerald-100 dark:fill-slate-800"
        />

        {/* Book Spine Center */}
        <path
          d="M98 148 H102 V180 H98 Z"
          className="fill-emerald-950 dark:fill-emerald-300"
        />
      </g>
    </svg>
  );

  if (variant === 'image') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={logoImg}
          alt="TAMREEN ACADEMY LOGO"
          className={`object-contain rounded-lg ${iconSize} mix-blend-multiply dark:mix-blend-normal dark:bg-white/90 dark:p-1`}
        />
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <KuficEmblem svgClass={iconSize} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <KuficEmblem svgClass={iconSize} />
        <div className="mt-2 flex flex-col items-center">
          <span
            className={`font-black tracking-widest text-emerald-900 dark:text-emerald-300 uppercase ${textSize}`}
            style={{ fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: '0.08em' }}
          >
            TAMREEN
          </span>
          <div className="flex items-center space-x-2 mt-1 w-full justify-center">
            <span className="h-[2px] w-8 bg-amber-500 dark:bg-amber-400" />
            <span
              className={`font-extrabold tracking-[0.3em] text-amber-600 dark:text-amber-400 uppercase ${subTextSize}`}
            >
              ACADEMY
            </span>
            <span className="h-[2px] w-8 bg-amber-500 dark:bg-amber-400" />
          </div>
          {showSubtitle && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
              তামরীন একাডেমি • মাদ্রাসা শিক্ষক নিবন্ধন প্রস্তুতি
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default for Header & Footer)
  return (
    <div className={`inline-flex items-center ${gap} ${className}`}>
      <div className="flex-shrink-0 flex items-center justify-center">
        <KuficEmblem svgClass={iconSize} />
      </div>
      <div className="flex flex-col justify-center">
        <span
          className={`font-black tracking-wider text-emerald-950 dark:text-emerald-300 leading-none uppercase ${textSize}`}
          style={{ letterSpacing: '0.05em' }}
        >
          TAMREEN
        </span>
        <div className="flex items-center space-x-1 mt-1">
          <span className="h-[1.5px] flex-1 bg-amber-500 dark:bg-amber-400 min-w-[8px]" />
          <span
            className={`font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400 uppercase leading-none ${subTextSize}`}
          >
            ACADEMY
          </span>
          <span className="h-[1.5px] flex-1 bg-amber-500 dark:bg-amber-400 min-w-[8px]" />
        </div>
      </div>
    </div>
  );
};
