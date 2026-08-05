/**
 * There is no backend, so this cannot be real server-side password
 * security (no per-request rate limiting, no pepper, no HSM). What it DOES
 * do honestly: never store a password in plain text in localStorage, using
 * the browser's real Web Crypto API (SHA-256 + a random per-account salt)
 * rather than inventing a fake "encryption" label over plaintext.
 */

async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  // Extremely old browser / non-secure-context fallback where
  // crypto.subtle is unavailable — still not plaintext.
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16);
}

function randomSaltHex(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = randomSaltHex();
  const hash = await sha256Hex(`${salt}:${password}`);
  return { hash, salt };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const candidate = await sha256Hex(`${salt}:${password}`);
  return candidate === hash;
}
