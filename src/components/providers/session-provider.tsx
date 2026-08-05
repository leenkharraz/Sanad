"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthSession, SanadUser } from "@/types/user";
import { STORAGE_KEYS, clearStorage, readStorage, writeStorage } from "@/lib/storage";

interface SessionContextValue {
  session: AuthSession | null;
  isLoaded: boolean;
  signIn: (user: SanadUser) => void;
  signOut: () => void;
  updateUser: (patch: Partial<Omit<SanadUser, "id" | "isDemo">>) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage, which does not exist during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(readStorage<AuthSession>(STORAGE_KEYS.session));
    setIsLoaded(true);
  }, []);

  const signIn = useCallback((user: SanadUser) => {
    const next: AuthSession = { user, createdAt: new Date().toISOString() };
    setSession(next);
    writeStorage(STORAGE_KEYS.session, next);
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    clearStorage(STORAGE_KEYS.session);
  }, []);

  /** Updates the currently signed-in user's cached identity (e.g. a profile
   * name edit) so the whole app reflects it immediately, without requiring
   * a re-login. Callers are responsible for also syncing the persisted
   * account record (see accounts-store.ts) for real (non-demo) accounts. */
  const updateUser = useCallback((patch: Partial<Omit<SanadUser, "id" | "isDemo">>) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next: AuthSession = { ...prev, user: { ...prev.user, ...patch } };
      writeStorage(STORAGE_KEYS.session, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ session, isLoaded, signIn, signOut, updateUser }),
    [session, isLoaded, signIn, signOut, updateUser]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
