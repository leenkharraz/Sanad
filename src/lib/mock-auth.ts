import type { SanadUser } from "@/types/user";
import { createAccount, verifyAccount } from "@/lib/accounts-store";

const SIMULATED_LATENCY_MS = 700;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * There is no backend server — but this now actually creates and verifies
 * accounts against `src/lib/accounts-store.ts` (persisted in localStorage,
 * password hashed+salted via Web Crypto). It's a real client-side "database"
 * for a prototype, not a fake always-succeed check. `delay()` just keeps the
 * UI's loading state honestly exercised, matching how a real network call
 * would feel.
 */
export async function mockSignIn(email: string, password: string): Promise<SanadUser> {
  await delay(SIMULATED_LATENCY_MS);
  return verifyAccount(email, password);
}

export async function mockSignUp(name: string, email: string, password: string): Promise<SanadUser> {
  await delay(SIMULATED_LATENCY_MS);
  return createAccount(name, email, password);
}

export const DEMO_USER: SanadUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@sanad.app",
  isDemo: true,
};
