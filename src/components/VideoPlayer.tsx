'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import NetworkBg from './NetworkBg';

/**
 * Poster with a play button; the video itself is created only after the visitor clicks (nothing is downloaded before that, and sound never starts by itself).
 * The native controls provide volume, full screen and the captions menu. When no video file exists the poster says so and has no play button.
 */
export default function VideoPlayer({ src, captions, available, labels }: { src: string; captions: string; available: boolean; labels: { play: string; close: string; soon: string; title: string } }) {
  const [open, setOpen] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  const show = () => { setOpen(true); requestAnimationFrame(() => dlg.current?.showModal()); };
  const hide = () => { vid.current?.pause(); dlg.current?.close(); setOpen(false); };

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-navy-950 bg-hero-glow shadow-lift ring-1 ring-white/10">
        <NetworkBg />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center text-white">
          <Image src="/noqood-logo-full.png" alt="" width={220} height={80} className="h-auto w-40 sm:w-56" />
          <p className="max-w-md text-sm font-bold text-white/85 sm:text-lg">{labels.title}</p>
          {available ? (
            <button type="button" onClick={show} aria-label={labels.play} className="group flex h-20 w-20 items-center justify-center rounded-full bg-brand-grad shadow-lift transition hover:scale-110 sm:h-24 sm:w-24">
              <span className="absolute h-20 w-20 animate-ping2 rounded-full bg-teal-400/40 sm:h-24 sm:w-24" aria-hidden="true" />
              <svg viewBox="0 0 24 24" className="relative h-9 w-9 translate-x-0.5 text-white sm:h-10 sm:w-10" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </button>
          ) : (
            <span className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-bold text-teal-300">{labels.soon}</span>
          )}
        </div>
      </div>
      {available && (
        <dialog ref={dlg} onClose={() => setOpen(false)} onClick={e => { if (e.target === dlg.current) hide(); }} className="w-[min(96vw,1100px)] max-w-none rounded-2xl border-0 bg-black p-0 shadow-lift backdrop:bg-black/80">
          <button type="button" onClick={hide} aria-label={labels.close} className="absolute end-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1.5 text-sm font-bold text-white hover:bg-black/80">✕ {labels.close}</button>
          {open && (
            <video ref={vid} controls autoPlay playsInline preload="metadata" className="aspect-video w-full bg-black" crossOrigin="anonymous">
              <source src={src} type="video/mp4" />
              <track kind="captions" srcLang="ar" label="العربية" src={captions} default />
            </video>
          )}
        </dialog>
      )}
    </>
  );
}
