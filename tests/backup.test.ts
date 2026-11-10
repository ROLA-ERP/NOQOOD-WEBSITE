// F-01: backups are consistent, rotate, and can be opened as a database.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nq-backup-'));
process.env.WEBSITE_DB = path.join(dir, 'site.db');
process.env.SESSION_SECRET = 'test-secret-test-secret-test-secret-123456';
process.env.BACKUP_KEEP = '2';

import { DatabaseSync } from 'node:sqlite';
import { db, closeDb } from '../src/lib/db';
import { backupNow, listBackups, housekeeping } from '../src/lib/backup';

test('F-01: a backup is a readable copy with the data, and only the newest BACKUP_KEEP remain', () => {
  db().prepare("INSERT INTO settings (key, value) VALUES ('probe', '\"hello\"')").run();
  const f1 = backupNow(new Date('2026-11-01T10:00:00Z')); backupNow(new Date('2026-11-02T10:00:00Z')); const f3 = backupNow(new Date('2026-11-03T10:00:00Z'));
  const names = listBackups().map(b => b.file);
  assert.equal(names.length, 2); assert.ok(!names.includes(f1)); assert.equal(names[0], f3);
  const copy = new DatabaseSync(path.join(dir, 'backups', f3), { readOnly: true });
  assert.deepEqual({ ...(copy.prepare("SELECT value FROM settings WHERE key = 'probe'").get() as object) }, { value: '"hello"' });
  copy.close();
  housekeeping(); // runs without error on a real database
  closeDb();
  fs.rmSync(dir, { recursive: true, force: true });
});
