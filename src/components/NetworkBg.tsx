'use client';
import { useEffect, useRef } from 'react';

/** Decorative animated background: drifting nodes joined by thin lines (a picture of "connected modules"). It carries no information and stops for reduced-motion users. */
export default function NetworkBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pts = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00025, vy: (Math.random() - 0.5) * 0.00025, r: 1 + Math.random() * 1.8 }));
    const resize = () => { const p = c.parentElement!; w = p.clientWidth; h = p.clientHeight; c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const max = Math.min(160, w / 5);
      for (const p of pts) { if (!reduce) { p.x += p.vx * 16; p.y += p.vy * 16; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; } }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = (pts[i].x - pts[j].x) * w, dy = (pts[i].y - pts[j].y) * h, d = Math.hypot(dx, dy);
          if (d < max) { ctx.strokeStyle = `rgba(45,212,191,${0.22 * (1 - d / max)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pts[i].x * w, pts[i].y * h); ctx.lineTo(pts[j].x * w, pts[j].y * h); ctx.stroke(); }
        }
      }
      for (const p of pts) { ctx.fillStyle = 'rgba(94,234,212,.7)'; ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, 6.283); ctx.fill(); }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" />;
}
