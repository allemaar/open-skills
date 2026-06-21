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

const FILES = ['orient-spec/examples/orient-record.example.yon'];
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

if (failed) process.exit(1);
console.log('orient-roundtrip: OK — example validates under exec; no in-set bracket-lists.');
