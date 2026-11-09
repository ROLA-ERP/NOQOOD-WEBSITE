import { currentUser, can, audit } from '@/lib/auth';
import { listLeads, leadsToCsv } from '@/lib/leads';

export const dynamic = 'force-dynamic';

/** CSV export: only roles holding the "leads.export" permission; formula-looking cells are neutralised by csvCell. */
export async function GET(req: Request) {
  const u = currentUser();
  if (!u || !can(u.role, 'leads.export')) return new Response('Forbidden', { status: 403 });
  const p = new URL(req.url).searchParams;
  const { rows } = listLeads({ q: p.get('q') || undefined, status: p.get('status') || undefined, owner: p.get('owner') || undefined, source: p.get('source') || undefined, country: p.get('country') || undefined, from: p.get('from') || undefined, to: p.get('to') || undefined, followUpDue: p.get('due') === '1', limit: 5000 });
  audit(u, 'leads_export', 'lead', undefined, `${rows.length} rows`);
  return new Response(leadsToCsv(rows), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="noqood-leads-${new Date().toISOString().slice(0, 10)}.csv"`, 'Cache-Control': 'no-store' } });
}
