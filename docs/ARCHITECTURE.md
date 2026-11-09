# Architecture

```
Visitor ──► Next.js site (this repo, own service, own volume) ──► website SQLite DB (content, leads, users)
                                      │
                                      └─ "Login to ERP" is only a link to ERP_URL

ERP (separate repo / service / DB)  ◄── no code, API, session or database shared with the website
```

* **Independence.** The website never reads or writes the ERP database and has no dependency on ERP code. Its database path is `WEBSITE_DB`; the migration runs only against that file.
* **Rendering.** Public pages are statically generated and revalidated every 60 s, so admin edits appear within a minute. Blog, search and every `/admin` page are rendered on demand.
* **Languages.** `/ar` (RTL, default) and `/en` (LTR). `src/middleware.ts` sends `/` to the visitor's saved or browser language. Every page has canonical + `hreflang` alternates. Interface texts live in `src/content/ui.ts`; an administrator can override any key per language (table `content_overrides`).
* **Forms.** The browser fetches a signed, time-stamped token (`/api/form-token`), posts JSON to `/api/contact` or `/api/demo`; the server validates (zod), stores the submission and the lead in one transaction, then tries the email. The page shows success **only** after the server answered `ok: true`.
* **CRM.** `leads` (10 pipeline stages), `lead_activities` (timeline, notes), follow-up dates, owner assignment, duplicate linking (same email or phone, one pipeline card per person), KPIs computed from the table, CSV export (formula-safe).
* **Roles.** `admin` (everything), `sales` (leads, export), `editor` (blog, FAQ, texts, pricing content). Checked on every page and every server action.
* **Content ownership.** Articles, FAQs, pricing plans, texts, contact details, social links, announcement and analytics id are editable in the admin panel. Module and industry pages are code-reviewed content (they must match the ERP).

## Tables (website DB)
`users, sessions, settings, content_overrides, submissions, leads, lead_activities, posts, faqs, pricing_plans, audit_log` (+ `schema_migrations`).
