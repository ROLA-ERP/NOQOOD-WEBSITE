import Link from 'next/link';
import type { Metadata } from 'next';
import { href, isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { MODULES } from '@/content/modules';
import { Icon } from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { CtaBand, PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/modules', lang === 'ar' ? 'وحدات النظام' : 'ERP modules', lang === 'ar' ? 'المحاسبة والمبيعات والمشتريات والمخزون والموارد البشرية وغيرها في نظام واحد.' : 'Accounting, sales, purchasing, inventory, HR and more in one system.');
}

// A distinct accent per module so the grid reads at a glance.
const ACCENT: Record<string, string> = {
  finance: 'from-emerald-500 to-teal-600', sales: 'from-sky-500 to-indigo-600', purchasing: 'from-amber-500 to-orange-600', inventory: 'from-teal-500 to-cyan-600',
  hr: 'from-rose-500 to-pink-600', bi: 'from-violet-500 to-indigo-600', multi: 'from-blue-500 to-sky-600', automation: 'from-fuchsia-500 to-purple-600',
};

export default function Modules({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  const flow = [MODULES[1], MODULES[2], MODULES[3], MODULES[0], MODULES[5]];
  return (
    <>
      <PageHero motion="blocks" eyebrow={ar ? 'وحدات النظام' : 'ERP modules'} title={ar ? 'ثماني وحدات. نظام واحد ذكي.' : 'Eight modules. One smart system.'} text={ar ? 'كل وحدة تتكلم لغة الأخرى: ما يُسجَّل مرة واحدة يظهر أثره في الدفاتر والتقارير.' : 'Every module speaks to the others: what you record once shows up in the ledger and the reports.'} />

      <Section eyebrow={ar ? 'اختر وحدتك' : 'Pick a module'} title={ar ? 'ما الذي تحتاجه شركتك اليوم؟' : 'What does your company need today?'}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m, i) => (
            <Reveal key={m.slug} delay={(i % 4) * 90} className="h-full">
              <Link href={href(lang, `/modules/${m.slug}`)} className="card-glow group flex h-full flex-col">
                <span className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${ACCENT[m.key] || 'from-teal-500 to-emerald-600'} text-white shadow-soft transition group-hover:scale-110 group-hover:rotate-3`}><Icon name={m.icon} className="h-7 w-7" /></span>
                <h2 className="text-lg font-extrabold text-navy-900">{m.name[lang]}</h2>
                <p className="mt-2 text-sm leading-7 text-ink-700">{m.tagline[lang]}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-ink-700">
                  {m.features.slice(0, 3).map(f => <li key={f.title.en} className="flex items-start gap-2"><span className="mt-0.5 text-emerald-600"><Icon name="check" className="h-3.5 w-3.5" /></span>{f.title[lang]}</li>)}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-teal-700">{ar ? `${m.features.length} إمكانيات` : `${m.features.length} capabilities`}<Icon name="arrow" className="h-4 w-4 transition rtl:-scale-x-100" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="soft" eyebrow={ar ? 'كيف تتصل الوحدات' : 'How the modules connect'} title={ar ? 'عملية واحدة، أثر في كل مكان' : 'One transaction, effect everywhere'}>
        <Reveal>
          <ol className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {flow.map((m, i) => (
              <li key={m.slug} className="flex flex-1 items-center gap-3 md:flex-col md:text-center">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${ACCENT[m.key]} text-white shadow-lift`}><Icon name={m.icon} className="h-7 w-7" /></span>
                <span className="font-bold text-navy-900">{m.name[lang]}</span>
                {i < flow.length - 1 && <span className="hidden flex-1 border-t-2 border-dashed border-teal-500/50 md:block" aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-ink-700">{ar ? 'المبيعات والمشتريات والرواتب تغذي الدفاتر تلقائيًا، وتظهر في التقارير: دون إعادة إدخال ودون برامج منفصلة.' : 'Sales, purchasing and payroll feed the ledger automatically and show up in the reports: no re-entry, no separate programs.'}</p>
        </Reveal>
      </Section>
      <CtaBand lang={lang} t={t} title={ar ? 'أي وحدة تناسب شركتك؟' : 'Which modules fit your company?'} />
    </>
  );
}
