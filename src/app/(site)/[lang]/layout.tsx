import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../../globals.css';
import { dirOf, isLang, LANGS } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { siteSettings } from '@/lib/settings';
import { ensureSeed } from '@/content/seed';
import { ldString, organizationLd, pageMeta, websiteLd } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-ar', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const dynamicParams = false;
export function generateStaticParams() { return LANGS.map(lang => ({ lang })); }

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  if (!isLang(params.lang)) return {};
  const t = translator(params.lang);
  return { ...pageMeta(params.lang, '/', '', t('brand.tagline')), metadataBase: new URL(process.env.SITE_URL || 'https://www.noqoodapp.com'), icons: { icon: '/noqood-favicon.png' } };
}

export default function SiteLayout({ children, params }: { children: ReactNode; params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  ensureSeed();
  const t = translator(lang);
  const s = siteSettings();
  const note = lang === 'ar' ? s.announcement_ar : s.announcement_en;
  return (
    <html lang={lang} dir={dirOf(lang)} className={`${cairo.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3 focus:text-navy-900">{t('skip')}</a>
        {note && <p role="status" className="bg-gold-500 px-4 py-2 text-center text-sm font-bold text-navy-950">{note}</p>}
        <Header lang={lang} t={t} />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
        <WhatsAppButton lang={lang} t={t} />
        <CookieConsent gaId={s.ga_id} text={t('consent.text')} accept={t('consent.accept')} decline={t('consent.decline')} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString([organizationLd(), websiteLd()]) }} />
      </body>
    </html>
  );
}
