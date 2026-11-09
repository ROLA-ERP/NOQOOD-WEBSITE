import type { Lang, L } from '@/lib/i18n';
import type { T } from '@/lib/text';
import { PageHero, Section } from './Sections';

/** Privacy and Terms are drafts: a visible banner states that they need approved legal review before the site is published. */
export default function LegalPage({ lang, t, doc }: { lang: Lang; t: T; doc: { title: L; sections: { h: L; p: L }[] } }) {
  return (
    <>
      <PageHero motion="shield" title={doc.title[lang]} />
      <Section>
        <div className="mx-auto max-w-3xl">
          <p role="note" className="mb-8 rounded-xl border border-gold-400 bg-gold-400/10 p-4 text-sm font-bold text-navy-900">{t('draft.note')}</p>
          {doc.sections.map(s => <section key={s.h.en} className="mb-8"><h2 className="mb-3 text-xl font-extrabold text-navy-900">{s.h[lang]}</h2><p className="leading-8 text-ink-700">{s.p[lang]}</p></section>)}
        </div>
      </Section>
    </>
  );
}
