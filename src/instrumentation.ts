// Runs once when the server starts (Node runtime only): schedules the nightly database backup.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production') {
    const { scheduleBackups } = await import('./lib/backup');
    scheduleBackups();
  }
}
