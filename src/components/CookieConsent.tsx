'use client';
import { useEffect, useState } from 'react';

/**
 * Shown only when analytics is configured. Nothing non-essential loads until the visitor accepts; declining is remembered.
 * The choice is stored in localStorage on this browser only.
 */
export default function CookieConsent({ gaId, text, accept, decline }: { gaId: string; text: string; accept: string; decline: string }) {
  const [choice, setChoice] = useState<'accepted' | 'declined' | 'unset' | 'loading'>('loading');

  useEffect(() => {
    try { setChoice((localStorage.getItem('nq_consent') as 'accepted' | 'declined') || 'unset'); } catch { setChoice('unset'); }
  }, []);

  useEffect(() => {
    if (choice !== 'accepted' || !gaId || !/^G-[A-Z0-9]+$/.test(gaId)) return;
    if (document.getElementById('ga-script')) return;
    const s = document.createElement('script'); s.id = 'ga-script'; s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`; document.head.appendChild(s);
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
    w.dataLayer = w.dataLayer || []; w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date()); w.gtag('config', gaId, { anonymize_ip: true });
  }, [choice, gaId]);

  const save = (v: 'accepted' | 'declined') => { try { localStorage.setItem('nq_consent', v); } catch { /* private mode */ } setChoice(v); };
  if (!gaId || choice !== 'unset') return null;
  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-ink-100 bg-white p-4 shadow-lift sm:bottom-6">
      <p className="text-sm text-ink-700">{text}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => save('accepted')} className="btn btn-primary !py-2">{accept}</button>
        <button type="button" onClick={() => save('declined')} className="btn btn-outline !py-2">{decline}</button>
      </div>
    </div>
  );
}
