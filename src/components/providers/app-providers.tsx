"use client";

import { PreferencesProvider } from "@/components/providers/preferences-provider";
import { SessionProvider } from "@/components/providers/session-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      <SessionProvider>{children}</SessionProvider>
    </PreferencesProvider>
  );
}
