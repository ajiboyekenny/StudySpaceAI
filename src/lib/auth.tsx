import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigReady } from '@/lib/supabaseClient';
import { syncStudyData } from '@/lib/cloudStudySync';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function describeAuthError(message: string): string {
  if (/invalid login credentials|invalid email or password/i.test(message)) {
    return 'That email and password do not match an account. Try again or sign up.';
  }
  if (/already registered|user already registered/i.test(message)) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (/rate limit|too many/i.test(message)) {
    return 'Too many attempts in a short time. Please wait a moment and try again.';
  }
  if (/network|fetch|failed to fetch/i.test(message)) {
    return 'We could not reach the server. Check your connection and try again.';
  }
  if (/password/i.test(message) && /weak|short|at least/i.test(message)) {
    return 'Please choose a stronger password (at least 6 characters).';
  }
  return message || 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      if (!supabaseConfigReady) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session);
        setLoading(false);
        if (data.session) void syncStudyData();
      } catch {
        if (!mounted) return;
        setLoading(false);
      }
    };
    void loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
      if (newSession) {
        (async () => {
          await syncStudyData();
        })();
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      async signUp(email, password) {
        if (!supabaseConfigReady) return { error: 'The account service is not connected in this preview yet. Please reopen the published app and try again.' };
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) return { error: describeAuthError(error.message) };
        return { error: null };
      },
      async signIn(email, password) {
        if (!supabaseConfigReady) return { error: 'The account service is not connected in this preview yet. Please reopen the published app and try again.' };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: describeAuthError(error.message) };
        return { error: null };
      },
      async signOut() {
        await supabase.auth.signOut();
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
