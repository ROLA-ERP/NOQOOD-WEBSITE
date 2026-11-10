// New-lead notifications. Two ways to send, chosen by what is configured:
//  1. RESEND_API_KEY  → Resend's HTTPS API (works on hosts that block outgoing SMTP, such as Railway's non-Pro plans)
//  2. SMTP_HOST/SMTP_USER/SMTP_PASS → a classic SMTP server
// If neither is configured the lead is still stored and the status says so. The status is stored with the submission, and nothing in the
// site claims an email was sent unless the provider really accepted it.
import nodemailer from 'nodemailer';
import { siteSettings } from './settings';

export type NotifyResult = { status: 'sent' | 'failed' | 'not_configured'; detail: string };

export const resendConfigured = (): boolean => Boolean(process.env.RESEND_API_KEY);
export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
/** True when at least one way of sending email is configured. */
export const mailConfigured = (): boolean => resendConfigured() || smtpConfigured();

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export async function notifyNewLead(kind: 'contact' | 'demo', lead: Record<string, unknown>): Promise<NotifyResult> {
  if (!mailConfigured()) return { status: 'not_configured', detail: 'No email provider is configured' };
  const to = siteSettings().notify_to || 'noqooderp@gmail.com';
  const rows = Object.entries(lead).filter(([, v]) => v !== null && v !== undefined && v !== '').map(([k, v]) => `<tr><td style="padding:4px 10px;color:#64748b">${esc(k)}</td><td style="padding:4px 10px">${esc(Array.isArray(v) ? v.join(', ') : String(v))}</td></tr>`).join('');
  const subject = kind === 'demo' ? `NOQOOD: new demo request ${lead.lead_code ?? ''}` : `NOQOOD: new inquiry ${lead.lead_code ?? ''}`;
  const html = `<h3>${kind === 'demo' ? 'New demo request' : 'New inquiry'}</h3><table>${rows}</table>`;

  if (resendConfigured()) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.RESEND_FROM || 'NOQOOD <onboarding@resend.dev>', to: [to], subject, html }),
        signal: AbortSignal.timeout(15000),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (res.ok && data.id) return { status: 'sent', detail: `accepted by Resend (id ${data.id})` };
      return { status: 'failed', detail: `Resend refused it: ${(data.message || res.statusText || String(res.status)).slice(0, 160)}` };
    } catch (e) {
      return { status: 'failed', detail: `Resend: ${(e as Error).message.slice(0, 160)}` };
    }
  }

  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 15000,
    });
    const info = await transport.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, html });
    const accepted = Array.isArray(info.accepted) ? info.accepted.length : 0;
    return accepted > 0 ? { status: 'sent', detail: `accepted by the mail server for ${accepted} recipient(s)` } : { status: 'failed', detail: 'the mail server accepted no recipient' };
  } catch (e) {
    return { status: 'failed', detail: (e as Error).message.slice(0, 200) };
  }
}
