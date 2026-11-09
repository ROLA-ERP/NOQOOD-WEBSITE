// New-lead notifications. Email is sent only when SMTP is configured; otherwise the lead is still stored and the status says so.
// The status is stored with the submission, and nothing in the site claims an email was sent unless it really was.
import nodemailer from 'nodemailer';
import { siteSettings } from './settings';

export type NotifyResult = { status: 'sent' | 'failed' | 'not_configured'; detail: string };

export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export async function notifyNewLead(kind: 'contact' | 'demo', lead: Record<string, unknown>): Promise<NotifyResult> {
  if (!smtpConfigured()) return { status: 'not_configured', detail: 'SMTP is not configured' };
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 15000,
    });
    const to = siteSettings().notify_to || 'noqooderp@gmail.com';
    const rows = Object.entries(lead).filter(([, v]) => v !== null && v !== undefined && v !== '').map(([k, v]) => `<tr><td style="padding:4px 10px;color:#64748b">${esc(k)}</td><td style="padding:4px 10px">${esc(Array.isArray(v) ? v.join(', ') : String(v))}</td></tr>`).join('');
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER, to,
      subject: kind === 'demo' ? `NOQOOD: new demo request ${lead.lead_code ?? ''}` : `NOQOOD: new inquiry ${lead.lead_code ?? ''}`,
      html: `<h3>${kind === 'demo' ? 'New demo request' : 'New inquiry'}</h3><table>${rows}</table>`,
    });
    const accepted = Array.isArray(info.accepted) ? info.accepted.length : 0;
    return accepted > 0 ? { status: 'sent', detail: `accepted by the mail server for ${accepted} recipient(s)` } : { status: 'failed', detail: 'the mail server accepted no recipient' };
  } catch (e) {
    return { status: 'failed', detail: (e as Error).message.slice(0, 200) };
  }
}
