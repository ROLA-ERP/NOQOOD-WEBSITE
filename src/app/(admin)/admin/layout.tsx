import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import '../../globals.css';
import { can, currentUser } from '@/lib/auth';
import { logoutAction } from './actions';

export const metadata: Metadata = { title: 'NOQOOD Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const NAV: { href: string; label: string; perm: string }[] = [
  { href: '/admin', label: 'Dashboard', perm: 'dashboard' }, { href: '/admin/leads', label: 'Leads', perm: 'leads' }, { href: '/admin/submissions', label: 'Submissions', perm: 'leads' },
  { href: '/admin/blog', label: 'Blog', perm: 'blog' }, { href: '/admin/faq', label: 'FAQ', perm: 'faq' }, { href: '/admin/texts', label: 'Texts', perm: 'content' },
  { href: '/admin/plans', label: 'Pricing plans', perm: 'pricing' }, { href: '/admin/settings', label: 'Settings', perm: 'content' }, { href: '/admin/users', label: 'Users', perm: 'users' }, { href: '/admin/account', label: 'My account', perm: 'dashboard' }, { href: '/admin/audit', label: 'Audit log', perm: 'audit' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = currentUser();
  return (
    <html lang="en" dir="ltr">
      <body className="bg-ink-50">
        {user ? (
          <div className="min-h-screen md:flex">
            <aside className="bg-navy-900 p-4 text-white md:min-h-screen md:w-56">
              <p className="mb-1 text-lg font-extrabold">NOQOOD <span className="text-teal-400">Admin</span></p>
              <p className="mb-4 text-xs text-white/70">{user.name} · {user.role}</p>
              <nav aria-label="Admin" className="flex flex-wrap gap-1 md:flex-col">
                {NAV.filter(n => can(user.role, n.perm)).map(n => <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10">{n.label}</Link>)}
              </nav>
              <form action={logoutAction} className="mt-4"><button className="rounded-lg border border-white/30 px-3 py-2 text-sm font-semibold hover:bg-white/10" type="submit">Sign out</button></form>
            </aside>
            <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
          </div>
        ) : <main className="p-5">{children}</main>}
      </body>
    </html>
  );
}
