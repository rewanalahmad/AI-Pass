'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WorkspaceLayoutClient } from '../components/workspace/WorkspaceLayoutClient';
import styles from './workspace-dashboard.module.css';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface AIModel {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta' | 'Mistral';
  status: 'active' | 'degraded' | 'offline';
  latencyMs: number;
}

export interface WorkspaceActivity {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  action: string;
  target: string;
  timestamp: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer';
  avatar?: string;
  initials: string;
}

export interface WorkspaceData {
  id: string;
  name: string;
  orgId: string;
  orgName: string;
  description: string;
  plan: string;
  activeModelsCount: number;
  totalTokensUsed: string;
  members: WorkspaceMember[];
  recentActivities: WorkspaceActivity[];
  activeModels: AIModel[];
}

// ============================================================================
// Multiple Mock Workspaces
// ============================================================================

const WORKSPACES_LIST: WorkspaceData[] = [
  {
    id: 'ws-marketing-01',
    name: 'Marketing Team',
    orgId: 'org-acme-corp',
    orgName: 'Acme Corporation',
    description: 'Shared workspace for content generation, brand analytics, campaign strategy, and copy refinement.',
    plan: 'Enterprise',
    activeModelsCount: 4,
    totalTokensUsed: '1.42M',
    members: [
      { id: 'm-1', name: 'Sarah Connor', email: 'sarah@acme.com', role: 'Admin', initials: 'SC' },
      { id: 'm-2', name: 'Alex Rivera', email: 'alex@acme.com', role: 'Member', initials: 'AR' },
      { id: 'm-3', name: 'Elena Rostova', email: 'elena@acme.com', role: 'Member', initials: 'ER' },
      { id: 'm-4', name: 'David Kim', email: 'david@acme.com', role: 'Viewer', initials: 'DK' },
    ],
    activeModels: [
      { id: 'm-gpt4', name: 'GPT-4o', provider: 'OpenAI', status: 'active', latencyMs: 180 },
      { id: 'm-claude35', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'active', latencyMs: 210 },
      { id: 'm-gemini15', name: 'Gemini 1.5 Pro', provider: 'Google', status: 'active', latencyMs: 145 },
      { id: 'm-llama3', name: 'Llama 3.3 70B', provider: 'Meta', status: 'active', latencyMs: 95 },
    ],
    recentActivities: [
      {
        id: 'act-1',
        user: { name: 'Sarah Connor' },
        action: 'generated campaign copy using',
        target: 'Claude 3.5 Sonnet',
        timestamp: '5 mins ago',
      },
      {
        id: 'act-2',
        user: { name: 'Alex Rivera' },
        action: 'ran batch sentiment analysis via',
        target: 'GPT-4o',
        timestamp: '24 mins ago',
      },
      {
        id: 'act-3',
        user: { name: 'Elena Rostova' },
        action: 'deployed prompt template',
        target: 'Q3 Product Launch v2',
        timestamp: '1 hour ago',
      },
      {
        id: 'act-4',
        user: { name: 'David Kim' },
        action: 'exported execution logs for',
        target: 'Marketing Gateway',
        timestamp: '3 hours ago',
      },
    ],
  },
  {
    id: 'ws-eng-02',
    name: 'Engineering & Core AI',
    orgId: 'org-acme-corp',
    orgName: 'Acme Corporation',
    description: 'Core models routing, prompt engineering, code generation pipelines, and latency optimizations.',
    plan: 'Enterprise Plus',
    activeModelsCount: 6,
    totalTokensUsed: '5.89M',
    members: [
      { id: 'm-5', name: 'Marcus Vance', email: 'marcus@acme.com', role: 'Admin', initials: 'MV' },
      { id: 'm-6', name: 'Chloe Zhao', email: 'chloe@acme.com', role: 'Member', initials: 'CZ' },
      { id: 'm-7', name: 'Liam Neeson', email: 'liam@acme.com', role: 'Member', initials: 'LN' },
    ],
    activeModels: [
      { id: 'm-deepseek', name: 'DeepSeek V3', provider: 'Mistral', status: 'active', latencyMs: 88 },
      { id: 'm-gpt4o', name: 'GPT-4o Mini', provider: 'OpenAI', status: 'active', latencyMs: 110 },
      { id: 'm-claude35', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'active', latencyMs: 195 },
      { id: 'm-gemini2', name: 'Gemini 2.0 Flash', provider: 'Google', status: 'active', latencyMs: 82 },
    ],
    recentActivities: [
      {
        id: 'act-5',
        user: { name: 'Marcus Vance' },
        action: 'deployed fine-tuned gateway',
        target: 'DeepSeek V3 Endpoint',
        timestamp: '2 mins ago',
      },
      {
        id: 'act-6',
        user: { name: 'Chloe Zhao' },
        action: 'benchmarked latency on',
        target: 'Gemini 2.0 Flash',
        timestamp: '18 mins ago',
      },
    ],
  },
  {
    id: 'ws-product-03',
    name: 'Product & Design',
    orgId: 'org-acme-corp',
    orgName: 'Acme Corporation',
    description: 'UI/UX brainstorming, feature spec synthesis, user feedback summarization, and mockups.',
    plan: 'Pro Team',
    activeModelsCount: 3,
    totalTokensUsed: '820K',
    members: [
      { id: 'm-8', name: 'Jessica Alba', email: 'jessica@acme.com', role: 'Admin', initials: 'JA' },
      { id: 'm-9', name: 'Omar Sy', email: 'omar@acme.com', role: 'Member', initials: 'OS' },
    ],
    activeModels: [
      { id: 'm-gpt4o', name: 'GPT-4o', provider: 'OpenAI', status: 'active', latencyMs: 175 },
      { id: 'm-claude35', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'active', latencyMs: 205 },
    ],
    recentActivities: [
      {
        id: 'act-7',
        user: { name: 'Jessica Alba' },
        action: 'synthesized customer survey with',
        target: 'GPT-4o',
        timestamp: '45 mins ago',
      },
    ],
  },
];

// ============================================================================
// Page Component
// ============================================================================

export default function WorkspacePage() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('ws-marketing-01');
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  const currentWorkspace =
    WORKSPACES_LIST.find((w) => w.id === selectedWorkspaceId) || WORKSPACES_LIST[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <WorkspaceLayoutClient
      title="Workspace"
      subtitle="AI Operating System — overview and quick actions"
    >
      <div className={styles.main}>
        {/* Workspace Header Card */}
        <section className={styles.headerCard}>
          <div className={styles.glowDecor} />

          <div className={styles.headerFlex}>
            <div>
              <div className={styles.brandGroup}>
                <div className={styles.logoBox}>{currentWorkspace.name.charAt(0)}</div>

                {/* Workspace Title with Switcher Dropdown */}
                <div className={styles.titleArea} ref={switcherRef}>
                  <button
                    type="button"
                    className={`${styles.switcherTrigger} ${switcherOpen ? styles.switcherOpen : ''}`}
                    onClick={() => setSwitcherOpen((prev) => !prev)}
                    aria-expanded={switcherOpen}
                  >
                    <h1>{currentWorkspace.name}</h1>
                    <svg
                      className={styles.chevronIcon}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Switcher Dropdown Menu */}
                  {switcherOpen && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownHeader}>Switch Workspace</div>
                      {WORKSPACES_LIST.map((ws) => (
                        <button
                          key={ws.id}
                          type="button"
                          className={`${styles.dropdownItem} ${
                            ws.id === currentWorkspace.id ? styles.dropdownItemActive : ''
                          }`}
                          onClick={() => {
                            setSelectedWorkspaceId(ws.id);
                            setSwitcherOpen(false);
                          }}
                        >
                          <span>{ws.name}</span>
                          {ws.id === currentWorkspace.id && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}

                      <div className={styles.dropdownDivider} />

                      <button
                        type="button"
                        className={styles.dropdownCreateBtn}
                        onClick={() => {
                          alert('Create Workspace dialog');
                          setSwitcherOpen(false);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Create new workspace
                      </button>
                    </div>
                  )}

                  <p className={styles.wsId}>
                    Workspace ID: <span>{currentWorkspace.id}</span>
                  </p>
                </div>
              </div>
              <p className={styles.description}>{currentWorkspace.description}</p>
            </div>

            {/* Quick Metrics */}
            <div className={styles.metricsBar}>
              <div className={styles.metricItem}>
                <p>Active Gateway Models</p>
                <p className={styles.metricVal}>{currentWorkspace.activeModelsCount}</p>
              </div>
              <div className={styles.metricItem}>
                <p>Tokens (This Month)</p>
                <p className={styles.metricValAccent}>{currentWorkspace.totalTokensUsed}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Placeholder Widgets Grid */}
        <div className={styles.widgetsGrid}>
          {/* Widget 1: Active AI Models */}
          <section className={styles.widgetCard}>
            <div>
              <div className={styles.widgetHeader}>
                <div className={styles.headerLeft}>
                  <div className={`${styles.iconSquare} ${styles.iconAi}`}>AI</div>
                  <div>
                    <h2 className={styles.widgetTitle}>Active AI Models</h2>
                    <p className={styles.widgetSubtitle}>Gateway routing & latency</p>
                  </div>
                </div>
                <span className={styles.badgeSuccess}>
                  {currentWorkspace.activeModels.length} Connected
                </span>
              </div>

              {/* Models List */}
              <div className={styles.itemList}>
                {currentWorkspace.activeModels.map((model) => (
                  <div key={model.id} className={styles.listItem}>
                    <div className={styles.itemLeft}>
                      <span className={styles.greenDot} />
                      <div>
                        <p className={styles.modelName}>{model.name}</p>
                        <p className={styles.modelProvider}>{model.provider}</p>
                      </div>
                    </div>
                    <span className={styles.latency}>{model.latencyMs}ms</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.widgetFooter}>
              Model gateway controls will connect here in this sprint
            </div>
          </section>

          {/* Widget 2: Recent Prompts / Activity */}
          <section className={styles.widgetCard}>
            <div>
              <div className={styles.widgetHeader}>
                <div className={styles.headerLeft}>
                  <div className={`${styles.iconSquare} ${styles.iconFlash}`}>⚡</div>
                  <div>
                    <h2 className={styles.widgetTitle}>Recent Prompts / Activity</h2>
                    <p className={styles.widgetSubtitle}>Team execution logs</p>
                  </div>
                </div>
                <button className={styles.linkBtn}>View All</button>
              </div>

              {/* Activity Timeline */}
              <div className={styles.itemList}>
                {currentWorkspace.recentActivities.map((act) => (
                  <div key={act.id} className={styles.activityItem}>
                    <span className={styles.activityDot} />
                    <div className={styles.activityText}>
                      <strong>{act.user.name}</strong> <span>{act.action}</span>{' '}
                      <span className={styles.activityTarget}>{act.target}</span>
                      <span className={styles.activityTime}>{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.widgetFooter}>
              Live stream & prompt executions will render here
            </div>
          </section>

          {/* Widget 3: Workspace Members */}
          <section className={styles.widgetCard}>
            <div>
              <div className={styles.widgetHeader}>
                <div className={styles.headerLeft}>
                  <div className={`${styles.iconSquare} ${styles.iconTeam}`}>👥</div>
                  <div>
                    <h2 className={styles.widgetTitle}>Workspace Members</h2>
                    <p className={styles.widgetSubtitle}>
                      {currentWorkspace.members.length} team collaborators
                    </p>
                  </div>
                </div>
                <button className={styles.linkBtn}>+ Invite</button>
              </div>

              {/* Members List */}
              <div className={styles.itemList}>
                {currentWorkspace.members.map((member) => (
                  <div key={member.id} className={styles.listItem}>
                    <div className={styles.itemLeft}>
                      <div className={styles.avatar}>{member.initials}</div>
                      <div>
                        <p className={styles.memberName}>{member.name}</p>
                        <p className={styles.memberEmail}>{member.email}</p>
                      </div>
                    </div>
                    <span
                      className={
                        member.role === 'Admin'
                          ? styles.roleBadgeAdmin
                          : member.role === 'Member'
                          ? styles.roleBadgeMember
                          : styles.roleBadgeViewer
                      }
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.widgetFooter}>
              Role management and access controls will link here
            </div>
          </section>
        </div>
      </div>
    </WorkspaceLayoutClient>
  );
}
