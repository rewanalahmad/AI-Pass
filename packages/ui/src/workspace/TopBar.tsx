'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { tokens } from './tokens';

export interface WorkspaceTopBarProps {
  title?: string;
  subtitle?: string;
  user?: { name: string; email?: string; avatarInitials: string; avatarUrl?: string; plan?: string };
  actions?: ReactNode;
  search?: ReactNode;
  onThemeToggle?: () => void;
  onSignOut?: () => void;
  onNavigate?: (path: string) => void;
  theme?: 'dark' | 'light';
}

export function WorkspaceTopBar({
  title,
  subtitle,
  user,
  actions,
  search,
  onThemeToggle,
  onSignOut,
  onNavigate,
  theme = 'dark',
}: WorkspaceTopBarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (path: string) => {
    setUserMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <header
      style={{
        height: tokens.topBarHeight,
        minHeight: tokens.topBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: `1px solid ${tokens.colors.border}`,
        background: tokens.colors.bg,
        gap: tokens.spacing.md,
        position: 'relative',
        zIndex: 40,
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {title && (
          <h1 style={{ fontSize: tokens.fontSize.lg, fontWeight: 600, color: tokens.colors.text, margin: 0 }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textMuted, margin: '2px 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>

      {search && <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{search}</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, flexShrink: 0 }}>
        {actions}
        {onThemeToggle && (
          <button
            type="button"
            onClick={onThemeToggle}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: tokens.radius.md,
              border: `1px solid ${tokens.colors.border}`,
              background: 'transparent',
              color: tokens.colors.textMuted,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M6.34 17.66l-1.41 1.41" />
                <path d="M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        )}
        {user && (
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              aria-expanded={userMenuOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.sm,
                padding: '4px 12px 4px 4px',
                borderRadius: tokens.radius.lg,
                border: `1px solid ${userMenuOpen ? tokens.colors.accent : tokens.colors.border}`,
                background: userMenuOpen ? tokens.colors.bgHover : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: user.avatarUrl ? 'transparent' : tokens.colors.accentMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: tokens.fontSize.xs,
                  fontWeight: 600,
                  color: '#fff',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  user.avatarInitials
                )}
              </span>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: tokens.fontSize.sm, fontWeight: 500, color: tokens.colors.text }}>
                  {user.name}
                </div>
                {user.plan && (
                  <div style={{ fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted }}>
                    {user.plan}
                  </div>
                )}
              </div>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  marginLeft: 4,
                  transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.15s ease',
                  color: tokens.colors.textMuted,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 230,
                  background: tokens.colors.bgElevated,
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: tokens.radius.lg,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  zIndex: 100,
                }}
              >
                <div style={{ padding: '8px 10px 10px', borderBottom: `1px solid ${tokens.colors.border}` }}>
                  <div style={{ fontSize: tokens.fontSize.sm, fontWeight: 600, color: tokens.colors.text }}>
                    {user.name}
                  </div>
                  {user.email && (
                    <div style={{ fontSize: tokens.fontSize.xs, color: tokens.colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </div>
                  )}
                  {user.plan && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: 6,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: tokens.colors.accentMuted,
                        color: tokens.colors.accent,
                      }}
                    >
                      {user.plan}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: tokens.radius.md,
                    fontSize: tokens.fontSize.sm,
                    color: tokens.colors.text,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = tokens.colors.bgHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  🏠 Landing Page
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/workspace')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: tokens.radius.md,
                    fontSize: tokens.fontSize.sm,
                    color: tokens.colors.text,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = tokens.colors.bgHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  📊 Dashboard
                </button>

                <div style={{ height: 1, background: tokens.colors.border, margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: tokens.radius.md,
                    fontSize: tokens.fontSize.sm,
                    color: '#f87171',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  🚪 Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
