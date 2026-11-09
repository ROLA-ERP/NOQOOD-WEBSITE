import Link from 'next/link';
import { guard } from '@/lib/admin';
import { db } from '@/lib/db';
import { ensureSeed } from '@/content/seed';
import { Flash, H1 } from '@/components/AdminBits';

export const dynamic = 'force-dynamic';

export default function BlogAdmin({ searchParams }: { searchParams: { msg?: string } }) {
  guard('blog'); ensureSeed();
  const rows = db().prepare('SELECT id, slug, title_en, title_ar, status, category, updated_at FROM posts ORDER BY updated_at DESC').all() as unknown as { id: number; slug: string; title_en: string; title_ar: string; status: string; category: string; updated_at: string }[];
  return (
    <>
      <H1>Blog articles</H1><Flash msg={searchParams.msg} />
      <p className="mb-4 text-sm text-ink-700">The starter articles are drafts: review and edit them before publishing. Only “published” articles appear on the website.</p>
      <Link href="/admin/blog/new" className="btn btn-primary mb-4 inline-flex !py-2">New article</Link>
      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white"><table className="w-full min-w-[600px] text-sm">
        <thead className="bg-ink-50 text-xs text-ink-500"><tr>{['Title (EN)', 'Title (AR)', 'Category', 'Status', 'Updated'].map(h => <th key={h} className="p-3 text-start">{h}</th>)}</tr></thead>
        <tbody>{rows.map(r => <tr key={r.id} className="border-t border-ink-100"><td className="p-3"><Link className="font-semibold text-teal-700" href={`/admin/blog/${r.id}`}>{r.title_en}</Link></td><td className="p-3" dir="rtl">{r.title_ar}</td><td className="p-3">{r.category}</td><td className={`p-3 font-semibold ${r.status === 'published' ? 'text-emerald-700' : 'text-ink-500'}`}>{r.status}</td><td className="p-3 text-xs text-ink-500">{r.updated_at}</td></tr>)}</tbody>
      </table></div>
    </>
  );
}
