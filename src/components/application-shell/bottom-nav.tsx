import { APP_NAV_ITEMS } from "@/data/nav-items";
import { BottomNavItem } from "@/components/navigation/nav-item";

export function BottomNav() {
  return (
    <nav aria-label="Primary" className="safe-bottom fixed inset-x-0 bottom-0 z-40 px-4 pb-3 md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-between gap-1 rounded-2xl border border-border bg-surface/95 px-2 py-1.5 shadow-[0_8px_24px_-14px_rgba(70,57,48,0.4)] backdrop-blur">
        {APP_NAV_ITEMS.map((item) => (
          <BottomNavItem key={item.href} item={item} />
        ))}
      </div>
    </nav>
  );
}
