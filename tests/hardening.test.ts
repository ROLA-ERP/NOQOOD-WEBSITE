// Regression tests for the REVIEW.md findings.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.WEBSITE_DB = ':memory:';
process.env.SESSION_SECRET = 'test-secret-test-secret-test-secret-123456';
delete process.env.SMTP_HOST; delete process.env.RESEND_API_KEY; delete process.env.TURNSTILE_SECRET;

import { pickClientIp } from '../src/lib/request';
import { db, migrate } from '../src/lib/db';
import { erpUrl } from '../src/lib/settings';

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
