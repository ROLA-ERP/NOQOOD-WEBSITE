import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { href, isLang, fmtDate, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { breadcrumbLd, ldString, pageMeta } from '@/lib/seo';
import { siteUrl } from '@/lib/settings';
import { BLOG_CATEGORIES, publishedPost, publishedPosts } from '@/lib/content';
import { Breadcrumbs, CtaBand } from '@/components/Sections';

export const dynamic = 'force-dynamic'; // drafts become visible the moment an editor publishes them

export function generateMetadata({ params }: { params: { lang: string; slug: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  const p = publishedPost(params.slug, lang);
  return p ? pageMeta(lang, `/blog/${p.slug}`, p.title, p.excerpt || p.body.slice(0, 150), { type: 'article' }) : { robots: { index: false } };
}

export default function Article({ params }: { params: { lang: string; slug: string } }) {
  const lang = params.lang as Lang; const post = publishedPost(params.slug, lang);
  if (!post) notFound();
  const t = translator(lang); const ar = lang === 'ar';
  const related = publishedPosts(lang, { category: post.category }).filter(p => p.slug !== post.slug).slice(0, 3);
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt, inLanguage: lang, datePublished: post.publishedAt || undefined, dateModified: post.updatedAt, author: { '@type': 'Organization', name: 'NOQOOD ERP' }, publisher: { '@type': 'Organization', name: 'NOQOOD ERP', logo: { '@type': 'ImageObject', url: `${siteUrl()}/noqood-logo-full.png` } }, mainEntityOfPage: `${siteUrl()}/${lang}/blog/${post.slug}` };
  return (
    <>
      <Breadcrumbs lang={lang} items={[{ label: t('nav.home'), path: '/' }, { label: t('nav.blog'), path: '/blog' }, { label: post.title }]} />
      <article className="container-x max-w-3xl py-14">
        <p className="text-sm font-bold text-teal-700">{BLOG_CATEGORIES[post.category]?.[lang] || post.category}</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight text-navy-900">{post.title}</h1>
        <p className="mt-3 text-sm text-ink-500">{post.author}{post.publishedAt ? ` · ${fmtDate(post.publishedAt, lang)}` : ''} · {post.minutes} {ar ? 'دقيقة قراءة' : 'min read'}</p>
        {/* Plain text only: paragraphs are split on blank lines and rendered as text, so article content can never inject markup. */}
        <div className="prose-nq mt-8">{post.body.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>
      </article>
      {related.length > 0 && (
        <aside className="container-x max-w-3xl pb-14"><h2 className="mb-4 text-xl font-extrabold text-navy-900">{ar ? 'مقالات ذات صلة' : 'Related articles'}</h2>
          <ul className="space-y-2">{related.map(r => <li key={r.slug}><Link className="font-semibold text-teal-700 hover:underline" href={href(lang, `/blog/${r.slug}`)}>{r.title}</Link></li>)}</ul></aside>
      )}
      <CtaBand lang={lang} t={t} title={ar ? 'هل تريد تطبيق هذا في شركتك؟' : 'Want to put this to work in your company?'} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString([ld, breadcrumbLd([{ name: t('nav.home'), path: `/${lang}` }, { name: t('nav.blog'), path: `/${lang}/blog` }, { name: post.title, path: `/${lang}/blog/${post.slug}` }])]) }} />
    </>
  );
}
