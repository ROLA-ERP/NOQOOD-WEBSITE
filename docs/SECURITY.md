# Security controls

| Risk | Control |
| --- | --- |
| Passwords | scrypt with per-user salt; 12+ characters, common/weak passwords rejected |
| Sessions | random 256-bit token, only its SHA-256 stored; `httpOnly`, `SameSite=Strict`, `Secure` in production; 8 h expiry; deactivating a user ends their sessions |
| Brute force | 5 failed sign-ins lock the account for 15 min; a device with 10 failures in 15 min is blocked; identical answer for unknown email and wrong password |
| CSRF | every admin form carries a per-session token checked on the server, plus `SameSite=Strict`; public forms check `Origin` |
| Authorization | each admin page calls `guard(permission)`, each server action `requireUser(permission, csrf)`; the CSV route checks `leads.export` |
| Spam / abuse | honeypot, signed form token (min 2.5 s, max 6 h), 5 submissions/hour/device (DB-backed), optional Cloudflare Turnstile |
| Injection | parameterised SQL only; zod validation; article and FAQ text rendered as plain text (no HTML injection); JSON-LD escapes `<` |
| CSV/Excel injection | cells starting with `= + - @` are neutralised and all cells quoted |
| Headers | CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP; `X-Powered-By` removed |
| Privacy | IP addresses are stored only as a salted hash; analytics (GA4) load only after consent; consent text on every form |
| Secrets | only in environment variables; `.env` is git-ignored; `SESSION_SECRET` is required in production |
| Audit | sign-ins, edits, status changes and exports are logged (Admin → Audit log) |

Known limits (be aware before go-live): the CSP allows `'unsafe-inline'` for scripts/styles (needed by Next.js inline bootstrapping; move to nonces later); rate limiting counts stored submissions per device, so it does not stop pure page requests (use Cloudflare/Railway edge protections for that); email notifications depend on SMTP being configured and verified by you.
