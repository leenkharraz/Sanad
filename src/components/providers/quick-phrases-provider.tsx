"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_QUICK_PHRASES, type QuickPhrase } from "@/types/quick-phrase";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

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
  const [phrases, setPhrases] = useState<QuickPhrase[]>(DEFAULT_QUICK_PHRASES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = readStorage<QuickPhrase[]>(STORAGE_KEYS.quickPhrases);
    if (stored && stored.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhrases(stored);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    writeStorage(STORAGE_KEYS.quickPhrases, phrases);
  }, [phrases, isLoaded]);

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
