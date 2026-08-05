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
import {
  NOTIFICATION_CATEGORY,
  type NotificationType,
  type SanadNotification,
} from "@/types/notification";
import { STORAGE_KEYS, readStorage, writeStorage, scopedKey, GUEST_SCOPE } from "@/lib/storage";
import { useSession } from "@/components/providers/session-provider";
import { usePreferences } from "@/components/providers/preferences-provider";

interface NotificationsContextValue {
  notifications: SanadNotification[];
  isLoaded: boolean;
  unreadCount: number;
  addNotification: (type: NotificationType, params?: Record<string, string>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function createId() {
  return `ntf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoaded: sessionLoaded } = useSession();
  const { preferences } = usePreferences();
  const scope = session?.user.id ?? GUEST_SCOPE;
  const [notifications, setNotifications] = useState<SanadNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hydratedScopeRef = useRef<string | null>(null);

  useEffect(() => {
    // Per-account, like trusted contacts and quick phrases — switching
    // accounts must never show the previous user's notifications.
    if (!sessionLoaded || !session) return;
    if (hydratedScopeRef.current === scope) return;
    hydratedScopeRef.current = scope;

    const stored = readStorage<SanadNotification[]>(scopedKey(STORAGE_KEYS.notifications, scope));
    setNotifications(stored ?? []);
    setIsLoaded(true);
  }, [scope, sessionLoaded, session]);

  useEffect(() => {
    if (!isLoaded || !session) return;
    writeStorage(scopedKey(STORAGE_KEYS.notifications, scope), notifications);
  }, [notifications, isLoaded, scope, session]);

  const addNotification = useCallback(
    (type: NotificationType, params?: Record<string, string>) => {
      const category = NOTIFICATION_CATEGORY[type];
      // Respects the user's own notification preferences — a disabled
      // category never generates a notification in the first place, rather
      // than generating one and hiding it.
      if (!preferences.notificationPreferences[category]) return;
      setNotifications((prev) => [
        { id: createId(), type, params, createdAt: new Date().toISOString(), read: false },
        ...prev,
      ]);
    },
    [preferences.notificationPreferences]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => (n.read ? n : { ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      isLoaded,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }),
    [notifications, isLoaded, unreadCount, addNotification, markAsRead, markAllAsRead, deleteNotification]
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
