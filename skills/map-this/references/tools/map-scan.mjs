#!/usr/bin/env node
// map-scan.mjs — the Map Your Knowledge (MYK) deterministic pre-assessment scanner.
// Read-only forever. Observations and CANDIDATES only — no signal here classifies,
// excludes, or mutates anything; every candidate carries its deterministic rule.
// kernel-version pin: MYK v2.3 f2f96f2de49b4863bca55ee8f6004d24e00574a7db5e7e5ef0e3cb28c42510cf
// Usage: map-scan.mjs <target-path> [--json] [--max-files N] [--max-ms N]
// Scan status drives everything: COMPLETE (exit 0) | PARTIAL caps hit | BOUNDED
// (boundaries/unreadables present) — PARTIAL/BOUNDED exit 1, never claim complete.
import { readFileSync, readdirSync, lstatSync, existsSync, realpathSync } from "node:fs";
import { join, relative, basename, resolve, sep } from "node:path";
import { createHash } from "node:crypto";

const KV = "MYK v2.3 f2f96f2de49b4863bca55ee8f6004d24e00574a7db5e7e5ef0e3cb28c42510cf";
const wantJson = process.argv.includes("--json");
// Exclusions are CALLER POLICY, never scanner policy: repeatable --exclude <name>
// overrides the caller-default set. Every excluded tree is exactly enumerated below —
// nothing leaves the ledger silently.
const EXCLUDES = [];
{ let i; while ((i = process.argv.indexOf("--exclude")) >= 0) { if (process.argv[i + 1]) EXCLUDES.push(process.argv[i + 1]); process.argv.splice(i, 2); } }
const EXCLUDE_SOURCE = EXCLUDES.length ? "caller-supplied (--exclude)" : "caller-default set (.git .obsidian .lyt .myk) — override with --exclude";
if (!EXCLUDES.length) EXCLUDES.push(".git", ".obsidian", ".lyt", ".myk");
const EXCLUDE_SET = new Set(EXCLUDES);
const argN = (flag, dflt) => { const i = process.argv.indexOf(flag); return i >= 0 ? Number(process.argv[i + 1]) || dflt : dflt; };
const MAX_FILES = argN("--max-files", 20000);
const MAX_MS = argN("--max-ms", 60000);
const T0 = Date.now();
const overTime = () => Date.now() - T0 > MAX_MS;

function fail(msg) {
  const env = { schema_version: 1, kernel_version: KV, error: { code: "scan-error", message: msg } };
  console.log(wantJson ? JSON.stringify(env, null, 2) : `map-scan ERROR ${msg}`);
  process.exit(2);
}

try {
  const argv = process.argv.slice(2).filter(a => !a.startsWith("--") && a !== String(MAX_FILES) && a !== String(MAX_MS));
  if (!argv[0]) fail("usage: map-scan.mjs <target-path> [--json] [--max-files N] [--max-ms N]");
  const root = resolve(argv[0]);
  if (!existsSync(root)) fail(`target does not exist: ${root}`);
  const norm = p => p.split(sep).join("/");
  // native-realpath identity (final repair 4): root divergence = reparse in the chain
  const pathEq = (a, b) => a.split(sep).join("/").toLowerCase() === b.split(sep).join("/").toLowerCase();
  let rootReal; try { rootReal = realpathSync.native(root); } catch { rootReal = null; }
  if (rootReal === null || !pathEq(rootReal, root)) fail("check-incomplete: scan root diverges from its native realpath — reparse point in the chain; safety cannot be established");
  const safeLstat = p => { try { return lstatSync(p); } catch { return null; } };
  const safeRead = p => { try { return readFileSync(p, "utf8"); } catch { return null; } };

  // ---------- 1. inventory walk (bounded, boundary-honest, no silent omissions) ----------
  // Tool-owned trees are DECLARED outside inventory, each with a visible manifest entry:
  //   .git/.obsidian/.lyt — root recorded, not expanded (tool-owned, huge, never vault content)
  //   .myk                — governance tree: every member file listed exactly
  const files = [], dirs = [], skipped = [], systemExcluded = [];
  let partial = false, omittedLowerBound = 0, excludedLeafTotal = 0;
  // Excluded trees are enumerated with the SAME bounded, unreadable, and boundary
  // accounting as inventory — an exclusion manifest can be truncated (→ PARTIAL) or
  // carry boundaries/unreadables (→ BOUNDED), but it can never be silently short.
  function enumerateExcluded(dir, relBase, acc) {
    if (excludedLeafTotal + files.length >= MAX_FILES || overTime()) { acc.truncated = true; return; }
    let names; try { names = readdirSync(dir).sort(); } catch { acc.unreadable.push(relBase + "/ (readdir failed)"); return; }
    for (const n of names) {
      if (excludedLeafTotal + files.length >= MAX_FILES || overTime()) { acc.truncated = true; return; }
      const full = join(dir, n), r2 = relBase + "/" + n;
      const st = safeLstat(full);
      if (!st) { acc.unreadable.push(r2 + " (lstat failed)"); continue; }
      if (st.isSymbolicLink()) { acc.boundaries.push(r2 + " (link/junction)"); continue; }
      if (st.isDirectory()) enumerateExcluded(full, r2, acc);
      else { acc.members.push(r2); excludedLeafTotal++; }
    }
  }
  (function walk(dir) {
    if (partial) return;
    let names; try { names = readdirSync(dir).sort(); } catch { skipped.push(norm(relative(root, dir)) + "/ (unreadable)"); return; }
    for (const name of names) {
      if (files.length >= MAX_FILES || overTime()) { partial = true; omittedLowerBound++; continue; }
      const full = join(dir, name);
      const rel = norm(relative(root, full));
      const st = safeLstat(full);
      if (!st) { skipped.push(rel + " (lstat failed)"); continue; }
      if (st.isDirectory()) {
        if (st.isSymbolicLink()) { skipped.push(rel + " (link/junction — boundary, not traversed)"); continue; }
        if (EXCLUDE_SET.has(name)) {
          const acc = { path: rel + "/", policy: EXCLUDE_SOURCE, members: [], boundaries: [], unreadable: [], truncated: false };
          enumerateExcluded(full, rel, acc);
          acc.member_count = acc.members.length;
          systemExcluded.push(acc); continue;
        }
        dirs.push(rel); walk(full); continue;
      }
      if (st.isSymbolicLink()) { skipped.push(rel + " (link/junction — boundary)"); continue; }
      files.push({ rel, size: st.size, mtime: st.mtimeMs, ext: (name.match(/\.[^.]+$/) || [""])[0].toLowerCase() });
    }
  })(root);
  const exclusionTruncated = systemExcluded.some(e => e.truncated);
  const exclusionTrouble = systemExcluded.some(e => e.unreadable.length || e.boundaries.length);
  if (exclusionTruncated) partial = true;
  // membership fingerprint = paths+sizes+mtimes over ALL walked files. NOT a byte-content
  // proof — apply-time drift claims require preimage hashes (map-this Phase 5).
  const membershipFingerprint = createHash("sha256").update(files.map(f => `${f.rel}:${f.size}:${f.mtime}`).join("\n")).digest("hex");

  // ---------- 2. per-subtree denominators ----------
  const subtree = new Map();
  const bump = (key, f) => { const s = subtree.get(key) || { md: 0, nonmd: 0, bytes: 0 };
    if (f.ext === ".md") s.md++; else s.nonmd++; s.bytes += f.size; subtree.set(key, s); };
  for (const f of files) bump(f.rel.includes("/") ? f.rel.split("/")[0] + "/" : "(root)", f);

  // ---------- 2b. scope contract (GRAMMAR-STRICT per the v2.4 link-resolution rider §A) ----------
  // Machine declarations live ONLY in frontmatter under myk.m1.link-dialects /
  // myk.m1.accepted-links at EXACT indentation, double-quoted JSON strings, spaces only.
  // Everything else fails closed into dialect_errors — never a permissive guess.
  let declaredRoot = null, contractSource = null, contractFingerprint = null;
  const dialectRules = [], dialectErrors = [], acceptedLinks = [];
  const m3Exclusions = [], m3ManagedBodyOwned = [];
  const validLocator = s => {
    if (!s || s.startsWith("/") || s.includes("\\") || s.includes(String.fromCharCode(0)) || /^[A-Za-z]:/.test(s) || /^[a-z][a-z0-9+.-]*:/i.test(s)) return false;
    const segs = s.split("/"); return segs.every(x => x !== "" && x !== "." && x !== "..");
  };
  const jstr = raw => { // exactly one double-quoted JSON string, nothing else
    const m = raw.match(/^"((?:[^"\\]|\\.)*)"$/); if (!m) return null;
    try { return JSON.parse(raw); } catch { return null; }
  };
  {
    for (const cand of ["README.md", "scope.md"]) {
      const c = join(root, ".myk", cand);
      if (!existsSync(c)) continue;
      for (const p of [join(root, ".myk"), c]) { const stc = safeLstat(p); if (stc && stc.isSymbolicLink()) fail("check-incomplete: contract declaration chain traverses a reparse point — safety cannot be established"); }
      { let cReal = null; try { cReal = realpathSync.native(c); } catch { cReal = null; }
        if (cReal === null || !pathEq(cReal, c)) fail("check-incomplete: contract path diverges from its native realpath — reparse point; safety cannot be established"); }
      let buf; try { buf = readFileSync(c); } catch { buf = null; }
      if (buf) {
        contractFingerprint = createHash("sha256").update(buf).digest("hex");
        let t0 = buf.toString("utf8");
        if (!Buffer.from(t0, "utf8").equals(buf)) dialectErrors.push({ rule: "(contract)", error: "malformed-contract: invalid UTF-8" });
        if (t0.charCodeAt(0) === 0xFEFF) { dialectErrors.push({ rule: "(contract)", error: "malformed-contract: BOM present" }); t0 = t0.slice(1); }
        const t = t0.replace(/\r\n/g, "\n");
        const rm = t.match(/root-map:\s*"?([^"\n]+?)"?\s*$/m);
        if (rm) { declaredRoot = norm(rm[1].trim()); contractSource = ".myk/" + cand; }
        let fmc = null;
        if (t.startsWith("---\n")) { const e = t.indexOf("\n---", 3);
          if (e > 0) { const after = t.slice(e + 4); if (after === "" || after.startsWith("\n")) fmc = t.slice(4, e + 1);
            else dialectErrors.push({ rule: "(contract)", error: "malformed-contract: frontmatter terminator line is not exactly ---" }); } }
        if (fmc !== null) {
          const lines = fmc.split("\n");
          // strict myk: block extraction
          const mykAt = lines.findIndex(l => l === "myk:");
          if (lines.filter(l => l === "myk:").length > 1) dialectErrors.push({ rule: "(contract)", error: "malformed-contract: duplicate myk: host key" });
          if (mykAt >= 0) {
            const block = [];
            for (let i = mykAt + 1; i < lines.length; i++) { const ln = lines[i]; if (ln.trim() === "" || /^\s/.test(ln)) block.push(ln); else break; }
            if (block.some(l => l.includes("\t"))) dialectErrors.push({ rule: "(contract)", error: "malformed-contract: tab in machine block" });
            for (const [kk, pat] of [["m1:", "  m1:"], ["link-dialects:", "    link-dialects:"], ["accepted-links:", "    accepted-links:"]])
              if (block.filter(l => l === pat).length > 1) dialectErrors.push({ rule: "(contract)", error: `malformed-contract: duplicate host key ${kk}` });
            const m1At = block.findIndex(l => l === "  m1:");
            if (m1At >= 0) {
              const parseStrict = (marker, firstKey, contOrder) => {
                const out = []; const at = block.findIndex(l => l === "    " + marker + ":");
                if (at < 0) return out;
                let i = at + 1;
                while (i < block.length) {
                  const ln = block[i];
                  const im = ln.match(new RegExp("^      - " + firstKey + ": (.+)$"));
                  if (!im) { if (/^      - /.test(ln)) { dialectErrors.push({ rule: marker, error: `malformed-contract: item must start with '- ${firstKey}: "…"': ${ln.trim().slice(0, 60)}` }); i++; while (i < block.length && /^        /.test(block[i])) i++; continue; } break; }
                  const item = {}; const v0 = jstr(im[1].trim());
                  if (v0 === null) { dialectErrors.push({ rule: marker, error: `malformed-contract: ${firstKey} not a double-quoted JSON string` }); }
                  else item[firstKey] = v0;
                  i++;
                  let lastOrd = -1;
                  while (i < block.length && /^        [a-z-]+: /.test(block[i])) {
                    const km = block[i].match(/^        ([a-z-]+): (.+)$/);
                    const key = km[1], vv = jstr(km[2].trim());
                    const ordIdx = contOrder.indexOf(key);
                    const who = item.id || item.target || marker;
                    if (ordIdx < 0) dialectErrors.push({ rule: who, error: `malformed-contract: unknown key ${key}` });
                    else if (vv === null) dialectErrors.push({ rule: who, error: `malformed-contract: ${key} not a double-quoted JSON string` });
                    else {
                      // exact relative order enforced for BOTH lists; optional keys may be
                      // absent but never out of sequence
                      if (ordIdx < lastOrd) dialectErrors.push({ rule: who, error: `malformed-contract: continuation keys out of exact order (${key})` });
                      if (key in item) dialectErrors.push({ rule: who, error: `malformed-contract: duplicate key ${key}` });
                      lastOrd = Math.max(lastOrd, ordIdx);
                      item[key] = vv;
                    }
                    i++;
                  }
                  out.push(item);
                }
                return out;
              };
              for (const d of parseStrict("link-dialects", "id", ["subtree", "kind", "base"])) {
                if (!d.id || !d.subtree || !d.kind || !d.base) { dialectErrors.push({ rule: d.id || "(unnamed)", error: "missing required field (id, subtree, kind, base)" }); continue; }
                if (!/^[a-z][a-z0-9-]{0,63}$/.test(d.id) || dialectRules.some(r => r.id === d.id)) { dialectErrors.push({ rule: d.id, error: "invalid or duplicate id" }); continue; }
                if (d.kind !== "corpus-root-relative") { dialectErrors.push({ rule: d.id, error: `unknown dialect kind: ${d.kind}` }); continue; }
                if (!validLocator(d.subtree) || !validLocator(d.base)) { dialectErrors.push({ rule: d.id, error: "subtree/base violates the locator grammar (containment, segments, no schemes/backslashes)" }); continue; }
                // Handler-authorized alignment (2026-08-02): identical fail-closed
                // identity checks to map-check — locators must exist, be reparse-free,
                // and match their native realpaths.
                let locBad = false;
                for (const loc of [norm(d.subtree).replace(/\/$/, ""), norm(d.base).replace(/\/$/, "")]) {
                  const fpL = join(root, loc); const stL = safeLstat(fpL);
                  if (!stL) { dialectErrors.push({ rule: d.id, error: `malformed-contract: declared locator ${loc} does not exist or is unreadable — fail-closed` }); locBad = true; break; }
                  if (stL.isSymbolicLink()) { dialectErrors.push({ rule: d.id, error: `malformed-contract: ${loc} is a reparse point — refused` }); locBad = true; break; }
                  let rL = null; try { rL = realpathSync.native(fpL); } catch { }
                  if (rL === null || !pathEq(rL, fpL)) { dialectErrors.push({ rule: d.id, error: `malformed-contract: ${loc} diverges from its native realpath — refused` }); locBad = true; break; }
                }
                if (locBad) continue;
                const sub = norm(d.subtree).replace(/\/$/, "");
                if (dialectRules.some(r => r.subtree === sub || r.subtree.toLowerCase() === sub.toLowerCase())) { dialectErrors.push({ rule: d.id, error: `duplicate or case-fold-colliding subtree: ${d.subtree}` }); continue; }
                dialectRules.push({ id: d.id, subtree: sub, kind: d.kind, base: norm(d.base).replace(/\/$/, "") });
              }
              dialectRules.sort((a, b) => b.subtree.length - a.subtree.length || (a.subtree < b.subtree ? -1 : 1));
              const seenAcc = new Set();
              for (const a of parseStrict("accepted-links", "target", ["source", "class", "reason"])) {
                if (!a.target || !a.class || !a.reason || !["accepted-external", "accepted-unresolved"].includes(a.class)) { dialectErrors.push({ rule: "accepted-links", error: `invalid acceptance entry (target/class/reason required): ${(a.target || "?").slice(0, 60)}` }); continue; }
                if (a.source && !validLocator(a.source)) { dialectErrors.push({ rule: "accepted-links", error: `source violates locator grammar: ${a.source}` }); continue; }
                const k = JSON.stringify([a.source || null, a.target]);
                if (seenAcc.has(k)) { dialectErrors.push({ rule: "accepted-links", error: `duplicate (source,target): ${a.target}` }); continue; }
                seenAcc.add(k);
                acceptedLinks.push({ target: a.target, source: a.source || null, class: a.class, reason: a.reason });
              }
            }
          }
          // M3 exclusions + managed artifacts (existing contract style under meta.m1 — read for the
          // canonical resolution inventory per rider §B; declaration shape conformance stays map-check's)
          let inSec = null, cur = null;
          for (const ln of lines) {
            const sec = ln.match(/^\s{4}(exclusions|managed-artifacts):\s*$/);
            if (sec) { inSec = sec[1]; cur = null; continue; }
            if (/^\s{2}[a-z-]+:/.test(ln) || /^[a-z-]+:/.test(ln)) { inSec = null; cur = null; continue; }
            if (!inSec) continue;
            const item = ln.match(/^\s+-\s+path:\s*"?([^"\n]+?)"?\s*$/);
            if (item) { cur = { path: norm(item[1].trim()), surfaces: "" }; (inSec === "exclusions" ? m3Exclusions : m3ManagedBodyOwned).push(cur); continue; }
            if (cur) { const kv = ln.match(/^\s+([a-z-]+):\s*"?([^"\n]*?)"?\s*$/);
              if (kv) { if (kv[1] === "owned-surfaces") cur.surfaces = kv[2];
                else if (kv[1] === "graph-entry") cur.graphEntry = kv[2].trim();
                else if (kv[1] === "entrypoint") cur.entrypoint = norm(kv[2].trim()); } }
          }
        }
      }
      break;
    }
  }
  // M3 fields that DETERMINE canonical inventory fail closed (final repair 3):
  // an invalid exclusion path or a broken single-entrypoint declaration is a
  // contract error, never a silent drop.
  for (const e of m3Exclusions) {
    if (!validLocator(e.path)) { dialectErrors.push({ rule: "m3-exclusion " + (e.path || "(empty)"), error: "malformed-contract: exclusion path violates the locator grammar" }); continue; }
    if (e.graphEntry === "single-entrypoint") {
      if (!e.entrypoint) dialectErrors.push({ rule: "m3-exclusion " + e.path, error: "malformed-contract: single-entrypoint declaration lacks an entrypoint" });
      else if (validLocator(e.entrypoint) && !existsSync(join(root, e.entrypoint))) dialectErrors.push({ rule: "m3-exclusion " + e.path, error: "malformed-contract: declared entrypoint does not exist" });
    }
  }
  const m3ExclPaths = m3Exclusions.map(e => e.path).filter(p => validLocator(p));
  // managed entries whose owned surfaces include body or whole-file: their OUTBOUND links are not parsed
  const managedBodyOwned = new Set(m3ManagedBodyOwned.filter(e => /body|whole-file/.test(e.surfaces)).map(e => e.path));
  const isManagedBodyOwned = rel => [...managedBodyOwned].some(p => rel === p || rel.startsWith(p.replace(/\/$/, "") + "/"));
  // GOVERNED BOUNDARY TARGETS (checker repair 1 + rider amendment 1): an M3
  // single-entrypoint exclusion's declared entrypoint stays a RESOLVABLE target while
  // its subtree stays governed non-assessment. Reparse entrypoints are refused.
  const governedBoundaryTargets = [];
  for (const e of m3Exclusions) {
    if (e.graphEntry !== "single-entrypoint" || !e.entrypoint) continue;
    if (!validLocator(e.entrypoint)) { dialectErrors.push({ rule: "m3-exclusion " + e.path, error: "malformed-contract: entrypoint violates the locator grammar" }); continue; }
    const fullE = join(root, e.entrypoint);
    const stE = safeLstat(fullE);
    if (!stE) continue; // nonexistence already recorded as a contract error above
    if (stE.isSymbolicLink()) { dialectErrors.push({ rule: "m3-exclusion " + e.path, error: "malformed-contract: entrypoint is a reparse point — refused" }); continue; }
    { let gReal = null; try { gReal = realpathSync.native(fullE); } catch { gReal = null; }
      if (gReal === null || !pathEq(gReal, fullE)) { dialectErrors.push({ rule: "m3-exclusion " + e.path, error: "malformed-contract: entrypoint diverges from its native realpath — reparse refused" }); continue; } }
    governedBoundaryTargets.push(e.entrypoint);
  }
  // FAIL-CLOSED (checker repair 2): any contract error voids ALL parsed declarations —
  // no partial-rule resolution, and the scan can never claim COMPLETE.
  const contractInvalid = dialectErrors.length > 0;
  if (contractInvalid) { dialectRules.length = 0; acceptedLinks.length = 0; governedBoundaryTargets.length = 0; }

  // ---------- 2c. CANONICAL RESOLUTION INVENTORY (rider §B) ----------
  // M3 exclusions are governed non-assessment: OUT of the resolution inventory, IN the
  // inventory_boundaries ledger. The resolution fingerprint covers assessed leaves only.
  const isM3Excluded = rel => m3ExclPaths.some(e => rel === e || rel.startsWith(e.replace(/\/$/, "") + "/"));
  const invFiles = files.filter(f => !isM3Excluded(f.rel));
  const m3ExcludedLedger = files.filter(f => isM3Excluded(f.rel)).map(f => f.rel);
  const md = invFiles.filter(f => f.ext === ".md");
  const gbSet = new Set(governedBoundaryTargets);
  const gbFiles = files.filter(f => gbSet.has(f.rel));
  const targetFiles = invFiles.concat(gbFiles);
  const mdTargets = md.concat(gbFiles.filter(f => f.ext === ".md"));
  const NSEP = String.fromCharCode(0);
  const resolutionInventoryFingerprint = createHash("sha256")
    .update(invFiles.slice().sort((a, b) => a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0)
      .map(f => f.rel + NSEP + f.size + NSEP + Math.round(f.mtime)).map(l => l + "\n").join("")).digest("hex"); // ordinal path sort per rider §B
  // governed targets shape resolution — they get their own comparison fingerprint (final repair 1)
  const governedBoundaryTargetFingerprint = createHash("sha256")
    .update(gbFiles.slice().sort((a, b) => a.rel < b.rel ? -1 : 1).map(f => f.rel + NSEP + f.size + NSEP + Math.round(f.mtime)).map(l => l + "\n").join("")).digest("hex");

  // ---------- 3. markdown parse: frontmatter, ownership, tags, links (wikilink + relative md) ----------
  const meta = new Map(), rawLinks = new Map(), tagsOf = new Map(), fmErrors = [];
  const headingsOf = new Map(), blocksOf = new Map();
  const mdHash = createHash("sha256"); const HSEP = Buffer.from([0]);
  const relDir = r => r.includes("/") ? r.slice(0, r.lastIndexOf("/")) : "";
  const joinRel = (dir, t) => { const parts = (dir ? dir.split("/") : []); for (const seg of norm(t).split("/")) {
      if (seg === "" || seg === ".") continue; if (seg === "..") { if (!parts.length) return null; parts.pop(); } else parts.push(seg); }
    return parts.join("/"); };
  for (const f of md) {
    const t = safeRead(join(root, f.rel));
    if (t === null) { skipped.push(f.rel + " (unreadable)"); continue; }
    mdHash.update(f.rel).update(HSEP).update(t).update(HSEP);
    let fm = null, body = t;
    if (t.startsWith("---")) { const e = t.indexOf("\n---", 3); if (e > 0) { fm = t.slice(3, e); body = t.slice(e + 4); } else fmErrors.push({ path: f.rel, error: "unterminated frontmatter" }); }
    let map = null, legacyParent = false;
    if (fm) {
      const inline = fm.match(/^meta:\s*\{([\s\S]*?)\}\s*$/m);
      let mb = inline ? inline[1] : null, nested = false;
      if (mb === null && /^meta:\s*$/m.test(fm)) { const L = fm.split("\n"); const at = L.findIndex(l => /^meta:\s*$/.test(l)); const b = [];
        for (let j = at + 1; j < L.length && /^\s+\S/.test(L[j]); j++) b.push(L[j]); if (b.length) { mb = b.join("\n"); nested = true; } }
      if (mb !== null) { const mm = mb.match(nested ? /^\s+map:\s*"?\[\[([^\]]+)\]\]"?\s*$/m : /(?:^|[,{\s])map:\s*"\[\[([^\]]+)\]\]"/);
        map = mm ? mm[1].trim() : null;
        legacyParent = (nested ? /^\s+parent:/m : /(?:^|[,{\s])parent:/).test(mb); }
      const tg = fm.match(/^tags:\s*\[([^\]]*)\]/m);
      tagsOf.set(f.rel, tg ? tg[1].split(",").map(s => s.trim().replace(/["']/g, "")).filter(Boolean) : []);
    } else tagsOf.set(f.rel, []);
    meta.set(f.rel, { map, legacyParent, hasFm: fm !== null });
    // headings + block ids for fragment-level resolution
    const hs = new Set(); for (const hm of body.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) hs.add(hm[1].trim());
    headingsOf.set(f.rel, hs);
    const bs = new Set(); for (const bm of body.matchAll(/\^([A-Za-z0-9-]+)\s*$/gm)) bs.add(bm[1]);
    blocksOf.set(f.rel, bs);
    const out = [];
    const wre = /\[\[([^\]|#]+)(#[^\]|]*)?(?:\|[^\]]*)?\]\]/g; let m;
    while ((m = wre.exec(body))) out.push({ form: "wiki", target: norm(m[1].trim()).replace(/[\\/]+$/, ""), fragment: m[2] ? m[2].slice(1).trim() : null, raw: m[0].slice(0, 120) });
    const mre = /\[[^\]]*\]\(([^)#\s]+)(#[^)]*)?\)/g;
    while ((m = mre.exec(body))) { const t2 = m[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(t2) || t2.startsWith("/")) continue; // external or absolute — not scope edges
      const j = joinRel(relDir(f.rel), decodeURIComponent(t2));
      out.push({ form: "mdrel", target: j === null ? "__ESCAPES__/" + t2 : j, fragment: m[2] ? decodeURIComponent(m[2].slice(1)).trim() : null, raw: m[0].slice(0, 120) }); }
    // managed artifacts with body/whole-file owned surfaces: outbound links are NOT
    // parsed (rider §B) — the artifact remains a resolution TARGET via map-side coverage
    rawLinks.set(f.rel, isManagedBodyOwned(f.rel) ? [] : out);
  }
  // governed boundary targets: read ONLY for fragment indexes (resolution needs their
  // headings/blocks); reading one entrypoint file is not assessment of its subtree
  for (const f of gbFiles) {
    if (f.ext !== ".md" || headingsOf.has(f.rel)) continue;
    const t = safeRead(join(root, f.rel)); if (t === null) continue;
    const body = t.startsWith("---") ? (() => { const e = t.indexOf("\n---", 3); return e > 0 ? t.slice(e + 4) : t; })() : t;
    const hs = new Set(); for (const hm of body.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) hs.add(hm[1].trim()); headingsOf.set(f.rel, hs);
    const bs = new Set(); for (const bm of body.matchAll(/\^([A-Za-z0-9-]+)\s*$/gm)) bs.add(bm[1]); blocksOf.set(f.rel, bs);
  }
  const mdContentFingerprint = mdHash.digest("hex");

  // ---------- 4. link resolution + DEDUPLICATED graph ----------
  const stem = p => basename(p).replace(/\.md$/, "");
  // resolution TARGETS = canonical inventory + governed boundary targets (rider amend. 1)
  const byStem = new Map(); for (const f of mdTargets) { const s = stem(f.rel); if (!byStem.has(s)) byStem.set(s, []); byStem.get(s).push(f.rel); }
  const mdSet = new Set(mdTargets.map(f => f.rel));
  const resolveTarget = t => {
    if (mdSet.has(t + ".md")) return t + ".md";
    if (mdSet.has(t)) return t;
    const suf = mdTargets.filter(f => { const fx = f.rel.replace(/\.md$/, ""); return t.endsWith("/" + fx); }).map(f => f.rel);
    if (suf.length === 1) return suf[0];
    if (suf.length > 1) { const mx = Math.max(...suf.map(x => x.length)); const best = suf.filter(x => x.length === mx); return best.length === 1 ? best[0] : "__AMBIG__"; }
    if (!t.includes("/")) { const c = byStem.get(t) || []; return c.length === 1 ? c[0] : c.length > 1 ? "__AMBIG__" : null; }
    return null;
  };
  // full-inventory resolution for extension-bearing non-markdown targets
  const allSet = new Set(targetFiles.map(f => f.rel));
  const byBase = new Map(); for (const f of targetFiles) { const b = basename(f.rel); if (!byBase.has(b)) byBase.set(b, []); byBase.get(b).push(f.rel); }
  const resolveNonMd = t => {
    if (allSet.has(t)) return t;
    const suf = targetFiles.filter(f => t.endsWith("/" + f.rel) || f.rel.endsWith("/" + t)).map(f => f.rel);
    if (suf.length === 1) return suf[0];
    if (suf.length > 1) return "__AMBIG__";
    if (!t.includes("/")) { const c = byBase.get(t) || []; return c.length === 1 ? c[0] : c.length > 1 ? "__AMBIG__" : null; }
    return null;
  };

  // ---------- 4b. occurrence-level resolution engine (all-interpretations convergence) ----------
  // Every occurrence lands in exactly ONE terminal class; graph edges are derived only
  // after occurrence-level closure. Dialect rules apply where the SOURCE lives inside
  // the rule's subtree; resolution succeeds only when all applicable interpretations
  // CONVERGE on one canonical target.
  const SEP = String.fromCharCode(0);
  // ELEVEN terminal occurrence classes (rider §C). creation_queue and
  // inventory_boundaries are separate LEDGERS, never occurrence classes.
  const OCC = { "resolved-file": 0, "resolved-heading": 0, "resolved-block": 0, "resolved-nonmarkdown": 0,
    "missing-file": 0, "missing-heading": 0, "missing-block": 0, "ambiguous": 0,
    "accepted-external": 0, "accepted-unresolved": 0, "residual-at-cap": 0 };
  const caseFiles = []; // UNCAPPED (checker repair 4): one case record per non-resolved occurrence, always
  const records = []; // normalized per-occurrence records (rider §D) — comparison surface for the independent checker
  const missingNameCount = new Map(); // raw missing target -> inbound count (red-link/creation-queue ranking)
  const edgeSet = new Set();
  let linkOccurrences = 0, escaping = 0, occResidual = false;
  const acceptMatch = (src, target) => acceptedLinks.find(a => a.target === target && (!a.source || a.source === src));
  const classify = (src, cls, o, extra) => {
    OCC[cls]++;
    records.push({ source: src, raw_target: o.target.startsWith("__ESCAPES__/") ? "(escapes scope root)" : o.target, fragment: o.fragment || null, form: o.form, class: cls,
      canonical_target: (extra && extra.canonical_target) || null, rule_id: (extra && extra.rule_id) || null,
      interpretations: (extra && extra.interpretations) || null });
    if (!cls.startsWith("resolved"))
      caseFiles.push({ source: src, raw_target: o.target, fragment: o.fragment, form: o.form, class: cls, ...extra });
  };
  for (const [src, outs] of rawLinks) {
    for (const o of outs) {
      linkOccurrences++;
      if (occResidual || (linkOccurrences % 500 === 0 && overTime())) { occResidual = true;
        classify(src, "residual-at-cap", o, { note: "occurrence not resolved — time cap reached during resolution", cap_ms: MAX_MS }); continue; }
      const t = o.target;
      if (t.startsWith("__ESCAPES__/")) { escaping++; classify(src, "missing-file", o, { note: "relative link escapes the scope root" }); continue; }
      const acc = acceptMatch(src, t);
      if (acc) { classify(src, acc.class, o, { reason: acc.reason }); continue; }
      if (/^[a-z][a-z0-9+.-]*:/i.test(t)) { classify(src, "missing-file", o, { note: "scheme-bearing wikilink (cross-vault form — kernel 12b); declare accepted-external to suppress" }); continue; }
      // interpretations: plain + every dialect rule whose subtree contains the source
      const interpretations = [{ rule: "plain", candidate: null }];
      const hasNonMdExt = /\.[A-Za-z0-9]+$/.test(t) && !t.endsWith(".md");
      interpretations[0].candidate = hasNonMdExt ? resolveNonMd(t) : resolveTarget(t);
      for (const r of dialectRules) if (src === r.subtree || src.startsWith(r.subtree + "/")) {
        const prefixed = r.base + "/" + t;
        interpretations.push({ rule: r.id, candidate: hasNonMdExt ? resolveNonMd(prefixed) : resolveTarget(prefixed) });
        break; // longest-exact-subtree wins: only the first (longest) applicable rule joins the plain interpretation
      }
      const anyAmbig = interpretations.some(i => i.candidate === "__AMBIG__");
      const targets = [...new Set(interpretations.map(i => i.candidate).filter(c => c && c !== "__AMBIG__"))];
      if (anyAmbig || targets.length > 1) { classify(src, "ambiguous", o, { interpretations }); continue; }
      if (targets.length === 0) {
        missingNameCount.set(t, (missingNameCount.get(t) || 0) + 1);
        classify(src, "missing-file", o, { interpretations }); continue;
      }
      const tgt = targets[0];
      const winner = interpretations.find(i => i.candidate === tgt);
      const prov = { canonical_target: tgt, rule_id: winner ? winner.rule : null, interpretations };
      if (!tgt.endsWith(".md")) { classify(src, "resolved-nonmarkdown", o, prov); continue; }
      if (o.fragment) {
        if (o.fragment.startsWith("^")) {
          if ((blocksOf.get(tgt) || new Set()).has(o.fragment.slice(1))) classify(src, "resolved-block", o, prov);
          else { classify(src, "missing-block", o, prov); if (tgt !== src) edgeSet.add(src + SEP + tgt); continue; }
        } else {
          if ((headingsOf.get(tgt) || new Set()).has(o.fragment)) classify(src, "resolved-heading", o, prov);
          else { classify(src, "missing-heading", o, prov); if (tgt !== src) edgeSet.add(src + SEP + tgt); continue; }
        }
      } else classify(src, "resolved-file", o, prov);
      if (tgt !== src) edgeSet.add(src + SEP + tgt);
    }
  }
  // creation-queue promotion: missing names ranked by observed inbound count (red-link doctrine)
  const creationQueue = [...missingNameCount.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 25)
    .map(([name, n]) => ({ missing_target: name, inbound_occurrences: n, rule: "missing name ranked by inbound count — demand nominates creation; low-count red links are KEPT, not defects" }));
  const edges = [...edgeSet].sort().map(e => e.split(SEP));
  const inDeg = new Map(), outDeg = new Map();
  for (const [a, b] of edges) { outDeg.set(a, (outDeg.get(a) || 0) + 1); inDeg.set(b, (inDeg.get(b) || 0) + 1); }
  let recip = 0; for (const [a, b] of edges) if (edgeSet.has(b + SEP + a)) recip++;

  // ---------- 5. ownership census + upward-chain walk (root-aware, split labels) ----------
  // (declaredRoot/contractSource parsed in section 2b with the dialect declarations)
  const owned = md.filter(f => meta.get(f.rel)?.map).length;
  const chains = { reached_declared_root: 0, terminates_unowned: 0, unowned_self: 0, dangling_owner: [], cycles: [], ambiguous_owner: [], depth_limit_exceeded: [] };
  // Bound = node count + 2: every acyclic chain MUST terminate within it (cycles are
  // caught by the visited set), so depth_limit_exceeded is a defensive terminal that
  // still surfaces rather than vanishing.
  const CHAIN_LIMIT = md.length + 2;
  for (const f of md) {
    const seen = new Set(); let cur = f.rel; let guard = 0; let fate = null;
    while (guard++ < CHAIN_LIMIT) {
      if (declaredRoot && cur === declaredRoot) { fate = "root"; break; }
      const mm = meta.get(cur)?.map;
      if (!mm) { fate = seen.size ? "terminates_unowned" : "unowned_self"; break; }
      const r = resolveTarget(norm(mm));
      if (r === null) { fate = "dangling"; break; }
      if (r === "__AMBIG__") { fate = "ambiguous"; break; }
      if (seen.has(r) || r === cur) { fate = "cycle"; break; }
      seen.add(r); cur = r;
    }
    if (fate === "root") chains.reached_declared_root++;
    else if (fate === "terminates_unowned") chains.terminates_unowned++;
    else if (fate === "unowned_self") chains.unowned_self++;
    else if (fate === "dangling") chains.dangling_owner.push(f.rel);
    else if (fate === "cycle") chains.cycles.push(f.rel);
    else if (fate === "ambiguous") chains.ambiguous_owner.push(f.rel);
    else chains.depth_limit_exceeded.push(f.rel); // defensive terminal — surfaced, never vanished
  }

  // ---------- 6. heavy candidates (BOTH filters, labeled) ----------
  const degs = md.map(f => inDeg.get(f.rel) || 0).sort((a, b) => a - b);
  const q = p => degs.length ? degs[Math.min(degs.length - 1, Math.floor(p * degs.length))] : 0;
  const p95 = q(0.95), q1 = q(0.25), q3 = q(0.75), iqr = q3 - q1;
  const floorH = Math.max(5, Math.ceil(0.01 * md.length));
  const tukey = iqr > 0 ? q3 + 1.5 * iqr : p95;
  const heavy = md.map(f => f.rel).filter(r => { const d = inDeg.get(r) || 0; return (d >= p95 && d >= floorH) || d >= Math.max(tukey, floorH); })
    .sort((a, b) => (inDeg.get(b) || 0) - (inDeg.get(a) || 0) || (a < b ? -1 : 1));
  const inNbrs = new Map(); for (const [a, b] of edges) { if (!inNbrs.has(b)) inNbrs.set(b, []); inNbrs.get(b).push(a); }
  const heavyRoles = heavy.slice(0, 100).map(r => {
    const refs = [...new Set(inNbrs.get(r) || [])]; let inner = 0;
    for (let i = 0; i < refs.length; i++) for (let j = 0; j < refs.length; j++) if (i !== j && edgeSet.has(refs[i] + SEP + refs[j])) inner++;
    const possible = refs.length * (refs.length - 1);
    const cohesion = possible ? inner / possible : 0;
    const od = outDeg.get(r) || 0, idg = inDeg.get(r) || 0;
    const role = cohesion >= 0.15 && od >= 3 ? "sub-map-anchor-candidate" : cohesion < 0.15 && od <= 2 ? "shortcut-candidate" : "mixed";
    return { path: r, in_degree: idg, out_degree: od, referrer_cohesion: +cohesion.toFixed(3), role_candidate: role,
      rule: "cohesion>=0.15 && out>=3 -> anchor | cohesion<0.15 && out<=2 -> shortcut | else mixed (thresholds = calibration defaults)" };
  });
  const hIdx = new Map(heavy.map((h, i) => [h, i])); const parent = heavy.map((_, i) => i);
  const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
  for (const [a, b] of edges) if (hIdx.has(a) && hIdx.has(b)) { const ra = find(hIdx.get(a)), rb = find(hIdx.get(b)); if (ra !== rb) parent[ra] = rb; }
  const comps = new Map(); heavy.forEach((h, i) => { const r = find(i); if (!comps.has(r)) comps.set(r, []); comps.get(r).push(h); });
  const heavyComponents = [...comps.values()].filter(c => c.length >= 2).sort((a, b) => b.length - a.length);

  // ---------- 6b. PageRank (labeled tiebreaker) + articulation points (bridge proxy) ----------
  const nodes = md.map(f => f.rel), nIdx = new Map(nodes.map((n, i) => [n, i]));
  const outAdj = nodes.map(() => []);
  for (const [a, b] of edges) if (nIdx.has(a) && nIdx.has(b)) outAdj[nIdx.get(a)].push(nIdx.get(b));
  const N = nodes.length; let pr = new Float64Array(N).fill(N ? 1 / N : 0);
  const D = 0.85;
  for (let it = 0; it < 100 && N; it++) {
    const next = new Float64Array(N).fill((1 - D) / N);
    let danglingMass = 0;
    for (let i = 0; i < N; i++) { if (!outAdj[i].length) { danglingMass += pr[i]; continue; }
      const share = D * pr[i] / outAdj[i].length; for (const j of outAdj[i]) next[j] += share; }
    const dShare = D * danglingMass / N; for (let i = 0; i < N; i++) next[i] += dShare;
    let l1 = 0; for (let i = 0; i < N; i++) l1 += Math.abs(next[i] - pr[i]);
    pr = next; if (l1 < 1e-6) break;
  }
  const pageRankTop = nodes.map((n, i) => [n, pr[i]]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 20)
    .map(([n, s]) => ({ path: n, score: +s.toFixed(6) }));
  // articulation points — Tarjan, iterative, on the UNDIRECTED deduplicated graph
  const undAdj = nodes.map(() => new Set());
  for (const [a, b] of edges) if (nIdx.has(a) && nIdx.has(b)) { undAdj[nIdx.get(a)].add(nIdx.get(b)); undAdj[nIdx.get(b)].add(nIdx.get(a)); }
  const disc = new Int32Array(N).fill(-1), low = new Int32Array(N), ap = new Set();
  let timer = 0;
  for (let s = 0; s < N; s++) {
    if (disc[s] !== -1) continue;
    const stack = [[s, -1, [...undAdj[s]].sort((a, b) => a - b), 0]]; let rootChildren = 0;
    disc[s] = low[s] = timer++;
    while (stack.length) {
      const top = stack[stack.length - 1]; const [u, parentU, nbrs] = top;
      if (top[3] < nbrs.length) {
        const v = nbrs[top[3]++];
        if (v === parentU) continue;
        if (disc[v] === -1) { disc[v] = low[v] = timer++; if (u === s) rootChildren++; stack.push([v, u, [...undAdj[v]].sort((a, b) => a - b), 0]); }
        else low[u] = Math.min(low[u], disc[v]);
      } else {
        stack.pop();
        if (parentU !== -1) { low[parentU] = Math.min(low[parentU], low[u]); if (parentU !== s && low[u] >= disc[parentU]) ap.add(parentU); }
      }
    }
    if (rootChildren > 1) ap.add(s);
  }
  const bridgeCandidates = [...ap].map(i => nodes[i]).sort().map(p => ({ path: p, in_degree: inDeg.get(p) || 0,
    rule: "articulation point (Tarjan, undirected dedup graph) — removal disconnects a region; deterministic v1 bridge proxy" }));

  // ---------- 7. entry points, tags, filename families, machine trees ----------
  const entryPoints = md.map(f => f.rel).filter(r => /(^|\/)(README|index|(.*-)?map)\.md$/i.test(r)).sort();
  const tagCount = new Map();
  for (const [, ts] of tagsOf) for (const t of ts) tagCount.set(t, (tagCount.get(t) || 0) + 1);
  const topTags = [...tagCount.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 25);
  const namespaced = [...tagCount.keys()].filter(t => t.includes("/")).length;
  const fam = new Map();
  for (const f of files) { const dir = f.rel.includes("/") ? f.rel.slice(0, f.rel.lastIndexOf("/")) : "(root)";
    const m = basename(f.rel).match(/^([A-Za-z]{3,})[-_]/); if (m) { const k = dir + "::" + m[1].toLowerCase(); fam.set(k, (fam.get(k) || 0) + 1); } }
  const familyClusters = [...fam.entries()].filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]).slice(0, 25)
    .map(([k, n]) => ({ dir: k.split("::")[0], prefix: k.split("::")[1], members: n, rule: "shared alpha prefix >=3 chars, >=3 members, same dir" }));
  const machineCandidates = [];
  for (const [dir, s] of subtree) { const ratio = s.md + s.nonmd ? s.nonmd / (s.md + s.nonmd) : 0;
    if (s.nonmd >= 20 && ratio >= 0.8) machineCandidates.push({ dir, nonmd: s.nonmd, md: s.md, rule: "nonmd>=20 && nonmd-ratio>=0.8 (exclusion CANDIDATE only)" }); }
  const dateRuns = new Map();
  for (const f of files) { const dir = f.rel.includes("/") ? f.rel.slice(0, f.rel.lastIndexOf("/")) : "(root)";
    if (/^\d{4}-\d{2}-\d{2}[-_T]/.test(basename(f.rel))) dateRuns.set(dir, (dateRuns.get(dir) || 0) + 1); }
  const inboxCandidates = [...dateRuns.entries()].filter(([, n]) => n >= 5).sort((a, b) => b[1] - a[1])
    .map(([dir, n]) => ({ dir, timestamped_files: n, rule: ">=5 date-stamped filenames in one dir (append-only/inbox CANDIDATE; suggests thread/chain treatment)" }));

  // ---------- 8. hygiene + orphan case files ----------
  const caseFold = [];
  { const byDir = new Map();
    const add = (rel, d) => { const k = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : "."; if (!byDir.has(k)) byDir.set(k, []); byDir.get(k).push(basename(rel) + (d ? "/" : "")); };
    files.forEach(f => add(f.rel, false)); dirs.forEach(d => add(d, true));
    for (const [d, names] of byDir) { const seen = new Map(); for (const n of names) { const k = n.toLowerCase(); if (seen.has(k) && seen.get(k) !== n) caseFold.push({ dir: d, a: seen.get(k), b: n }); seen.set(k, n); } } }
  const dupBase = [...byStem.entries()].filter(([, v]) => v.length > 1).map(([s, v]) => ({ stem: s, paths: v }));
  const longPaths = files.filter(f => (root + "/" + f.rel).length > 240).map(f => f.rel);
  const orphans = md.map(f => f.rel).filter(r => !(meta.get(r)?.map) && !(inDeg.get(r) || 0) && !(outDeg.get(r) || 0) && !entryPoints.includes(r));
  const orphanCases = orphans.slice(0, 50).map(r => {
    const myTags = new Set(tagsOf.get(r) || []); const dir = r.includes("/") ? r.slice(0, r.lastIndexOf("/")) : "(root)";
    const neighbors = md.filter(f => f.rel !== r && f.rel.startsWith(dir === "(root)" ? "" : dir + "/") && meta.get(f.rel)?.map).slice(0, 5).map(f => f.rel);
    const tagAllies = myTags.size ? md.filter(f => f.rel !== r && (tagsOf.get(f.rel) || []).some(t => myTags.has(t))).slice(0, 5).map(f => f.rel) : [];
    return { path: r, folder: dir, tags: [...myTags], nearest_mapped_neighbors: neighbors, tag_allies: tagAllies };
  });

  // ---------- terminal status + envelope ----------
  const scanStatus = partial ? "PARTIAL" : ((skipped.length || exclusionTrouble || contractInvalid) ? "BOUNDED" : "COMPLETE");
  const exitCode = scanStatus === "COMPLETE" ? 0 : 1;
  const env = {
    schema_version: 2, kernel_version: KV, tool: "map-scan v1", target: root,
    scan_status: scanStatus,
    inventory: { membership_fingerprint: membershipFingerprint, md_content_fingerprint: mdContentFingerprint,
      fingerprint_note: "membership = paths+sizes+mtimes (NOT byte proof; preimage hashes govern apply-time drift); md_content = sha256 over ordered markdown bytes",
      complete: scanStatus === "COMPLETE", scan_status: scanStatus, omitted_lower_bound: omittedLowerBound,
      files: files.length, markdown: md.length, non_markdown: files.length - md.length,
      bytes: files.reduce((a, f) => a + f.size, 0), dirs: dirs.length,
      skipped_boundaries: skipped, system_excluded: systemExcluded,
      caps: { max_files: MAX_FILES, max_ms: MAX_MS } },
    subtrees: [...subtree.entries()].sort((a, b) => (b[1].md + b[1].nonmd) - (a[1].md + a[1].nonmd))
      .map(([dir, s]) => ({ dir, md: s.md, non_md: s.nonmd, bytes: s.bytes })),
    entry_point_candidates: entryPoints,
    scope_contract: { detected: !!contractSource, source: contractSource, declared_root_map: declaredRoot,
      contract_fingerprint: contractFingerprint,
      link_dialects: dialectRules, dialect_errors: dialectErrors, accepted_links_declared: acceptedLinks.length },
    resolution: {
      note: "ELEVEN terminal occurrence classes (rider §C); every observed occurrence lands in exactly ONE; creation_queue and inventory_boundaries are separate LEDGERS; graph edges derive only after occurrence closure; dialect rules are contract-declared scope data (grammar-strict, rider §A)",
      pinned_to: { resolution_inventory_fingerprint: resolutionInventoryFingerprint, contract_fingerprint: contractFingerprint,
        governed_boundary_target_fingerprint: governedBoundaryTargetFingerprint, membership_fingerprint: membershipFingerprint },
      reparse_proof: "root, contract path, and governed targets verified by native-realpath identity + lstat; inventory entries by per-entry lstat symlink refusal (junctions surface as symlinks under Node on Windows); reparse forms invisible to both are a NAMED runtime-observation limit, not proven absent",
      occurrence_classes: OCC,
      classes_closed: Object.values(OCC).reduce((a, b) => a + b, 0) === linkOccurrences,
      records,
      case_files: caseFiles, case_file_cap: null,
      contract_invalid_fail_closed: contractInvalid,
      ledgers: {
        creation_queue: creationQueue,
        inventory_boundaries: { m3_excluded: m3ExcludedLedger.slice(0, 200), m3_excluded_count: m3ExcludedLedger.length,
          governed_boundary_targets: governedBoundaryTargets,
          skipped_boundaries: skipped, system_excluded_trees: systemExcluded.length, cap_residual_lower_bound: omittedLowerBound } },
      not_checked: ["Unicode/Obsidian heading slug normalization (exact heading text only in this version)",
        "embed (![[...]]) semantics beyond plain link resolution", "alias semantics beyond declared exact aliases",
        "external content drift (deferred content-integrity track)"] },
    ownership: { owned, unowned: md.length - owned, frontmatter_errors: fmErrors,
      legacy_parent_keys: md.filter(f => meta.get(f.rel)?.legacyParent).map(f => f.rel),
      upward_chains: { no_declared_root: !declaredRoot,
        reached_declared_root: chains.reached_declared_root, terminates_unowned: chains.terminates_unowned,
        unowned_self: chains.unowned_self, dangling_owner: chains.dangling_owner.slice(0, 30),
        cycles: chains.cycles.slice(0, 30), ambiguous_owner: chains.ambiguous_owner.slice(0, 30),
        depth_limit_exceeded: chains.depth_limit_exceeded.slice(0, 30), chain_limit: CHAIN_LIMIT } },
    graph: { link_form_coverage: "wikilinks + relative markdown links, fragment-aware (external/absolute skipped)",
      edges: edges.length, link_occurrences: linkOccurrences, escaping_relative_links: escaping,
      reciprocated_edge_fraction: edges.length ? +(recip / edges.length).toFixed(3) : 0 },
    heavy_candidates: { thresholds: { p95, floor: floorH, tukey: +tukey.toFixed(1), rule: "candidate iff (in>=P95 && in>=floor) || in>=max(Q3+1.5*IQR, floor); calibration defaults, not truth" },
      nodes: heavyRoles, components: heavyComponents.map(c => ({ size: c.length, members: c })) },
    pagerank_tiebreaker: { note: "labeled TIEBREAKER only (authority tail ≈ in-degree tail on reciprocal wikilink graphs); d=0.85, tol 1e-6 L1, cap 100, dangling-mass redistributed", top: pageRankTop },
    bridge_candidates: bridgeCandidates,
    dialect: { top_tags: topTags.map(([t, n]) => ({ tag: t, n })), namespaced_tag_kinds: namespaced, total_tag_kinds: tagCount.size,
      filename_families: familyClusters },
    machine_tree_candidates: machineCandidates, inbox_candidates: inboxCandidates,
    hygiene: { case_fold_collisions: caseFold, duplicate_basenames: dupBase.slice(0, 30), long_paths_240: longPaths },
    orphans: { count: orphans.length, case_files: orphanCases, case_file_cap: 50 },
  };
  if (wantJson) { console.log(JSON.stringify(env, null, 2)); process.exit(exitCode); }
  const L = [];
  L.push(`map-scan — ${scanStatus} — ${files.length} files (${md.length} md), membership ${membershipFingerprint.slice(0, 12)}… md-bytes ${mdContentFingerprint.slice(0, 12)}…`);
  L.push(`  ownership: ${owned}/${md.length} owned · root ${declaredRoot ? `"${declaredRoot}" reached by ${chains.reached_declared_root}` : "NOT DECLARED"} · terminates-unowned ${chains.terminates_unowned} · unowned-self ${chains.unowned_self} · cycles ${chains.cycles.length} · dangling-owner ${chains.dangling_owner.length}`);
  L.push(`  graph: ${edges.length} dedup edges (${linkOccurrences} occurrences) · reciprocity ${env.graph.reciprocated_edge_fraction}`);
  const oc = env.resolution.occurrence_classes;
  L.push(`  resolution: ok ${oc["resolved-file"]}+h${oc["resolved-heading"]}+b${oc["resolved-block"]}+nm${oc["resolved-nonmarkdown"]} · missing file ${oc["missing-file"]} head ${oc["missing-heading"]} block ${oc["missing-block"]} · ambig ${oc["ambiguous"]} · accepted ${oc["accepted-external"] + oc["accepted-unresolved"]} · residual ${oc["residual-at-cap"]} · closed=${env.resolution.classes_closed}`);
  L.push(`  dialect rules: ${dialectRules.length} declared (${dialectErrors.length} errors) · creation-queue top: ${creationQueue[0] ? `${creationQueue[0].missing_target} (${creationQueue[0].inbound_occurrences})` : "—"}`);
  L.push(`  heavy: ${heavyRoles.length} candidates (P95=${p95}, floor=${floorH}) · components>=2: ${heavyComponents.length} · bridges: ${bridgeCandidates.length} · PR-top: ${pageRankTop[0] ? pageRankTop[0].path : "—"}`);
  L.push(`  entry points: ${entryPoints.length} · contract: ${contractSource || "none"} · orphans: ${orphans.length}`);
  L.push(`  dialect: ${tagCount.size} tag kinds (${namespaced} namespaced) · ${familyClusters.length} filename families`);
  L.push(`  candidates: machine-trees ${machineCandidates.length} · inbox/thread ${inboxCandidates.length}`);
  L.push(`  boundaries: skipped ${skipped.length} · system-excluded ${systemExcluded.length} (listed) · hygiene: case-fold ${caseFold.length} · dup basenames ${dupBase.length} · >240ch ${longPaths.length}`);
  for (const s of env.subtrees.slice(0, 12)) L.push(`    ${s.dir.padEnd(24)} md=${s.md} non-md=${s.non_md}`);
  console.log(L.join("\n"));
  process.exit(exitCode);
} catch (err) {
  fail(String(err && err.stack || err));
}
