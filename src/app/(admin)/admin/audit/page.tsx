import { guard } from '@/lib/admin';
import { db } from '@/lib/db';
import { H1 } from '@/components/AdminBits';

export const dynamic = 'force-dynamic';

export default function Audit() {
  guard('audit');
  const rows = db().prepare('SELECT id, email, action, entity, entity_id, detail, created_at FROM audit_log ORDER BY id DESC LIMIT 300').all() as unknown as { id: number; email: string | null; action: string; entity: string | null; entity_id: string | null; detail: string | null; created_at: string }[];
  return (
    <>
      <H1>Audit log</H1>
      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white"><table className="w-full min-w-[640px] text-sm">
        <thead className="bg-ink-50 text-xs text-ink-500"><tr>{['When', 'Who', 'Action', 'Target', 'Detail'].map(h => <th key={h} className="p-3 text-start">{h}</th>)}</tr></thead>
        <tbody>{rows.map(r => <tr key={r.id} className="border-t border-ink-100"><td className="p-3 text-xs text-ink-500">{r.created_at}</td><td className="p-3">{r.email || '—'}</td><td className="p-3 font-semibold">{r.action}</td><td className="p-3">{r.entity ? `${r.entity} ${r.entity_id ?? ''}` : '—'}</td><td className="p-3 text-xs">{r.detail || ''}</td></tr>)}</tbody>
      </table></div>
    </>
  );
}
