"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_EMERGENCY_CONTACTS, type EmergencyContact } from "@/types/emergency";
import { STORAGE_KEYS, readStorage, writeStorage, scopedKey, GUEST_SCOPE } from "@/lib/storage";
import { useSession } from "@/components/providers/session-provider";
import { useNotifications } from "@/components/providers/notifications-provider";

export function useEmergencyContacts() {
  const { session, isLoaded: sessionLoaded } = useSession();
  const { addNotification } = useNotifications();
  const scope = session?.user.id ?? GUEST_SCOPE;
  const [contacts, setContacts] = useState<EmergencyContact[]>(DEFAULT_EMERGENCY_CONTACTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const hydratedScopeRef = useRef<string | null>(null);

  useEffect(() => {
    // Per-account — this screen is only reachable signed in, so this is
    // purely about isolation: switching accounts must never show the
    // previous user's trusted contacts.
    if (!sessionLoaded) return;
    if (hydratedScopeRef.current === scope) return;
    hydratedScopeRef.current = scope;

    const stored = readStorage<EmergencyContact[]>(scopedKey(STORAGE_KEYS.emergencyContacts, scope));
    setContacts(stored && stored.length > 0 ? stored : DEFAULT_EMERGENCY_CONTACTS);
    setIsLoaded(true);
  }, [scope, sessionLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    writeStorage(scopedKey(STORAGE_KEYS.emergencyContacts, scope), contacts);
  }, [contacts, isLoaded, scope]);

  const addContact = useCallback(
    (name: string, relationship: string, phone: string) => {
      setContacts((prev) => [...prev, { id: `ec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, name, relationship, phone }]);
      addNotification("emergencyContactAdded", { name });
    },
    [addNotification]
  );

  const updateContact = useCallback(
    (id: string, patch: Partial<Omit<EmergencyContact, "id">>) => {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    []
  );

  const deleteContact = useCallback(
    (id: string) => {
      // Looked up from the current `contacts` state (not inside the setState
      // updater) so the notification fires exactly once even under
      // StrictMode's double-invoke of updater functions in development.
      const removed = contacts.find((c) => c.id === id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (removed) addNotification("emergencyContactRemoved", { name: removed.name });
    },
    [contacts, addNotification]
  );

  return { contacts, isLoaded, addContact, updateContact, deleteContact };
}
