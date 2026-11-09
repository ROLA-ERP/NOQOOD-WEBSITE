// Applies the website database migrations. Safe to run on every start.
import { db, dbPath } from '../src/lib/db';

db();
console.log(`Website database ready: ${dbPath()}`);
