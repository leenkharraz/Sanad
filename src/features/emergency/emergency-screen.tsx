"use client";

import { useEffect, useState } from "react";
import { MapPin, TriangleAlert, CheckCircle2 } from "lucide-react";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useEmergencyContacts } from "@/features/emergency/use-emergency-contacts";
import { EmergencyContactsList } from "@/features/emergency/emergency-contacts-list";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";
import { useTranslation } from "@/i18n/use-translation";
import { DEFAULT_EMERGENCY_MESSAGE_TEXT } from "@/i18n/localized-defaults";

type SendState = "idle" | "confirming" | "sending" | "sent";

const GEO_ERROR_KEYS = {
  unsupported: "emergency.errors.geoUnsupported",
  denied: "emergency.errors.geoDenied",
  error: "emergency.errors.geoError",
} as const;

export function EmergencyScreen() {
  const { contacts, addContact, updateContact, deleteContact } = useEmergencyContacts();
  const { status: geoStatus, coords, error: geoError, request: requestLocation } = useGeolocation();
  const { t, lang } = useTranslation();
  // Seeded from the current UI language, but only ever used until a real
  // (possibly untouched-default) value is found in storage — see the effect
  // below. Once anything is saved, it's the user's content and a later
  // language switch must never overwrite it.
  const [message, setMessage] = useState(() => DEFAULT_EMERGENCY_MESSAGE_TEXT[lang]);
  const [shareLocation, setShareLocation] = useState(true);
  const [sendState, setSendState] = useState<SendState>("idle");

  useEffect(() => {
    const stored = readStorage<string>(STORAGE_KEYS.emergencyMessage);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessage(stored);
    }
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.emergencyMessage, message);
  }, [message]);

  function handleSend() {
    setSendState("sending");
    window.setTimeout(() => setSendState("sent"), 1200);
  }

  const geoErrorMessage = geoError ? t(GEO_ERROR_KEYS[geoError as keyof typeof GEO_ERROR_KEYS] ?? "emergency.errors.geoError") : null;
  const contactWord = t(contacts.length === 1 ? "emergency.contactSingular" : "emergency.contactPlural");
  const locationSuffix = shareLocation && geoStatus === "ready" ? t("emergency.withLocationSuffix") : "";

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("emergency.title")} backHref="/app/home" />

      <div className="flex items-start gap-2.5 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
        <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>
          {t("emergency.simulatedNoticePrefix")} <strong>{t("emergency.simulatedWord")}</strong>{" "}
          {t("emergency.simulatedNoticeSuffix")}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="emergency-message">{t("emergency.messageLabel")}</Label>
        <textarea
          id="emergency-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          dir="auto"
          className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </div>

      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">{t("emergency.shareLocationTitle")}</p>
            <p className="text-xs text-text-secondary">{t("emergency.shareLocationSubtitle")}</p>
          </div>
          <Switch
            checked={shareLocation}
            onCheckedChange={setShareLocation}
            aria-label={t("emergency.shareLocationAria")}
          />
        </div>

        {shareLocation && (
          <div className="rounded-2xl border border-border bg-surface px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-brand-700">
                <MapPin aria-hidden="true" className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                {geoStatus === "ready" && coords ? (
                  <p className="text-sm text-text-primary tabular-nums">
                    <bdi dir="ltr">
                      {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                    </bdi>
                    <span className="ms-1 text-xs text-text-muted">
                      <bdi dir="ltr">{t("emergency.accuracySuffix", { meters: Math.round(coords.accuracy) })}</bdi>
                    </span>
                  </p>
                ) : geoStatus === "loading" ? (
                  <p className="text-sm text-text-secondary">{t("emergency.gettingLocation")}</p>
                ) : geoStatus === "denied" ? (
                  <p className="text-sm text-danger">{geoErrorMessage}</p>
                ) : geoStatus === "unsupported" ? (
                  <p className="text-sm text-text-muted">{t("emergency.errors.geoUnsupported")}</p>
                ) : geoStatus === "error" ? (
                  <p className="text-sm text-danger">{geoErrorMessage}</p>
                ) : (
                  <p className="text-sm text-text-muted">{t("emergency.locationNotFetched")}</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={requestLocation}
                disabled={geoStatus === "loading" || geoStatus === "unsupported"}
              >
                {geoStatus === "ready" ? t("emergency.refreshLocation") : t("emergency.getLocation")}
              </Button>
            </div>
          </div>
        )}
      </section>

      <EmergencyContactsList
        contacts={contacts}
        onAdd={addContact}
        onUpdate={updateContact}
        onDelete={deleteContact}
      />

      <Button
        type="button"
        size="touch"
        className="w-full bg-danger text-white hover:bg-danger-hover"
        onClick={() => setSendState("confirming")}
        disabled={contacts.length === 0}
      >
        <TriangleAlert aria-hidden="true" className="size-4" />
        {t("emergency.sendAlert")}
      </Button>
      {contacts.length === 0 && (
        <p className="text-center text-xs text-text-muted">{t("emergency.addContactHint")}</p>
      )}

      <Dialog
        open={sendState === "confirming" || sendState === "sending"}
        onOpenChange={(open) => !open && sendState !== "sending" && setSendState("idle")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("emergency.confirmDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("emergency.confirmDialog.description", {
                count: contacts.length,
                contactWord,
                locationSuffix,
              })}
            </DialogDescription>
          </DialogHeader>
          <div dir="auto" className="rounded-xl bg-muted px-3.5 py-3 text-sm text-text-secondary">
            &ldquo;{message}&rdquo;
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSendState("idle")}
              disabled={sendState === "sending"}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="bg-danger text-white hover:bg-danger-hover"
              onClick={handleSend}
              disabled={sendState === "sending"}
            >
              {sendState === "sending" ? t("emergency.confirmDialog.sending") : t("emergency.confirmDialog.confirmSend")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sendState === "sent"} onOpenChange={(open) => !open && setSendState("idle")}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 aria-hidden="true" className="size-5 text-success" />
              <DialogTitle>{t("emergency.sentDialog.title")}</DialogTitle>
            </div>
            <DialogDescription>
              {t("emergency.sentDialog.description", { count: contacts.length, contactWord })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setSendState("idle")}>
              {t("common.done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
