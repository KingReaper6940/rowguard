#!/usr/bin/env node
import { readFile, stat, writeFile } from 'node:fs/promises';
import { parseCSV } from './csv.mjs';
import { compare } from './compare.mjs';

const help = `RowGuard — compare CSV exports locally by unique ID

Usage: node src/cli.mjs before.csv after.csv --key COLUMN [options]
  --format text|json       Output format (default: text)
  --out PATH               Save to a new file; existing files are never overwritten
  --delimiter CHAR         Field separator (use "tab" for TSV)
  --fail-on-change         Exit 1 if differences are found
  --help                   Show this help

Exit codes: 0 success, 1 differences (--fail-on-change), 2 invalid input/error.
Inputs: UTF-8, maximum 20 MiB each. All work stays on this computer.`;

function options(args) {
  const result = { files: [], format: 'text', delimiter: ',', fail: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--fail-on-change') { result.fail = true; continue; }
    if (['--key', '--format', '--out', '--delimiter'].includes(arg)) {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`${arg} needs a value.`);
      result[arg.slice(2)] = value;
    } else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else result.files.push(arg);
  }
  if (result.files.length !== 2 || !result.key) throw new Error('Provide two files and --key COLUMN. Use --help for examples.');
  if (!['text', 'json'].includes(result.format)) throw new Error('Format must be text or json.');
  if (result.delimiter === 'tab') result.delimiter = '\t';
  return result;
}

async function load(path, delimiter) {
  if ((await stat(path)).size > 20 * 1024 * 1024) throw new Error(`File exceeds 20 MiB: ${path}`);
  const buffer = await readFile(path);
  if (buffer.length > 20 * 1024 * 1024) throw new Error(`File exceeds 20 MiB: ${path}`);
  return parseCSV(new TextDecoder('utf-8', { fatal: true }).decode(buffer), delimiter);
}

function textReport(result) {
  const s = result.summary;
  const lines = ['RowGuard comparison', `Rows: ${s.beforeRows} before → ${s.afterRows} after`,
    `Added: ${s.added} | Removed: ${s.removed} | Changed: ${s.changed} | Unchanged shared values: ${s.unchanged}`,
    `Columns added: ${JSON.stringify(result.columnsAdded)}`, `Columns removed: ${JSON.stringify(result.columnsRemoved)}`];
  for (const r of result.added) lines.push(`+ ${JSON.stringify(r.key)} ${JSON.stringify(r.row)}`);
  for (const r of result.removed) lines.push(`- ${JSON.stringify(r.key)} ${JSON.stringify(r.row)}`);
  for (const r of result.changed) {
    for (const c of r.cells) lines.push(`~ ${JSON.stringify(r.key)} / ${JSON.stringify(c.column)}: ${JSON.stringify(c.before)} → ${JSON.stringify(c.after)}`);
  }
  return lines.join('\n');
}

try {
  if (process.argv.slice(2).includes('--help')) console.log(help);
  else {
    const opts = options(process.argv.slice(2));
    const [before, after] = await Promise.all(opts.files.map(f => load(f, opts.delimiter)));
    const result = compare(before, after, opts.key);
    const output = (opts.format === 'json' ? JSON.stringify(result, null, 2) : textReport(result)) + '\n';
    if (opts.out) await writeFile(opts.out, output, { flag: 'wx' });
    else process.stdout.write(output);
    if (opts.fail && result.summary.hasDifferences) process.exitCode = 1;
  }
} catch (error) {
  console.error(`RowGuard: ${JSON.stringify(error.message)}`);
  process.exitCode = 2;
}
