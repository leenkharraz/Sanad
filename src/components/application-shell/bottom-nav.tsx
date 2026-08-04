import { APP_NAV_ITEMS } from "@/data/nav-items";
import { BottomNavItem } from "@/components/navigation/nav-item";

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur md:hidden"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between gap-1 px-2 py-1.5">
        {APP_NAV_ITEMS.map((item) => (
          <BottomNavItem key={item.href} item={item} />
        ))}
      </div>
    </nav>
  );
}
