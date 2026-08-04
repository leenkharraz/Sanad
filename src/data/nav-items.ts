import { Home, Compass, Settings, User, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Four primary destinations, per the Figma bottom navigation. Aura lives in
 * the Home header shortcut and inside Assist, not as its own tab. */
export const APP_NAV_ITEMS: NavItem[] = [
  { href: "/app/home", label: "Home", icon: Home },
  { href: "/app/assist", label: "Assist", icon: Compass },
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/profile", label: "Profile", icon: User },
];
