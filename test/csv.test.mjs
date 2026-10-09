import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV } from '../src/csv.mjs';

test('handles BOM, CRLF, quoted commas, multiline fields and escaped quotes', () => {
  assert.deepEqual(parseCSV('\uFEFFid,note\r\n1,"hello, ""friend""\nnext"\r\n'), {
    headers: ['id', 'note'], rows: [['1', 'hello, "friend"\nnext']]
  });
});
test('preserves empty cells and quoted empty records while ignoring blank lines', () => {
  assert.deepEqual(parseCSV('id,note\n\n1,\n2,""').rows, [['1', ''], ['2', '']]);
  assert.deepEqual(parseCSV('value\n""\n').rows, [['']]);
});
test('supports tab-separated files', () => {
  assert.deepEqual(parseCSV('id\tnote\n1\tok', '\t').rows, [['1', 'ok']]);
});
test('rejects malformed data instead of silently changing it', () => {
  for (const input of ['', 'id,id\n1,2', 'id,\n1,2', 'id,note\n1', 'id\n"bad', 'id\na"b', 'id\n"a"b']) {
    assert.throws(() => parseCSV(input));
  }
  assert.throws(() => parseCSV('id', '\n'));
});
