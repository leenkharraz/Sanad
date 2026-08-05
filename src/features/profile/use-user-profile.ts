"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/components/providers/session-provider";
import { STORAGE_KEYS, readStorage, writeStorage, scopedKey, GUEST_SCOPE } from "@/lib/storage";
import { DEFAULT_PROFILE, type SanadProfile } from "@/types/profile";

/** Per-account extended profile (blood type, allergies, etc.) — scoped by
 * the signed-in user's id so switching accounts can never leak one user's
 * data into another's. Only meaningful once signed in. */
export function useUserProfile() {
  const { session, isLoaded: sessionLoaded } = useSession();
  const scope = session?.user.id ?? GUEST_SCOPE;
  const [profile, setProfile] = useState<SanadProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const hydratedScopeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionLoaded || !session) return;
    if (hydratedScopeRef.current === scope) return;
    hydratedScopeRef.current = scope;
    const stored = readStorage<SanadProfile>(scopedKey(STORAGE_KEYS.profiles, scope));
    setProfile(stored ? { ...DEFAULT_PROFILE, ...stored } : DEFAULT_PROFILE);
    setIsLoaded(true);
  }, [scope, sessionLoaded, session]);

  useEffect(() => {
    if (!isLoaded || !session) return;
    writeStorage(scopedKey(STORAGE_KEYS.profiles, scope), profile);
  }, [profile, isLoaded, scope, session]);

  const updateProfile = useCallback((patch: Partial<SanadProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  return { profile, isLoaded, updateProfile };
}
