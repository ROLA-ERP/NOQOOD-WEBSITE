import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import Reveal from './Reveal';
import PageMotion, { type Motion } from './PageMotion';
import { href, type Lang, type L } from '@/lib/i18n';
import type { T } from '@/lib/text';

export function PageHero({ eyebrow, title, text, children, motion }: { eyebrow?: string; title: string; text?: string; children?: ReactNode; motion?: Motion }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 bg-hero-glow text-white">
      <div className="absolute -top-24 end-[-4rem] h-72 w-72 animate-drift rounded-full bg-teal-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-[-5rem] start-[-3rem] h-72 w-72 animate-drift rounded-full bg-indigo-500/20 blur-3xl [animation-delay:-7s]" aria-hidden="true" />
      <div className="container-x reveal relative grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_300px]">
        <div>
        {eyebrow && <span className="eyebrow !bg-white/10 !text-teal-400">{eyebrow}</span>}
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-white/80">{text}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="hidden lg:block"><PageMotion kind={motion} /></div>
      </div>
    </section>
  );
}

export function Section({ eyebrow, title, text, children, tone = 'white' }: { eyebrow?: string; title?: string; text?: string; children: ReactNode; tone?: 'white' | 'soft' }) {
  return (
    <section className={tone === 'soft' ? 'sec-soft' : 'sec-white'}>
      <div className="container-x py-16 sm:py-20">
        {(title || eyebrow) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2 className="h-section">{title}</h2>}
            {text && <p className="lead mt-4">{text}</p>}
          </div>
        )}
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

export function Breadcrumbs({ lang, items }: { lang: Lang; items: { label: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-ink-100 bg-white">
      <ol className="container-x flex flex-wrap items-center gap-2 py-3 text-sm text-ink-500">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.path ? <Link href={href(lang, it.path)} className="hover:text-teal-700">{it.label}</Link> : <span aria-current="page" className="font-semibold text-navy-800">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CtaBand({ lang, t, title, text }: { lang: Lang; t: T; title: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 bg-hero-glow text-white">
      <div className="absolute -top-24 end-[-4rem] h-72 w-72 animate-drift rounded-full bg-teal-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-[-5rem] start-[-3rem] h-72 w-72 animate-drift rounded-full bg-indigo-500/20 blur-3xl [animation-delay:-7s]" aria-hidden="true" />
      <div className="container-x relative flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold">{title}</h2>
          {text && <p className="mt-3 text-white/80">{text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={href(lang, '/demo')} className="btn btn-primary">{t('cta.demo')}</Link>
          <Link href={href(lang, '/contact')} className="btn btn-secondary">{t('cta.contact')}</Link>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items, lang }: { items: L[]; lang: Lang }) {
  return (
    <ul className="space-y-3">
      {items.map((b, i) => <li key={i} className="flex items-start gap-3"><span className="mt-1 text-emerald-600"><Icon name="check" className="h-5 w-5" /></span><span className="text-ink-700">{b[lang]}</span></li>)}
    </ul>
  );
}

/** Marks capabilities that exist with a narrower scope than the headline, instead of overstating them. */
export function PartialBadge({ lang }: { lang: Lang }) {
  return <span className="ms-2 rounded-full bg-gold-400/20 px-2 py-0.5 text-xs font-bold text-gold-500">{lang === 'ar' ? 'نطاق محدود' : 'Limited scope'}</span>;
}
