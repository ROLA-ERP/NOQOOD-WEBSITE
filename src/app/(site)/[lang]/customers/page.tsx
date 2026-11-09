import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { TESTIMONIALS_NOTE } from '@/content/pages';
import { CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/customers', lang === 'ar' ? 'قصص العملاء' : 'Customers', TESTIMONIALS_NOTE[lang]);
}

// Customer stories and testimonials are NOT published: none exists with written approval yet. This page only says so.
export default function Customers({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  return (
    <>
      <PageHero motion="gems" eyebrow={ar ? 'العملاء' : 'Customers'} title={ar ? 'قصص العملاء' : 'Customer stories'} />
      <Section><p className="lead max-w-2xl">{TESTIMONIALS_NOTE[lang]}</p></Section>
      <CtaBand lang={lang} t={t} title={ar ? 'كن من أوائل من يعملون بنقود' : 'Be among the first to run on NOQOOD'} />
    </>
  );
}
