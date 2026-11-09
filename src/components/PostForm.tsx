import { BLOG_CATEGORIES, type PostRow } from '@/lib/content';
import { postAction } from '@/app/(admin)/admin/actions';

export default function PostForm({ csrf, post }: { csrf: string; post?: PostRow }) {
  const v = (k: keyof PostRow) => (post ? String(post[k] ?? '') : '');
  return (
    <form action={postAction} className="space-y-4 rounded-2xl border border-ink-100 bg-white p-5">
      <input type="hidden" name="csrf" value={csrf} /><input type="hidden" name="id" value={post?.id ?? ''} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="title_en">Title (English)</label><input id="title_en" name="title_en" required defaultValue={v('title_en')} className="field" /></div>
        <div><label className="label" htmlFor="title_ar">Title (Arabic)</label><input id="title_ar" name="title_ar" dir="rtl" required defaultValue={v('title_ar')} className="field" /></div>
        <div><label className="label" htmlFor="slug">Address (slug)</label><input id="slug" name="slug" dir="ltr" defaultValue={v('slug')} placeholder="auto from the English title" className="field" /></div>
        <div><label className="label" htmlFor="category">Category</label><select id="category" name="category" defaultValue={v('category') || 'erp-best-practices'} className="field">{Object.entries(BLOG_CATEGORIES).map(([k, c]) => <option key={k} value={k}>{c.en}</option>)}</select></div>
        <div><label className="label" htmlFor="excerpt_en">Summary (English)</label><textarea id="excerpt_en" name="excerpt_en" rows={2} defaultValue={v('excerpt_en')} className="field" /></div>
        <div><label className="label" htmlFor="excerpt_ar">Summary (Arabic)</label><textarea id="excerpt_ar" name="excerpt_ar" dir="rtl" rows={2} defaultValue={v('excerpt_ar')} className="field" /></div>
        <div><label className="label" htmlFor="body_en">Body (English) — plain text, blank line between paragraphs</label><textarea id="body_en" name="body_en" required rows={10} defaultValue={v('body_en')} className="field" /></div>
        <div><label className="label" htmlFor="body_ar">Body (Arabic)</label><textarea id="body_ar" name="body_ar" dir="rtl" required rows={10} defaultValue={v('body_ar')} className="field" /></div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="label !mb-0" htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={v('status') || 'draft'} className="field !w-auto"><option value="draft">Draft (hidden)</option><option value="published">Published</option></select>
        <button className="btn btn-primary !py-2" type="submit">Save</button>
        {post && <button className="btn btn-outline !py-2 !text-red-700" type="submit" name="op" value="delete">Delete</button>}
      </div>
    </form>
  );
}
