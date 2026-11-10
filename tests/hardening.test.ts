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
