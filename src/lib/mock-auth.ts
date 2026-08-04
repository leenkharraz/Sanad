import type { SanadUser } from "@/types/user";

const SIMULATED_LATENCY_MS = 700;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? "SANAD User";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * There is no backend yet. This simulates the latency and shape of a real
 * auth call so the UI's loading/error states are exercised honestly, while
 * never claiming credentials are verified anywhere but in the browser.
 */
export async function mockSignIn(email: string, password: string): Promise<SanadUser> {
  await delay(SIMULATED_LATENCY_MS);
  if (password.length < 8) {
    throw new Error("Incorrect email or password.");
  }
  return {
    id: `local-${email}`,
    name: nameFromEmail(email),
    email,
    isDemo: false,
  };
}

export async function mockSignUp(name: string, email: string, password: string): Promise<SanadUser> {
  await delay(SIMULATED_LATENCY_MS);
  if (password.length < 8) {
    throw new Error("Could not create account.");
  }
  return {
    id: `local-${email}`,
    name,
    email,
    isDemo: false,
  };
}

export const DEMO_USER: SanadUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@sanad.app",
  isDemo: true,
};

export async function mockRequestPasswordReset(email: string): Promise<void> {
  await delay(SIMULATED_LATENCY_MS);
  if (!email) {
    throw new Error("Enter an email address first.");
  }
}
