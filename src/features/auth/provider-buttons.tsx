"use client";

import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon, AppleIcon } from "@/components/design-system/provider-icons";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";

const PROVIDERS: { nameKey: TranslationKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { nameKey: "auth.providers.google", icon: GoogleIcon },
  { nameKey: "auth.providers.apple", icon: AppleIcon },
  { nameKey: "auth.providers.nafath", icon: Fingerprint },
];

export function ProviderButtons() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      {PROVIDERS.map(({ nameKey, icon: Icon }) => {
        const name = t(nameKey);
        return (
          <Button
            key={nameKey}
            type="button"
            variant="outline"
            size="touch"
            disabled
            aria-disabled="true"
            title={t("auth.providerPrototypeNotice", { provider: name })}
            className="w-full justify-center gap-2.5"
          >
            <Icon aria-hidden="true" className="size-4.5" />
            {t("auth.providerContinueWith", { provider: name })}
          </Button>
        );
      })}
      <p className="text-center text-xs text-text-muted">{t("auth.prototypeNotice")}</p>
    </div>
  );
}
