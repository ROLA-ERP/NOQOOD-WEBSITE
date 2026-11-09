// The mini CRM: leads created from the public forms, the pipeline, assignment, notes, follow-ups, duplicate detection, KPIs and CSV export.
import { db } from './db';
import { csvCell } from './validate';

export const STATUSES = ['new', 'contacted', 'qualified', 'demo_requested', 'demo_scheduled', 'demo_completed', 'proposal_sent', 'negotiation', 'won', 'lost'] as const;
export type Status = (typeof STATUSES)[number];

export interface Lead {
  id: number; lead_code: string; name: string; company: string | null; email: string; phone: string | null; country: string | null; industry: string | null;
  company_size: string | null; branches: string | null; modules: string | null; inquiry_type: string | null; source: string; status: Status; owner_id: number | null;
  owner_name?: string | null; notes: string | null; follow_up_date: string | null; last_contact_at: string | null; duplicate_of: number | null; lang: string | null;
  created_at: string; updated_at: string;
}

export interface NewLeadInput {
  name: string; company?: string; email: string; phone?: string; country?: string; industry?: string; company_size?: string; branches?: string;
  modules?: string[]; inquiry_type?: string; source?: string; status?: Status; notes?: string; lang?: string;
}

const digits = (p?: string) => (p || '').replace(/\D/g, '');

/** An earlier lead with the same email or the same phone number (at least 7 digits). */
export function findDuplicate(email: string, phone?: string): Lead | null {
  const byEmail = db().prepare('SELECT * FROM leads WHERE email = ? AND duplicate_of IS NULL ORDER BY id ASC LIMIT 1').get(email) as Lead | undefined;
  if (byEmail) return byEmail;
  const d = digits(phone);
  if (d.length >= 7) {
    const rows = db().prepare("SELECT * FROM leads WHERE phone IS NOT NULL AND duplicate_of IS NULL").all() as unknown as Lead[];
    const hit = rows.find(r => digits(r.phone || '').slice(-8) === d.slice(-8));
    if (hit) return hit;
  }
  return null;
}

function nextCode(): string {
  const row = db().prepare('SELECT COALESCE(MAX(id), 0) + 1 AS n FROM leads').get() as { n: number };
  return `NQ-${String(row.n).padStart(5, '0')}`;
}

export function addActivity(leadId: number, userId: number | null, kind: string, detail: string): void {
  db().prepare('INSERT INTO lead_activities (lead_id, user_id, kind, detail) VALUES (?, ?, ?, ?)').run(leadId, userId, kind, detail.slice(0, 2000));
}

/**
 * Creates the lead for a form submission. A repeat of an existing person is stored as a linked duplicate (so nothing is lost) and the first
 * lead gets a timeline entry; the pipeline keeps one card per person.
 */
export function createLead(input: NewLeadInput): { lead: Lead; duplicateOf: number | null } {
  const dup = findDuplicate(input.email, input.phone);
  const status: Status = input.status || (input.source === 'demo' ? 'demo_requested' : 'new');
  const res = db().prepare(`INSERT INTO leads (lead_code, name, company, email, phone, country, industry, company_size, branches, modules, inquiry_type, source, status, notes, duplicate_of, lang)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    nextCode(), input.name, input.company || null, input.email, input.phone || null, input.country || null, input.industry || null, input.company_size || null, input.branches || null,
    input.modules && input.modules.length ? input.modules.join(',') : null, input.inquiry_type || null, input.source || 'website', status, input.notes || null, dup ? dup.id : null, input.lang || null);
  const lead = getLead(Number(res.lastInsertRowid)) as Lead;
  addActivity(lead.id, null, 'created', `Lead created from ${lead.source}${dup ? ` (repeat of ${dup.lead_code})` : ''}`);
  if (dup) {
    addActivity(dup.id, null, 'repeat', `The same person contacted again (${lead.lead_code}, ${lead.source})`);
    db().prepare("UPDATE leads SET updated_at = datetime('now') WHERE id = ?").run(dup.id);
  }
  return { lead, duplicateOf: dup ? dup.id : null };
}

export function getLead(id: number): Lead | null {
  const row = db().prepare('SELECT l.*, u.name AS owner_name FROM leads l LEFT JOIN users u ON u.id = l.owner_id WHERE l.id = ?').get(id) as Lead | undefined;
  return row || null;
}

export interface LeadFilter { q?: string; status?: string; owner?: string; source?: string; industry?: string; country?: string; from?: string; to?: string; followUpDue?: boolean; includeDuplicates?: boolean; limit?: number; offset?: number }

export function listLeads(f: LeadFilter = {}): { rows: Lead[]; total: number } {
  const where: string[] = []; const args: (string | number)[] = [];
  if (!f.includeDuplicates) where.push('l.duplicate_of IS NULL');
  if (f.q) { where.push('(l.name LIKE ? OR l.company LIKE ? OR l.email LIKE ? OR l.phone LIKE ? OR l.lead_code LIKE ?)'); const q = `%${f.q}%`; args.push(q, q, q, q, q); }
  if (f.status) { where.push('l.status = ?'); args.push(f.status); }
  if (f.owner === 'none') where.push('l.owner_id IS NULL'); else if (f.owner) { where.push('l.owner_id = ?'); args.push(Number(f.owner)); }
  if (f.source) { where.push('l.source = ?'); args.push(f.source); }
  if (f.industry) { where.push('l.industry = ?'); args.push(f.industry); }
  if (f.country) { where.push('l.country LIKE ?'); args.push(`%${f.country}%`); }
  if (f.from) { where.push('date(l.created_at) >= ?'); args.push(f.from); }
  if (f.to) { where.push('date(l.created_at) <= ?'); args.push(f.to); }
  if (f.followUpDue) where.push("l.follow_up_date IS NOT NULL AND l.follow_up_date <= date('now') AND l.status NOT IN ('won','lost')");
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total = (db().prepare(`SELECT COUNT(*) AS n FROM leads l ${w}`).get(...args) as { n: number }).n;
  const rows = db().prepare(`SELECT l.*, u.name AS owner_name FROM leads l LEFT JOIN users u ON u.id = l.owner_id ${w} ORDER BY l.created_at DESC, l.id DESC LIMIT ? OFFSET ?`).all(...args, f.limit ?? 200, f.offset ?? 0) as unknown as Lead[];
  return { rows, total };
}

export function setStatus(id: number, status: string, userId: number | null): Lead {
  if (!(STATUSES as readonly string[]).includes(status)) throw new Error('Unknown status');
  const lead = getLead(id); if (!lead) throw new Error('Lead not found');
  if (lead.status === status) return lead;
  db().prepare("UPDATE leads SET status = ?, updated_at = datetime('now'), last_contact_at = CASE WHEN ? IN ('contacted','qualified','demo_completed','proposal_sent','negotiation') THEN datetime('now') ELSE last_contact_at END WHERE id = ?").run(status, status, id);
  addActivity(id, userId, 'status', `${lead.status} → ${status}`);
  return getLead(id) as Lead;
}

export function assign(id: number, ownerId: number | null, userId: number | null): void {
  const lead = getLead(id); if (!lead) throw new Error('Lead not found');
  db().prepare("UPDATE leads SET owner_id = ?, updated_at = datetime('now') WHERE id = ?").run(ownerId, id);
  const name = ownerId ? (db().prepare('SELECT name FROM users WHERE id = ?').get(ownerId) as { name: string } | undefined)?.name : null;
  addActivity(id, userId, 'assigned', name ? `Assigned to ${name}` : 'Unassigned');
}

export function addNote(id: number, text: string, userId: number | null): void {
  if (!text.trim()) throw new Error('The note is empty');
  addActivity(id, userId, 'note', text.trim());
  db().prepare("UPDATE leads SET updated_at = datetime('now') WHERE id = ?").run(id);
}

export function setFollowUp(id: number, date: string | null, userId: number | null): void {
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('The date must look like 2026-12-31');
  db().prepare("UPDATE leads SET follow_up_date = ?, updated_at = datetime('now') WHERE id = ?").run(date, id);
  addActivity(id, userId, 'follow_up', date ? `Follow-up set for ${date}` : 'Follow-up cleared');
}

export function updateDetails(id: number, patch: Partial<Pick<Lead, 'name' | 'company' | 'email' | 'phone' | 'country' | 'industry' | 'company_size' | 'branches' | 'notes'>>, userId: number | null): void {
  const allowed = ['name', 'company', 'email', 'phone', 'country', 'industry', 'company_size', 'branches', 'notes'] as const;
  const sets: string[] = []; const args: (string | null)[] = [];
  for (const k of allowed) if (k in patch) { sets.push(`${k} = ?`); args.push((patch[k] as string | null | undefined) ?? null); }
  if (!sets.length) return;
  db().prepare(`UPDATE leads SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...args, id);
  addActivity(id, userId, 'edited', `Updated: ${sets.map(s => s.split(' ')[0]).join(', ')}`);
}

export function activities(id: number): { id: number; kind: string; detail: string; created_at: string; user_name: string | null }[] {
  return db().prepare('SELECT a.id, a.kind, a.detail, a.created_at, u.name AS user_name FROM lead_activities a LEFT JOIN users u ON u.id = a.user_id WHERE a.lead_id = ? ORDER BY a.created_at DESC, a.id DESC').all(id) as never;
}

export interface Kpis { total: number; new: number; qualified: number; pendingFollowUps: number; demoRequests: number; completedDemos: number; proposals: number; won: number; lost: number; conversionRate: number; bySource: { source: string; n: number }[]; byStatus: { status: string; n: number }[] }

/** Every figure comes from the leads table; nothing is estimated. Duplicates are not counted twice. */
export function kpis(): Kpis {
  const one = (sql: string) => (db().prepare(sql).get() as { n: number }).n;
  const base = 'FROM leads WHERE duplicate_of IS NULL';
  const total = one(`SELECT COUNT(*) AS n ${base}`);
  const won = one(`SELECT COUNT(*) AS n ${base} AND status = 'won'`);
  return {
    total, new: one(`SELECT COUNT(*) AS n ${base} AND status = 'new'`),
    qualified: one(`SELECT COUNT(*) AS n ${base} AND status IN ('qualified','demo_requested','demo_scheduled','demo_completed','proposal_sent','negotiation','won')`),
    pendingFollowUps: one(`SELECT COUNT(*) AS n ${base} AND follow_up_date IS NOT NULL AND follow_up_date <= date('now') AND status NOT IN ('won','lost')`),
    demoRequests: one(`SELECT COUNT(*) AS n ${base} AND (source = 'demo' OR status IN ('demo_requested','demo_scheduled','demo_completed'))`),
    completedDemos: one(`SELECT COUNT(DISTINCT lead_id) AS n FROM lead_activities WHERE kind = 'status' AND detail LIKE '% → demo_completed'`) + one(`SELECT COUNT(*) AS n ${base} AND status = 'demo_completed' AND id NOT IN (SELECT lead_id FROM lead_activities WHERE kind = 'status' AND detail LIKE '% → demo_completed')`),
    proposals: one(`SELECT COUNT(*) AS n ${base} AND status IN ('proposal_sent','negotiation','won')`),
    won, lost: one(`SELECT COUNT(*) AS n ${base} AND status = 'lost'`),
    conversionRate: total ? Math.round((won / total) * 1000) / 10 : 0,
    bySource: db().prepare(`SELECT source, COUNT(*) AS n ${base} GROUP BY source ORDER BY n DESC`).all() as never,
    byStatus: db().prepare(`SELECT status, COUNT(*) AS n ${base} GROUP BY status`).all() as never,
  };
}

export function leadsToCsv(rows: Lead[]): string {
  const head = ['lead_code', 'name', 'company', 'email', 'phone', 'country', 'industry', 'company_size', 'branches', 'modules', 'source', 'status', 'owner', 'follow_up_date', 'last_contact_at', 'created_at'];
  const lines = [head.map(csvCell).join(',')];
  for (const r of rows) lines.push([r.lead_code, r.name, r.company, r.email, r.phone, r.country, r.industry, r.company_size, r.branches, r.modules, r.source, r.status, r.owner_name, r.follow_up_date, r.last_contact_at, r.created_at].map(csvCell).join(','));
  return `﻿${lines.join('\r\n')}\r\n`;
}
