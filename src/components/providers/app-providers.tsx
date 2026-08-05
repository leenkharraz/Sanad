"use client";

import { PreferencesProvider } from "@/components/providers/preferences-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { QuickPhrasesProvider } from "@/components/providers/quick-phrases-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PreferencesProvider>
        <QuickPhrasesProvider>{children}</QuickPhrasesProvider>
      </PreferencesProvider>
    </SessionProvider>
  );
}
