import Link from 'next/link';
import type { Metadata } from 'next';
import { href, isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { HERO, WHY, CHALLENGES, STEPS, BENEFITS, STATS, PILLARS } from '@/content/pages';
import { MODULES } from '@/content/modules';
import { INDUSTRIES_CONTENT } from '@/content/industries';
import { Icon } from '@/components/Icon';
import NetworkBg from '@/components/NetworkBg';
import ModuleOrbit from '@/components/ModuleOrbit';
import VideoSection from '@/components/VideoSection';
import { CtaBand, Section } from '@/components/Sections';

export const revalidate = 60; // admin edits to texts appear within a minute

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/', '', HERO.text[lang]);
}

export default function Home({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const t = translator(lang);
  const ar = lang === 'ar';
  const sentences = HERO.title[lang].split(/(?<=\.)\s+/).filter(Boolean);
  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 bg-hero-glow text-white">
        <NetworkBg />
        <div className="container-x relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div className="reveal">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold text-teal-400 backdrop-blur"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{HERO.eyebrow[lang]}</span>
            <h1 className="text-4xl font-extrabold leading-[1.4] sm:text-5xl">{sentences.slice(0, -1).map(s => <span key={s} className="block">{s}</span>)}<span className="grad-text block">{sentences[sentences.length - 1]}</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">{HERO.text[lang]}</p>
            <p className="mt-4 max-w-xl text-base font-bold leading-8 text-teal-400 sm:text-lg">{HERO.closing[lang]}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={href(lang, '/demo')} className="btn btn-primary !px-7 !py-4 text-base">{HERO.cta1[lang]}<Icon name="arrow" className="h-5 w-5 rtl:-scale-x-100" /></Link>
              <Link href={href(lang, '/modules')} className="btn btn-secondary !px-7 !py-4 text-base">{HERO.cta2[lang]}</Link>
            </div>
          </div>
          <div className="order-first lg:order-none"><ModuleOrbit lang={lang} /></div>
        </div>
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur">
          <ul className="container-x grid grid-cols-2 gap-6 py-6 text-center md:grid-cols-4">
            {STATS.map(x => <li key={x.value}><p className="text-3xl font-extrabold grad-text" dir="ltr">{x.value}</p><p className="mt-1 text-sm text-white/75">{x.label[lang]}</p></li>)}
          </ul>
        </div>
      </section>

      <VideoSection lang={lang} t={t} />

      <Section eyebrow={ar ? 'فلسفتنا' : 'Our philosophy'} title={ar ? 'أربع ركائز تبني عليها نقود' : 'Four pillars NOQOOD is built on'}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(p => <div key={p.title.en} className="card-glow"><span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-grad text-white shadow-soft"><Icon name={p.icon} /></span><h3 className="text-xl font-extrabold text-navy-900">{p.title[lang]}</h3><p className="mt-2 text-sm leading-7 text-ink-700">{p.text[lang]}</p></div>)}
        </div>
      </Section>

      <Section eyebrow={ar ? 'التحديات' : 'The challenge'} title={ar ? 'لماذا تتعثر الإدارة في كثير من الشركات' : 'Where management usually gets stuck'}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHALLENGES.map(c => <div key={c.title.en} className="card-glow"><h3 className="text-lg font-bold text-navy-900">{c.title[lang]}</h3><p className="mt-2 text-sm text-ink-700">{c.text[lang]}</p></div>)}
        </div>
      </Section>

      <Section tone="soft" eyebrow={ar ? 'وحدات النظام' : 'ERP modules'} title={ar ? 'كل ما تحتاجه الإدارة في منصة واحدة' : 'Everything management needs in one platform'}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map(m => (
            <Link key={m.slug} href={href(lang, `/modules/${m.slug}`)} className="card-glow group">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-grad text-white shadow-soft"><Icon name={m.icon} /></span>
              <h3 className="text-lg font-bold text-navy-900">{m.name[lang]}</h3>
              <p className="mt-2 text-sm text-ink-700">{m.tagline[lang]}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-teal-700">{t('cta.learn')}<Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow={ar ? 'لماذا نقود' : 'Why NOQOOD'} title={ar ? 'نظام صُمم ليُستخدم لا ليُعقّد' : 'Built to be used, not to complicate'}>
        <div className="grid gap-5 sm:grid-cols-2">
          {WHY.map(w => <div key={w.title.en} className="card-glow"><h3 className="text-lg font-bold text-navy-900">{w.title[lang]}</h3><p className="mt-2 text-ink-700">{w.text[lang]}</p></div>)}
        </div>
      </Section>

      <Section tone="soft" eyebrow={ar ? 'القطاعات' : 'Industries'} title={ar ? 'يخدم أنماطًا متعددة من الأعمال' : 'Serving many kinds of business'}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES_CONTENT.map(i => <Link key={i.slug} href={href(lang, `/industries/${i.slug}`)} className="card !p-5 font-bold text-navy-900">{i.name[lang]}</Link>)}
        </div>
      </Section>

      <Section eyebrow={ar ? 'الفوائد' : 'Benefits'} title={ar ? 'ما الذي يتغير في عملك' : 'What changes in your work'}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(b => <div key={b.title.en} className="card-glow"><h3 className="font-bold text-navy-900">{b.title[lang]}</h3><p className="mt-2 text-sm text-ink-700">{b.text[lang]}</p></div>)}
        </div>
      </Section>

      <Section tone="soft" eyebrow={ar ? 'كيف نبدأ' : 'How we start'} title={ar ? 'أربع خطوات إلى التشغيل' : 'Four steps to go live'}>
        <ol className="grid gap-5 md:grid-cols-4">
          {STEPS.map((s, i) => <li key={s.title.en} className="card-glow"><span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-bold text-white">{i + 1}</span><h3 className="font-bold text-navy-900">{s.title[lang]}</h3><p className="mt-2 text-sm text-ink-700">{s.text[lang]}</p></li>)}
        </ol>
      </Section>

      <CtaBand lang={lang} t={t} title={ar ? 'جاهز لرؤية نقود على بيانات شركتك؟' : 'Ready to see NOQOOD with your own business in mind?'} text={ar ? 'أخبرنا عن شركتك وسنرتب لك عرضًا يناسب احتياجك.' : 'Tell us about your company and we will arrange a demo that fits your needs.'} />
    </>
  );
}
