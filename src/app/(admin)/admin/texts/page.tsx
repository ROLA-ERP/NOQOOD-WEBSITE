import { guard } from '@/lib/admin';
import { UI } from '@/content/ui';
import { overrides } from '@/lib/settings';
import { Flash, H1, Panel } from '@/components/AdminBits';
import { textAction } from '../actions';

export const dynamic = 'force-dynamic';

export default function Texts({ searchParams }: { searchParams: { msg?: string; q?: string } }) {
  const u = guard('content');
  const ar = overrides('ar'); const en = overrides('en');
  const q = (searchParams.q || '').toLowerCase();
  const keys = Object.keys(UI).filter(k => !q || k.toLowerCase().includes(q) || UI[k].ar.includes(q) || UI[k].en.toLowerCase().includes(q));
  return (
    <>
      <H1>Interface texts</H1><Flash msg={searchParams.msg} />
      <p className="mb-4 text-sm text-ink-700">Replace any button, label or message in Arabic and English. Leave a field empty to use the built-in text. Changes appear on the site within a minute.</p>
      <form method="get" className="mb-4 flex max-w-md gap-2"><input name="q" defaultValue={searchParams.q} placeholder="Find a text" className="field" aria-label="Find" /><button className="btn btn-outline !py-2" type="submit">Find</button></form>
      {keys.map(k => (
        <Panel key={k}>
          <form action={textAction} className="grid gap-2 sm:grid-cols-[180px_1fr_1fr_auto] sm:items-start">
            <input type="hidden" name="csrf" value={u.csrf} /><input type="hidden" name="key" value={k} />
            <p className="font-mono text-xs text-ink-500">{k}</p>
            <textarea name="en" rows={2} defaultValue={en[k] ?? ''} placeholder={UI[k].en} className="field" aria-label={`${k} English`} />
            <textarea name="ar" rows={2} dir="rtl" defaultValue={ar[k] ?? ''} placeholder={UI[k].ar} className="field" aria-label={`${k} Arabic`} />
            <button className="btn btn-primary !py-2" type="submit">Save</button>
          </form>
        </Panel>
      ))}
    </>
  );
}
