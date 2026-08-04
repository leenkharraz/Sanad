"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/providers/session-provider";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader() {
  const { session } = useSession();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Deferred to the client so the greeting/date isn't computed at build or
    // server-render time, which would freeze it to an unrelated timestamp.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  const name = session?.user.name ?? "there";

  return (
    <header className="pt-4">
      <p className="text-sm font-medium text-text-secondary">
        {now ? getGreeting(now.getHours()) : "Hello"}
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{name}</h1>
      {now && (
        <p className="mt-0.5 text-sm text-text-muted">
          {now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
    </header>
  );
}
