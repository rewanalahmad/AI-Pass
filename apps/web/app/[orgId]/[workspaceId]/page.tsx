import React from 'react';

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
// Static Mock Data
// ============================================================================

const MOCK_WORKSPACE_DATA: Record<string, WorkspaceData> = {
  default: {
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
};

// ============================================================================
// Page Component
// ============================================================================

interface PageProps {
  params: Promise<{
    orgId: string;
    workspaceId: string;
  }>;
}

export default async function WorkspaceDashboardPage({ params }: PageProps) {
  const { orgId, workspaceId } = await params;

  // Resolve mock data with dynamic fallback
  const workspace: WorkspaceData = {
    ...MOCK_WORKSPACE_DATA.default,
    id: workspaceId || MOCK_WORKSPACE_DATA.default.id,
    orgId: orgId || MOCK_WORKSPACE_DATA.default.orgId,
    name: workspaceId
      ? workspaceId.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : MOCK_WORKSPACE_DATA.default.name,
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F3F4F6] font-sans antialiased selection:bg-indigo-500/30">
      {/* Top Breadcrumb & Status Bar */}
      <header className="border-b border-white/[0.08] bg-[#0D121F]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400 font-medium">{workspace.orgName}</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {workspace.name}
            </span>
            <span className="ml-2 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {workspace.plan}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-all">
              Settings
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm transition-all">
              + New Prompt
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Header */}
        <section className="bg-gradient-to-b from-[#111726] to-[#0D121F] border border-white/[0.08] rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                  {workspace.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {workspace.name}
                  </h1>
                  <p className="text-xs text-gray-400 font-mono">
                    Workspace ID: <span className="text-gray-300">{workspace.id}</span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 max-w-2xl pt-1">
                {workspace.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-6">
              <div>
                <p className="text-xs text-gray-400 font-medium">Active Gateway Models</p>
                <p className="text-2xl font-bold text-white tracking-tight">{workspace.activeModelsCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Tokens (This Month)</p>
                <p className="text-2xl font-bold text-indigo-400 tracking-tight">{workspace.totalTokensUsed}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Placeholder Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Widget 1: Active AI Models (Model Gateway) */}
          <section className="bg-[#0D121F] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between hover:border-white/[0.14] transition-all group">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Active AI Models</h2>
                    <p className="text-xs text-gray-400">Gateway routing & latency</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  4 Connected
                </span>
              </div>

              {/* Models List */}
              <div className="space-y-2.5">
                {workspace.activeModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-sm font-medium text-white leading-none">{model.name}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{model.provider}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{model.latencyMs}ms</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Placeholder Footer */}
            <div className="mt-6 pt-4 border-t border-dashed border-white/[0.08] text-center">
              <span className="text-xs text-gray-500 italic block">
                Model gateway controls will connect here in this sprint
              </span>
            </div>
          </section>

          {/* Widget 2: Recent Prompts / Activity */}
          <section className="bg-[#0D121F] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between hover:border-white/[0.14] transition-all group">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Recent Prompts / Activity</h2>
                    <p className="text-xs text-gray-400">Team execution logs</p>
                  </div>
                </div>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  View All
                </button>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                {workspace.recentActivities.map((act) => (
                  <div key={act.id} className="text-xs text-gray-300 flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{act.user.name}</span>{' '}
                      <span className="text-gray-400">{act.action}</span>{' '}
                      <span className="text-indigo-300 font-medium">{act.target}</span>
                      <span className="block text-[10px] text-gray-500 font-mono mt-0.5">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Placeholder Footer */}
            <div className="mt-6 pt-4 border-t border-dashed border-white/[0.08] text-center">
              <span className="text-xs text-gray-500 italic block">
                Live stream & prompt executions will render here
              </span>
            </div>
          </section>

          {/* Widget 3: Workspace Members */}
          <section className="bg-[#0D121F] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between hover:border-white/[0.14] transition-all group">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-sky-500/10 text-sky-400 flex items-center justify-center text-xs font-bold">
                    👥
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Workspace Members</h2>
                    <p className="text-xs text-gray-400">{workspace.members.length} team collaborators</p>
                  </div>
                </div>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                  + Invite
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-2.5">
                {workspace.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white leading-none">{member.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{member.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        member.role === 'Admin'
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                          : member.role === 'Member'
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                          : 'bg-gray-500/10 text-gray-300 border border-gray-500/20'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Placeholder Footer */}
            <div className="mt-6 pt-4 border-t border-dashed border-white/[0.08] text-center">
              <span className="text-xs text-gray-500 italic block">
                Role management and access controls will link here
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
