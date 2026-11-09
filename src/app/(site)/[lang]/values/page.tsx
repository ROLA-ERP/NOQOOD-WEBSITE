import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { VALUES } from '@/content/pages';
import { CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/values', lang === 'ar' ? 'قيمنا' : 'Our values', lang === 'ar' ? 'القيم الثمانية التي نعمل بها.' : 'The eight values we work by.');
}

export default function Values({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  return (
    <>
      <PageHero motion="stars" eyebrow={ar ? 'ثقافتنا' : 'Our culture'} title={ar ? 'قيمنا الأساسية' : 'Our core values'} />
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => <li key={v.key} className="card-glow"><span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/10 font-bold text-teal-700">{i + 1}</span><h2 className="text-lg font-bold text-navy-900">{v.title[lang]}</h2><p className="mt-2 text-sm text-ink-700">{v.text[lang]}</p></li>)}
        </ul>
      </Section>
      <CtaBand lang={lang} t={t} title={ar ? 'نعمل بهذه القيم مع عملائنا' : 'We bring these values to our customers'} />
    </>
  );
}
