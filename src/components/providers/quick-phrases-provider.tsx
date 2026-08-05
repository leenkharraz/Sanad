"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DEFAULT_QUICK_PHRASES, type QuickPhrase } from "@/types/quick-phrase";
import { STORAGE_KEYS, readStorage, writeStorage, scopedKey, GUEST_SCOPE } from "@/lib/storage";
import { useSession } from "@/components/providers/session-provider";

interface QuickPhrasesContextValue {
  phrases: QuickPhrase[];
  isLoaded: boolean;
  addPhrase: (text: string) => void;
  updatePhrase: (id: string, text: string) => void;
  deletePhrase: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const QuickPhrasesContext = createContext<QuickPhrasesContextValue | null>(null);

function createId() {
  return `qp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function QuickPhrasesProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoaded: sessionLoaded } = useSession();
  const scope = session?.user.id ?? GUEST_SCOPE;
  const [phrases, setPhrases] = useState<QuickPhrase[]>(DEFAULT_QUICK_PHRASES);
  const [isLoaded, setIsLoaded] = useState(false);
  const hydratedScopeRef = useRef<string | null>(null);

  useEffect(() => {
    // Per-account, like preferences — this screen is only reachable signed
    // in, so there's no guest-seeding concern here, just isolation between
    // accounts (switching users must never show the previous user's phrases).
    if (!sessionLoaded) return;
    if (hydratedScopeRef.current === scope) return;
    hydratedScopeRef.current = scope;

    const stored = readStorage<QuickPhrase[]>(scopedKey(STORAGE_KEYS.quickPhrases, scope));
    setPhrases(stored && stored.length > 0 ? stored : DEFAULT_QUICK_PHRASES);
    setIsLoaded(true);
  }, [scope, sessionLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    writeStorage(scopedKey(STORAGE_KEYS.quickPhrases, scope), phrases);
  }, [phrases, isLoaded, scope]);

  const addPhrase = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPhrases((prev) => [...prev, { id: createId(), text: trimmed, favorite: false }]);
  }, []);

  const updatePhrase = useCallback((id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPhrases((prev) => prev.map((p) => (p.id === id ? { ...p, text: trimmed } : p)));
  }, []);

  const deletePhrase = useCallback((id: string) => {
    setPhrases((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setPhrases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  }, []);

  const value = useMemo(
    () => ({ phrases, isLoaded, addPhrase, updatePhrase, deletePhrase, toggleFavorite }),
    [phrases, isLoaded, addPhrase, updatePhrase, deletePhrase, toggleFavorite]
  );

  return (
    <QuickPhrasesContext.Provider value={value}>{children}</QuickPhrasesContext.Provider>
  );
}

export function useQuickPhrases(): QuickPhrasesContextValue {
  const context = useContext(QuickPhrasesContext);
  if (!context) {
    throw new Error("useQuickPhrases must be used within a QuickPhrasesProvider");
  }
  return context;
}
