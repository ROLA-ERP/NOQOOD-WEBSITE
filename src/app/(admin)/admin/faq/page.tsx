import { guard } from '@/lib/admin';
import { db } from '@/lib/db';
import { ensureSeed } from '@/content/seed';
import { Flash, H1, Panel } from '@/components/AdminBits';
import { faqAction } from '../actions';

export const dynamic = 'force-dynamic';
type Row = { id: number; sort: number; published: number; q_ar: string; q_en: string; a_ar: string; a_en: string };

function FaqForm({ csrf, r }: { csrf: string; r?: Row }) {
  return (
    <form action={faqAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="csrf" value={csrf} /><input type="hidden" name="id" value={r?.id ?? ''} />
      <input name="q_en" required placeholder="Question (English)" defaultValue={r?.q_en} className="field" aria-label="Question English" />
      <input name="q_ar" required dir="rtl" placeholder="السؤال (عربي)" defaultValue={r?.q_ar} className="field" aria-label="Question Arabic" />
      <textarea name="a_en" required rows={3} placeholder="Answer (English)" defaultValue={r?.a_en} className="field" aria-label="Answer English" />
      <textarea name="a_ar" required dir="rtl" rows={3} placeholder="الإجابة (عربي)" defaultValue={r?.a_ar} className="field" aria-label="Answer Arabic" />
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <label className="text-sm">Order <input name="sort" type="number" defaultValue={r?.sort ?? 0} className="field !inline-block !w-20" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={r ? r.published === 1 : true} /> Published</label>
        <button className="btn btn-primary !py-2" type="submit">Save</button>
        {r && <button className="btn btn-outline !py-2 !text-red-700" type="submit" name="op" value="delete">Delete</button>}
      </div>
    </form>
  );
}

export default function FaqAdmin({ searchParams }: { searchParams: { msg?: string } }) {
  const u = guard('faq'); ensureSeed();
  const rows = db().prepare('SELECT * FROM faqs ORDER BY sort, id').all() as unknown as Row[];
  return (
    <>
      <H1>FAQ</H1><Flash msg={searchParams.msg} />
      <Panel title="Add a question"><FaqForm csrf={u.csrf} /></Panel>
      {rows.map(r => <Panel key={r.id}><FaqForm csrf={u.csrf} r={r} /></Panel>)}
    </>
  );
}
