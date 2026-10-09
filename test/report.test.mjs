import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV } from '../src/csv.mjs';
import { compare } from '../src/compare.mjs';
import { htmlReport } from '../src/report.mjs';

test('escapes hostile CSV values and produces a self-contained report', () => {
  const html = htmlReport(compare(parseCSV('id,note\n1,safe'), parseCSV('id,note\n1,<script>alert(1)</script>'), 'id'));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes("default-src 'none'"));
  assert.ok(html.includes('Changed cells'));
});
test('renders schema changes and empty result sections', () => {
  const html = htmlReport(compare(parseCSV('id,old\n1,A'), parseCSV('id,new\n1,B'), 'id'));
  assert.ok(html.includes('Changes found'));
  assert.ok(html.includes('[&quot;new&quot;]'));
  assert.ok(html.includes('None.'));
});
