"use client";

import { TriangleAlert, Ear, Glasses, Info, Trash2, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/providers/notifications-provider";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import { NOTIFICATION_CATEGORY, type SanadNotification } from "@/types/notification";
import { formatNotificationTime } from "@/features/notifications/notification-time";

const CATEGORY_ICON = {
  safety: TriangleAlert,
  accessibility: Ear,
  device: Glasses,
  general: Info,
} as const;

const CATEGORY_ACCENT = {
  safety: "bg-danger-soft text-danger",
  accessibility: "bg-accent-hearing text-brand-700",
  device: "bg-accent-secondary text-brand-700",
  general: "bg-surface-soft text-text-secondary",
} as const;

function NotificationRow({ notification }: { notification: SanadNotification }) {
  const { t } = useTranslation();
  const { markAsRead, deleteNotification } = useNotifications();
  const category = NOTIFICATION_CATEGORY[notification.type];
  const Icon = CATEGORY_ICON[category];
  const titleKey = `notifications.types.${notification.type}.title` as TranslationKey;
  const descriptionKey = `notifications.types.${notification.type}.description` as TranslationKey;

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 transition-colors",
        !notification.read && "bg-surface-soft"
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", CATEGORY_ACCENT[category])}>
        <Icon aria-hidden="true" className="size-4.5" />
      </span>
      <button
        type="button"
        onClick={() => !notification.read && markAsRead(notification.id)}
        className="min-w-0 flex-1 text-start"
      >
        <div className="flex items-center gap-1.5">
          {!notification.read && (
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand-700" />
          )}
          <p className="truncate text-sm font-semibold text-text-primary">{t(titleKey)}</p>
        </div>
        <p className="mt-0.5 text-sm text-text-secondary">{t(descriptionKey, notification.params)}</p>
        <p className="mt-1 text-xs text-text-muted">{formatNotificationTime(notification.createdAt, t)}</p>
      </button>
      <button
        type="button"
        onClick={() => deleteNotification(notification.id)}
        aria-label={t("common.delete")}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-danger-soft hover:text-danger"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

export function NotificationsScreen() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const { t } = useTranslation();

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <ScreenHeader title={t("home.notifications")} backHref="/app/home" />
        {unreadCount > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={markAllAsRead} className="mt-4">
            {t("notifications.markAllRead")}
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {notifications.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div
          role="status"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-surface-soft text-text-muted">
            <BellOff aria-hidden="true" className="size-6" />
          </div>
          <p className="text-sm text-text-secondary">{t("home.noNotifications")}</p>
        </div>
      )}
    </div>
  );
}
