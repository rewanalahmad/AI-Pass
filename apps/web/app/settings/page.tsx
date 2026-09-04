'use client';

import { Badge, Card, Button } from '@ai-pass/ui';
import { BusinessShell } from '../components/business/BusinessShell';
import { useApp, type ThemeMode } from '../components/premium/AppProviders';
import styles from './settings.module.css';

const AI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral' },
];

export default function SettingsPage() {
  const { user, updateUser, theme, setTheme, apiKey, setApiKey, aiModel, setAiModel } = useApp();

  return (
    <BusinessShell title="Settings & Profile" subtitle="Manage your account, preferences, and integrations">
      <div className={styles.grid}>
        <Card variant="glass" padding="lg" className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <div className={styles.profileRow}>
            <div className={styles.avatar}>{user?.avatarInitials}</div>
            <div>
              <div className={styles.profileName}>{user?.name}</div>
              <div className={styles.profileEmail}>{user?.email}</div>
              <Badge variant={user?.plan === 'pro' ? 'pro' : user?.plan === 'enterprise' ? 'enterprise' : 'default'}>
                {user?.plan ?? 'free'} plan
              </Badge>
            </div>
          </div>
          <label className={styles.field}>
            <span>Display name</span>
            <input
              className={styles.input}
              value={user?.name ?? ''}
              onChange={(e) => updateUser({ name: e.target.value })}
            />
          </label>
          <label className={styles.field}>
            <span>Workspace</span>
            <input
              className={styles.input}
              value={user?.workspace ?? ''}
              onChange={(e) => updateUser({ workspace: e.target.value })}
            />
          </label>
        </Card>

        <Card variant="glass" padding="lg" className={styles.section}>
          <h2 className={styles.sectionTitle}>Appearance</h2>
          <p className={styles.sectionDesc}>Choose your preferred color theme.</p>
          <div className={styles.themeRow}>
            {(['dark', 'light', 'system'] as ThemeMode[]).map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.themeBtn} ${theme === t ? styles.themeBtnActive : ''}`}
                onClick={() => setTheme(t)}
              >
                {t === 'dark' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : t === 'light' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                )}
                <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card variant="glass" padding="lg" className={styles.section}>
          <h2 className={styles.sectionTitle}>AI Model</h2>
          <p className={styles.sectionDesc}>Default model for agents and platform chat.</p>
          <label className={styles.field}>
            <span>Model</span>
            <select className={styles.input} value={aiModel} onChange={(e) => setAiModel(e.target.value)}>
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
              ))}
            </select>
          </label>
        </Card>

        <Card variant="glass" padding="lg" className={styles.section}>
          <h2 className={styles.sectionTitle}>API Keys</h2>
          <p className={styles.sectionDesc}>Stored locally in your browser. Never committed to source control.</p>
          <label className={styles.field}>
            <span>OpenAI / compatible API key</span>
            <input
              className={styles.input}
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </label>
          <Button variant="primary" size="sm" onClick={() => setApiKey(apiKey)}>
            Save key
          </Button>
        </Card>

        <Card variant="gradient" padding="lg" className={styles.section}>
          <h2 className={styles.sectionTitle}>Team workspace</h2>
          <p className={styles.sectionDesc}>
            Invite teammates, share solutions, and manage roles. Available on Pro and Enterprise.
          </p>
          <Badge variant="pro">Pro feature</Badge>
          <div style={{ marginTop: 16 }}>
            <Button variant="secondary" size="sm" disabled>
              Invite members (coming soon)
            </Button>
          </div>
        </Card>
      </div>
    </BusinessShell>
  );
}
