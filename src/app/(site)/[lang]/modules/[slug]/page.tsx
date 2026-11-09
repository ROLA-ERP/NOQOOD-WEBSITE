import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { href, isLang, LANGS, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { breadcrumbLd, ldString, pageMeta } from '@/lib/seo';
import { MODULES } from '@/content/modules';
import { INDUSTRIES_CONTENT } from '@/content/industries';
import ProductPreview from '@/components/ProductPreview';
import { Breadcrumbs, CheckList, CtaBand, PageHero, PartialBadge, Section } from '@/components/Sections';

export const revalidate = 60;
export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap(lang => MODULES.map(m => ({ lang, slug: m.slug })));

export function generateMetadata({ params }: { params: { lang: string; slug: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  const m = MODULES.find(x => x.slug === params.slug);
  return m ? pageMeta(lang, `/modules/${m.slug}`, m.name[lang], m.tagline[lang]) : {};
}

export default function ModulePage({ params }: { params: { lang: string; slug: string } }) {
  const lang = params.lang as Lang; const m = MODULES.find(x => x.slug === params.slug);
  if (!m) notFound();
  const t = translator(lang); const ar = lang === 'ar';
  const related = m.related.map(s => MODULES.find(x => x.slug === s)).filter(Boolean) as typeof MODULES;
  const industries = INDUSTRIES_CONTENT.filter(i => i.capabilities.some(c => c.module === m.slug));
  return (
    <>
      <Breadcrumbs lang={lang} items={[{ label: t('nav.home'), path: '/' }, { label: t('nav.modules'), path: '/modules' }, { label: m.name[lang] }]} />
      <PageHero motion="blocks" eyebrow={t('nav.modules')} title={m.name[lang]} text={m.tagline[lang]}>
        <Link href={href(lang, '/demo')} className="btn btn-primary">{t('cta.demo')}</Link>
        <Link href={href(lang, '/contact')} className="btn btn-secondary">{t('cta.contact')}</Link>
      </PageHero>
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <p className="lead leading-9">{m.value[lang]}</p>
          <ProductPreview kind={m.preview} lang={lang} />
        </div>
      </Section>
      <Section tone="soft" title={ar ? 'ما الذي تقدمه الوحدة' : 'What the module offers'}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {m.features.map(f => <div key={f.title.en} className="card"><h3 className="font-bold text-navy-900">{f.title[lang]}{f.status === 'partial' && <PartialBadge lang={lang} />}</h3><p className="mt-2 text-sm text-ink-700">{f.text[lang]}</p></div>)}
        </div>
      </Section>
      <Section title={ar ? 'الفوائد' : 'Benefits'}><CheckList items={m.benefits} lang={lang} /></Section>
      {industries.length > 0 && (
        <Section tone="soft" title={ar ? 'قطاعات تستفيد منها' : 'Industries that use it'}>
          <div className="flex flex-wrap gap-3">{industries.map(i => <Link key={i.slug} href={href(lang, `/industries/${i.slug}`)} className="btn btn-outline">{i.name[lang]}</Link>)}</div>
        </Section>
      )}
      <Section title={ar ? 'وحدات ذات صلة' : 'Related modules'}>
        <div className="grid gap-5 sm:grid-cols-3">{related.map(r => <Link key={r.slug} href={href(lang, `/modules/${r.slug}`)} className="card font-bold text-navy-900">{r.name[lang]}</Link>)}</div>
      </Section>
      <CtaBand lang={lang} t={t} title={ar ? `شاهد ${m.name.ar} في عرض تجريبي` : `See ${m.name.en} in a demo`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(breadcrumbLd([{ name: t('nav.home'), path: `/${lang}` }, { name: t('nav.modules'), path: `/${lang}/modules` }, { name: m.name[lang], path: `/${lang}/modules/${m.slug}` }])) }} />
    </>
  );
}
