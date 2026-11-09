import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { MODULES } from '@/content/modules';
import ProductTour from '@/components/ProductTour';
import { CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/product', lang === 'ar' ? 'استعراض المنتج' : 'Product tour', lang === 'ar' ? 'جولة توضيحية في وحدات نقود.' : 'An illustrated tour of the NOQOOD modules.');
}

export default function Product({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  const tabs = MODULES.map(m => ({ slug: m.slug, name: m.name[lang], tagline: m.tagline[lang], preview: m.preview, features: m.features.slice(0, 4).map(f => f.title[lang]) }));
  return (
    <>
      <PageHero motion="cards" eyebrow={t('nav.product')} title={ar ? 'جولة في النظام' : 'A tour of the system'} text={ar ? 'معاينات توضيحية مرسومة لا تحتوي بيانات حقيقية. نعرض لك النظام الفعلي في عرض تجريبي.' : 'Illustrative previews that contain no real data. We show you the live system in a demo.'} />
      <Section>
        <ProductTour lang={lang} tabs={tabs} label={ar ? 'الوحدات' : 'Modules'} more={t('cta.learn')} />
      </Section>
      <CtaBand lang={lang} t={t} title={ar ? 'شاهد النظام الفعلي' : 'See the real system'} />
    </>
  );
}
