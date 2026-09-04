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
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; logo served from /public
    <img
      src={BRAND_LOGO_SRC}
      alt={alt}
      className={className}
      style={{
        height: height ?? 36,
        width: 'auto',
        display: 'block',
        objectFit: 'contain',
        ...(maxWidth != null ? { maxWidth } : {}),
        ...style,
      }}
    />
  );
}
