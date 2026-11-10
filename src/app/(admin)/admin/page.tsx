import Link from 'next/link';
import { guard } from '@/lib/admin';
import { can } from '@/lib/auth';
import { kpis, STATUSES } from '@/lib/leads';
import { db } from '@/lib/db';
import { mailConfigured, resendConfigured } from '@/lib/mail';
import { Flash, H1, Panel, STATUS_LABEL } from '@/components/AdminBits';

export const dynamic = 'force-dynamic';

export default function Dashboard({ searchParams }: { searchParams: { msg?: string } }) {
  const u = guard('dashboard');
  const showLeads = can(u.role, 'leads');
  const k = showLeads ? kpis() : null;
  const failed = showLeads ? (db().prepare("SELECT COUNT(*) AS n FROM submissions WHERE notify_status IN ('failed','not_configured')").get() as { n: number }).n : 0;
  const cards = k ? [['Total leads', k.total], ['New', k.new], ['Qualified+', k.qualified], ['Follow-ups due', k.pendingFollowUps], ['Demo requests', k.demoRequests], ['Demos completed', k.completedDemos], ['Proposals sent', k.proposals], ['Won', k.won], ['Lost', k.lost], ['Conversion', `${k.conversionRate}%`]] : [];
  return (
    <>
      <H1>Dashboard</H1>
      <Flash msg={searchParams.msg} />
      {k && (
        <>
          <ul className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map(([l, v]) => <li key={String(l)} className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft"><p className="text-xs font-semibold text-ink-500">{l}</p><p className="mt-1 text-2xl font-extrabold text-navy-900">{v}</p></li>)}
          </ul>
          <p className="mb-4 text-xs text-ink-500">Every figure is counted from the leads table; repeat contacts from the same person are counted once.</p>
          <Panel title="Pipeline">
            <ul className="flex flex-wrap gap-2 text-sm">{STATUSES.map(s => <li key={s}><Link className="rounded-full bg-ink-100 px-3 py-1 font-semibold text-navy-800" href={`/admin/leads?status=${s}`}>{STATUS_LABEL[s]}: {k.byStatus.find(b => b.status === s)?.n ?? 0}</Link></li>)}</ul>
          </Panel>
          <Panel title="Sources"><ul className="text-sm text-ink-700">{k.bySource.length ? k.bySource.map(s => <li key={s.source}>{s.source}: <strong>{s.n}</strong></li>) : <li>No leads yet.</li>}</ul></Panel>
          <Panel title="Email notifications">
            <p className="text-sm text-ink-700">{mailConfigured() ? (resendConfigured() ? 'Email is sent through Resend.' : 'Email is sent through SMTP.') : 'No email provider is configured: new leads are saved here, but no email is sent. Set RESEND_API_KEY (or SMTP_HOST, SMTP_USER and SMTP_PASS).'}</p>
            {failed > 0 && <p className="mt-2 text-sm font-semibold text-red-700">{failed} submission(s) were stored without a confirmed email notification. Check Submissions.</p>}
          </Panel>
        </>
      )}
      {!k && <Panel><p className="text-sm text-ink-700">Use the menu to manage content.</p></Panel>}
    </>
  );
}
