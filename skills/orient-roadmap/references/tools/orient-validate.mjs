#!/usr/bin/env node
// orient-validate.mjs — the VALUE gate for emitted orientation records.
//
// `yon validate --profile exec` checks STRUCTURE, not VALUES: per orient-spec/orient-record.yon
// (the @NOTE on ENFORCEMENT), `gate_status=banana` and a `barren`+`ready` record both validate
// clean. Enum membership and the fail-closed @CHECK gates are therefore EMITTER obligations the
// parser cannot see. This tool is that missing half — it reads the schema's own @SCHEMA enums and
// slice shapes, then checks an EMITTED instance's field VALUES against them. An orient-* skill runs
// it on its record before emit (a checkable pre-emit gate, not a tautological @RULE); CI runs it on
// the worked example + two deliberately-bad fixtures so the gate is provably alive.
//
// Usage:
//   node <skill-dir>/references/tools/orient-validate.mjs                 # self-test: example must PASS, bad fixtures must be REJECTED
//   node <skill-dir>/references/tools/orient-validate.mjs <instance.yon>  # validate one emitted record; exit 0 = conformant, 1 = not
//
// Zero-dependency. Apache-2.0. "YON" and "YounndAI" are trademarks of MARLINK TRADING SRL.

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SCHEMA = path.join(ROOT, 'orient-spec', 'orient-record.yon');

// rec:<name> shape descriptors map to the emitted @CFG id=<x>; the envelope is the one rename
// (rec:envelope is emitted as `@CFG id=orient`). rec:conf is the provenance rider — emitted as a
// `@MAP name=provenance` sidecar, handled separately below. A NEW slice shape added to the schema
// MUST be registered here or its enum fields are silently skipped (extend this map when the schema grows).
const SHAPE_TO_ID = {
  envelope: 'orient', subject: 'subject', snapshot: 'snapshot', remaining: 'remaining',
  forecast: 'forecast', trajectory: 'trajectory', delta: 'delta', resume: 'resume', gaps: 'gaps',
  roadmap: 'roadmap', // reserved-forward: rec:roadmap has no enum-typed set field yet, so this entry is currently INERT (guards nothing). The roadmap enums ride on node.istatus + label prefixes = emitter obligations — see orient-record.yon rec:roadmap @NOTE.
};
// The fail-closed identity+gate fields a record cannot honestly omit (a subset of the FROZEN
// key-sets — optional fields like degrade_reason are legitimately absent, so we require only the core).
const REQUIRED = {
  orient: ['schema_version', 'computed_at', 'ephemeral', 'tier', 'scope', 'evidence_mode', 'gate_status'],
  subject: ['name', 'kind'],
};

// --- top-level splitter: split a `set=[ … ]` / `opts=[ … ]` body on commas NOT inside quotes or brackets.
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

// strip surrounding quotes; strip a `:type` annotation off a key (gate_score:int, ephemeral:bool).
const unquote = (v) => v.trim().replace(/^"(.*)"$/s, '$1');
const bareKey = (k) => k.trim().split(':')[0].trim();

// --- parse the schema: enum tables + which (slice, field) are enum-typed and to which enum.
function parseSchema(src) {
  const enums = {};            // enumKey -> Set(opts)
  const fieldEnum = {};        // id -> { field -> enumKey }
  let conf = null;             // the provenance-rider enum fields (tier, conf)
  const unmappedShapes = [];   // rec:<x> shapes that DECLARE enum fields but have no SHAPE_TO_ID entry
  let schemaVersion = null;    // the schema's own current schema_version literal (its FROZEN-key anchor)

  for (const line of src.split(/\r?\n/)) {
    if (schemaVersion === null) {
      const v = line.match(/schema_version current value\s*=\s*(\S+?)[;\s]/);
      if (v) schemaVersion = v[1];
    }
    const en = line.match(/@SCHEMA\s+key=(\w+)\s*\|\s*opts=\[([^\]]*)\]/);
    if (en) { enums[en[1]] = new Set(splitTop(en[2]).map((o) => o.trim())); continue; }

    const cfg = line.match(/@CFG\s+id=rec:(\w+)\s*\|\s*set=\[(.*)\]\s*$/);
    if (!cfg) continue;
    const [, shape, body] = cfg;
    const map = {};
    for (const entry of splitTop(body)) {
      const m = entry.match(/^\s*(\w+)\s*=\s*enum\.(\w+)\s*$/);
      if (m) map[m[1]] = m[2];
    }
    if (shape === 'conf') { conf = map; continue; }     // provenance rider, applied to @MAP provenance
    const id = SHAPE_TO_ID[shape];
    if (id) fieldEnum[id] = map;
    else if (Object.keys(map).length) unmappedShapes.push(shape);  // enum-bearing but unmapped → would be skipped
  }
  return { enums, fieldEnum, conf, unmappedShapes, schemaVersion };
}

// Extract the body between `key=[ … ]` with bracket-depth + quote awareness, so a trailing ` | seg`
// after the closing `]` (legal YON — records are pipe-separated field lists) or a nested `[ … ]`
// inside a value cannot corrupt the parse. Returns null if the brackets are unterminated, so the
// caller fails CLOSED (a recognized-but-unparseable line is an error, never a silent skip).
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
  return null;  // unterminated
}

// --- parse an emitted instance: id -> { field -> value } for @CFG, plus the provenance @MAP values.
function parseInstance(src) {
  const cfgs = {};
  const provenance = [];       // [{ field, value }] from @MAP name=provenance
  const parseErrors = [];      // recognized lines whose bracket body would not parse (fail-closed)
  for (const line of src.split(/\r?\n/)) {
    const cfgId = line.match(/@CFG\s+id=([^\s|]+)/);
    if (cfgId) {
      const id = cfgId[1];
      if (id in cfgs) parseErrors.push(`duplicate @CFG id=${id} — exactly one per record (last-wins masking is forbidden)`);
      const body = bracketBody(line, 'set');
      if (body === null) { parseErrors.push(`@CFG id=${id}: unparseable set=[…] (unbalanced brackets)`); continue; }
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
      if (!(id in cfgs)) cfgs[id] = fields;   // keep the FIRST occurrence; the duplicate is already flagged
      continue;
    }
    if (/@MAP\s+name=provenance\b/.test(line)) {
      const body = bracketBody(line, 'pairs');
      if (body === null) { parseErrors.push('@MAP name=provenance: unparseable pairs=[…] (unbalanced brackets)'); continue; }
      for (const pair of splitTop(body)) {
        const m = pair.match(/^\s*"([^"]+)"\s*->\s*"([^"]+)"\s*$/);
        if (m) provenance.push({ field: m[1], value: m[2] });
      }
    }
  }
  return { cfgs, provenance, parseErrors };
}

export function validate(instancePath, schemaPath = SCHEMA) {
  const errors = [], warnings = [];
  const { enums, fieldEnum, conf, unmappedShapes, schemaVersion } = parseSchema(readFileSync(schemaPath, 'utf8'));
  const { cfgs, provenance, parseErrors } = parseInstance(readFileSync(instancePath, 'utf8'));
  const env = cfgs.orient;

  // 0a. Tool-integrity: a schema slice that declares enum fields but is unmapped would be silently
  //     SKIPPED — fail LOUD so the gate cannot rot when the schema grows a slice (update SHAPE_TO_ID).
  for (const shape of unmappedShapes)
    errors.push(`tool out of date: schema slice rec:${shape} declares enum fields but is not in SHAPE_TO_ID — its values would be unchecked; update tools/orient-validate.mjs`);

  // 0b. A recognized @CFG/@MAP line whose brackets won't parse, a duplicate id, or a duplicate key is a hard error.
  errors.push(...parseErrors);

  // 1. The envelope must exist and carry its fail-closed core (chk:has-inputs).
  if (!env) {
    errors.push('no envelope — expected `@CFG id=orient` (the per-call frame)');
  } else {
    for (const k of REQUIRED.orient) if (!(k in env)) errors.push(`envelope missing required field "${k}"`);
    if (typeof env.scope === 'string' && env.scope.trim() === '') errors.push('envelope.scope is empty (chk:has-inputs)');
    // schema_version must match the version this validator models (its FROZEN key-sets) — else it cannot vouch.
    if (schemaVersion && env.schema_version && env.schema_version !== schemaVersion)
      errors.push(`schema_version "${env.schema_version}" != "${schemaVersion}" (the version this validator models) — its FROZEN field-key sets may have drifted; update the validator`);
  }

  // The subject slice is required (it carries the gate denominator); an absent slice must not bypass its fields.
  if (!cfgs.subject) errors.push('no subject — expected `@CFG id=subject` (the identity slice)');
  else for (const k of REQUIRED.subject) if (!(k in cfgs.subject)) errors.push(`subject missing required field "${k}"`);

  // 2. Enum membership on every enum-typed @CFG field (the check `yon validate` skips).
  for (const [id, fields] of Object.entries(cfgs)) {
    const map = fieldEnum[id];
    if (!map) continue;
    for (const [field, enumKey] of Object.entries(map)) {
      if (!(field in fields)) continue;            // optional field, legitimately absent
      const opts = enums[enumKey];
      const val = fields[field];
      if (opts && !opts.has(val))
        errors.push(`${id}.${field} = "${val}" is not a valid ${enumKey} (allowed: ${[...opts].join(', ')})`);
    }
  }

  // 3. Provenance rider: every "field"->"tier:conf:method" carries all three parts + a valid conf_tier & conf_level.
  if (conf) {
    for (const { field, value } of provenance) {
      const parts = value.split(':');
      if (parts.length < 3) { errors.push(`provenance["${field}"] = "${value}" is malformed — expected tier:conf:method`); continue; }
      const [tier, level] = parts;
      const tierOpts = enums[conf.tier], levelOpts = enums[conf.conf];
      if (tierOpts && !tierOpts.has(tier))
        errors.push(`provenance["${field}"] tier "${tier}" is not a valid ${conf.tier} (allowed: ${[...tierOpts].join(', ')})`);
      if (levelOpts && !levelOpts.has(level))
        errors.push(`provenance["${field}"] confidence "${level}" is not a valid ${conf.conf} (allowed: ${[...levelOpts].join(', ')})`);
    }
  }

  // 4. Fail-closed cross-field gate (chk:fail-closed): barren evidence must NOT yield a plausible verdict.
  if (env && env.evidence_mode === 'barren' && !['indeterminate', 'degraded'].includes(env.gate_status))
    errors.push(`fail-closed violated: evidence_mode=barren but gate_status="${env.gate_status ?? '(absent)'}" — must be indeterminate or degraded`);

  // 5. ETA must be a band, not a point estimate (chk:eta-no-point — WARN, mirrors the schema's fail=WARN).
  const fc = cfgs.forecast;
  if (fc && fc.eta_low !== undefined && fc.eta_low === fc.eta_high && fc.confidence !== 'high')
    warnings.push(`forecast ETA is a point estimate (eta_low == eta_high == "${fc.eta_low}") without high confidence — band it`);

  return { ok: errors.length === 0, errors, warnings };
}

// --- CLI -------------------------------------------------------------------
function reportOne(file) {
  if (!existsSync(file)) { console.error(`orient-validate: FAIL — missing ${file}`); return { ok: false }; }
  const r = validate(file);
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (r.ok) console.log(`orient-validate: OK — ${rel} (${r.warnings.length} warning(s))`);
  else { console.error(`orient-validate: FAIL — ${rel}`); r.errors.forEach((e) => console.error('  ✗ ' + e)); }
  r.warnings.forEach((w) => console.error('  ⚠ ' + w));
  return r;
}

const arg = process.argv[2];
if (arg) {
  process.exit(reportOne(path.resolve(arg)).ok ? 0 : 1);
}

// No arg → self-test: the example must PASS; the two bad fixtures (the schema's own cited
// counter-examples — enum-banana and barren+ready) must be REJECTED. This is the gate-fires
// proof for the value gate: a green run means it tells a conformant record from a broken one.
const EX = path.join(ROOT, 'orient-spec', 'examples', 'orient-record.example.yon');
const BAD = path.join(ROOT, 'orient-spec', 'examples', 'bad');
const cases = [
  { file: EX, expect: 'accept', why: 'the worked, conformant example' },
  { file: path.join(BAD, 'enum-banana.yon'), expect: 'reject', expectError: /not a valid gate_status/, why: 'gate_status=banana — an enum the parser cannot catch' },
  { file: path.join(BAD, 'fail-open.yon'), expect: 'reject', expectError: /fail-closed violated/, why: 'evidence_mode=barren + gate_status=ready — fail-open the parser cannot catch' },
];
let failed = false;
console.log('orient-validate self-test (value gate vs orient-spec/orient-record.yon):');
for (const c of cases) {
  if (!existsSync(c.file)) { console.error(`  FAIL — missing fixture ${path.relative(ROOT, c.file)}`); failed = true; continue; }
  const r = validate(c.file);
  const got = r.ok ? 'accept' : 'reject';
  // Assert the REASON, not just the verdict: a fixture rejected for the wrong reason (e.g. an enum
  // rename turned the fail-open into an enum miss) silently stops exercising the gate it was built to prove.
  const reasonOk = !c.expectError || r.errors.some((e) => c.expectError.test(e));
  const pass = got === c.expect && reasonOk;
  if (!pass) failed = true;
  const note = c.expect === 'reject' && got === 'reject' && !reasonOk ? ` (rejected, but NOT via ${c.expectError} — fixture desynced from the schema)` : '';
  console.log(`  ${pass ? '✓' : '✗'} expected ${c.expect}, got ${got} — ${c.why}${note}`);
}
if (failed) { console.error('orient-validate: FAIL — the value gate did not behave as specified.'); process.exit(1); }
console.log('orient-validate: OK — example accepted; both bad fixtures rejected. The value gate is alive.');
