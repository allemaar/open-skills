#!/usr/bin/env node
// Skill-library structural lint.
//
// Checks the pack's INTEGRITY — the things conformance.mjs (YON validity) and
// yon-dag.mjs (protocol graph) don't: that every reference resolves, every skill
// is well-formed, and dual-doc pairs are in sync. Built after a cold-review found
// ~16 references to files/skills that don't exist in the public repo.
//
// SCANS: each skill's SKILL.md, the 5 root public docs, and (since 2026-07-17) the
// companion markdown under skills/*/ (references/, personas/, profiles/, examples/).
// The companion files were previously unscanned — a broken ref in a rename that was
// never swept, or a private-repo path kept on export, was invisible to this guard
// even though catching exactly that is why it exists.
//
// KNOWN LIMITS (deliberate, so they are boundaries rather than silent gaps):
//   - GAP 3: check 2 skips any backtick token containing whitespace, so a broken
//     path inside a backticked shell command (`python tools/x.py --flag`) is not
//     checked. Extracting a path from an arbitrary command false-positives on npx
//     scopes / `cd a && b` / flags, so it is left out of scope.
//   - Bare names: a backtick token with no slash (`MAYBE.md`) is not a path ref and
//     is skipped — the pack has many bare artifact mentions (`SKILL.md`, `PLAN.md`).
//   - Anchored skill-rel: `skill/SKILL.md#section` falls outside SKILL_REL's anchor
//     and is skipped rather than validated (the un-anchored form is checked).
//
// Usage:  node tools/lint.mjs          lint the whole library (CI gate)
//
// Checks:
//   1. link-broken        [ERROR] a Markdown link [..](relpath) that doesn't resolve
//   2. ref-broken         [ERROR] a backtick path `tools/x` / `../x` / `VISIBILITY.md` that doesn't exist
//   3. next-skills-orphan [ERROR] a next-skills `skill:` with no skills/<name> folder
//   4. name-mismatch      [ERROR] front-matter name: != folder name
//   5. no-skill-md        [ERROR] a skill folder with no SKILL.md
//   6. dual-doc-desync    [WARN]  protocol.yon present but @DOC id != folder, or SKILL.md has no protocol.yon pointer
//   7. contract-required  [ERROR] front-matter missing a required field
//                                 (name, description, visibility, triggers, next-skills)
//   8. contract-expected  [WARN]  front-matter missing a present-or-empty field (currently none)
//   9. taxonomy-integrity [ERROR] pack YON taxonomy has missing, duplicate, unknown, or orphan assignments
//
// The front-matter contract (check 7) is the auditable root node every generated
// discovery surface (catalog.yon/json, llms.txt, skills.graph.yon) derives from.
// All five fields must be PRESENT (triggers / next-skills may be an empty list for a
// skill with no invocation phrase or no natural successor). triggers + next-skills
// were promoted from WARN to fail-closed once the pack reached 45/45 coverage
// (2026-06-15); check 8 stays for any future soft-launch field.
//
// Exit code: non-zero if any ERROR. Zero if clean or warnings-only. Zero npm deps.

import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve, relative } from 'node:path';

const ROOT = process.cwd();
const SKILLS = 'skills';
const TAXONOMY = join(SKILLS, 'skills-help', 'taxonomy.yon');

// Resolve a backtick path token to an absolute path, or null when it is "not our
// business" (an npm scope, a URL, an absolute path, an unknown shape). Deliberately
// TARGETED, not "any slash = a repo path": that flooded on npm scopes (@younndai/…),
// GitHub slugs (owner/repo), URLs, and illustrative cross-repo paths. Two known repo
// shapes are checked, and everything else is left alone.
//
//   ROOT_DIRS — a real top-level dir of THIS repo. docs/ is included ON PURPOSE:
//     it does not exist, and its absence IS the defect (a private-repo leftover), so
//     a "first segment must exist" rule would defeat the point.
//   SKILL_REL — the pack's own convention: `self-improve/SKILL.md` means
//     skills/self-improve/SKILL.md (used throughout the NSP / SIP footers).
const ROOT_DIRS = /^(tools|skills|docs|orient-spec|human-spec|\.github)\//;
const SKILL_REL = /^[a-z0-9][a-z0-9-]*\/(SKILL\.md|protocol\.yon|(references|examples|personas|profiles)\/[^/]+)$/;
function resolveRef(tok, dir) {
  if (/^[~/]/.test(tok) || /^[a-zA-Z]:[\\/]/.test(tok)) return null; // home / POSIX / Windows absolute
  if (/^@/.test(tok)) return null;                                    // npm scope, e.g. @younndai/yon-parser
  if (/^(\.\.?)\//.test(tok)) return resolve(dir, tok);              // ./ or ../ — file-relative
  if (/^references\//.test(tok)) return resolve(dir, tok);           // file-relative convention
  if (ROOT_DIRS.test(tok)) return resolve(ROOT, tok);               // repo-root-relative
  if (SKILL_REL.test(tok)) return resolve(ROOT, SKILLS, tok);       // skills/<name>/… shorthand
  return null;                                                        // unknown shape: not our business
}

const findings = []; // { sev, file, line, msg }
function err(file, line, msg) { findings.push({ sev: 'ERROR', file, line, msg }); }
function warn(file, line, msg) { findings.push({ sev: 'WARN', file, line, msg }); }

// --- helpers ----------------------------------------------------------------

// Resolve a reference token against a base dir; return true if it exists.
// Strips a trailing #anchor and a trailing slash.
function resolves(fromDir, target) {
  const clean = target.replace(/#.*$/, '').replace(/\/$/, '');
  if (!clean) return true; // pure anchor
  return existsSync(resolve(fromDir, clean));
}

function isExternal(target) {
  return /^(https?:|mailto:|tel:|#)/i.test(target);
}

// --- per-file checks --------------------------------------------------------

function lintMarkdown(file) {
  const dir = dirname(file);
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);

  lines.forEach((line, i) => {
    const ln = i + 1;

    // Check 1: Markdown links [text](target) with a relative target.
    const linkRe = /\[[^\]]*\]\(([^)]+)\)/g;
    let m;
    while ((m = linkRe.exec(line)) !== null) {
      const target = m[1].trim();
      if (isExternal(target)) continue;
      if (!target.includes('/') && !target.includes('.')) continue; // placeholder like (url)
      if (/[<>\\$%{}]/.test(target)) continue;                      // placeholder/template
      if (!resolves(dir, target)) {
        err(file, ln, `broken link → ${target}`);
      }
    }

    // Check 2: backtick-wrapped PATH references (must contain a slash — bare
    // names like `SKILL.md` / `PLAN.md` are generic artifact mentions, not refs).
    const tickRe = /`([^`]+)`/g;
    while ((m = tickRe.exec(line)) !== null) {
      const tok = m[1].trim();
      if (!tok.includes('/')) continue;                       // path-like only
      if (/[\s*?<>\\$%{}"']/.test(tok)) continue;             // skip placeholders/globs/shell (see GAP-3 note in header)
      // Skip a token that is the DISPLAY TEXT of a markdown link — `[`a/b`](real/target)`.
      // Check 1 already validates the real target; the label resolves against the
      // wrong base and would false-positive.
      if (line.slice(m.index + m[0].length).startsWith('](')) continue;
      const target = resolveRef(tok, dir);
      if (target === null) continue;
      if (!existsSync(target.replace(/#.*$/, ''))) {
        err(file, ln, `broken reference → ${tok}`);
      }
    }
  });
}

// front-matter (between the first two --- lines)
function frontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}
function fmField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}
// Key present anywhere in front-matter (value may be a folded block or a list on
// following lines, so don't require a same-line value).
function hasKey(fm, key) {
  return new RegExp(`^${key.replace(/[-]/g, '\\$&')}:`, 'm').test(fm);
}

// The front-matter contract — the root node of the discovery DAG.
const CONTRACT_REQUIRED = ['name', 'description', 'visibility', 'triggers', 'next-skills']; // fail-closed (present; list fields may be empty)
const CONTRACT_REQUIRED_SCALARS = ['name', 'description', 'visibility'];
const VISIBILITY_VALUES = new Set(['public']);
const CONTRACT_EXPECTED = []; // present-or-empty (WARN) — none today; all promoted to required at 45/45

function lintSkill(name) {
  const dir = join(SKILLS, name);
  const skillMd = join(dir, 'SKILL.md');
  if (!existsSync(skillMd)) { err(dir, 0, 'no SKILL.md'); return; }

  const text = readFileSync(skillMd, 'utf8');
  const fm = frontMatter(text);

  // Check 4: name matches folder
  const fmName = fmField(fm, 'name');
  if (fmName && fmName !== name) err(skillMd, 0, `front-matter name '${fmName}' != folder '${name}'`);

  // Check 7: front-matter contract — required fields (fail-closed)
  for (const k of CONTRACT_REQUIRED) {
    if (!hasKey(fm, k)) err(skillMd, 0, `front-matter contract: missing required '${k}'`);
  }
  for (const k of CONTRACT_REQUIRED_SCALARS) {
    if (!fmField(fm, k)) err(skillMd, 0, `front-matter contract: required '${k}' must be non-empty`);
  }
  const visibility = fmField(fm, 'visibility');
  if (visibility && !VISIBILITY_VALUES.has(visibility)) {
    err(skillMd, 0, `front-matter visibility '${visibility}' is not allowed (expected: public)`);
  }
  // Check 8: front-matter contract — present-or-empty fields (WARN until 45/45)
  for (const k of CONTRACT_EXPECTED) {
    if (!hasKey(fm, k)) warn(skillMd, 0, `front-matter contract: '${k}' absent (present-or-empty expected)`);
  }

  // Check 3: next-skills skill: targets resolve
  const nsBlock = fm.match(/next-skills:\s*\n([\s\S]*?)(?:\n\w|$)/);
  if (nsBlock) {
    for (const sm of nsBlock[1].matchAll(/-\s*skill:\s*(\S+)/g)) {
      const target = sm[1].trim();
      if (!existsSync(join(SKILLS, target))) err(skillMd, 0, `next-skills orphan → ${target}`);
    }
  }

  // Check 6: dual-doc sync
  const proto = join(dir, 'protocol.yon');
  if (existsSync(proto)) {
    const py = readFileSync(proto, 'utf8');
    const idm = py.match(/@DOC[^\n]*\bid=([^\s|]+)/);
    if (idm && idm[1] !== name) warn(proto, 1, `@DOC id '${idm[1]}' != folder '${name}'`);
    if (!/protocol\.yon/.test(text)) warn(skillMd, 0, 'dual-doc skill SKILL.md has no protocol.yon pointer');
  }

  // Check 1+2 on the SKILL.md body
  lintMarkdown(skillMd);
}

// --- driver -----------------------------------------------------------------

// Single-file mode: `node tools/lint.mjs <file.md>` runs checks 1+2 on one file.
// Used by tools/gate-fires.mjs to prove — un-stageably, in CI — that the ref check
// actually FIRES on a broken reference and stays quiet on a clean one. Without a
// firing proof, a green run is indistinguishable from a check that silently stopped
// looking (which is exactly how the companion-file gap hid for so long).
const fileArg = process.argv[2];
if (fileArg) {
  if (!existsSync(fileArg)) {
    console.error(`lint: ${fileArg} not found`);
    process.exit(2);
  }
  lintMarkdown(fileArg);
  for (const f of findings) {
    const loc = f.line ? `${f.file}:${f.line}` : f.file;
    console.log(`[${f.sev === 'ERROR' ? 'ERROR' : 'WARN '}] ${loc}  ${f.msg}`);
  }
  const n = findings.filter((f) => f.sev === 'ERROR').length;
  console.log(`lint: ${n} error(s) in ${fileArg}`);
  process.exit(n > 0 ? 1 : 0);
}

const names = readdirSync(SKILLS).filter((n) => statSync(join(SKILLS, n)).isDirectory()).sort();

// Check 9: the pack-level YON taxonomy is the sole family-assignment source.
function lintTaxonomy() {
  if (!existsSync(TAXONOMY)) { err(TAXONOMY, 0, 'family taxonomy is missing'); return; }
  const lines = readFileSync(TAXONOMY, 'utf8').split(/\r?\n/);
  const families = new Set();
  const orders = new Set();
  const assigned = new Map();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('@CFG id=family:')) {
      const m = line.match(/^@CFG id=family:([a-z0-9-]+) \| set=\[label="([^"]+)",order:int=(\d+),aliases="([^"]*)"\]$/);
      if (!m) { err(TAXONOMY, i + 1, 'invalid family record shape'); continue; }
      const [, id, , order] = m;
      if (families.has(id)) err(TAXONOMY, i + 1, `duplicate family id: ${id}`);
      if (orders.has(order)) err(TAXONOMY, i + 1, `duplicate family order: ${order}`);
      families.add(id);
      orders.add(order);
    } else if (line.startsWith('@MAP name=SkillFamilies')) {
      for (const m of line.matchAll(/"([a-z0-9-]+)"->"([a-z0-9-]+)"/g)) {
        const [, skill, family] = m;
        if (assigned.has(skill)) err(TAXONOMY, i + 1, `duplicate skill assignment: ${skill}`);
        assigned.set(skill, family);
      }
    }
  }
  if (families.size === 0) err(TAXONOMY, 0, 'taxonomy defines no families');
  if (assigned.size === 0) err(TAXONOMY, 0, 'taxonomy defines no assignments');
  const shipped = new Set(names);
  for (const name of names) if (!assigned.has(name)) err(TAXONOMY, 0, `missing shipped skill assignment: ${name}`);
  for (const [name, family] of assigned) {
    if (!shipped.has(name)) err(TAXONOMY, 0, `orphan assignment names unshipped skill: ${name}`);
    if (!families.has(family)) err(TAXONOMY, 0, `skill ${name} uses unknown family: ${family}`);
  }
}

lintTaxonomy();
for (const n of names) lintSkill(n);

// Also lint the root public docs for broken links/refs.
for (const doc of ['README.md', 'SKILLS.md', 'THREAT-MODEL.md', 'SECURITY.md', 'CONTRIBUTING.md', 'CONFORMANCE.md', 'TRADEMARK.md']) {
  if (existsSync(doc)) lintMarkdown(doc);
}

// And the COMPANION markdown under skills/*/ — references/, personas/, profiles/,
// examples/. lintSkill only reads each skill's own SKILL.md, so a broken ref in a
// companion file (e.g. a rename never swept, or a private-repo path kept on export)
// was invisible. Tracked files only, via git — never a node_modules walk.
// NOT scanned: CHANGELOG.md. A changelog records history, including paths that no
// longer exist by design; linting it fights its purpose.
let companions = [];
try {
  companions = execFileSync('git', ['ls-files', 'skills/**/*.md'], { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/)
    .filter((f) => f && !f.endsWith('/SKILL.md'));
} catch {
  warn('tools/lint.mjs', 0, 'could not enumerate companion files via git ls-files — companion coverage skipped');
}
for (const f of companions) lintMarkdown(f);

// --- report -----------------------------------------------------------------

const errs = findings.filter((f) => f.sev === 'ERROR');
const warns = findings.filter((f) => f.sev === 'WARN');

for (const f of findings.sort((a, b) => (a.file + a.line).localeCompare(b.file + b.line))) {
  const tag = f.sev === 'ERROR' ? 'ERROR' : 'WARN ';
  const loc = f.line ? `${f.file}:${f.line}` : f.file;
  console.log(`[${tag}] ${loc}  ${f.msg}`);
}
console.log('='.repeat(60));
console.log(`lint: ${errs.length} errors, ${warns.length} warnings across ${names.length} skills`);
process.exit(errs.length > 0 ? 1 : 0);
