import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import LeadFormServer from '@/components/LeadFormServer';
import { PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/demo', lang === 'ar' ? 'اطلب عرضًا تجريبيًا' : 'Request a demo', lang === 'ar' ? 'أخبرنا عن شركتك وسيتواصل معك فريق المبيعات لترتيب عرض يناسبك.' : 'Tell us about your company and our sales team will arrange a demo that fits.');
}

export default function Demo({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  return (
    <>
      <PageHero motion="play" eyebrow={t('cta.demo')} title={ar ? 'اطلب عرضًا تجريبيًا' : 'Request a demo'} text={ar ? 'نرتب لك عرضًا على احتياجات شركتك. الطلب لا يعني حجز موعد قبل أن نؤكده معك مباشرة.' : 'We arrange a demo around your company’s needs. A request is not a booking until we confirm it with you directly.'} />
      <Section><div className="card mx-auto max-w-3xl hover:!translate-y-0"><LeadFormServer kind="demo" lang={lang} /></div></Section>
    </>
  );
}
