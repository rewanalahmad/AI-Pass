/**
 * Auth API Client for @ai-pass/api-server backend (Better Auth).
 */

export const AUTH_API_BASE = (
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:4000'
).replace(/\/$/, '');

export async function signUpWithEmail(name: string, email: string, password: string) {
  const res = await fetch(`${AUTH_API_BASE}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error?.message || 'Registration failed.');
  }
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const res = await fetch(`${AUTH_API_BASE}/api/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error?.message || 'Invalid email or password.');
  }
  return data;
}

export async function signInWithGoogle(callbackURL: string = '/workspace') {
  const res = await fetch(`${AUTH_API_BASE}/api/auth/sign-in/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ provider: 'google', callbackURL }),
  });

  const data = await res.json().catch(() => ({}));
  if (data?.url) {
    window.location.href = data.url;
    return;
  }
  if (!res.ok) {
    throw new Error(data?.message || data?.error?.message || 'Google sign-in failed.');
  }
  return data;
}

export async function getSession() {
  const res = await fetch(`${AUTH_API_BASE}/api/auth/get-session`, {
    credentials: 'include',
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

export async function signOut() {
  await fetch(`${AUTH_API_BASE}/api/auth/sign-out`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {});
}
