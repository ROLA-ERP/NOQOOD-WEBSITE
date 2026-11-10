// Administrator sign-in, sessions and permissions. Sessions are random tokens kept hashed in the database; the browser holds an httpOnly cookie.
import { cookies } from 'next/headers';
import { db } from './db';
import { hashPassword, verifyPassword, passwordProblem, randomToken, sha256, ipHash, safeEqual } from './security';

export type Role = 'admin' | 'sales' | 'editor';
export interface SessionUser { id: number; email: string; name: string; role: Role; csrf: string }

export const COOKIE = 'nq_admin';
const SESSION_HOURS = 8;
const MAX_FAILS = 5;
const LOCK_MINUTES = 15;

// What each role may do. "admin" may do everything.
const PERMS: Record<Role, string[]> = {
  admin: ['*'],
  sales: ['leads', 'leads.export', 'dashboard'],
  editor: ['content', 'blog', 'faq', 'pricing', 'dashboard'],
};
export const can = (role: Role, perm: string): boolean => PERMS[role].includes('*') || PERMS[role].includes(perm);

export function audit(user: { id: number; email: string } | null, action: string, entity?: string, entityId?: string | number, detail?: string, ip?: string): void {
  db().prepare('INSERT INTO audit_log (user_id, email, action, entity, entity_id, detail, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)').run(user?.id ?? null, user?.email ?? null, action, entity ?? null, entityId === undefined ? null : String(entityId), detail ? detail.slice(0, 500) : null, ip ? ipHash(ip) : null);
}

export function createUser(email: string, name: string, role: Role, password: string): number {
  const problem = passwordProblem(password);
  if (problem) throw new Error(problem);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('The email address is not valid');
  const res = db().prepare('INSERT INTO users (email, name, role, password_hash) VALUES (?, ?, ?, ?)').run(email.trim().toLowerCase(), name.trim(), role, hashPassword(password));
  return Number(res.lastInsertRowid);
}

export type LoginResult = { ok: true; token: string; user: SessionUser } | { ok: false; reason: 'invalid' | 'locked' };

/** The same answer for an unknown email and a wrong password; five failures lock the account for 15 minutes. */
export function login(email: string, password: string, ip: string): LoginResult {
  const u = db().prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase()) as { id: number; email: string; name: string; role: Role; password_hash: string; active: number; failed_logins: number; locked_until: string | null } | undefined;
  if (!u || !u.active) { verifyPassword(password, hashPassword('timing-decoy')); audit(null, 'login_failed', 'user', undefined, email.slice(0, 80), ip); return { ok: false, reason: 'invalid' }; }
  // A lock stops guessing, but must not lock the owner out: an address that signed in successfully in the last 30 days may still try.
  const knownIp = Boolean(db().prepare("SELECT 1 FROM audit_log WHERE action = 'login' AND user_id = ? AND ip_hash = ? AND created_at >= datetime('now', '-30 days') LIMIT 1").get(u.id, ipHash(ip)));
  if (u.locked_until && u.locked_until > new Date().toISOString().replace('T', ' ').slice(0, 19) && !knownIp) { audit(u, 'login_locked', 'user', u.id, undefined, ip); return { ok: false, reason: 'locked' }; }
  if (!verifyPassword(password, u.password_hash)) {
    const fails = u.failed_logins + 1;
    if (fails >= MAX_FAILS) db().prepare("UPDATE users SET failed_logins = 0, locked_until = datetime('now', ?) WHERE id = ?").run(`+${LOCK_MINUTES} minutes`, u.id);
    else db().prepare('UPDATE users SET failed_logins = ? WHERE id = ?').run(fails, u.id);
    audit(u, 'login_failed', 'user', u.id, undefined, ip);
    return { ok: false, reason: 'invalid' };
  }
  db().prepare("UPDATE users SET failed_logins = 0, locked_until = NULL, last_login_at = datetime('now') WHERE id = ?").run(u.id);
  const token = randomToken(); const csrf = randomToken(16);
  db().prepare("INSERT INTO sessions (token_hash, user_id, csrf, expires_at, ip_hash) VALUES (?, ?, ?, datetime('now', ?), ?)").run(sha256(token), u.id, csrf, `+${SESSION_HOURS} hours`, ipHash(ip));
  audit(u, 'login', 'user', u.id, undefined, ip);
  return { ok: true, token, user: { id: u.id, email: u.email, name: u.name, role: u.role, csrf } };
}

export const activeAdmins = (): number => (db().prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND active = 1").get() as { n: number }).n;

/** The person changes their own password; every other session of theirs is ended. */
export function changePassword(userId: number, current: string, next: string, keepToken?: string): void {
  const row = db().prepare('SELECT password_hash FROM users WHERE id = ?').get(userId) as { password_hash: string } | undefined;
  if (!row || !verifyPassword(current, row.password_hash)) throw new Error('The current password is not correct');
  const problem = passwordProblem(next); if (problem) throw new Error(problem);
  db().prepare('UPDATE users SET password_hash = ?, failed_logins = 0, locked_until = NULL WHERE id = ?').run(hashPassword(next), userId);
  db().prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash <> ?').run(userId, keepToken ? sha256(keepToken) : '');
}

/** An administrator sets a new password for someone (also unlocks the account and ends their sessions). */
export function resetPassword(userId: number, next: string): void {
  const problem = passwordProblem(next); if (problem) throw new Error(problem);
  const r = db().prepare('UPDATE users SET password_hash = ?, failed_logins = 0, locked_until = NULL WHERE id = ?').run(hashPassword(next), userId);
  if (!Number(r.changes)) throw new Error('User not found');
  db().prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}

export function unlockUser(userId: number): void {
  db().prepare('UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = ?').run(userId);
}

/** Role change; the last active administrator cannot be demoted. */
export function setRole(userId: number, role: Role): void {
  if (!['admin', 'sales', 'editor'].includes(role)) throw new Error('Unknown role');
  const u = db().prepare('SELECT role, active FROM users WHERE id = ?').get(userId) as { role: Role; active: number } | undefined;
  if (!u) throw new Error('User not found');
  if (u.role === 'admin' && u.active && role !== 'admin' && activeAdmins() <= 1) throw new Error('This is the last active administrator');
  db().prepare('UPDATE users SET role = ? WHERE id = ?').run(role, userId);
  db().prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}

/** Switches a user on or off; the last active administrator cannot be switched off. */
export function toggleActive(userId: number): void {
  const u = db().prepare('SELECT role, active FROM users WHERE id = ?').get(userId) as { role: Role; active: number } | undefined;
  if (!u) throw new Error('User not found');
  if (u.active && u.role === 'admin' && activeAdmins() <= 1) throw new Error('This is the last active administrator');
  db().prepare('UPDATE users SET active = ? WHERE id = ?').run(u.active ? 0 : 1, userId);
  if (u.active) db().prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}

export function userForToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const row = db().prepare(`SELECT u.id, u.email, u.name, u.role, s.csrf FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > datetime('now') AND u.active = 1`).get(sha256(token)) as SessionUser | undefined;
  return row || null;
}

export function logout(token: string | undefined): void {
  if (token) db().prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
}

export function currentUser(): SessionUser | null {
  return userForToken(cookies().get(COOKIE)?.value);
}

export function cookieOptions(maxAgeSeconds = SESSION_HOURS * 3600) {
  return { httpOnly: true, sameSite: 'strict' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: maxAgeSeconds };
}

/** Server actions call this first: the person must be signed in, hold the permission, and have sent the page's CSRF token. */
export function requireUser(perm: string, csrf?: string): SessionUser {
  const u = currentUser();
  if (!u) throw new Error('Not signed in');
  if (!can(u.role, perm)) throw new Error('You do not have permission for this');
  if (csrf !== undefined && !safeEqual(csrf, u.csrf)) throw new Error('The page expired: reload it and try again');
  return u;
}
