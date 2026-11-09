import { guard } from '@/lib/admin';
import { siteSettings, SOCIAL_KEYS } from '@/lib/settings';
import { smtpConfigured } from '@/lib/mail';
import { Flash, H1, Panel } from '@/components/AdminBits';
import { settingsAction } from '../actions';

export const dynamic = 'force-dynamic';

export default function Settings({ searchParams }: { searchParams: { msg?: string } }) {
  const u = guard('content');
  const s = siteSettings();
  return (
    <>
      <H1>Site settings</H1><Flash msg={searchParams.msg} />
      <form action={settingsAction}>
        <input type="hidden" name="csrf" value={u.csrf} />
        <Panel title="Contact details and notifications">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label" htmlFor="email">Public email</label><input id="email" name="email" defaultValue={s.email} className="field" /></div>
            <div><label className="label" htmlFor="notify_to">Send new-lead notifications to</label><input id="notify_to" name="notify_to" defaultValue={s.notify_to} className="field" /></div>
            <div><label className="label" htmlFor="phone">Phone (international format)</label><input id="phone" name="phone" defaultValue={s.phone} dir="ltr" className="field" /></div>
            <div><label className="label" htmlFor="whatsapp">WhatsApp number (digits only)</label><input id="whatsapp" name="whatsapp" defaultValue={s.whatsapp} dir="ltr" className="field" /></div>
          </div>
          <p className="mt-3 text-sm text-ink-700">Email delivery: {smtpConfigured() ? 'SMTP is configured.' : 'SMTP is not configured on the server, so no email can be sent yet (leads are still saved).'}</p>
        </Panel>
        <Panel title="Social media (leave empty to hide; only real https:// profile addresses)">
          <div className="grid gap-3 sm:grid-cols-2">{SOCIAL_KEYS.map(k => <div key={k}><label className="label capitalize" htmlFor={`social_${k}`}>{k}</label><input id={`social_${k}`} name={`social_${k}`} defaultValue={s.socials[k]} dir="ltr" placeholder="https://…" className="field" /></div>)}</div>
        </Panel>
        <Panel title="Analytics">
          <label className="label" htmlFor="ga_id">Google Analytics 4 measurement id</label><input id="ga_id" name="ga_id" defaultValue={s.ga_id} dir="ltr" placeholder="G-XXXXXXXXXX" className="field max-w-xs" />
          <p className="mt-2 text-xs text-ink-500">Loaded only after the visitor accepts the cookie notice. Empty = no analytics and no notice.</p>
        </Panel>
        <Panel title="Pricing page">
          <select name="pricing_mode" defaultValue={s.pricing_mode} className="field max-w-xs" aria-label="Pricing mode"><option value="quote">Request a quote (default)</option><option value="plans">Show published plans</option></select>
        </Panel>
        <Panel title="Announcement bar (empty = hidden)">
          <div className="grid gap-3 sm:grid-cols-2"><input name="announcement_en" defaultValue={s.announcement_en} placeholder="English" className="field" aria-label="Announcement English" /><input name="announcement_ar" dir="rtl" defaultValue={s.announcement_ar} placeholder="عربي" className="field" aria-label="Announcement Arabic" /></div>
        </Panel>
        <button className="btn btn-primary" type="submit">Save settings</button>
      </form>
    </>
  );
}
