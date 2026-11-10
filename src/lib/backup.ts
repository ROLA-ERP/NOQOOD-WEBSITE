// Database backups. `VACUUM INTO` writes a consistent copy even while the site is serving requests (a plain file copy of a WAL database may not be).
// Copies go to <database folder>/backups on the same volume, the newest BACKUP_KEEP are kept. Copy them off the volume as well (see docs/DEPLOYMENT.md).
import fs from 'node:fs';
import path from 'node:path';
import { db, dbPath } from './db';

export const backupDir = (): string => path.join(path.dirname(dbPath()), 'backups');
const keep = (): number => Math.max(1, parseInt(process.env.BACKUP_KEEP || '', 10) || 14);

export function listBackups(): { file: string; size: number; at: Date }[] {
  const dir = backupDir();
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => /^noqood-website-.*\.db$/.test(f)).map(f => { const st = fs.statSync(path.join(dir, f)); return { file: f, size: st.size, at: st.mtime }; }).sort((a, b) => b.file.localeCompare(a.file));
}

/** Makes a backup now and removes the oldest ones beyond the retention. Returns the new file name. */
export function backupNow(now = new Date()): string {
  if (dbPath() === ':memory:') throw new Error('An in-memory database cannot be backed up');
  const dir = backupDir(); fs.mkdirSync(dir, { recursive: true });
  const stamp = now.toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const file = `noqood-website-${stamp}.db`;
  const target = path.join(dir, file);
  if (fs.existsSync(target)) fs.rmSync(target);
  db().exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`);
  for (const old of listBackups().slice(keep())) fs.rmSync(path.join(dir, old.file), { force: true });
  return file;
}

/** Housekeeping that belongs with the nightly job: expired sessions, used form tokens and very old audit rows. */
export function housekeeping(): void {
  db().prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
  db().prepare("DELETE FROM used_form_tokens WHERE used_at < datetime('now', '-1 day')").run();
  db().prepare("DELETE FROM audit_log WHERE created_at < datetime('now', '-400 days')").run();
}

let timer: NodeJS.Timeout | null = null;
/** Starts the scheduler: one run shortly after start, then every BACKUP_INTERVAL_HOURS (default 24). */
export function scheduleBackups(): void {
  if (timer || process.env.BACKUP_ENABLED === '0') return;
  const run = () => { try { housekeeping(); const f = backupNow(); console.log(`[backup] ${f}`); } catch (e) { console.error('[backup] failed:', (e as Error).message); } };
  const hours = Math.max(1, Number(process.env.BACKUP_INTERVAL_HOURS) || 24);
  setTimeout(run, 60_000).unref();
  timer = setInterval(run, hours * 3600_000); timer.unref();
}
