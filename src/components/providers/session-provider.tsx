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

  const value = useMemo(
    () => ({ session, isLoaded, signIn, signOut }),
    [session, isLoaded, signIn, signOut]
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
