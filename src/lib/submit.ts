// Processing of the contact and demo forms. A success answer is returned only after the submission and its lead are stored in the database.
import { db } from './db';
import { contactSchema, demoSchema, fieldErrors } from './validate';
import { checkFormToken, ipHash, sha256 } from './security';
import { overLimit } from './ratelimit';
import { createLead } from './leads';
import { mailConfigured, notifyNewLead, type NotifyResult } from './mail';

export interface SubmitContext { ip: string; userAgent?: string; lang: 'ar' | 'en'; now?: number; awaitNotify?: boolean }
export type SubmitResult =
  | { status: 201; body: { ok: true; leadCode: string; notified: boolean } }
  | { status: 400 | 422 | 429 | 500; body: { ok: false; error: string; fields?: Record<string, string> } };

async function verifyCaptcha(token: string | undefined, ip: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET) return true; // not configured: the other protections still apply
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET, response: token, remoteip: ip }) });
    const data = await res.json() as { success?: boolean };
    return Boolean(data.success);
  } catch { return false; }
}

export async function handleSubmission(kind: 'contact' | 'demo', raw: unknown, ctx: SubmitContext): Promise<SubmitResult> {
  const body = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const ipH = ipHash(ctx.ip);
  // 1) cheap bot checks first
  if (typeof body.website === 'string' && body.website.length > 0) return { status: 400, body: { ok: false, error: 'rejected' } };
  const tokenState = checkFormToken(typeof body.form_token === 'string' ? body.form_token : undefined, { now: ctx.now });
  if (tokenState === 'too_fast') return { status: 429, body: { ok: false, error: 'too_fast' } };
  if (tokenState !== 'ok') return { status: 400, body: { ok: false, error: 'expired_form' } };
  if (overLimit(ipH, 5, 60)) return { status: 429, body: { ok: false, error: 'rate_limited' } };
  if (!(await verifyCaptcha(typeof body.captcha === 'string' ? body.captcha : undefined, ctx.ip))) return { status: 400, body: { ok: false, error: 'captcha' } };

  // 2) validation (server side, whatever the browser did)
  const parsed = (kind === 'demo' ? demoSchema : contactSchema).safeParse(body);
  if (!parsed.success) return { status: 422, body: { ok: false, error: 'validation', fields: fieldErrors(parsed.error) } };
  const v = parsed.data as Record<string, unknown> & { name: string; email: string };

  // 3) store: the submission and its lead in one transaction
  let leadCode = ''; let leadId = 0; let submissionId = 0;
  const d = db();
  try {
    d.exec('BEGIN IMMEDIATE');
    // a form token works once: a replayed token is refused (the insert fails on the primary key)
    d.prepare("DELETE FROM used_form_tokens WHERE used_at < datetime('now', '-1 day')").run();
    try { d.prepare('INSERT INTO used_form_tokens (token_hash) VALUES (?)').run(sha256(String(body.form_token))); }
    catch { d.exec('ROLLBACK'); return { status: 400, body: { ok: false, error: 'expired_form' } }; }
    const payload = { ...v }; delete (payload as Record<string, unknown>).consent; delete (payload as Record<string, unknown>).website; delete (payload as Record<string, unknown>).form_token; delete (payload as Record<string, unknown>).captcha;
    const sub = d.prepare('INSERT INTO submissions (kind, payload, lang, source, ip_hash, user_agent) VALUES (?, ?, ?, ?, ?, ?)').run(kind, JSON.stringify({ ...payload, consent_given: true }), ctx.lang, kind, ipH, (ctx.userAgent || '').slice(0, 200));
    submissionId = Number(sub.lastInsertRowid);
    const notes = kind === 'demo'
      ? [`Requirements: ${v.requirements || '-'}`, `Preferred contact: ${v.contact_method}`, `Preferred demo time (requested, not booked): ${v.preferred_at || '-'}`, v.notes ? `Notes: ${v.notes}` : ''].filter(Boolean).join('\n')
      : String(v.message || '');
    const { lead } = createLead({
      name: v.name, company: v.company as string | undefined, email: v.email, phone: v.phone as string | undefined, country: v.country as string | undefined,
      industry: v.industry as string | undefined, company_size: (v.company_size || v.employees) as string | undefined, branches: v.branches as string | undefined,
      modules: v.interest as string[] | undefined, inquiry_type: kind === 'demo' ? 'demo' : (v.inquiry_type as string | undefined), source: kind, notes, lang: ctx.lang,
    });
    leadId = lead.id; leadCode = lead.lead_code;
    d.prepare('UPDATE submissions SET lead_id = ? WHERE id = ?').run(leadId, submissionId);
    d.exec('COMMIT');
  } catch (e) {
    try { d.exec('ROLLBACK'); } catch { /* nothing open */ }
    console.error('[submit] could not store the submission:', (e as Error).message);
    return { status: 500, body: { ok: false, error: 'storage' } };
  }

  // 4) notify. The visitor is answered as soon as the lead is stored; the email goes out in the background (with retries) and its real
  //    outcome is written to the submission afterwards. With no provider configured the outcome is known at once.
  const job = notifyNewLead(kind, { lead_code: leadCode, ...v, consent: undefined, website: undefined, form_token: undefined, captcha: undefined })
    .catch((e): NotifyResult => ({ status: 'failed', detail: String((e as Error).message).slice(0, 200) }))
    .then(result => {
      try {
        d.prepare('UPDATE submissions SET notify_status = ?, notify_detail = ? WHERE id = ?').run(result.status, result.detail, submissionId);
        if (result.status !== 'sent') d.prepare("INSERT INTO lead_activities (lead_id, kind, detail) VALUES (?, 'notify', ?)").run(leadId, `Email notification: ${result.status} (${result.detail})`);
      } catch (e) { console.error('[submit] could not record the notification outcome:', (e as Error).message); }
      return result;
    });
  if (!mailConfigured() || ctx.awaitNotify) { const r = await job; return { status: 201, body: { ok: true, leadCode, notified: r.status === 'sent' } }; }
  return { status: 201, body: { ok: true, leadCode, notified: false } };
}
