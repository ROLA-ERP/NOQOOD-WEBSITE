# NOQOOD website, mini CRM and admin panel

An **independent** bilingual (Arabic RTL / English LTR) marketing website for NOQOOD ERP, with a lead-management CRM and a secure admin panel.
It is a separate application with its **own database**. It does not import, call or modify the ERP application, its database, its authentication or its APIs.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS · zod · nodemailer · SQLite through Node's built-in `node:sqlite` (Node 22.13 or newer; Node 24 recommended).

## Run it locally
```bash
npm install
cp .env.example .env        # fill SESSION_SECRET (32+ random characters)
npm run db:migrate          # creates the website database (WEBSITE_DB)
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password-12+' npm run admin:create
npm run dev                 # http://localhost:3100
```
Public site: `/ar` and `/en`. Admin panel: `/admin` (sign in with the administrator you created).

## Checks
```bash
npm run typecheck && npm run lint && npm test && npm run build
```

## Where things are
| Path | What |
| --- | --- |
| `src/app/(site)/[lang]/…` | public pages (home, about, vision, values, modules, industries, product tour, pricing, blog, FAQ, contact, demo, customers, privacy, terms) |
| `src/app/(admin)/admin/…` | admin panel, server actions (`actions.ts`), CSV export |
| `src/app/api/…` | `contact`, `demo`, `form-token`, `health` |
| `src/content/…` | product/module/industry/page text in Arabic and English, starter FAQ and draft articles |
| `src/lib/…` | database, security, validation, CRM (`leads.ts`), mail, SEO, settings |
| `docs/` | discovery, architecture, security, deployment, domain migration and rollback, legal review |

See `docs/DEPLOYMENT.md` before deploying anything. **Nothing here is deployed and no domain has been changed.**
