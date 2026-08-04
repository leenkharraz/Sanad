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
import { DEFAULT_EMERGENCY_MESSAGE } from "@/types/emergency";

type SendState = "idle" | "confirming" | "sending" | "sent";

export function EmergencyScreen() {
  const { contacts, addContact, updateContact, deleteContact } = useEmergencyContacts();
  const { status: geoStatus, coords, error: geoError, request: requestLocation } = useGeolocation();
  const [message, setMessage] = useState(DEFAULT_EMERGENCY_MESSAGE);
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

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title="Emergency SOS" backHref="/app/home" />

      <div className="flex items-start gap-2.5 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
        <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>
          Sending an alert is <strong>simulated</strong> — SANAD has no backend yet, so nothing is
          actually delivered to your contacts. Calling a contact directly does work, using your
          device&apos;s phone app.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="emergency-message">Emergency message</Label>
        <textarea
          id="emergency-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </div>

      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Share my location</p>
            <p className="text-xs text-text-secondary">Include your current location in the alert</p>
          </div>
          <Switch
            checked={shareLocation}
            onCheckedChange={setShareLocation}
            aria-label="Share my location with the alert"
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
                    {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                    <span className="ml-1 text-xs text-text-muted">(±{Math.round(coords.accuracy)}m)</span>
                  </p>
                ) : geoStatus === "loading" ? (
                  <p className="text-sm text-text-secondary">Getting your location…</p>
                ) : geoStatus === "denied" ? (
                  <p className="text-sm text-danger">{geoError}</p>
                ) : geoStatus === "unsupported" ? (
                  <p className="text-sm text-text-muted">Geolocation isn&apos;t supported in this browser.</p>
                ) : geoStatus === "error" ? (
                  <p className="text-sm text-danger">{geoError}</p>
                ) : (
                  <p className="text-sm text-text-muted">Location not fetched yet.</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={requestLocation}
                disabled={geoStatus === "loading" || geoStatus === "unsupported"}
              >
                {geoStatus === "ready" ? "Refresh" : "Get location"}
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
        className="w-full bg-danger text-white hover:bg-[#e14550]"
        onClick={() => setSendState("confirming")}
        disabled={contacts.length === 0}
      >
        <TriangleAlert aria-hidden="true" className="size-4" />
        Send Emergency Alert
      </Button>
      {contacts.length === 0 && (
        <p className="text-center text-xs text-text-muted">Add a trusted contact to send an alert.</p>
      )}

      <Dialog
        open={sendState === "confirming" || sendState === "sending"}
        onOpenChange={(open) => !open && sendState !== "sending" && setSendState("idle")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send emergency alert?</DialogTitle>
            <DialogDescription>
              This will simulate sending your message to {contacts.length}{" "}
              {contacts.length === 1 ? "contact" : "contacts"}
              {shareLocation && geoStatus === "ready" ? " with your current location" : ""}. No
              real message is sent — SANAD has no backend yet.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-muted px-3.5 py-3 text-sm text-text-secondary">
            &ldquo;{message}&rdquo;
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSendState("idle")}
              disabled={sendState === "sending"}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-danger text-white hover:bg-[#e14550]"
              onClick={handleSend}
              disabled={sendState === "sending"}
            >
              {sendState === "sending" ? "Sending…" : "Confirm & send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sendState === "sent"} onOpenChange={(open) => !open && setSendState("idle")}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 aria-hidden="true" className="size-5 text-success" />
              <DialogTitle>Simulated alert sent</DialogTitle>
            </div>
            <DialogDescription>
              Your message was simulated as sent to {contacts.length}{" "}
              {contacts.length === 1 ? "contact" : "contacts"}. This is a prototype — no real SMS
              or notification was delivered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setSendState("idle")}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
