"use client";

import { useCallback, useState } from "react";

export type GeolocationStatus = "idle" | "loading" | "ready" | "denied" | "error" | "unsupported";

export interface GeoCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

/** Thin wrapper around the real browser `navigator.geolocation` API. */
export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      setError("unsupported");
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setStatus("ready");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setError("denied");
          return;
        }
        setStatus("error");
        setError("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { status, coords, error, request };
}
