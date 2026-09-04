'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { PremiumNav } from '../components/premium/PremiumNav';
import styles from '../auth/auth-styles.module.css';

function TwoFactorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/workspace';
  const emailParam = searchParams.get('email') || 'your registered email';

  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [trustDevice, setTrustDevice] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split('');
    setPin(digits);
    setError(null);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = pin.join('');

    if (code.length < 6) {
      setError('Please enter the full 6-digit security code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, method: 'email', trustDevice }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid 2FA code. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1200);
    } catch {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    if (!canResend) return;
    setPin(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    setError(null);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className={styles.page}>
      <PremiumNav variant="landing" />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.badge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email 2FA Verification
          </div>

          <h1 className={styles.title}>2FA Verification</h1>
          <p className={styles.subtitle}>
            We sent a 6-digit security code to <strong style={{ opacity: 0.95 }}>{emailParam}</strong>. Please enter it below to complete log in.
          </p>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
              textAlign: 'center',
              margin: '1.5rem 0'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 0.5rem' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem', fontWeight: 600 }}>Identity Verified!</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>Navigating to your workspace…</p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className={styles.form}>
              <div className={styles.pinContainer}>
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={styles.pinInput}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <label className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                />
                <span>Trust this browser for 30 days</span>
              </label>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Logging in…' : 'Log In'}
              </button>

              <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', opacity: 0.8 }}>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Resend Email Code
                  </button>
                ) : (
                  <span>Resend code in <strong style={{ opacity: 0.95 }}>{resendTimer}s</strong></span>
                )}
              </div>
            </form>
          )}

          <p className={styles.footerHint}>
            Having trouble? <Link href="/login">Back to Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense fallback={<div className={styles.page} style={{ minHeight: '100vh' }} />}>
      <TwoFactorContent />
    </Suspense>
  );
}
