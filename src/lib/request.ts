// Small helpers for route handlers.
/**
 * The visitor's address. The left-most X-Forwarded-For entry is whatever the client typed, so it is never used: the proxy in front of the
 * site (Railway) appends the address it saw, so we count TRUSTED_PROXY_HOPS entries from the right (default 1).
 */
export function pickClientIp(forwardedFor: string | null | undefined, realIp: string | null | undefined, hops = Number(process.env.TRUSTED_PROXY_HOPS || 1)): string {
  const parts = (forwardedFor || '').split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length) return parts[Math.max(0, parts.length - Math.max(1, hops))];
  return (realIp || '').trim() || 'unknown';
}
export function clientIp(req: Request): string {
  return pickClientIp(req.headers.get('x-forwarded-for'), req.headers.get('x-real-ip'));
}

/** A browser form must come from this site: if an Origin header is present it must match the host. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients (tests, curl) send none; the form token and rate limit still apply
  try { return new URL(origin).host === (req.headers.get('x-forwarded-host') || req.headers.get('host')); } catch { return false; }
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
