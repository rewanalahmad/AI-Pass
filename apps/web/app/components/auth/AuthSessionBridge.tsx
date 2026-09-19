'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { initialsFromName } from '@ai-pass/auth-core';
import type { PlanTier } from '@ai-pass/ui';
import { getSession as getBetterAuthSession } from '@/lib/auth-api';
import { useApp, type UserProfile } from '../premium/AppProviders';

function profileFromSession(session: NonNullable<ReturnType<typeof useSession>['data']>): UserProfile {
  const name = session.user?.name ?? session.user?.email ?? 'User';
  const email = session.user?.email ?? '';
  return {
    id: session.user?.id ?? session.authSession?.userId ?? 'user',
    name,
    email,
    avatarInitials: initialsFromName(session.user?.name, session.user?.email),
    avatarUrl: session.user?.image ?? session.authSession?.image,
    plan: 'free',
    workspace: 'My Workspace',
    onboarded: true,
  };
}

function profileFromBetterAuth(data: {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}): UserProfile {
  const name = data.user.name?.trim() || data.user.email.split('@')[0] || 'User';
  return {
    id: data.user.id,
    name,
    email: data.user.email,
    avatarInitials: initialsFromName(name, data.user.email),
    avatarUrl: data.user.image ?? undefined,
    plan: 'free',
    workspace: 'My Workspace',
    onboarded: true,
  };
}

/** Keeps AppProviders user state aligned with NextAuth and Better Auth sessions. */
export function AuthSessionBridge() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { user, signIn, signOut, updateUser } = useApp();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      const next = profileFromSession(session);
      if (
        !user ||
        user.id !== next.id ||
        user.email !== next.email ||
        user.name !== next.name ||
        user.avatarUrl !== next.avatarUrl ||
        user.plan !== next.plan
      ) {
        signIn(next);
      }
      return;
    }

    let cancelled = false;
    getBetterAuthSession()
      .then((betterAuthData) => {
        if (cancelled) return;
        if (betterAuthData?.user) {
          const next = profileFromBetterAuth(betterAuthData);
          if (
            !user ||
            user.id !== next.id ||
            user.email !== next.email ||
            user.name !== next.name ||
            user.avatarUrl !== next.avatarUrl ||
            user.plan !== next.plan
          ) {
            signIn(next);
          }
        } else if (user) {
          signOut();
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (user) signOut();
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, session, status, user, signIn, signOut]);

  useEffect(() => {
    const userId = session?.user?.id ?? session?.authSession?.userId;
    if (status !== 'authenticated' || !userId) return;

    let cancelled = false;
    fetch('/api/v1/user/bootstrap')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { tier?: string; plan?: PlanTier } | null) => {
        if (cancelled || !data?.plan) return;
        updateUser({ plan: data.plan });
      })
      .catch(() => { });

    return () => {
      cancelled = true;
    };
  }, [session, status, updateUser]);

  return null;
}
