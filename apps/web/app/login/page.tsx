'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { authApiUrl, authCallbackQuery } from '@/lib/auth-api';
import { useApp } from '../components/premium/AppProviders';
import { PremiumNav } from '../components/premium/PremiumNav';
import styles from '../auth/auth-styles.module.css';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/workspace';
  const queryError = searchParams.get('error');
  const { signIn } = useApp();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(
    queryError ? 'Sign-in failed. Please verify your credentials and try again.' : null
  );
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    setGeneralError(null);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setGeneralError('Please enter your email and password to log in.');
      return;
    }

    setLoading(true);
    setGeneralError(null);

    try {
      const res = await fetch(authApiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          remember: true,
          callback: callbackUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg =
          data.error ||
          (data.errors && Object.values(data.errors).flat().join(' ')) ||
          data.message ||
          'Invalid email or password. Please check your credentials and try again.';
        setGeneralError(errorMsg);
        setLoading(false);
        return;
      }

      if (data.user) {
        const name = data.user.name?.trim() || data.user.email?.split('@')[0] || 'User';
        signIn({
          id: data.user.id || String(Date.now()),
          name,
          email: data.user.email || formData.email.trim(),
          avatarInitials: name.slice(0, 2).toUpperCase(),
          avatarUrl: data.user.avatarUrl,
          plan: 'free',
          workspace: 'default',
          onboarded: true,
        });
      }

      router.push('/workspace');
    } catch {
      setGeneralError('Unable to connect to the authentication server. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setOauthLoading(true);
    window.location.href = authApiUrl(`/auth/google${authCallbackQuery(callbackUrl)}`);
  };

  return (
    <div className={styles.page}>
      <PremiumNav variant="landing" />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.badge}>Secure sign-in</div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in with email or OAuth to access your AI-Pass workspace.
          </p>

          {generalError && (
            <div className={styles.errorBanner} role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                />
              </div>
              {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.label}>
                <label htmlFor="password">Password</label>
                <Link href={authApiUrl('/auth/forgot-password')} style={{ fontSize: '0.75rem', color: '#818cf8', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
                />
                <button
                  type="button"
                  className={styles.togglePasswordBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or sign in with</span>
          </div>

          <div className={styles.oauthGrid}>
            <button
              type="button"
              className={styles.oauthBtn}
              onClick={handleGoogleSignIn}
              disabled={oauthLoading}
            >
              <GoogleIcon />
              {oauthLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>
          </div>

          <p className={styles.footerHint}>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>

          <p className={styles.legal}>
            By continuing, you agree to AI-Pass terms of service and privacy policy.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.page} style={{ minHeight: '100vh' }} />}>
      <LoginContent />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
