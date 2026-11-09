import type { ReactNode } from 'react';

export function Flash({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p role="status" className="mb-4 rounded-lg border border-teal-500/30 bg-teal-500/10 p-3 text-sm font-semibold text-navy-900">{msg}</p>;
}
export function H1({ children }: { children: ReactNode }) { return <h1 className="mb-6 text-2xl font-extrabold text-navy-900">{children}</h1>; }
export function Panel({ children, title }: { children: ReactNode; title?: string }) {
  return <section className="mb-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">{title && <h2 className="mb-3 font-bold text-navy-900">{title}</h2>}{children}</section>;
}
export const STATUS_LABEL: Record<string, string> = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', demo_requested: 'Demo requested', demo_scheduled: 'Demo scheduled', demo_completed: 'Demo completed', proposal_sent: 'Proposal sent', negotiation: 'Negotiation', won: 'Won', lost: 'Lost' };
