/** Loose, format-agnostic phone validation — accepts Saudi numbers
 * (+966 5XXXXXXXX, 05XXXXXXXX) and reasonable international input alike,
 * without forcing a single visual format while the user is still typing. */
const PHONE_CHARS = /^[+]?[0-9\s-]+$/;

export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return true;
  if (!PHONE_CHARS.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
