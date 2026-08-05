import type { useTranslation } from "@/i18n/use-translation";

type Translate = ReturnType<typeof useTranslation>["t"];

/** Buckets a timestamp into one of a handful of translated relative labels
 * — no date library needed for a prototype-scale notification list. */
export function formatNotificationTime(iso: string, t: Translate): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return t("notifications.justNow");
  if (minutes < 60) return t("notifications.minutesAgo", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("notifications.hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("notifications.daysAgo", { count: days });
}
