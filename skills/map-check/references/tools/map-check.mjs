#!/usr/bin/env node
// map-check.mjs — the Map Your Knowledge (MYK) deterministic conformance checker.
// Read-only forever. Unqualified CLEAN is banned.
// Protocol source: MYK v2.4, skills/map-rules/SKILL.md and routed references.
// Usage: map-check.mjs <target-path> [--root-map <scope-relative>] [--json]
//   FULL mode: a .myk/README.md (or legacy scope.md) governs, found by walk-up.
//   DEGRADED mode: no contract; the caller supplies the declared root map
//   (--root-map) from map-rules/references/scope.md — Organized-scope evidence. No declaration at all = outside
//   jurisdiction (resolution error, never a finding).
// Exit: 0 clean-for-checks · 1 findings · 2 operational error · 3 resolution error
import { readFileSync, readdirSync, lstatSync, existsSync, realpathSync } from "node:fs";
import { join, relative, basename, resolve, sep, isAbsolute } from "node:path";
import { createHash } from "node:crypto";

const KV = "MYK v2.4";
const KERNEL_SOURCE = "skills/map-rules/SKILL.md and routed references";
const NOT_CHECKED = [
  "prose quality and curation",
  "semantic-role presence in free-form maps",
  "earned-scope judgment (absence of a declaration is never a finding)",
  "tag semantics beyond syntax",
  "positive cross-vault reference validity (the raw-wikilink PROHIBITION is checked; positive syntax is not)",
  "frontmatter-contained links (resolution parses note bodies only; YAML-frontmatter links are outside link-resolution.md and map-scan)",
  "frontmatter-exemption classes beyond M3 declarations (a vault-policy question)",
  "optional lifecycle value legality where the scope declares the layer",
  "8-field frontmatter ceremony (vault-policy-dependent)",
  "snapshot exemptions (needs Handler-declared pairs)",
  "qualified-Lyt-vault target resolution (pass an exact path; resolver integration is not implemented)",
  "work-state of any kind (permanently out of scope)",
];
const RULES = {
  "owner-declaration": "skills/map-rules/references/ownership.md — Eligibility and ownership",
  "reciprocal-spine": "skills/map-rules/references/ownership.md — Eligibility and ownership",
  "address-form": "skills/map-rules/references/naming.md — Address rules; skills/map-rules/references/lyt.md — Cross-vault references",
  "meta-container": "skills/map-rules/references/frontmatter.md — Additional constraints; skills/map-rules/references/ownership.md — Shared meta",
  "archive-consistency": "skills/map-rules/references/lifecycle.md — Currentness and archive evidence",
  "case-fold-collisions": "skills/map-rules/references/naming.md — Sibling case-fold collisions",
  "exclusion-integrity": "skills/map-rules/references/ownership.md — Managed artifacts and Excluded subtrees",
  "link-contract-grammar": "skills/map-rules/references/link-resolution.md — Scope-contract grammar",
  "link-occurrence-closure": "skills/map-rules/references/link-resolution.md — Terminal classes and closure",
};

const wantJson = process.argv.includes("--json");
function emit(objOrText, code) { console.log(typeof objOrText === "string" ? objOrText : JSON.stringify(objOrText, null, 2)); process.exit(code); }
function opError(code, cls, message, remedy) {
  const env = { schema_version: 1, kernel_version: KV, kernel_source: KERNEL_SOURCE, error: { code: cls, message, remedy: remedy || "see map-check SKILL.md" } };
  emit(wantJson ? env : `map-check ERROR [${cls}] ${message}\n  remedy: ${env.error.remedy}`, code);
}

function caseFoldCollisions(names) {
  const seen = new Map(), collisions = [];
  for (const displayName of names) {
    const key = displayName.replace(/\/$/, "").toLowerCase();
    const prior = seen.get(key);
    if (prior !== undefined && prior !== displayName) collisions.push({ a: prior, b: displayName });
    seen.set(key, displayName);
  }
  return collisions;
}

if (process.env.MYK_CASE_FOLD_REGRESSION === "1") {
  const collisions = caseFoldCollisions(["Notes", "notes/"]);
  const duplicates = caseFoldCollisions(["Notes", "Notes"]);
  if (collisions.length !== 1 || collisions[0].a !== "Notes" || collisions[0].b !== "notes/" || duplicates.length !== 0) process.exit(1);
  console.log("MYK_CASE_FOLD_COLLISION_OK");
  process.exit(0);
}

function main() {
  // ---------- arguments ----------
  const argv = process.argv.slice(2).filter(a => a !== "--json");
  const rmIdx = argv.indexOf("--root-map");
  let declaredRootArg = null;
  if (rmIdx >= 0) { declaredRootArg = argv[rmIdx + 1] || null; argv.splice(rmIdx, 2); }
  // Bounded walk: same defaults and validation grammar as map-scan.
  const takeN = (flag, dflt) => { const i = argv.indexOf(flag); if (i < 0) return dflt; const v = Number(argv[i + 1]) || dflt; argv.splice(i, 2); return v; };
  const MAXF = takeN("--max-files", 20000), MAXMS = takeN("--max-ms", 60000);
  const T0 = Date.now();
  if (!argv[0]) return opError(3, "no-target", "usage: map-check.mjs <target-path> [--root-map <scope-relative>] [--json] [--max-files N] [--max-ms N]");
  let target; try { target = resolve(argv[0]); } catch { return opError(3, "bad-target", "target path did not resolve"); }
  if (!existsSync(target)) return opError(3, "no-target", `target does not exist: ${target}`);

  const norm = p => p.split(sep).join("/");
  const safeLstat = p => { try { return lstatSync(p); } catch { return null; } };
  const safeRead = p => { try { return readFileSync(p, "utf8"); } catch { return null; } };
  const containedRel = rel => rel && !isAbsolute(rel) && !rel.split(/[\\/]/).some(s => s === "..") && rel.trim() !== "";

  // ---------- scope resolution ----------
  function findScopeRoot(p) {
    const st = safeLstat(p); if (!st) return null;
    let dir = st.isDirectory() ? p : resolve(p, "..");
    while (true) {
      const a = existsSync(join(dir, ".myk", "README.md")), b = existsSync(join(dir, ".myk", "scope.md"));
      if (a && b) return { conflict: dir };
      if (a || b) return { root: dir, contract: join(dir, ".myk", a ? "README.md" : "scope.md"), legacy: !a };
      const parent = resolve(dir, "..");
      if (parent === dir) return null;
      dir = parent;
    }
  }
  const found = findScopeRoot(target);
  if (found?.conflict) return opError(3, "scope-conflict", `both .myk/README.md and .myk/scope.md exist at ${found.conflict} — competing same-precedence declarations; fail closed`);

  let mode, discovery, scopeRoot, rootMapRel, exclusions = [], managedEntries = [], contractFindingsSeed = [], exclusionEntriesFull = [];
  if (found) {
    mode = "FULL"; discovery = "contract"; scopeRoot = found.root;
    const fmBlock = (() => { const t = safeRead(found.contract); if (!t || !t.startsWith("---")) return null; const e = t.indexOf("\n---", 3); return e < 0 ? null : t.slice(3, e); })();
    if (!fmBlock) return opError(2, "unreadable-contract", `contract has no parseable frontmatter: ${found.contract}`);
    const rm = fmBlock.match(/root-map:\s*"?([^"\n]+?)"?\s*$/m);
    if (!rm) return opError(2, "malformed-contract", "m1.root-map missing from the scope contract");
    rootMapRel = norm(rm[1].trim());
    if (!containedRel(rootMapRel)) return opError(2, "malformed-contract", `root-map locator violates the containment grammar: ${rootMapRel}`);
    if (!existsSync(join(scopeRoot, rootMapRel))) return opError(2, "malformed-contract", `declared root map does not exist: ${rootMapRel}`);
    if (found.legacy) contractFindingsSeed.push({ check: "exclusion-integrity", class: "legacy-contract-name", path: ".myk/scope.md", evidence: "legacy entrypoint filename — scope.md — Scope contract names .myk/README.md", rule: RULES["exclusion-integrity"] });
    // per-entry M3 parse (path + fields), indentation-scoped
    function entries(section) {
      const out = []; let inSec = false, cur = null;
      for (const ln of fmBlock.split("\n")) {
        const sec = ln.match(/^\s{4}(exclusions|managed-artifacts):/);
        if (sec) { inSec = sec[1] === section; cur = null; continue; }
        if (/^\s{2}m\d:/.test(ln) || /^\s{2}[a-z-]+:/.test(ln)) { inSec = false; cur = null; continue; }
        if (!inSec) continue;
        const item = ln.match(/^\s+-\s+path:\s*"?([^"\n]+?)"?\s*$/);
        if (item) { cur = { path: norm(item[1].trim()) }; out.push(cur); continue; }
        if (cur) { const kv = ln.match(/^\s+([a-z-]+):\s*"?([^"\n]*?)"?\s*$/); if (kv && kv[1] !== "path") cur[kv[1]] = kv[2].trim();
          const ge = ln.match(/^\s+(map|section|entrypoint):\s*"?([^"\n]+?)"?\s*$/); if (ge) cur[ge[1]] = ge[2].trim(); }
      }
      return out;
    }
    const excl = entries("exclusions"); managedEntries = entries("managed-artifacts");
    for (const e of excl) {
      const missing = ["owner", "prohibition", "graph-entry", "reason", "established-by"].filter(k => !e[k]);
      if (e["graph-entry"] && !["single-entrypoint", "individually-indexed", "none"].includes(e["graph-entry"]))
        contractFindingsSeed.push({ check: "exclusion-integrity", class: "malformed-exclusion", path: e.path, evidence: `graph-entry outside the closed vocabulary: ${e["graph-entry"]}`, rule: RULES["exclusion-integrity"] });
      if (e["graph-entry"] === "single-entrypoint" && !e.entrypoint)
        contractFindingsSeed.push({ check: "exclusion-integrity", class: "malformed-exclusion", path: e.path, evidence: "graph-entry single-entrypoint requires an entrypoint", rule: RULES["exclusion-integrity"] });
      if (!containedRel(e.path)) contractFindingsSeed.push({ check: "exclusion-integrity", class: "malformed-exclusion", path: e.path, evidence: "path violates containment grammar", rule: RULES["exclusion-integrity"] });
      else if (missing.length) contractFindingsSeed.push({ check: "exclusion-integrity", class: "malformed-exclusion", path: e.path, evidence: `missing required fields: ${missing.join(", ")}`, rule: RULES["exclusion-integrity"] });
    }
    const SURFACES = ["frontmatter", "body", "locator", "whole-file"];
    const GE_POLICIES = ["single-entrypoint", "individually-indexed", "none"];
    for (const e of managedEntries) {
      const missing = ["owner", "owned-surfaces", "established-by"].filter(k => !e[k]);
      if (!e.map && !e["graph-entry"]) missing.push("graph-entry (map/section)");
      if (e.map && !e.section) missing.push("section (a structured graph entry requires both map and section)");
      if (e["owned-surfaces"]) { const bad = e["owned-surfaces"].replace(/[\[\]"]/g, "").split(",").map(s => s.trim()).filter(s => s && !SURFACES.includes(s));
        if (bad.length) contractFindingsSeed.push({ check: "exclusion-integrity", class: "malformed-exclusion", path: e.path, evidence: `owned-surfaces outside the closed vocabulary: ${bad.join(", ")}`, rule: RULES["exclusion-integrity"] }); }
      // exact-file vs subtree is the RESOLVED TARGET TYPE, never the filename
      // extension; a nonexistent target gets its own finding below, not a guess here.
      const entrySt = containedRel(e.path) ? safeLstat(join(scopeRoot, e.path)) : null;
      const isSubtree = !!entrySt && entrySt.isDirectory();
      if (isSubtree && !e.entrypoint) missing.push("entrypoint (required for subtree entries)");
      if (!containedRel(e.path)) contractFindingsSeed.push({ check: "exclusion-integrity", class: "malformed-exclusion", path: e.path, evidence: "managed path violates containment grammar", rule: RULES["exclusion-integrity"] });
      else if (missing.length) contractFindingsSeed.push({ check: "exclusion-integrity", class: "malformed-exclusion", path: e.path, evidence: `managed entry missing: ${missing.join(", ")}`, rule: RULES["exclusion-integrity"] });
    }
    exclusions = excl.map(e => e.path).filter(containedRel);
    exclusionEntriesFull = excl;
  } else if (declaredRootArg) {
    mode = "DEGRADED"; discovery = "declared argument from scope.md — Organized-scope evidence; exclusions audit-scoped only";
    scopeRoot = safeLstat(target).isDirectory() ? target : resolve(target, "..");
    rootMapRel = norm(declaredRootArg);
    if (!containedRel(rootMapRel) || !existsSync(join(scopeRoot, rootMapRel)))
      return opError(3, "bad-declared-root", `--root-map must be a contained scope-relative path to an existing file: ${declaredRootArg}`);
  } else {
    return opError(3, "no-declared-scope", "no .myk/ contract found by walk-up and no --root-map supplied — undeclared trees are outside map-check's jurisdiction",
      "establish the scope with map-this (Handler-gated), or pass --root-map <declared-root> from scope.md — Organized-scope evidence");
  }

  const isUnder = (rel, entry) => rel === entry || rel.startsWith(entry.replace(/\/$/, "") + "/");
  const isExcluded = rel => exclusions.some(e => isUnder(rel, e));
  const managedPaths = managedEntries.map(e => e.path).filter(containedRel);
  const isManaged = rel => managedPaths.some(e => isUnder(rel, e));

  // ---------- contained inventory walk (bounded; typed incomplete on cap) ----------
  const files = [], dirs = [], skipped = [], fileMeta = new Map();
  let capHit = false;
  (function walk(dir) {
    if (capHit) return;
    let names; try { names = readdirSync(dir); } catch { skipped.push(norm(relative(scopeRoot, dir)) + "/ (unreadable)"); return; }
    for (const name of names) {
      if (files.length >= MAXF || Date.now() - T0 > MAXMS) { capHit = true; return; }
      const full = join(dir, name);
      const rel = norm(relative(scopeRoot, full));
      const top = rel.split("/")[0];
      if (top === ".myk" || rel.split("/").some(s => s === ".git" || s === ".obsidian" || s === ".lyt")) continue;
      const st = safeLstat(full);
      if (!st) { skipped.push(rel + " (lstat failed — unknown reparse or access)"); continue; }
      if (st.isSymbolicLink()) { skipped.push(rel + " (link/junction — not traversed)"); continue; }
      if (st.isDirectory()) { dirs.push(rel); if (!isExcluded(rel)) walk(full); continue; }
      files.push(rel); fileMeta.set(rel, { size: st.size, mtime: Math.round(st.mtimeMs) });
    }
  })(scopeRoot);
  if (capHit) return opError(2, "check-incomplete", `walk cap reached (max-files ${MAXF} / max-ms ${MAXMS}) before canonical inventory closure — no conformance claim is possible`, "raise the caps or narrow the target");
  if (skipped.length) return opError(2, "check-incomplete", `inventory boundaries prevent canonical closure (${skipped.length} skipped: ${skipped.slice(0, 5).join(" · ")}${skipped.length > 5 ? " · …" : ""}) — no conformance claim is possible`, "resolve the unreadable/reparse boundaries or narrow the target");
  const mdFiles = files.filter(f => f.endsWith(".md") && !isExcluded(f));

  // ---------- frontmatter/meta parse ----------
  const findings = [...contractFindingsSeed];
  const F = (check, cls, path, evidence) => findings.push({ check, class: cls, path, evidence, rule: RULES[check] || check });
  const stem = p => basename(p).replace(/\.md$/, "");
  const fmOf = new Map(), bodyOf = new Map();
  for (const rel of mdFiles) {
    const t = safeRead(join(scopeRoot, rel));
    if (t === null) { skipped.push(rel + " (unreadable)"); continue; }
    if (t.startsWith("---")) { const e = t.indexOf("\n---", 3); if (e > 0) { fmOf.set(rel, t.slice(3, e)); bodyOf.set(rel, t.slice(e + 4)); continue; } }
    fmOf.set(rel, null); bodyOf.set(rel, t);
  }
  const meta = new Map();
  for (const rel of mdFiles) {
    const fm = fmOf.get(rel);
    if (fm === null || fm === undefined) { meta.set(rel, { parsed: false }); continue; }
    const metaLines = fm.match(/^meta:.*$/mg) || [];
    const inline = fm.match(/^meta:\s*\{([\s\S]*?)\}\s*$/m);
    // one meta body for BOTH container forms: inline {…} and nested block — every
    // meta-container derivation below reads map values, raw keys, duplicate keys, and legacy parent.
    let metaBody = inline ? inline[1] : null, nested = false;
    if (metaBody === null && /^meta:\s*$/m.test(fm)) {
      const lines = fm.split("\n"); const at = lines.findIndex(l => /^meta:\s*$/.test(l));
      const block = [];
      for (let j = at + 1; j < lines.length && /^\s+\S/.test(lines[j]); j++) block.push(lines[j]);
      if (block.length) { metaBody = block.join("\n"); nested = true; }
    }
    const keyRe = nested ? /^\s+([a-z-]+):/gm : /(?:^|[,{\s])([a-z-]+):/g;
    const mapRe = nested ? /^\s+map:\s*"?\[\[([^\]]+)\]\]"?\s*$/gm : /(?:^|[,{\s])map:\s*"\[\[([^\]]+)\]\]"/g;
    const mapMatches = metaBody !== null ? [...metaBody.matchAll(mapRe)] : [];
    const keys = metaBody !== null ? [...metaBody.matchAll(keyRe)].map(x => x[1]) : [];
    const rawMapKeys = keys.filter(k => k === "map").length;
    const dupKeys = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))];
    meta.set(rel, {
      parsed: true, metaCount: metaLines.length,
      map: mapMatches[0]?.[1]?.trim() || null,
      mapCount: mapMatches.length,
      legacyParent: keys.includes("parent"),
      rawMapKeys, dupKeys,
      archived: /archived:\s*"?\d{4}-\d{2}-\d{2}/.test(fm),
    });
  }

  // owner-declaration + meta-container
  const rootRel = rootMapRel;
  for (const rel of mdFiles) {
    const m = meta.get(rel); if (!m) continue;
    const managedHere = isManaged(rel);
    if (!m.parsed) { if (!managedHere && rel !== rootRel) F("meta-container", "parse-error", rel, "frontmatter block missing or unterminated"); continue; }
    if (m.metaCount > 1) F("meta-container", "duplicate-key", rel, `${m.metaCount} meta lines`);
    if (m.dupKeys?.length) F("meta-container", "duplicate-key", rel, `duplicate keys inside meta: ${m.dupKeys.join(", ")}`);
    if (m.rawMapKeys > (m.mapCount || 0)) F("meta-container", "malformed-map-value", rel, "meta.map present but not a quoted [[wikilink]] value");
    if (m.legacyParent) F("meta-container", "legacy-owner-key", rel, "exact key meta.parent present inside meta");
    if (rel === rootRel) { if (m.map) F("owner-declaration", "root-declares-owner", rel, `root map declares meta.map → ${m.map}`); continue; }
    if (managedHere) continue;
    if (m.mapCount > 1) F("owner-declaration", "multiple-owners", rel, `${m.mapCount} map declarations`);
    else if (!m.map && !m.rawMapKeys) F("owner-declaration", "missing-owner", rel, "no meta.map declaration");
  }

  // link matcher: exact wikilink whose target ends at the stem or equals the path
  const stemCounts = new Map();
  for (const f of mdFiles) { const s = stem(f); stemCounts.set(s, (stemCounts.get(s) || 0) + 1); }
  const linksTo = (body, targetRel) => {
    if (!body) return false;
    const s = stem(targetRel), noExt = targetRel.replace(/\.md$/, "");
    const re = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g; let m;
    while ((m = re.exec(body))) {
      const t = norm(m[1].trim()).replace(/[\\/]+$/, ""); // strip table-escaped-pipe residue; norm turns the trailing backslash into "/"
      if (t === noExt) return true;                                   // exact scope-relative path
      if (t.endsWith("/" + noExt)) return true;                       // vault-relative link whose tail IS this member's scope path
      if (!t.includes("/") && t === s && stemCounts.get(s) === 1) return true; // bare stem, unique in scope
    }
    return false;
  };
  const resolveOwner = declared => {
    const d = norm(declared);
    const exact = mdFiles.find(f => f === d + ".md" || f === d);
    if (exact) return exact;
    // vault-relative declarations: the declared path may carry the vault-side prefix
    // of this scope — unique suffix match on a path-segment boundary resolves it.
    const bySuffix = mdFiles.filter(f => { const fx = f.replace(/\.md$/, ""); return d === fx || d.endsWith("/" + fx); });
    if (bySuffix.length === 1) return bySuffix[0];
    if (bySuffix.length > 1) {
      // the most-specific (longest) suffix is the declared file; ambiguous only on a tie
      const max = Math.max(...bySuffix.map(f => f.length));
      const best = bySuffix.filter(f => f.length === max);
      return best.length === 1 ? best[0] : "__AMBIGUOUS__";
    }
    const byStem = mdFiles.filter(f => stem(f) === basename(d));
    return byStem.length === 1 ? byStem[0] : byStem.length > 1 ? "__AMBIGUOUS__" : null;
  };

  // reciprocal-spine + address-form
  for (const rel of mdFiles) {
    const m = meta.get(rel);
    if (!m?.map || rel === rootRel || isManaged(rel)) continue;
    if (basename(norm(m.map)) === "README" && !norm(m.map).includes("/")) F("address-form", "bare-duplicate-basename", rel, "owner declared as bare [[README]]");
    const owner = resolveOwner(m.map);
    if (owner === null) { F("reciprocal-spine", "dangling-owner", rel, `declared owner not found in scope: ${m.map}`); continue; }
    if (owner === "__AMBIGUOUS__") { F("address-form", "ambiguous-target", rel, `owner reference resolves to multiple files: ${m.map}`); continue; }
    if (!linksTo(bodyOf.get(owner), rel)) F("reciprocal-spine", "spine-drift-mapside", owner, `member ${rel} declares this map but has no exact structural link here`);
  }
  // raw cross-vault wikilinks (prohibition; positive syntax stays not-checked)
  for (const rel of mdFiles) { const b = bodyOf.get(rel) || ""; if (/\[\[lyt:vault:[^\]]+\]\]/.test(b)) F("address-form", "raw-cross-vault-wikilink", rel, "raw cross-vault wikilink present; lyt.md — Cross-vault references requires prose vault + path"); }

  // archive-consistency — all instances, both directions
  for (const rel of mdFiles) {
    const m = meta.get(rel); const b = bodyOf.get(rel) || "";
    const hasCallout = /\[!archive\]/.test(b);
    if (m?.archived && !hasCallout) F("archive-consistency", "missing-callout", rel, "meta.archived without a visible archive callout");
    if (!m?.archived && hasCallout) F("archive-consistency", "signal-disagreement", rel, "archive callout present without meta.archived");
  }
  for (const rel of mdFiles) if (rel.split("/").slice(0, -1).includes("archive") && !meta.get(rel)?.archived) F("archive-consistency", "unsignalled-archive", rel, "lives under archive/ without an archive signal (Handler review)");

  // case-fold-collisions, including directory names
  const byDir = new Map();
  const add = (rel, isDir) => { const d = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : "."; if (!byDir.has(d)) byDir.set(d, []); byDir.get(d).push(basename(rel) + (isDir ? "/" : "")); };
  files.forEach(f => add(f, false)); dirs.forEach(d => add(d, true));
  for (const [d, names] of byDir) for (const { a, b } of caseFoldCollisions(names)) F("case-fold-collisions", "case-fold-collision", d === "." ? "(scope root)" : d, `${a} vs ${b}`);

  // exclusion-integrity — managed coverage at each entry's declared map/section
  for (const e of managedEntries) {
    if (!containedRel(e.path) || !existsSync(join(scopeRoot, e.path))) { if (containedRel(e.path)) F("exclusion-integrity", "malformed-exclusion", e.path, "declared managed path does not exist"); continue; }
    const covMapRel = e.map ? norm(e.map) : rootRel;
    const covBody = safeRead(join(scopeRoot, covMapRel));
    if (covBody === null) { F("exclusion-integrity", "mapside-coverage-missing", e.path, `declared covering map unreadable: ${covMapRel}`); continue; }
    let region = covBody;
    if (e.section) {
      const idx = covBody.indexOf(e.section);
      if (idx < 0) { F("exclusion-integrity", "mapside-coverage-missing", e.path, `declared section heading not found in ${covMapRel}: "${e.section}"`); continue; }
      const next = covBody.indexOf("\n#", idx + e.section.length);
      region = covBody.slice(idx, next < 0 ? undefined : next);
    }
    const targetForLink = e.entrypoint && containedRel(norm(e.entrypoint)) ? norm(e.entrypoint) : e.path;
    if (!linksTo(region, targetForLink) && !region.includes(targetForLink)) F("exclusion-integrity", "mapside-coverage-missing", e.path, `no link to ${targetForLink} in ${covMapRel}${e.section ? ` heading "${e.section}"` : ""}`);
  }
  for (const e of exclusions) if (!existsSync(join(scopeRoot, e))) F("exclusion-integrity", "malformed-exclusion", e, "declared excluded path does not exist");

  // ---------- link resolution conformance (independent implementation) ----------
  // Grammar, inventory, and resolution re-implemented from link-resolution.md — no scanner
  // code, no scanner output as truth. Normalized records exist so a reviewer can compare
  // the two tools' outputs under matching fingerprints.
  const NB = String.fromCharCode(0);
  const OCCK = ["resolved-file", "resolved-heading", "resolved-block", "resolved-nonmarkdown", "missing-file", "missing-heading", "missing-block", "ambiguous", "accepted-external", "accepted-unresolved", "residual-at-cap"];
  const occ = {}; for (const k of OCCK) occ[k] = 0;
  const resolutionRecords = []; let dialectDecl = [], accepts = [], gbt = [];
  let contractFingerprint = null, resInvFp = null, gbtFp = null, occTotal = 0;
  if (mode === "FULL") {
    let grammarErrors = 0;
    const gerr = m => { F("link-contract-grammar", "malformed-contract", ".myk contract", m); grammarErrors++; };
    const idEq = (a, b) => a.split(sep).join("/").toLowerCase() === b.split(sep).join("/").toLowerCase();
    { const str = safeLstat(scopeRoot); if (!str || str.isSymbolicLink()) return opError(2, "check-incomplete", "scope root is a reparse point or unreadable — safety cannot be established");
      let rr = null; try { rr = realpathSync.native(scopeRoot); } catch { }
      if (rr === null || !idEq(rr, scopeRoot)) return opError(2, "check-incomplete", "scope root diverges from its native realpath — reparse point in the chain; safety cannot be established"); }
    let cbuf = null; try { cbuf = readFileSync(found.contract); } catch { }
    if (cbuf) {
      contractFingerprint = createHash("sha256").update(cbuf).digest("hex");
      let rp = null; try { rp = realpathSync.native(found.contract); } catch { }
      if (rp === null || !idEq(rp, found.contract)) return opError(2, "check-incomplete", "contract path diverges from its native realpath — reparse point; safety cannot be established");
      let text = cbuf.toString("utf8");
      if (!Buffer.from(text, "utf8").equals(cbuf)) gerr("invalid UTF-8");
      if (text.charCodeAt(0) === 0xFEFF) { gerr("BOM present"); text = text.slice(1); }
      text = text.replace(/\r\n/g, "\n");
      let fm2 = null;
      if (text.startsWith("---\n")) { const e = text.indexOf("\n---", 3); const after = e > 0 ? text.slice(e + 4) : null;
        if (e > 0 && (after === "" || after.startsWith("\n"))) fm2 = text.slice(4, e + 1);
        else gerr("frontmatter terminator line is not exactly ---"); }
      else gerr("frontmatter does not begin with ---\\n at byte zero");
      if (fm2) {
        const L = fm2.split("\n");
        if (L.filter(l => l === "myk:").length > 1) gerr("duplicate myk: host key");
        // duplicate host keys WITHIN the myk block void declarations
        { const li0 = L.indexOf("myk:");
          if (li0 >= 0) { const blockL = []; for (let i2 = li0 + 1; i2 < L.length; i2++) { const l2 = L[i2]; if (l2 !== "" && !/^\s/.test(l2)) break; blockL.push(l2); }
            for (const [nm, pat] of [["m1:", "  m1:"], ["link-dialects:", "    link-dialects:"], ["accepted-links:", "    accepted-links:"]])
              if (blockL.filter(l => l === pat).length > 1) gerr(`duplicate host key ${nm}`); } }
        const li = L.indexOf("myk:");
        if (li >= 0) {
          const jv = s => { const tr = s.trim(); if (!/^"/.test(tr)) return null; try { const v = JSON.parse(tr); return typeof v === "string" ? v : null; } catch { return null; } };
          let cursor = li + 1, inM1 = false, list = null, item = null, lastKeyIdx = -1;
          const flush = () => { if (item && list) (list === "d" ? dialectDecl : accepts).push(item); item = null; };
          while (cursor < L.length) {
            const ln = L[cursor];
            if (ln !== "" && !/^\s/.test(ln)) break;
            if (ln.includes("\t")) gerr("tab in machine block");
            if (ln === "  m1:") { flush(); list = null; inM1 = true; cursor++; continue; }
            if (/^  [a-z-]+:/.test(ln)) { flush(); list = null; inM1 = false; cursor++; continue; } // other 2-space keys (m3:, version:, …) end m1 context
            let m;
            if (inM1 && (m = ln.match(/^    (link-dialects|accepted-links):\s*$/))) { flush(); list = m[1] === "link-dialects" ? "d" : "a"; cursor++; continue; }
            if (/^    [a-z-]+:/.test(ln)) { flush(); list = null; cursor++; continue; } // any other 4-space key ends the governed list
            if (list && (m = ln.match(/^      - (id|target): (.+)$/))) {
              flush();
              if ((list === "d") !== (m[1] === "id")) gerr(`item first key ${m[1]} does not match its list`);
              const v = jv(m[2]); if (v === null) gerr(`${m[1]} is not a double-quoted JSON string`);
              item = {}; if (v !== null) item[m[1]] = v; lastKeyIdx = 0;
              cursor++; continue;
            }
            if (item && (m = ln.match(/^        ([a-z-]+): (.+)$/))) {
              const order = list === "d" ? ["id", "subtree", "kind", "base"] : ["target", "source", "class", "reason"];
              const oi = order.indexOf(m[1]);
              if (oi < 0) gerr(`unknown key ${m[1]}`);
              else if (oi <= lastKeyIdx) gerr(`key ${m[1]} out of exact order or duplicated`);
              else { const v = jv(m[2]); if (v === null) gerr(`${m[1]} is not a double-quoted JSON string`); else { item[m[1]] = v; lastKeyIdx = oi; } }
              cursor++; continue;
            }
            // grammar policing applies ONLY inside the two governed lists
            if (list && (/^      - /.test(ln) || (item && /^        /.test(ln)))) gerr(`malformed machine line: ${ln.trim().slice(0, 50)}`);
            cursor++;
          }
          flush();
        }
      }
      const okLoc = s => !!s && !/^\//.test(s) && !s.includes("\\") && !/^[A-Za-z]:/.test(s) && !/^[a-z][a-z0-9+.-]*:/i.test(s) && s.split("/").every(x => x && x !== "." && x !== "..");
      const seenSub = new Set(), seenIds = new Set();
      dialectDecl = dialectDecl.filter(d => {
        if (!d.id || !d.subtree || !d.kind || !d.base) { gerr("dialect entry missing required fields"); return false; }
        if (!/^[a-z][a-z0-9-]{0,63}$/.test(d.id) || seenIds.has(d.id)) { gerr(`bad or duplicate dialect id ${d.id}`); return false; }
        if (d.kind !== "corpus-root-relative") { gerr(`unknown dialect kind ${d.kind}`); return false; }
        if (!okLoc(d.subtree) || !okLoc(d.base)) { gerr(`locator grammar violation in ${d.id}`); return false; }
        for (const loc of [d.subtree.replace(/\/$/, ""), d.base.replace(/\/$/, "")]) {
          const fp2 = join(scopeRoot, loc); const st2 = safeLstat(fp2);
          if (!st2) { gerr(`dialect ${d.id}: declared locator ${loc} does not exist or is unreadable — fail-closed`); return false; }
          if (st2.isSymbolicLink()) { gerr(`dialect ${d.id}: ${loc} is a reparse point — refused`); return false; }
          let r2 = null; try { r2 = realpathSync.native(fp2); } catch { }
          if (r2 === null || !idEq(r2, fp2)) { gerr(`dialect ${d.id}: ${loc} diverges from its native realpath — refused`); return false; }
        }
        const key = d.subtree.replace(/\/$/, "").toLowerCase();
        if (seenSub.has(key)) { gerr(`duplicate/case-fold-colliding subtree ${d.subtree}`); return false; }
        seenSub.add(key); seenIds.add(d.id); return true;
      }).map(d => ({ ...d, subtree: d.subtree.replace(/\/$/, ""), base: d.base.replace(/\/$/, "") }))
        .sort((a, b) => b.subtree.length - a.subtree.length || (a.subtree < b.subtree ? -1 : 1));
      const seenPairs = new Set();
      accepts = accepts.filter(a => {
        if (!a.target || !a.class || !a.reason || !["accepted-external", "accepted-unresolved"].includes(a.class)) { gerr(`invalid acceptance entry ${(a.target || "?").slice(0, 40)}`); return false; }
        if (a.source && !okLoc(a.source)) { gerr(`acceptance source locator violation ${a.source}`); return false; }
        const k = JSON.stringify([a.source || null, a.target]);
        if (seenPairs.has(k)) { gerr(`duplicate acceptance (source,target) ${a.target}`); return false; }
        seenPairs.add(k); return true;
      });
      for (const e of exclusionEntriesFull) {
        if (e["graph-entry"] !== "single-entrypoint") continue;
        if (!e.entrypoint) { gerr(`single-entrypoint exclusion ${e.path} lacks an entrypoint`); continue; }
        const ep = norm(e.entrypoint);
        if (!okLoc(ep)) { gerr(`entrypoint locator violation ${ep}`); continue; }
        const stE = safeLstat(join(scopeRoot, ep));
        if (!stE) { gerr(`declared entrypoint does not exist: ${ep}`); continue; }
        if (stE.isSymbolicLink()) { gerr(`entrypoint is a reparse point: ${ep}`); continue; }
        let epR = null; try { epR = realpathSync.native(join(scopeRoot, ep)); } catch { }
        if (epR === null || !idEq(epR, join(scopeRoot, ep))) { gerr(`entrypoint diverges from native realpath: ${ep}`); continue; }
        gbt.push(ep);
      }
      if (grammarErrors) { dialectDecl = []; accepts = []; gbt = []; }
    }
    gbt = [...new Set(gbt)].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    // Canonical inventory and fingerprints from link-resolution.md — Resolution inventory and fingerprints.
    const invSorted = files.filter(f => !isExcluded(f)).slice().sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    const metaOf = r => fileMeta.get(r) || (() => { const s = safeLstat(join(scopeRoot, r)); return s ? { size: s.size, mtime: Math.round(s.mtimeMs) } : { size: 0, mtime: 0 }; })();
    const fpOf = arr => createHash("sha256").update(arr.map(r => { const m2 = metaOf(r); return r + NB + m2.size + NB + m2.mtime; }).map(l => l + "\n").join("")).digest("hex");
    resInvFp = fpOf(invSorted);
    gbtFp = fpOf(gbt.slice().sort());
    // independent resolution: index-based
    const targets = invSorted.concat(gbt.filter(g => !invSorted.includes(g)));
    const mdT = targets.filter(p => p.endsWith(".md"));
    const allT = new Set(targets);
    const stemMap = new Map(); for (const p of targets) { const s2 = p.endsWith(".md") ? basename(p).replace(/\.md$/, "") : basename(p); if (!stemMap.has(s2)) stemMap.set(s2, []); stemMap.get(s2).push(p); }
    const rlv = t => {
      if (allT.has(t)) return t;
      if (allT.has(t + ".md")) return t + ".md";
      const tails = targets.filter(p => p.endsWith(".md") ? t.endsWith("/" + p.replace(/\.md$/, "")) : t.endsWith("/" + p));
      if (tails.length) { const mx = Math.max(...tails.map(p => p.length)); const b = tails.filter(p => p.length === mx); return b.length === 1 ? b[0] : "?"; }
      if (!t.includes("/")) { const c = stemMap.get(t) || []; return c.length === 1 ? c[0] : c.length ? "?" : null; }
      const t2 = targets.filter(p => p.endsWith("/" + t));
      return t2.length === 1 ? t2[0] : t2.length > 1 ? "?" : null;
    };
    const headOf = new Map(), blockOf = new Map();
    const fragIdx = p => {
      if (!headOf.has(p)) { const b = (bodyOf.get(p) !== undefined ? bodyOf.get(p) : (() => { const t2 = safeRead(join(scopeRoot, p)); if (t2 === null) return ""; const e = t2.startsWith("---") ? t2.indexOf("\n---", 3) : -1; return e > 0 ? t2.slice(e + 4) : t2; })()) || "";
        const hs = new Set(); for (const hm of b.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) hs.add(hm[1].trim());
        const bs = new Set(); for (const bm of b.matchAll(/\^([A-Za-z0-9-]+)\s*$/gm)) bs.add(bm[1]);
        headOf.set(p, hs); blockOf.set(p, bs); }
      return { h: headOf.get(p), b: blockOf.get(p) };
    };
    const managedNoParse = rel => managedEntries.some(e => (e["owned-surfaces"] || "").match(/body|whole-file/) && (rel === e.path || rel.startsWith(e.path.replace(/\/$/, "") + "/")));
    const srcDir = r => r.includes("/") ? r.slice(0, r.lastIndexOf("/")) : "";
    const relJoin = (dir, t) => { const parts = dir ? dir.split("/") : []; for (const seg of norm(t).split("/")) { if (!seg || seg === ".") continue; if (seg === "..") { if (!parts.length) return null; parts.pop(); } else parts.push(seg); } return parts.join("/"); };
    const acceptMatch = (src, target) =>
      accepts.find(a => a.target === target && a.source === src)
      || accepts.find(a => a.target === target && !a.source);
    for (const src of mdFiles) {
      if (managedNoParse(src)) continue;
      const body = bodyOf.get(src) || "";
      const occs = [];
      for (const m of body.matchAll(/\[\[([^\]|#]+)(#[^\]|]*)?(?:\|[^\]]*)?\]\]/g))
        occs.push({ form: "wiki", target: norm(m[1].trim()).replace(/[\\/]+$/, ""), fragment: m[2] ? m[2].slice(1).trim() : null });
      for (const m of body.matchAll(/\[[^\]]*\]\(([^)#\s]+)(#[^)]*)?\)/g)) { const t2 = m[1];
        if (/^[a-z][a-z0-9+.-]*:/i.test(t2) || t2.startsWith("/")) continue;
        const j = relJoin(srcDir(src), decodeURIComponent(t2));
        occs.push({ form: "mdrel", target: j === null ? null : j, fragment: m[2] ? decodeURIComponent(m[2].slice(1)).trim() : null, escapes: j === null }); }
      for (const o of occs) {
        occTotal++;
        const rec = { source: src, raw_target: o.escapes ? "(escapes scope root)" : o.target, fragment: o.fragment || null, form: o.form, class: null, canonical_target: null, rule_id: null, interpretations: null };
        const done = cls => { occ[cls]++; rec.class = cls; resolutionRecords.push(rec); };
        if (o.escapes) { done("missing-file"); continue; }
        const acc = acceptMatch(src, o.target);
        if (acc) { done(acc.class); continue; }
        if (/^[a-z][a-z0-9+.-]*:/i.test(o.target)) { done("missing-file"); continue; }
        const interp = [{ rule: "plain", c: rlv(o.target) }];
        const dRule = dialectDecl.find(r => src === r.subtree || src.startsWith(r.subtree + "/"));
        if (dRule) interp.push({ rule: dRule.id, c: rlv(dRule.base + "/" + o.target) });
        rec.interpretations = interp.map(i => ({ rule: i.rule, candidate: i.c === "?" ? "__AMBIG__" : i.c })); // settled record schema parity
        const uniq = [...new Set(interp.map(i => i.c).filter(c => c && c !== "?"))];
        if (interp.some(i => i.c === "?") || uniq.length > 1) { done("ambiguous"); continue; }
        if (!uniq.length) { done("missing-file"); continue; }
        const tgt = uniq[0]; rec.canonical_target = tgt;
        rec.rule_id = (interp.find(i => i.c === tgt) || {}).rule || null;
        if (!tgt.endsWith(".md")) { done("resolved-nonmarkdown"); continue; }
        if (o.fragment) { const fx = fragIdx(tgt);
          if (o.fragment.startsWith("^")) done(fx.b.has(o.fragment.slice(1)) ? "resolved-block" : "missing-block");
          else done(fx.h.has(o.fragment) ? "resolved-heading" : "missing-heading");
        } else done("resolved-file");
      }
    }
    if (Object.values(occ).reduce((a, b) => a + b, 0) !== occTotal)
      F("link-occurrence-closure", "occurrence-closure-broken", "(scope)", `occurrence class sums do not equal observed occurrences (${occTotal})`);
  }

  // ---------- envelope ----------
  const checksRun = ["owner-declaration", "reciprocal-spine", "address-form", "meta-container", "archive-consistency", "case-fold-collisions", "exclusion-integrity",
    ...(mode === "FULL" ? ["link-contract-grammar", "link-occurrence-closure"] : [])];
  const verdict = findings.length === 0
    ? `clean for checks [${checksRun.join(", ")}] over walker inventory (${files.length} files, ${skipped.length} skipped boundaries), mode ${mode}; not checked: ${NOT_CHECKED.length} classes — NOT an unqualified all-clear`
    : `${findings.length} finding(s) across ${new Set(findings.map(f => f.check)).size} check(s), mode ${mode}; not checked: ${NOT_CHECKED.length} classes`;
  const env = { schema_version: 1, kernel_version: KV, kernel_source: KERNEL_SOURCE, target: norm(relative(scopeRoot, target)) || ".", scope: scopeRoot, mode, discovery,
    inventory: { source: "walker", complete: skipped.length === 0, scanned: files.length, markdown_members: mdFiles.length, skipped_boundaries: skipped },
    checks: checksRun, not_checked: NOT_CHECKED, exclusions_honored: exclusions, managed_declared: managedPaths,
    resolution: mode === "FULL" ? { pinned_to: { resolution_inventory_fingerprint: resInvFp, contract_fingerprint: contractFingerprint, governed_boundary_target_fingerprint: gbtFp },
      occurrence_classes: occ, observed_occurrences: occTotal, records: resolutionRecords,
      dialect_rules: dialectDecl, governed_boundary_targets: gbt,
      reparse_proof: "scope root, contract path, governed targets, and dialect subtree/base roots verified by native-realpath identity + lstat; inventory entries by per-entry lstat symlink refusal (any skipped boundary is typed check-incomplete, never clean); reparse forms invisible to both are a NAMED runtime-observation limit, not proven absent" } : null,
    findings, verdict };
  if (wantJson) emit(env, findings.length ? 1 : 0);
  const lines = [`map-check — ${verdict}`, `scope: ${env.scope}  root-map: ${rootMapRel}  discovery: ${discovery}`];
  for (const f of findings) lines.push(`  [${f.check}] ${f.class}  ${f.path}  — ${f.evidence}`);
  if (skipped.length) lines.push(`  skipped boundaries: ${skipped.join(" · ")}`);
  lines.push(`  not checked (${NOT_CHECKED.length}): ${NOT_CHECKED.map(n => n.split(" (")[0]).join(" · ")}`);
  emit(lines.join("\n"), findings.length ? 1 : 0);
}

try { main(); } catch (err) {
  const env = { schema_version: 1, kernel_version: KV, kernel_source: KERNEL_SOURCE, error: { code: "unexpected-operational-error", message: String(err && err.message || err), remedy: "report with the target path; the checker wrote nothing" } };
  console.log(wantJson ? JSON.stringify(env, null, 2) : `map-check ERROR [unexpected-operational-error] ${env.error.message}`);
  process.exit(2);
}
