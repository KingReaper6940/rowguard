function index(table, key, label) {
  const position = table.headers.indexOf(key);
  if (position < 0) throw new Error(`${label}: key column "${key}" is missing.`);
  const map = new Map();
  table.rows.forEach((row, i) => {
    const id = row[position];
    if (!id.trim()) throw new Error(`${label}: blank key at record ${i + 2}.`);
    if (map.has(id)) throw new Error(`${label}: duplicate key ${JSON.stringify(id)} at record ${i + 2}.`);
    map.set(id, Object.fromEntries(table.headers.map((name, j) => [name, row[j]])));
  });
  return map;
}

export function compare(before, after, key) {
  const oldRows = index(before, key, 'Before');
  const newRows = index(after, key, 'After');
  const columnsAdded = after.headers.filter(c => !before.headers.includes(c));
  const columnsRemoved = before.headers.filter(c => !after.headers.includes(c));
  const shared = before.headers.filter(c => c !== key && after.headers.includes(c));
  const added = [], removed = [], changed = [];
  let unchanged = 0;
  for (const [id, oldRow] of oldRows) {
    const newRow = newRows.get(id);
    if (!newRow) { removed.push({ key: id, row: oldRow }); continue; }
    const cells = shared.filter(c => oldRow[c] !== newRow[c])
      .map(column => ({ column, before: oldRow[column], after: newRow[column] }));
    if (cells.length) changed.push({ key: id, cells });
    else unchanged++;
  }
  for (const [id, row] of newRows) if (!oldRows.has(id)) added.push({ key: id, row });
  return {
    key, columnsAdded, columnsRemoved, added, removed, changed,
    summary: {
      beforeRows: oldRows.size, afterRows: newRows.size,
      added: added.length, removed: removed.length, changed: changed.length, unchanged,
      hasDifferences: Boolean(added.length || removed.length || changed.length || columnsAdded.length || columnsRemoved.length)
    }
  };
}
