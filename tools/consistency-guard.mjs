// Coupled-constant consistency guard.
//
// Two cross-document invariants that nothing else enforces — both are the same
// class of bug: a number duplicated across files that silently drifts.
//
//   1. COUNTS  — the skill counts stated in the docs must match reality.
//                actual: total = skills/ dirs; dual = skills/*/protocol.yon;
//                mdonly = total - dual. Any 2-digit number on a count-bearing
//                line in README.md / THREAT-MODEL.md must be one of those three.
//   2. VERSION — the CHANGELOG released versions and the git tags must be a
//                bijection (ignoring an "## [Unreleased]" section), and the
//                latest released CHANGELOG entry must equal the latest tag.
//                (NOT a naive "top == tag" — Keep-a-Changelog keeps Unreleased
//                on top during development.)
//
// Usage:  node tools/consistency-guard.mjs
// Exit:   non-zero on any drift. Zero npm deps.

import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const fail = (m) => errors.push(m);

// --- 1. COUNTS --------------------------------------------------------------

function skillDirs() {
  return readdirSync(join(ROOT, 'skills'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

const dirs = skillDirs();
const total = dirs.length;
const dual = dirs.filter((n) => existsSync(join(ROOT, 'skills', n, 'protocol.yon'))).length;
const mdonly = total - dual;
const valid = new Set([total, dual, mdonly]);

const COUNT_DOCS = ['README.md', 'THREAT-MODEL.md'];
// a line "counts" if it talks about the pack size in any wording
const COUNT_LINE = /\bskills?\b|protocol\.yon|markdown-only/i;

for (const doc of COUNT_DOCS) {
  const path = join(ROOT, doc);
  if (!existsSync(path)) { fail(`COUNT: ${doc} missing`); continue; }
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!COUNT_LINE.test(line)) return;
    // 2-digit integers only — counts are 14/34/48; single digits (e.g. "3 lines") are ignored.
    const nums = (line.match(/\b\d{2}\b/g) || []).map(Number);
    for (const n of nums) {
      if (!valid.has(n)) {
        fail(`COUNT: ${doc}:${i + 1} states "${n}" on a skill-count line; actual counts are total=${total}, dual=${dual}, md-only=${mdonly}`);
      }
    }
  });
}

// --- 2. VERSION (tags <-> CHANGELOG bijection) ------------------------------

function semverKey(v) {
  const [a, b, c] = v.split('.').map(Number);
  return a * 1e6 + b * 1e3 + c;
}

const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
const clVersions = [...changelog.matchAll(/^##\s*\[(\d+\.\d+\.\d+)\]/gm)].map((m) => m[1]);
if (clVersions.length === 0) fail('VERSION: no released "## [x.y.z]" entries found in CHANGELOG.md');

let tags = [];
try {
  tags = execFileSync('git', ['tag', '-l', 'v*.*.*'], { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/).filter(Boolean).map((t) => t.replace(/^v/, ''))
    .filter((t) => /^\d+\.\d+\.\d+$/.test(t));
} catch {
  fail('VERSION: could not read git tags (is this a git repo?)');
}

const clSet = new Set(clVersions);
const tagSet = new Set(tags);
for (const v of clSet) if (!tagSet.has(v)) fail(`VERSION: CHANGELOG has [${v}] but no git tag v${v}`);
for (const v of tagSet) if (!clSet.has(v)) fail(`VERSION: git tag v${v} has no CHANGELOG entry`);

if (clVersions.length && tags.length) {
  const latestCl = [...clSet].sort((a, b) => semverKey(b) - semverKey(a))[0];
  const latestTag = [...tagSet].sort((a, b) => semverKey(b) - semverKey(a))[0];
  if (latestCl !== latestTag) {
    fail(`VERSION: latest CHANGELOG release [${latestCl}] != latest tag v${latestTag}`);
  }
}

// --- report -----------------------------------------------------------------

if (errors.length) {
  console.error(`consistency-guard: ${errors.length} drift(s)`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`consistency-guard: OK — counts (total=${total}, dual=${dual}, md-only=${mdonly}) consistent; ${clVersions.length} CHANGELOG releases ↔ ${tags.length} tags in sync`);
