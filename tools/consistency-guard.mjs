// Coupled-constant consistency guard.
//
// Two cross-document invariants that nothing else enforces — both are the same
// class of bug: a number duplicated across files that silently drifts.
//
//   1. COUNTS  — the skill counts stated in the docs must match reality.
//                actual: total = skills/ dirs; dual = skills/*/protocol.yon;
//                mdonly = total - dual. Any 2-digit number on a count-bearing
//                line in README.md / THREAT-MODEL.md — or inside a description
//                string of .claude-plugin/plugin.json / marketplace.json, the copy
//                a stranger reads at `/plugin install` — must be one of those three.
//   2. VERSION — the CHANGELOG released versions and the git tags must be a
//                bijection (ignoring an "## [Unreleased]" section), and the
//                latest released CHANGELOG entry must equal the latest tag.
//                (NOT a naive "top == tag" — Keep-a-Changelog keeps Unreleased
//                on top during development.)
//   3. MENU    — every skills-help menu entry resolves to a shipped skill.
//   4. ROSTER  — the human-spec routing table and the shipped skills/human-*/
//                dirs match BOTH ways (no phantom member, no unlisted member).
//   5. FOOTER  — a skill citing the human-output contract carries its verbatim
//                footer blockquote.
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

// --- 1b. COUNTS in the plugin manifests -------------------------------------
//
// The count also lives in .claude-plugin/plugin.json and marketplace.json — the
// strings a stranger reads at `/plugin install`, i.e. the MOST public copy of the
// number and, until 2026-07-19, the only one no guard watched (both said "37 of 51"
// while the pack shipped 54). Same rule as the docs above, but applied to the
// DESCRIPTION STRINGS ONLY: parsing the JSON and walking to the description fields
// means `"version": "1.3.0"`, keywords, and URLs are never scanned, so a version
// bump can never false-positive as a bad count.
const COUNT_MANIFESTS = [
  ['.claude-plugin/plugin.json', (j) => [['description', j.description]]],
  ['.claude-plugin/marketplace.json', (j) => [
    ['description', j.description],
    ...(j.plugins || []).map((p, i) => [`plugins[${i}].description`, p.description]),
  ]],
];

for (const [rel, pick] of COUNT_MANIFESTS) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) { fail(`COUNT: ${rel} missing`); continue; }
  let json;
  try {
    json = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    // Fail closed: unparseable manifest means the check verified nothing.
    fail(`COUNT: ${rel} is not valid JSON (${e.message}) — guard cannot verify its counts`);
    continue;
  }
  const fields = pick(json).filter(([, text]) => typeof text === 'string');
  if (fields.length === 0) {
    fail(`COUNT: ${rel} has no description string — the manifest shape changed; update this guard`);
    continue;
  }
  for (const [field, text] of fields) {
    if (!COUNT_LINE.test(text)) continue;
    for (const n of (text.match(/\b\d{2}\b/g) || []).map(Number)) {
      if (!valid.has(n)) {
        fail(`COUNT: ${rel} (${field}) states "${n}" in a skill-count description; actual counts are total=${total}, dual=${dual}, md-only=${mdonly} — this string is what a user reads at \`/plugin install\``);
      }
    }
  }
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

// --- 3. MENU (skills-help roster -> shipped skills) -------------------------
//
// skills-help/SKILL.md carries a hand-authored menu snapshot. On export from a
// larger private library it listed ~18 skills this pack does not ship (whole
// private-only families) — a public front door advertising skills a
// reader cannot have. This gates the PHANTOM direction: every menu entry must
// resolve to a shipped skill. The MISSING direction (a shipped skill absent from
// the menu) is left to the skill's own render-time protocol, which appends an
// unlisted skill with a ⚠ — a deliberate soft-handle, so gating it here would
// fight the design and fail CI on every newly-added skill.
// `--menu-file <path>` overrides the menu source so gate-fires can point this check
// at a fixture (a menu naming a phantom skill), proving it rejects. Defaults to the
// real menu. Same idiom as dco-guard's --message-file and lint's single-file mode.
const menuFlag = process.argv.indexOf('--menu-file');
const menuFile = menuFlag !== -1 ? process.argv[menuFlag + 1] : join(ROOT, 'skills', 'skills-help', 'SKILL.md');
if (!existsSync(menuFile)) {
  fail('MENU: skills/skills-help/SKILL.md is missing');
} else {
  const md = readFileSync(menuFile, 'utf8');
  const start = md.indexOf('## The menu');
  const end = md.indexOf('## Family drill-down');
  if (start < 0) {
    // Fail closed: if the section markers move, the check must not silently pass.
    fail('MENU: could not locate the "## The menu" section in skills-help/SKILL.md — guard cannot verify the roster');
  } else {
    const section = md.slice(start, end >= 0 ? end : undefined);
    const shipped = new Set(dirs);
    // An entry line is `- <marker> `skill-name` — …`; the marker is OPTIONAL so a
    // marker-less entry cannot evade the check (the prose promises *every* entry).
    // `[a-z0-9-]+` has no slash/dot/space, so a mid-prose path or the `obsidian` CLI
    // binary is never captured — and the menu section is entries only, no prose bullets.
    const entries = [...section.matchAll(/^-\s+(?:\S+\s+)?`([a-z0-9-]+)`/gm)].map((m) => m[1]);
    if (entries.length === 0) {
      // A menu that parses to zero entries is a reformat, not an empty pack — fail
      // closed rather than pass vacuously.
      fail('MENU: parsed 0 entries from skills-help — the entry format changed; update this guard');
    }
    for (const name of entries) {
      if (!shipped.has(name)) fail(`MENU: skills-help lists \`${name}\` but skills/${name}/ does not exist`);
    }
  }
}

// --- 4. ROSTER (human-spec routing table <-> shipped human-* skills) ---------
//
// human-spec/human-contract.md holds the family's roster and routing table, and
// every member defers to it as the authority — but until now NO tool read it, so
// it was documentation that could go stale silently. Compare orient-spec, which
// tools/orient-validate.mjs reads LIVE for its enums.
//
// The routing table (section 1) IS the manifest — section 5 of the contract says
// so explicitly: "The routing table above is the single place that has to know
// the whole roster." So this reads that table live rather than duplicating it
// into a second block that could itself drift.
//
// BOTH directions are gated, unlike the MENU check above:
//   PHANTOM — the table names a member that does not ship.
//   MISSING — a skills/human-*/ ships that the table never names. This is not a
//             soft-handle here: `human-merge` shipped while three siblings and
//             the routing table still said "not yet shipped", and nothing caught
//             it. There is no render-time protocol to fall back on.
// `--human-contract <path>` overrides the source so gate-fires can point this at a
// fixture. Same idiom as --menu-file above and dco-guard's --message-file.
const contractFlag = process.argv.indexOf('--human-contract');
const contractFile = contractFlag !== -1
  ? process.argv[contractFlag + 1]
  : join(ROOT, 'human-spec', 'human-contract.md');
if (!existsSync(contractFile)) {
  fail('ROSTER: human-spec/human-contract.md is missing');
} else {
  const md = readFileSync(contractFile, 'utf8');
  const start = md.indexOf('## 1. The roster and the routing table');
  const end = md.indexOf('## 2.');
  if (start < 0) {
    // Fail closed: if the section heading moves, the check must not silently pass.
    fail('ROSTER: could not locate the "## 1. The roster and the routing table" section in human-contract.md — guard cannot verify the roster');
  } else {
    const section = md.slice(start, end >= 0 ? end : undefined);
    // A routing-table row is `| <material> | `human-x` | <why> |`; the member is the
    // second cell and is always a single backticked name. `[a-z0-9-]+` has no slash,
    // dot or space, so a path or a mid-prose mention is never captured.
    const named = new Set(
      [...section.matchAll(/^\|[^|\n]*\|\s*`(human-[a-z0-9-]+)`\s*\|/gm)].map((m) => m[1]),
    );
    if (named.size === 0) {
      // Zero parsed members is a reformat, not an empty family — fail closed rather
      // than pass vacuously (an empty roster would otherwise satisfy both directions).
      fail('ROSTER: parsed 0 members from the human-contract routing table — the table format changed; update this guard');
    }
    const shippedHuman = new Set(dirs.filter((n) => n.startsWith('human-')));
    for (const name of named) {
      if (!shippedHuman.has(name)) {
        fail(`ROSTER: human-contract.md routing table names \`${name}\` but skills/${name}/ does not exist`);
      }
    }
    for (const name of shippedHuman) {
      if (!named.has(name)) {
        fail(`ROSTER: skills/${name}/ ships but the human-contract.md routing table never names it — a silently unlisted member`);
      }
    }
  }
}

// --- 5. FOOTER (cites the contract -> carries the contract's footer) ---------
//
// Section 4 of human-contract.md defines one verbatim outward footer for skills
// outside the family. A skill that cites `human-output/SKILL.md` has opted into
// the contract, so it must carry the footer VERBATIM — a paraphrase is drift, and
// drift is what a growing family produces. Coverage at wiring time: 36 of 55.
// `--footer-file <path>` grades that one file instead of scanning skills/, so
// gate-fires can point this check at a fixture. Same single-file idiom as lint.mjs.
const FOOTER = "> **Human output.** This skill's handler-facing output obeys the human-output\n"
  + '> contract (`human-output/SKILL.md`).';
const CITATION = 'human-output/SKILL.md';

const footerFlag = process.argv.indexOf('--footer-file');
const footerTargets = footerFlag !== -1
  ? [process.argv[footerFlag + 1]]
  : dirs.map((n) => join(ROOT, 'skills', n, 'SKILL.md')).filter((p) => existsSync(p));

let cites = 0;
let carriers = 0;
for (const path of footerTargets) {
  if (!existsSync(path)) { fail(`FOOTER: ${path} missing`); continue; }
  // Normalise CRLF so a checkout with Windows line endings cannot fail a verbatim
  // footer that is byte-identical apart from the line terminator.
  const body = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  if (body.includes(FOOTER)) carriers++;
  if (!body.includes(CITATION)) continue;
  cites++;
  if (!body.includes(FOOTER)) {
    fail(`FOOTER: ${path.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/')} cites ${CITATION} but does not carry the verbatim human-output footer blockquote (a paraphrase does not count — see human-spec/human-contract.md section 4)`);
  }
}

// --- 5b. FOOTER COVERAGE (the declared carrier count) ------------------------
//
// The citation rule above cannot catch a DELETED footer: for 32 of the 36 carriers
// the footer is the ONLY place `human-output/SKILL.md` is named, so removing it also
// removes the citation that triggers the check — the gate would nullify itself. A
// declared count is immune. Section 4 of the contract states "N of the pack's M
// skills carry it"; both numbers are recomputed here. Skipped in --footer-file mode,
// where only one file was graded and a pack-wide count is not in evidence, and in
// --human-contract mode, where the contract under test is a fixture, not the real one.
if (footerFlag === -1 && contractFlag === -1 && existsSync(contractFile)) {
  const md = readFileSync(contractFile, 'utf8');
  const m = md.match(/(\d+) of the pack's (\d+) skills carry it/);
  if (!m) {
    // Fail closed: no declared coverage means the deletion hole is reopened.
    fail("FOOTER: human-contract.md section 4 no longer declares coverage in the form \"N of the pack's M skills carry it\" — guard cannot verify footer coverage");
  } else {
    const [, declaredCarriers, declaredTotal] = m.map(Number);
    if (declaredCarriers !== carriers || declaredTotal !== total) {
      fail(`FOOTER: human-contract.md declares ${declaredCarriers} of ${declaredTotal} skills carry the human-output footer; actual is ${carriers} of ${total} — a carrier was added or its footer was deleted`);
    }
  }
}

// --- report -----------------------------------------------------------------

if (errors.length) {
  console.error(`consistency-guard: ${errors.length} drift(s)`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`consistency-guard: OK — counts (total=${total}, dual=${dual}, md-only=${mdonly}) consistent; ${clVersions.length} CHANGELOG releases ↔ ${tags.length} tags in sync; skills-help menu roster ⊆ shipped skills; human-contract roster ↔ shipped human-* skills both ways; ${cites} of ${footerTargets.length} skills cite the human-output contract and all carry its verbatim footer`);
