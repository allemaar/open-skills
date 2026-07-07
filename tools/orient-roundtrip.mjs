#!/usr/bin/env node
// orient-roundtrip.mjs — guard for the orient-spec emission contract.
//
// 1. Validates the example orientation instance under --profile exec.
// 2. Asserts NO in-set bracket-list (`set=[ … field=[ … ] … ]`) slipped in — that is the
//    silent-corruption shape the cold-review found: an in-set bracket-list empties the field
//    AND drops every field after it, yet still validates. Lists MUST be a sidecar @MAP / repeated @CFG.
//
// Wire into CI (conformance.yml) when the orient-* skills ship. Run from the repo root:
//   node tools/orient-roundtrip.mjs
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const FILES = ['orient-spec/examples/orient-record.example.yon', 'orient-spec/examples/orient-roadmap.example.yon'];
const PARSER = 'npx -y @younndai/yon-parser@latest';
let failed = false;

for (const f of FILES) {
  if (!existsSync(f)) { console.error(`orient-roundtrip: FAIL — missing ${f}`); failed = true; continue; }
  try {
    execSync(`${PARSER} validate ${f} --profile exec`, { stdio: 'inherit' });
  } catch {
    console.error(`orient-roundtrip: FAIL — ${f} did not validate under exec.`);
    failed = true;
  }
  const offenders = readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .filter((l) => /\bset=\[/.test(l) && /=\[/.test(l.replace(/\bset=\[/, '')));
  if (offenders.length) {
    console.error(`orient-roundtrip: FAIL — in-set bracket-list found in ${f} (use a sidecar @MAP):`);
    offenders.forEach((l) => console.error('  ' + l.trim()));
    failed = true;
  }
}

// 3. Render-face parity fixtures — each trio {record, ASCII twin, reference widget} must agree on the
//    node-set (parity), the ASCII twin must carry every change/zone/list datum (information-complete
//    fallback), and the widget must obey the read_me chrome rules (no hardcoded hex, no position:fixed,
//    role=img + title/desc a11y, a fixed viewBox — 680 for the map, 780 for the denser roadmap band board).
//    This is the machine half of the emitter parity obligation — yon validate checks structure, not
//    values, so the trio is the conformance test (orient-record.yon:10).
const fail = (m) => { console.error('orient-roundtrip: FAIL — ' + m); failed = true; };

// The parity fixtures. Each names its own expected viewBox width so a denser member (orient-roadmap at
// 780) is machine-checked at ITS width rather than being forced to shrink to the map's 680. mapNames
// lists the sidecar @MAP names whose values must all reach the ASCII twin (information-completeness).
const TRIOS = [
  {
    label: 'orient-map',
    record: 'orient-spec/examples/orient-record.example.yon',
    ascii: 'orient-spec/examples/orient-map.ascii.txt',
    widget: 'orient-spec/examples/orient-map.widget.svg',
    viewBoxWidth: 680,
    mapNames: ['changes', 'no_change_zones', 'missed_while_away'],
  },
  {
    label: 'orient-roadmap',
    record: 'orient-spec/examples/orient-roadmap.example.yon',
    ascii: 'orient-spec/examples/orient-roadmap.ascii.txt',
    widget: 'orient-spec/examples/orient-roadmap.widget.svg',
    viewBoxWidth: 780,
    mapNames: ['built_items', 'gates', 'next_items', 'runway_stages', 'cleanup_now', 'deferred'],
  },
];

// Whole-token presence — NOT a bare substring, so "fix" cannot alias inside "fix-pass".
const hasToken = (hay, label) =>
  new RegExp(`(?<![\\w-])${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(hay);

function checkTrio(t) {
  const missing = [t.record, t.ascii, t.widget].filter((f) => !existsSync(f));
  if (missing.length) { fail(`[${t.label}] parity fixture missing: ${missing.join(', ')}`); return; }
  const rec = readFileSync(t.record, 'utf8');
  const ascii = readFileSync(t.ascii, 'utf8');
  const widget = readFileSync(t.widget, 'utf8');

  // node labels = the structural spine; MUST appear in BOTH human faces as whole tokens (parity).
  const nodeLabels = [...rec.matchAll(/id=node\.\w+\s*\|\s*set=\[[^\]]*\blabel=([^,\]]+)/g)].map((m) => m[1].trim());
  if (!nodeLabels.length) fail(`[${t.label}] no node labels found in the record fixture`);
  for (const label of nodeLabels) {
    if (!hasToken(ascii, label)) fail(`[${t.label}] node "${label}" missing from the ASCII twin (parity)`);
    if (!hasToken(widget, label)) fail(`[${t.label}] node "${label}" missing from the widget (parity)`);
  }

  // sidecar @MAP list values = information-completeness of the ASCII fallback (every widget datum in ASCII).
  const mapVals = (name) => {
    const line = rec.split(/\r?\n/).find((l) => l.includes(`@MAP name=${name}`)) || '';
    return [...line.matchAll(/->"([^"]+)"/g)].map((m) => m[1].trim());
  };
  for (const name of t.mapNames)
    for (const label of mapVals(name))
      if (!ascii.includes(label)) fail(`[${t.label}] datum "${label}" missing from the ASCII twin (information-complete fallback)`);

  // widget chrome rules (read_me): redundant (non-color) tier encoding, no hardcoded color, no
  // position:fixed (any case), non-empty role=img a11y, the trio's own fixed viewBox width.
  if (!/[◆◐◌]/.test(widget)) fail(`[${t.label}] widget encodes tier by color alone — add ◆◐◌ tier glyphs (redundant non-color encoding)`);
  const allowed = (v) => v.startsWith('var(') || v.startsWith('url(') || ['none', 'context-stroke', 'currentColor', 'inherit', 'transparent'].includes(v);
  const badColor = [...widget.matchAll(/(?:fill|stroke|stop-color|color)\s*[=:]\s*"?([^";)\s]+)/g)]
    .map((m) => m[1].trim()).find((v) => !allowed(v));
  if (badColor) fail(`[${t.label}] widget uses a hardcoded color "${badColor}" — colors only via CSS vars / c-* classes`);
  if (/position\s*:\s*fixed/i.test(widget)) fail(`[${t.label}] widget uses position:fixed (collapses the iframe)`);
  if (!/role="img"/.test(widget) || !/<title>[^<]+<\/title>/.test(widget) || !/<desc>[^<]+<\/desc>/.test(widget))
    fail(`[${t.label}] widget SVG missing role="img" + non-empty <title>/<desc> (a11y)`);
  if (!new RegExp(`viewBox="0 0 ${t.viewBoxWidth}\\b`).test(widget)) fail(`[${t.label}] widget SVG must use the fixed ${t.viewBoxWidth} viewBox`);
}

for (const t of TRIOS) checkTrio(t);

if (failed) process.exit(1);
console.log('orient-roundtrip: OK — example validates under exec; no in-set bracket-lists; render-face parity fixtures consistent.');
