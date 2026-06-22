// Leak guard — keep machine-specific paths out of the public pack.
//
// A public skill must be portable: no author's absolute paths, no vault paths.
// This guard is deliberately GENERIC — it matches the *shape* of a leak
// (an absolute drive path, a vault-path fragment, a POSIX home path), never a
// specific private name. The richer, name-specific signature audit lives in the
// PRIVATE control-room (allemaar/skills → RELEASE.md), run before promotion.
//
// Legitimate generic placeholders are NOT leaks and do not match these patterns:
//   ~/.claude  ~/.codex  ~/.agents  %USERPROFILE%  $HOME  %CD%  <runtime>
// and the sanctioned attribution (allemaar.com, the author, MARLINK marks) is
// text, not a path — it never matches.
//
// Usage:  node tools/leak-guard.mjs
// Exit:   non-zero on any hit. Zero npm deps.

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const TEXT_EXT = new Set(['.md', '.yon', '.json', '.mjs', '.js', '.txt', '.yml', '.yaml', '.ps1', '.sh']);
const SKIP_DIR = new Set(['node_modules', '.git', 'assets']);

// Leak patterns — generic shapes only, never a specific private name.
// Each captures the SEGMENT that follows a real top-level dir; a leak is a path
// into a *named* user/project/vault. Requiring a known top-level dir
// (Users|Projects|Vaults|Windows|home) after the drive is what keeps regex
// artifacts ("T:\-" in a char class) and illustrative stubs ("c:/...md") out.
const PATTERNS = [
  // absolute Windows path into a real top-level dir: C:\Users\<seg>, D:/Projects/<seg>
  { re: /[A-Za-z]:[\\/](?:Users|Projects|Vaults|Windows|home)[\\/]([A-Za-z0-9._-]+)/gi, name: 'absolute Windows path' },
  // vault-path fragment into a named child: /Vaults/<seg>
  { re: /[\\/]Vaults?[\\/]([A-Za-z0-9._-]+)/gi, name: 'vault path fragment' },
  // POSIX home path with a username: /Users/<seg>, /home/<seg>
  { re: /(?<![\w.])\/(?:Users|home)\/([A-Za-z0-9._-]+)/g, name: 'POSIX home path' },
];

// A captured segment that is a generic PLACEHOLDER, not a real name → not a leak.
// (Bracketed placeholders like <user> never match: the segment class excludes < > %.)
const PLACEHOLDER = /^(?:you|your|yourname|user|users|username|name|me|path|runtime|temp|tmp|appdata|local|example|skill|skills|repo|project|projects)$/i;

const hits = [];

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIR.has(e.name)) walk(join(dir, e.name));
      continue;
    }
    if (!TEXT_EXT.has(extname(e.name))) continue;
    scan(join(dir, e.name));
  }
}

function scan(path) {
  const rel = path.slice(ROOT.length + 1).replace(/\\/g, '/');
  // never scan this guard or its private-doc sibling for its own pattern strings
  if (rel === 'tools/leak-guard.mjs') return;
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { re, name } of PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line))) {
        const seg = m[1] || '';
        if (PLACEHOLDER.test(seg)) continue; // a generic example, not a real name
        hits.push({ rel, line: i + 1, name, match: m[0] });
      }
    }
  });
}

walk(ROOT);

if (hits.length) {
  console.error(`leak-guard: ${hits.length} machine-specific path(s) — these must not ship public:`);
  for (const h of hits) console.error(`  ✗ ${h.rel}:${h.line}  [${h.name}]  "${h.match}"`);
  process.exit(1);
}
console.log('leak-guard: OK — no absolute/machine-specific paths in the public pack');
