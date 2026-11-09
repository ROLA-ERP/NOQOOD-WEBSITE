import { guard } from '@/lib/admin';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/settings';
import { Flash, H1, Panel } from '@/components/AdminBits';
import { planAction } from '../actions';

export const dynamic = 'force-dynamic';
type Row = { id: number; sort: number; published: number; name_ar: string; name_en: string; monthly_price: number | null; annual_price: number | null; currency: string; users: number | null; branches: number | null; features_ar: string | null; features_en: string | null; cta: string | null };

function PlanForm({ csrf, r }: { csrf: string; r?: Row }) {
  return (
    <form action={planAction} className="grid gap-3 sm:grid-cols-3">
      <input type="hidden" name="csrf" value={csrf} /><input type="hidden" name="id" value={r?.id ?? ''} />
      <input name="name_en" required placeholder="Name (English)" defaultValue={r?.name_en} className="field" aria-label="Name English" />
      <input name="name_ar" required dir="rtl" placeholder="الاسم (عربي)" defaultValue={r?.name_ar} className="field" aria-label="Name Arabic" />
      <input name="currency" placeholder="Currency (KWD)" defaultValue={r?.currency ?? 'KWD'} className="field" aria-label="Currency" />
      <input name="monthly" type="number" step="0.001" placeholder="Monthly price" defaultValue={r?.monthly_price ?? ''} className="field" aria-label="Monthly price" />
      <input name="annual" type="number" step="0.001" placeholder="Annual price" defaultValue={r?.annual_price ?? ''} className="field" aria-label="Annual price" />
      <input name="users" type="number" placeholder="Users included" defaultValue={r?.users ?? ''} className="field" aria-label="Users" />
      <input name="branches" type="number" placeholder="Branches included" defaultValue={r?.branches ?? ''} className="field" aria-label="Branches" />
      <input name="cta" placeholder="Button text (optional)" defaultValue={r?.cta ?? ''} className="field" aria-label="Button text" />
      <input name="sort" type="number" placeholder="Order" defaultValue={r?.sort ?? 0} className="field" aria-label="Order" />
      <textarea name="features_en" rows={4} placeholder="Features (English), one per line" defaultValue={r?.features_en ?? ''} className="field sm:col-span-1" aria-label="Features English" />
      <textarea name="features_ar" dir="rtl" rows={4} placeholder="المزايا (عربي)، سطر لكل ميزة" defaultValue={r?.features_ar ?? ''} className="field sm:col-span-1" aria-label="Features Arabic" />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={r?.published === 1} /> Published</label>
        <button className="btn btn-primary !py-2" type="submit">Save</button>
        {r && <button className="btn btn-outline !py-2 !text-red-700" type="submit" name="op" value="delete">Delete</button>}
      </div>
    </form>
  );
}

export default function Plans({ searchParams }: { searchParams: { msg?: string } }) {
  const u = guard('pricing');
  const rows = db().prepare('SELECT * FROM pricing_plans ORDER BY sort, id').all() as unknown as Row[];
  const mode = siteSettings().pricing_mode;
  return (
    <>
      <H1>Pricing plans</H1><Flash msg={searchParams.msg} />
      <p className="mb-4 rounded-lg bg-gold-400/15 p-3 text-sm">The public Pricing page is currently in <strong>{mode === 'plans' ? 'plans' : 'request-a-quote'}</strong> mode. Plans are shown only when the mode is “plans” (Settings) and a plan is published. Enter only prices that management has approved.</p>
      <Panel title="Add a plan"><PlanForm csrf={u.csrf} /></Panel>
      {rows.map(r => <Panel key={r.id}><PlanForm csrf={u.csrf} r={r} /></Panel>)}
    </>
  );
}
