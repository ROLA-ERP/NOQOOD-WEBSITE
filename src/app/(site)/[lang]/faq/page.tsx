import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { faqLd, ldString, pageMeta } from '@/lib/seo';
import { publishedFaqs } from '@/lib/content';
import { CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/faq', lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', lang === 'ar' ? 'إجابات عن أكثر الأسئلة شيوعًا حول نقود.' : 'Answers to the most common questions about NOQOOD.');
}

export default function Faq({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  const faqs = publishedFaqs(lang);
  return (
    <>
      <PageHero motion="bubbles" eyebrow={t('nav.faq')} title={ar ? 'أسئلة يطرحها العملاء' : 'Questions customers ask'} />
      <Section>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map(f => (
            <details key={f.q} className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-soft open:shadow-lift">
              <summary className="cursor-pointer list-none text-lg font-bold text-navy-900 marker:hidden">{f.q}</summary>
              <p className="mt-3 leading-8 text-ink-700">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
      <CtaBand lang={lang} t={t} title={ar ? 'لم تجد إجابتك؟' : 'Did not find your answer?'} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(faqLd(faqs)) }} />}
    </>
  );
}
