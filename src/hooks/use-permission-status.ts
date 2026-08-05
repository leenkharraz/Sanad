"use client";

import { useEffect, useState } from "react";

export type PermissionStatusValue = "granted" | "denied" | "prompt" | "unsupported";

/** Thin wrapper around the real browser `navigator.permissions` API — reports
 * the device's actual current permission state, not a guess. Falls back to
 * "unsupported" honestly wherever the Permissions API or this specific query
 * name isn't available (e.g. Safari has no permissions.query at all; Firefox
 * doesn't support querying "microphone"/"camera"). */
export function usePermissionStatus(name: PermissionName): PermissionStatusValue {
  const [status, setStatus] = useState<PermissionStatusValue>("unsupported");

  useEffect(() => {
    let permissionStatus: PermissionStatus | null = null;
    let cancelled = false;

    function handleChange(this: PermissionStatus) {
      if (!cancelled) setStatus(this.state as PermissionStatusValue);
    }

    if (typeof navigator === "undefined" || !navigator.permissions?.query) {
      setStatus("unsupported");
      return;
    }

    navigator.permissions
      .query({ name })
      .then((result) => {
        if (cancelled) return;
        permissionStatus = result;
        setStatus(result.state as PermissionStatusValue);
        result.addEventListener("change", handleChange);
      })
      .catch(() => {
        if (!cancelled) setStatus("unsupported");
      });

    return () => {
      cancelled = true;
      permissionStatus?.removeEventListener("change", handleChange);
    };
  }, [name]);

  return status;
}
