#!/usr/bin/env node
// install.mjs — copy-default skill installer for open-skills.
//
// Read this before you run it. It does exactly two things, and nothing else:
//   1. COPIES a readable skill folder from this repo into your agent's skills dir.
//   2. VALIDATES that skill's declarative protocol.yon with the public YON parser.
// No build step, no opaque binary. Zero dependencies — Node built-ins only. The
// whole install is "copy a folder you can read, check its contract." If you don't
// trust it, read it; it fits on a screen. (The only network is validation: the first
// `npx` run fetches the pinned public parser; `--no-validate` skips it entirely.)
//
// Usage:
//   node install.mjs <skill> [<skill> ...]      install named skills
//   node install.mjs --all                      install every skill in the catalog
//   node install.mjs --list                     list installable skills, then exit
//   node install.mjs --runtime claude <skill>   target one runtime dir (claude|codex|agents)
//   node install.mjs --no-validate <skill>      skip protocol.yon validation (escape hatch)
//   node install.mjs --force <skill>            overwrite an already-installed skill
//
// Apache-2.0. "YON" and "YounndAI" are trademarks of MARLINK TRADING SRL; this repo
// demonstrates YON and is not a YounndAI product. See NOTICE.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const PARSER = "@younndai/yon-parser@2"; // pinned to major 2; CI tracks latest 2.0.x
const NAME_RE = /^[a-z0-9][a-z0-9-]*$/; // a skill name is also a path segment — keep it one
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const RUNTIMES = { // name -> skills dir; "detect by existence" per llms.txt
  claude: path.join(os.homedir(), ".claude", "skills"),
  codex: path.join(os.homedir(), ".codex", "skills"),
  agents: path.join(os.homedir(), ".agents", "skills"),
};

function die(msg) { console.error("install: " + msg); process.exit(1); }

function loadCatalog() {
  const p = path.join(ROOT, "catalog.json");
  if (!fs.existsSync(p)) die("catalog.json not found — run this from a clone of the repo root.");
  let skills;
  try {
    const c = JSON.parse(fs.readFileSync(p, "utf8"));
    skills = c.skills || c.entries || (Array.isArray(c) ? c : []);
  } catch (e) { die(`catalog.json is unreadable: ${e.message}`); }
  // The catalog is untrusted supply-chain input (a fork or tampered clone can craft it).
  // A name becomes a filesystem path segment below, so reject anything that could
  // traverse (../, absolute, separators) before it can reach path.join / rmSync.
  const m = new Map();
  for (const s of skills) {
    if (!s || typeof s.name !== "string" || !NAME_RE.test(s.name)) {
      die(`refusing a catalog entry with an unsafe skill name: ${JSON.stringify(s && s.name)}`);
    }
    m.set(s.name, s);
  }
  return m;
}

function targetRuntimes(forced) {
  if (forced) {
    if (!RUNTIMES[forced]) die(`unknown runtime "${forced}" — use claude|codex|agents.`);
    return [[forced, RUNTIMES[forced]]];
  }
  const present = Object.entries(RUNTIMES).filter(([, dir]) => fs.existsSync(dir));
  if (present.length === 0) {
    die("no runtime skills dir found (~/.claude/skills, ~/.codex/skills, ~/.agents/skills).\n" +
        "        Create one, or pass --runtime claude to install there.");
  }
  return present;
}

function validate(destSkillDir, skill, rtName, failures) {
  const protocol = path.join(destSkillDir, "protocol.yon");
  if (!skill.hasProtocol && !fs.existsSync(protocol)) return;
  // A shell is required because Node refuses to spawn npx.cmd without one on Windows.
  // Nothing user-controlled reaches the shell unquoted: PARSER is a constant, profile
  // is [a-z]-only, the skill name in the path is NAME_RE-constrained, and the only
  // other path component is the home dir (which can't contain cmd/shell metachars on
  // either OS). The path is quoted per-platform as a second layer.
  const profile = /^[a-z]+$/.test(skill.profile || "") ? skill.profile : "exec";
  const q = process.platform === "win32"
    ? (s) => `"${s.replace(/"/g, '""')}"`          // cmd: double an embedded quote
    : (s) => `'${s.replace(/'/g, `'\\''`)}'`;        // posix: single-quote, no expansion
  try {
    execSync(`npx -y ${PARSER} validate ${q(protocol)} --profile ${profile}`, { stdio: "inherit" });
  } catch {
    // Don't abort the run — record it, copy stays, summary at the end (matters for --all).
    console.error(`  ! validation failed: ${skill.name} -> ${rtName}`);
    failures.push(`${skill.name} -> ${rtName}`);
  }
}

function installOne(name, catalog, runtimes, { noValidate, force }, failures) {
  const skill = catalog.get(name);
  if (!skill) die(`"${name}" is not in the catalog. Run --list to see installable skills.`);
  const src = path.join(ROOT, "skills", name); // name is NAME_RE-validated at catalog load
  if (!fs.existsSync(src)) die(`skill folder skills/${name} is missing from this clone.`);
  for (const [rtName, dir] of runtimes) {
    const dest = path.join(dir, name);
    // lstat (not exists) so we see a dangling junction too — existsSync follows the
    // link and reports false for a broken one. null = nothing there.
    let st = null;
    try { st = fs.lstatSync(dest); } catch {}
    if (st) {
      const refuseLink = () => die(`${dest} is a symlink/junction, not a copy. Remove the link ` +
        `yourself (rmdir / unlink the link only), then re-run — refusing to delete through it.\n` +
        `        Installed it with \`npx skills\`? Use \`npx skills remove --global ${name}\` — do not \`rm -rf\` a junction.`);
      // Junction/symlink safety (the L0 destructive-delete hazard): a recursive delete
      // that traverses a link would descend into the repo source. Refuse any link.
      // lstat catches the leaf link (live or dangling) on current Node; the realpath
      // check below is the version-robust backstop (older Node mis-reports junctions)
      // and also catches a link in a PARENT path component.
      if (st.isSymbolicLink()) refuseLink();
      if (!force) { console.log(`  skip ${name} -> ${rtName} (exists; --force to overwrite)`); continue; }
      let real;
      try { real = path.resolve(fs.realpathSync(dest)); }
      catch { refuseLink(); } // dangling/blocked link → can't prove it's safe → refuse
      if (real !== path.resolve(dest)) refuseLink(); // parent-component link, or junction lstat missed
      // Defense-in-depth: even with the checks above, never delete outside the runtime
      // skills dir. Unreachable while NAME_RE holds; backstops a future weakening of it.
      if (!(real + path.sep).startsWith(path.resolve(dir) + path.sep)) {
        die(`${dest} resolves outside the ${rtName} skills dir — refusing to delete.`);
      }
      fs.rmSync(real, { recursive: true, force: true });
    }
    fs.mkdirSync(dir, { recursive: true });
    fs.cpSync(src, dest, { recursive: true }); // copy-default, never a symlink
    console.log(`  copied ${name} -> ${rtName}`);
    if (!noValidate) validate(dest, skill, rtName, failures);
  }
}

function main() {
  const argv = process.argv.slice(2);
  const opts = { noValidate: false, force: false, all: false, list: false, runtime: null };
  const names = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--no-validate") opts.noValidate = true;
    else if (a === "--force") opts.force = true;
    else if (a === "--all") opts.all = true;
    else if (a === "--list") opts.list = true;
    else if (a === "--runtime") {
      const v = argv[++i];
      if (!v || v.startsWith("-")) die("--runtime needs a value (claude|codex|agents).");
      opts.runtime = v;
    }
    else if (a.startsWith("-")) die(`unknown flag ${a}`);
    else names.push(a);
  }

  const catalog = loadCatalog();
  if (opts.list) { console.log([...catalog.keys()].sort().join("\n")); return; }

  const want = opts.all ? [...catalog.keys()].sort() : names;
  if (want.length === 0) die("name a skill, or pass --all. Run --list to see them.");

  const runtimes = targetRuntimes(opts.runtime);
  console.log(`Installing ${want.length} skill(s) into: ${runtimes.map(([n]) => n).join(", ")}`);
  const failures = [];
  for (const name of want) installOne(name, catalog, runtimes, opts, failures);
  console.log("Done. Copied folders are frozen snapshots — after a git pull, re-run with --force to update.");
  if (failures.length) {
    die(`${failures.length} skill(s) copied but FAILED validation: ${failures.join(", ")}. ` +
        `Inspect their protocol.yon, or re-run with --no-validate to skip validation.`);
  }
}

main();
