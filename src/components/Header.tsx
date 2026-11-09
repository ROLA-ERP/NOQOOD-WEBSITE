import Link from 'next/link';
import Image from 'next/image';
import { href, otherLang, type Lang } from '@/lib/i18n';
import type { T } from '@/lib/text';
import { erpUrl } from '@/lib/settings';
import MobileMenu from './MobileMenu';

export default function Header({ lang, t }: { lang: Lang; t: T }) {
  const items = [
    { path: '/modules', label: t('nav.modules') }, { path: '/industries', label: t('nav.industries') }, { path: '/product', label: t('nav.product') },
    { path: '/pricing', label: t('nav.pricing') }, { path: '/blog', label: t('nav.blog') }, { path: '/about', label: t('nav.about') }, { path: '/contact', label: t('nav.contact') },
  ];
  const other = otherLang(lang);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-900/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href={href(lang)} className="flex items-center gap-3" aria-label={t('brand.name')}>
          <Image src="/noqood-mark.png" alt="" width={48} height={48} className="h-12 w-12 rounded-lg" priority />
          <span className="text-lg font-extrabold text-white">NOQOOD<span className="ms-1 text-teal-400">{lang === 'ar' ? 'نقود' : 'ERP'}</span></span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {items.map(i => <Link key={i.path} href={href(lang, i.path)} className="text-sm font-semibold text-white/80 transition hover:text-white">{i.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={`/${other}`} hrefLang={other} lang={other} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/10" data-lang-switch={other}>{t('lang.switch')}</Link>
          <a href={erpUrl()} rel="noopener" className="hidden rounded-lg px-3 py-1.5 text-sm font-semibold text-white/90 hover:text-white sm:inline">{t('cta.login')}</a>
          <Link href={href(lang, '/demo')} className="btn btn-primary hidden !py-2 sm:inline-flex">{t('cta.demo')}</Link>
          <MobileMenu items={items.map(i => ({ href: href(lang, i.path), label: i.label }))} demo={{ href: href(lang, '/demo'), label: t('cta.demo') }} login={{ href: erpUrl(), label: t('cta.login') }} openLabel={lang === 'ar' ? 'القائمة' : 'Menu'} closeLabel={lang === 'ar' ? 'إغلاق' : 'Close'} />
        </div>
      </div>
    </header>
  );
}
