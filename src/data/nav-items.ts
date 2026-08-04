import { Home, Compass, Sparkles, Settings, User, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const APP_NAV_ITEMS: NavItem[] = [
  { href: "/app/home", label: "Home", icon: Home },
  { href: "/app/assist", label: "Assist", icon: Compass },
  { href: "/app/aura", label: "Aura", icon: Sparkles },
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/profile", label: "Profile", icon: User },
];
