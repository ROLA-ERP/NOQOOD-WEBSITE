import type { Metadata } from 'next';
import { isLang, type Lang } from '@/lib/i18n';
import { translator } from '@/lib/text';
import { pageMeta } from '@/lib/seo';
import { TERMS } from '@/content/pages';
import LegalPage from '@/components/LegalPage';

export const revalidate = 60;
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = (isLang(params.lang) ? params.lang : 'ar') as Lang;
  return pageMeta(lang, '/terms', TERMS.title[lang], TERMS.sections[0].p[lang].slice(0, 150));
}
export default function Terms({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  return <LegalPage lang={lang} t={translator(lang)} doc={TERMS} />;
}
