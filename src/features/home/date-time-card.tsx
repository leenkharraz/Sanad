"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function DateTimeCard() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5">
      <div>
        <p className="text-xs font-medium text-text-secondary">
          {now ? now.toLocaleDateString(undefined, { weekday: "long" }) : "—"}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-text-primary">
          {now
            ? now.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
            : "Loading date"}
        </p>
      </div>
      <div className="flex items-center gap-1.5 rounded-xl bg-surface-soft px-3 py-2 text-sm font-semibold text-brand-700 tabular-nums">
        <Clock aria-hidden="true" className="size-4" />
        {now ? now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "--:--"}
      </div>
    </div>
  );
}
