'use client';

import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import { PremiumNav } from '../components/premium/PremiumNav';
import styles from './demo.module.css';

type DemoTab = 'scenarios' | 'gateway' | 'orgs-workspaces' | 'rbac' | 'auth' | 'summary';

interface DemoOrg {
  id: string;
  name: string;
  type: 'Enterprise' | 'Sovereign / Gov' | 'FinTech / Regulated';
  domain: string;
  region: string;
  dataSovereignty: string;
  workspaces: DemoWorkspace[];
}

interface DemoWorkspace {
  id: string;
  name: string;
  description: string;
  spendLimit: string;
  activeModels: string[];
  teamMembers: number;
}

interface DemoProvider {
  id: string;
  name: string;
  tag: 'OpenAI' | 'Anthropic' | 'Mistral' | 'Local';
  tagClass: string;
  model: string;
  description: string;
  latencyMs: number;
  inputCost1M: number;
  outputCost1M: number;
  sovereignty: string;
  samplePrompt: string;
  sampleResponse: string;
}

const DEMO_PROVIDERS: DemoProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    tag: 'OpenAI',
    tagClass: styles.tagOpenAI,
    model: 'gpt-4o / gpt-5',
    description: 'Frontier reasoning, vision & high-speed tool execution',
    latencyMs: 140,
    inputCost1M: 5.0,
    outputCost1M: 15.0,
    sovereignty: 'US Multi-Region (SOC2 Type II, ISO27001)',
    samplePrompt: 'Summarize our Q3 enterprise AI infrastructure spend and suggest routing optimizations.',
    sampleResponse: `✓ AI-Pass Gateway routed via OpenAI (gpt-4o)
Q3 Enterprise AI Infrastructure Spend:
• Total Token Spend: $14,820 (-28% vs unmanaged API endpoints)
• Cache Hit Ratio: 44.2% via AI-Pass Semantic Caching
• Optimization Recommendation: Route routine classification queries to Mistral Small or Local Llama-3.3 node to reduce monthly spend by an additional $3,400.`,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    tag: 'Anthropic',
    tagClass: styles.tagAnthropic,
    model: 'claude-3-5-sonnet / claude-opus-4',
    description: 'Deep cognitive reasoning, complex code generation & artifact synthesis',
    latencyMs: 180,
    inputCost1M: 3.0,
    outputCost1M: 15.0,
    sovereignty: 'US / EU HIPAA & GDPR Certified Tier 1',
    samplePrompt: 'Review the RBAC policy and identify any privilege escalation vectors between Workspace Admin and Org Owner.',
    sampleResponse: `✓ AI-Pass Gateway routed via Anthropic (claude-3-5-sonnet)
RBAC Policy Audit Assessment:
1. Least-Privilege Verification: PASSED. Workspace Admins cannot modify Org-level BYOK keys or billing vaults.
2. Tenant Boundary Isolation: Strong isolation enforced at JWT scope layer. No cross-tenant egress possible.
3. Recommended Action: Enable mandatory Hardware MFA for the Sovereign Auditor persona.`,
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    tag: 'Mistral',
    tagClass: styles.tagMistral,
    model: 'mistral-large-latest / codestral',
    description: 'European AI flagship with strict EU data residency & multilingual agility',
    latencyMs: 120,
    inputCost1M: 2.0,
    outputCost1M: 6.0,
    sovereignty: '100% EU Data Residency (France / Germany, EU AI Act Ready)',
    samplePrompt: 'Draft an EU AI Act conformity statement for our internal invoice automation agents.',
    sampleResponse: `✓ AI-Pass Gateway routed via Mistral (mistral-large)
EU AI Act Conformity Declaration:
• Risk Classification: Minimal / Low-Risk Operational Automation (Annex III exempt).
• Data Governance: Zero telemetry egress outside EU borders. Prompt retention window = 0 days.
• Auditability: Every model invocation logged to immutable AI-Pass Presence Ledger.`,
  },
  {
    id: 'local',
    name: 'Local Sovereign Provider',
    tag: 'Local',
    tagClass: styles.tagLocal,
    model: 'ollama / vLLM (Llama 3.3 70B Air-Gapped)',
    description: 'Self-hosted on-premise node. Zero internet egress for defense & government sovereignty',
    latencyMs: 45,
    inputCost1M: 0.0,
    outputCost1M: 0.0,
    sovereignty: 'Air-Gapped On-Premises (0 Egress, FedRAMP High / Classified Ready)',
    samplePrompt: 'Analyze classified procurement manifest without sending payload to external internet APIs.',
    sampleResponse: `✓ AI-Pass Gateway routed via Local Sovereign Provider (On-Prem vLLM Cluster)
🔒 Air-Gapped Zero-Egress Execution Verified:
• Host Node: sovereign-node-01.gov.internal (10.140.0.12)
• External Internet Connection: DISABLED (Enforced by Hardware Firewall)
• Manifest Analysis: 42 defense line items parsed and indexed in local vector space with zero external packet transmission.`,
  },
];

const INITIAL_ORGS: DemoOrg[] = [
  {
    id: 'org_acme',
    name: 'Acme Corp',
    type: 'Enterprise',
    domain: 'acme.corp',
    region: 'us-east (Virginia)',
    dataSovereignty: 'Standard Enterprise Hybrid (BYOK Enabled)',
    workspaces: [
      {
        id: 'ws_core',
        name: 'Platform & Core AI Engine',
        description: 'Main production workspace for engineering and multi-model routing.',
        spendLimit: '$25,000 / mo',
        activeModels: ['OpenAI GPT-4o', 'Claude Sonnet 3.5', 'Mistral Large'],
        teamMembers: 42,
      },
      {
        id: 'ws_ap',
        name: 'Accounts Payable & Invoicing AI',
        description: 'Automated invoice ingestion, reconciliation, and audit matching.',
        spendLimit: '$8,000 / mo',
        activeModels: ['Mistral Large', 'Claude 3.5 Sonnet'],
        teamMembers: 14,
      },
    ],
  },
  {
    id: 'org_gov',
    name: 'Apex Sovereign Federal Systems',
    type: 'Sovereign / Gov',
    domain: 'defense.apex.gov',
    region: 'sovereign-gov-cloud-1',
    dataSovereignty: 'Air-Gapped On-Premise + Local Sovereign Provider Only',
    workspaces: [
      {
        id: 'ws_classified',
        name: 'Classified Defense AI Sandbox',
        description: 'Air-gapped analysis environment with hardware isolation and zero external egress.',
        spendLimit: 'Unlimited (Internal Compute Node)',
        activeModels: ['Local Sovereign Llama 3.3 70B', 'On-Prem vLLM'],
        teamMembers: 8,
      },
    ],
  },
  {
    id: 'org_fintech',
    name: 'Nexus Global FinTech',
    type: 'FinTech / Regulated',
    domain: 'nexus-fintech.eu',
    region: 'eu-west (Frankfurt)',
    dataSovereignty: '100% EU Data Residency (GDPR & DORA Compliant)',
    workspaces: [
      {
        id: 'ws_compliance',
        name: 'EU Banking Regulatory & Fraud AI',
        description: 'Real-time transaction compliance and automated SAR documentation.',
        spendLimit: '€15,000 / mo',
        activeModels: ['Mistral Large (EU)', 'Codestral'],
        teamMembers: 22,
      },
    ],
  },
];

type UserRole = 'owner' | 'admin' | 'engineer' | 'auditor' | 'member';

interface RoleDetail {
  id: UserRole;
  label: string;
  badgeClass: string;
  description: string;
  permissions: Record<string, boolean>;
}

const ROLES: RoleDetail[] = [
  {
    id: 'owner',
    label: 'Organization Owner',
    badgeClass: styles.badgeSuccess,
    description: 'Full root governance over all organizations, billing, keys, and workspace creation.',
    permissions: {
      'gateway:execute': true,
      'gateway:manage_routes': true,
      'byok:manage_vault': true,
      'workspace:create_delete': true,
      'rbac:assign_roles': true,
      'audit:view_immutable_ledger': true,
      'sovereign:access_local_nodes': true,
      'billing:modify_budget': true,
    },
  },
  {
    id: 'admin',
    label: 'Workspace Admin',
    badgeClass: styles.badgeInfo,
    description: 'Manages team members, workspace budgets, model allocation, and agent pipelines.',
    permissions: {
      'gateway:execute': true,
      'gateway:manage_routes': true,
      'byok:manage_vault': false,
      'workspace:create_delete': false,
      'rbac:assign_roles': true,
      'audit:view_immutable_ledger': true,
      'sovereign:access_local_nodes': true,
      'billing:modify_budget': false,
    },
  },
  {
    id: 'engineer',
    label: 'AI Engineer',
    badgeClass: styles.badgeInfo,
    description: 'Tests models, builds prompts, crafts multi-agent workflows and runs benchmarks.',
    permissions: {
      'gateway:execute': true,
      'gateway:manage_routes': false,
      'byok:manage_vault': false,
      'workspace:create_delete': false,
      'rbac:assign_roles': false,
      'audit:view_immutable_ledger': false,
      'sovereign:access_local_nodes': true,
      'billing:modify_budget': false,
    },
  },
  {
    id: 'auditor',
    label: 'Sovereign Auditor',
    badgeClass: styles.badgeWarning,
    description: 'Inspects immutable compliance logs, telemetry, zero-egress proofs, and EU AI Act reports.',
    permissions: {
      'gateway:execute': false,
      'gateway:manage_routes': false,
      'byok:manage_vault': false,
      'workspace:create_delete': false,
      'rbac:assign_roles': false,
      'audit:view_immutable_ledger': true,
      'sovereign:access_local_nodes': true,
      'billing:modify_budget': false,
    },
  },
  {
    id: 'member',
    label: 'Team Member',
    badgeClass: styles.badgeInfo,
    description: 'Standard end-user running daily AI tasks and approved agent workflows.',
    permissions: {
      'gateway:execute': true,
      'gateway:manage_routes': false,
      'byok:manage_vault': false,
      'workspace:create_delete': false,
      'rbac:assign_roles': false,
      'audit:view_immutable_ledger': false,
      'sovereign:access_local_nodes': false,
      'billing:modify_budget': false,
    },
  },
];

const PERMISSION_METADATA: Record<string, { label: string; desc: string }> = {
  'gateway:execute': { label: 'Execute Model Gateway Requests', desc: 'Send prompts to OpenAI, Anthropic, Mistral & Local models.' },
  'gateway:manage_routes': { label: 'Configure Gateway Routing Rules', desc: 'Define latency, cost, and sovereignty failover cascades.' },
  'byok:manage_vault': { label: 'Manage BYOK Encryption Vault', desc: 'Add or revoke corporate provider API keys and hardware tokens.' },
  'workspace:create_delete': { label: 'Create & Terminate Workspaces', desc: 'Spin up isolated team environments with dedicated quotas.' },
  'rbac:assign_roles': { label: 'Modify RBAC User Permissions', desc: 'Promote or demote users between roles across tenants.' },
  'audit:view_immutable_ledger': { label: 'Access Audit & Compliance Ledger', desc: 'Export cryptographically signed compliance audit logs.' },
  'sovereign:access_local_nodes': { label: 'Access Local Air-Gapped Provider', desc: 'Route sensitive prompts to on-premise sovereign hardware.' },
  'billing:modify_budget': { label: 'Adjust Spend & Credit Limits', desc: 'Set monthly monetary caps and workspace allocation thresholds.' },
};

export default function TryDemoPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>('scenarios');
  
  // Model Gateway state
  const [selectedProviderId, setSelectedProviderId] = useState<string>('openai');
  const [promptInput, setPromptInput] = useState<string>(DEMO_PROVIDERS[0].samplePrompt);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [streamedText, setStreamedText] = useState<string>(DEMO_PROVIDERS[0].sampleResponse);
  const [telemetry, setTelemetry] = useState({
    latency: 140,
    tokens: 312,
    costUsd: 0.0038,
    routeStatus: 'Optimal (Direct Gateway)',
  });

  // Org & Workspace state
  const [orgs, setOrgs] = useState<DemoOrg[]>(INITIAL_ORGS);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org_acme');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('ws_core');
  const [newWsName, setNewWsName] = useState('');
  const [isCreatingWs, setIsCreatingWs] = useState(false);

  // RBAC state
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [testedAction, setTestedAction] = useState<string | null>(null);

  // Auth simulator state
  const [authMethod, setAuthMethod] = useState<'sso' | 'passkey' | 'magic' | 'mfa' | 'oauth'>('sso');
  const [authStatusMessage, setAuthStatusMessage] = useState<string>('Authenticated via Enterprise SAML 2.0 (Okta SSO)');

  // Selected Org and Workspace getters
  const currentOrg = useMemo(() => orgs.find((o) => o.id === selectedOrgId) || orgs[0], [orgs, selectedOrgId]);
  const currentWorkspace = useMemo(
    () => currentOrg.workspaces.find((w) => w.id === selectedWorkspaceId) || currentOrg.workspaces[0],
    [currentOrg, selectedWorkspaceId],
  );
  const currentRoleInfo = useMemo(() => ROLES.find((r) => r.id === currentRole) || ROLES[0], [currentRole]);
  const selectedProvider = useMemo(
    () => DEMO_PROVIDERS.find((p) => p.id === selectedProviderId) || DEMO_PROVIDERS[0],
    [selectedProviderId],
  );

  // Switch prompt when provider changes
  useEffect(() => {
    setPromptInput(selectedProvider.samplePrompt);
    setStreamedText(selectedProvider.sampleResponse);
    setTelemetry({
      latency: selectedProvider.latencyMs,
      tokens: Math.floor(Math.random() * 150 + 200),
      costUsd: selectedProvider.inputCost1M > 0 ? 0.0024 : 0.0,
      routeStatus: selectedProvider.id === 'local' ? '🔒 0ms Egress (Local Node)' : '✓ Verified Secure Tunnel',
    });
  }, [selectedProvider]);

  // Handle prompt execution simulation with live typewriter effect
  const handleExecutePrompt = () => {
    setIsExecuting(true);
    setStreamedText('');
    const fullText = selectedProvider.sampleResponse;
    let charIndex = 0;

    const timer = setInterval(() => {
      charIndex += 4;
      if (charIndex >= fullText.length) {
        setStreamedText(fullText);
        setIsExecuting(false);
        clearInterval(timer);
      } else {
        setStreamedText(fullText.slice(0, charIndex));
      }
    }, 15);
  };

  // Launch pre-built scenario
  const launchScenario = (scenarioId: string) => {
    if (scenarioId === 'sovereign') {
      setSelectedOrgId('org_gov');
      setSelectedWorkspaceId('ws_classified');
      setSelectedProviderId('local');
      setCurrentRole('auditor');
      setActiveTab('gateway');
    } else if (scenarioId === 'failover') {
      setSelectedOrgId('org_acme');
      setSelectedWorkspaceId('ws_core');
      setSelectedProviderId('anthropic');
      setCurrentRole('engineer');
      setActiveTab('gateway');
    } else if (scenarioId === 'rbac') {
      setSelectedOrgId('org_fintech');
      setSelectedWorkspaceId('ws_compliance');
      setCurrentRole('admin');
      setActiveTab('rbac');
    } else if (scenarioId === 'optimizer') {
      setSelectedOrgId('org_acme');
      setSelectedWorkspaceId('ws_ap');
      setSelectedProviderId('mistral');
      setCurrentRole('owner');
      setActiveTab('gateway');
    }
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    const newWs: DemoWorkspace = {
      id: `ws_${Date.now()}`,
      name: newWsName.trim(),
      description: 'Custom workspace created in live demo environment.',
      spendLimit: '$10,000 / mo',
      activeModels: ['OpenAI GPT-4o', 'Mistral Large'],
      teamMembers: 1,
    };

    setOrgs((prev) =>
      prev.map((o) => (o.id === selectedOrgId ? { ...o, workspaces: [...o.workspaces, newWs] } : o)),
    );
    setSelectedWorkspaceId(newWs.id);
    setNewWsName('');
    setIsCreatingWs(false);
  };

  const [copiedSummary, setCopiedSummary] = useState(false);
  const handleCopySummary = () => {
    const summary = `AI-Pass Enterprise Test Drive Summary:
Organization: ${currentOrg.name} (${currentOrg.type})
Workspace: ${currentWorkspace.name}
Active User Role: ${currentRoleInfo.label}
Selected Model Gateway Provider: ${selectedProvider.name} (${selectedProvider.model})
Data Residency / Sovereignty: ${selectedProvider.sovereignty}
Live Gateway Latency: ${telemetry.latency}ms
Tested Scenarios: Authentication, Multi-Tenant Workspaces, RBAC Enforcement, Sovereign Local Provider Gateway.`;
    navigator.clipboard?.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className={styles.pageContainer}>
      <PremiumNav variant="landing" />

      {/* Hero Header */}
      <header className={styles.heroHeader}>
        <div className={styles.heroBadge}>
          <span className={styles.heroPulse} />
          <span>Interactive Live Demo Environment</span>
        </div>
        <h1 className={styles.heroTitle}>
          Experience the <span className={styles.heroHighlight}>AI-Pass Operating System</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Test enterprise authentication, multi-tenant organizations, granular RBAC permissions, and the universal
          model gateway with live connections to OpenAI, Anthropic, Mistral, and On-Prem Sovereign Local Providers.
        </p>

        {/* Top Quick Stats Strip */}
        <div className={styles.statsStrip}>
          <div className={statItemClass(styles)}>
            <span className={styles.statIcon}>🏢</span>
            <div>
              <div className={styles.statValue}>{currentOrg.name}</div>
              <div className={styles.statLabel}>Active Organization</div>
            </div>
          </div>
          <div className={statItemClass(styles)}>
            <span className={styles.statIcon}>◫</span>
            <div>
              <div className={styles.statValue}>{currentWorkspace.name}</div>
              <div className={styles.statLabel}>Workspace</div>
            </div>
          </div>
          <div className={statItemClass(styles)}>
            <span className={styles.statIcon}>🛡️</span>
            <div>
              <div className={styles.statValue}>{currentRoleInfo.label}</div>
              <div className={styles.statLabel}>Simulated Role</div>
            </div>
          </div>
          <div className={statItemClass(styles)}>
            <span className={styles.statIcon}>⚡</span>
            <div>
              <div className={styles.statValue}>{selectedProvider.name}</div>
              <div className={styles.statLabel}>Active Model</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className={styles.tabNav} aria-label="Demo environment modules">
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'scenarios' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('scenarios')}
          >
            <span className={styles.tabIcon}>🚀</span>
            <span>Guided Tours</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'gateway' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('gateway')}
          >
            <span className={styles.tabIcon}>⚡</span>
            <span>Model Gateway</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'orgs-workspaces' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('orgs-workspaces')}
          >
            <span className={styles.tabIcon}>🏢</span>
            <span>Orgs & Workspaces</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'rbac' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('rbac')}
          >
            <span className={styles.tabIcon}>🛡️</span>
            <span>RBAC & Security</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'auth' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('auth')}
          >
            <span className={styles.tabIcon}>🔑</span>
            <span>Auth & Identity</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'summary' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <span className={styles.tabIcon}>📋</span>
            <span>Prospect Summary</span>
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <main className={styles.mainContainer}>
        {/* TAB 1: GUIDED TOURS & SCENARIOS */}
        {activeTab === 'scenarios' && (
          <section className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  <span>🎯</span> Enterprise Sales & Evaluator Scenarios
                </h2>
                <p className={styles.cardDesc}>
                  Select a pre-configured customer evaluation journey to test how AI-Pass solves specific architectural and compliance requirements.
                </p>
              </div>
            </div>

            <div className={styles.scenarioGrid}>
              <div
                className={`${styles.scenarioCard} ${selectedProviderId === 'local' ? styles.scenarioCardActive : ''}`}
                onClick={() => launchScenario('sovereign')}
              >
                <div className={styles.scenarioIcon}>🏛️</div>
                <h3 className={styles.scenarioTitle}>Government & Sovereign AI</h3>
                <p className={styles.scenarioDesc}>
                  Demonstrate air-gapped on-premise execution with zero internet egress using local nodes (Ollama / vLLM) for classified defense and government data.
                </p>
                <div className={styles.scenarioBadge}>
                  <span>🔒 Air-Gapped Local Provider</span>
                </div>
              </div>

              <div
                className={`${styles.scenarioCard} ${selectedProviderId === 'anthropic' ? styles.scenarioCardActive : ''}`}
                onClick={() => launchScenario('failover')}
              >
                <div className={styles.scenarioIcon}>🔄</div>
                <h3 className={styles.scenarioTitle}>Multi-Provider Gateway Failover</h3>
                <p className={styles.scenarioDesc}>
                  Test automated failover routing between OpenAI, Claude, and Mistral with unified token accounting and zero vendor lock-in.
                </p>
                <div className={styles.scenarioBadge}>
                  <span>⚡ 99.999% Gateway Uptime</span>
                </div>
              </div>

              <div
                className={`${styles.scenarioCard} ${currentRole === 'admin' ? styles.scenarioCardActive : ''}`}
                onClick={() => launchScenario('rbac')}
              >
                <div className={styles.scenarioIcon}>🛡️</div>
                <h3 className={styles.scenarioTitle}>Granular RBAC & Multi-Tenancy</h3>
                <p className={styles.scenarioDesc}>
                  Switch between Org Owner, Workspace Admin, and Auditor personas to see how permission boundaries isolate keys, billing, and agent actions.
                </p>
                <div className={styles.scenarioBadge}>
                  <span>👥 5 Pre-Built Personas</span>
                </div>
              </div>

              <div
                className={`${styles.scenarioCard} ${selectedProviderId === 'mistral' ? styles.scenarioCardActive : ''}`}
                onClick={() => launchScenario('optimizer')}
              >
                <div className={styles.scenarioIcon}>💶</div>
                <h3 className={styles.scenarioTitle}>EU Sovereign AI & Cost Shield</h3>
                <p className={styles.scenarioDesc}>
                  Route EU client invoices exclusively through Mistral on European soil while applying workspace-level spending limits and caching.
                </p>
                <div className={styles.scenarioBadge}>
                  <span>🇪🇺 100% GDPR & EU AI Act</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                className={styles.executeBtn}
                onClick={() => setActiveTab('gateway')}
              >
                Open Universal Model Gateway →
              </button>
            </div>
          </section>
        )}

        {/* TAB 2: MODEL GATEWAY */}
        {activeTab === 'gateway' && (
          <section className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  <span>⚡</span> Universal Model Gateway Bench
                </h2>
                <p className={styles.cardDesc}>
                  Connect seamlessly to top frontier models and on-premise local providers with real-time routing, telemetry, and sovereignty controls.
                </p>
              </div>
              <div className={styles.badgeInfo}>
                <span>Workspace: {currentWorkspace.name}</span>
              </div>
            </div>

            <div className={styles.gatewayLayout}>
              {/* Provider Selection Column */}
              <div className={styles.providerList}>
                {DEMO_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.providerItem} ${selectedProviderId === p.id ? styles.providerItemActive : ''}`}
                    onClick={() => setSelectedProviderId(p.id)}
                  >
                    <div className={styles.providerTop}>
                      <span className={styles.providerName}>{p.name}</span>
                      <span className={`${styles.providerTag} ${p.tagClass}`}>{p.tag}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#cbd5e1', fontWeight: 600 }}>{p.model}</div>
                    <div className={styles.providerDesc}>{p.description}</div>
                    <div className={styles.providerMetrics}>
                      <span>⚡ {p.latencyMs}ms avg</span>
                      <span>💰 ${p.inputCost1M}/1M</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Playground & Telemetry Column */}
              <div className={styles.benchArea}>
                <div className={styles.promptControl}>
                  <div className={styles.promptLabel}>
                    <span>Prompt Payload:</span>
                    <span style={{ color: '#94a3b8' }}>
                      Target: <strong style={{ color: '#60a5fa' }}>{selectedProvider.name}</strong> ({selectedProvider.model})
                    </span>
                  </div>
                  <textarea
                    className={styles.promptTextarea}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className={styles.actionRow}>
                  <div className={styles.presetPills}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>Presets:</span>
                    <button
                      type="button"
                      className={styles.presetBtn}
                      onClick={() => setPromptInput('Analyze corporate security posture and verify zero data egress.')}
                    >
                      Security Audit
                    </button>
                    <button
                      type="button"
                      className={styles.presetBtn}
                      onClick={() => setPromptInput('Perform automated invoice reconciliation for vendor $42,500.')}
                    >
                      Invoice Parsing
                    </button>
                    <button
                      type="button"
                      className={styles.presetBtn}
                      onClick={() => setPromptInput('Compare inference token cost between OpenAI, Anthropic, and Mistral.')}
                    >
                      Cost Comparison
                    </button>
                  </div>

                  <button
                    type="button"
                    className={styles.executeBtn}
                    onClick={handleExecutePrompt}
                    disabled={isExecuting}
                  >
                    {isExecuting ? 'Streaming from Gateway…' : 'Run via Model Gateway ⚡'}
                  </button>
                </div>

                {/* Output Console & Live Telemetry */}
                <div className={styles.outputConsole}>
                  <div className={styles.consoleHeader}>
                    <span>GATEWAY RESPONSE STREAM</span>
                    <span>SOVEREIGNTY: {selectedProvider.sovereignty}</span>
                  </div>
                  <div className={styles.consoleBody}>
                    {streamedText || 'Click "Run via Model Gateway" to stream live response…'}
                  </div>

                  <div className={styles.telemetryGrid}>
                    <div className={styles.telemetryItem}>
                      <span className={styles.telemetryLabel}>End-to-End Latency</span>
                      <span className={styles.telemetryVal}>{telemetry.latency} ms</span>
                    </div>
                    <div className={styles.telemetryItem}>
                      <span className={styles.telemetryLabel}>Processed Tokens</span>
                      <span className={styles.telemetryVal}>{telemetry.tokens} tokens</span>
                    </div>
                    <div className={styles.telemetryItem}>
                      <span className={styles.telemetryLabel}>Computed Cost</span>
                      <span className={styles.telemetryVal}>${telemetry.costUsd.toFixed(4)}</span>
                    </div>
                    <div className={styles.telemetryItem}>
                      <span className={styles.telemetryLabel}>Security Envelope</span>
                      <span className={styles.telemetryVal}>{telemetry.routeStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: ORGANIZATIONS & WORKSPACES */}
        {activeTab === 'orgs-workspaces' && (
          <section className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  <span>🏢</span> Multi-Tenant Organizations & Workspaces
                </h2>
                <p className={styles.cardDesc}>
                  Isolate teams, budgets, models, and data boundaries by organization accounts and scoped workspaces.
                </p>
              </div>
            </div>

            <div className={styles.orgWorkspaceGrid}>
              {/* Organization Column */}
              <div className={styles.entityCard}>
                <div className={styles.entityHeader}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Company Accounts ({orgs.length})</h3>
                  <span className={styles.badgeInfo}>Organization Tier</span>
                </div>
                <div className={styles.entitySelector}>
                  {orgs.map((org) => (
                    <button
                      key={org.id}
                      type="button"
                      className={`${styles.selectorItem} ${selectedOrgId === org.id ? styles.selectorItemActive : ''}`}
                      onClick={() => {
                        setSelectedOrgId(org.id);
                        setSelectedWorkspaceId(org.workspaces[0]?.id || '');
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{org.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Domain: {org.domain} · {org.region}
                        </div>
                      </div>
                      <span className={styles.badgeSuccess}>{org.type}</span>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '0.5rem', padding: '0.85rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                    Sovereignty & Isolation Rule
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#e2e8f0' }}>{currentOrg.dataSovereignty}</div>
                </div>
              </div>

              {/* Workspace Column */}
              <div className={styles.entityCard}>
                <div className={styles.entityHeader}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    Workspaces in {currentOrg.name} ({currentOrg.workspaces.length})
                  </h3>
                  <button
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => setIsCreatingWs(!isCreatingWs)}
                  >
                    {isCreatingWs ? 'Cancel' : '+ New Workspace'}
                  </button>
                </div>

                {isCreatingWs && (
                  <form onSubmit={handleCreateWorkspace} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="e.g. Sales Revenue OS"
                      value={newWsName}
                      onChange={(e) => setNewWsName(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.6rem 0.8rem',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.8125rem',
                      }}
                    />
                    <button type="submit" className={styles.executeBtn} style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                      Create
                    </button>
                  </form>
                )}

                <div className={styles.entitySelector}>
                  {currentOrg.workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      className={`${styles.selectorItem} ${selectedWorkspaceId === ws.id ? styles.selectorItemActive : ''}`}
                      onClick={() => setSelectedWorkspaceId(ws.id)}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{ws.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ws.description}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#38bdf8', marginTop: 4 }}>
                          Models: {ws.activeModels.join(', ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>{ws.spendLimit}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{ws.teamMembers} members</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className={styles.authSimulateBtn}
                    onClick={() => setActiveTab('rbac')}
                  >
                    Manage Workspace Roles & Permissions →
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: RBAC & SECURITY */}
        {activeTab === 'rbac' && (
          <section className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  <span>🛡️</span> Role-Based Access Control (RBAC) Matrix
                </h2>
                <p className={styles.cardDesc}>
                  Select a user role to see instant permission evaluation across Model Gateway, BYOK Key Vault, and Workspace Administration.
                </p>
              </div>
              <div className={styles.badgeSuccess}>
                <span>Active Scope: {currentOrg.name} / {currentWorkspace.name}</span>
              </div>
            </div>

            {/* Role Selector Pills */}
            <div className={styles.roleSelectorBar}>
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`${styles.rolePill} ${currentRole === role.id ? styles.rolePillActive : ''}`}
                  onClick={() => {
                    setCurrentRole(role.id);
                    setTestedAction(null);
                  }}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>{currentRoleInfo.label}</strong>
                <span className={currentRoleInfo.badgeClass}>{currentRole.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0 }}>{currentRoleInfo.description}</p>
            </div>

            {/* Permissions Table */}
            <div className={styles.rbacTableWrapper}>
              <table className={styles.rbacTable}>
                <thead>
                  <tr>
                    <th>Capability & Permission Key</th>
                    <th>Description</th>
                    <th>Evaluation Status</th>
                    <th>Live Test Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(PERMISSION_METADATA).map(([key, meta]) => {
                    const isAllowed = !!currentRoleInfo.permissions[key];
                    const isBeingTested = testedAction === key;

                    return (
                      <tr key={key}>
                        <td>
                          <strong>{meta.label}</strong>
                          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontFamily: 'monospace' }}>{key}</div>
                        </td>
                        <td style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{meta.desc}</td>
                        <td>
                          <span className={`${styles.rbacPermBadge} ${isAllowed ? styles.permAllowed : styles.permDenied}`}>
                            {isAllowed ? '✓ ALLOWED' : '✕ DENIED'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.presetBtn}
                            onClick={() => setTestedAction(key)}
                          >
                            Simulate Action
                          </button>
                          {isBeingTested && (
                            <div style={{ marginTop: 4, fontSize: '0.75rem', color: isAllowed ? '#34d399' : '#f87171' }}>
                              {isAllowed
                                ? `✓ 200 OK: ${currentRoleInfo.label} executed [${key}]`
                                : `✕ 403 Forbidden: Missing root privilege for [${key}]`}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 5: AUTHENTICATION & IDENTITY */}
        {activeTab === 'auth' && (
          <section className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  <span>🔑</span> Enterprise Authentication & Identity Simulator
                </h2>
                <p className={styles.cardDesc}>
                  Experience real enterprise sign-in workflows including Single Sign-On (SAML/Okta), Passkeys (WebAuthn), and Hardware 2FA.
                </p>
              </div>
            </div>

            <div className={styles.authGrid}>
              <div className={styles.authMethodCard}>
                <div className={styles.authMethodHeader}>
                  <div className={styles.authMethodIcon}>🏢</div>
                  <div>
                    <strong style={{ fontSize: '0.9375rem' }}>Enterprise SSO / SAML 2.0</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Okta, Azure AD, PingFederate</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Auto-provisions users based on corporate directory claims and assigns default workspace roles.
                </p>
                <button
                  type="button"
                  className={styles.authSimulateBtn}
                  onClick={() => {
                    setAuthMethod('sso');
                    setAuthStatusMessage('✓ Authenticated via Okta SSO (Claims: tenant=acme.corp, role=owner)');
                  }}
                >
                  Simulate SSO Sign-In
                </button>
              </div>

              <div className={styles.authMethodCard}>
                <div className={styles.authMethodHeader}>
                  <div className={styles.authMethodIcon}>🔐</div>
                  <div>
                    <strong style={{ fontSize: '0.9375rem' }}>FIDO2 / Passkey (WebAuthn)</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TouchID, FaceID, YubiKey</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Biometric passwordless authentication for high-security zero-trust sovereign access.
                </p>
                <button
                  type="button"
                  className={styles.authSimulateBtn}
                  onClick={() => {
                    setAuthMethod('passkey');
                    setAuthStatusMessage('✓ Authenticated via Hardware Passkey (YubiKey 5 FIPS verified)');
                  }}
                >
                  Simulate Passkey
                </button>
              </div>

              <div className={styles.authMethodCard}>
                <div className={styles.authMethodHeader}>
                  <div className={styles.authMethodIcon}>✉️</div>
                  <div>
                    <strong style={{ fontSize: '0.9375rem' }}>Work Email Magic Link + 2FA</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Time-based OTP & SMS backup</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Cryptographically signed email challenge with mandatory TOTP authenticator verification.
                </p>
                <button
                  type="button"
                  className={styles.authSimulateBtn}
                  onClick={() => {
                    setAuthMethod('magic');
                    setAuthStatusMessage('✓ Authenticated via Work Email + Authenticator TOTP');
                  }}
                >
                  Simulate Magic Link
                </button>
              </div>

              <div className={styles.authMethodCard}>
                <div className={styles.authMethodHeader}>
                  <div className={styles.authMethodIcon}>🌐</div>
                  <div>
                    <strong style={{ fontSize: '0.9375rem' }}>Google Workspace OAuth</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Google Cloud Identity</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Direct federated login connected to the AI-Pass backend authentication system.
                </p>
                <button
                  type="button"
                  className={styles.authSimulateBtn}
                  onClick={() => {
                    setAuthMethod('oauth');
                    setAuthStatusMessage('✓ Authenticated via Google Workspace (ziad@acme.corp)');
                  }}
                >
                  Simulate Google OAuth
                </button>
              </div>
            </div>

            {/* Live JWT Session Claims Inspector */}
            <div style={{ marginTop: '1.5rem', background: '#0b1120', padding: '1.25rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Decoded Enterprise JWT Session Claims
                </span>
                <span className={styles.badgeSuccess}>{authStatusMessage}</span>
              </div>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8125rem', color: '#38bdf8', overflowX: 'auto' }}>
{JSON.stringify(
  {
    sub: 'usr_8921a9c1e0',
    iss: 'https://auth.ai-pass.com',
    org_id: currentOrg.id,
    org_name: currentOrg.name,
    workspace_id: currentWorkspace.id,
    workspace_name: currentWorkspace.name,
    role: currentRole,
    auth_method: authMethod,
    mfa_verified: true,
    sovereign_boundary: currentOrg.dataSovereignty,
    issued_at: new Date().toISOString(),
  },
  null,
  2,
)}
              </pre>
            </div>
          </section>
        )}

        {/* TAB 6: PROSPECT TEST DRIVE SUMMARY */}
        {activeTab === 'summary' && (
          <section className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  <span>📋</span> Prospect Evaluation Scorecard & Test Drive Report
                </h2>
                <p className={styles.cardDesc}>
                  Ready-to-export architectural summary for prospect stakeholders, security teams, and procurement leads.
                </p>
              </div>
              <button
                type="button"
                className={styles.copySummaryBtn}
                onClick={handleCopySummary}
              >
                {copiedSummary ? '✓ Copied to Clipboard!' : '📋 Copy Prospect Report'}
              </button>
            </div>

            <div className={styles.reportGrid}>
              <div className={styles.reportMetric}>
                <div className={styles.reportLabel}>Evaluated Organization</div>
                <div className={styles.reportVal}>{currentOrg.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>{currentOrg.type}</div>
              </div>

              <div className={styles.reportMetric}>
                <div className={styles.reportLabel}>Tested Workspace</div>
                <div className={styles.reportVal}>{currentWorkspace.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>Budget: {currentWorkspace.spendLimit}</div>
              </div>

              <div className={styles.reportMetric}>
                <div className={styles.reportLabel}>RBAC Governance Level</div>
                <div className={styles.reportVal}>{currentRoleInfo.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>8 Permissions Tested</div>
              </div>

              <div className={styles.reportMetric}>
                <div className={styles.reportLabel}>Model Gateway Target</div>
                <div className={styles.reportVal}>{selectedProvider.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>{selectedProvider.model}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f8fafc' }}>
                Key Technical Takeaways Verified During This Demo:
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.8 }}>
                <li>
                  <strong>Zero Vendor Lock-In:</strong> Unified Model Gateway instantly connects to OpenAI, Anthropic, Mistral, and local on-prem providers under a single corporate agreement.
                </li>
                <li>
                  <strong>Sovereign Cloud & Air-Gapped Ready:</strong> Government and defense deployments can run strictly on-premise without transmitting any prompt data to public cloud APIs.
                </li>
                <li>
                  <strong>True Multi-Tenant Isolation:</strong> Data boundaries between organizations and workspaces are cryptographically isolated at the auth and database levels.
                </li>
                <li>
                  <strong>Enterprise RBAC & Auditability:</strong> Fine-grained permissions and immutable presence ledgers simplify SOC2, HIPAA, and EU AI Act compliance.
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <Link href="/signup" className={styles.executeBtn} style={{ textDecoration: 'none' }}>
                Start Free Enterprise Pilot →
              </Link>
              <Link href="/workspace" className={styles.copySummaryBtn} style={{ background: 'rgba(255,255,255,0.1)', textDecoration: 'none' }}>
                Open Workspace Dashboard
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function statItemClass(styles: Record<string, string>) {
  return styles.statItem;
}
