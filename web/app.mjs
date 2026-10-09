import { parseCSV } from './core/csv.mjs';
import { compare } from './core/compare.mjs';
import { htmlReport } from './core/report.mjs';
const $ = id => document.getElementById(id);
const limit = 2 * 1024 * 1024;
let result = null;
function message(text, error = false) { $('message').textContent = text; $('message').classList.toggle('error', error); }
function clear() { result = null; $('results').hidden = true; }
function renderTable() {
  const category = $('filter').value;
  const changed = category === 'changed';
  const headings = changed ? ['Key', 'Column', 'Before', 'After'] : ['Key', 'Record values'];
  const rows = changed ? result.changed.flatMap(r => r.cells.map(c => [r.key, c.column, c.before, c.after]))
    : result[category].map(r => [r.key, JSON.stringify(r.row)]);
  const head = document.createElement('tr');
  headings.forEach(value => { const cell = document.createElement('th'); cell.textContent = value; head.append(cell); });
  $('table-head').replaceChildren(head);
  $('table-body').replaceChildren(...rows.slice(0, 200).map(values => {
    const row = document.createElement('tr');
    values.forEach(value => { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); });
    return row;
  }));
  $('empty').hidden = rows.length !== 0;
}
function run() {
  clear();
  try {
    for (const id of ['before', 'after']) if (new TextEncoder().encode($(id).value).length > limit)
      throw new Error('Each input must be 2 MiB or smaller. Use the CLI for larger exports.');
    if (!$('key').value.trim()) throw new Error('Enter a column name to match records by.');
    const delimiter = $('separator').value === 'tab' ? '\t' : $('separator').value;
    result = compare(parseCSV($('before').value, delimiter), parseCSV($('after').value, delimiter), $('key').value);
    $('result-title').textContent = result.summary.hasDifferences ? 'Here’s what changed.' : 'These exports match.';
    $('stats').replaceChildren(...['added', 'removed', 'changed', 'unchanged'].map(key => {
      const card = document.createElement('div'); card.className = 'stat';
      const value = document.createElement('strong'); value.textContent = result.summary[key];
      const label = document.createElement('span'); label.textContent = key === 'unchanged' ? 'Unchanged shared values' : `${key[0].toUpperCase()}${key.slice(1)} records`;
      card.append(value, label); return card;
    }));
    $('schema').textContent = `Columns added: ${result.columnsAdded.join(', ') || 'none'} · Columns removed: ${result.columnsRemoved.join(', ') || 'none'}`;
    $('results').hidden = false;
    renderTable();
    message(`${result.summary.beforeRows} records before · ${result.summary.afterRows} records after · Compared locally`);
  } catch (error) { message(error.message, true); }
}
function download(content, type, name) {
  if (!result) return;
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('compare').addEventListener('click', run);
$('sample').addEventListener('click', () => {
  $('before').value = 'sku,name,price,stock\nCAP-1,Canvas cap,18.00,12\nMUG-2,"Mug, blue",14.00,8\nTEE-3,Cotton tee,25.00,4';
  $('after').value = 'sku,name,price,stock\nTEE-3,Cotton tee,25.00,4\nCAP-1,Canvas cap,20.00,9\nBAG-4,Tote bag,16.00,20';
  $('key').value = 'sku'; $('separator').value = ','; run();
  $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
for (const id of ['before', 'after', 'key', 'separator']) $(id).addEventListener('input', () => { clear(); message('Inputs changed. Compare again to update the results.'); });
for (const id of ['before', 'after']) $(`${id}-file`).addEventListener('change', async event => {
  clear();
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > limit) throw new Error('File must be 2 MiB or smaller.');
    $(id).value = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
    message('File loaded. Choose the ID column and compare.');
  } catch (error) { $(id).value = ''; message(error.message, true); }
});
$('filter').addEventListener('change', () => { if (result) renderTable(); });
$('json').addEventListener('click', () => { if (result) download(JSON.stringify(result, null, 2), 'application/json', 'rowguard-comparison.json'); });
$('html').addEventListener('click', () => { if (result) download(htmlReport(result), 'text/html', 'rowguard-report.html'); });
