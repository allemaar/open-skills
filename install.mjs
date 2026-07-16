#!/usr/bin/env node
// install.mjs — copy-default skill installer for open-skills.
//
// Read this before you run it. It does exactly three things, and nothing else:
//   1. COPIES a readable skill folder from this repo into your agent's skills dir.
//   2. STAMPS the copied SKILL.md with where it came from (repo, ref, tree sha) under
//      the spec's `metadata:` key. This is the ONLY edit to the copied bytes, and it
//      is why `git diff --no-index <installed> <clone>` shows a `metadata:` block —
//      that block is expected; anything else in the diff is a real change. The keys
//      are `gh skill`'s own, so `gh skill update --dry-run` can report staleness on
//      these copies without us shipping an updater. `--no-stamp` skips it.
//   3. VALIDATES that skill's declarative protocol.yon with the public YON parser.
// No build step, no opaque binary. Zero dependencies — Node built-ins only. If you
// don't trust it, read it. (The only network is validation: the first `npx` run
// fetches the pinned public parser; `--no-validate` skips it entirely. Stamping is
// local-only — it shells out to `git` in THIS clone and phones nowhere.)
//
// Usage:
//   node install.mjs <skill> [<skill> ...]      install named skills
//   node install.mjs --all                      install every skill in the catalog
//   node install.mjs --list                     list installable skills, then exit
//   node install.mjs --runtime claude <skill>   target one runtime dir (claude|codex|agents)
//   node install.mjs --no-validate <skill>      skip protocol.yon validation (escape hatch)
//   node install.mjs --no-stamp <skill>         copy byte-for-byte; write no provenance
//   node install.mjs --force <skill>            overwrite an already-installed skill
//
// Apache-2.0. "YON" and "YounndAI" are trademarks of MARLINK TRADING SRL; this repo
// demonstrates YON and is not a YounndAI product. See NOTICE.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync, execFileSync } from "node:child_process";

const PARSER = "@younndai/yon-parser@2"; // pinned to major 2; CI tracks latest 2.0.x
const NAME_RE = /^[a-z0-9][a-z0-9-]*$/; // a skill name is also a path segment — keep it one
const ROOT = path.dirname(fileURLToPath(import.meta.url));
// name -> skills dir. NOTE the asymmetry with llms.txt's agent recipe, which tells an
// agent to pick the ONE dir its runtime reads: targetRuntimes() below instead installs
// into every dir that exists, because a human running this usually wants exactly that.
// `--runtime` narrows it to one. Both behaviours are documented in the README.
const RUNTIMES = {
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

// Provenance, in the two shapes `gh skill` uses (internal/skills/frontmatter): GitHub
// keys when THIS clone can honestly back the claim, `local-path` when it cannot. gh's
// local injector clears the github keys; we keep the two shapes exclusive for the same
// reason. A stamp that cannot be backed is worse than no stamp — `github-tree-sha` must
// describe the exact bytes copied and be findable at `github-repo`, or its readers lie.
function provenance(name) {
  const src = path.join(ROOT, "skills", name);
  // execFile, never a shell. ROOT is wherever this clone happens to sit; /bin/sh expands
  // $(), backticks and quotes even inside double quotes, so a crafted clone path would
  // run commands here. (validate() below quotes for the same hazard; git is a real
  // executable, so this path can dodge the shell entirely instead.)
  const git = (...args) =>
    execFileSync("git", ["-C", ROOT, ...args], { stdio: ["ignore", "pipe", "ignore"] })
      .toString().trim();
  try {
    // Only GitHub can back a github-* claim. Any other origin (a GitLab mirror, a
    // private fork) gets the local shape: stamping it as `github-repo` would fabricate
    // a claim and leak that origin into a file the agent reads. Normalize both remote
    // forms to the https shape gh itself writes, so the two tools agree byte-for-byte.
    const remote = git("remote", "get-url", "origin").replace(/\.git$/, "");
    const gh = remote.match(/^(?:https:\/\/github\.com\/|git@github\.com:)(.+)$/);
    if (!gh) return { "local-path": src };
    const url = `https://github.com/${gh[1]}`;
    const ref = git("rev-parse", "--abbrev-ref", "HEAD");
    const tree = git("rev-parse", `HEAD:skills/${name}`); // the skill dir's own tree object
    // Refuse the GitHub claim whenever it would be a lie:
    //  - a detached HEAD, with no ref to record;
    //  - local edits, where the tree sha describes committed bytes and NOT the bytes we
    //    are about to copy. --ignored matters: this repo ignores skills/*/.claude/, and
    //    an ignored file is still COPIED, so a plain status would call it clean while the
    //    copy carries bytes the tree sha does not cover;
    //  - commits not yet pushed, where the tree is real here but absent at `github-repo` —
    //    a reader (or `gh skill update`) looks for it and finds nothing. If the remote
    //    ref is merely stale this fails closed to `local-path`, which is the safe way.
    const dirty = git("status", "--porcelain", "--ignored", "--", `skills/${name}`);
    const pushed = (() => {
      try { git("merge-base", "--is-ancestor", "HEAD", "@{upstream}"); return true; }
      catch { return false; }
    })();
    if (!tree || !ref || ref === "HEAD" || dirty || !pushed) return { "local-path": src };
    return {
      "github-repo": url, // a URL: gh's ParseMetadataRepo -> ghrepo.FromFullName reads this
      "github-ref": ref,
      "github-tree-sha": tree,
      "github-path": `skills/${name}`,
    };
  } catch {
    return { "local-path": src }; // no git, no origin, not a checkout — say so plainly
  }
}

// Inject provenance into the copy's YAML frontmatter under `metadata:`. Deliberately
// narrow: create-only. If a frontmatter already carries `metadata:` (no skill in this
// repo does; a fork might), leave it untouched rather than hand-merge YAML zero-dep.
function stampCopy(destSkillDir, name) {
  const f = path.join(destSkillDir, "SKILL.md");
  // Write-path link guard — the mirror of refuseLink()'s delete-path guard above. cpSync
  // reproduces a symlink as a symlink, and writeFileSync follows one; a tampered clone
  // shipping SKILL.md as a link would have us write through it, outside the copy.
  let st;
  try { st = fs.lstatSync(f); } catch { return; } // no SKILL.md — nothing to stamp
  if (!st.isFile()) {
    console.log(`  note: ${name}/SKILL.md is not a regular file — not stamped`);
    return;
  }
  const text = fs.readFileSync(f, "utf8");
  const lines = text.split("\n"); // keeps a trailing \r per line when the file is CRLF
  const fence = (l) => l.trimEnd() === "---"; // trimEnd tolerates CRLF
  if (!fence(lines[0])) return; // no frontmatter to extend
  // Scan line-wise for the closing fence. indexOf("\n---") would also match a `---`
  // sitting inside a block scalar and inject the stamp into the middle of a value.
  const close = lines.findIndex((l, i) => i > 0 && fence(l));
  if (close === -1) return; // unterminated frontmatter — don't guess
  if (lines.slice(1, close).some((l) => /^metadata:/.test(l))) {
    // Never clobber. Say so: a pre-baked block is an unverifiable claim we are choosing
    // to preserve over the one we could compute, and the user should know we did that.
    console.log(`  note: ${name} ships its own metadata: block — left as-is, not stamped`);
    return;
  }
  const keys = provenance(name);
  // Quote the value: a path containing " #" would otherwise start a YAML comment, and
  // one containing ": " would break the parse outright.
  const crlf = /\r\n/.test(text);
  const block = ["metadata:", ...Object.entries(keys).map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)]
    .map((l) => (crlf ? l + "\r" : l)); // match the file's existing line endings
  lines.splice(close, 0, ...block);
  try { fs.writeFileSync(f, lines.join("\n")); }
  catch (e) {
    // A read-only source mode is preserved by cpSync. Don't abort the run over it —
    // validate() collects failures for the same reason.
    console.log(`  note: could not stamp ${name} (${e.code || e.message}) — copy left unstamped`);
  }
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

function installOne(name, catalog, runtimes, { noValidate, noStamp, force }, failures) {
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
    if (!noStamp) stampCopy(dest, name);
    console.log(`  copied ${name} -> ${rtName}`);
    if (!noValidate) validate(dest, skill, rtName, failures);
  }
}

function main() {
  const argv = process.argv.slice(2);
  const opts = { noValidate: false, noStamp: false, force: false, all: false, list: false, runtime: null };
  const names = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--no-validate") opts.noValidate = true;
    else if (a === "--no-stamp") opts.noStamp = true;
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
