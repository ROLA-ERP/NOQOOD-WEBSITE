import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { Icon } from '@/components/Icon';
import { MISSION, PILLARS, VISION } from '@/content/pages';
import { CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/vision-mission', lang === 'ar' ? 'الرؤية والرسالة' : 'Vision & mission', VISION[lang]);
}

export default function VisionMission({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  return (
    <>
      <PageHero motion="rings" eyebrow={ar ? 'اتجاهنا' : 'Our direction'} title={ar ? 'الرؤية والرسالة' : 'Vision & mission'} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-navy-900 bg-hero-glow p-8 text-white shadow-lift sm:p-10">
            <span className="absolute -end-4 -top-8 select-none text-[9rem] font-extrabold leading-none text-white/5" aria-hidden="true">01</span>
            <p className="eyebrow !bg-white/10 !text-teal-400">{ar ? 'إلى أين نذهب' : 'Where we are going'}</p>
            <h2 className="text-3xl font-extrabold">{ar ? 'رؤيتنا' : 'Our vision'}</h2>
            <p className="relative mt-5 text-lg leading-9 text-white/90">{VISION[lang]}</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-8 shadow-lift sm:p-10">
            <span className="absolute -end-4 -top-8 select-none text-[9rem] font-extrabold leading-none text-teal-500/10" aria-hidden="true">02</span>
            <p className="eyebrow">{ar ? 'ما الذي نفعله كل يوم' : 'What we do every day'}</p>
            <h2 className="text-3xl font-extrabold text-navy-900">{ar ? 'رسالتنا' : 'Our mission'}</h2>
            <p className="relative mt-5 text-lg leading-9 text-ink-700">{MISSION[lang]}</p>
          </div>
        </div>
      </Section>
      <Section tone="soft" eyebrow={ar ? 'كيف نحقق ذلك' : 'How we deliver it'} title={ar ? 'أربع ركائز تحوّل الرؤية إلى نظام يعمل' : 'Four pillars that turn the vision into a working system'}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(p => <div key={p.title.en} className="card-glow"><span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-grad text-white shadow-soft"><Icon name={p.icon} /></span><h3 className="text-xl font-extrabold text-navy-900">{p.title[lang]}</h3><p className="mt-2 text-sm leading-7 text-ink-700">{p.text[lang]}</p></div>)}
        </div>
      </Section>
      <CtaBand lang={lang} t={t} title={ar ? 'شاركنا رحلتك' : 'Share your journey with us'} />
    </>
  );
}
