import { siteSettings } from '@/lib/settings';
import type { Lang } from '@/lib/i18n';
import type { T } from '@/lib/text';

/** A floating WhatsApp button on every page, with an inquiry message in the visitor's language. */
export default function WhatsAppButton({ lang, t }: { lang: Lang; t: T }) {
  const s = siteSettings();
  const link = `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(t('wa.prefill'))}`;
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" aria-label={t('wa.aria')} title={t('cta.whatsapp')}
      className={`fixed bottom-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lift transition hover:scale-105 ${lang === 'ar' ? 'left-5' : 'right-5'}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8 11.900 11.900 0 004.600 4c1.700.7 2.400.8 3.300.7a2.800 2.800 0 001.800-1.300 2.200 2.200 0 00.2-1.300c0-.1-.2-.2-.5-.3z" /></svg>
      <span className="hidden sm:inline">{t('cta.whatsapp')}</span>
    </a>
  );
}
