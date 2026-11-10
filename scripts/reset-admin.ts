// Recovery when nobody can sign in: sets a new password for ADMIN_EMAIL (read from the environment), unlocks the account and re-activates it.
// Run on the server:  ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:reset
import { db } from '../src/lib/db';
import { resetPassword } from '../src/lib/auth';

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
if (!email || !password) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment first.'); process.exit(1); }
const u = db().prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;
if (!u) { console.error('No user with this email.'); process.exit(1); }
resetPassword(u.id, password);
db().prepare("UPDATE users SET active = 1, role = 'admin' WHERE id = ?").run(u.id);
db().prepare("INSERT INTO audit_log (user_id, email, action, entity, entity_id) VALUES (?, ?, 'admin_reset_script', 'user', ?)").run(u.id, email, String(u.id));
console.log(`Password reset for ${email}; the account is active and unlocked.`);
