'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Fades content in as it scrolls into view. Without JavaScript or with reduced motion the content is simply visible. */
export default function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) return; // already on screen
    setShown(false);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className} style={{ transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`, opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(28px)' }}>{children}</div>;
}
