#!/usr/bin/env node
// Focused product-CLI cases. No provider calls, package downloads or real homes.
// Keep fixtures and recovery material; cleanup requires separate selection.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function noLinks(target) {
  for (let p = path.resolve(target);;) {
    try { if (fs.lstatSync(p).isSymbolicLink()) throw Error(`redirected test path: ${p}`); }
    catch (e) { if (e.code !== "ENOENT") throw e; }
    const parent = path.dirname(p); if (parent === p) break; p = parent;
  }
}
noLinks(os.tmpdir());
const root = fs.mkdtempSync(path.join(os.tmpdir(), "open-skills-installer-tests-"));
const source = fileURLToPath(new URL("../install.mjs", import.meta.url));
const results = [], ownedPids = [];
console.log(`Retained installer fixtures: ${root}`);
const body = (name, value = "incoming") => `---\nname: ${name}\n---\n${value}\n`;
const write = (p, content) => { noLinks(p); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content, { flag: "wx" }); };
function fixture(label, entries = [{ name: "alpha" }]) {
  const dir = path.join(root, label), repo = path.join(dir, "repo"), home = path.join(dir, "profile");
  noLinks(dir); fs.mkdirSync(home, { recursive: true });
  write(path.join(repo, "install.mjs"), fs.readFileSync(source));
  write(path.join(repo, "catalog.json"), JSON.stringify({ skills: entries }));
  for (const s of entries) {
    write(path.join(repo, "skills", s.name, "SKILL.md"), body(s.name));
    if (s.hasProtocol) write(path.join(repo, "skills", s.name, "protocol.yon"), "fixture parser input\n");
  }
  const env = { ...process.env, HOME: home, USERPROFILE: home, TEMP: dir, TMP: dir };
  const observedHome = execFileSync(process.execPath, ["-e", "process.stdout.write(require('node:os').homedir())"], { env, encoding: "utf8", timeout: 5000, windowsHide: true });
  assert.equal(path.resolve(observedHome), path.resolve(home), "child must use synthetic home");
  return { dir, repo, home, env, skills: path.join(home, ".agents", "skills") };
}
function launch(f, args, { validate = false, runtime = true } = {}) {
  const argv = [path.join(f.repo, "install.mjs"), ...(runtime ? ["--runtime", "agents"] : []), "--no-stamp", ...(!validate ? ["--no-validate"] : []), ...args];
  const child = spawn(process.execPath, argv, { cwd: f.repo, env: f.env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  ownedPids.push(child.pid);
  let output = "", finished = false;
  child.stdout.on("data", b => { output += b; }); child.stderr.on("data", b => { output += b; });
  const timer = setTimeout(() => {
    if (!finished) {
      if (process.platform === "win32") { try { execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { timeout: 5000, windowsHide: true, stdio: "ignore" }); } catch {} }
      else child.kill("SIGKILL");
    }
  }, 15000);
  const done = new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code, signal) => { finished = true; clearTimeout(timer); resolve({ code, signal, output }); });
  });
  return { child, done };
}
async function run(f, args, options) { return launch(f, args, options).done; }
function installed(f, name, value = "old") { write(path.join(f.skills, name, "SKILL.md"), body(name, value)); }
function untouched(f) { assert(!fs.existsSync(path.join(f.home, ".agents")), "failed preflight must create no runtime directory"); }
async function check(name, fn) {
  await fn(); results.push({ name, pass: true }); console.log(`PASS ${name}`);
}
const deps = [{ name: "alpha", requiresSkills: ["beta"] }, { name: "beta", requiresSkills: ["gamma"] }, { name: "gamma" }];
await check("missing siblings fail before copy", async () => {
  const f = fixture("missing", deps), r = await run(f, ["alpha"]);
  assert.notEqual(r.code, 0); assert.match(r.output, /alpha requires beta/); assert.match(r.output, /beta requires gamma/); untouched(f);
});
await check("selected transitive gap fails before copy", async () => {
  const f = fixture("transitive", deps), r = await run(f, ["alpha", "beta"]);
  assert.notEqual(r.code, 0); assert.match(r.output, /requires gamma/); untouched(f);
});
await check("explicit dependency selection and --all", async () => {
  for (const all of [false, true]) {
    const f = fixture(all ? "all" : "selected", deps), r = await run(f, all ? ["--all"] : ["alpha", "beta", "gamma"]);
    assert.equal(r.code, 0, r.output); assert.deepEqual(fs.readdirSync(f.skills).sort(), ["alpha", "beta", "gamma"]);
  }
});
await check("already-present dependencies remain unchanged", async () => {
  const f = fixture("present", deps); installed(f, "beta", "custom beta"); installed(f, "gamma", "custom gamma");
  const r = await run(f, ["alpha"]); assert.equal(r.code, 0, r.output);
  assert.equal(fs.readFileSync(path.join(f.skills, "beta", "SKILL.md"), "utf8"), body("beta", "custom beta"));
});
await check("invalid skipped dependency is not treated as pending", async () => {
  const f = fixture("invalid-present", deps); write(path.join(f.skills, "beta", "SKILL.md"), body("wrong")); installed(f, "gamma");
  const r = await run(f, ["alpha", "beta"]); assert.notEqual(r.code, 0); assert(!fs.existsSync(path.join(f.skills, "alpha")));
});
await check("unknown, unsafe and cyclic dependencies fail before copy", async () => {
  for (const [label, entries] of [
    ["unknown", [{ name: "alpha", requiresSkills: ["absent"] }]],
    ["unsafe", [{ name: "alpha", requiresSkills: ["../escape"] }]],
    ["cycle", [{ name: "alpha", requiresSkills: ["beta"] }, { name: "beta", requiresSkills: ["alpha"] }]],
  ]) {
    const f = fixture(label, entries), r = await run(f, ["--all"]); assert.notEqual(r.code, 0); untouched(f);
  }
});
await check("all runtime dependency checks precede any copy", async () => {
  const f = fixture("multiple-runtimes", deps); installed(f, "beta"); installed(f, "gamma");
  fs.mkdirSync(path.join(f.home, ".claude", "skills"), { recursive: true });
  const r = await run(f, ["alpha"], { runtime: false }); assert.notEqual(r.code, 0);
  assert(!fs.existsSync(path.join(f.skills, "alpha"))); assert(!fs.existsSync(path.join(f.home, ".claude", "skills", "alpha")));
});
await check("ordinary no-force skip remains unchanged", async () => {
  const f = fixture("skip", deps); installed(f, "alpha", "custom"); const r = await run(f, ["alpha"]);
  assert.equal(r.code, 0, r.output); assert.match(r.output, /skip alpha/);
  assert.equal(fs.readFileSync(path.join(f.skills, "alpha", "SKILL.md"), "utf8"), body("alpha", "custom"));
  assert(!fs.existsSync(path.join(f.home, ".agents", "open-skills-backups")));
});
await check("forced replacement retains complete previous bytes outside discovery", async () => {
  const f = fixture("force"); installed(f, "alpha", "custom"); write(path.join(f.skills, "alpha", "local.txt"), "keep me");
  const r = await run(f, ["--force", "alpha"]); assert.equal(r.code, 0, r.output);
  assert.equal(fs.readFileSync(path.join(f.skills, "alpha", "SKILL.md"), "utf8"), body("alpha"));
  const backups = path.join(f.home, ".agents", "open-skills-backups"), dirs = fs.readdirSync(backups);
  assert.equal(dirs.length, 1); const old = path.join(backups, dirs[0], "previous");
  assert.equal(fs.readFileSync(path.join(old, "SKILL.md"), "utf8"), body("alpha", "custom"));
  assert.equal(fs.readFileSync(path.join(old, "local.txt"), "utf8"), "keep me"); assert.deepEqual(fs.readdirSync(f.skills), ["alpha"]);
});

function waitForFile(file) {
  return new Promise((resolve, reject) => {
    let watch; const close = () => { clearTimeout(timer); watch?.close(); };
    const check = () => { if (fs.existsSync(file)) { close(); resolve(); } };
    const timer = setTimeout(() => { close(); reject(Error(`barrier not reached: ${file}`)); }, 8000);
    watch = fs.watch(path.dirname(file), check); check();
  });
}
async function parserBarrier(f, action, exitCode) {
  const bin = path.join(f.dir, "bin"), barrier = path.join(f.dir, "barrier"); fs.mkdirSync(barrier); fs.mkdirSync(bin);
  const stub = path.join(bin, "parser.mjs");
  write(stub, `import fs from 'node:fs';import path from 'node:path';const b=process.env.INSTALLER_TEST_BARRIER;fs.writeFileSync(path.join(b,'ready'),String(process.pid),{flag:'wx'});const timer=setTimeout(()=>process.exit(9),8000);const check=()=>{const p=path.join(b,'release');if(fs.existsSync(p)){clearTimeout(timer);watch.close();process.exit(Number(fs.readFileSync(p,'utf8')));}};const watch=fs.watch(b,check);check();\n`);
  const quote = s => "'" + s.replaceAll("'", "'\\''") + "'";
  if (process.platform === "win32") write(path.join(bin, "npx.cmd"), `@echo off\r\n"${process.execPath}" "${stub}"\r\n`);
  else { write(path.join(bin, "npx"), `#!/bin/sh\nexec ${quote(process.execPath)} ${quote(stub)}\n`); fs.chmodSync(path.join(bin, "npx"), 0o700); }
  // Avoid Windows PATH/Path aliases selecting different search paths.
  for (const key of Object.keys(f.env)) if (key.toLowerCase() === "path") delete f.env[key];
  f.env.PATH = bin + path.delimiter + process.env.PATH; f.env.INSTALLER_TEST_BARRIER = barrier;
  const child = launch(f, ["--force", "alpha"], { validate: true });
  await waitForFile(path.join(barrier, "ready")); ownedPids.push(Number(fs.readFileSync(path.join(barrier, "ready"), "utf8")));
  await action(); write(path.join(barrier, "release"), String(exitCode)); return child.done;
}
await check("edit during parser validation is not replaced", async () => {
  const f = fixture("concurrent", [{ name: "alpha", hasProtocol: true }]); installed(f, "alpha", "before");
  const r = await parserBarrier(f, async () => fs.writeFileSync(path.join(f.skills, "alpha", "SKILL.md"), body("alpha", "intervening edit")), 0);
  assert.notEqual(r.code, 0); assert.match(r.output, /destination changed during staging/);
  assert.equal(fs.readFileSync(path.join(f.skills, "alpha", "SKILL.md"), "utf8"), body("alpha", "intervening edit"));
  assert(fs.readdirSync(f.skills).some(n => n.startsWith(".alpha.staging-")));
});
await check("validation failure preserves live copy and staged evidence", async () => {
  const f = fixture("invalid-candidate", [{ name: "alpha", hasProtocol: true }]); installed(f, "alpha", "before");
  const r = await parserBarrier(f, async () => {}, 1); assert.notEqual(r.code, 0); assert.match(r.output, /validation failed/);
  assert.equal(fs.readFileSync(path.join(f.skills, "alpha", "SKILL.md"), "utf8"), body("alpha", "before"));
  assert(fs.readdirSync(f.skills).some(n => n.startsWith(".alpha.staging-"))); assert(!fs.existsSync(path.join(f.home, ".agents", "open-skills-backups")));
});
write(path.join(root, "REPORT.json"), JSON.stringify({ results, ownedPids, retainedRoot: root, platform: process.platform, cleanup: "No fixtures or backups deleted; child close observed; parser stand-ins have independent finite deadlines.", limits: "Product CLI fixtures, not real-home installation, actual parser validation or proof of atomic exclusion of unrelated writers." }, null, 2) + "\n");
console.log(`${results.length} product cases passed. Fixtures retained at ${root}`);
