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

/** Email is the account's real identity (and the DB's lookup key), not
 * decorative Profile text — this moves the record to the new key so the new
 * email is what future Sign In looks up, and the old email stops working.
 * Every other piece of this account's data (preferences, profile, quick
 * phrases, contacts, notifications) is scoped by account id, not email, so
 * nothing else needs to move. */
export async function updateAccountEmail(currentEmail: string, newEmail: string): Promise<SanadUser> {
  const normalizedCurrent = normalizeEmail(currentEmail);
  const normalizedNew = normalizeEmail(newEmail);
  const db = readAccounts();
  const record = db[normalizedCurrent];
  if (!record) {
    throw new Error("UNKNOWN_ACCOUNT");
  }
  if (normalizedNew !== normalizedCurrent && db[normalizedNew]) {
    throw new Error("DUPLICATE_ACCOUNT");
  }
  record.email = normalizedNew;
  delete db[normalizedCurrent];
  db[normalizedNew] = record;
  writeAccounts(db);
  return toPublicUser(record);
}

/** Real password change — verifies the current password against the stored
 * hash (no backend, but no shortcut either: a wrong current password is
 * rejected the same way Sign In rejects one) before hashing and storing the
 * new one. Never returns or logs the password itself. */
export async function updateAccountPassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const normalized = normalizeEmail(email);
  const db = readAccounts();
  const record = db[normalized];
  if (!record) {
    throw new Error("UNKNOWN_ACCOUNT");
  }
  const valid = await verifyPassword(currentPassword, record.passwordHash, record.passwordSalt);
  if (!valid) {
    throw new Error("INCORRECT_PASSWORD");
  }
  const { hash, salt } = await hashPassword(newPassword);
  record.passwordHash = hash;
  record.passwordSalt = salt;
  db[normalized] = record;
  writeAccounts(db);
}
