// Regression tests for the REVIEW.md findings.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.WEBSITE_DB = ':memory:';
process.env.SESSION_SECRET = 'test-secret-test-secret-test-secret-123456';
delete process.env.SMTP_HOST; delete process.env.RESEND_API_KEY; delete process.env.TURNSTILE_SECRET;

import { pickClientIp } from '../src/lib/request';
import { db, migrate } from '../src/lib/db';
import { erpUrl } from '../src/lib/settings';
import { formToken, checkFormToken } from '../src/lib/security';
import { handleSubmission } from '../src/lib/submit';
import { deleteLead, listLeads, activities, getLead } from '../src/lib/leads';
import { createUser, login, changePassword, resetPassword, setRole, toggleActive, userForToken } from '../src/lib/auth';

test('F-02: the client-typed left-most X-Forwarded-For entry is ignored', () => {
  assert.equal(pickClientIp('6.6.6.6, 203.0.113.9', null, 1), '203.0.113.9');
  assert.equal(pickClientIp('203.0.113.9', null, 1), '203.0.113.9');
  assert.equal(pickClientIp('6.6.6.6, 203.0.113.9, 10.0.0.1', null, 2), '203.0.113.9');
  assert.equal(pickClientIp(null, '198.51.100.4', 1), '198.51.100.4');
  assert.equal(pickClientIp('', null, 1), 'unknown');
});

test('F-10: running the migrations twice is harmless', () => {
  db(); assert.deepEqual(migrate(db()), []);
});

test('F-15: the ERP login link defaults to the ERP host', () => {
  delete process.env.ERP_URL; assert.equal(erpUrl(), 'https://app.noqoodapp.com');
});

const T0 = 1_700_000_000_000;
const form = (over: Record<string, unknown> = {}) => ({ name: 'Sara Ali', email: 'sara@gulf.example', message: 'We want to see multi-branch stock.', consent: true, form_token: formToken(T0), ...over });
const ctx = (ip: string) => ({ ip, lang: 'en' as const, now: T0 + 10_000 });

test('F-07: a form token is single use and tokens are unique', async () => {
  assert.notEqual(formToken(T0), formToken(T0));
  assert.equal(checkFormToken(formToken(T0), { now: T0 + 5000 }), 'ok');
  const body = form();
  assert.equal((await handleSubmission('contact', body, ctx('10.1.0.1'))).status, 201);
  const again = await handleSubmission('contact', body, ctx('10.1.0.2')); // another address, same token
  assert.equal(again.status, 400); assert.equal(again.body.ok === false && again.body.error, 'expired_form');
});

test('F-07: a refused (invalid) submission does not use the token up', async () => {
  const body = form({ message: 'x' }); // too short -> 422
  assert.equal((await handleSubmission('contact', body, ctx('10.1.0.3'))).status, 422);
  assert.equal((await handleSubmission('contact', { ...body, message: 'Now a proper message here.' }, ctx('10.1.0.3'))).status, 201);
});

test('F-04: a locked account can still be used from an address that signed in before; others stay locked', () => {
  createUser('boss@noqood.example', 'Boss', 'admin', 'Boss-Password-12345');
  assert.ok(login('boss@noqood.example', 'Boss-Password-12345', '10.5.0.1').ok); // establishes the known address
  for (let i = 0; i < 5; i += 1) login('boss@noqood.example', 'wrong', '10.6.6.6'); // an attacker locks the account
  assert.deepEqual(login('boss@noqood.example', 'Boss-Password-12345', '10.6.6.6'), { ok: false, reason: 'locked' });
  assert.ok(login('boss@noqood.example', 'Boss-Password-12345', '10.5.0.1').ok);
});

test('F-05: change password, admin reset (unlocks), role and active guards keep one administrator', () => {
  const id = createUser('second@noqood.example', 'Second', 'sales', 'Second-Password-123');
  const r = login('second@noqood.example', 'Second-Password-123', '10.7.0.1');
  const r2 = login('second@noqood.example', 'Second-Password-123', '10.7.0.1');
  assert.ok(r.ok && r2.ok); if (!r.ok || !r2.ok) return;
  assert.throws(() => changePassword(id, 'wrong-current', 'New-Password-12345', r.token), /current password/);
  assert.throws(() => changePassword(id, 'Second-Password-123', 'short', r.token));
  changePassword(id, 'Second-Password-123', 'New-Password-12345', r.token);
  assert.ok(userForToken(r.token)); assert.equal(userForToken(r2.token), null); // other sessions ended
  assert.ok(login('second@noqood.example', 'New-Password-12345', '10.7.0.1').ok);
  for (let i = 0; i < 5; i += 1) login('second@noqood.example', 'x', '10.7.7.7');
  resetPassword(id, 'Reset-Password-12345'); assert.ok(login('second@noqood.example', 'Reset-Password-12345', '10.7.7.7').ok);
  const boss = (db().prepare("SELECT id FROM users WHERE email = 'boss@noqood.example'").get() as { id: number }).id;
  assert.throws(() => setRole(boss, 'sales'), /last active administrator/);
  assert.throws(() => toggleActive(boss), /last active administrator/);
  setRole(id, 'admin'); setRole(boss, 'editor');
  assert.equal((db().prepare('SELECT role FROM users WHERE id = ?').get(boss) as { role: string }).role, 'editor');
});

test('F-06: a repeat contact copies its message to the first lead; a repeat demo request moves the first lead to demo_requested', async () => {
  await handleSubmission('contact', form({ email: 'again@x.example', message: 'First question about stock.' }), ctx('10.2.0.1'));
  const first = listLeads({ q: 'again@x.example' }).rows[0]; assert.equal(first.status, 'new');
  await handleSubmission('demo', { name: 'Sara Ali', company: 'Gulf Co', email: 'again@x.example', phone: '+965 5555 0000', country: 'Kuwait', industry: 'retail', employees: '11-50', interest: ['hr'], requirements: 'Payroll for 40 staff', contact_method: 'email', consent: true, form_token: formToken(T0) }, ctx('10.2.0.2'));
  assert.equal(getLead(first.id)?.status, 'demo_requested');
  const rep = activities(first.id).find(a => a.kind === 'repeat');
  assert.match(rep?.detail || '', /Payroll for 40 staff/);
});

test('F-13: deleting a lead removes its submissions, timeline and repeat rows', async () => {
  await handleSubmission('contact', form({ email: 'erase@x.example' }), ctx('10.2.1.1'));
  await handleSubmission('contact', form({ email: 'erase@x.example' }), ctx('10.2.1.2'));
  const lead = listLeads({ q: 'erase@x.example' }).rows[0];
  deleteLead(lead.id);
  assert.equal(listLeads({ q: 'erase@x.example', includeDuplicates: true }).total, 0);
  assert.equal((db().prepare("SELECT COUNT(*) n FROM submissions WHERE payload LIKE '%erase@x.example%'").get() as { n: number }).n, 0);
  assert.throws(() => deleteLead(lead.id), /not found/);
});

test('F-08: with a provider configured the visitor is answered before the email finishes, and the outcome is recorded afterwards', async () => {
  process.env.RESEND_API_KEY = 're_test'; const realFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = (async () => { calls += 1; await new Promise(r => setTimeout(r, 100)); return calls < 2 ? new Response('{}', { status: 503 }) : new Response(JSON.stringify({ id: 'abc' }), { status: 200 }); }) as typeof fetch;
  try {
    const t0 = Date.now();
    const r = await handleSubmission('contact', form({ email: 'bg@x.example' }), ctx('10.2.2.1'));
    assert.equal(r.status, 201); assert.ok(Date.now() - t0 < 90, 'answered without waiting for the mail provider');
    await new Promise(r2 => setTimeout(r2, 2200)); // one retry after the 503
    const row = db().prepare("SELECT notify_status, notify_detail FROM submissions WHERE payload LIKE '%bg@x.example%'").get() as { notify_status: string; notify_detail: string };
    assert.equal(row.notify_status, 'sent'); assert.match(row.notify_detail, /after 2 tries/);
  } finally { globalThis.fetch = realFetch; delete process.env.RESEND_API_KEY; }
});
