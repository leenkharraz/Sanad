import { DesktopSidebar } from "@/components/application-shell/desktop-sidebar";
import { BottomNav } from "@/components/application-shell/bottom-nav";
import { EmergencyQuickAction } from "@/components/navigation/emergency-quick-action";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="safe-top safe-x flex items-center justify-end px-4 py-3 md:hidden">
          <EmergencyQuickAction />
        </header>
        <main className="flex-1 overflow-y-auto pb-24 md:pb-10">
          <div className="safe-x mx-auto w-full max-w-2xl px-4 py-1 md:px-10 md:py-8">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
