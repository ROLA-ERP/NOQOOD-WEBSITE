// Guards for the administration pages: not signed in → sign-in page; signed in without the permission → the dashboard.
import { redirect } from 'next/navigation';
import { can, currentUser, type SessionUser } from './auth';

export function guard(perm: string): SessionUser {
  const u = currentUser();
  if (!u) redirect('/admin/login');
  if (!can(u.role, perm)) redirect('/admin');
  return u;
}

export const str = (fd: FormData, k: string, max = 4000): string => String(fd.get(k) ?? '').trim().slice(0, max);
export const num = (fd: FormData, k: string): number | null => { const v = str(fd, k, 30); if (v === '') return null; const n = Number(v); return Number.isFinite(n) ? n : null; };
