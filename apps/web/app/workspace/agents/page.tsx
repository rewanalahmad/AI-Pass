'use client';

import React, { useState } from 'react';
import styles from './agents-hub.module.css';

interface AgentCardData {
  id: string;
  name: string;
  badge: 'Active' | 'Draft';
  description: string;
  modelOrDeployment: string;
  runsText: string;
}

const AGENTS: AgentCardData[] = [
  {
    id: 'doc-analyst',
    name: 'Document Analyst Agent',
    badge: 'Active',
    description: 'Reads incoming documents (invoices, contracts, forms), extracts key details, flags anything needing review.',
    modelOrDeployment: 'Claude',
    runsText: '89 runs this week',
  },
  {
    id: 'ent-knowledge',
    name: 'Enterprise Knowledge Agent',
    badge: 'Draft',
    description: "Answers customer questions using our knowledge base, escalates anything it can't resolve to a human.",
    modelOrDeployment: 'Not Deployed',
    runsText: '0 runs this week',
  },
];

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft'>('all');

  const filteredAgents = AGENTS.filter((agent) => {
    if (activeTab === 'active') return agent.badge === 'Active';
    if (activeTab === 'draft') return agent.badge === 'Draft';
    return true;
  });

  return (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Agents</h1>
        <p className={styles.subtitle}>
          Every agent your organization has built. Deploy, edit, or monitor them here.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className={styles.tabsList}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All (3)
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active (2)
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'draft' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          Draft (1)
        </button>
      </div>

      {/* Cards Grid */}
      <div className={styles.cardsGrid}>
        {filteredAgents.map((agent) => (
          <div key={agent.id} className={styles.agentCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{agent.name}</h3>
              <span
                className={
                  agent.badge === 'Active' ? styles.badgeActive : styles.badgeDraft
                }
              >
                {agent.badge}
              </span>
            </div>

            <p className={styles.cardDesc}>{agent.description}</p>

            <div className={styles.cardDivider} />

            <div className={styles.cardMeta}>
              <span>{agent.modelOrDeployment}</span>
              <span>{agent.runsText}</span>
            </div>

            <div className={styles.cardActions}>
              <button type="button" className={styles.actionBtn}>
                Edit
              </button>
              <button type="button" className={styles.actionBtn}>
                View Logs
              </button>
              <button type="button" className={styles.iconActionBtn} aria-label="More options">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Build New Agent Card */}
        {(activeTab === 'all' || activeTab === 'active') && (
          <div className={styles.createCard} role="button" tabIndex={0}>
            <span className={styles.createIcon}>+</span>
            <span className={styles.createLabel}>Build New Agent</span>
          </div>
        )}
      </div>
    </div>
  );
}
