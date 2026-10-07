import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV } from '../src/csv.mjs';
import { compare } from '../src/compare.mjs';
const diff = (a, b) => compare(parseCSV(a), parseCSV(b), 'id');

test('matches reordered rows and columns without false differences', () => {
  const result = diff('id,name\n001,A\n002,B', 'name,id\nB,002\nA,001');
  assert.equal(result.summary.hasDifferences, false);
  assert.equal(result.summary.unchanged, 2);
});
test('reports added, removed, changed cells and schema differences', () => {
  const result = diff('id,name,old\n1,A,x\n2,B,y', 'id,name,new\n1,Z,q\n3,C,r');
  assert.deepEqual(result.changed, [{ key: '1', cells: [{ column: 'name', before: 'A', after: 'Z' }] }]);
  assert.equal(result.added[0].key, '3');
  assert.equal(result.removed[0].key, '2');
  assert.deepEqual(result.columnsAdded, ['new']);
  assert.deepEqual(result.columnsRemoved, ['old']);
});
test('rejects duplicate, blank and missing keys in either input', () => {
  for (const invalid of ['id,name\n1,A\n1,B', 'id,name\n ,A', 'name\nA']) {
    assert.throws(() => diff(invalid, 'id,name\n1,A'));
    assert.throws(() => diff('id,name\n1,A', invalid));
  }
});
test('preserves long IDs and handles prototype-like column names', () => {
  const result = diff('id,__proto__\n9007199254740993,A', 'id,__proto__\n9007199254740993,B');
  assert.equal(result.changed[0].key, '9007199254740993');
  assert.equal(result.changed[0].cells[0].column, '__proto__');
});
