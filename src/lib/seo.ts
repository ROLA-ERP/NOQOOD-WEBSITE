import type { Metadata } from 'next';
import { siteUrl, siteSettings, socialUrl, SOCIAL_KEYS, OFFICIAL } from './settings';
import type { Lang } from './i18n';

/** Metadata for a public page: title, description, canonical, hreflang alternates, Open Graph and Twitter cards. */
export function pageMeta(lang: Lang, path: string, title: string, description: string, opts: { noindex?: boolean; type?: 'website' | 'article' } = {}): Metadata {
  const base = siteUrl();
  const p = path === '/' ? '' : path;
  const url = `${base}/${lang}${p}`;
  const brand = lang === 'ar' ? 'نقود' : 'NOQOOD ERP';
  const full = title ? `${title} | ${brand}` : (lang === 'ar' ? 'نقود — إدارة أذكى، قرارات أقوى، نمو بلا حدود' : 'NOQOOD ERP — Smarter Operations. Better Decisions. Stronger Growth');
  return {
    title: full, description,
    alternates: { canonical: url, languages: { ar: `${base}/ar${p}`, en: `${base}/en${p}`, 'x-default': `${base}/ar${p}` } },
    openGraph: { title: full, description, url, siteName: 'NOQOOD ERP', locale: lang === 'ar' ? 'ar_KW' : 'en_US', alternateLocale: lang === 'ar' ? 'en_US' : 'ar_KW', type: opts.type || 'website', images: [{ url: `${base}/noqood-banner.png`, alt: 'NOQOOD ERP' }] },
    twitter: { card: 'summary_large_image', title: full, description, images: [`${base}/noqood-banner.png`] },
    robots: opts.noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/** Organization facts that are real: name, site, official contact details, and only the social profiles the administrator configured. */
export function organizationLd() {
  const s = siteSettings();
  const sameAs = SOCIAL_KEYS.map(k => socialUrl(s.socials[k])).filter(Boolean);
  return {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'NOQOOD ERP', alternateName: 'نقود', url: siteUrl(), logo: `${siteUrl()}/noqood-logo-full.png`,
    email: s.email, telephone: OFFICIAL.phone, contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: s.email, telephone: OFFICIAL.phone, availableLanguage: ['Arabic', 'English'] }],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export const websiteLd = () => ({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'NOQOOD ERP', url: siteUrl(), inLanguage: ['ar', 'en'] });

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${siteUrl()}${it.path}` })) };
}

export function faqLd(items: { q: string; a: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(i => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) };
}

/** JSON for a <script type="application/ld+json">: "<" is escaped so content can never close the tag. */
export const ldString = (o: unknown): string => JSON.stringify(o).replace(/</g, '\\u003c');
