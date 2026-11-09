import Image from 'next/image';
import { MODULES } from '@/content/modules';
import { Icon } from './Icon';
import type { Lang } from '@/lib/i18n';

const COLORS = ['from-emerald-500 to-teal-600', 'from-sky-500 to-indigo-600', 'from-amber-500 to-orange-600', 'from-teal-500 to-cyan-600', 'from-rose-500 to-pink-600', 'from-violet-500 to-indigo-600', 'from-blue-500 to-sky-600', 'from-fuchsia-500 to-purple-600'];

/** The eight modules orbiting the NOQOOD mark: a picture of one connected system. Pure CSS motion, decorative. */
export default function ModuleOrbit({ lang, small = false, decorative = false }: { lang: Lang; small?: boolean; decorative?: boolean }) {
  const n = MODULES.length;
  return (
    <div className={`relative mx-auto ${small ? 'h-[280px] w-[280px]' : 'h-[320px] w-[320px] sm:h-[420px] sm:w-[420px]'}`} {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': lang === 'ar' ? 'الوحدات الثماني تدور حول نظام نقود' : 'The eight modules orbiting the NOQOOD system' })}>
      <div className="absolute inset-[6%] animate-pulsering rounded-full border border-dashed border-teal-400/40" />
      <div className="absolute inset-[24%] rounded-full border border-white/15" />
      <div className="absolute inset-0 animate-spinslow">
        {MODULES.map((m, i) => {
          const ang = (2 * Math.PI * i) / n;
          const left = 50 + 44 * Math.sin(ang); const top = 50 - 44 * Math.cos(ang);
          return (
            <div key={m.slug} className="absolute" style={{ left: left + '%', top: top + '%', transform: 'translate(-50%,-50%)' }}>
              <div className="animate-spinrev">
                <span title={decorative ? undefined : m.name[lang]} className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${COLORS[i]} text-white shadow-lift ring-4 ring-navy-950/60 sm:h-14 sm:w-14`}><Icon name={m.icon} className="h-6 w-6 sm:h-7 sm:w-7" /></span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute inset-[28%] flex items-center justify-center rounded-full bg-navy-900 shadow-lift ring-1 ring-teal-400/40">
        <span className="absolute inset-0 animate-pulsering rounded-full bg-teal-400/20 blur-xl" />
        <Image src="/noqood-mark.png" alt="" width={96} height={96} className="relative h-[68%] w-[68%] rounded-xl" />
      </div>
    </div>
  );
}
