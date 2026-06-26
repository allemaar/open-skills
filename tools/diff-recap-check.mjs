#!/usr/bin/env node
// diff-recap-check.mjs — the VALUE gate for emitted diff-recap records.
//
// `yon validate --profile exec` checks STRUCTURE, not VALUES. A diff-recap record can be
// structurally valid YON yet (a) carry an out-of-enum status, (b) state totals that DON'T equal
// the sum of its per-file rows — defeating the whole "true by construction" claim, (c) hide a row
// under an id the naive reader skips, (d) carry negative or non-integer counts git never emits, or
// (e) claim a clean recap from a barren read. Those are EMITTER obligations the parser cannot see.
// This tool is that missing half: it reads the schema's @SCHEMA enums (single source of truth) and
// checks an EMITTED instance's VALUES — enum membership, the Σ per-file == totals invariant, strict
// id reconciliation (no hidden rows), non-negativity, and the fail-closed / attested cross-field
// gates. With --numstat it also asserts every per-file count matches the git numstat the row claims
// to transcribe (the strongest attestation).
//
// Usage:
//   node tools/diff-recap-check.mjs                          # self-test: example PASS, bad fixtures REJECTED
//   node tools/diff-recap-check.mjs <instance.yon>           # validate one record; exit 0 = ok, 1 = not
//   node tools/diff-recap-check.mjs <instance.yon> --numstat <numstat.txt>   # also verify rows vs git numstat
//   node tools/diff-recap-check.mjs -- <path-starting-with-dashes.yon>       # -- ends flag parsing
//
// Zero-dependency. Apache-2.0. "YON" and "YounndAI" are trademarks of MARLINK TRADING SRL.

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SCHEMA = path.join(ROOT, 'skills', 'diff-recap', 'recap-schema.yon');

// The enum keys this validator MODELS. A schema enum outside this set would be unchecked — so we
// fail LOUD (anti-rot) rather than silently skip it (the build-1 lesson: an unmodeled slice is a hole).
const MODELED_ENUMS = new Set(['status', 'gate_status']);
// Fail-closed core a record cannot honestly omit.
const REQUIRED_ENVELOPE = ['schema_version', 'computed_at', 'ephemeral', 'tool', 'range',
  'total_files', 'total_added', 'total_removed', 'attested', 'gate_status'];
const REQUIRED_SUBJECT = ['name', 'kind'];
const SCHEMA_VERSION = 'diff-recap/1';
// The ONLY @CFG ids a record may carry. A row id must match FILE_ID exactly; any other id (e.g.
// `files.hidden`, `file.`, `FILE.x`) is a hidden-slice attempt and is rejected, never skipped.
const FILE_ID = /^file\.[A-Za-z0-9_-]+$/;

// --- top-level splitter: split a set body on commas NOT inside quotes or brackets.
function splitTop(body) {
  const out = [];
  let buf = '', q = false, depth = 0;
  for (const ch of body) {
    if (ch === '"') q = !q;
    else if (!q && (ch === '[' || ch === '(')) depth++;
    else if (!q && (ch === ']' || ch === ')')) depth--;
    if (ch === ',' && !q && depth === 0) { out.push(buf); buf = ''; continue; }
    buf += ch;
  }
  if (buf.trim()) out.push(buf);
  return out;
}

const unquote = (v) => v.trim().replace(/^"(.*)"$/s, '$1');
const bareKey = (k) => k.trim().split(':')[0].trim();
const isInt = (v) => /^-?\d+$/.test(String(v).trim());
// A '[' OUTSIDE quotes inside a set/pairs body = a forbidden in-set bracket-list (silent corruption
// that still validates; cf. the orient-roundtrip offender scan and rule:list-encoding).
function hasNakedBracket(body) {
  let q = false;
  for (const ch of body) { if (ch === '"') q = !q; else if (!q && ch === '[') return true; }
  return false;
}

// Extract the body between `key=[ … ]` with bracket-depth + quote awareness; null if unterminated
// (so a recognized-but-unparseable line fails CLOSED, never a silent skip).
function bracketBody(line, key) {
  const open = `${key}=[`;
  const start = line.indexOf(open);
  if (start < 0) return null;
  let depth = 1, q = false, body = '';
  for (let i = start + open.length; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { q = !q; body += ch; continue; }
    if (!q && ch === '[') depth++;
    else if (!q && ch === ']') { depth--; if (depth === 0) return body; }
    body += ch;
  }
  return null;
}

function parseSchema(src) {
  const enums = {};
  const unmodeled = [];
  for (const line of src.split(/\r?\n/)) {
    const en = line.match(/@SCHEMA\s+key=(\w+)\s*\|\s*opts=\[([^\]]*)\]/);
    if (!en) continue;
    enums[en[1]] = new Set(splitTop(en[2]).map((o) => o.trim()));
    if (!MODELED_ENUMS.has(en[1])) unmodeled.push(en[1]);
  }
  return { enums, unmodeled };
}

// --- parse an emitted instance: id -> { field -> value } for each @CFG; structural defects collected.
function parseInstance(src) {
  const cfgs = {};
  const parseErrors = [];
  for (const line of src.split(/\r?\n/)) {
    const cfgId = line.match(/@CFG\s+id=([^\s|]+)/);
    const mapName = line.match(/@MAP\s+name=([^\s|]+)/);
    if (cfgId) {
      const id = cfgId[1];
      if (id in cfgs) parseErrors.push(`duplicate @CFG id=${id} — exactly one per id (last-wins masking is forbidden)`);
      const body = bracketBody(line, 'set');
      if (body === null) { parseErrors.push(`@CFG id=${id}: unparseable set=[…] (unbalanced brackets)`); continue; }
      if (hasNakedBracket(body)) parseErrors.push(`@CFG id=${id}: in-set bracket-list — list fields must be a sidecar @MAP, never nested in set=[…] (silent corruption)`);
      const fields = {};
      const seen = new Set();
      for (const entry of splitTop(body)) {
        const eq = entry.indexOf('=');
        if (eq < 0) continue;
        const k = bareKey(entry.slice(0, eq));
        if (seen.has(k)) parseErrors.push(`@CFG id=${id}: duplicate key "${k}" in set (last-wins masking is forbidden)`);
        seen.add(k);
        fields[k] = unquote(entry.slice(eq + 1));
      }
      if (!(id in cfgs)) cfgs[id] = fields;
      continue;
    }
    if (mapName) {
      const body = bracketBody(line, 'pairs');
      if (body === null) { parseErrors.push(`@MAP name=${mapName[1]}: unparseable pairs=[…] (unbalanced brackets)`); continue; }
      if (hasNakedBracket(body)) parseErrors.push(`@MAP name=${mapName[1]}: nested bracket-list inside pairs=[…]`);
    }
  }
  return { cfgs, parseErrors };
}

// --- parse a `git diff --numstat` capture: lines "added<TAB>removed<TAB>path" (dashes = binary).
function parseNumstat(src, errors) {
  const map = {};
  for (const line of src.split(/\r?\n/)) {
    const m = line.match(/^([\d-]+)\t([\d-]+)\t(.+)$/);
    if (!m) continue;
    const p = m[3].trim();
    if (p in map) errors.push(`numstat lists path "${p}" more than once — ambiguous attestation`);
    const added = m[1] === '-' ? 0 : Number(m[1]);
    const removed = m[2] === '-' ? 0 : Number(m[2]);
    map[p] = { added, removed };
  }
  return map;
}

export function validate(instancePath, opts = {}) {
  const errors = [];
  const { enums, unmodeled } = parseSchema(readFileSync(SCHEMA, 'utf8'));
  const { cfgs, parseErrors } = parseInstance(readFileSync(instancePath, 'utf8'));
  const env = cfgs.recap;

  // 0a. Tool-integrity: a schema enum the validator does not model would be unchecked — fail LOUD.
  for (const k of unmodeled)
    errors.push(`tool out of date: schema declares enum "${k}" not modeled by tools/diff-recap-check.mjs — its values would be unchecked; update MODELED_ENUMS`);
  // 0b. Structural parse defects (dup id, dup key, unbalanced/in-set brackets) are hard errors.
  errors.push(...parseErrors);

  // 1. Reconcile EVERY @CFG id — only recap, subject, and file.<n> are legal. An unknown id is a
  //    hidden slice (a change smuggled under an id excluded from the sum), never silently skipped.
  for (const id of Object.keys(cfgs)) {
    if (id === 'recap' || id === 'subject' || FILE_ID.test(id)) continue;
    errors.push(`unrecognized @CFG id="${id}" — expected recap, subject, or file.<n> (a hidden slice excluded from the sum is forbidden)`);
  }

  // 2. Envelope present + fail-closed core + integer/non-negative totals + gate_status enum.
  if (!env) {
    errors.push('no envelope — expected `@CFG id=recap`');
  } else {
    for (const k of REQUIRED_ENVELOPE) if (!(k in env)) errors.push(`envelope missing required field "${k}"`);
    if (env.schema_version && env.schema_version !== SCHEMA_VERSION)
      errors.push(`schema_version "${env.schema_version}" != "${SCHEMA_VERSION}" (the version this validator models) — update the validator`);
    if ('gate_status' in env && enums.gate_status && !enums.gate_status.has(env.gate_status))
      errors.push(`recap.gate_status = "${env.gate_status}" is not a valid gate_status (allowed: ${[...enums.gate_status].join(', ')})`);
    for (const k of ['total_files', 'total_added', 'total_removed']) {
      if (!(k in env)) continue;
      if (!isInt(env[k])) errors.push(`envelope.${k} = "${env[k]}" is not an integer — a non-integer silently disables the totals invariant`);
      else if (Number(env[k]) < 0) errors.push(`envelope.${k} = "${env[k]}" is negative — git diff counts are never negative`);
    }
  }

  // 3. Subject slice required.
  if (!cfgs.subject) errors.push('no subject — expected `@CFG id=subject`');
  else for (const k of REQUIRED_SUBJECT) if (!(k in cfgs.subject)) errors.push(`subject missing required field "${k}"`);

  // 4. File rows — enum status, required fields, integer + NON-NEGATIVE counts (numstat never emits
  //    negatives; a negative row would mask another row's inflation while Σ still matches).
  const rows = [];
  for (const [id, f] of Object.entries(cfgs)) {
    if (!FILE_ID.test(id)) continue;
    if ('status' in f && enums.status && !enums.status.has(f.status))
      errors.push(`${id}.status = "${f.status}" is not a valid status (allowed: ${[...enums.status].join(', ')})`);
    if (!('path' in f)) errors.push(`${id} missing required field "path"`);
    for (const k of ['added', 'removed']) {
      if (!(k in f)) { errors.push(`${id} missing required field "${k}"`); continue; }
      if (!isInt(f[k])) errors.push(`${id}.${k} = "${f[k]}" is not an integer`);
      else if (Number(f[k]) < 0) errors.push(`${id}.${k} = "${f[k]}" is negative — git diff counts are never negative`);
    }
    rows.push({ id, added: Number(f.added), removed: Number(f.removed), path: f.path, status: f.status });
  }

  // 5. THE true-by-construction invariant — Σ per-file == envelope totals, row count == total_files.
  //    Runs UNCONDITIONALLY whenever the envelope exists; the integer check above already flagged a
  //    poisoned total, but we still compare so a poisoned total can never *skip* the comparison.
  if (env) {
    const sumA = rows.reduce((s, r) => s + r.added, 0);
    const sumR = rows.reduce((s, r) => s + r.removed, 0);
    if (isInt(env.total_added) && sumA !== Number(env.total_added))
      errors.push(`sum mismatch: total_added=${env.total_added} but the per-file added sum to ${sumA} — the headline drifted from the rows`);
    if (isInt(env.total_removed) && sumR !== Number(env.total_removed))
      errors.push(`sum mismatch: total_removed=${env.total_removed} but the per-file removed sum to ${sumR}`);
    if (isInt(env.total_files) && rows.length !== Number(env.total_files))
      errors.push(`count mismatch: total_files=${env.total_files} but ${rows.length} file row(s) are present`);
  }

  // 6. Fail-closed + attested cross-field gates (every gate_status state is now constrained).
  if (env) {
    const gs = env.gate_status, att = env.attested;
    if (gs === 'clean' && att !== 'true')
      errors.push(`attested gate violated: gate_status=clean requires attested=true (got attested="${att ?? '(absent)'}")`);
    if (gs === 'partial' && rows.length === 0)
      errors.push('gate_status=partial but no file rows — an empty recap is barren, not partial');
    if (gs === 'barren') {
      if (rows.length !== 0) errors.push(`fail-closed violated: gate_status=barren but ${rows.length} file row(s) present — barren must carry no rows`);
      if (att === 'true') errors.push('fail-closed violated: gate_status=barren but attested=true — barren means no git source');
    }
  }

  // 7. Optional: verify each row against a captured git numstat (the strongest per-file attestation).
  if (opts.numstat) {
    const ns = parseNumstat(readFileSync(opts.numstat, 'utf8'), errors);
    const seenPaths = new Set();
    for (const r of rows) {
      seenPaths.add(r.path);
      const g = ns[r.path];
      if (!g) { errors.push(`row ${r.id} path "${r.path}" is absent from the git numstat — a fabricated file`); continue; }
      if (g.added !== r.added || g.removed !== r.removed)
        errors.push(`row ${r.id} (${r.path}) claims +${r.added}/-${r.removed} but git numstat says +${g.added}/-${g.removed}`);
    }
    for (const p of Object.keys(ns)) if (!seenPaths.has(p)) errors.push(`git numstat lists "${p}" but no row transcribes it — a dropped file`);
  }

  return { ok: errors.length === 0, errors };
}

// --- ASCII ↔ widget ↔ record parity (self-test only): the three faces must agree on the rows +
// totals. "True by construction" must hold across the projections too, not only inside the record.
function checkParity(recordPath, asciiPath, svgPath) {
  const errors = [];
  const { cfgs } = parseInstance(readFileSync(recordPath, 'utf8'));
  const ascii = readFileSync(asciiPath, 'utf8');
  const svg = readFileSync(svgPath, 'utf8');
  const rows = Object.entries(cfgs).filter(([id]) => FILE_ID.test(id)).map(([, f]) => f);
  for (const f of rows) {
    if (!ascii.includes(f.path)) errors.push(`ASCII twin omits row "${f.path}"`);
    if (!svg.includes(f.path)) errors.push(`widget omits row "${f.path}"`);
  }
  const env = cfgs.recap || {};
  for (const face of [['ASCII', ascii], ['widget', svg]]) {
    if (env.total_added && !face[1].includes(String(env.total_added))) errors.push(`${face[0]} omits total_added=${env.total_added}`);
    if (env.total_removed && !face[1].includes(String(env.total_removed))) errors.push(`${face[0]} omits total_removed=${env.total_removed}`);
  }
  return errors;
}

// --- CLI -------------------------------------------------------------------
function reportOne(file, numstat) {
  if (!existsSync(file)) { console.error(`diff-recap-check: FAIL — missing ${file}`); return { ok: false }; }
  const r = validate(file, { numstat });
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (r.ok) console.log(`diff-recap-check: OK — ${rel}`);
  else { console.error(`diff-recap-check: FAIL — ${rel}`); r.errors.forEach((e) => console.error('  ✗ ' + e)); }
  return r;
}

function runSelfTest() {
  const EX = path.join(ROOT, 'skills', 'diff-recap', 'examples');
  const cases = [
    { file: path.join(EX, 'diff-recap.example.yon'), numstat: path.join(EX, 'diff-recap.numstat'),
      expect: 'accept', why: 'the worked, conformant example (rows match the git numstat fixture)' },
    { file: path.join(EX, 'bad', 'fabricated-counts.yon'), expect: 'reject', expectError: /sum mismatch/,
      why: 'total_added inflated past the sum of the rows — the true-by-construction defeat' },
    { file: path.join(EX, 'bad', 'fail-open.yon'), expect: 'reject', expectError: /attested gate violated/,
      why: 'gate_status=clean with attested=false — a clean recap claimed from no git source' },
    { file: path.join(EX, 'bad', 'numstat-mismatch.yon'), numstat: path.join(EX, 'diff-recap.numstat'),
      expect: 'reject', expectError: /absent from the git numstat|no row transcribes it/,
      why: 'a row transcribes a file the git numstat does not contain (and drops a real one)' },
  ];
  let failed = false;
  console.log('diff-recap-check self-test (value gate vs skills/diff-recap/recap-schema.yon):');
  for (const c of cases) {
    if (!existsSync(c.file)) { console.error(`  FAIL — missing fixture ${path.relative(ROOT, c.file)}`); failed = true; continue; }
    const r = validate(c.file, { numstat: c.numstat });
    const got = r.ok ? 'accept' : 'reject';
    const reasonOk = !c.expectError || r.errors.some((e) => c.expectError.test(e));
    const pass = got === c.expect && reasonOk;
    if (!pass) failed = true;
    const note = c.expect === 'reject' && got === 'reject' && !reasonOk ? ` (rejected, but NOT via ${c.expectError} — fixture desynced)` : '';
    console.log(`  ${pass ? '✓' : '✗'} expected ${c.expect}, got ${got} — ${c.why}${note}`);
  }
  // Face parity: the example record, its ASCII twin, and its widget must carry the same rows + totals.
  const par = checkParity(path.join(EX, 'diff-recap.example.yon'), path.join(EX, 'diff-recap.ascii.txt'), path.join(EX, 'diff-recap.widget.svg'));
  if (par.length) { failed = true; par.forEach((e) => console.error('  ✗ parity: ' + e)); }
  else console.log('  ✓ ASCII ↔ widget ↔ record parity holds (same rows + totals in all three faces)');
  if (failed) { console.error('diff-recap-check: FAIL — the value gate did not behave as specified.'); process.exit(1); }
  console.log('diff-recap-check: OK — example accepted; bad fixtures rejected; parity holds. The value gate is alive.');
}

// Parse argv: --numstat <val>, a `--` end-of-flags terminator, then positionals. A supplied-but-
// unresolved file MUST error (exit 2) — it must NEVER fall through to the self-test (a bad record
// silently "passing" because its path was mis-parsed was a real bug).
const argv = process.argv.slice(2);
let numstat, terminated = false;
const positionals = [];
for (let k = 0; k < argv.length; k++) {
  const a = argv[k];
  if (!terminated && a === '--') { terminated = true; continue; }
  if (!terminated && a === '--numstat') {
    // A requested check must never silently skip: --numstat with no following value is an error,
    // not a downgrade to the plain path (the supplied-but-unresolved contract, applied to the flag).
    if (k + 1 >= argv.length) { console.error('diff-recap-check: --numstat needs a path'); process.exit(2); }
    numstat = path.resolve(argv[++k]); continue;
  }
  if (!terminated && a.startsWith('--')) { console.error(`diff-recap-check: unknown flag "${a}" (use \`-- <path>\` for a file starting with dashes)`); process.exit(2); }
  positionals.push(a);
}

if (argv.length === 0) {
  runSelfTest();
} else if (positionals.length === 0) {
  console.error('diff-recap-check: no record file given (flags only). Pass a path, or run with no args for the self-test.');
  process.exit(2);
} else if (positionals.length > 1) {
  console.error(`diff-recap-check: expected one record path, got ${positionals.length} (${positionals.join(', ')}).`);
  process.exit(2);
} else {
  process.exit(reportOne(path.resolve(positionals[0]), numstat).ok ? 0 : 1);
}
