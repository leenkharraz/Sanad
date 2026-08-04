"use client";

import { useRouter } from "next/navigation";
import { Glasses, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/design-system/segmented-control";
import { usePreferences } from "@/components/providers/preferences-provider";

export function PersonalizationStep() {
  const router = useRouter();
  const { preferences, updatePreferences } = usePreferences();

  function goToHome() {
    updatePreferences({ personalizationComplete: true });
    router.push("/app/home");
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <div className="safe-top mx-auto w-full max-w-md flex-1 px-6 pb-8 pt-8">
        <p className="text-sm font-medium text-brand-700">Step 2 of 2</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">
          Make it yours
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Optional — you can change all of this later in Settings.
        </p>

        <div className="mt-6 space-y-5">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">Preferred language</h2>
            <SegmentedControl
              ariaLabel="Preferred language"
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

          <section className="space-y-2 rounded-2xl border border-dashed border-border bg-surface px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Phone aria-hidden="true" className="size-5 text-text-muted" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Emergency contact setup
                </p>
                <p className="text-xs text-text-muted">Available soon in Settings</p>
              </div>
            </div>
          </section>

          <section className="space-y-2 rounded-2xl border border-dashed border-border bg-surface px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Glasses aria-hidden="true" className="size-5 text-text-muted" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Smart glasses connection
                </p>
                <p className="text-xs text-text-muted">Available soon in Settings</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="safe-bottom safe-x mx-auto flex w-full max-w-md flex-col gap-2 px-6 pb-8">
        <Button type="button" size="touch" className="w-full" onClick={goToHome}>
          Go to SANAD
        </Button>
        <button
          type="button"
          onClick={goToHome}
          className="min-h-11 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
