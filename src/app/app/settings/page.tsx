"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/design-system/segmented-control";
import { AccessibilityNeedsEditor } from "@/features/settings/accessibility-needs-editor";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useSession } from "@/components/providers/session-provider";

const COMING_SOON_GROUPS = [
  "Smart Glasses",
  "Caption Display",
  "Emotion & Urgency",
  "Voice Settings",
  "Translation",
  "Vision Assistance",
  "Emergency",
  "Privacy",
  "About SANAD",
];

export default function SettingsPage() {
  const router = useRouter();
  const { preferences, updatePreferences } = usePreferences();
  const { signOut } = useSession();

  function handleSignOut() {
    signOut();
    router.replace("/welcome");
  }

  return (
    <div className="space-y-6 pb-4 pt-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Settings</h1>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">Your accessibility needs</h2>
        <div className="rounded-2xl border border-border bg-surface px-2 py-1.5">
          <AccessibilityNeedsEditor />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">App language</h2>
        <SegmentedControl
          ariaLabel="App language"
          value={preferences.language}
          onChange={(language) => updatePreferences({ language })}
          options={[
            { value: "en", label: "English" },
            { value: "ar", label: "العربية" },
          ]}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">Font size</h2>
        <SegmentedControl
          ariaLabel="Font size"
          value={preferences.fontSize}
          onChange={(fontSize) => updatePreferences({ fontSize })}
          options={[
            { value: "default", label: "Default" },
            { value: "large", label: "Large" },
            { value: "extra-large", label: "Extra large" },
          ]}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">Appearance</h2>
        <SegmentedControl
          ariaLabel="Appearance"
          value={preferences.themeMode}
          onChange={(themeMode) => updatePreferences({ themeMode })}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "calm", label: "Calm" },
          ]}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">More settings</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {COMING_SOON_GROUPS.map((group) => (
            <div
              key={group}
              className="flex min-h-11 items-center justify-between px-4 py-3 text-sm text-text-muted"
            >
              {group}
              <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[0.7rem] font-medium text-warning">
                Phase 4
              </span>
            </div>
          ))}
        </div>
      </section>

      <Button
        type="button"
        variant="outline"
        size="touch"
        className="w-full text-danger hover:bg-danger-soft"
        onClick={handleSignOut}
      >
        <LogOut aria-hidden="true" className="size-4" />
        Sign out
      </Button>
    </div>
  );
}
