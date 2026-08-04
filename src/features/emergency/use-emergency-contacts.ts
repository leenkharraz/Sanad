"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_EMERGENCY_CONTACTS, type EmergencyContact } from "@/types/emergency";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

function createId() {
  return `ec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(DEFAULT_EMERGENCY_CONTACTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = readStorage<EmergencyContact[]>(STORAGE_KEYS.emergencyContacts);
    if (stored && stored.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContacts(stored);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    writeStorage(STORAGE_KEYS.emergencyContacts, contacts);
  }, [contacts, isLoaded]);

  const addContact = useCallback((name: string, relationship: string, phone: string) => {
    setContacts((prev) => [...prev, { id: createId(), name, relationship, phone }]);
  }, []);

  const updateContact = useCallback(
    (id: string, patch: Partial<Omit<EmergencyContact, "id">>) => {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    []
  );

  const deleteContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { contacts, isLoaded, addContact, updateContact, deleteContact };
}
