import Link from 'next/link';
import { guard } from '@/lib/admin';
import { db } from '@/lib/db';
import { H1 } from '@/components/AdminBits';

export const dynamic = 'force-dynamic';

export default function Submissions() {
  guard('leads');
  const rows = db().prepare('SELECT s.id, s.kind, s.lang, s.notify_status, s.notify_detail, s.created_at, l.id AS lead_id, l.lead_code, l.name FROM submissions s LEFT JOIN leads l ON l.id = s.lead_id ORDER BY s.id DESC LIMIT 200').all() as unknown as { id: number; kind: string; lang: string; notify_status: string; notify_detail: string | null; created_at: string; lead_id: number | null; lead_code: string | null; name: string | null }[];
  return (
    <>
      <H1>Form submissions</H1>
      <p className="mb-4 text-sm text-ink-700">Every contact and demo request is stored here before anything else happens. The email column tells the truth: only “sent” means the mail server accepted the notification.</p>
      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white"><table className="w-full min-w-[640px] text-sm">
        <thead className="bg-ink-50 text-xs text-ink-500"><tr>{['#', 'Type', 'Lead', 'Lang', 'Email notification', 'Received'].map(h => <th key={h} className="p-3 text-start">{h}</th>)}</tr></thead>
        <tbody>{rows.map(r => <tr key={r.id} className="border-t border-ink-100"><td className="p-3">{r.id}</td><td className="p-3">{r.kind}</td><td className="p-3">{r.lead_id ? <Link className="font-semibold text-teal-700" href={`/admin/leads/${r.lead_id}`}>{r.lead_code} · {r.name}</Link> : '—'}</td><td className="p-3">{r.lang}</td><td className={`p-3 font-semibold ${r.notify_status === 'sent' ? 'text-emerald-700' : 'text-red-700'}`}>{r.notify_status}</td><td className="p-3 text-xs text-ink-500">{r.created_at}</td></tr>)}
        {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-ink-500">Nothing received yet.</td></tr>}</tbody>
      </table></div>
    </>
  );
}
