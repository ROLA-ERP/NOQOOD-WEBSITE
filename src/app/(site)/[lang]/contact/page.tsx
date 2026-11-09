import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { OFFICIAL, siteSettings, socialUrl, SOCIAL_KEYS } from '@/lib/settings';
import LeadFormServer from '@/components/LeadFormServer';
import { SOCIAL_NAMES } from '@/components/Icon';
import { PageHero, Section } from '@/components/Sections';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/contact', lang === 'ar' ? 'تواصل معنا' : 'Contact us', lang === 'ar' ? 'راسلنا أو اتصل بنا أو تحدث معنا عبر واتساب.' : 'Write to us, call us or chat on WhatsApp.');
}

export default function Contact({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang; const t = translator(lang); const ar = lang === 'ar';
  const s = siteSettings();
  const socials = SOCIAL_KEYS.map(k => ({ k, url: socialUrl(s.socials[k]) })).filter(x => x.url);
  return (
    <>
      <PageHero motion="link" eyebrow={t('nav.contact')} title={ar ? 'يسعدنا أن نسمع منك' : 'We’d love to hear from you'} text={ar ? 'أرسل استفسارك وسيرد عليك فريقنا.' : 'Send your inquiry and our team will reply.'} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="card-glow hover:!translate-y-0"><LeadFormServer kind="contact" lang={lang} /></div>
          <aside className="space-y-4">
            <div className="card-glow hover:!translate-y-0">
              <h2 className="font-bold text-navy-900">{ar ? 'بيانات التواصل' : 'Contact details'}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li><span className="block text-ink-500">{ar ? 'البريد' : 'Email'}</span><a className="font-semibold text-teal-700" href={`mailto:${s.email}`}>{s.email}</a></li>
                <li><span className="block text-ink-500">{ar ? 'الهاتف' : 'Phone'}</span><a className="font-semibold text-teal-700" dir="ltr" href={`tel:${s.phone}`}>{OFFICIAL.phoneDisplay}</a></li>
                <li><a className="btn btn-primary w-full" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(t('wa.prefill'))}`}>{t('cta.whatsapp')}</a></li>
              </ul>
            </div>
            {socials.length > 0 && (
              <div className="card-glow hover:!translate-y-0"><h2 className="font-bold text-navy-900">{t('footer.follow')}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">{socials.map(x => <li key={x.k}><a className="btn btn-outline !py-2" href={x.url!} target="_blank" rel="noopener noreferrer">{SOCIAL_NAMES[x.k]}</a></li>)}</ul>
              </div>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
