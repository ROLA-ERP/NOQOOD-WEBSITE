import Link from 'next/link';
import type { Metadata } from 'next';
import { href, isLang, fmtDate, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { BLOG_CATEGORIES, publishedPosts } from '@/lib/content';
import { PageHero, Section } from '@/components/Sections';

export const dynamic = 'force-dynamic'; // search and category filters depend on the query string

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/blog', lang === 'ar' ? 'مركز المعرفة' : 'Knowledge center', lang === 'ar' ? 'مقالات عملية في المحاسبة وإدارة الأعمال والمخزون والموارد البشرية.' : 'Practical articles on accounting, business management, inventory and HR.');
}

export default function Blog({ params, searchParams }: { params: { lang: string }; searchParams: { q?: string; cat?: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  const q = (searchParams.q || '').slice(0, 80);
  const cat = searchParams.cat && BLOG_CATEGORIES[searchParams.cat] ? searchParams.cat : '';
  const posts = publishedPosts(lang, { q, category: cat });
  return (
    <>
      <PageHero motion="lines" eyebrow={t('nav.blog')} title={ar ? 'مقالات تساعدك على إدارة أفضل' : 'Articles to help you manage better'} />
      <Section>
        <form role="search" action="" method="get" className="mb-6 flex max-w-xl gap-2">
          <label htmlFor="blog-q" className="sr-only">{ar ? 'بحث' : 'Search'}</label>
          <input id="blog-q" name="q" defaultValue={q} className="field" placeholder={ar ? 'ابحث في المقالات' : 'Search articles'} />
          {cat && <input type="hidden" name="cat" value={cat} />}
          <button className="btn btn-primary" type="submit">{ar ? 'بحث' : 'Search'}</button>
        </form>
        <ul className="mb-8 flex flex-wrap gap-2" aria-label={ar ? 'التصنيفات' : 'Categories'}>
          <li><Link href={href(lang, '/blog')} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${!cat ? 'bg-navy-900 text-white' : 'bg-ink-100 text-navy-800'}`}>{ar ? 'الكل' : 'All'}</Link></li>
          {Object.entries(BLOG_CATEGORIES).map(([k, v]) => <li key={k}><Link href={`${href(lang, '/blog')}?cat=${k}`} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${cat === k ? 'bg-navy-900 text-white' : 'bg-ink-100 text-navy-800'}`}>{v[lang]}</Link></li>)}
        </ul>
        {posts.length === 0 ? (
          <p className="lead">{ar ? 'لا توجد مقالات منشورة بعد. نعمل على محتوى جديد.' : 'No published articles yet. New content is on its way.'}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(p => (
              <article key={p.slug} className="card-glow">
                <p className="text-xs font-bold text-teal-700">{BLOG_CATEGORIES[p.category]?.[lang] || p.category}</p>
                <h2 className="mt-2 text-lg font-bold text-navy-900"><Link href={href(lang, `/blog/${p.slug}`)}>{p.title}</Link></h2>
                <p className="mt-2 text-sm text-ink-700">{p.excerpt}</p>
                <p className="mt-4 text-xs text-ink-500">{p.publishedAt ? fmtDate(p.publishedAt, lang) + ' · ' : ''}{p.minutes} {ar ? 'دقيقة قراءة' : 'min read'}</p>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
