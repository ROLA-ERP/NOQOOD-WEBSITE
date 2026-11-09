// Rate limiting backed by the database, so it survives restarts and works for every instance sharing the file.
import { db } from './db';

/** How many form submissions this visitor made in the last `windowMinutes`. */
export function recentSubmissions(ipH: string, windowMinutes = 60): number {
  const row = db().prepare("SELECT COUNT(*) AS n FROM submissions WHERE ip_hash = ? AND created_at >= datetime('now', ?)").get(ipH, `-${windowMinutes} minutes`) as { n: number };
  return row.n;
}

export function overLimit(ipH: string, max = 5, windowMinutes = 60): boolean {
  return recentSubmissions(ipH, windowMinutes) >= max;
}

/** The same email may not flood the CRM either. */
export function recentByEmail(email: string, windowMinutes = 60): number {
  const row = db().prepare("SELECT COUNT(*) AS n FROM submissions WHERE payload LIKE ? AND created_at >= datetime('now', ?)").get(`%"email":${JSON.stringify(email)}%`, `-${windowMinutes} minutes`) as { n: number };
  return row.n;
}

// Login attempts: tracked per email and per address in memory-free fashion through the users table (failed_logins / locked_until)
