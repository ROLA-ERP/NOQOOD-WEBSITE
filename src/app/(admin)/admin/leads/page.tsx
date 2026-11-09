import Link from 'next/link';
import { guard } from '@/lib/admin';
import { can } from '@/lib/auth';
import { listLeads, STATUSES } from '@/lib/leads';
import { db } from '@/lib/db';
import { Flash, H1, STATUS_LABEL } from '@/components/AdminBits';

export const dynamic = 'force-dynamic';
type SP = { q?: string; status?: string; owner?: string; source?: string; industry?: string; country?: string; from?: string; to?: string; due?: string; view?: string; msg?: string };

export default function Leads({ searchParams: sp }: { searchParams: SP }) {
  const u = guard('leads');
  const view = sp.view === 'board' ? 'board' : 'table';
  const { rows, total } = listLeads({ q: sp.q, status: sp.status, owner: sp.owner, source: sp.source, industry: sp.industry, country: sp.country, from: sp.from, to: sp.to, followUpDue: sp.due === '1', limit: 500 });
  const owners = db().prepare('SELECT id, name FROM users WHERE active = 1 ORDER BY name').all() as unknown as { id: number; name: string }[];
  const qs = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== 'msg' && k !== 'view') as [string, string][]).toString();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <H1>Leads <span className="text-base font-semibold text-ink-500">({total})</span></H1>
      <Flash msg={sp.msg} />
      <form className="mb-4 grid gap-2 rounded-2xl border border-ink-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4" method="get">
        <input name="q" defaultValue={sp.q} placeholder="Search name, company, email, phone, code" className="field" aria-label="Search" />
        <select name="status" defaultValue={sp.status || ''} className="field" aria-label="Status"><option value="">All statuses</option>{STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
        <select name="owner" defaultValue={sp.owner || ''} className="field" aria-label="Owner"><option value="">Any owner</option><option value="none">Unassigned</option>{owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
        <select name="source" defaultValue={sp.source || ''} className="field" aria-label="Source"><option value="">Any source</option><option value="contact">Contact form</option><option value="demo">Demo request</option><option value="manual">Manual</option></select>
        <input name="country" defaultValue={sp.country} placeholder="Country" className="field" aria-label="Country" />
        <input name="from" type="date" defaultValue={sp.from} className="field" aria-label="Created from" />
        <input name="to" type="date" defaultValue={sp.to} className="field" aria-label="Created to" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="due" value="1" defaultChecked={sp.due === '1'} /> Follow-up due</label>
        <input type="hidden" name="view" value={view} />
        <div className="flex gap-2"><button className="btn btn-primary !py-2" type="submit">Filter</button><Link href="/admin/leads" className="btn btn-outline !py-2">Reset</Link></div>
      </form>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href={`/admin/leads?${qs}&view=table`} className={`rounded-full px-3 py-1 font-semibold ${view === 'table' ? 'bg-navy-900 text-white' : 'bg-ink-100'}`}>Table</Link>
        <Link href={`/admin/leads?${qs}&view=board`} className={`rounded-full px-3 py-1 font-semibold ${view === 'board' ? 'bg-navy-900 text-white' : 'bg-ink-100'}`}>Pipeline board</Link>
        {can(u.role, 'leads.export') && <a href={`/admin/leads/export?${qs}`} className="rounded-full bg-ink-100 px-3 py-1 font-semibold">Export CSV</a>}
      </div>
      {view === 'table' ? (
        <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-ink-50 text-start text-xs text-ink-500"><tr>{['Code', 'Name', 'Company', 'Status', 'Owner', 'Follow-up', 'Created'].map(h => <th key={h} className="p-3 text-start">{h}</th>)}</tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-ink-100">
                  <td className="p-3 font-mono text-xs"><Link className="font-semibold text-teal-700" href={`/admin/leads/${r.id}`}>{r.lead_code}</Link></td>
                  <td className="p-3">{r.name}<br /><span className="text-xs text-ink-500" dir="ltr">{r.email}</span></td>
                  <td className="p-3">{r.company || '—'}</td>
                  <td className="p-3">{STATUS_LABEL[r.status]}</td>
                  <td className="p-3">{r.owner_name || '—'}</td>
                  <td className={`p-3 ${r.follow_up_date && r.follow_up_date <= today && !['won', 'lost'].includes(r.status) ? 'font-bold text-red-700' : ''}`}>{r.follow_up_date || '—'}</td>
                  <td className="p-3 text-xs text-ink-500">{r.created_at.slice(0, 10)}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-ink-500">No leads match.</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STATUSES.map(s => {
            const col = rows.filter(r => r.status === s);
            return (
              <section key={s} aria-label={STATUS_LABEL[s]} className="w-60 shrink-0 rounded-2xl bg-ink-100 p-3">
                <h2 className="mb-2 text-sm font-bold text-navy-900">{STATUS_LABEL[s]} <span className="text-ink-500">({col.length})</span></h2>
                <ul className="space-y-2">{col.map(r => <li key={r.id} className="rounded-xl bg-white p-3 text-sm shadow-soft"><Link className="font-semibold text-teal-700" href={`/admin/leads/${r.id}`}>{r.name}</Link><p className="text-xs text-ink-500">{r.company || r.email}</p></li>)}</ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
