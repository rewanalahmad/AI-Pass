'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '@/lib/auth-api';
import { PremiumNav } from '../components/premium/PremiumNav';
import styles from '../auth/auth-styles.module.css';

const COUNTRY_OPTIONS = [
  'United States',
  'United Kingdom',
  'Canada',
  'France',
  'Germany',
  'Australia',
  'Japan',
  'United Arab Emirates',
  'Saudi Arabia',
  'Egypt',
  'Morocco',
  'Algeria',
  'Tunisia',
  'Brazil',
  'India',
  'Other',
];

const PHONE_PREFIXES = [
  { code: '+1', country: '+1 US/CA' },
  { code: '+44', country: '+44 UK' },
  { code: '+33', country: '+33 FR' },
  { code: '+49', country: '+49 DE' },
  { code: '+971', country: '+971 UAE' },
  { code: '+966', country: '+966 KSA' },
  { code: '+20', country: '+20 EG' },
  { code: '+212', country: '+212 MA' },
  { code: '+213', country: '+213 DZ' },
  { code: '+216', country: '+216 TN' },
  { code: '+91', country: '+91 IN' },
  { code: '+81', country: '+81 JP' },
  { code: '+55', country: '+55 BR' },
  { code: '+61', country: '+61 AU' },
  { code: '+34', country: '+34 ES' },
  { code: '+39', country: '+39 IT' },
  { code: '+86', country: '+86 CN' },
  { code: '+7', country: '+7 RU' },
  { code: '+41', country: '+41 CH' },
  { code: '+31', country: '+31 NL' },
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/workspace';

  const [formData, setFormData] = useState({
    username: '',
    lastName: '',
    email: '',
    origin: '',
    phonePrefix: '+1',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.username.trim()) {
      errors.username = 'First name or username is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    if (!formData.origin.trim()) {
      errors.origin = 'Please select your country of origin';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone.trim())) {
      errors.phone = 'Phone number must contain digits only';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 12) {
      errors.password = 'Password must be at least 12 characters';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setGeneralError('Please fill out all required fields correctly.');
      return;
    }

    setLoading(true);
    setGeneralError(null);

    const fullName = `${formData.username.trim()} ${formData.lastName.trim()}`;

    try {
      // 1. Create account via backend auth API
      await signUpWithEmail(fullName, formData.email.trim(), formData.password);

      // 2. Sign in to establish the session cookie
      try {
        await signInWithEmail(formData.email.trim(), formData.password);
      } catch {
        // Fallback or ignore if session handled
      }

      // 3. Direct to workspace
      router.push(callbackUrl);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setGeneralError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setOauthLoading(true);
    setGeneralError(null);
    try {
      await signInWithGoogle(callbackUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-up failed. Please try again.';
      setGeneralError(msg);
      setOauthLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <PremiumNav variant="landing" />

      <main className={styles.main}>
        <div className={styles.card} style={{ width: 'min(100%, 520px)' }}>
          <div className={styles.badge}>Create Account</div>
          <h1 className={styles.title}>Join AI-Pass</h1>
          <p className={styles.subtitle}>
            Register now to get access to your unified AI workspace.
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
            {/* Username & Last Name */}
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label htmlFor="username" className={styles.label}>Name / Username</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    className={`${styles.input} ${fieldErrors.username ? styles.inputError : ''}`}
                  />
                </div>
                {fieldErrors.username && <span className={styles.fieldError}>{fieldErrors.username}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`${styles.input} ${fieldErrors.lastName ? styles.inputError : ''}`}
                  />
                </div>
                {fieldErrors.lastName && <span className={styles.fieldError}>{fieldErrors.lastName}</span>}
              </div>
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                />
              </div>
              {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
            </div>

            {/* Origin (Country) */}
            <div className={styles.fieldGroup}>
              <label htmlFor="origin" className={styles.label}>Country</label>
              <select
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className={`${styles.select} ${fieldErrors.origin ? styles.inputError : ''}`}
              >
                <option value="">Select country...</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {fieldErrors.origin && <span className={styles.fieldError}>{fieldErrors.origin}</span>}
            </div>

            {/* Phone Number with Prefix */}
            <div className={styles.fieldGroup}>
              <label htmlFor="phone" className={styles.label}>Phone Number</label>
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <select
                  id="phonePrefix"
                  name="phonePrefix"
                  value={formData.phonePrefix}
                  onChange={handleChange}
                  className={styles.select}
                  style={{ width: '100px', flexShrink: 0, paddingLeft: '0.625rem', paddingRight: '1.5rem', fontSize: '0.8125rem' }}
                >
                  {PHONE_PREFIXES.map((p) => (
                    <option key={p.code + p.country} value={p.code}>{p.country}</option>
                  ))}
                </select>
                <div className={styles.inputWrapper} style={{ flex: 1 }}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="555019900"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ''}`}
                  />
                </div>
              </div>
              {fieldErrors.phone && <span className={styles.fieldError}>{fieldErrors.phone}</span>}
            </div>

            {/* Password & Confirm Password */}
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 12 characters"
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

              <div className={styles.fieldGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Min 12 characters"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ''}`}
                  />
                  <button
                    type="button"
                    className={styles.togglePasswordBtn}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>}
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Creating Account…' : 'Sign Up'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or sign up with</span>
          </div>

          <div className={styles.oauthGrid}>
            <button
              type="button"
              className={styles.oauthBtn}
              onClick={handleGoogleSignUp}
              disabled={oauthLoading}
            >
              <GoogleIcon />
              {oauthLoading ? 'Connecting…' : 'Sign up with Google'}
            </button>
          </div>

          <p className={styles.footerHint}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>

          <p className={styles.legal}>
            By creating an account, you agree to AI-Pass terms of service and privacy policy.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className={styles.page} style={{ minHeight: '100vh' }} />}>
      <SignupContent />
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
