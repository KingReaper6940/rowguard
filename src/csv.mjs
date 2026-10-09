// Strict CSV parsing: quoted commas/newlines, escaped quotes, BOM and CRLF.
export function parseCSV(input, delimiter = ',') {
  if (typeof delimiter !== 'string' || delimiter.length !== 1 || /["\r\n]/.test(delimiter)) {
    throw new Error('Delimiter must be one character other than a quote or newline.');
  }
  const text = input.replace(/^\uFEFF/, '');
  const records = [];
  let row = [], cell = '', state = 'start', touched = false;
  const finishCell = () => { row.push(cell); cell = ''; state = 'start'; };
  const finishRow = () => {
    if (touched) { finishCell(); records.push(row); }
    row = []; cell = ''; state = 'start'; touched = false;
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (state === 'quoted') {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else state = 'closed';
      } else cell += ch;
      continue;
    }
    if (ch === delimiter) { touched = true; finishCell(); continue; }
    if (ch === '\r' || ch === '\n') {
      finishRow();
      if (ch === '\r' && text[i + 1] === '\n') i++;
      continue;
    }
    if (state === 'closed') throw new Error(`Unexpected character after closing quote at offset ${i}.`);
    touched = true;
    if (ch === '"') {
      if (state !== 'start') throw new Error(`Quote inside unquoted field at offset ${i}.`);
      state = 'quoted';
    } else { cell += ch; state = 'plain'; }
  }
  if (state === 'quoted') throw new Error('Unclosed quoted field.');
  finishRow();
  if (!records.length) throw new Error('CSV is empty.');
  const [headers, ...rows] = records;
  if (headers.some(h => !h.trim())) throw new Error('CSV has a blank column name.');
  if (new Set(headers).size !== headers.length) throw new Error('CSV has duplicate column names.');
  rows.forEach((r, i) => {
    if (r.length !== headers.length) throw new Error(`Record ${i + 2} has ${r.length} fields; expected ${headers.length}.`);
  });
  return { headers, rows };
}
