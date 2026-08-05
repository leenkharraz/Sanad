import { Home, Compass, Settings, User, type LucideIcon } from "lucide-react";
import type { TranslationKey } from "@/i18n/use-translation";

export interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
}

/** Four primary destinations, per the Figma bottom navigation. Aura lives in
 * the Home header shortcut and inside Assist, not as its own tab. */
export const APP_NAV_ITEMS: NavItem[] = [
  { href: "/app/home", labelKey: "nav.home", icon: Home },
  { href: "/app/assist", labelKey: "nav.assist", icon: Compass },
  { href: "/app/settings", labelKey: "nav.settings", icon: Settings },
  { href: "/app/profile", labelKey: "nav.profile", icon: User },
];
