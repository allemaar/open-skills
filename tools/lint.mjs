#!/usr/bin/env node
// Skill-library structural lint.
//
// Checks the pack's INTEGRITY — the things conformance.mjs (YON validity) and
// yon-dag.mjs (protocol graph) don't: that every reference resolves, every skill
// is well-formed, and dual-doc pairs are in sync. Built after a cold-review found
// ~16 references to files/skills that don't exist in the public repo.
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
import { join, dirname, resolve, relative } from 'node:path';

const ROOT = process.cwd();
const SKILLS = 'skills';

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
      if (/[\s*?<>\\$%{}"']/.test(tok)) continue;             // skip placeholders/globs/shell
      let base = null;
      if (/^(tools|skills)\//.test(tok)) base = ROOT;          // repo-root-relative
      else if (/^(\.\.?|references)\//.test(tok)) base = dir;  // file-relative
      if (base === null) continue;
      if (!existsSync(resolve(base, tok.replace(/#.*$/, '')))) {
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
const CONTRACT_REQUIRED = ['name', 'description', 'visibility', 'triggers', 'next-skills']; // fail-closed (present; empty list ok)
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

const names = readdirSync(SKILLS).filter((n) => statSync(join(SKILLS, n)).isDirectory()).sort();
for (const n of names) lintSkill(n);

// Also lint the root public docs for broken links/refs.
for (const doc of ['README.md', 'THREAT-MODEL.md', 'SECURITY.md', 'CONTRIBUTING.md', 'CONFORMANCE.md']) {
  if (existsSync(doc)) lintMarkdown(doc);
}

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
