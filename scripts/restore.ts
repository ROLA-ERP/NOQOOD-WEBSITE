// Restores a backup:  STOP the site first, then  npm run db:restore -- <backup file name or path>
// The current database is kept next to it as *.before-restore, so a wrong restore can be undone.
import fs from 'node:fs';
import path from 'node:path';
import { dbPath } from '../src/lib/db';
import { backupDir, listBackups } from '../src/lib/backup';

const arg = process.argv[2];
if (!arg) { console.error('Usage: npm run db:restore -- <backup file>\nAvailable:\n' + listBackups().map(b => `  ${b.file}  ${b.size} bytes  ${b.at.toISOString()}`).join('\n')); process.exit(1); }
const src = fs.existsSync(arg) ? path.resolve(arg) : path.join(backupDir(), arg);
if (!fs.existsSync(src)) { console.error(`Not found: ${src}`); process.exit(1); }
const dest = dbPath();
if (fs.existsSync(dest)) fs.copyFileSync(dest, `${dest}.before-restore`);
for (const ext of ['-wal', '-shm']) fs.rmSync(dest + ext, { force: true });
fs.copyFileSync(src, dest);
console.log(`Restored ${src} -> ${dest}. Start the site again.`);
