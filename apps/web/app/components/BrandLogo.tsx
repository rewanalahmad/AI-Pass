import type { CSSProperties } from 'react';

export const BRAND_LOGO_SRC = '/logo.svg';
export const BRAND_LOGO_ALT = 'AI-Pass';
export const BRAND_HOME_ARIA_LABEL = 'AI-Pass home';

export interface BrandLogoProps {
  height?: number;
  maxWidth?: number;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

export function BrandLogo({
  height = 36,
  maxWidth,
  className,
  style,
  alt = BRAND_LOGO_ALT,
}: BrandLogoProps) {
  const h = height ?? 36;
  const w = (h * 176) / 40;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 176 40"
      fill="none"
      role="img"
      aria-label={alt}
      className={className}
      style={{
        height: h,
        width: maxWidth ? Math.min(w, maxWidth) : 'auto',
        aspectRatio: '176 / 40',
        display: 'block',
        ...style,
      }}
    >
      <defs>
        <linearGradient id="aipass-tile" x1="2" y1="1" x2="38" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#58a6ff" />
          <stop offset="1" stopColor="#1f52d0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#aipass-tile)" />
      <g transform="scale(0.3125)">
        <path d="m40 38 30 26-30 26" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M92 34v60" stroke="#fff" strokeWidth="11" strokeLinecap="round" opacity="0.65" />
      </g>
      <text
        x="52"
        y="27.5"
        fontFamily="Syne, 'Plus Jakarta Sans', 'IBM Plex Sans', 'Segoe UI', sans-serif"
        fontSize="21"
        fontWeight="700"
        letterSpacing="-0.6"
      >
        <tspan fill="currentColor">AI</tspan>
        <tspan fill="#58a6ff">-Pass</tspan>
      </text>
    </svg>
  );
}
