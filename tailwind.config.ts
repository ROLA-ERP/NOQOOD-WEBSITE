import type { Config } from 'tailwindcss';

// The NOQOOD palette: deep navy (from the logo), emerald and teal for growth and clarity, a restrained gold accent taken from the logo's bars.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#050e24', 900: '#081a3f', 800: '#0b2556', 700: '#12326f', 600: '#1c458f' },
        emerald: { 400: '#34d399', 500: '#10b981', 600: '#0d9d6e', 700: '#0b7f5a' },
        teal: { 400: '#2dd4bf', 500: '#14b8a6', 600: '#0e9aa7', 700: '#0b7b86' },
        gold: { 400: '#f0b94d', 500: '#e0a33a' },
        ink: { 900: '#0f172a', 700: '#334155', 500: '#64748b', 300: '#cbd5e1', 100: '#f1f5f9', 50: '#f8fafc' },
      },
      fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 10px 40px -12px rgba(8,26,63,.18)', lift: '0 24px 60px -20px rgba(8,26,63,.35)' },
      backgroundImage: {
        'hero-glow': 'radial-gradient(60% 60% at 80% 10%, rgba(20,184,166,.34), transparent 60%), radial-gradient(50% 50% at 10% 90%, rgba(99,102,241,.26), transparent 60%), radial-gradient(40% 40% at 50% 50%, rgba(16,185,129,.12), transparent 70%)',
        'brand-grad': 'linear-gradient(135deg,#10b981 0%,#14b8a6 45%,#38bdf8 100%)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        rise: { from: { opacity: '0', transform: 'translateY(22px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        drift: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(30px,-20px) scale(1.12)' } },
        spinslow: { to: { transform: 'rotate(360deg)' } },
        spinrev: { to: { transform: 'rotate(-360deg)' } },
        pulsering: { '0%,100%': { opacity: '.35', transform: 'scale(1)' }, '50%': { opacity: '.8', transform: 'scale(1.06)' } },
        grow: { '0%,100%': { transform: 'scaleY(.35)' }, '50%': { transform: 'scaleY(1)' } },
        draw: { '0%': { strokeDashoffset: '400' }, '60%,100%': { strokeDashoffset: '0' } },
        pop: { '0%,100%': { transform: 'scale(.55)', opacity: '.35' }, '50%': { transform: 'scale(1)', opacity: '1' } },
        ping2: { '0%': { transform: 'scale(.3)', opacity: '.9' }, '100%': { transform: 'scale(1.5)', opacity: '0' } },
        typeline: { '0%,100%': { transform: 'scaleX(.15)' }, '50%': { transform: 'scaleX(1)' } },
        dropin: { '0%': { transform: 'translateY(-60px)', opacity: '0' }, '25%,85%': { transform: 'translateY(0)', opacity: '1' }, '100%': { opacity: '0' } },
        slidecard: { '0%,100%': { transform: 'translateX(-14px) rotate(-3deg)' }, '50%': { transform: 'translateX(14px) rotate(3deg)' } },
        twinkle: { '0%,100%': { opacity: '.2', transform: 'scale(.7) rotate(0)' }, '50%': { opacity: '1', transform: 'scale(1.15) rotate(20deg)' } },
        rise2: { '0%,100%': { transform: 'scaleY(.2)' }, '50%': { transform: 'scaleY(1)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: { floaty: 'floaty 6s ease-in-out infinite', rise: 'rise .8s ease-out both', drift: 'drift 14s ease-in-out infinite', marquee: 'marquee 40s linear infinite', pop: 'pop 3s ease-in-out infinite', ping2: 'ping2 3.2s ease-out infinite', typeline: 'typeline 3.4s ease-in-out infinite', dropin: 'dropin 4.5s ease-in infinite', slidecard: 'slidecard 6s ease-in-out infinite', twinkle: 'twinkle 3s ease-in-out infinite', rise2: 'rise2 4s ease-in-out infinite', grow: 'grow 3.2s ease-in-out infinite', draw: 'draw 5s ease-in-out infinite', spinslow: 'spinslow 60s linear infinite', spinrev: 'spinrev 60s linear infinite', pulsering: 'pulsering 4s ease-in-out infinite' },
    },
  },
  plugins: [],
};
export default config;
