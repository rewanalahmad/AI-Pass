'use client';

import type React from 'react';

export interface NavItemLike {
  id: string;
  label: string;
  route: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface WorkspaceSidebarBrand {
  name: string;
  tagline?: string;
  logoMark?: string;
  logoSrc?: string;
  logoAlt?: string;
}

export interface WorkspaceSidebarProps {
  items?: NavItemLike[];
  brand?: WorkspaceSidebarBrand;
  collapsed?: boolean;
  onToggle?: () => void;
  activePath?: string;
}


interface NavEntry {
  id: string;
  label: string;
  route: string;
  matchPrefixes?: string[];
  renderIcon: (active: boolean) => React.ReactNode;
}

interface NavGroup {
  id: string;
  title: string;
  entries: NavEntry[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'core',
    title: 'Core',
    entries: [
      {
        id: 'workspace',
        label: 'Workspace',
        route: '/workspace',
        matchPrefixes: ['/workspace'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        id: 'ide',
        label: 'IDE Code',
        route: '/ide',
        matchPrefixes: ['/ide', '/workspace/ide'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="6" y1="8" x2="6" y2="8" />
            <line x1="10" y1="8" x2="10" y2="8" />
            <line x1="14" y1="8" x2="14" y2="8" />
            <line x1="18" y1="8" x2="18" y2="8" />
            <line x1="6" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="18" y2="12" />
            <line x1="7" y1="16" x2="17" y2="16" />
          </svg>
        ),
      },
      {
        id: 'wallet',
        label: 'Wallet',
        route: '/workspace/wallet',
        matchPrefixes: ['/workspace/wallet', '/billing'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <circle cx="16" cy="14" r="1" />
          </svg>
        ),
      },
      {
        id: 'people',
        label: 'People',
        route: '/workspace/membership',
        matchPrefixes: ['/workspace/membership', '/workspace/people'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        id: 'settings',
        label: 'Settings & Governance',
        route: '/workspace/settings',
        matchPrefixes: ['/workspace/settings', '/workspace/governance', '/workspace/compliance'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
        ),
      },
      {
        id: 'admin',
        label: 'Administration',
        route: '/workspace/admin',
        matchPrefixes: ['/workspace/admin'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="12" y2="14" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'ai',
    title: 'Ai',
    entries: [
      {
        id: 'execution',
        label: 'AI Execution',
        route: '/workspace/execution',
        matchPrefixes: ['/workspace/execution'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        ),
      },
      {
        id: 'playground',
        label: 'AI Playground',
        route: '/workspace/playground',
        matchPrefixes: ['/workspace/playground'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16" />
            <line x1="16" y1="16" x2="16" y2="16" />
          </svg>
        ),
      },
      {
        id: 'agents',
        label: 'Agents',
        route: '/workspace/agents',
        matchPrefixes: ['/workspace/agents'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <circle cx="9" cy="10" r="1.5" />
            <circle cx="15" cy="10" r="1.5" />
            <path d="M9 15h6" />
          </svg>
        ),
      },
      {
        id: 'model-hub',
        label: 'Model Hub',
        route: '/workspace/providers',
        matchPrefixes: ['/workspace/providers', '/workspace/models'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <circle cx="19" cy="5" r="2" />
            <circle cx="5" cy="19" r="2" />
            <path d="M10.5 10.5 6.5 17.5" />
            <path d="m13.5 13.5 4-7" />
          </svg>
        ),
      },
      {
        id: 'digital-twin',
        label: 'Digital Twin',
        route: '/workspace/presence',
        matchPrefixes: ['/workspace/presence', '/workspace/digital-twin'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
          </svg>
        ),
      },
      {
        id: 'ai-coworker',
        label: 'AI Coworker',
        route: '/workspace/presence',
        matchPrefixes: ['/workspace/coworker'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        ),
      },
      {
        id: 'free-claude-code',
        label: 'Free Claude Code',
        route: '/ide',
        matchPrefixes: ['/workspace/claude-code'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'build',
    title: 'Build',
    entries: [
      {
        id: 'workflows',
        label: 'Workflows',
        route: '/workspace/workflows',
        matchPrefixes: ['/workspace/workflows', '/workspace/automation'],
        renderIcon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="6" height="6" rx="1" />
            <rect x="15" y="15" width="6" height="6" rx="1" />
            <path d="M6 9v3a3 3 0 0 0 3 3h6" />
          </svg>
        ),
      },
    ],
  },
];

function isEntryActive(entry: NavEntry, activePath: string): boolean {
  if (!activePath) return false;
  if (entry.id === 'workspace') {
    return activePath === '/workspace' || activePath === '/workspace/';
  }
  if (entry.matchPrefixes) {
    for (const prefix of entry.matchPrefixes) {
      if (activePath === prefix || activePath.startsWith(prefix + '/')) {
        return true;
      }
    }
  }
  return activePath === entry.route || activePath.startsWith(entry.route + '/');
}

export function WorkspaceSidebar({
  collapsed = false,
  onToggle,
  activePath = '',
}: WorkspaceSidebarProps) {
  const sidebarWidth = collapsed ? 68 : 250;

  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#07090F',
        borderRight: '1px solid #151A26',
        transition: 'width 0.2s ease, min-width 0.2s ease',
        userSelect: 'none',
        zIndex: 50,
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: collapsed ? '22px 14px' : '24px 20px 22px',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <a
          href="/workspace"
          aria-label="AI-Pass Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              backgroundColor: '#2563EB',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="7 6 13 12 7 18" />
              <line x1="17" y1="6" x2="17" y2="18" />
            </svg>
          </div>
          {!collapsed && (
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              AI-<span style={{ color: '#3B82F6' }}>Pass</span>
            </div>
          )}
        </a>
      </div>

      {/* Nav List */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? '10px 8px 20px' : '10px 12px 24px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.id} style={{ marginBottom: 22 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#4B5565',
                  padding: '0 12px',
                  marginBottom: 8,
                }}
              >
                {group.title}
              </div>
            )}
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {group.entries.map((entry) => {
                const active = isEntryActive(entry, activePath);
                return (
                  <li key={entry.id}>
                    <a
                      href={entry.route}
                      title={collapsed ? entry.label : undefined}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: collapsed ? '9px 0' : '8px 14px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        borderRadius: 8,
                        fontSize: 13.5,
                        fontWeight: active ? 600 : 500,
                        color: active ? '#FFFFFF' : '#8E9CAE',
                        backgroundColor: active ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease, background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.color = '#E2E8F0';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.color = '#8E9CAE';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {active && (
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 6,
                            bottom: 6,
                            width: 3,
                            backgroundColor: '#2563EB',
                            borderRadius: '0 2px 2px 0',
                          }}
                        />
                      )}
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: active ? '#3B82F6' : '#717E93',
                        }}
                      >
                        {entry.renderIcon(active)}
                      </span>
                      {!collapsed && <span>{entry.label}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      {onToggle && (
        <div style={{ padding: '8px 12px 14px', borderTop: '1px solid #151A26' }}>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              border: '1px solid #1C2335',
              borderRadius: 8,
              background: '#0E121B',
              color: '#8E9CAE',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.15s ease',
            }}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      )}
    </aside>
  );
}
