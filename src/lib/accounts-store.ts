import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";
import { hashPassword, verifyPassword } from "@/lib/password-hash";
import type { SanadUser } from "@/types/user";

interface AccountRecord {
  id: string;
  name: string;
  /** Normalized (trimmed, lowercased) — the lookup key. */
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

type AccountsDb = Record<string, AccountRecord>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readAccounts(): AccountsDb {
  return readStorage<AccountsDb>(STORAGE_KEYS.accounts) ?? {};
}

function writeAccounts(db: AccountsDb): void {
  writeStorage(STORAGE_KEYS.accounts, db);
}

function toPublicUser(record: AccountRecord): SanadUser {
  return { id: record.id, name: record.name, email: record.email, isDemo: false };
}

/** Real account creation — this is the actual "database" for this
 * prototype (localStorage, since there is no backend). Rejects an email
 * that's already registered rather than silently succeeding. */
export async function createAccount(name: string, email: string, password: string): Promise<SanadUser> {
  const normalized = normalizeEmail(email);
  const db = readAccounts();
  if (db[normalized]) {
    throw new Error("DUPLICATE_ACCOUNT");
  }
  const { hash, salt } = await hashPassword(password);
  const record: AccountRecord = {
    id: createId(),
    name: name.trim(),
    email: normalized,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
  };
  db[normalized] = record;
  writeAccounts(db);
  return toPublicUser(record);
}

/** Real credential verification against the stored account — no email
 * ever "just works" regardless of password anymore. */
export async function verifyAccount(email: string, password: string): Promise<SanadUser> {
  const normalized = normalizeEmail(email);
  const db = readAccounts();
  const record = db[normalized];
  if (!record) {
    throw new Error("UNKNOWN_ACCOUNT");
  }
  const valid = await verifyPassword(password, record.passwordHash, record.passwordSalt);
  if (!valid) {
    throw new Error("INCORRECT_PASSWORD");
  }
  return toPublicUser(record);
}

export function accountExists(email: string): boolean {
  const db = readAccounts();
  return Boolean(db[normalizeEmail(email)]);
}

/** Keeps the persisted account record (the "database") in sync with a
 * profile edit — without this, an edited name would silently revert the
 * next time the user signs back in, since sign-in reconstructs the user
 * from this record. */
export function updateAccountName(email: string, name: string): SanadUser {
  const normalized = normalizeEmail(email);
  const db = readAccounts();
  const record = db[normalized];
  if (!record) {
    throw new Error("UNKNOWN_ACCOUNT");
  }
  record.name = name.trim();
  db[normalized] = record;
  writeAccounts(db);
  return toPublicUser(record);
}
