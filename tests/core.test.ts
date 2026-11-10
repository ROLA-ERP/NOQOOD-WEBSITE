// Core behaviour: validation, form processing, lead storage, CRM workflow, duplicate detection, KPIs, CSV safety, authentication and permissions.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';

process.env.WEBSITE_DB = ':memory:';
process.env.SESSION_SECRET = 'test-secret-test-secret-test-secret-123456';
delete process.env.SMTP_HOST; delete process.env.TURNSTILE_SECRET;

import { db } from '../src/lib/db';
import { handleSubmission } from '../src/lib/submit';
import { formToken, hashPassword, verifyPassword, checkFormToken, passwordProblem } from '../src/lib/security';
import { listLeads, setStatus, assign, addNote, setFollowUp, kpis, leadsToCsv, getLead, activities, findDuplicate } from '../src/lib/leads';
import { createUser, login, userForToken, logout, can } from '../src/lib/auth';
import { csvCell, contactSchema } from '../src/lib/validate';
import { siteSettings, saveSiteSettings, socialUrl, OFFICIAL } from '../src/lib/settings';

const T0 = 1_700_000_000_000;
const tokenOld = () => formToken(T0);
const ctx = (ip = '10.0.0.1') => ({ ip, userAgent: 'test', lang: 'en' as const, now: T0 + 10_000 });
const contact = (over: Record<string, unknown> = {}) => ({ name: 'Sara Ali', company: 'Gulf Trading', email: 'sara@gulf.example', phone: '+965 5555 1234', country: 'Kuwait', industry: 'trading', company_size: '11-50', branches: '3', interest: ['finance', 'inventory'], inquiry_type: 'sales', message: 'We want to see how multi-branch stock works.', consent: true, form_token: tokenOld(), ...over });
const demo = (over: Record<string, unknown> = {}) => ({ name: 'Omar Khaled', company: 'Al Noor Retail', email: 'omar@alnoor.example', phone: '+965 6666 7777', country: 'Kuwait', industry: 'retail', employees: '51-200', branches: '8', interest: ['sales', 'hr'], requirements: 'POS and payroll', contact_method: 'whatsapp', preferred_at: 'Sunday morning', consent: true, form_token: tokenOld(), ...over });

before(() => { db(); });

test('the official contact details are the ones given by the owner', () => {
  assert.equal(OFFICIAL.email, 'noqooderp@gmail.com'); assert.equal(OFFICIAL.phone, '+96599643739'); assert.equal(OFFICIAL.whatsapp, '96599643739');
  const s = siteSettings(); assert.equal(s.email, 'noqooderp@gmail.com'); assert.equal(s.notify_to, 'noqooderp@gmail.com'); assert.equal(s.pricing_mode, 'quote'); assert.equal(s.show_testimonials, false);
});

test('a contact form is stored as a submission and a lead, and the answer says the email was NOT sent when SMTP is not configured', async () => {
  const r = await handleSubmission('contact', contact(), ctx('10.0.0.2'));
  assert.equal(r.status, 201); assert.ok(r.body.ok);
  if (!r.body.ok) return;
  assert.match(r.body.leadCode, /^NQ-\d{5}$/); assert.equal(r.body.notified, false);
  const sub = db().prepare('SELECT * FROM submissions WHERE lead_id = (SELECT id FROM leads WHERE lead_code = ?)').get(r.body.leadCode) as { notify_status: string; kind: string };
  assert.equal(sub.kind, 'contact'); assert.equal(sub.notify_status, 'not_configured');
  const lead = listLeads({ q: 'sara@gulf' }).rows[0];
  assert.equal(lead.status, 'new'); assert.equal(lead.source, 'contact'); assert.equal(lead.modules, 'finance,inventory'); assert.equal(lead.company, 'Gulf Trading');
  assert.ok(activities(lead.id).some(a => a.kind === 'created'));
});

test('a demo request creates a lead in the "demo requested" stage and records that no appointment was booked', async () => {
  const r = await handleSubmission('demo', demo(), ctx('10.0.0.3'));
  assert.ok(r.body.ok);
  const lead = listLeads({ q: 'omar@alnoor' }).rows[0];
  assert.equal(lead.status, 'demo_requested'); assert.equal(lead.source, 'demo');
  assert.match(lead.notes || '', /requested, not booked/);
});

test('invalid input is refused with field errors and nothing is stored', async () => {
  const before = (db().prepare('SELECT COUNT(*) n FROM submissions').get() as { n: number }).n;
  const bad = await handleSubmission('contact', contact({ email: 'not-an-email', name: 'x', message: 'hi', consent: false }), ctx('10.0.0.4'));
  assert.equal(bad.status, 422); if (!bad.body.ok) { assert.ok(bad.body.fields?.email); assert.ok(bad.body.fields?.name); assert.equal(bad.body.fields?.consent, 'consent'); }
  const noDemoModules = await handleSubmission('demo', demo({ interest: [] }), ctx('10.0.0.4'));
  assert.equal(noDemoModules.status, 422);
  const badPhone = await handleSubmission('demo', demo({ phone: 'call me' }), ctx('10.0.0.4'));
  assert.equal(badPhone.status, 422);
  assert.equal((db().prepare('SELECT COUNT(*) n FROM submissions').get() as { n: number }).n, before);
});

test('spam protection: honeypot, missing or forged form token, instant submit, expired form, and the hourly limit', async () => {
  assert.equal((await handleSubmission('contact', contact({ website: 'http://spam.example' }), ctx('10.0.1.1'))).status, 400);
  assert.equal((await handleSubmission('contact', contact({ form_token: undefined }), ctx('10.0.1.1'))).status, 400);
  assert.equal((await handleSubmission('contact', contact({ form_token: `${T0}.forged` }), ctx('10.0.1.1'))).status, 400);
  assert.equal((await handleSubmission('contact', contact(), { ...ctx('10.0.1.1'), now: T0 + 500 })).status, 429); // faster than a person
  assert.equal((await handleSubmission('contact', contact(), { ...ctx('10.0.1.1'), now: T0 + 7 * 3600 * 1000 })).status, 400); // form older than 6 hours
  assert.equal(checkFormToken(formToken(T0), { now: T0 + 5000 }), 'ok');
  // five stored submissions from one address, then the sixth is refused
  for (let i = 0; i < 5; i += 1) assert.equal((await handleSubmission('contact', contact({ email: `flood${i}@x.example` }), ctx('10.0.2.2'))).status, 201);
  assert.equal((await handleSubmission('contact', contact({ email: 'flood9@x.example' }), ctx('10.0.2.2'))).status, 429);
});

test('duplicates: a repeat from the same person keeps one pipeline card and adds to the first lead\'s history', async () => {
  await handleSubmission('contact', contact({ email: 'dup@x.example', name: 'Dup One', phone: '+965 5000 0001' }), ctx('10.0.3.1'));
  await handleSubmission('demo', demo({ email: 'dup@x.example', name: 'Dup One', phone: '+965 5000 0001' }), ctx('10.0.3.2'));
  await handleSubmission('contact', contact({ email: 'other@x.example', name: 'Dup One', phone: '+96550000001' }), ctx('10.0.3.3')); // same phone, other email
  const cards = listLeads({ q: 'Dup One' });
  assert.equal(cards.rows.length, 1); assert.equal(cards.total, 1);
  const all = listLeads({ q: 'Dup One', includeDuplicates: true });
  assert.equal(all.rows.length, 3); assert.equal(all.rows.filter(l => l.duplicate_of).length, 2);
  assert.ok(activities(cards.rows[0].id).filter(a => a.kind === 'repeat').length === 2);
  assert.ok(findDuplicate('dup@x.example'));
});

test('CRM workflow: status changes, assignment, notes, follow-ups and filters leave a timeline', async () => {
  const sales = createUser('sales1@noqood.example', 'Mona Sales', 'sales', 'Sales-pass-12345');
  const lead = listLeads({ q: 'omar@alnoor' }).rows[0];
  setStatus(lead.id, 'contacted', sales); setStatus(lead.id, 'qualified', sales); setStatus(lead.id, 'demo_scheduled', sales);
  assign(lead.id, sales, sales); addNote(lead.id, 'Called: wants Sunday 10:00', sales); setFollowUp(lead.id, '2020-01-01', sales);
  const got = getLead(lead.id)!;
  assert.equal(got.status, 'demo_scheduled'); assert.equal(got.owner_name, 'Mona Sales'); assert.ok(got.last_contact_at);
  const kinds = activities(lead.id).map(a => a.kind);
  for (const k of ['created', 'status', 'assigned', 'note', 'follow_up']) assert.ok(kinds.includes(k), k);
  assert.throws(() => setStatus(lead.id, 'banana', sales)); assert.throws(() => setFollowUp(lead.id, 'tomorrow', sales)); assert.throws(() => addNote(lead.id, '  ', sales));
  assert.equal(listLeads({ status: 'demo_scheduled' }).rows.length, 1);
  assert.equal(listLeads({ owner: String(sales) }).rows.length, 1);
  assert.equal(listLeads({ followUpDue: true }).rows.length, 1);
  assert.equal(listLeads({ source: 'demo' }).rows.length >= 1, true);
  assert.equal(listLeads({ country: 'Kuw', industry: 'retail' }).rows.length, 1);
});

test('KPIs are computed from the leads table only', () => {
  const k = kpis();
  const real = (db().prepare('SELECT COUNT(*) n FROM leads WHERE duplicate_of IS NULL').get() as { n: number }).n;
  assert.equal(k.total, real); assert.equal(k.won, 0); assert.equal(k.conversionRate, 0);
  assert.ok(k.demoRequests >= 1 && k.pendingFollowUps === 1 && k.qualified >= 1);
  const lead = listLeads({ q: 'sara@gulf' }).rows[0];
  setStatus(lead.id, 'won', null);
  const k2 = kpis(); assert.equal(k2.won, 1); assert.equal(k2.conversionRate, Math.round((1 / k2.total) * 1000) / 10);
  assert.equal(k2.byStatus.reduce((s, r) => s + r.n, 0), k2.total);
});

test('CSV export quotes everything and neutralises spreadsheet formulas', () => {
  assert.equal(csvCell('=HYPERLINK("http://evil")'), `"'=HYPERLINK(""http://evil"")"`);
  assert.equal(csvCell('+965'), `"'+965"`); assert.equal(csvCell('say "hi", ok'), '"say ""hi"", ok"'); assert.equal(csvCell(null), '""');
  const csv = leadsToCsv(listLeads({ limit: 5 }).rows);
  assert.ok(csv.startsWith('﻿"lead_code"')); assert.ok(csv.split('\r\n').length >= 3);
});

test('passwords: scrypt hashes, strength rules, and sessions with lockout after five failures', () => {
  const h = hashPassword('A-strong-pass-123'); assert.ok(verifyPassword('A-strong-pass-123', h)); assert.ok(!verifyPassword('wrong', h)); assert.notEqual(h, hashPassword('A-strong-pass-123'));
  assert.ok(passwordProblem('short1')); assert.ok(passwordProblem('onlyletterspassword')); assert.equal(passwordProblem('A-strong-pass-123'), null);
  assert.throws(() => createUser('weak@noqood.example', 'Weak', 'editor', 'abc'));
  createUser('admin@noqood.example', 'Admin', 'admin', 'Noqood-Owner-12345');
  const ok = login('ADMIN@noqood.example', 'Noqood-Owner-12345', '10.9.9.9'); assert.ok(ok.ok);
  if (ok.ok) {
    assert.equal(userForToken(ok.token)?.role, 'admin'); assert.equal(userForToken('forged'), null);
    logout(ok.token); assert.equal(userForToken(ok.token), null);
  }
  for (let i = 0; i < 5; i += 1) assert.deepEqual(login('admin@noqood.example', 'nope', '10.8.8.8'), { ok: false, reason: 'invalid' });
  assert.deepEqual(login('admin@noqood.example', 'Noqood-Owner-12345', '10.8.8.8'), { ok: false, reason: 'locked' }); // from an unknown address even the right password is refused for 15 minutes
  assert.deepEqual(login('nobody@noqood.example', 'x', '10.9.9.9'), { ok: false, reason: 'invalid' }); // same answer as a wrong password
  assert.ok(db().prepare("SELECT COUNT(*) n FROM audit_log WHERE action = 'login_failed'").get());
});

test('roles: sales sees leads only, editor sees content only, admin everything', () => {
  assert.ok(can('admin', 'users') && can('admin', 'leads'));
  assert.ok(can('sales', 'leads') && can('sales', 'leads.export') && !can('sales', 'blog') && !can('sales', 'users'));
  assert.ok(can('editor', 'blog') && can('editor', 'faq') && !can('editor', 'leads') && !can('editor', 'users'));
});

test('settings: social links appear only when they are real https addresses; pricing defaults to a quote', () => {
  assert.equal(socialUrl(''), null); assert.equal(socialUrl('javascript:alert(1)'), null); assert.equal(socialUrl('http://insecure.example'), null); assert.equal(socialUrl('https://www.linkedin.com/company/example'), 'https://www.linkedin.com/company/example');
  saveSiteSettings({ socials: { linkedin: 'https://www.linkedin.com/company/example' } as never });
  assert.equal(siteSettings().socials.linkedin, 'https://www.linkedin.com/company/example'); assert.equal(siteSettings().socials.facebook, '');
});

test('the contact schema trims, lowercases the email and strips control characters', () => {
  const p = contactSchema.parse({ ...contact(), email: '  Sara@GULF.example ', name: '  Sara\u0000 Ali ' });
  assert.equal(p.email, 'sara@gulf.example'); assert.equal(p.name, 'Sara Ali');
});
