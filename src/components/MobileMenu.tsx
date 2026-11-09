'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';

export default function MobileMenu({ items, demo, login, openLabel, closeLabel }: { items: { href: string; label: string }[]; demo: { href: string; label: string }; login: { href: string; label: string }; openLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? closeLabel : openLabel} onClick={() => setOpen(o => !o)} className="rounded-lg p-2 text-white hover:bg-white/10">
        <Icon name={open ? 'close' : 'menu'} />
      </button>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="absolute inset-x-0 top-16 border-t border-white/10 bg-navy-900 p-5 shadow-lift">
          <ul className="space-y-1">
            {items.map(i => <li key={i.href}><Link href={i.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base font-semibold text-white/90 hover:bg-white/10">{i.label}</Link></li>)}
            <li><a href={login.href} className="block rounded-lg px-3 py-3 text-base font-semibold text-white/90 hover:bg-white/10">{login.label}</a></li>
          </ul>
          <Link href={demo.href} onClick={() => setOpen(false)} className="btn btn-primary mt-3 w-full">{demo.label}</Link>
        </nav>
      )}
    </div>
  );
}
