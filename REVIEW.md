# NOQOOD Website — Full Application Review (Phase 1, read-only)

Reviewed: `D:\projects\NOQOOD-WEBSITE`, commit `d8d5275` (branch main), 2026-11-10.
Nothing in the code was changed. This file is the only thing written. Nothing was pushed, nothing in production or Railway was touched.

## 0. Understanding of the system (please correct if wrong)

* **What it is:** the NOQOOD marketing site (AR/EN) + a mini CRM + an admin panel. Independent of the ERP; its own SQLite file. Live at www.noqoodapp.com, auto-deploys from `main` on Railway.
* **Stack:** Next.js **14.2.35** App Router, React 18, TypeScript, Tailwind, zod 3, nodemailer 6, `tsx`. SQLite through the built-in `node:sqlite` (Node >= 22.13, Docker uses Node 24). No ORM.
* **Entry points:**
  * Public pages `src/app/(site)/[lang]/*` (mostly ISR, `revalidate = 60`; blog is `force-dynamic`). `src/middleware.ts` redirects `/` to `/ar` or `/en`.
  * Public APIs: `POST /api/contact`, `POST /api/demo`, `GET /api/form-token`, `GET /api/health`.
  * Admin: `src/app/(admin)/admin/*`. All writes are Next **server actions** in `admin/actions.ts`; CSV export is a route handler (`admin/leads/export/route.ts`).
* **Auth:** email + password (scrypt N=16384), 8 h server-side sessions (random token, SHA-256 stored), httpOnly + SameSite=Strict cookie, per-session CSRF token embedded in every admin form, three roles (admin / sales / editor), 5-failure account lock (15 min), per-IP login throttle from the audit log.
* **Public form defence:** honeypot, HMAC form token (2.5 s .. 6 h), 5 stored submissions/hour/IP-hash, optional Cloudflare Turnstile, zod validation.
* **Data:** tables users, sessions, settings, content_overrides, submissions, leads, lead_activities, posts, faqs, pricing_plans, audit_log, schema_migrations (single migration `001_core`).
* **External integrations:** Resend HTTPS API (preferred) or SMTP for new-lead alerts; Cloudflare Turnstile (optional); GA4 (consent-gated, admin sets the ID). No other outbound calls.
* **Deployment:** `Dockerfile` (node:24-bookworm-slim, builds with a throw-away DB, runs `tsx scripts/migrate.ts && next start`), DB on volume `/data`. No CI, no background jobs.
* **Tests:** `npm test` -> 13 tests in one file (`tests/core.test.ts`), all pass (ran against an in-memory/scratch DB). `tsc --noEmit` clean. `next lint` clean. No test touches HTTP routes, server actions, the mail code or the middleware.

## 1. Executive summary

**Overall health: good for a first release.** SQL is fully parameterised, no HTML injection path was found (article/FAQ text is rendered as plain React text, JSON-LD escapes `<`), password/session design is sound, CSRF is checked on every server action, CSV formula injection is handled, and the code is small and readable. The real weaknesses are operational (no backup of the CRM database, no admin recovery path, outdated framework with a "critical" advisory) and a few trust/IP-handling mistakes in the abuse controls.

**Top 5 risks**

1. **R1 (F-01) No backup of the lead database.** All leads live in one SQLite file on one volume; `docs/DEPLOYMENT.md` only says "schedule a copy". Nothing does it. Volume loss = all CRM data gone.
2. **R2 (F-02) Client IP is taken from the first `X-Forwarded-For` entry** (a value the client can send). Every abuse control keyed on IP (5/hour form limit, 10/15 min login throttle) is bypassable by changing one header, if the Railway edge does not overwrite it (not verified). Consequence: unlimited stored leads and unlimited Resend emails to the owner, and unthrottled password guessing.
3. **R3 (F-03) Next.js 14.2.35 is flagged "critical" by `npm audit`** (DoS class, including an RSC/Server-Action request deserialization issue); the only offered fix is a major jump to Next 16. Plus high advisories in `zod`, `nodemailer`, `postcss`.
4. **R4 (F-04, F-05) Admin lock-out has no recovery:** anyone can lock the only admin account indefinitely (5 wrong passwords every 15 min), and there is no password change / reset / role change screen or script.
5. **R5 (F-06) Repeat contacts are hidden:** a returning person's new message (and a demo request from someone who already wrote) becomes a hidden "duplicate" row that is excluded from the lead list, the KPIs and the dashboard, so it can be missed.

**Recommended order:** F-01 backups -> F-02 trusted-IP -> F-04/F-05 admin recovery -> F-06 duplicates -> F-03 dependency upgrade (plan as its own task + staging test) -> the Mediums -> content/legal placeholders (F-14) before any marketing push.

## 2. Findings table

| ID | Area | Severity | Title | Location | Effort |
|---|---|---|---|---|---|
| F-01 | Reliability | High | No backup/restore for the CRM SQLite file | `docs/DEPLOYMENT.md:38-39`, `Dockerfile:14` | S-M |
| F-02 | Security | High | Client IP trusted from client-supplied `X-Forwarded-For` (rate limits bypass) | `src/lib/request.ts:2-6`, `admin/actions.ts:14` | S |
| F-03 | Dependencies | High | `npm audit`: 13 vulns (1 critical next, high: zod, nodemailer, postcss/eslint chain) | `package.json:20-32` | M-L |
| F-04 | Security/Availability | Medium | Anyone can lock any account out forever (no IP-aware lock, no admin unlock) | `src/lib/auth.ts:40-44` | S |
| F-05 | Missing feature | Medium | No password change/reset, no role edit, no way to recover a locked admin | `admin/actions.ts:139-157`, `scripts/create-admin.ts:8-9` | M |
| F-06 | Correctness | Medium | Repeat/duplicate leads are hidden from list, KPIs and dashboard | `src/lib/leads.ts:49,73,135`, `submit.ts:51-56` | M |
| F-07 | Security | Medium | Form token is replayable and not bound to anything; one token serves unlimited submissions | `src/lib/security.ts:55-67` | S |
| F-08 | Reliability | Medium | Email sent inline in the visitor's request (up to 15 s), no retry, no failure alert | `src/lib/submit.ts:66`, `mail.ts:33,46` | M |
| F-09 | Bug | Medium | Turnstile server check exists but no client widget: setting `TURNSTILE_SECRET` breaks both forms | `submit.ts:14-22`, `src/components/*` (no widget) | S |
| F-10 | Reliability | Medium | Parallel start/build processes can race the migration (`BEGIN` not `IMMEDIATE`) | `src/lib/db.ts:97-99`, `Dockerfile:9-11` | S |
| F-11 | Security | Medium | CSP allows `'unsafe-inline'` scripts | `next.config.mjs:6` | M |
| F-12 | Security | Low | Login and logout actions have no CSRF/Origin check of their own (login CSRF) | `admin/actions.ts:18,28` | S |
| F-13 | Privacy/Missing | Medium | No way to delete or anonymise a lead/submission; no retention job; privacy policy promises deletion on request | `submit.ts:46`, `pages.ts:98` | M |
| F-14 | Content/Legal | High (launch) | Live legal pages contain unresolved bracket placeholders | `src/content/pages.ts:97,105,108,109` | S (needs owner/lawyer) |
| F-15 | Config | Medium | `ERP_URL` default is the website itself; "Login to ERP" points to www unless Railway env is set | `src/lib/settings.ts:55`, `.env.example:5` | S |
| F-16 | Reliability | Low | Container: runs as root, no HEALTHCHECK, SIGTERM not forwarded (`sh -c`), `output: 'standalone'` configured but `next start` used | `Dockerfile:14-16`, `next.config.mjs:22` | S |
| F-17 | Performance | Low | Phone duplicate check loads every lead with a phone into JS on every submission | `src/lib/leads.ts:26-31` | S |
| F-18 | Reliability | Low | Expired sessions, audit log and submissions are never purged; every request runs 1-2 extra queries on the single connection | `auth.ts:55-60`, `db.ts` | S |
| F-19 | Bug | Low | Admin lead edit: no email/phone validation, follow-up/note on non-existent id surfaces FK error text | `admin/actions.ts:43`, `leads.ts:105-115` | S |
| F-20 | Correctness | Low | Rate-limit check and insert are not atomic; `recentByEmail` is dead code and the "same email" limit it was meant for is not applied | `submit.ts:32`, `ratelimit.ts:15-18` | S |
| F-21 | Security | Low | Sales role can export 5 000 leads with PII; no export rate/alert beyond an audit row | `leads/export/route.ts:11` | S |
| F-22 | Reliability | Low | Resend default sender `onboarding@resend.dev` only delivers to the Resend account owner; changing `notify_to` in the admin silently stops alerts (recorded as `failed`, nobody is told) | `mail.ts:22,32` | S |
| F-23 | Quality | Low | Tests do not cover routes, server actions, mail, middleware, CSRF or Origin logic | `tests/core.test.ts` | M |
| F-24 | Docs drift | Low | `docs/SECURITY.md` says "device with 10 failures is blocked" and "salted IP hash"; true only if F-02 is fixed; Dockerfile header comment says "NOT deployed" | `docs/SECURITY.md:8`, `Dockerfile:1` | S |

Severity note: no finding is "Critical" under the stated definition (nothing is exploitable for data loss/takeover that I could confirm). F-02 and F-03 could become Critical depending on the points in "Not verified".

## 3. Findings in detail

### F-01 — No backup/restore for the CRM database (High, confirmed)
* **Where:** `docs/DEPLOYMENT.md:38-39` ("schedule a copy of `/data/noqood-website.db`"); nothing in the repo does this. The ERP has a backup scheduler (`backend/src/services/backup.service.js`); the website has none.
* **Evidence:** `grep -ri backup src scripts` -> nothing. DB opened in WAL mode (`db.ts:80`), so a naive file copy while running can be inconsistent.
* **Impact:** leads (the product of all marketing spend), admin users, blog and settings are one volume away from total loss. No restore procedure is documented or tested.
* **Fix:** a small scheduled job (in-process timer started from `instrumentation.ts`, or a Railway cron) that runs `VACUUM INTO '/data/backups/noqood-YYYYMMDD.db'` (safe while live), keeps 14, and ideally uploads a copy off-volume (S3/R2). Add `scripts/restore.ts` + a documented drill. Also export leads CSV weekly to the owner mailbox as a cheap second copy.

### F-02 — Client IP comes from a client-controllable header (High, confirmed in code; exploitability depends on Railway edge — not verified)
* **Where:** `src/lib/request.ts:2-6` and `admin/actions.ts:14` both use `x-forwarded-for.split(',')[0]`, the left-most entry, which is whatever the client sent if the proxy only appends.
* **Evidence:** `curl -X POST /api/contact -H 'X-Forwarded-For: 1.2.3.<n>' ...` with a fresh `n` each time gives a new `ipHash` each time, so `overLimit(ipH, 5, 60)` (`submit.ts:32`) never trips. Same for `loginAction` (`actions.ts:20-21`, limit 10 per 15 min).
* **Impact:** (a) unlimited junk leads and unlimited alert emails (Resend free tier is 3 000/month; also each submission awaits the mail call); (b) the per-IP login throttle is void, leaving only the per-account lock (which is itself abusable, F-04). Needs the form token (trivially obtained from `/api/form-token`) and a 2.5 s wait per request — easy to script.
* **Fix:** take the **right-most** untrusted hop, i.e. the entry added by Railway's proxy (`parts[parts.length - 1]` if Railway appends one hop), or use the header Railway documents for the real client IP. Verify with one request against staging. Keep a per-process fallback key if the header is absent. Add global (not per-IP) cap, e.g. max 60 stored submissions per hour sitewide, and a daily cap on notification emails.

### F-03 — Dependency vulnerabilities (High, confirmed advisories; applicability partly suspected)
`npm audit` (run 2026-11-10): 13 vulnerabilities — 1 critical, 6 high, 6 moderate.
* **next 14.2.35 (critical):** DoS advisories (Image Optimizer `remotePatterns`; "HTTP request deserialization can lead to DoS when using insecure React Server Components"). The site uses App Router + server actions, so the second one is potentially applicable (suspected, not reproduced). The Image Optimizer one does not apply (no `remotePatterns`, `next/image` not configured for remote). Fix offered by npm: next 16.4.6 (major).
* **zod 3.x (high):** memory exhaustion on oversized *constrained collections*. Here arrays are `.max(8)` and the request body size is not capped (see below), so low practical risk. Fix is 4.x (breaking).
* **nodemailer 6.9 (high):** address-interpretation / SMTP command-injection advisories. Only reachable if SMTP is used and with attacker-controlled envelope data; the site sends to a fixed admin-set address, so low practical risk. Prod uses Resend. Fix 10.x (breaking), or simply remove nodemailer if SMTP is not needed (also removes `serverComponentsExternalPackages`).
* **postcss / glob / minimatch / eslint-config-next (high/moderate):** build-time chain only, not in the runtime request path.
* **Recommended:** schedule a branch "upgrade to Next 15/16 + React 19" with a staging deploy; meanwhile put a body-size cap in front (`/api/*` currently calls `req.json()` with no limit, `contact/route.ts:9`) and Cloudflare/Railway edge rate limiting. Remove nodemailer if not used.

### F-04 — Account lock-out can be abused to deny admin access (Medium, confirmed)
* **Where:** `auth.ts:40-44`: 5 failures lock the account 15 min, regardless of source.
* **Evidence:** 5 POSTs with a wrong password for the admin's email, repeated every 15 min, keeps the real admin out indefinitely. The email is guessable (the shown contact address).
* **Impact:** admin cannot sign in; with F-05 there is no self-service recovery.
* **Fix:** lock per (account, IP-hash) pair or use escalating delay instead of hard lock; always allow login from an IP that previously succeeded; add an "unlock" button/script; notify the owner by email when a lock occurs.

### F-05 — No password change / reset / role edit; first-admin script cannot reset (Medium, confirmed; missing feature)
* `userAction` supports only `create` and `toggle` (`actions.ts:139-157`). `create-admin.ts:8-9` exits when the user exists ("nothing changed"). A forgotten password or a lock needs direct DB surgery on the Railway volume.
* **Fix:** (1) "Change my password" page (current password + new, invalidate other sessions), (2) admin "reset password / unlock / change role" actions with audit rows, (3) `scripts/reset-admin.ts` reading `ADMIN_EMAIL`/`ADMIN_PASSWORD` from env. Guard against deactivating the last active admin (`actions.ts:150` only blocks self-deactivation, not "the other admin deactivates the only remaining admin").

### F-06 — Repeat contacts become invisible duplicates (Medium, confirmed by code reading)
* **Where:** `leads.ts:49` `createLead` stores the new submission as a new row with `duplicate_of = <first>`; `listLeads` defaults to `duplicate_of IS NULL` (`:73`); `kpis()` base query is also `duplicate_of IS NULL` (`:135`). The first lead only receives a timeline line "The same person contacted again (NQ-00012, contact)" with **no message text and no link** (`:58`).
* **Impact:** a prospect who wrote once and now requests a *demo* shows no new card, no "new" KPI, no demo-request count; the new message lives only in a row reachable via the Submissions page link. Sales can miss the hottest signal (a repeat/demo request). Also email-based matching treats `a@x.com` and an attacker-entered `a@x.com` as the same person (a stranger can pollute someone's timeline).
* **Fix:** on repeat, put the message text and source into the first lead's activity (`detail` up to 2 000 chars) and bump its status/`updated_at`; if the repeat is a demo, move the original to `demo_requested`. Show a "Repeats (n)" badge in the list. Count repeats in the dashboard.

### F-07 — Form token is replayable (Medium, confirmed)
* `security.ts:55-67`: token = `issuedAt.HMAC(issuedAt)`; not single-use, not bound to IP/UA/form kind. One fetched token validates unlimited submissions for 6 hours (only the 2.5 s minimum applies).
* **Impact:** the token proves nothing beyond "someone called `/api/form-token` once".
* **Fix:** make it single-use (store `token_hash` in a small table, delete on use / TTL), or bind it to `ipHash` + kind. Combined with F-02/F-20 this is what actually stops scripted spam; Turnstile (F-09) is the stronger answer.

### F-08 — Email alert sent synchronously, no retry (Medium, confirmed)
* `submit.ts:66` awaits `notifyNewLead`; Resend timeout 15 s (`mail.ts:33`), SMTP up to 10 s connect + 15 s socket. The visitor waits on a third party; on failure the owner is only informed through a timeline note nobody is alerted to.
* **Fix:** respond 201 right after COMMIT; run mail in a fire-and-forget promise (or a small `pending` outbox processed by a timer with 3 retries, since `submissions.notify_status` already exists). Surface "n leads with failed notification" on the dashboard. Add one retry on 5xx/429.

### F-09 — Turnstile half-implemented (Medium, confirmed)
* Server side requires `captcha` when `TURNSTILE_SECRET` is set (`submit.ts:15-16`). `grep -ri turnstile src/components` finds only the error label; no widget loads or sends `captcha`. `.env.example:26` says "When both are set the forms require a valid token."
* **Impact:** whoever sets the secret (the advertised way to harden the form, and the real answer to F-02/F-07) takes the contact form down with `captcha` errors.
* **Fix:** add the widget script (allowed in CSP: `challenges.cloudflare.com` for script + frame) and send its token as `captcha`; add a test.

### F-10 — Migration race (Medium, suspected)
* `db.ts:97` uses a deferred `BEGIN`. Two processes starting together both see `001_core` as not applied; the second's `CREATE TABLE users` fails after the first commits and the process throws. This can happen at `next build` (several static-generation workers each call `db()` against `/tmp/build.db`, `Dockerfile:9-11`) and if Railway ever runs two replicas on one volume (not recommended for SQLite anyway). I did not reproduce a failure.
* **Fix:** `BEGIN IMMEDIATE` and re-check `schema_migrations` inside the transaction; in the Dockerfile run `migrate` before `build` (already done) and set `NEXT_BUILD_CPUS=1`/`experimental.workerThreads=false` if flakiness appears.

### F-11 — CSP allows `'unsafe-inline'` scripts (Medium, confirmed; already documented as known limit)
* `next.config.mjs:6`. With no HTML-injection sink found, practical risk is low today, but the CSP gives no XSS backstop. Move to nonce-based CSP via middleware (Next 14 supports it) once the framework is upgraded (F-03). Also note the dev branch adds `unsafe-eval` only outside production (correct).

### F-12 — Login/logout without own CSRF check (Low, confirmed)
* Next server actions already verify `Origin` vs `Host`, which mitigates this in modern browsers, so it is only login-CSRF/logout-CSRF. Document it or add a hidden token on the login page.

### F-13 — No deletion/anonymisation or retention for personal data (Medium, confirmed)
* Submissions store the full payload JSON (`submit.ts:46`), leads store name/email/phone; there is no delete for either, no retention period (the policy text itself says "[period to be approved]"), and the policy promises deletion on request (`pages.ts:98`). Today it can only be done in SQL on the volume.
* **Fix:** admin "Delete lead (and its submissions)" and "Anonymise" actions (admin only, audited), plus a retention setting and a scheduled purge of spam/lost leads older than N months.

### F-14 — Legal pages contain placeholders (High for launch, confirmed)
* `src/content/pages.ts:97` ("[period to be approved]"), `:105`, `:108`, `:109` — bracketed drafting notes ("The operating entity's details must be inserted", "needs approved legal wording") are served publicly in AR and EN. `docs/LEGAL_REVIEW_NEEDED.md` already tracks this. Replace or remove before any paid campaign.

### F-15 — `ERP_URL` default (Medium, confirmed in code; production value not verified)
* `settings.ts:55` and `.env.example:5` default to `https://www.noqoodapp.com`, i.e. the site itself. The ERP moved to `https://app.noqoodapp.com`. If `ERP_URL` is not set on the Railway service, "Login to ERP" (header + mobile menu) loops back to the marketing site. Change the default to `https://app.noqoodapp.com` and verify the Railway variable.

### F-16 — Container hardening (Low, confirmed)
* `Dockerfile:14-16`: no `USER` (runs as root), no `HEALTHCHECK` (although `/api/health` exists), `CMD ["sh","-c","... && npx next start"]` does not `exec`, so SIGTERM reaches `sh` and not Node (no graceful stop; WAL is safe, but in-flight requests are cut). `next.config.mjs:22` sets `output: 'standalone'` yet the image runs `next start` with the whole `node_modules` (including dev deps, `npm ci --include=dev`) — larger image and attack surface. Fix: `exec`, non-root user owning `/data`, HEALTHCHECK, and either use standalone output or drop it.

### F-17 / F-18 / F-19 / F-20 / F-21 / F-22 (Low)
* **F-17** `leads.ts:26-31`: `SELECT * FROM leads WHERE phone IS NOT NULL` + JS filter on every submission; fine at hundreds of leads, wasteful at tens of thousands. Store a normalised `phone_digits` column with an index. Same for `publishedPosts` (`content.ts:28`) which loads all posts with bodies and filters in JS.
* **F-18** `sessions`, `audit_log`, `submissions` have no purge; expired sessions stay forever. Add a daily `DELETE`.
* **F-19** `actions.ts:43` saves any string as email/phone for a lead (no zod); `setFollowUp`/`addNote` on a missing id raise a raw FK error that is shown to the user in the flash message.
* **F-20** `submit.ts:32` counts then inserts later (not atomic): a burst of parallel requests can exceed 5. `recentByEmail` (`ratelimit.ts:15`) is never called; its `LIKE` on JSON would also be slow and brittle.
* **F-21** Export limit 5 000 rows, audited, but no per-user throttle/alert.
* **F-22** see table; use a verified sender domain on Resend and show failed notifications on the dashboard.

### F-23 — Test gaps (Low, confirmed)
13 tests, all unit-level against lib code. Not covered: route handlers (`sameOrigin`, `clientIp`), server-action CSRF and permission checks, mail code (success/failure/timeout with a stubbed `fetch`), middleware redirects, migration idempotency, Arabic text rendering/escaping, CSV export route permission. No CI configuration exists in the repo (no `.github/workflows`), so `npm run check` is run by hand only.

### F-24 — Doc drift
`docs/SECURITY.md` claims strength that depends on F-02; Dockerfile line 1 still says "NOT deployed". Update after the fixes.

## 4. Public content vs. the ERP (claims check)

Checked against `D:\projects\ROLA ERP`:
* "300+ reports in 22 categories" — **confirmed** (`reporting/catalog.js`: 316 reports, 22 categories).
* "Scheduled daily backup, keep last copies" — **confirmed** (`services/backup.service.js`, `server.js:117`, default keep 14).
* HR assistant answering from the employee's own data — **confirmed** (`hcm/advisor.service.js`).
* "Roles at module/branch level, audit log, sensitive-data protection" — **confirmed** in code (new `permissions/registry.js`, audit trail); not re-tested here.
* Not verified (needs ERP-side check by product owner): "40+ HR reports", "company data isolation covered by automated tests", "automatic bank matching", "VAT reports", "private protected attachments". Keep them only if each is demonstrable; otherwise soften.
* Pricing page: default mode is "quote"; no invented prices seen. Testimonials are off (`show_testimonials: false`). Good.

## 5. Missing features (prioritised)

1. **Backup + restore drill** (F-01) — protects the CRM.
2. **Admin account recovery & self-service password change; unlock** (F-04/F-05).
3. **Lead delete/anonymise + retention** (F-13) — needed to honour the privacy policy's own promise.
4. **Failed-notification visibility** (dashboard counter, retry) (F-08/F-22).
5. **Turnstile widget** (F-09).
6. **Two-factor auth for admins** (TOTP) — the admin panel holds PII and can edit public content.
7. Lead import/export both ways, tags, lead scoring: nice to have.
8. Observability: structured logs, error reporting (Sentry), uptime monitor on `/api/health`, alert when the DB file is not on the volume.
9. i18n/accessibility: the admin is English-only (`lang="en"`, hard-coded strings); public site AR/EN is fine. No automated a11y check was run (not verified).
10. Blog: plain text only (safe) but no images/markdown; no scheduled publishing; no sitemap entry check for drafts (not verified).
11. API versioning is irrelevant (3 public endpoints), but add a request-size limit.
12. No TODO/FIXME markers were found in `src` (grep), so nothing half-finished besides Turnstile (F-09).

## 6. Quick wins (each under an hour)

* F-02: use the right-most/Railway-supplied client IP.
* F-15: default `ERP_URL` to `https://app.noqoodapp.com`, confirm the Railway variable.
* F-14: remove or fill the four bracket placeholders.
* F-16: `exec` in CMD, `USER node`, HEALTHCHECK on `/api/health`.
* F-10: `BEGIN IMMEDIATE` in `migrate`.
* F-06: write the repeat's message into the first lead's timeline.
* F-20: delete dead `recentByEmail` or wire it up; global cap on submissions/hour.
* F-18: daily purge of expired sessions.
* Add `.github/workflows/check.yml` running `npm run check` + `npm audit --omit=dev`.
* Cap request bodies (reject > 20 KB) in the two form routes.

## 7. Not verified

* Whether Railway's edge overwrites or appends `X-Forwarded-For` (decides how severe F-02 is) — needs one test request on staging; I made no requests to production.
* The real values of Railway variables (`ERP_URL`, `RESEND_FROM`, `SESSION_SECRET` strength, `TURNSTILE_*`).
* Actual exploitability of the Next.js advisories on 14.2.35 (advisory text only, not reproduced).
* Runtime behaviour under concurrent load (multi-worker SQLite contention, migration race) — read from code only; WAL + `busy_timeout=5000` look adequate for the expected traffic.
* Rendering/RTL/accessibility in a browser, Lighthouse/bundle size, and email deliverability (Resend domain, SPF/DKIM) — not tested.
* Admin pages other than `leads/[id]`, `submissions`, `layout`, `login` were read only through their server actions, not line-by-line.
* Content claims listed under "Not verified" in section 4.
* `.github` / CI: none present; Railway build settings not inspected.

## 8. Phase 2 status (fixes applied locally, NOT pushed)

All commits are local on `main`; nothing is pushed. `npm run check` (tsc + lint + 24 tests) passes and a production `next build` + `next start` smoke test passed (health, form-token, login and contact pages).

| ID | Status | Commit subject | Notes |
|---|---|---|---|
| F-01 | Fixed | scheduled backups | `VACUUM INTO` nightly to `/data/backups`, keep 14, `npm run db:backup` / `db:restore`. Still copy backups OFF the volume. Enables `experimental.instrumentationHook`. |
| F-02 | Fixed | trusted client IP | Takes the entry `TRUSTED_PROXY_HOPS` from the right (default 1). **Verify on Railway:** if another proxy sits in front, set the variable to 2, otherwise all visitors share one IP and the 5/hour limit hits everyone. |
| F-03 | **Not done** | | Needs a Next 15/16 + React 19 migration with a staging deploy. Left as its own task. |
| F-04 | Fixed | lock-out | A locked account still accepts logins from an address that signed in within 30 days (**auth behaviour change**). |
| F-05 | Fixed | password change/reset | New "My account" page, admin reset/unlock/role, last-active-admin guard, `npm run admin:reset`. |
| F-06 | Fixed | repeat contacts | Repeat message is copied to the first lead's timeline; a repeat demo request moves the first lead to `demo_requested`. |
| F-07 | Fixed | single-use token | **Schema change:** migration `002_used_form_tokens`. Token format is now `issued.nonce.sig` (old open pages need a reload once). |
| F-08 | Fixed | background mail | Visitor answered after the DB commit; Resend retried up to 3 times; outcome recorded afterwards. Response `notified` is `false` when a provider is configured (frontend ignores it). |
| F-09 | Fixed | Turnstile widget | Widget loads only when `TURNSTILE_SECRET` and `TURNSTILE_SITE_KEY` are both set; CSP allows `challenges.cloudflare.com`. Not tested against the real Cloudflare service. |
| F-10 | Fixed | migration lock | `BEGIN IMMEDIATE` + re-check. |
| F-11 | **Not done** | | Nonce-based CSP should follow the Next upgrade (F-03). |
| F-13 | Partly | delete lead | Admin-only "Delete lead" (with typed confirmation) removes lead, repeats, submissions, timeline. Retention job not added (period needs the owner's decision). |
| F-14 | **Not done** | | Needs the owner/lawyer to supply the real wording; I did not invent legal text. |
| F-15 | Fixed | ERP_URL default | Default `https://app.noqoodapp.com`; still check the Railway variable. |
| F-18 | Partly | housekeeping | Nightly purge of expired sessions, used tokens, audit rows older than 400 days. |

Not changed (Low): F-12, F-16, F-17, F-19 to F-24.
