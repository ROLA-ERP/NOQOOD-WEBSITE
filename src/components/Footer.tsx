import Link from 'next/link';
import Image from 'next/image';
import { href, type Lang } from '@/lib/i18n';
import type { T } from '@/lib/text';
import { siteSettings, socialUrl, OFFICIAL, SOCIAL_KEYS } from '@/lib/settings';
import { SocialIcon, SOCIAL_NAMES } from './Icon';

export default function Footer({ lang, t }: { lang: Lang; t: T }) {
  const s = siteSettings();
  const socials = SOCIAL_KEYS.map(k => ({ k, url: socialUrl(s.socials[k]) })).filter(x => x.url);
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-950 text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Image src="/noqood-mark.png" alt="" width={48} height={48} className="h-12 w-12 rounded-xl" />
          <p className="mt-4 text-sm leading-7">{t('brand.tagline')}</p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">{t('footer.company')}</h2>
          <ul className="space-y-2 text-sm">
            {[['/about', t('nav.about')], ['/vision-mission', lang === 'ar' ? 'الرؤية والرسالة' : 'Vision & mission'], ['/values', lang === 'ar' ? 'قيمنا' : 'Our values'], ['/customers', lang === 'ar' ? 'قصص العملاء' : 'Customers'], ['/contact', t('nav.contact')]].map(([p, l]) => <li key={p}><Link href={href(lang, p)} className="hover:text-white">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">{t('footer.resources')}</h2>
          <ul className="space-y-2 text-sm">
            {[['/modules', t('nav.modules')], ['/industries', t('nav.industries')], ['/pricing', t('nav.pricing')], ['/blog', t('nav.blog')], ['/faq', t('nav.faq')], ['/demo', t('cta.demo')]].map(([p, l]) => <li key={p}><Link href={href(lang, p)} className="hover:text-white">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">{t('footer.contact')}</h2>
          <ul className="space-y-2 text-sm">
            <li><a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a></li>
            <li><a href={`tel:${s.phone}`} className="hover:text-white" dir="ltr">{OFFICIAL.phoneDisplay}</a></li>
            <li><a href={`https://wa.me/${s.whatsapp}`} rel="noopener noreferrer" target="_blank" className="hover:text-white">WhatsApp</a></li>
            <li><a href="https://www.noqoodapp.com" className="hover:text-white">www.noqoodapp.com</a></li>
          </ul>
          {socials.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold text-white">{t('footer.follow')}</p>
              <ul className="flex flex-wrap gap-2">
                {socials.map(x => <li key={x.k}><a href={x.url!} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_NAMES[x.k]}><SocialIcon name={x.k} /></a></li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {year} NOQOOD ERP — {t('footer.rights')}</p>
          <p className="flex gap-4"><Link href={href(lang, '/privacy')} className="hover:text-white">{t('footer.privacy')}</Link><Link href={href(lang, '/terms')} className="hover:text-white">{t('footer.terms')}</Link></p>
        </div>
      </div>
    </footer>
  );
}
