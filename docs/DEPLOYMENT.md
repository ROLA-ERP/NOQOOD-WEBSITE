# Deployment (prepared, NOT executed)

**Do not deploy until the owner gives explicit approval.** Nothing in this guide touches the ERP service, the ERP volume or DNS.

## 1. Create a separate Railway service (new project or new service, not the ERP one)
* Source: the website repository (create a new repository for it; do not push it into the ERP repository).
* Builder: the `Dockerfile` in this repository.
* Volume: a **new** volume mounted at `/data` (holds `noqood-website.db`). Never attach the ERP volume.
* Port: 3100 (set `PORT` if the platform requires another).

## 2. Environment variables (service settings)
| Name | Required | Value |
| --- | --- | --- |
| `SESSION_SECRET` | yes | 32+ random characters (generate it yourself, keep it private) |
| `SITE_URL` | yes | `https://www.noqoodapp.com` (only after the domain move is approved; before that the temporary Railway URL) |
| `ERP_URL` | yes | where "Login to ERP" points, e.g. `https://app.noqoodapp.com` after the move |
| `WEBSITE_DB` | image sets it | `/data/noqood-website.db` |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` `SMTP_FROM` | for email | your mail provider; without them leads are stored and the dashboard says email is not configured |
| `TURNSTILE_SITE_KEY` `TURNSTILE_SECRET` | optional | Cloudflare Turnstile |
| `GA_MEASUREMENT_ID` | optional | GA4 id (or set it in Admin → Settings) |

## 3. First run
1. Deploy. The container creates/migrates the database on start.
2. Open the service shell and create the first administrator:
   `ADMIN_EMAIL=… ADMIN_PASSWORD=… npx tsx scripts/create-admin.ts` (type the password yourself; never share it).
3. Sign in at `/admin`, review Settings (contact, socials, GA), publish reviewed articles.

## 4. Verification checklist
- [ ] `/api/health` returns `{"status":"ok","db":"ok"}`
- [ ] `/ar` and `/en` open; language switch works; `/robots.txt` and `/sitemap.xml` correct domain
- [ ] Submit a contact and a demo form: the lead appears in Admin → Leads with a reference code
- [ ] Email: submit again and check the inbox. Only if it arrives is email "working"; otherwise fix SMTP
- [ ] Admin: wrong password is refused; sales user cannot open Settings/Users; CSV export works for sales/admin only
- [ ] Privacy and Terms reviewed by a lawyer (see `LEGAL_REVIEW_NEEDED.md`)
- [ ] Real social links, if any, entered in Settings (empty = hidden)
- [ ] ERP still works at its own address (login, one invoice view)

## 5. Backups
The website DB is a single SQLite file on its volume (it holds leads). The running site makes a consistent copy (`VACUUM INTO`) one minute after start and then every `BACKUP_INTERVAL_HOURS` (default 24) into `/data/backups`, keeping `BACKUP_KEEP` (default 14); `BACKUP_ENABLED=0` turns it off.
Those copies are on the same volume, so ALSO copy `/data/backups` somewhere else regularly (download the newest file, or a scheduled job). Manual backup: `npm run db:backup`. Restore: stop the site, then `npm run db:restore -- <file>` (the previous DB is kept as `*.before-restore`). Try a restore on a copy before you need it.
