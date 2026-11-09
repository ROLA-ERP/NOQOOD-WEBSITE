// Password hashing (scrypt), random tokens, signed form tokens, and constant-time comparison. Nothing here needs a third-party package.
import crypto from 'node:crypto';

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${key.toString('base64')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, N, r, p, saltB64, keyB64] = stored.split('$');
  if (scheme !== 'scrypt') return false;
  const expected = Buffer.from(keyB64, 'base64');
  const actual = crypto.scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length, { N: Number(N), r: Number(r), p: Number(p) });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

/** At least 12 characters with letters and digits (and not a common weak value). */
export function passwordProblem(password: string): string | null {
  if (password.length < 12) return 'The password must be at least 12 characters';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'The password must contain letters and digits';
  if (/^(password|12345678|qwerty|admin)/i.test(password)) return 'The password is too common';
  return null;
}

export const randomToken = (bytes = 32): string => crypto.randomBytes(bytes).toString('base64url');
export const sha256 = (s: string): string => crypto.createHash('sha256').update(s).digest('hex');

export function secret(): string {
  const s = process.env.SESSION_SECRET || '';
  if (s.length < 32) {
    if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET must be set to at least 32 characters');
    return 'development-only-secret-development-only-secret';
  }
  return s;
}

export function hmac(value: string): string {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** One-way hash of a visitor address: enough to rate-limit and de-duplicate, not enough to identify anyone later. */
export function ipHash(ip: string): string {
  return crypto.createHmac('sha256', secret()).update(`ip:${ip}`).digest('hex').slice(0, 32);
}

/** A form token proves the form was served by this site and not submitted instantly by a script: "<issuedAt>.<signature>". */
export function formToken(now = Date.now()): string {
  return `${now}.${hmac(`form:${now}`)}`;
}

export function checkFormToken(token: string | undefined, { minAgeMs = 2500, maxAgeMs = 6 * 3600 * 1000, now = Date.now() } = {}): 'ok' | 'invalid' | 'too_fast' | 'expired' {
  if (!token) return 'invalid';
  const [issued, sig] = token.split('.');
  const t = Number(issued);
  if (!Number.isFinite(t) || !sig || !safeEqual(sig, hmac(`form:${t}`))) return 'invalid';
  if (now - t < minAgeMs) return 'too_fast';
  if (now - t > maxAgeMs) return 'expired';
  return 'ok';
}
