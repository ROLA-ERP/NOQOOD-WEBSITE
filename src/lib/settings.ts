// Site settings the administrator can change (contact details, social links, analytics id, pricing mode, announcement) and per-language
// text overrides. Defaults come from code so the site works with an empty database.
import { db } from './db';

export const OFFICIAL = {
  email: 'noqooderp@gmail.com',
  phone: '+96599643739',
  phoneDisplay: '+965 9964 3739',
  whatsapp: '96599643739',
};

export type SocialKey = 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'x';
export const SOCIAL_KEYS: SocialKey[] = ['linkedin', 'facebook', 'instagram', 'youtube', 'tiktok', 'x'];

export interface SiteSettings {
  email: string; phone: string; whatsapp: string; notify_to: string;
  socials: Record<SocialKey, string>;
  ga_id: string;
  pricing_mode: 'quote' | 'plans';
  announcement_ar: string; announcement_en: string;
  show_testimonials: boolean;
}

const DEFAULTS: SiteSettings = {
  email: OFFICIAL.email, phone: OFFICIAL.phone, whatsapp: OFFICIAL.whatsapp, notify_to: OFFICIAL.email,
  socials: { linkedin: '', facebook: '', instagram: '', youtube: '', tiktok: '', x: '' },
  ga_id: '', pricing_mode: 'quote', announcement_ar: '', announcement_en: '', show_testimonials: false,
};

export function getSetting<T>(key: string, fallback: T): T {
  const row = db().prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  if (!row) return fallback;
  try { return JSON.parse(row.value) as T; } catch { return fallback; }
}

export function setSetting(key: string, value: unknown): void {
  db().prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").run(key, JSON.stringify(value));
}

export function siteSettings(): SiteSettings {
  const s = getSetting<Partial<SiteSettings>>('site', {});
  return { ...DEFAULTS, ...s, socials: { ...DEFAULTS.socials, ...(s.socials || {}) }, ga_id: s.ga_id || process.env.GA_MEASUREMENT_ID || '' };
}

export function saveSiteSettings(patch: Partial<SiteSettings>): SiteSettings {
  const next = { ...siteSettings(), ...patch, socials: { ...siteSettings().socials, ...(patch.socials || {}) } };
  setSetting('site', next);
  return next;
}

/** A social link is shown only when it is a genuine https URL entered by the administrator. */
export const socialUrl = (v: string): string | null => (/^https:\/\/[^\s]+$/.test(v || '') ? v : null);

export function siteUrl(): string { return (process.env.SITE_URL || 'https://www.noqoodapp.com').replace(/\/+$/, ''); }
export function erpUrl(): string { return (process.env.ERP_URL || 'https://app.noqoodapp.com').replace(/\/+$/, ''); }

// ── text overrides: the administrator can replace any translatable text by key and language ──
export function overrides(lang: 'ar' | 'en'): Record<string, string> {
  const rows = db().prepare('SELECT key, value FROM content_overrides WHERE lang = ?').all(lang) as { key: string; value: string }[];
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}
export function setOverride(key: string, lang: 'ar' | 'en', value: string): void {
  if (!value.trim()) { db().prepare('DELETE FROM content_overrides WHERE key = ? AND lang = ?').run(key, lang); return; }
  db().prepare("INSERT INTO content_overrides (key, lang, value, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(key, lang) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").run(key, lang, value.slice(0, 4000));
}
