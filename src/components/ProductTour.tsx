'use client';
import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import ProductPreview from './ProductPreview';
import { href, type Lang } from '@/lib/i18n';

type Tab = { slug: string; name: string; tagline: string; preview: 'ledger' | 'sales' | 'purchases' | 'stock' | 'hr' | 'reports' | 'branches' | 'assistant'; features: string[] };

/** An accessible tab set (arrow keys move between tabs) showing the illustrative preview of each module. */
export default function ProductTour({ lang, tabs, label, more }: { lang: Lang; tabs: Tab[]; label: string; more: string }) {
  const [i, setI] = useState(0);
  const cur = tabs[i];
  const onKey = (e: KeyboardEvent) => {
    const rtl = lang === 'ar';
    const next = (e.key === 'ArrowRight' && !rtl) || (e.key === 'ArrowLeft' && rtl) || e.key === 'ArrowDown';
    const prev = (e.key === 'ArrowLeft' && !rtl) || (e.key === 'ArrowRight' && rtl) || e.key === 'ArrowUp';
    if (!next && !prev) return;
    e.preventDefault();
    const n = (i + (next ? 1 : -1) + tabs.length) % tabs.length;
    setI(n); document.getElementById(`tour-tab-${n}`)?.focus();
  };
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div role="tablist" aria-label={label} aria-orientation="vertical" onKeyDown={onKey} className="flex gap-2 overflow-x-auto lg:flex-col">
        {tabs.map((t, n) => (
          <button key={t.slug} id={`tour-tab-${n}`} role="tab" type="button" aria-selected={n === i} aria-controls="tour-panel" tabIndex={n === i ? 0 : -1} onClick={() => setI(n)}
            className={`whitespace-nowrap rounded-xl px-4 py-3 text-start text-sm font-bold transition ${n === i ? 'bg-navy-900 text-white shadow-soft' : 'bg-ink-50 text-navy-800 hover:bg-ink-100'}`}>{t.name}</button>
        ))}
      </div>
      <div id="tour-panel" role="tabpanel" aria-labelledby={`tour-tab-${i}`} className="grid items-start gap-6 md:grid-cols-2">
        <ProductPreview kind={cur.preview} lang={lang} />
        <div>
          <h2 className="text-2xl font-extrabold text-navy-900">{cur.name}</h2>
          <p className="mt-2 text-ink-700">{cur.tagline}</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-700">{cur.features.map(f => <li key={f} className="flex gap-2"><span className="text-emerald-600" aria-hidden="true">✓</span>{f}</li>)}</ul>
          <Link href={href(lang, `/modules/${cur.slug}`)} className="btn btn-outline mt-6">{more}</Link>
        </div>
      </div>
    </div>
  );
}
