import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const run = (...args) => spawnSync(process.execPath, ['src/cli.mjs', ...args], { cwd: root, encoding: 'utf8' });
const files = ['examples/before.csv', 'examples/after.csv', '--key', 'sku'];

test('produces JSON and uses change-specific exit status only when requested', () => {
  const result = run(...files, '--format', 'json');
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout).summary, {
    beforeRows: 3, afterRows: 3, added: 1, removed: 1, changed: 1, unchanged: 1, hasDifferences: true
  });
  assert.equal(run(...files, '--fail-on-change').status, 1);
  assert.equal(run('examples/before.csv', 'examples/before.csv', '--key', 'sku', '--fail-on-change').status, 0);
});
test('reports usage errors and missing files', () => {
  assert.equal(run('--help').status, 0);
  assert.equal(run().status, 2);
  assert.equal(run(...files, '--wat').status, 2);
  assert.equal(run('missing.csv', 'examples/after.csv', '--key', 'sku').status, 2);
});
test('writes a new output file but never overwrites existing data', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rowguard-'));
  try {
    const path = join(dir, 'report.json');
    assert.equal(run(...files, '--format', 'json', '--out', path).status, 0);
    assert.equal(JSON.parse(readFileSync(path, 'utf8')).summary.changed, 1);
    writeFileSync(path, 'keep me');
    assert.equal(run(...files, '--out', path).status, 2);
    assert.equal(readFileSync(path, 'utf8'), 'keep me');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
