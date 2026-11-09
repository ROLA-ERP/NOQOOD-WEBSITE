import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { ABOUT } from '@/content/pages';
import { CheckList, CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/about', lang === 'ar' ? 'من نحن' : 'About us', ABOUT.who[lang]);
}

export default function About({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  const blocks: [string, string][] = [
    [ar ? 'من نحن' : 'Who we are', ABOUT.who[lang]], [ar ? 'غايتنا' : 'Our purpose', ABOUT.purpose[lang]], [ar ? 'فلسفتنا' : 'Our philosophy', ABOUT.philosophy[lang]],
    [ar ? 'الابتكار' : 'Innovation', ABOUT.innovation[lang]], [ar ? 'التحول الرقمي' : 'Digital transformation', ABOUT.transformation[lang]],
  ];
  return (
    <>
      <PageHero motion="gems" eyebrow={ar ? 'عن نقود' : 'About NOQOOD'} title={ar ? 'نبني نظامًا يجعل إدارة الأعمال أوضح' : 'We build software that makes running a business clearer'} />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {blocks.map(([h, p]) => <div key={h} className="card-glow"><h2 className="text-xl font-extrabold text-navy-900">{h}</h2><p className="mt-3 leading-8 text-ink-700">{p}</p></div>)}
        </div>
      </Section>
      <Section tone="soft" title={ar ? 'لماذا تختار نقود' : 'Why choose NOQOOD'}><CheckList items={ABOUT.why} lang={lang} /></Section>
      <CtaBand lang={lang} t={t} title={ar ? 'لنتحدث عن شركتك' : 'Let’s talk about your company'} />
    </>
  );
}
