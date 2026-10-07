const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);

export function htmlReport(result) {
  const table = (headers, rows) => rows.length
    ? `<div class="scroll"><table><thead><tr>${headers.map(h => `<th>${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(v => `<td>${escape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
    : '<p class="muted">None.</p>';
  const rowTable = rows => table(['Key', 'Row values'], rows.map(r => [r.key, JSON.stringify(r.row)]));
  const s = result.summary;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>RowGuard comparison report</title><style>
body{font:16px/1.6 system-ui,sans-serif;background:#f4f7fa;color:#182b40;margin:0;padding:32px}
main{max-width:1100px;margin:auto}h1{font-size:36px;margin-bottom:0}.muted{color:#52677c}
.stats{display:flex;flex-wrap:wrap;gap:16px;margin:24px 0}.stat{background:white;border:1px solid #cdd7e2;border-radius:12px;padding:16px 24px;min-width:110px}.stat strong{display:block;font-size:30px}
section{background:white;padding:24px;border-radius:12px;margin:20px 0;border:1px solid #cdd7e2}h2{margin-top:0}
.scroll{overflow:auto}table{border-collapse:collapse;width:100%;text-align:left}th,td{border-bottom:1px solid #dce3eb;padding:12px;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere}th{background:#edf3f8}code{background:#edf3f8;padding:2px 5px}
@media print{body{padding:0;background:white}section{break-inside:avoid}}@media(max-width:600px){body{padding:16px}.stat{flex:1;padding:12px}}
</style></head><body><main><p class="muted">OFFLINE EXPORT RECONCILIATION</p>
<h1>RowGuard</h1><p>${s.hasDifferences ? 'Changes found between these exports.' : 'No differences found.'} Matched by <code>${escape(result.key)}</code>.</p>
<div class="stats">${['added', 'removed', 'changed', 'unchanged'].map(k => `<div class="stat">${k === 'unchanged' ? 'Unchanged shared values' : escape(k)}<strong>${s[k]}</strong></div>`).join('')}</div>
<p class="muted">${s.beforeRows} rows before · ${s.afterRows} rows after. Values are compared as exact text. Schema differences appear separately.</p>
<section><h2>Column changes</h2><p>Added: ${escape(JSON.stringify(result.columnsAdded))}</p><p>Removed: ${escape(JSON.stringify(result.columnsRemoved))}</p></section>
<section><h2>Changed cells</h2>${table(['Key', 'Column', 'Before', 'After'], result.changed.flatMap(r => r.cells.map(c => [r.key, c.column, c.before, c.after])))}</section>
<section><h2>Added rows</h2>${rowTable(result.added)}</section>
<section><h2>Removed rows</h2>${rowTable(result.removed)}</section>
<p class="muted">Generated locally by RowGuard. No scripts, network requests or external assets.</p>
</main></body></html>`;
}
