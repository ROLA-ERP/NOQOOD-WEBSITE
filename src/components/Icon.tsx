// A small set of line icons (stroke follows the text colour). Social brand marks are simple glyphs, used only when a real profile URL is configured.
const PATHS: Record<string, string> = {
  ledger: 'M4 5h16M4 10h16M4 15h10M4 20h7M17 14l3 3 3-4',
  sales: 'M3 17l5-5 4 4 8-9M14 7h6v6',
  purchases: 'M6 6h15l-2 9H8L6 6zm0 0L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z',
  stock: 'M3 8l9-5 9 5-9 5-9-5zm0 0v8l9 5 9-5V8M12 13v8',
  hr: 'M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 21a8 8 0 0116 0',
  reports: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  branches: 'M12 3v6m0 0H5v6m7-6h7v6M5 15v0m0 0a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zM12 3a2 2 0 100 0',
  assistant: 'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z',
  check: 'M5 13l4 4L19 7',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  chat: 'M4 5h16v11H9l-5 4V5z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  users: 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M16 5a3 3 0 010 6M18 14a5 5 0 013 6',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z',
};

export function Icon({ name, className = 'h-6 w-6', title }: { name: string; className?: string; title?: string }) {
  const d = PATHS[name] || PATHS.layers;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} aria-label={title}>
      <path d={d} />
    </svg>
  );
}

const SOCIAL_GLYPH: Record<string, string> = {
  linkedin: 'in', facebook: 'f', instagram: 'ig', youtube: '▶', tiktok: '♪', x: 'X', whatsapp: 'wa',
};
export const SOCIAL_NAMES: Record<string, string> = { linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', x: 'X', whatsapp: 'WhatsApp' };

export function SocialIcon({ name }: { name: string }) {
  return <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-extrabold text-white transition hover:bg-teal-500">{SOCIAL_GLYPH[name] || name[0]}</span>;
}
