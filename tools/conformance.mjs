#!/usr/bin/env node
// YON conformance scoreboard.
// Validates every skill's protocol.yon against the PUBLIC @younndai/yon-parser
// (the same tool a user runs), writes CONFORMANCE.md, and exits non-zero if any
// protocol.yon is invalid — so CI keeps the green badge honest.
//
// Usage:  node tools/conformance.mjs        (regenerate CONFORMANCE.md + gate)
import { readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const SKILLS = 'skills';

// Resolve the validator: a globally-installed `yon` (CI installs it) else npx.
const VALIDATOR = (() => {
  try { execSync('yon --version', { stdio: 'ignore' }); return 'yon'; }
  catch { return 'npx -y @younndai/yon-parser@latest'; }
})();

function validate(file, profile) {
  try {
    execSync(`${VALIDATOR} validate "${file}" --profile ${profile}`, { stdio: 'ignore' });
    return true;
  } catch { return false; }
}

const names = readdirSync(SKILLS)
  .filter((n) => existsSync(join(SKILLS, n, 'SKILL.md')))
  .sort();

const rows = [];
let dual = 0, pass = 0, fail = 0;
for (const name of names) {
  const yon = join(SKILLS, name, 'protocol.yon');
  if (!existsSync(yon)) { rows.push({ name, profile: '—', status: 'md-only' }); continue; }
  dual++;
  const docLine = readFileSync(yon, 'utf8').split('\n').find((l) => l.startsWith('@DOC')) || '';
  const profile = (docLine.match(/profile=(\w+)/) || [, 'exec'])[1];
  if (validate(yon, profile)) { pass++; rows.push({ name, profile, status: 'pass' }); }
  else { fail++; rows.push({ name, profile, status: 'fail' }); }
}

let md = `# YON Conformance\n\n`;
md += `**${pass} / ${dual}** skills that ship a \`protocol.yon\` pass YON conformance validation, `;
md += `checked with the public [\`@younndai/yon-parser\`](https://www.npmjs.com/package/@younndai/yon-parser) using the \`exec\` profile. `;
md += `${names.length - dual} skills are Markdown-only.\n\n`;
md += `> Run it yourself: \`npx @younndai/yon-parser validate skills/<skill>/protocol.yon --profile exec\`.\n`;
md += `> Regenerate this table: \`node tools/conformance.mjs\`. Enforced in CI on every push.\n\n`;
md += `| Skill | Profile | Conformance |\n|---|---|---|\n`;
for (const r of rows) {
  const s = r.status === 'pass' ? '✅ valid' : r.status === 'fail' ? '❌ INVALID' : '— (md-only)';
  md += `| \`${r.name}\` | ${r.profile} | ${s} |\n`;
}
writeFileSync('CONFORMANCE.md', md);
console.log(`conformance: ${pass}/${dual} pass, ${fail} fail, ${names.length - dual} md-only — wrote CONFORMANCE.md`);
process.exit(fail === 0 ? 0 : 1);
