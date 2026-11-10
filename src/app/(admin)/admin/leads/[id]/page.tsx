import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guard } from '@/lib/admin';
import { can } from '@/lib/auth';
import { activities, getLead, STATUSES } from '@/lib/leads';
import { db } from '@/lib/db';
import { Flash, H1, Panel, STATUS_LABEL } from '@/components/AdminBits';
import { leadAction } from '../../actions';

export const dynamic = 'force-dynamic';

export default function LeadPage({ params, searchParams }: { params: { id: string }; searchParams: { msg?: string } }) {
  const u = guard('leads');
  const lead = getLead(Number(params.id));
  if (!lead) notFound();
  const owners = db().prepare('SELECT id, name FROM users WHERE active = 1 ORDER BY name').all() as unknown as { id: number; name: string }[];
  const timeline = activities(lead.id);
  const dup = lead.duplicate_of ? getLead(lead.duplicate_of) : null;
  const sub = db().prepare("SELECT id, kind, notify_status, notify_detail, created_at FROM submissions WHERE lead_id = ? ORDER BY id DESC").all(lead.id) as unknown as { id: number; kind: string; notify_status: string; notify_detail: string | null; created_at: string }[];
  const hid = (op: string) => (<><input type="hidden" name="csrf" value={u.csrf} /><input type="hidden" name="id" value={lead.id} /><input type="hidden" name="op" value={op} /></>);
  return (
    <>
      <p className="mb-2 text-sm"><Link href="/admin/leads" className="font-semibold text-teal-700">← Leads</Link></p>
      <H1>{lead.name} <span className="font-mono text-base text-ink-500">{lead.lead_code}</span></H1>
      <Flash msg={searchParams.msg} />
      {dup && <p className="mb-4 rounded-lg bg-gold-400/15 p-3 text-sm font-semibold">Repeat contact: the first lead for this person is <Link className="text-teal-700 underline" href={`/admin/leads/${dup.id}`}>{dup.lead_code}</Link>.</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Pipeline">
          <form action={leadAction} className="flex gap-2">{hid('status')}
            <select name="status" defaultValue={lead.status} className="field" aria-label="Status">{STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
            <button className="btn btn-primary !py-2" type="submit">Update</button>
          </form>
          <form action={leadAction} className="mt-3 flex gap-2">{hid('assign')}
            <select name="owner" defaultValue={lead.owner_id ?? ''} className="field" aria-label="Owner"><option value="">Unassigned</option>{owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
            <button className="btn btn-outline !py-2" type="submit">Assign</button>
          </form>
          <form action={leadAction} className="mt-3 flex gap-2">{hid('follow')}
            <input type="date" name="date" defaultValue={lead.follow_up_date ?? ''} className="field" aria-label="Follow-up date" />
            <button className="btn btn-outline !py-2" type="submit">Set follow-up</button>
          </form>
          <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
            {[['Source', lead.source], ['Industry', lead.industry], ['Size', lead.company_size], ['Branches', lead.branches], ['Modules', lead.modules], ['Inquiry', lead.inquiry_type], ['Language', lead.lang], ['Created', lead.created_at]].map(([k, v]) => <div key={k as string}><dt className="text-xs text-ink-500">{k}</dt><dd className="font-semibold">{v || '—'}</dd></div>)}
          </dl>
        </Panel>
        <Panel title="Contact details">
          <form action={leadAction} className="space-y-2">{hid('details')}
            {[['name', 'Name', lead.name], ['company', 'Company', lead.company], ['email', 'Email', lead.email], ['phone', 'Phone', lead.phone], ['country', 'Country', lead.country]].map(([k, l, v]) => (
              <div key={k as string}><label className="label" htmlFor={`d-${k}`}>{l}</label><input id={`d-${k}`} name={k as string} defaultValue={(v as string) || ''} className="field" /></div>
            ))}
            <div><label className="label" htmlFor="d-notes">Request / notes</label><textarea id="d-notes" name="notes" rows={4} defaultValue={lead.notes || ''} className="field" /></div>
            <button className="btn btn-primary !py-2" type="submit">Save details</button>
          </form>
          <p className="mt-3 flex flex-wrap gap-3 text-sm"><a className="font-semibold text-teal-700" href={`mailto:${lead.email}`}>Email</a>{lead.phone && <a className="font-semibold text-teal-700" href={`tel:${lead.phone}`}>Call</a>}{lead.phone && <a className="font-semibold text-teal-700" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}>WhatsApp</a>}</p>
        </Panel>
      </div>
      <Panel title="Notes and timeline">
        <form action={leadAction} className="mb-4 flex gap-2">{hid('note')}
          <textarea name="note" rows={2} required className="field" placeholder="Add an internal note" aria-label="Note" />
          <button className="btn btn-primary self-start !py-2" type="submit">Add</button>
        </form>
        <ul className="space-y-3">
          {timeline.map(a => <li key={a.id} className="border-s-2 border-teal-500 ps-3 text-sm"><p className="text-xs text-ink-500">{a.created_at} · {a.user_name || 'system'} · {a.kind}</p><p className="whitespace-pre-wrap">{a.detail}</p></li>)}
        </ul>
      </Panel>
      {can(u.role, 'leads.delete') && (
        <Panel title="Delete personal data">
          <p className="mb-2 text-sm text-ink-700">Removes this lead, its notes and its form submissions (also repeat contacts linked to it). It cannot be undone.</p>
          <form action={leadAction} className="flex gap-2">{hid('delete')}
            <input name="confirm" className="field" placeholder="Type DELETE" aria-label="Type DELETE to confirm" autoComplete="off" />
            <button className="btn btn-outline !py-2" type="submit">Delete lead</button>
          </form>
        </Panel>
      )}
      {sub.length > 0 && (
        <Panel title="Form submissions and email notification">
          <ul className="text-sm">{sub.map(s => <li key={s.id}>#{s.id} {s.kind} · {s.created_at} · email: <strong>{s.notify_status}</strong>{s.notify_detail ? ` (${s.notify_detail})` : ''}</li>)}</ul>
        </Panel>
      )}
    </>
  );
}
