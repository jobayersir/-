import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon';
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
  // Size scaling multipliers
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', subText: 'text-[9px]', gap: 'space-x-2' },
    md: { icon: 'w-10 h-10 sm:w-12 sm:h-12', text: 'text-xl sm:text-2xl', subText: 'text-[10px] sm:text-xs', gap: 'space-x-2.5 sm:space-x-3' },
    lg: { icon: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-3xl sm:text-4xl', subText: 'text-sm sm:text-base', gap: 'space-x-4' },
    xl: { icon: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-4xl sm:text-5xl', subText: 'text-base sm:text-lg', gap: 'space-x-5' },
  };

  const { icon: iconSize, text: textSize, subText: subTextSize, gap } = sizeMap[size];

  // SVG Emblem component for Tamreen Academy
  const Emblem = ({ svgClass }: { svgClass: string }) => (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgClass} transition-colors duration-300`}
    >
      {/* Dome Apex & Arch */}
      <path
        d="M100 20 C125 42 145 65 145 95 V125 H55 V95 C55 65 75 42 100 20 Z"
        className="fill-emerald-800 dark:fill-emerald-400 stroke-emerald-900 dark:stroke-emerald-300"
        strokeWidth="4"
      />
      <path
        d="M100 28 C120 48 137 68 137 95 V120 H63 V95 C63 68 80 48 100 28 Z"
        className="fill-white dark:fill-slate-900"
      />

      {/* Gold Crescent Moon & Star inside top dome */}
      <g className="fill-amber-500 dark:fill-amber-400">
        <path d="M100 40 C95 40 90 44 90 50 C90 56 95 60 100 60 C97 58 95 54 95 50 C95 46 97 42 100 40 Z" />
        <polygon points="103,45 104,48 107,48 105,50 106,53 103,51 100,53 101,50 99,48 102,48" />
      </g>

      {/* Arabic Calligraphy "تمرين" Frame Box inside Dome */}
      <rect
        x="68"
        y="65"
        width="64"
        height="36"
        rx="2"
        className="fill-emerald-800 dark:fill-emerald-400"
      />
      
      {/* Calligraphy text inside box */}
      <text
        x="100"
        y="90"
        textAnchor="middle"
        className="fill-amber-300 dark:fill-amber-200 font-arabic font-bold text-[26px]"
        style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
      >
        تمرين
      </text>

      {/* Open Book Pages at Base */}
      <g>
        {/* Left Green Book Cover */}
        <path
          d="M100 155 C70 142 40 148 20 158 V132 C40 122 70 120 100 135 Z"
          className="fill-emerald-900 dark:fill-emerald-500"
        />
        {/* Right Green Book Cover */}
        <path
          d="M100 155 C130 142 160 148 180 158 V132 C160 122 130 120 100 135 Z"
          className="fill-emerald-900 dark:fill-emerald-500"
        />

        {/* Inner Gold Page Leaves */}
        <path
          d="M100 150 C72 137 42 142 24 150 V138 C42 130 72 128 100 140 Z"
          className="fill-amber-500 dark:fill-amber-400"
        />
        <path
          d="M100 150 C128 137 158 142 176 150 V138 C158 130 128 128 100 140 Z"
          className="fill-amber-500 dark:fill-amber-400"
        />

        {/* Central Spine Line */}
        <line
          x1="100"
          y1="130"
          x2="100"
          y2="157"
          className="stroke-emerald-950 dark:stroke-emerald-200"
          strokeWidth="3"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Emblem svgClass={iconSize} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <Emblem svgClass={iconSize} />
        <div className="mt-2 flex flex-col items-center">
          <span
            className={`font-black tracking-wider text-emerald-900 dark:text-emerald-300 uppercase ${textSize}`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            TAMREEN
          </span>
          <div className="flex items-center space-x-2 mt-0.5 w-full justify-center">
            <span className="h-[1.5px] w-6 bg-amber-500 dark:bg-amber-400" />
            <span
              className={`font-semibold tracking-[0.25em] text-amber-600 dark:text-amber-400 uppercase ${subTextSize}`}
            >
              ACADEMY
            </span>
            <span className="h-[1.5px] w-6 bg-amber-500 dark:bg-amber-400" />
          </div>
          {showSubtitle && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
              তামরীন একাডেমি • শিক্ষায় উৎকর্ষ
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`inline-flex items-center ${gap} ${className}`}>
      <div className="flex-shrink-0">
        <Emblem svgClass={iconSize} />
      </div>
      <div className="flex flex-col justify-center">
        <span
          className={`font-extrabold tracking-tight text-emerald-900 dark:text-emerald-300 leading-none uppercase ${textSize}`}
          style={{ letterSpacing: '0.04em' }}
        >
          TAMREEN
        </span>
        <div className="flex items-center space-x-1.5 mt-1">
          <span className="h-[1.5px] flex-1 bg-amber-500/80 dark:bg-amber-400/80 min-w-[12px]" />
          <span
            className={`font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400 uppercase leading-none ${subTextSize}`}
          >
            ACADEMY
          </span>
          <span className="h-[1.5px] flex-1 bg-amber-500/80 dark:bg-amber-400/80 min-w-[12px]" />
        </div>
      </div>
    </div>
  );
};
