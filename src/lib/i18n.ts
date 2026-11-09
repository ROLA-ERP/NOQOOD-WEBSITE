export type Lang = 'ar' | 'en';
export const LANGS: Lang[] = ['ar', 'en'];
export const DEFAULT_LANG: Lang = 'ar';

export const isLang = (v: string | undefined | null): v is Lang => v === 'ar' || v === 'en';
export const dirOf = (lang: Lang): 'rtl' | 'ltr' => (lang === 'ar' ? 'rtl' : 'ltr');
export const otherLang = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar');

/** A bilingual value: { ar, en }. */
export type L<T = string> = { ar: T; en: T };
export const pick = <T,>(v: L<T>, lang: Lang): T => v[lang];

/** Numbers and dates in the reader's own conventions (Arabic text keeps Western digits for phone numbers and money). */
export const fmtDate = (iso: string, lang: Lang): string => new Date(iso.replace(' ', 'T') + (iso.includes('T') || iso.includes('Z') ? '' : 'Z')).toLocaleDateString(lang === 'ar' ? 'ar-KW-u-nu-latn' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kuwait' });
export const fmtNumber = (n: number, lang: Lang): string => new Intl.NumberFormat(lang === 'ar' ? 'ar-KW-u-nu-latn' : 'en-US').format(n);

/** Path inside a language: "/" + lang + path. */
export const href = (lang: Lang, path = ''): string => `/${lang}${path === '/' ? '' : path}`;
