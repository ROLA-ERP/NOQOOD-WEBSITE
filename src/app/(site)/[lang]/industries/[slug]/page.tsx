import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { href, isLang, LANGS, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { breadcrumbLd, ldString, pageMeta } from '@/lib/seo';
import { INDUSTRIES_CONTENT } from '@/content/industries';
import { MODULES } from '@/content/modules';
import { Breadcrumbs, CheckList, CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap(lang => INDUSTRIES_CONTENT.map(i => ({ lang, slug: i.slug })));

export function generateMetadata({ params }: { params: { lang: string; slug: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  const i = INDUSTRIES_CONTENT.find(x => x.slug === params.slug);
  return i ? pageMeta(lang, `/industries/${i.slug}`, i.name[lang], i.intro[lang]) : {};
}

export default function IndustryPage({ params }: { params: { lang: string; slug: string } }) {
  const lang = params.lang as Lang; const ind = INDUSTRIES_CONTENT.find(x => x.slug === params.slug);
  if (!ind) notFound();
  const t = translator(lang); const ar = lang === 'ar';
  return (
    <>
      <Breadcrumbs lang={lang} items={[{ label: t('nav.home'), path: '/' }, { label: t('nav.industries'), path: '/industries' }, { label: ind.name[lang] }]} />
      <PageHero motion="skyline" eyebrow={t('nav.industries')} title={ind.name[lang]} text={ind.intro[lang]}>
        <Link href={href(lang, '/demo')} className="btn btn-primary">{t('cta.demo')}</Link>
      </PageHero>
      <Section title={ar ? 'التحديات المعتادة' : 'Common challenges'}><CheckList items={ind.challenges} lang={lang} /></Section>
      <Section tone="soft" title={ar ? 'كيف يساعد نقود' : 'How NOQOOD helps'}>
        <div className="grid gap-5 sm:grid-cols-2">
          {ind.capabilities.map(c => {
            const m = MODULES.find(x => x.slug === c.module);
            return <div key={c.module} className="card"><h3 className="font-bold text-navy-900">{m ? <Link href={href(lang, `/modules/${m.slug}`)} className="hover:text-teal-700">{m.name[lang]}</Link> : c.module}</h3><p className="mt-2 text-sm text-ink-700">{c.text[lang]}</p></div>;
          })}
        </div>
      </Section>
      <Section title={ar ? 'الفوائد' : 'Benefits'}><CheckList items={ind.benefits} lang={lang} /></Section>
      <CtaBand lang={lang} t={t} title={ar ? 'لنرَ كيف يناسب نقود عملك' : 'Let’s see how NOQOOD fits your business'} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(breadcrumbLd([{ name: t('nav.home'), path: `/${lang}` }, { name: t('nav.industries'), path: `/${lang}/industries` }, { name: ind.name[lang], path: `/${lang}/industries/${ind.slug}` }])) }} />
    </>
  );
}
