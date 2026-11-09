import Link from 'next/link';
import type { Metadata } from 'next';
import { href, isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { PRICING_NOTE } from '@/content/pages';
import { siteSettings } from '@/lib/settings';
import { publishedPlans } from '@/lib/content';
import { Icon } from '@/components/Icon';
import { CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/pricing', lang === 'ar' ? 'الأسعار' : 'Pricing', PRICING_NOTE.text[lang]);
}

export default function Pricing({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  const s = siteSettings();
  const plans = s.pricing_mode === 'plans' ? publishedPlans(lang) : [];
  const factors = ar ? ['عدد المستخدمين', 'عدد الفروع والشركات', 'الوحدات المطلوبة', 'نقل البيانات والتدريب'] : ['Number of users', 'Number of branches and companies', 'Modules you need', 'Data migration and training'];
  return (
    <>
      <PageHero motion="coins" eyebrow={t('nav.pricing')} title={PRICING_NOTE.title[lang]} text={PRICING_NOTE.text[lang]}>
        <Link href={href(lang, '/demo')} className="btn btn-primary">{t('cta.quote')}</Link>
      </PageHero>
      {plans.length > 0 ? (
        <Section title={ar ? 'الباقات' : 'Plans'}>
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map(p => (
              <div key={p.id} className="card-glow">
                <h2 className="text-xl font-extrabold text-navy-900">{p.name}</h2>
                {p.monthly != null && <p className="mt-3 text-3xl font-extrabold text-navy-900" dir="ltr">{p.monthly} <span className="text-sm font-semibold text-ink-500">{p.currency} / {ar ? 'شهر' : 'month'}</span></p>}
                {p.annual != null && <p className="text-sm text-ink-500" dir="ltr">{p.annual} {p.currency} / {ar ? 'سنة' : 'year'}</p>}
                <ul className="mt-4 space-y-2 text-sm text-ink-700">
                  {p.users != null && <li className="flex gap-2"><Icon name="check" className="h-4 w-4 text-emerald-600" />{ar ? `حتى ${p.users} مستخدم` : `Up to ${p.users} users`}</li>}
                  {p.branches != null && <li className="flex gap-2"><Icon name="check" className="h-4 w-4 text-emerald-600" />{ar ? `حتى ${p.branches} فرع` : `Up to ${p.branches} branches`}</li>}
                  {p.features.map(f => <li key={f} className="flex gap-2"><Icon name="check" className="h-4 w-4 text-emerald-600" />{f}</li>)}
                </ul>
                <Link href={href(lang, '/demo')} className="btn btn-primary mt-6 w-full">{p.cta || t('cta.quote')}</Link>
              </div>
            ))}
          </div>
        </Section>
      ) : (
        <Section title={ar ? 'ما الذي يحدد التكلفة' : 'What shapes the cost'}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{factors.map(f => <li key={f} className="card font-bold text-navy-900">{f}</li>)}</ul>
        </Section>
      )}
      <CtaBand lang={lang} t={t} title={ar ? 'احصل على عرض سعر لشركتك' : 'Get a quote for your company'} />
    </>
  );
}
