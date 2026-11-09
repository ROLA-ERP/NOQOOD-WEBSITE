import Link from 'next/link';
import type { Metadata } from 'next';
import { href, isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { INDUSTRIES_CONTENT } from '@/content/industries';
import { CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/industries', lang === 'ar' ? 'القطاعات' : 'Industries', lang === 'ar' ? 'كيف يخدم نقود القطاعات المختلفة.' : 'How NOQOOD serves different industries.');
}

export default function Industries({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  return (
    <>
      <PageHero motion="skyline" eyebrow={t('nav.industries')} title={ar ? 'نظام واحد لأنماط عمل مختلفة' : 'One system for different ways of working'} />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES_CONTENT.map(i => <Link key={i.slug} href={href(lang, `/industries/${i.slug}`)} className="card-glow"><h2 className="text-lg font-bold text-navy-900">{i.name[lang]}</h2><p className="mt-2 text-sm text-ink-700">{i.intro[lang]}</p></Link>)}
        </div>
      </Section>
      <CtaBand lang={lang} t={t} title={ar ? 'قطاعك غير مذكور؟ تواصل معنا' : 'Your industry is not listed? Talk to us'} />
    </>
  );
}
