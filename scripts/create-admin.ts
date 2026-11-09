// Creates the first administrator from ADMIN_EMAIL and ADMIN_PASSWORD (read from the environment, never from the command line or the code).
import { db } from '../src/lib/db';
import { createUser } from '../src/lib/auth';

const email = process.env.ADMIN_EMAIL || '';
const password = process.env.ADMIN_PASSWORD || '';
if (!email || !password) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment first.'); process.exit(1); }
const exists = db().prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
if (exists) { console.log('This administrator already exists: nothing changed.'); process.exit(0); }
createUser(email, 'Administrator', 'admin', password);
console.log(`Administrator ${email} created.`);
