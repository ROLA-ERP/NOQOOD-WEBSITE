import type { CSSProperties, ReactNode } from 'react';

// Decorative, CSS-only motion for inner pages. Each page uses its own picture so no two menus look alike.
export type Motion = 'gems' | 'rings' | 'stars' | 'blocks' | 'skyline' | 'cards' | 'coins' | 'lines' | 'bubbles' | 'link' | 'play' | 'shield';
const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });
const G = ['from-emerald-400 to-teal-600', 'from-sky-400 to-indigo-600', 'from-amber-400 to-orange-600', 'from-rose-400 to-pink-600', 'from-violet-400 to-indigo-600', 'from-fuchsia-400 to-purple-600'];
const CENTER = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2';

function Frame({ children }: { children: ReactNode }) {
  return <div aria-hidden="true" className="relative mx-auto h-[250px] w-[300px]">{children}</div>;
}

export default function PageMotion({ kind = 'rings' }: { kind?: Motion }) {
  switch (kind) {
    case 'gems':
      return (
        <Frame>
          {[0, 1, 2, 3, 4, 5].map(i => <span key={i} className={`absolute animate-pop rounded-xl bg-gradient-to-br ${G[i]} shadow-lift`} style={{ ...d(i * 0.5), width: 54 - i * 4, height: 54 - i * 4, left: `${50 + 34 * Math.sin(i * 1.047)}%`, top: `${50 - 38 * Math.cos(i * 1.047)}%`, transform: 'translate(-50%,-50%) rotate(45deg)' }} />)}
          <span className={`${CENTER} h-16 w-16 animate-spinslow rounded-2xl border-2 border-teal-300/60`} />
        </Frame>
      );
    case 'rings':
      return (
        <Frame>
          {[0, 1, 2, 3].map(i => <span key={i} className="absolute inset-4 animate-ping2 rounded-full border-2 border-teal-300/70" style={d(i * 0.8)} />)}
          <span className={`${CENTER} h-24 w-24 rounded-full border border-dashed border-white/30`} />
          <span className={`${CENTER} h-14 w-14 rounded-full bg-brand-grad shadow-lift`} />
        </Frame>
      );
    case 'stars':
      return (
        <Frame>
          {[[20, 30, 36], [70, 18, 28], [50, 55, 48], [15, 75, 26], [82, 70, 34], [38, 12, 22]].map(([x, y, z], i) => (
            <svg key={i} viewBox="0 0 24 24" className="absolute animate-twinkle text-gold-400" style={{ ...d(i * 0.45), left: `${x}%`, top: `${y}%`, width: z, height: z }} fill="currentColor"><path d="M12 2l2.6 6.4 6.9.6-5.2 4.5 1.6 6.8L12 16.6 6.1 20.3l1.6-6.8L2.5 9l6.9-.6L12 2z" /></svg>
          ))}
        </Frame>
      );
    case 'blocks':
      return (
        <Frame>
          <div className="absolute inset-6 grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <span key={i} className={`animate-pop rounded-xl bg-gradient-to-br ${G[i % 6]} shadow-soft`} style={d(i * 0.22)} />)}
          </div>
        </Frame>
      );
    case 'skyline':
      return (
        <Frame>
          <div className="absolute inset-x-4 bottom-6 flex items-end gap-2">
            {[55, 90, 70, 120, 85, 105, 60].map((h, i) => (
              <span key={i} className="relative flex-1 origin-bottom animate-rise2 rounded-t-md bg-gradient-to-t from-navy-700 to-sky-400/80" style={{ ...d(i * 0.35), height: h }}>
                <i className="absolute inset-x-1.5 top-2 h-1.5 rounded bg-white/50" /><i className="absolute inset-x-1.5 top-5 h-1.5 rounded bg-white/30" />
              </span>
            ))}
          </div>
          <span className="absolute inset-x-2 bottom-5 h-0.5 rounded bg-teal-300/50" />
          <span className="absolute end-6 top-4 h-10 w-10 animate-floaty rounded-full bg-gold-400/80" />
        </Frame>
      );
    case 'cards':
      return (
        <Frame>
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute inset-x-6 animate-slidecard rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lift backdrop-blur" style={{ ...d(i * 0.9), top: 14 + i * 58, height: 74, zIndex: 3 - i }}>
              <div className={`mb-2 h-2.5 w-1/3 rounded bg-gradient-to-r ${G[i]}`} /><div className="mb-1.5 h-2 w-4/5 rounded bg-white/40" /><div className="h-2 w-3/5 rounded bg-white/25" />
            </div>
          ))}
        </Frame>
      );
    case 'coins':
      return (
        <Frame>
          <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-1">
            {[0, 1, 2, 3, 4].map(i => <span key={i} className="block h-5 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 shadow-soft" style={{ width: 120 - i * 6 }} />)}
          </div>
          {[0, 1, 2].map(i => <span key={i} className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 animate-dropin items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-500 text-sm font-extrabold text-amber-900 shadow-lift" style={{ ...d(i * 1.5), marginLeft: (i - 1) * 40 }}>$</span>)}
        </Frame>
      );
    case 'lines':
      return (
        <Frame>
          <div className="absolute inset-6 space-y-3 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
            <div className="h-3 w-1/2 origin-left animate-typeline rounded bg-teal-300" />
            {[0, 1, 2, 3, 4].map(i => <div key={i} className="h-2 origin-left animate-typeline rounded bg-white/40" style={{ ...d(0.4 + i * 0.35), width: `${95 - i * 12}%` }} />)}
          </div>
          <span className="absolute -bottom-3 -end-3 h-10 w-10 animate-floaty rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lift" />
        </Frame>
      );
    case 'bubbles': {
      const items: [string, number, number, string, number][] = [['?', 10, 12, G[0], 0], ['!', 55, 34, G[1], 0.9], ['?', 18, 62, G[2], 1.8], ['…', 62, 70, G[5], 2.6]];
      return (
        <Frame>
          {items.map(([t, x, y, c, dl], i) => <span key={i} className={`absolute flex h-16 w-24 animate-pop items-center justify-center rounded-3xl bg-gradient-to-br text-2xl font-extrabold text-white shadow-lift ${c}`} style={{ ...d(dl), left: `${x}%`, top: `${y}%` }}>{t}</span>)}
        </Frame>
      );
    }
    case 'link':
      return (
        <Frame>
          <svg viewBox="0 0 300 250" className="absolute inset-0" fill="none">
            <path d="M40 190 C90 40 210 40 260 70" stroke="rgba(255,255,255,.35)" strokeWidth="2" strokeDasharray="6 8" />
            <circle cx="40" cy="190" r="16" fill="#14b8a6" /><circle cx="260" cy="70" r="16" fill="#38bdf8" />
            <circle r="7" fill="#fff"><animateMotion dur="3s" repeatCount="indefinite" path="M40 190 C90 40 210 40 260 70" /></circle>
          </svg>
          <span className="absolute left-[10%] top-[68%] h-10 w-10 animate-ping2 rounded-full border-2 border-teal-300" />
          <span className="absolute right-[8%] top-[18%] h-10 w-10 animate-ping2 rounded-full border-2 border-sky-300" style={d(1.4)} />
        </Frame>
      );
    case 'play':
      return (
        <Frame>
          {[0, 1, 2].map(i => <span key={i} className={`${CENTER} h-24 w-24 animate-ping2 rounded-full bg-teal-400/40`} style={d(i)} />)}
          <span className={`${CENTER} flex h-24 w-24 items-center justify-center rounded-full bg-brand-grad shadow-lift`}><svg viewBox="0 0 24 24" className="h-10 w-10 translate-x-0.5 text-white" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
        </Frame>
      );
    case 'shield':
      return (
        <Frame>
          {[0, 1].map(i => <span key={i} className={`${CENTER} h-40 w-40 animate-ping2 rounded-full border-2 border-emerald-300/60`} style={d(i * 1.2)} />)}
          <svg viewBox="0 0 24 24" className={`${CENTER} h-28 w-28 animate-floaty text-teal-300`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" fill="rgba(20,184,166,.18)" /><path d="M9 12l2 2 4-4" /></svg>
        </Frame>
      );
  }
}
