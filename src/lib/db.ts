// The website's own database (SQLite file). It is completely separate from the ERP database: marketing content, leads, admin users.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const MIGRATIONS: { id: string; sql: string }[] = [
  {
    id: '001_core',
    sql: `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE COLLATE NOCASE, name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','sales','editor')), password_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1, failed_logins INTEGER NOT NULL DEFAULT 0, locked_until TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), last_login_at TEXT
);
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  csrf TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), expires_at TEXT NOT NULL, ip_hash TEXT
);
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE content_overrides (
  key TEXT NOT NULL, lang TEXT NOT NULL CHECK (lang IN ('ar','en')), value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (key, lang)
);
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL CHECK (kind IN ('contact','demo')), payload TEXT NOT NULL,
  lang TEXT NOT NULL, source TEXT, ip_hash TEXT, user_agent TEXT, lead_id INTEGER,
  notify_status TEXT NOT NULL DEFAULT 'pending', notify_detail TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_submissions_ip ON submissions(ip_hash, created_at);
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT, lead_code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, company TEXT, email TEXT NOT NULL COLLATE NOCASE, phone TEXT,
  country TEXT, industry TEXT, company_size TEXT, branches TEXT, modules TEXT, inquiry_type TEXT, source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','demo_requested','demo_scheduled','demo_completed','proposal_sent','negotiation','won','lost')),
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL, notes TEXT, follow_up_date TEXT, last_contact_at TEXT,
  duplicate_of INTEGER REFERENCES leads(id) ON DELETE SET NULL, lang TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE TABLE lead_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE, user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_activities_lead ON lead_activities(lead_id, created_at);
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, category TEXT NOT NULL, author_id INTEGER REFERENCES users(id) ON DELETE SET NULL, author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  title_ar TEXT NOT NULL, title_en TEXT NOT NULL, excerpt_ar TEXT, excerpt_en TEXT, body_ar TEXT NOT NULL, body_en TEXT NOT NULL,
  published_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, sort INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 1,
  q_ar TEXT NOT NULL, q_en TEXT NOT NULL, a_ar TEXT NOT NULL, a_en TEXT NOT NULL
);
CREATE TABLE pricing_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT, sort INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 0, name_ar TEXT NOT NULL, name_en TEXT NOT NULL,
  monthly_price REAL, annual_price REAL, currency TEXT NOT NULL DEFAULT 'KWD', users INTEGER, branches INTEGER, modules TEXT, addons TEXT, features_ar TEXT, features_en TEXT, cta TEXT
);
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, email TEXT, action TEXT NOT NULL, entity TEXT, entity_id TEXT, detail TEXT, ip_hash TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_audit_created ON audit_log(created_at);
`,
  },
  {
    id: '002_used_form_tokens',
    sql: `
CREATE TABLE used_form_tokens (token_hash TEXT PRIMARY KEY, used_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX idx_used_tokens_at ON used_form_tokens(used_at);
`,
  },
];

let instance: DatabaseSync | null = null;

export function dbPath(): string {
  const v = process.env.WEBSITE_DB || './data/noqood-website.db';
  return v === ':memory:' ? v : path.resolve(v);
}

export function db(): DatabaseSync {
  if (instance) return instance;
  const file = dbPath();
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const d = new DatabaseSync(file);
  d.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  migrate(d);
  instance = d;
  return d;
}

/** For tests: forget the open connection (the file is not touched). */
export function closeDb(): void {
  if (instance) { try { instance.close(); } catch { /* already closed */ } instance = null; }
}

export function migrate(d: DatabaseSync): string[] {
  d.exec('CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime(\'now\')))');
  const done = new Set((d.prepare('SELECT id FROM schema_migrations').all() as { id: string }[]).map(r => r.id));
  const applied: string[] = [];
  for (const m of MIGRATIONS) {
    if (done.has(m.id)) continue;
    d.exec('BEGIN IMMEDIATE'); // takes the write lock first, so two processes starting together cannot both apply a migration
    try {
      if (d.prepare('SELECT 1 FROM schema_migrations WHERE id = ?').get(m.id)) { d.exec('COMMIT'); continue; }
      d.exec(m.sql); d.prepare('INSERT INTO schema_migrations (id) VALUES (?)').run(m.id); d.exec('COMMIT'); applied.push(m.id); }
    catch (e) { d.exec('ROLLBACK'); throw e; }
  }
  return applied;
}

export const nowIso = () => new Date().toISOString().replace('T', ' ').slice(0, 19);
