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
// No build step or local npm install. This file itself uses Node built-ins only.
// Validation is a separate execution boundary: the first `npx` run may download
// and execute the public parser package (pinned to major 2, not a fixed version or
// hash); `--no-validate` skips it entirely.
// Stamping is local-only — it shells out to `git` in THIS clone and phones nowhere.
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
// Apache-2.0. YounndAI, YounndAI Object Notation, and Link Your Think are trademarks
// of MARLINK TRADING SRL. open-skills is a personal project. See NOTICE and TRADEMARK.md.

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

// A junction/symlink anywhere in the parent chain redirects a write out of the
// runtime skills dir, and a recursive delete that traverses one descends wherever
// it points. lstat every component we are about to write under — including the
// runtime dir itself — and refuse rather than follow. Windows junctions report as
// symlinks on current Node; the realpath comparison is the version-robust backstop.
function assertChainIsReal(dir, label) {
  const abs = path.resolve(dir);
  const parts = abs.split(path.sep);
  for (let i = parts.length; i >= 1; i--) {
    const seg = parts.slice(0, i).join(path.sep) || path.sep;
    let st = null;
    try { st = fs.lstatSync(seg); } catch { continue; } // not created yet — nothing to follow
    if (st.isSymbolicLink()) {
      die(`${seg} is a symlink/junction on the path to your ${label} skills dir.\n` +
        `        Refusing to write through it — a copy would land outside that dir, and a later\n` +
        `        --force delete would follow it. Remove the link yourself (rmdir / unlink the\n` +
        `        link only), or install into a real directory.`);
    }
  }
  let real;
  try { real = fs.realpathSync(abs); } catch { return; } // does not exist yet — fine
  if (path.resolve(real) !== abs) {
    die(`${abs} resolves to ${real} — a link is in the path to your ${label} skills dir.\n` +
      `        Refusing to write through it.`);
  }
}

// A recursive delete must never cross a reparse point NESTED inside the tree it is
// removing: that is how a wipe reaches source outside the delete root. Walk the tree
// and refuse if any descendant is a link, before rmSync is allowed to run.
function assertNoNestedLinks(root) {
  const abs = path.resolve(root);
  let rootState;
  try { rootState = fs.lstatSync(abs); } catch (e) {
    die(`could not inspect ${abs} before recursive removal (${e.code || e.message}) — refusing to continue.`);
  }
  if (rootState.isSymbolicLink() || !rootState.isDirectory()) {
    die(`${abs} is not a real directory — refusing recursive removal.`);
  }
  let rootReal;
  try { rootReal = fs.realpathSync(abs); } catch (e) {
    die(`could not resolve ${abs} before recursive removal (${e.code || e.message}) — refusing to continue.`);
  }
  if (path.resolve(rootReal) !== abs) {
    die(`${abs} resolves to ${rootReal} — refusing recursive removal through a redirected root.`);
  }

  const stack = [abs];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) {
      die(`could not enumerate ${dir} before recursive removal (${e.code || e.message}) — refusing to continue.`);
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      let st;
      try { st = fs.lstatSync(full); } catch (err) {
        die(`could not inspect ${full} before recursive removal (${err.code || err.message}) — refusing to continue.`);
      }
      if (st.isSymbolicLink()) {
        die(`${full} is a symlink/junction nested inside a recursively managed skill folder.\n` +
          `        Refusing to delete recursively through it — it can point outside this dir.\n` +
          `        Remove the link yourself (rmdir / unlink the link only), then re-run.`);
      }
      if (st.isDirectory()) stack.push(full);
    }
  }
}

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
    if (s.companions !== undefined && !Array.isArray(s.companions)) {
      die(`refusing catalog companions for ${s.name}: expected a list.`);
    }
    const skillRoot = path.resolve(ROOT, "skills", s.name);
    for (const c of s.companions || []) {
      if (!c || typeof c.path !== "string" || typeof c.optional !== "boolean" ||
          typeof c.why !== "string" || !c.why.trim() || path.isAbsolute(c.path)) {
        die(`refusing malformed companion metadata for ${s.name}: ${JSON.stringify(c)}`);
      }
      const target = path.resolve(skillRoot, c.path);
      const repoRoot = path.resolve(ROOT);
      if (target !== repoRoot && !target.startsWith(repoRoot + path.sep)) {
        die(`refusing companion path that escapes this repository: ${s.name}/${c.path}`);
      }
      if (!c.optional && target !== skillRoot && !target.startsWith(skillRoot + path.sep)) {
        die(`required companion must travel inside skills/${s.name}: ${c.path}`);
      }
      if (!fs.existsSync(target)) {
        die(`catalog companion is missing for ${s.name}: ${c.path}`);
      }
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
      // Defense-in-depth: even with the checks above, never move/delete outside the
      // runtime skills dir. Unreachable while NAME_RE holds; backstops a future weakening.
      if (!(real + path.sep).startsWith(path.resolve(dir) + path.sep)) {
        die(`${dest} resolves outside the ${rtName} skills dir — refusing to replace.`);
      }
      // Prove the known-good tree contains no redirect before it can be moved aside
      // and later removed. The candidate is prepared first; this copy stays live.
      assertNoNestedLinks(real);
    }
    // Guard the write path itself, not only the pre-existing-destination case: when
    // nothing is there yet, everything above still has to be a real directory.
    assertChainIsReal(dir, rtName);
    fs.mkdirSync(dir, { recursive: true });

    // Crash leftovers from an interrupted install are ours by naming convention,
    // but not proven safe. Surface them; never silently reuse or delete them.
    const leftovers = fs.readdirSync(dir).filter((e) =>
      e.startsWith(`.${name}.staging-`) || e.startsWith(`.${name}.old-`));
    if (leftovers.length) {
      die(`${rtName}: leftover staging/backup dirs from an interrupted install:\n` +
        `        ${leftovers.join(", ")}\n` +
        `        Inspect and remove them inside ${dir}, then re-run.`);
    }

    // Stage -> validate -> swap. Staging lives beside the destination, so all
    // renames stay on one volume. Collision resistance is not treated as proof:
    // each leaf must still be absent before use.
    const tag = `${process.pid}-${Date.now().toString(36)}`;
    const staging = path.join(dir, `.${name}.staging-${tag}`);
    const oldDir = path.join(dir, `.${name}.old-${tag}`);
    for (const ownedLeaf of [staging, oldDir]) {
      let leafState = null;
      try {
        leafState = fs.lstatSync(ownedLeaf);
      } catch (e) {
        if (e?.code !== "ENOENT") {
          die(`could not prove ${ownedLeaf} is absent (${e.code || e.message}) — refusing to write.`);
        }
      }
      if (leafState) die(`${ownedLeaf} already exists — refusing to write through or replace it.`);
    }

    fs.cpSync(src, staging, { recursive: true }); // copy-default, never a link to dest
    assertNoNestedLinks(staging);
    for (const c of skill.companions || []) {
      if (!c.optional && !fs.existsSync(path.resolve(staging, c.path))) {
        die(`${name}: required bundled companion was not copied: ${c.path}`);
      }
    }
    if (!noStamp) stampCopy(staging, name);
    if (!noValidate) {
      const preFailures = failures.length;
      validate(staging, skill, rtName, failures);
      if (failures.length > preFailures) {
        assertNoNestedLinks(staging);
        fs.rmSync(staging, { recursive: true, force: true });
        console.error(`  ${name} -> ${rtName}: validation failed in staging; existing install untouched.`);
        continue;
      }
    }

    let movedOld = false;
    if (st) {
      try {
        fs.renameSync(dest, oldDir);
        movedOld = true;
      } catch (e) {
        die(`${name} -> ${rtName}: could not move the existing install aside (${e.code || e.message}). ` +
          `The existing install remains active; the staged candidate remains at ${staging} for inspection.`);
      }
    }
    try {
      fs.renameSync(staging, dest);
    } catch (e) {
      let restored = false;
      if (movedOld) {
        try { fs.renameSync(oldDir, dest); restored = true; } catch {}
      }
      try {
        assertNoNestedLinks(staging);
        fs.rmSync(staging, { recursive: true, force: true });
      } catch {}
      die(`${name} -> ${rtName}: swap failed (${e.code || e.message}). ` +
        (movedOld ? (restored ? "Existing install restored." :
          `RESTORE ALSO FAILED — the previous copy is intact at ${oldDir}.`) :
          "Nothing was installed."));
    }
    if (movedOld) {
      try {
        assertNoNestedLinks(oldDir);
        fs.rmSync(oldDir, { recursive: true, force: true });
      } catch {
        console.error(`  warning: could not remove backup ${oldDir} — the new copy is in place; remove the backup manually.`);
      }
    }
    console.log(`  copied ${name} -> ${rtName}`);
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
  // Report the failure BEFORE the close message: a run that copied skills nobody could
  // validate is not "Done", and printing that word above the failure reads as reassurance.
  // The exit code stays nonzero — it is the only machine-readable signal this tool emits.
  if (failures.length) {
    die(`${failures.length} staged skill candidate(s) FAILED validation: ${failures.join(", ")}.\n` +
        `        Failed candidates were not installed; any previous copies remain in place.\n` +
        `        The parser printed why above — inspect the source protocol.yon before retrying.`);
  }
  console.log("Done. Copied folders are frozen snapshots — they change only when you re-copy.");
  console.log("      After a git pull, diff your copy against this clone before re-running with");
  console.log("      --force — the re-copy is where you accept the new bytes, and the diff is");
  console.log("      the only place you get to read them first. README > Updating has the command.");
}

main();
